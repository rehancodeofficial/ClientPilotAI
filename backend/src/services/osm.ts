import axios, { AxiosError } from 'axios';

const DEFAULT_NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const DEFAULT_OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];
const DEFAULT_APP_URL = 'https://clientpilotai.rehanhussain.dev';
/**
 * Nominatim's usage policy requires a User-Agent that identifies the
 * application and gives a way to contact its operator. The previous value
 * pointed at "clientpilotai.internal", which does not resolve — the shape of
 * identifier operators block rather than rate-limit. Override both with
 * OSM_USER_AGENT / OSM_APP_URL in the environment.
 */
const DEFAULT_USER_AGENT = `ClientPilotAI/1.0 (+${DEFAULT_APP_URL}; info@clientpilotai.com)`;
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_RADIUS_METERS = 50_000;

const NOMINATIM_URL = process.env.NOMINATIM_URL || DEFAULT_NOMINATIM_URL;
const OVERPASS_URLS = process.env.OVERPASS_URL
  ? [process.env.OVERPASS_URL, ...DEFAULT_OVERPASS_URLS.filter(url => url !== process.env.OVERPASS_URL)]
  : DEFAULT_OVERPASS_URLS;
const USER_AGENT = process.env.OSM_USER_AGENT || DEFAULT_USER_AGENT;
const APP_REFERER = process.env.OSM_APP_URL || DEFAULT_APP_URL;
const REQUEST_TIMEOUT_MS = Number(process.env.OSM_REQUEST_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);

/**
 * Per-mirror timeout for the Overpass race.
 *
 * Shorter than REQUEST_TIMEOUT_MS because the mirrors are queried in parallel:
 * the whole round costs one timeout rather than one per mirror, and the
 * Overpass query itself declares [out:json][timeout:25].
 */
const MIRROR_TIMEOUT_MS = Number(process.env.OSM_MIRROR_TIMEOUT_MS || 15_000);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Serialises Nominatim requests at no more than one per second.
 *
 * Nominatim's usage policy caps clients at 1 request/second and enforces it per
 * source IP. Discovery fires a geocode followed by one search per category
 * term, back to back — fine from a developer machine, but on shared hosting the
 * IP's budget is already partly spent by other tenants, so the burst comes back
 * 403/429 and the fallback produces nothing exactly when Overpass is down.
 */
const NOMINATIM_MIN_INTERVAL_MS = Number(process.env.NOMINATIM_MIN_INTERVAL_MS || 1100);
let nominatimChain: Promise<unknown> = Promise.resolve();

const throttleNominatim = <T>(task: () => Promise<T>): Promise<T> => {
  const result = nominatimChain.then(async () => {
    const value = await task();
    await delay(NOMINATIM_MIN_INTERVAL_MS);
    return value;
  });
  // Keep the chain alive even when a request rejects.
  nominatimChain = result.catch(() => undefined);
  return result;
};

// Simple in-memory cache with 1-hour TTL
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const discoveryCache = new Map<string, CacheEntry<NearbyBusinessSearchResult>>();

const getFromCache = (key: string): NearbyBusinessSearchResult | null => {
  const entry = discoveryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    discoveryCache.delete(key);
    return null;
  }
  return entry.data;
};

const setInCache = (key: string, data: NearbyBusinessSearchResult): void => {
  // Simple eviction if map grows too large
  if (discoveryCache.size > 2000) {
    const now = Date.now();
    for (const [k, v] of discoveryCache.entries()) {
      if (now > v.expiresAt) discoveryCache.delete(k);
    }
  }
  discoveryCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
};

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodeResult extends Coordinates {
  displayName: string;
  placeId?: number;
  osmType?: string;
  osmId?: number;
  boundingBox?: string[];
}

export interface NormalizedBusiness {
  osmId: string;
  osmType: 'node' | 'way' | 'relation';
  name: string;
  category: string;
  type: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  area?: string;
  phone?: string;
  website?: string;
  rawTags: Record<string, string>;
}

export interface NearbyBusinessSearchParams {
  lat: number;
  lng: number;
  radiusMeters?: number;
  categories?: string[];
  limit?: number;
}

