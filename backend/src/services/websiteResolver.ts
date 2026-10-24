/**
 * Website resolution for discovered leads.
 * ────────────────────────────────────────────────────────────────────────────
 * OpenStreetMap is the only discovery source, and it records a `website` tag
 * for roughly one business in six. The rest arrive looking like businesses
 * with no web presence at all, which is wrong in two expensive ways: the user
 * pitches "you have no website" to someone who does, and the lead's real site —
 * the thing the audit and the outreach are built on — is never examined.
 *
 * This module answers "does this business have a website, and which one" from
 * three sources, in descending order of certainty:
 *
 *   1. The OSM tags themselves (`website`, `contact:website`, …).
 *   2. Wikidata's official-website claim (P856), reachable from the
 *      `wikidata` / `brand:wikidata` tags that chains and larger venues carry.
 *   3. A small set of candidate domains built from the business name, each
 *      fetched and then *verified* to mention the business before it is
 *      accepted.
 *
 * Step 3 is a guess, so it is never taken on trust: an unverified candidate is
 * discarded rather than stored. Everything returned carries the source and a
 * confidence so the UI can tell an observed fact from an inference.
 */

import axios from 'axios';
import { isSafePublicUrl } from '../lib/security';

export type WebsiteSource = 'osm_tag' | 'wikidata' | 'domain_match';

