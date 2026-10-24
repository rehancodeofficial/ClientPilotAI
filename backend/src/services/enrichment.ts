/**
 * Contact enrichment for a discovered lead.
 * ────────────────────────────────────────────────────────────────────────────
 * Discovery gives a name, a point on the map and — for a minority of
 * businesses — a phone number. Everything the product then does (outreach,
 * proposals, the website audit) needs more than that, so this module fills in
 * the rest from the two places it can be observed:
 *
 *   1. The OpenStreetMap tags already attached to the lead.
 *   2. The business's own website, which is resolved first if OSM does not
 *      name one (see ./websiteResolver), then read for an email address, a
 *      phone number and social profiles.
 *
 * Nothing here is inferred by a model: every field returned was either tagged
 * in OSM or found in the markup of a page, and each carries the source that
 * produced it so the UI can show the difference.
 */

import axios from 'axios';
import { isSafePublicUrl } from '../lib/security';
import { isPlatformHost, resolveWebsite, type WebsiteSource } from './websiteResolver';

export interface EnrichmentResult {
  email: string | null;
  phone: string | null;
  website: string | null;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  source: 'osm_tag' | 'website_homepage' | 'website_contact_page' | 'none';
  confidence: number;
  /** How the website itself was established, when there is one. */
  websiteSource: WebsiteSource | null;
  /** True when the site was reachable, so "no email" means "none published". */
  websiteReachable: boolean;
}

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/120.0.0.0 Safari/537.36 ClientPilotAI/1.0 (+https://clientpilotai.rehanhussain.dev)';

const PAGE_TIMEOUT_MS = Number(process.env.ENRICHMENT_PAGE_TIMEOUT_MS || 8_000);
/** Contact/about pages to follow from the homepage. */
const MAX_CONTACT_PAGES = Number(process.env.ENRICHMENT_MAX_CONTACT_PAGES || 2);

const SOCIAL_PATTERNS = {
  facebook: /https?:\/\/(?:www\.)?facebook\.com\/[A-Za-z0-9._%-]{2,}/i,
  instagram: /https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9._%-]{2,}/i,
  linkedin: /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[A-Za-z0-9._%-]{2,}/i,
  twitter: /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[A-Za-z0-9._%-]{2,}/i,
} as const;

/**
 * Local-parts that belong to a tool rather than to the business.
 *
 * Analytics and error-reporting snippets embed addresses in the page, and the
 * first regex match on a page is very often one of them — which is how a lead
 * ends up with "wordpress@example.com" as its outreach recipient.
 */
const NOISE_EMAIL_PATTERNS = [
  /@sentry\./i, /@wixpress\./i, /@(?:[a-z0-9-]+\.)?sentry\.io$/i,
  /^(?:no-?reply|donotreply|do-not-reply)@/i,
  /^(?:your(?:name|email)?|email|name|user|username|someone|somebody)@/i,
  /^(?:example|test|sample|demo|lorem|ipsum|placeholder)@/i,
  /@(?:example|test|sample|domain|yourdomain|yoursite|email|sentry|localhost)\./i,
  /@(?:example|localhost)$/i,
  /\.(?:png|jpe?g|gif|svg|webp|css|js|woff2?|ttf|ico|mp4|pdf)$/i,
  /^[a-f0-9]{16,}@/i,
];

/** Addresses that look like a real inbox for the business, best first. */
const EMAIL_PRIORITY = [
  /^(?:info|contact|hello|hi|enquir|inquir|sales|admin|office|reservations?|booking|order)/i,
  /^(?:support|help|care|service|team|mail)/i,
];

const normalizeUrl = (raw: string): string => {
  const cleaned = raw.trim().replace(/\s+/g, '');
  if (!cleaned) return '';
  return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
};

const decodeEntities = (value: string): string =>
  value
    .replace(/&amp;/gi, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));

/**
 * Pulls candidate addresses out of a page, best candidate first.
 *
 * `mailto:` links are read before the loose regex sweep: an address a site
 * deliberately links is the one it wants to be written to, whereas the first
 * bare match in the markup is as likely to belong to a tracking script.
 */
export function extractEmails(html: string): string[] {
  const candidates: string[] = [];

  const mailtoRegex = /mailto:([^"'?>\s]+)/gi;
  let mailtoMatch: RegExpExecArray | null;
  while ((mailtoMatch = mailtoRegex.exec(html)) !== null) {
    candidates.push(decodeEntities(mailtoMatch[1]));
  }

  const looseRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}/g;
  candidates.push(...(html.match(looseRegex) || []));

  const seen = new Set<string>();
  const clean = candidates
    .map((raw) => decodeEntities(raw).trim().replace(/^[.,;:<([]+|[.,;:>)\]]+$/g, '').toLowerCase())
    .filter((email) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24}$/.test(email))
    .filter((email) => !NOISE_EMAIL_PATTERNS.some((pattern) => pattern.test(email)))
    .filter((email) => {
      if (seen.has(email)) return false;
      seen.add(email);
      return true;
    });

  // Rank the generic business inboxes above a named individual's address.
  const rank = (email: string): number => {
    const local = email.split('@')[0];
    const index = EMAIL_PRIORITY.findIndex((pattern) => pattern.test(local));
    return index === -1 ? EMAIL_PRIORITY.length : index;
  };

  return clean.sort((a, b) => rank(a) - rank(b));
}