export interface NearbyBusinessSearchResult {
  businesses: NormalizedBusiness[];
  center: Coordinates;
  radiusMeters: number;
  categories: string[];
}

type OsmElementType = 'node' | 'way' | 'relation';

type OverpassElement = {
  type: OsmElementType;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
};

type NominatimPlace = {
  place_id?: number;
  osm_type?: string;
  osm_id?: number;
  lat?: string;
  lon?: string;
  display_name?: string;
  boundingbox?: string[];
};

type OSMTagFilter = { key: string; value?: string; regex?: string };

const CATEGORY_FILTERS: Record<string, OSMTagFilter[]> = {
  restaurant: [{ key: 'amenity', value: 'restaurant' }, { key: 'amenity', value: 'fast_food' }],
  retail: [{ key: 'shop' }],
  salon: [{ key: 'shop', value: 'hairdresser' }, { key: 'shop', value: 'beauty' }, { key: 'amenity', value: 'beauty_salon' }],
  clinic: [{ key: 'amenity', value: 'clinic' }, { key: 'amenity', value: 'doctors' }, { key: 'healthcare' }],
  auto_service: [{ key: 'shop', value: 'car_repair' }, { key: 'amenity', value: 'car_wash' }, { key: 'shop', value: 'tyres' }],
  bakery: [{ key: 'shop', value: 'bakery' }],
  pharmacy: [{ key: 'amenity', value: 'pharmacy' }, { key: 'shop', value: 'chemist' }],
  tailor: [{ key: 'shop', value: 'tailor' }, { key: 'craft', value: 'tailor' }],
  cafe: [{ key: 'amenity', value: 'cafe' }],
  gym: [{ key: 'leisure', value: 'fitness_centre' }, { key: 'amenity', value: 'gym' }],
  electronics: [{ key: 'shop', value: 'electronics' }, { key: 'shop', value: 'computer' }, { key: 'shop', value: 'mobile_phone' }],
  jewellery: [{ key: 'shop', value: 'jewelry' }, { key: 'shop', value: 'jewellery' }],
  real_estate: [{ key: 'office', value: 'estate_agent' }],
  catering: [{ key: 'shop', value: 'caterer' }, { key: 'amenity', value: 'restaurant' }],
};

/**
 * Free-text search terms for the Nominatim fallback, per app category.
 *
 * Nominatim matches words, not OSM tag slugs: searching "salon" in Karachi
 * returns nothing while "hairdresser" returns a full page, and "auto_service"
 * returns one result where "car repair" returns ten. The fallback used to pass
 * the raw category slug straight through, so for most categories it silently
 * produced zero businesses — exactly when Overpass was down and it was the only
 * thing standing between the user and an empty search.
 */
const NOMINATIM_SEARCH_TERMS: Record<string, string[]> = {
  restaurant: ['restaurant', 'fast food'],
  retail: ['shop', 'store'],
  salon: ['hairdresser', 'beauty salon'],
  clinic: ['clinic', 'doctor'],
  auto_service: ['car repair', 'car wash'],
  bakery: ['bakery'],
  pharmacy: ['pharmacy', 'chemist'],
  tailor: ['tailor'],
  cafe: ['cafe', 'coffee shop'],
  gym: ['gym', 'fitness centre'],
  electronics: ['electronics shop', 'mobile phone shop'],
  jewellery: ['jewellery', 'jeweller'],
  real_estate: ['estate agent', 'real estate'],
  catering: ['caterer', 'catering'],
};

/** Expands app categories into terms Nominatim can match. */
const nominatimTermsFor = (categories: string[]): string[] => {
  if (categories.length === 0) {
    return ['restaurant', 'shop', 'cafe', 'clinic', 'bakery'];
  }
  const terms = categories.flatMap(
    (category) => NOMINATIM_SEARCH_TERMS[category.trim().toLowerCase()] ?? [category.replace(/_/g, ' ')]
  );
  return [...new Set(terms)];
};