export interface ResolvedWebsite {
  url: string;
  source: WebsiteSource;
  confidence: number;
}

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/120.0.0.0 Safari/537.36 ClientPilotAI/1.0 (+https://clientpilotai.rehanhussain.dev)';

const PROBE_TIMEOUT_MS = Number(process.env.WEBSITE_PROBE_TIMEOUT_MS || 6_000);
const MAX_DOMAIN_PROBES = Number(process.env.WEBSITE_MAX_DOMAIN_PROBES || 10);
const ENABLE_DOMAIN_GUESS = process.env.WEBSITE_DOMAIN_GUESS !== 'false';

/**
 * Hosts that are somebody else's platform, not the business's own website.
 *
 * A Facebook page or a Zomato listing is a real signal, but treating it as
 * "this business has a website" would hide exactly the leads the product
 * exists to find. These are recorded as social/listing presence elsewhere.
 */
const NON_WEBSITE_HOSTS = [
  'facebook.com', 'fb.com', 'fb.me', 'instagram.com', 'twitter.com', 'x.com',
  'linkedin.com', 'tiktok.com', 'youtube.com', 'youtu.be', 'pinterest.com',
  'wa.me', 'whatsapp.com', 't.me', 'telegram.me', 'snapchat.com',
  'google.com', 'goo.gl', 'maps.app.goo.gl', 'business.site', 'g.page',
  'yelp.com', 'tripadvisor.com', 'tripadvisor.co.uk', 'zomato.com',
  'foodpanda.pk', 'foodpanda.com', 'ubereats.com', 'deliveroo.co.uk',
  'justeat.co.uk', 'doordash.com', 'grubhub.com', 'opentable.com',
  'booking.com', 'airbnb.com', 'agoda.com', 'expedia.com', 'hotels.com',
  'olx.com.pk', 'daraz.pk', 'amazon.com', 'ebay.com', 'etsy.com',
  'linktr.ee', 'bit.ly', 'wixsite.com', 'blogspot.com', 'wordpress.com',
  'justdial.com', 'yellowpages.com', 'bbb.org', 'trustpilot.com',
];

/** Phrases that mark a parked or for-sale domain rather than a live business. */
const PARKED_MARKERS = [
  'this domain is for sale', 'domain is for sale', 'buy this domain',
  'domain for sale', 'parked free', 'courtesy of godaddy', 'sedoparking',
  'this web page is parked', 'future home of something quite cool',
  'website coming soon', 'under construction', 'default web site page',
  'apache2 ubuntu default page', 'welcome to nginx', 'index of /',
];

/**
 * Name words that identify no business in particular.
 *
 * "Al Harmain Restaurant" has to resolve against "alharmain", not
 * "alharmainrestaurant" — and "Restaurant" alone must never become a candidate
 * domain, or every unnamed eatery in the area would resolve to the same site.
 */
const GENERIC_NAME_WORDS = new Set([
  'the', 'and', 'of', 'a', 'an', 'at', 'on', 'in', 'for', 'by', 'de', 'la', 'el',
  'restaurant', 'restaurants', 'resturant', 'cafe', 'caffe', 'coffee', 'bakery',
  'bakers', 'hotel', 'motel', 'hostel', 'guesthouse', 'bar', 'pub', 'bistro',
  'grill', 'bbq', 'barbeque', 'kitchen', 'foods', 'food', 'eatery', 'diner',
  'shop', 'shoppe', 'store', 'mart', 'market', 'supermarket', 'superstore',
  'pharmacy', 'chemist', 'medical', 'medicos', 'clinic', 'hospital', 'dental',
  'dentist', 'doctor', 'doctors', 'surgery', 'lab', 'laboratory',
  'salon', 'saloon', 'parlour', 'parlor', 'beauty', 'spa', 'barber',
  'hairdresser', 'studio', 'gym', 'fitness', 'centre', 'center', 'club',
  'tailor', 'tailors', 'boutique', 'collection', 'collections', 'fabrics',
  'jewellers', 'jewellery', 'jewelry', 'electronics', 'mobile', 'mobiles',
  'computers', 'traders', 'trading', 'enterprises', 'company', 'co', 'corp',
  'inc', 'llc', 'ltd', 'limited', 'pvt', 'private', 'sons', 'brothers', 'bros',
  'service', 'services', 'solutions', 'group', 'point', 'house', 'home',
  'workshop', 'garage', 'motors', 'auto', 'autos', 'carwash', 'repair',
  'new', 'old', 'best', 'royal', 'star', 'king', 'queen', 'city', 'town',
]);

/** Country-code TLDs worth trying, keyed by ISO country code. */
const CCTLD_BY_COUNTRY: Record<string, string[]> = {
  pk: ['com.pk', 'pk'],
  in: ['in', 'co.in'],
  gb: ['co.uk', 'uk'],
  uk: ['co.uk', 'uk'],
  ae: ['ae'],
  sa: ['com.sa', 'sa'],
  us: [],
  ca: ['ca'],
  au: ['com.au'],
  de: ['de'],
  fr: ['fr'],
  es: ['es'],
  it: ['it'],
  nl: ['nl'],
  bd: ['com.bd'],
  lk: ['lk'],
  my: ['com.my'],
  sg: ['com.sg'],
  za: ['co.za'],
  ng: ['com.ng'],
  ke: ['co.ke'],
  eg: ['com.eg'],
  tr: ['com.tr'],
};

const hostOf = (url: string): string => {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
};

/** True when the host is a platform or directory rather than an own website. */
export const isPlatformHost = (url: string): boolean => {
  const host = hostOf(url);
  if (!host) return true;
  return NON_WEBSITE_HOSTS.some((bad) => host === bad || host.endsWith(`.${bad}`));
};

const normalizeUrl = (raw: string): string => {
  const cleaned = raw.trim().replace(/\s+/g, '');
  if (!cleaned) return '';
  const withScheme = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
  try {
    const parsed = new URL(withScheme);
    // Strip tracking noise, keep the path: a store-locator URL is still the
    // business's site and the audit should see the page OSM pointed at.
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return '';
  }
};

const tagValue = (tags: Record<string, unknown>, keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = tags[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return undefined;
};

/** Strips diacritics and punctuation, yielding lowercase latin words. */
const nameTokens = (name: string): string[] =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

/**
 * Words that actually identify this business, generic trade words removed.
 * Empty when the name is entirely generic or not in a latin script.
 */
const distinctiveTokens = (name: string): string[] => {
  const tokens = nameTokens(name);
  const distinctive = tokens.filter((token) => !GENERIC_NAME_WORDS.has(token) && token.length > 1);
  return distinctive.length > 0 ? distinctive : [];
};

// ── 1. Wikidata ────────────────────────────────────────────────────────────

const WIKIDATA_API = process.env.WIKIDATA_API_URL || 'https://www.wikidata.org/w/api.php';

/** Letters and digits only, for comparing names across scripts and spacing. */
const squash = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

/**
 * True when a Wikidata entity plausibly *is* this business.
 *
 * Satisfied when the squashed business name contains one of the entity's
 * labels or aliases, or vice versa — enough to accept "Pizza Hut" against the
 * label "Pizza Hut" and "KFC Gulshan" against "KFC", while rejecting an
 * entity about a Dutch municipality.
 */
const entityMatchesName = (entity: WikidataEntity | undefined, businessName: string): boolean => {
  if (!entity) return false;

  const names = [
    ...Object.values(entity.labels || {}).map((label) => label?.value),
    ...Object.values(entity.aliases || {}).flatMap((group) =>
      (group || []).map((alias) => alias?.value)
    ),
  ]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .map(squash)
    .filter((value) => value.length >= 3);

  if (names.length === 0) return false;

  const target = squash(businessName);
  if (target.length < 3) return false;

  return names.some((name) => target.includes(name) || name.includes(target));
};

type WikidataSnak = {
  mainsnak?: { datavalue?: { value?: unknown } };
  rank?: string;
  qualifiers?: Record<string, Array<{ datavalue?: { value?: { id?: string } } }>>;
};

type WikidataEntity = {
  claims?: Record<string, WikidataSnak[]>;
  labels?: Record<string, { value?: string }>;
  aliases?: Record<string, Array<{ value?: string }>>;
};

/**
 * Reads the official-website claim (P856) for a Wikidata entity.
 *
 * The entity's own labels and aliases are fetched alongside the claim and
 * checked against the business name. OSM `wikidata` tags are hand-entered and
 * sometimes point at the wrong entity entirely — a mis-tagged shop would
 * otherwise be handed an unrelated company's website at high confidence, which
 * is worse than reporting no website at all.
 *
 * Chains list one site per country, so the candidates are ranked by how well
 * their TLD matches where the business actually is — otherwise a Karachi Pizza
 * Hut resolves to pizzahut.com rather than pizzahut.com.pk.
 */
export const websiteFromWikidata = async (
  entityId: string,
  countryCode?: string | null,
  businessName?: string
): Promise<string | null> => {
  const id = entityId.trim().toUpperCase();
  if (!/^Q\d+$/.test(id)) return null;

  try {
    const response = await axios.get<{ entities?: Record<string, WikidataEntity> }>(WIKIDATA_API, {
      params: {
        action: 'wbgetentities',
        ids: id,
        props: 'claims|labels|aliases',
        format: 'json',
        origin: '*',
      },
      headers: { 'User-Agent': BROWSER_UA, Accept: 'application/json' },
      timeout: PROBE_TIMEOUT_MS,
    });

    const entity = response.data?.entities?.[id];

    if (businessName && !entityMatchesName(entity, businessName)) {
      console.warn(
        `[WebsiteResolver] Wikidata ${id} does not match "${businessName}" — ignoring its website claim.`
      );
      return null;
    }

    const claims = entity?.claims?.P856 || [];
    const urls = claims
      .map((claim) => claim.mainsnak?.datavalue?.value)
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map(normalizeUrl)
      .filter((url) => url && !isPlatformHost(url) && isSafePublicUrl(url));

    if (urls.length === 0) return null;

    const cc = (countryCode || '').toLowerCase();
    const preferredTlds = CCTLD_BY_COUNTRY[cc] || (cc ? [cc] : []);
    const localMatch = urls.find((url) => {
      const host = hostOf(url);
      return preferredTlds.some((tld) => host.endsWith(`.${tld}`));
    });

    return localMatch || urls[0];
  } catch (err: unknown) {
    console.warn(
      `[WebsiteResolver] Wikidata lookup failed for ${id}: ${err instanceof Error ? err.message : err}`
    );
    return null;
  }
};

// ── 2. Candidate domains, verified ─────────────────────────────────────────

/**
 * Builds the domains worth probing for a business name, best guess first.
 *
 * Only names with two or more distinctive words are guessed at. A single-word
 * name is not enough evidence: probing "Kaiser Restaurant" lands on kaiser.com
 * and "Qadri Fast Food" on qadri.com, both of which mention the word and
 * neither of which is the business. Attaching a stranger's site to a lead is
 * worse than reporting no website — the user pitches the wrong company and the
 * audit grades the wrong pages — so recall is given up here for precision, and
 * a business whose site OSM has not recorded is simply reported as having
 * none.
 *
 * Within that, several stems are tried, because a business rarely registers
 * its full signage: "Ginsoy Extreme Chinese" trades at ginsoy.com while "Al
 * Harmain Restaurant" needs both words joined.
 */
export const candidateDomains = (name: string, countryCode?: string | null): string[] => {
  const distinctive = distinctiveTokens(name);
  if (distinctive.length < 2) return [];

  const joined = distinctive.join('');
  // Three characters identifies nothing; probing it would attach an unrelated
  // site to the lead, which is worse than reporting no website.
  if (joined.length < 6) return [];

  const stems = [
    // The whole name as written, connectives included: "Walkers of Whitehall"
    // registers walkersofwhitehall.com, which dropping "of" never reaches.
    nameTokens(name).join(''),
    joined,
    distinctive.slice(0, 2).join(''),
    distinctive[0],
    distinctive.join('-'),
  ].filter((stem, index, all) => stem.length >= 4 && stem.length <= 40 && all.indexOf(stem) === index);

  const cc = (countryCode || '').toLowerCase();
  const ccTlds = CCTLD_BY_COUNTRY[cc] || [];
  // `.com` goes in ahead of the secondary country TLD: it is the likelier
  // registration almost everywhere, and the probes are capped.
  const tlds = [...new Set([ccTlds[0], 'com', ...ccTlds.slice(1), 'net'].filter(Boolean))] as string[];

  // Ordered by TLD first, then by stem. Walking stem-first spent the whole
  // probe budget putting the full signage name on four different TLDs, so a
  // business trading on its leading word alone was never reached.
  const domains: string[] = [];
  for (const tld of tlds) {
    for (const stem of stems) {
      domains.push(`${stem}.${tld}`);
      if (domains.length >= MAX_DOMAIN_PROBES) return domains;
    }
  }
  return domains;
};

/**
 * Fetches a candidate domain and decides whether it really is this business.
 *
 * Three things have to hold, and each one was added because its absence
 * produced a confidently wrong answer:
 *
 *   • The page must still be served from the domain that was guessed. Letting
 *     redirects through accepted biryani.com.pk → digitalpakistan.org as the
 *     website of "Biryani Of The Seas".
 *   • *Every* distinctive word of the business name must appear on the page,
 *     not merely one. Matching a single word gave quetta.net — a city portal —
 *     to "New Quetta al-Hafiz Restaurant".
 *   • At least one of those words must appear in the title or site name,
 *     rather than only somewhere in the body, where a passing mention in a
 *     footer or a blog roll would otherwise count as proof.
 *
 * A domain that merely resolves proves nothing: half the short names in the
 * world answer with a placeholder.
 */
const verifyCandidate = async (
  domain: string,
  distinctive: string[]
): Promise<string | null> => {
  const url = `https://${domain}`;
  if (!isSafePublicUrl(url)) return null;

  try {
    const response = await axios.get<string>(url, {
      headers: { 'User-Agent': BROWSER_UA, Accept: 'text/html,application/xhtml+xml' },
      timeout: PROBE_TIMEOUT_MS,
      maxRedirects: 3,
      maxContentLength: 1024 * 1024,
      maxBodyLength: 1024 * 1024,
      responseType: 'text',
      validateStatus: () => true,
    });

    if (response.status !== 200 || typeof response.data !== 'string') return null;

    const contentType = String(response.headers['content-type'] || '');
    if (contentType && !contentType.includes('html')) return null;

    const finalUrl = normalizeUrl(
      (response.request?.res?.responseUrl as string | undefined) || url
    );
    if (!finalUrl || isPlatformHost(finalUrl)) return null;

    // The guess was the domain, so a redirect to a different one means the
    // guess was wrong, however relevant the page it landed on looks.
    const finalHost = hostOf(finalUrl);
    if (finalHost !== domain && !finalHost.endsWith(`.${domain}`)) return null;

    const html = response.data;
    const haystack = html.slice(0, 200_000).toLowerCase();
    if (PARKED_MARKERS.some((marker) => haystack.includes(marker))) return null;

    // Compare on letters only, so "Al-Harmain" in the page matches "alharmain".
    const squashed = haystack.replace(/[^a-z0-9]+/g, '');
    // Words of one or two letters ("Al", "Of") are not evidence on their own
    // and are not required; everything longer has to be there.
    const required = distinctive.filter((token) => token.length >= 3);
    if (required.length === 0) return null;
    if (!required.every((token) => squashed.includes(token))) return null;

    const titleText = [
      ...(html.match(/<title[^>]*>([\s\S]{0,300}?)<\/title>/i) || []).slice(1),
      ...(html.match(
        /<meta[^>]+(?:property|name)\s*=\s*["'](?:og:site_name|og:title|application-name)["'][^>]*content\s*=\s*["']([^"']{0,300})["']/i
      ) || []).slice(1),
      ...(html.match(/<h1[^>]*>([\s\S]{0,300}?)<\/h1>/i) || []).slice(1),
    ]
      .join(' ')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');

    if (!required.some((token) => titleText.includes(token))) return null;

    return finalUrl;
  } catch {
    return null;
  }
};

// ── Entry point ────────────────────────────────────────────────────────────

export interface ResolveWebsiteInput {
  name: string;
  knownUrl?: string | null;
  rawTags?: Record<string, unknown> | null;
  countryCode?: string | null;
}

/**
 * Finds the business's own website, or null when there is genuinely no
 * evidence of one. A platform URL (Facebook page, delivery listing) is not a
 * website for this purpose and is rejected at every step.
 */
export const resolveWebsite = async (
  input: ResolveWebsiteInput
): Promise<ResolvedWebsite | null> => {
  const tags = input.rawTags || {};

  // 1. Whatever OSM already told us.
  const tagged =
    (input.knownUrl && input.knownUrl.trim()) ||
    tagValue(tags, [
      'website',
      'contact:website',
      'url',
      'website:official',
      'brand:website',
      'operator:website',
    ]);

  if (tagged) {
    const url = normalizeUrl(tagged);
    if (url && isSafePublicUrl(url) && !isPlatformHost(url)) {
      return { url, source: 'osm_tag', confidence: 1 };
    }
  }

  const countryCode =
    input.countryCode ||
    (typeof tags['addr:country'] === 'string' ? (tags['addr:country'] as string) : null);

  // 2. Wikidata's official website, for anything linked to an entity.
  const entityId = tagValue(tags, ['brand:wikidata', 'wikidata', 'operator:wikidata']);
  if (entityId) {
    const fromWikidata = await websiteFromWikidata(entityId, countryCode, input.name);
    if (fromWikidata) {
      return { url: fromWikidata, source: 'wikidata', confidence: 0.9 };
    }
  }

  // 3. Verified name-based domains.
  if (!ENABLE_DOMAIN_GUESS) return null;

  const distinctive = distinctiveTokens(input.name);
  if (distinctive.length === 0) return null;

  for (const domain of candidateDomains(input.name, countryCode)) {
    const verified = await verifyCandidate(domain, distinctive);
    if (verified) {
      console.log(`[WebsiteResolver] "${input.name}" → ${verified} (verified candidate domain)`);
      return { url: verified, source: 'domain_match', confidence: 0.6 };
    }
  }

  return null;
};