/**
 * Pulls a phone number out of a page.
 *
 * `tel:` links first, for the same reason as `mailto:`. The loose pattern it
 * falls back to is anchored on real dialling shapes — the previous one
 * (`\+?[0-9]{1,4}[-.\s]?[0-9]{1,10}[-.\s]?[0-9]{1,10}`) matched any two numbers
 * separated by a space, so it happily returned "2024 10" from a copyright line.
 */
export function extractPhone(html: string): string | null {
  const telRegex = /tel:([+0-9()\s.-]{7,25})/gi;
  let telMatch: RegExpExecArray | null;
  while ((telMatch = telRegex.exec(html)) !== null) {
    const candidate = telMatch[1].trim();
    if (countDigits(candidate) >= 7) return candidate;
  }

  const text = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');

  const patterns = [
    // International, e.g. +92 21 3453 4567 / +44 20 7123 4567
    /\+\d{1,3}[\s.-]?(?:\(?\d{1,4}\)?[\s.-]?){1,4}\d{2,4}/g,
    // Pakistani mobile, e.g. 0300 1234567 / 0300-1234567
    /\b0\d{2,3}[\s.-]?\d{7}\b/g,
    // Generic local, e.g. (021) 345-67890
    /\(\d{2,5}\)[\s.-]?\d{3,4}[\s.-]?\d{3,5}/g,
  ];

  for (const pattern of patterns) {
    for (const match of text.match(pattern) || []) {
      const digits = countDigits(match);
      // 7 digits is the shortest real subscriber number; more than 15 breaks
      // E.164 and is almost always an id, a timestamp or a price run together.
      if (digits >= 7 && digits <= 15) return match.replace(/\s+/g, ' ').trim();
    }
  }

  return null;
}

const countDigits = (value: string): number => (value.match(/\d/g) || []).length;