const DEFAULT_BUSINESS_FILTERS: OSMTagFilter[] = [
  { key: 'shop' },
  { key: 'office' },
  { key: 'craft' },
  { key: 'healthcare' },
  { key: 'tourism', regex: 'hotel|guest_house|hostel|motel' },
  { key: 'amenity', regex: 'restaurant|cafe|fast_food|bar|pub|clinic|doctors|dentist|pharmacy|bank|fuel|car_wash|veterinary|marketplace|internet_cafe|childcare' },
  { key: 'leisure', regex: 'fitness_centre|sports_centre|dance' },
];

class OSMServiceError extends Error {
  constructor(message: string, public statusCode = 502) {
    super(message);
    this.name = 'OSMServiceError';
  }
}

export class OSMGeocodingError extends OSMServiceError {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode);
    this.name = 'OSMGeocodingError';
  }
}

export class OSMOverpassError extends OSMServiceError {
  constructor(message: string, statusCode = 502) {
    super(message, statusCode);
    this.name = 'OSMOverpassError';
  }
}

const toFiniteNumber = (value: unknown): number | null => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const clampRadius = (radiusMeters?: number): number => {
  const radius = Number(radiusMeters || 5_000);
  if (!Number.isFinite(radius) || radius < 100) return 5_000;
  return Math.min(Math.round(radius), MAX_RADIUS_METERS);
};

const normalizeCategories = (categories?: string[]): string[] =>
  [...new Set((categories || []).map(c => c.trim()).filter(Boolean))];

const requestHeaders = () => ({
  'User-Agent': USER_AGENT,
  'Referer': APP_REFERER,
  'Accept': 'application/json',
});

const axiosMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError;
    const status = ax.response?.status ? `HTTP ${ax.response.status}` : 'network error';
    return `${status}: ${ax.message}`;
  }
  return error instanceof Error ? error.message : String(error);
};

export const geocodeLocation = async (location: string): Promise<GeocodeResult> => {
  const query = location.trim();
  if (!query) throw new OSMGeocodingError('Location is required for geocoding');

  try {
    const response = await throttleNominatim(() =>
      axios.get<NominatimPlace[]>(NOMINATIM_URL, {
        params: { q: query, format: 'jsonv2', limit: 1, addressdetails: 1 },
        headers: requestHeaders(),
        timeout: REQUEST_TIMEOUT_MS,
      })
    );

    if (!Array.isArray(response.data)) {
      throw new OSMGeocodingError('Nominatim returned an invalid geocoding response', 502);
    }

    const place = response.data[0];
    if (!place) throw new OSMGeocodingError(`No coordinates found for location: ${query}`, 404);

    const lat = toFiniteNumber(place.lat);
    const lng = toFiniteNumber(place.lon);
    if (lat === null || lng === null) {
      throw new OSMGeocodingError('Nominatim response did not include valid coordinates', 502);
    }

    return {
      lat,
      lng,
      displayName: place.display_name || query,
      placeId: place.place_id,
      osmType: place.osm_type,
      osmId: place.osm_id,
      boundingBox: place.boundingbox,
    };
  } catch (error) {
    if (error instanceof OSMGeocodingError) throw error;
    throw new OSMGeocodingError(`Geocoding failed: ${axiosMessage(error)}`, 502);
  }
};