/** Fetches a page as text, or null when it is unusable. */
const fetchPage = async (url: string, timeoutMs = PAGE_TIMEOUT_MS): Promise<string | null> => {
  if (!isSafePublicUrl(url)) {
    console.warn(`[Enrichment] Skipped unsafe or private URL: ${url}`);
    return null;
  }

  try {
    const response = await axios.get<string>(url, {
      headers: {
        'User-Agent': BROWSER_UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: timeoutMs,
      maxRedirects: 3,
      maxContentLength: 2 * 1024 * 1024,
      maxBodyLength: 2 * 1024 * 1024,
      responseType: 'text',
      validateStatus: () => true,
    });

    if (response.status !== 200 || typeof response.data !== 'string') return null;
    return response.data;
  } catch (err: unknown) {
    console.warn(
      `[Enrichment] Could not read ${url}: ${err instanceof Error ? err.message : String(err)}`
    );
    return null;
  }
};

/** Collects social profile links found in a page. */
const collectSocials = (html: string, into: EnrichmentResult['socialLinks']): void => {
  for (const [platform, pattern] of Object.entries(SOCIAL_PATTERNS)) {
    const key = platform as keyof typeof SOCIAL_PATTERNS;
    if (into[key]) continue;
    const match = html.match(pattern);
    if (match) into[key] = match[0];
  }
};

/**
 * Finds the contact/about pages linked from a homepage.
 *
 * Most small-business sites publish the address on a contact page rather than
 * the homepage, and the old single-link version took whichever matching anchor
 * appeared first in the markup — usually a footer "About us" rather than
 * "Contact", so the page holding the address was never opened.
 */
const contactPageUrls = (html: string, baseUrl: string): string[] => {
  const anchors = /<a\s[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const scored: Array<{ url: string; score: number }> = [];
  const seen = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = anchors.exec(html)) !== null) {
    const href = decodeEntities(match[1].trim());
    const label = match[2].replace(/<[^>]+>/g, ' ').toLowerCase();
    if (!href || href.startsWith('#') || /^(?:mailto|tel|javascript):/i.test(href)) continue;

    const target = `${href.toLowerCase()} ${label}`;
    let score = 0;
    if (/contact|kontakt|reach-?us|get-?in-?touch/.test(target)) score = 3;
    else if (/about|impressum|team|company/.test(target)) score = 1;
    if (score === 0) continue;

    let resolved: string;
    try {
      resolved = new URL(href, baseUrl).toString();
    } catch {
      continue;
    }
    // Stay on the business's own site; an off-site "contact" link is a
    // directory listing, and its address is not this business's.
    try {
      if (new URL(resolved).hostname !== new URL(baseUrl).hostname) continue;
    } catch {
      continue;
    }

    if (seen.has(resolved)) continue;
    seen.add(resolved);
    scored.push({ url: resolved, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CONTACT_PAGES)
    .map((entry) => entry.url);
};

export interface EnrichLeadInput {
  /** Business name, used to resolve a website when OSM names none. */
  name?: string | null;
  websiteUrl?: string | null;
  rawOsmTags?: Record<string, unknown> | null;
  /** ISO country code, to prefer the right TLD when resolving a website. */
  countryCode?: string | null;
}

/**
 * Enriches contact details for a lead from its OSM tags and its website.
 *
 * Accepts either the structured input above or the older
 * `(websiteUrl, rawOsmTags)` argument pair, which existing callers still use.
 */
export const enrichLeadContact = async (
  input: EnrichLeadInput | string | null | undefined,
  legacyRawOsmTags?: Record<string, unknown> | null
): Promise<EnrichmentResult> => {
  const options: EnrichLeadInput =
    typeof input === 'string' || input === null || input === undefined
      ? { websiteUrl: input ?? null, rawOsmTags: legacyRawOsmTags ?? null }
      : input;

  const tags = options.rawOsmTags || {};
  const socialLinks: EnrichmentResult['socialLinks'] = {};

  let email: string | null = null;
  let phone: string | null = null;
  let source: EnrichmentResult['source'] = 'none';
  let confidence = 0;

  // ── 1. OpenStreetMap tags ───────────────────────────────────────────────
  const tagValue = (keys: string[]): string | null => {
    for (const key of keys) {
      const value = tags[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return null;
  };

  const taggedEmail = tagValue(['email', 'contact:email', 'email:official']);
  if (taggedEmail) {
    const [parsed] = extractEmails(taggedEmail);
    if (parsed) {
      email = parsed;
      source = 'osm_tag';
      confidence = 1;
    }
  }

  phone = tagValue(['phone', 'contact:phone', 'mobile', 'contact:mobile', 'phone:mobile']);

  for (const [platform, key] of [
    ['facebook', 'contact:facebook'],
    ['instagram', 'contact:instagram'],
    ['linkedin', 'contact:linkedin'],
    ['twitter', 'contact:twitter'],
  ] as const) {
    const value = tagValue([key, platform]);
    if (value) socialLinks[platform] = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  }

  // ── 2. The website: whichever OSM named, else resolve one ───────────────
  const resolved = await resolveWebsite({
    name: options.name || (typeof tags.name === 'string' ? tags.name : '') || '',
    knownUrl: options.websiteUrl,
    rawTags: tags,
    countryCode: options.countryCode,
  });

  const website = resolved?.url || null;
  const websiteSource = resolved?.source || null;

  if (!website) {
    return { email, phone, website: null, socialLinks, source, confidence, websiteSource, websiteReachable: false };
  }

  // ── 3. Read the site for anything still missing ─────────────────────────
  const homepageUrl = normalizeUrl(website);
  const homepage = await fetchPage(homepageUrl);

  if (!homepage) {
    return { email, phone, website, socialLinks, source, confidence, websiteSource, websiteReachable: false };
  }

  collectSocials(homepage, socialLinks);

  if (!email) {
    const [best] = extractEmails(homepage);
    if (best) {
      email = best;
      source = 'website_homepage';
      confidence = 0.8;
      console.log(`[Enrichment] Email on homepage of ${homepageUrl}: ${email}`);
    }
  }

  if (!phone) {
    phone = extractPhone(homepage);
  }

  // The contact page is where small sites actually publish the address, so it
  // is worth a second request whenever the homepage yielded nothing.
  if (!email) {
    for (const contactUrl of contactPageUrls(homepage, homepageUrl)) {
      const contactHtml = await fetchPage(contactUrl, Math.min(PAGE_TIMEOUT_MS, 6_000));
      if (!contactHtml) continue;

      collectSocials(contactHtml, socialLinks);
      if (!phone) phone = extractPhone(contactHtml);

      const [best] = extractEmails(contactHtml);
      if (best) {
        email = best;
        source = 'website_contact_page';
        confidence = 0.9;
        console.log(`[Enrichment] Email on contact page ${contactUrl}: ${email}`);
        break;
      }
    }
  }

  // A social profile is not the business's website, but it is still reach:
  // keep it in socialLinks and never let it masquerade as a site.
  const finalWebsite = isPlatformHost(website) ? null : website;

  return {
    email,
    phone,
    website: finalWebsite,
    socialLinks,
    source,
    confidence,
    websiteSource: finalWebsite ? websiteSource : null,
    websiteReachable: true,
  };
};