const sanitizeOverpassValue = (val: string): string =>
  val.replace(/["\\;]/g, '').trim();

const tagFilterToOverpass = (filter: OSMTagFilter): string => {
  const safeKey = sanitizeOverpassValue(filter.key);
  if (filter.regex) {
    const safeRegex = filter.regex.replace(/["\\;]/g, '');
    return `["${safeKey}"~"^(${safeRegex})$",i]`;
  }
  if (filter.value) {
    const safeValue = sanitizeOverpassValue(filter.value);
    return `["${safeKey}"="${safeValue}"]`;
  }
  return `["${safeKey}"]`;
};

const filtersForCategories = (categories: string[]): OSMTagFilter[] => {
  if (categories.length === 0) return DEFAULT_BUSINESS_FILTERS;

  const filters = categories.flatMap(category => {
    const cleanCat = sanitizeOverpassValue(category);
    if (!cleanCat) return [];
    if (CATEGORY_FILTERS[cleanCat]) return CATEGORY_FILTERS[cleanCat];
    if (cleanCat.includes('=')) {
      const [key, value] = cleanCat.split('=').map(part => sanitizeOverpassValue(part));
      return key && value ? [{ key, value }] : [];
    }
    return [
      { key: 'shop', value: cleanCat },
      { key: 'amenity', value: cleanCat },
      { key: 'office', value: cleanCat },
    ];
  });

  const seen = new Set<string>();
  return filters.filter(filter => {
    const id = `${filter.key}:${filter.value || ''}:${filter.regex || ''}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const buildOverpassQuery = (lat: number, lng: number, radiusMeters: number, categories: string[], limit = 50): string => {
  const filters = filtersForCategories(categories);
  const elementTypes: OsmElementType[] = ['node', 'way', 'relation'];
  const selectors = filters.flatMap(filter =>
    elementTypes.map(type => `  ${type}${tagFilterToOverpass(filter)}(around:${radiusMeters},${lat},${lng});`)
  );

  return `
[out:json][timeout:25];
(
${selectors.join('\n')}
);
out center ${limit};
`.trim();
};

const pickFirst = (tags: Record<string, string>, keys: string[]): string | undefined =>
  keys.map(key => tags[key]).find(value => typeof value === 'string' && value.trim().length > 0)?.trim();

const normalizeWebsite = (website?: string): string | undefined => {
  if (!website) return undefined;
  const trimmed = website.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const normalizeCategory = (tags: Record<string, string>): { category: string; type: string } => {
  if (tags.shop) return { category: tags.shop, type: 'shop' };
  if (tags.amenity) return { category: tags.amenity, type: 'amenity' };
  if (tags.office) return { category: tags.office, type: 'office' };
  if (tags.leisure) return { category: tags.leisure, type: 'leisure' };
  if (tags.healthcare) return { category: tags.healthcare, type: 'healthcare' };
  if (tags.craft) return { category: tags.craft, type: 'craft' };
  if (tags.tourism) return { category: tags.tourism, type: 'tourism' };
  return { category: 'business', type: 'place' };
};

const buildAddress = (tags: Record<string, string>): string => {
  const explicit = pickFirst(tags, ['addr:full', 'addr:place']);
  if (explicit) return explicit;

  const streetLine = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ').trim();
  const parts = [streetLine, tags['addr:suburb'], tags['addr:neighbourhood'], tags['addr:city']].filter(Boolean);
  return parts.join(', ');
};

const normalizeBusiness = (element: OverpassElement): NormalizedBusiness | null => {
  const tags = element.tags || {};
  const name = pickFirst(tags, ['name', 'brand', 'operator']);
  const lat = toFiniteNumber(element.lat ?? element.center?.lat);
  const lng = toFiniteNumber(element.lon ?? element.center?.lon);

  if (!name || lat === null || lng === null) return null;

  const { category, type } = normalizeCategory(tags);
  return {
    osmId: `${element.type}:${element.id}`,
    osmType: element.type,
    name,
    category,
    type,
    latitude: lat,
    longitude: lng,
    address: buildAddress(tags),
    city: pickFirst(tags, ['addr:city', 'addr:town', 'addr:village', 'addr:suburb', 'addr:district']) || '',
    area: pickFirst(tags, ['addr:suburb', 'addr:neighbourhood', 'addr:district']),
    phone: pickFirst(tags, ['phone', 'contact:phone', 'mobile', 'contact:mobile']),
    website: normalizeWebsite(pickFirst(tags, ['website', 'contact:website', 'url'])),
    rawTags: tags,
  };
};

export const searchNearbyBusinesses = async (
  params: NearbyBusinessSearchParams,
): Promise<NearbyBusinessSearchResult> => {
  const lat = toFiniteNumber(params.lat);
  const lng = toFiniteNumber(params.lng);
  if (lat === null || lng === null) throw new OSMOverpassError('Valid latitude and longitude are required', 400);

  const radiusMeters = clampRadius(params.radiusMeters);
  const categories = normalizeCategories(params.categories);
  const limit = Math.max(1, Math.min(params.limit || 50, 100));

  // 1. Check cache first
  const cacheKey = `${lat.toFixed(4)}:${lng.toFixed(4)}:${radiusMeters}:${categories.sort().join(',')}`;
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log(`[OSM Overpass] Cache hit for ${cacheKey} (${cached.businesses.length} leads)`);
    return cached;
  }

  const query = buildOverpassQuery(lat, lng, radiusMeters, categories, limit);
  const postData = `data=${encodeURIComponent(query)}`;

  /**
   * Queries every Overpass mirror at once and takes the first usable answer.
   *
   * The mirrors used to be tried one after another with a 30s timeout each, so
   * a single overloaded mirror delayed the next one and the worst case ran to
   * roughly three minutes before the fallback was even attempted — longer than
   * most proxies will hold a request open. Racing them means the search
   * succeeds whenever *any* mirror is healthy, in the time that mirror takes.
   */
  const askMirror = async (endpoint: string): Promise<NormalizedBusiness[]> => {
    const response = await axios.post<{ elements?: OverpassElement[] }>(endpoint, postData, {
      headers: {
        ...requestHeaders(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: MIRROR_TIMEOUT_MS,
    });

    if (!response.data || !Array.isArray(response.data.elements)) {
      throw new OSMOverpassError(`Mirror ${endpoint} returned no element list`, 502);
    }

    const seen = new Set<string>();
    return response.data.elements
      .map(normalizeBusiness)
      .filter((business): business is NormalizedBusiness => Boolean(business))
      .filter(business => {
        if (seen.has(business.osmId)) return false;
        seen.add(business.osmId);
        return true;
      })
      .slice(0, limit);
  };

  const RETRY_ROUNDS = 2;
  const BACKOFF_DELAYS = [1000, 3000];
  let lastError: unknown;
  const mirrorFailureLogs: string[] = [];
  // True when at least one mirror sent an HTTP response this round, even an
  // error one. A second round helps against "busy" replies (429/502/504); it
  // only doubles the wait when every mirror was unreachable, so in that case
  // the fallback is reached immediately instead.
  let anyMirrorResponded = false;

  for (let round = 0; round < RETRY_ROUNDS; round++) {
    if (round > 0) {
      const waitMs = BACKOFF_DELAYS[round - 1] || 2000;
      console.warn(`[OSM Overpass] Starting retry round ${round + 1} after ${waitMs}ms backoff...`);
      await delay(waitMs);
    }

    const attempts = OVERPASS_URLS.map(async (endpoint) => {
      try {
        const businesses = await askMirror(endpoint);
        // An empty result is a legitimate answer, but it must not beat a mirror
        // that is still working on a real one, so treat it as a soft failure
        // and let the round fall through to the slower mirrors.
        if (businesses.length === 0) {
          anyMirrorResponded = true;
          throw new OSMOverpassError(`Mirror ${endpoint} returned 0 businesses`, 404);
        }
        return { endpoint, businesses };
      } catch (error) {
        let statusText = 'network error / timeout';
        let responseBodyPreview = 'no response';

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status) {
            statusText = `HTTP ${status}`;
            anyMirrorResponded = true;
          }
          if (error.response?.data) {
            const rawBody = typeof error.response.data === 'string'
              ? error.response.data
              : JSON.stringify(error.response.data);
            responseBodyPreview = rawBody.slice(0, 300).replace(/\s+/g, ' ');
          }

          // A 400 is a query syntax error: no mirror will accept it, and
          // retrying wastes the user's time.
          if (status === 400) {
            console.error(`[OSM Overpass] Mirror ${endpoint} returned 400 syntax error: ${responseBodyPreview}`);
            throw new OSMOverpassError(`Invalid Overpass query format: ${responseBodyPreview}`, 400);
          }
        } else if (error instanceof Error) {
          statusText = error.name;
          responseBodyPreview = error.message;
        }

        const logMsg = `Mirror [${endpoint}] failed (Round ${round + 1}): ${statusText} - Response body: "${responseBodyPreview}"`;
        console.warn(`[OSM Overpass] ${logMsg}`);
        mirrorFailureLogs.push(logMsg);
        lastError = error;
        throw error;
      }
    });

    try {
      const winner = await Promise.any(attempts);
      console.log(
        `[OSM Overpass] ${winner.businesses.length} businesses from ${winner.endpoint} (round ${round + 1}).`
      );
      const result: NearbyBusinessSearchResult = {
        businesses: winner.businesses,
        center: { lat, lng },
        radiusMeters,
        categories,
      };
      setInCache(cacheKey, result);
      return result;
    } catch (aggregate: unknown) {
      // Promise.any rejects only when every mirror failed. A query syntax error
      // is final, so surface it instead of retrying the whole round.
      const errors = aggregate instanceof AggregateError ? aggregate.errors : [aggregate];
      const syntaxError = errors.find(
        (err): err is OSMOverpassError => err instanceof OSMOverpassError && err.statusCode === 400
      );
      if (syntaxError) throw syntaxError;

      if (!anyMirrorResponded) {
        console.warn(
          '[OSM Overpass] No mirror answered at all; skipping further rounds and going straight to the fallback.'
        );
        break;
      }
    }
  }

  // Graceful fallback to Nominatim when Overpass mirrors are unavailable or rate-limited
  const fallbackNotes: string[] = [];
  try {
    console.warn('[OSM Overpass] Overpass mirrors exhausted; attempting fallback to Nominatim search...');
    const fallbackResult = await searchNearbyBusinessesViaNominatim(params, fallbackNotes);
    if (fallbackResult.businesses.length > 0) {
      console.log(`[OSM Nominatim] Fallback recovered ${fallbackResult.businesses.length} businesses.`);
      setInCache(cacheKey, fallbackResult);
      return fallbackResult;
    }
    console.warn(
      `[OSM Nominatim] Fallback matched nothing. ${fallbackNotes.join(' | ') || 'no diagnostics recorded'}`
    );
  } catch (fallbackError) {
    const reason = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
    console.warn('[OSM Overpass] Nominatim fallback also failed:', reason);
    fallbackNotes.push(reason);
  }

  // Only a query-syntax failure is worth surfacing verbatim; the soft "mirror
  // returned 0 businesses" rejection must not reach the user as the headline.
  if (lastError instanceof OSMOverpassError && lastError.statusCode === 400) throw lastError;

  console.error('[OSM Overpass] All Overpass mirrors and retries failed:\n' + mirrorFailureLogs.join('\n'));
  // The fallback's reason is included deliberately: without it a blocked IP, a
  // rate limit and a genuinely empty area are indistinguishable from the
  // browser, which is what made the production failure hard to diagnose.
  const detail = fallbackNotes.length > 0 ? ` Backup search: ${fallbackNotes.join('; ')}.` : '';
  throw new OSMOverpassError(
    'OpenStreetMap\'s search servers are all busy right now, so no businesses could be fetched. ' +
      'This is an outage on their side, not a problem with your account — please try again in a few minutes.' +
      detail,
    503
  );
};

export const searchNearbyBusinessesViaNominatim = async (
  params: NearbyBusinessSearchParams,
  /** Optional sink for per-term outcomes, used to explain an empty result. */
  notes?: string[],
): Promise<NearbyBusinessSearchResult> => {
  const lat = toFiniteNumber(params.lat);
  const lng = toFiniteNumber(params.lng);
  if (lat === null || lng === null) throw new OSMOverpassError('Valid latitude and longitude are required', 400);

  const radiusMeters = clampRadius(params.radiusMeters);
  const categories = normalizeCategories(params.categories);
  const limit = Math.max(1, Math.min(params.limit || 100, 250));

  const latDelta = radiusMeters / 111000;
  const lngDelta = radiusMeters / (111000 * Math.max(0.1, Math.cos((lat * Math.PI) / 180)));
  const minLng = lng - lngDelta;
  const maxLat = lat + latDelta;
  const maxLng = lng + lngDelta;
  const minLat = lat - latDelta;
  const viewbox = `${minLng.toFixed(5)},${maxLat.toFixed(5)},${maxLng.toFixed(5)},${minLat.toFixed(5)}`;

  const queryTerms = nominatimTermsFor(categories);
  const seen = new Set<string>();
  const businesses: NormalizedBusiness[] = [];

  for (const term of queryTerms.slice(0, 3)) {
    try {
      const response = await throttleNominatim(() => axios.get<Array<{
        place_id?: number;
        osm_type?: string;
        osm_id?: number;
        lat?: string;
        lon?: string;
        display_name?: string;
        name?: string;
        category?: string;
        type?: string;
        address?: Record<string, string>;
      }>>(NOMINATIM_URL, {
        params: {
          q: term,
          viewbox,
          bounded: 1,
          format: 'jsonv2',
          addressdetails: 1,
          limit: Math.min(limit, 30),
        },
        headers: requestHeaders(),
        // Nominatim is the last line of defence; 8s was short enough to time
        // out under the same load that takes Overpass down.
        timeout: 15_000,
      }));

      if (Array.isArray(response.data)) {
        for (const place of response.data) {
          const pLat = toFiniteNumber(place.lat);
          const pLng = toFiniteNumber(place.lon);
          const pName = place.name || place.display_name?.split(',')[0]?.trim();
          const osmId = `${place.osm_type || 'node'}:${place.osm_id || place.place_id}`;

          if (!pName || pLat === null || pLng === null || seen.has(osmId)) continue;
          seen.add(osmId);

          const addr = place.address || {};
          const street = [addr.house_number, addr.road].filter(Boolean).join(' ').trim();
          const city = addr.city || addr.town || addr.village || addr.county || '';
          const area = addr.suburb || addr.neighbourhood || addr.quarter;
          const address = [street, area, city].filter(Boolean).join(', ') || place.display_name || '';

          businesses.push({
            osmId,
            osmType: (place.osm_type as 'node' | 'way' | 'relation') || 'node',
            name: pName,
            category: place.category || term,
            type: place.type || term,
            latitude: pLat,
            longitude: pLng,
            address,
            city,
            area,
            rawTags: {
              name: pName,
              ...(place.category ? { [place.category]: place.type || '' } : {}),
            },
          });

          if (businesses.length >= limit) break;
        }
      }
    } catch (error: unknown) {
      // Log and continue to the next term. Swallowing this silently made a
      // failing fallback indistinguishable from an area with no businesses.
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const reason = status
        ? `HTTP ${status}`
        : error instanceof Error
          ? error.message
          : String(error);
      console.warn(`[OSM Nominatim] Term "${term}" failed: ${reason}`);
      notes?.push(`"${term}": ${reason}`);
    }
    if (businesses.length >= limit) break;
  }

  if (businesses.length === 0 && notes && notes.length === 0) {
    notes.push(`no matches for [${queryTerms.slice(0, 3).join(', ')}] inside the search area`);
  }

  return { businesses, center: { lat, lng }, radiusMeters, categories };
};

export const discoverBusinessesByLocation = async (params: {
  location: string;
  radiusMeters?: number;
  categories?: string[];
  limit?: number;
}): Promise<NearbyBusinessSearchResult & { geocodedLocation: GeocodeResult }> => {
  const geocodedLocation = await geocodeLocation(params.location);
  const result = await searchNearbyBusinesses({
    lat: geocodedLocation.lat,
    lng: geocodedLocation.lng,
    radiusMeters: params.radiusMeters,
    categories: params.categories,
    limit: params.limit,
  });

  return { ...result, geocodedLocation };
};

// Backwards-compatible alias for older route code. Prefer searchNearbyBusinesses for new usage.
export const queryOverpass = async (
  lat: number,
  lng: number,
  radiusMeters: number,
  categories: string[],
): Promise<NormalizedBusiness[]> => {
  const result = await searchNearbyBusinesses({ lat, lng, radiusMeters, categories });
  return result.businesses;
};
