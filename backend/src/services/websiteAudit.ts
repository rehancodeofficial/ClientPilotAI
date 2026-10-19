/**
 * Website Audit Engine
 * ────────────────────────────────────────────────────────────────────────────
 * A deterministic, evidence-based technical audit of a public website.
 *
 * Nothing here is AI-generated or guessed: every point awarded or deducted maps
 * to an observable fact about the page (a header that was returned, a tag that
 * was present, a byte count that was measured). The result is a 0-100 score, a
 * letter grade, seven category scores and a prioritised list of concrete issues
 * with the fix for each one.
 *
 * The engine issues at most four network requests per audit — the homepage over
 * HTTPS (or HTTP when that is all that is offered), the plain-HTTP origin to
 * check for an upgrade redirect, /robots.txt and /sitemap.xml — all bounded by
 * timeouts and response size limits, and all behind the SSRF guard in
 * ../lib/security.
 */

import axios, { AxiosResponse } from 'axios';
import { isSafePublicUrl } from '../lib/security';

// ─── Public types ─────────────────────────────────────────────────────────────

export type AuditCategory =
  | 'performance'
  | 'seo'
  | 'security'
  | 'mobile'
  | 'accessibility'
  | 'content'
  | 'conversion';

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface WebsiteAuditIssue {
  /** Stable identifier — safe to use as a React key or to suppress a rule. */
  id: string;
  category: AuditCategory;
  severity: IssueSeverity;
  /** What is wrong, in one line the business owner can understand. */
  title: string;
  /** What was actually observed on the page. */
  detail: string;
  /** The concrete fix. */
  recommendation: string;
  /** Points deducted from this issue's category (0-100 scale). */
  points: number;
}

export interface WebsiteAuditCategoryScore {
  category: AuditCategory;
  label: string;
  /** 0-100 for this category alone. */
  score: number;
  /** Share of the overall score, in percent. The seven weights sum to 100. */
  weight: number;
  grade: WebsiteGrade;
  checksPassed: number;
  checksTotal: number;
}

export type WebsiteGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface WebsiteAuditMetrics {
  /** Time to first byte of the homepage response, in milliseconds. */
  ttfbMs: number | null;
  /** Wall-clock time to download the full homepage HTML, in milliseconds. */
  loadMs: number | null;
  htmlBytes: number | null;
  wordCount: number;
  imageCount: number;
  imagesWithAlt: number;
  imagesLazyLoaded: number;
  scriptCount: number;
  blockingScriptCount: number;
  stylesheetCount: number;
  inlineStyleBytes: number;
  internalLinks: number;
  externalLinks: number;
  headingCounts: { h1: number; h2: number; h3: number };
  formCount: number;
  socialLinks: string[];
}

export interface WebsiteAuditReport {
  /** The URL as supplied by the caller. */
  url: string;
  /** The URL the request actually ended on after redirects. */
  finalUrl: string | null;
  reachable: boolean;
  httpStatus: number | null;
  /** Why the audit could not run, when `reachable` is false. */
  failureReason: string | null;

  score: number;
  grade: WebsiteGrade;
  /** One sentence summarising the state of the site. */
  verdict: string;

  categories: WebsiteAuditCategoryScore[];
  issues: WebsiteAuditIssue[];
  /** The highest-impact issues that are cheap to fix. */
  quickWins: WebsiteAuditIssue[];
  /** Checks that passed, so the report shows strengths and not only faults. */
  strengths: string[];

  metrics: WebsiteAuditMetrics;
  /** Every raw signal, for the evidence chain and for downstream analysis. */
  checks: Record<string, boolean | number | string | null>;
  technologies: string[];

  checkedAt: string;
  /** How long the whole audit took, in milliseconds. */
  durationMs: number;
}

// ─── Category weights ─────────────────────────────────────────────────────────
//
// Weighted towards what actually costs a local business money: a site that
// cannot be found (SEO), cannot be used on a phone (mobile) or cannot be
// trusted (security) loses more than one that merely loads slowly.

const CATEGORY_WEIGHTS: Record<AuditCategory, number> = {
  seo: 20,
  performance: 18,
  security: 16,
  mobile: 14,
  accessibility: 12,
  conversion: 10,
  content: 10,
};

const CATEGORY_LABELS: Record<AuditCategory, string> = {
  performance: 'Speed & Performance',
  seo: 'Search Visibility (SEO)',
  security: 'Security & Trust',
  mobile: 'Mobile Experience',
  accessibility: 'Accessibility',
  content: 'Content & Credibility',
  conversion: 'Conversion Readiness',
};

/** Number of checks run per category, used for the "7 of 11 passed" readout. */
const CATEGORY_CHECK_COUNTS: Record<AuditCategory, number> = {
  performance: 8,
  seo: 12,
  security: 10,
  mobile: 5,
  accessibility: 7,
  content: 8,
  conversion: 7,
};

// ─── Fetch configuration ──────────────────────────────────────────────────────

const HOMEPAGE_TIMEOUT_MS = 12_000;
const ASSET_TIMEOUT_MS = 6_000;
const MAX_HTML_BYTES = 3 * 1024 * 1024; // 3 MB
const USER_AGENT =
  'ClientPilotAI-Audit/2.0 (+https://clientpilotai.rehanhussain.dev/audit)';

// ─── Small helpers ────────────────────────────────────────────────────────────

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, value));

export function gradeFor(score: number): WebsiteGrade {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 45) return 'D';
  return 'F';
}

/** Adds the scheme when the stored URL omits it, and strips stray whitespace. */
export function normalizeWebsiteUrl(raw: string): string {
  const cleaned = raw.trim().replace(/\s+/g, '');
  if (!cleaned) return '';
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  return `https://${cleaned}`;
}

const countMatches = (html: string, pattern: RegExp): number =>
  (html.match(pattern) || []).length;

/** Extracts the value of an attribute from a single tag string. */
const attr = (tag: string, name: string): string | null => {
  const match = tag.match(
    new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i')
  );
  if (!match) return null;
  return (match[2] ?? match[3] ?? match[4] ?? '').trim();
};

/** All tags of a given name, as raw strings. */
const tagsOf = (html: string, tagName: string): string[] =>
  html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) || [];

/** The content of the first `<meta name="X">` or `<meta property="X">`. */
const metaContent = (html: string, key: string): string | null => {
  for (const tag of tagsOf(html, 'meta')) {
    const name = (attr(tag, 'name') || attr(tag, 'property') || '').toLowerCase();
    if (name === key.toLowerCase()) return attr(tag, 'content');
  }
  return null;
};

/** Strips scripts, styles and tags so the remaining text can be word-counted. */
const visibleText = (html: string): string =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Lower-cased header lookup that tolerates Axios' header casing. */
const header = (resp: AxiosResponse | null, name: string): string | null => {
  if (!resp) return null;
  const headers = resp.headers as Record<string, unknown>;
  const direct = headers[name] ?? headers[name.toLowerCase()];
  if (typeof direct === 'string') return direct;
  if (Array.isArray(direct)) return direct.join(', ');
  return null;
};

// ─── Issue collection ─────────────────────────────────────────────────────────

class IssueCollector {
  readonly issues: WebsiteAuditIssue[] = [];
  readonly strengths: string[] = [];
  private readonly deductions: Record<AuditCategory, number> = {
    performance: 0,
    seo: 0,
    security: 0,
    mobile: 0,
    accessibility: 0,
    content: 0,
    conversion: 0,
  };
  private readonly passes: Record<AuditCategory, number> = {
    performance: 0,
    seo: 0,
    security: 0,
    mobile: 0,
    accessibility: 0,
    content: 0,
    conversion: 0,
  };

  fail(issue: WebsiteAuditIssue): void {
    this.issues.push(issue);
    this.deductions[issue.category] += issue.points;
  }

  pass(category: AuditCategory, strength?: string): void {
    this.passes[category] += 1;
    if (strength) this.strengths.push(strength);
  }

  /**
   * Records the outcome of one check.
   *
   * `ok === true` counts a pass (and an optional strength line); otherwise the
   * issue is recorded and its points deducted from the category.
   */
  check(ok: boolean, strength: string | null | undefined, issue: WebsiteAuditIssue): void {
    if (ok) this.pass(issue.category, strength ?? undefined);
    else this.fail(issue);
  }

  categoryScore(category: AuditCategory): number {
    return clamp(100 - this.deductions[category]);
  }

  passCount(category: AuditCategory): number {
    return this.passes[category];
  }
}

// ─── Network layer ────────────────────────────────────────────────────────────

interface FetchOutcome {
  response: AxiosResponse<string> | null;
  error: string | null;
  ttfbMs: number | null;
  loadMs: number | null;
}

async function fetchDocument(
  url: string,
  timeoutMs: number,
  maxBytes: number
): Promise<FetchOutcome> {
  const startedAt = Date.now();
  let ttfbMs: number | null = null;

  try {
    const response = await axios.get<string>(url, {
      timeout: timeoutMs,
      responseType: 'text',
      maxRedirects: 5,
      maxContentLength: maxBytes,
      maxBodyLength: maxBytes,
      decompress: true,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      // Any status is informative: a 404 or 500 homepage is itself a finding.
      validateStatus: () => true,
      onDownloadProgress: () => {
        if (ttfbMs === null) ttfbMs = Date.now() - startedAt;
      },
    });

    return {
      response,
      error: null,
      ttfbMs: ttfbMs ?? Date.now() - startedAt,
      loadMs: Date.now() - startedAt,
    };
  } catch (err: unknown) {
    const code = (err as { code?: string } | null)?.code;
    const message = err instanceof Error ? err.message : String(err);
    return {
      response: null,
      error: code ? `${code}: ${message}` : message,
      ttfbMs: null,
      loadMs: Date.now() - startedAt,
    };
  }
}

/** HEAD-style probe used for robots.txt / sitemap.xml existence. */
async function probeExists(url: string): Promise<boolean> {
  try {
    const resp = await axios.get(url, {
      timeout: ASSET_TIMEOUT_MS,
      maxRedirects: 3,
      maxContentLength: 512 * 1024,
      responseType: 'text',
      headers: { 'User-Agent': USER_AGENT },
      validateStatus: () => true,
    });
    if (resp.status < 200 || resp.status >= 300) return false;
    // Many hosts answer every path with the HTML homepage. A robots.txt or
    // sitemap that is really an HTML page does not count as present.
    const contentType = (header(resp, 'content-type') || '').toLowerCase();
    if (contentType.includes('text/html')) return false;
    return typeof resp.data === 'string' && resp.data.trim().length > 0;
  } catch {
    return false;
  }
}

/** True when the plain-HTTP origin redirects to HTTPS. */
async function checkHttpsRedirect(origin: string): Promise<boolean | null> {
  try {
    const httpUrl = origin.replace(/^https:/i, 'http:');
    const resp = await axios.get(httpUrl, {
      timeout: ASSET_TIMEOUT_MS,
      maxRedirects: 0,
      responseType: 'text',
      maxContentLength: 256 * 1024,
      headers: { 'User-Agent': USER_AGENT },
      validateStatus: () => true,
    });
    if (resp.status >= 300 && resp.status < 400) {
      const location = header(resp, 'location') || '';
      return /^https:/i.test(location);
    }
    return false;
  } catch {
    // A refused connection on port 80 is a valid way to be HTTPS-only.
    return null;
  }
}

// ─── Technology detection ─────────────────────────────────────────────────────

const TECH_SIGNATURES: Array<{ name: string; test: RegExp }> = [
  { name: 'WordPress', test: /wp-content|wp-includes|wordpress/i },
  { name: 'Shopify', test: /cdn\.shopify\.com|shopify\.theme/i },
  { name: 'Wix', test: /wix\.com|wixstatic/i },
  { name: 'Squarespace', test: /squarespace/i },
  { name: 'Webflow', test: /webflow/i },
  { name: 'WooCommerce', test: /wp-content\/plugins\/woocommerce|woocommerce(\.min)?\.(js|css)/i },
  { name: 'React', test: /__NEXT_DATA__|data-reactroot|react-dom/i },
  { name: 'Next.js', test: /__NEXT_DATA__|\/_next\//i },
  { name: 'Vue', test: /vue(\.min)?\.js|data-v-[0-9a-f]{8}/i },
  { name: 'Angular', test: /ng-version|angular(\.min)?\.js/i },
  { name: 'Bootstrap', test: /bootstrap(\.min)?\.(css|js)/i },
  { name: 'Tailwind CSS', test: /tailwind/i },
  { name: 'jQuery', test: /jquery/i },
  { name: 'Google Analytics', test: /googletagmanager\.com\/gtag|google-analytics\.com|gtag\(/i },
  { name: 'Google Tag Manager', test: /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]+/i },
  { name: 'Meta Pixel', test: /connect\.facebook\.net.*fbevents|fbq\(/i },
  { name: 'Cloudflare', test: /cloudflare|cdnjs\.cloudflare\.com/i },
  { name: 'Elementor', test: /elementor/i },
];

// ─── Main entry point ─────────────────────────────────────────────────────────

/**
 * Runs the full audit against a public website.
 *
 * Never throws for an unreachable or broken site: an unreachable site is a
 * legitimate — and very significant — audit result, reported with
 * `reachable: false`, a score of 0 and the reason it could not be loaded.
 */
export async function auditWebsite(rawUrl: string): Promise<WebsiteAuditReport> {
  const startedAt = Date.now();
  const url = normalizeWebsiteUrl(rawUrl || '');
  const checkedAt = new Date().toISOString();

  const emptyMetrics: WebsiteAuditMetrics = {
    ttfbMs: null,
    loadMs: null,
    htmlBytes: null,
    wordCount: 0,
    imageCount: 0,
    imagesWithAlt: 0,
    imagesLazyLoaded: 0,
    scriptCount: 0,
    blockingScriptCount: 0,
    stylesheetCount: 0,
    inlineStyleBytes: 0,
    internalLinks: 0,
    externalLinks: 0,
    headingCounts: { h1: 0, h2: 0, h3: 0 },
    formCount: 0,
    socialLinks: [],
  };

  const unreachable = (reason: string, status: number | null = null): WebsiteAuditReport => ({
    url: rawUrl,
    finalUrl: null,
    reachable: false,
    httpStatus: status,
    failureReason: reason,
    score: 0,
    grade: 'F',
    verdict: `The website could not be loaded (${reason}). Visitors searching for this business hit the same wall.`,
    categories: (Object.keys(CATEGORY_WEIGHTS) as AuditCategory[]).map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      score: 0,
      weight: CATEGORY_WEIGHTS[category],
      grade: 'F' as WebsiteGrade,
      checksPassed: 0,
      checksTotal: CATEGORY_CHECK_COUNTS[category],
    })),
    issues: [
      {
        id: 'site-unreachable',
        category: 'performance',
        severity: 'critical',
        title: 'Website does not load',
        detail: `The homepage at ${url || rawUrl} could not be retrieved: ${reason}.`,
        recommendation:
          'Confirm the domain is registered and pointing at a live server, that hosting is paid and running, and that the site answers on both http and https.',
        points: 100,
      },
    ],
    quickWins: [],
    strengths: [],
    metrics: emptyMetrics,
    checks: { reachable: false, failureReason: reason },
    technologies: [],
    checkedAt,
    durationMs: Date.now() - startedAt,
  });

  if (!url) return unreachable('no website address on record');
  if (!isSafePublicUrl(url)) {
    return unreachable('address points at a private or non-web host, so it was not fetched');
  }

  // 1 ─ Homepage
  const page = await fetchDocument(url, HOMEPAGE_TIMEOUT_MS, MAX_HTML_BYTES);
  if (!page.response) {
    return unreachable(page.error || 'request failed');
  }

  const status = page.response.status;
  if (status >= 400) {
    const report = unreachable(`the server answered HTTP ${status}`, status);
    report.issues[0] = {
      ...report.issues[0],
      id: 'site-http-error',
      title: `Homepage returns HTTP ${status}`,
      detail: `Requesting ${url} returned HTTP ${status} instead of a page.`,
      recommendation:
        status === 404
          ? 'The homepage is missing. Restore the index page or fix the server rewrite rules.'
          : 'Check server and application logs — the site is erroring before it can render.',
    };
    return report;
  }

  const rawHtml = typeof page.response.data === 'string' ? page.response.data : '';
  const html = rawHtml;
  const lower = rawHtml.toLowerCase();
  const htmlBytes = Buffer.byteLength(rawHtml, 'utf8');
  const finalUrl = (page.response.request?.res?.responseUrl as string | undefined) || url;
  const isHttps = /^https:/i.test(finalUrl);

  let origin = url;
  try {
    origin = new URL(finalUrl).origin;
  } catch {
    /* keep the normalised url */
  }

  // 2 ─ Side probes, in parallel; none of them can fail the audit.
  const [robotsExists, sitemapExists, httpsRedirects] = await Promise.all([
    probeExists(`${origin}/robots.txt`),
    probeExists(`${origin}/sitemap.xml`),
    isHttps ? checkHttpsRedirect(origin) : Promise.resolve(false),
  ]);

  // 3 ─ Parse the document once, then run every check against the parsed facts.
  const facts = parseDocument(html, lower, origin);
  const collector = new IssueCollector();

  const headers = {
    contentEncoding: (header(page.response, 'content-encoding') || '').toLowerCase(),
    cacheControl: header(page.response, 'cache-control'),
    hsts: header(page.response, 'strict-transport-security'),
    csp: header(page.response, 'content-security-policy'),
    xContentType: header(page.response, 'x-content-type-options'),
    xFrame: header(page.response, 'x-frame-options'),
    referrerPolicy: header(page.response, 'referrer-policy'),
    permissionsPolicy: header(page.response, 'permissions-policy'),
    server: header(page.response, 'server'),
    poweredBy: header(page.response, 'x-powered-by'),
  };

  runPerformanceChecks(collector, { page, htmlBytes, facts, headers });
  runSeoChecks(collector, { facts, robotsExists, sitemapExists, finalUrl });
  runSecurityChecks(collector, { isHttps, httpsRedirects, headers, facts });
  runMobileChecks(collector, { facts });
  runAccessibilityChecks(collector, { facts });
  runContentChecks(collector, { facts });
  runConversionChecks(collector, { facts });

  // 4 ─ Aggregate.
  const categories: WebsiteAuditCategoryScore[] = (
    Object.keys(CATEGORY_WEIGHTS) as AuditCategory[]
  ).map((category) => {
    const score = collector.categoryScore(category);
    return {
      category,
      label: CATEGORY_LABELS[category],
      score,
      weight: CATEGORY_WEIGHTS[category],
      grade: gradeFor(score),
      checksPassed: collector.passCount(category),
      checksTotal: CATEGORY_CHECK_COUNTS[category],
    };
  });

  const score = Math.round(
    categories.reduce((sum, c) => sum + c.score * (c.weight / 100), 0)
  );

  const severityRank: Record<IssueSeverity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  const issues = [...collector.issues].sort(
    (a, b) => severityRank[a.severity] - severityRank[b.severity] || b.points - a.points
  );

  // Quick wins: high-impact findings that are configuration or markup changes
  // rather than a rebuild.
  const QUICK_WIN_IDS = new Set([
    'seo-missing-title',
    'seo-missing-description',
    'seo-missing-h1',
    'seo-missing-canonical',
    'seo-missing-og',
    'seo-no-sitemap',
    'seo-no-robots',
    'a11y-missing-alt',
    'a11y-missing-lang',
    'security-no-hsts',
    'security-no-xcto',
    'security-no-xfo',
    'security-no-referrer-policy',
    'perf-no-compression',
    'perf-no-cache-headers',
    'perf-images-not-lazy',
    'mobile-no-viewport',
    'conv-no-click-to-call',
    'conv-no-analytics',
    'content-stale-copyright',
  ]);
  const quickWins = issues.filter((issue) => QUICK_WIN_IDS.has(issue.id)).slice(0, 6);

  const technologies = TECH_SIGNATURES.filter((tech) => tech.test.test(rawHtml)).map(
    (tech) => tech.name
  );

  const metrics: WebsiteAuditMetrics = {
    ttfbMs: page.ttfbMs,
    loadMs: page.loadMs,
    htmlBytes,
    wordCount: facts.wordCount,
    imageCount: facts.imageCount,
    imagesWithAlt: facts.imagesWithAlt,
    imagesLazyLoaded: facts.imagesLazyLoaded,
    scriptCount: facts.scriptCount,
    blockingScriptCount: facts.blockingScriptCount,
    stylesheetCount: facts.stylesheetCount,
    inlineStyleBytes: facts.inlineStyleBytes,
    internalLinks: facts.internalLinks,
    externalLinks: facts.externalLinks,
    headingCounts: { h1: facts.h1Count, h2: facts.h2Count, h3: facts.h3Count },
    formCount: facts.formCount,
    socialLinks: facts.socialLinks,
  };

  return {
    url: rawUrl,
    finalUrl,
    reachable: true,
    httpStatus: status,
    failureReason: null,
    score,
    grade: gradeFor(score),
    verdict: verdictFor(score, issues),
    categories,
    issues,
    quickWins,
    strengths: collector.strengths,
    metrics,
    checks: {
      reachable: true,
      httpStatus: status,
      isHttps,
      httpsRedirects: httpsRedirects === null ? 'http_port_closed' : httpsRedirects,
      robotsTxt: robotsExists,
      sitemapXml: sitemapExists,
      compression: headers.contentEncoding || null,
      cacheControl: headers.cacheControl,
      hsts: Boolean(headers.hsts),
      csp: Boolean(headers.csp),
      xContentTypeOptions: Boolean(headers.xContentType),
      xFrameOptions: Boolean(headers.xFrame || /frame-ancestors/i.test(headers.csp || '')),
      referrerPolicy: Boolean(headers.referrerPolicy),
      hasTitle: Boolean(facts.title),
      titleLength: facts.title ? facts.title.length : 0,
      hasMetaDescription: Boolean(facts.metaDescription),
      metaDescriptionLength: facts.metaDescription ? facts.metaDescription.length : 0,
      hasCanonical: facts.hasCanonical,
      hasOpenGraph: facts.hasOgTitle && facts.hasOgImage,
      hasStructuredData: facts.hasStructuredData,
      hasLocalBusinessSchema: facts.hasLocalBusinessSchema,
      noindex: facts.isNoindex,
      hasViewport: facts.hasViewport,
      viewportScalable: facts.viewportScalable,
      hasLangAttribute: facts.hasLang,
      hasFavicon: facts.hasFavicon,
      hasContactForm: facts.hasContactForm,
      hasClickToCall: facts.hasTelLink,
      hasMailto: facts.hasMailto,
      hasWhatsApp: facts.hasWhatsApp,
      hasBooking: facts.hasBooking,
      hasOrdering: facts.hasOrdering,
      hasMapEmbed: facts.hasMapEmbed,
      hasAnalytics: facts.hasAnalytics,
      hasPrivacyPolicy: facts.hasPrivacyPolicy,
      hasBusinessHours: facts.hasBusinessHours,
      hasAddress: facts.hasAddress,
      mixedContentCount: facts.mixedContentCount,
      copyrightYear: facts.copyrightYear,
      socialLinkCount: facts.socialLinks.length,
    },
    technologies,
    checkedAt,
    durationMs: Date.now() - startedAt,
  };
}

function verdictFor(score: number, issues: WebsiteAuditIssue[]): string {
  const critical = issues.filter((i) => i.severity === 'critical').length;
  const high = issues.filter((i) => i.severity === 'high').length;

  if (score >= 90) {
    return 'This website is in strong technical shape — the fundamentals of speed, search visibility, security and mobile usability are all in place.';
  }
  if (score >= 80) {
    return `A solid website with ${issues.length} improvement${issues.length === 1 ? '' : 's'} available, none of them structural.`;
  }
  if (score >= 70) {
    return `The site works, but ${high + critical} significant issue${high + critical === 1 ? '' : 's'} are costing it visibility and conversions.`;
  }
  if (score >= 60) {
    return `This website is underperforming: ${critical} critical and ${high} high-priority problems were found that a visitor or Google will notice.`;
  }
  if (score >= 45) {
    return `The website is in poor technical condition — ${critical + high} serious faults across search visibility, mobile usability and security.`;
  }
  return 'This website is failing on the basics. It is likely invisible in search, awkward on a phone, and giving visitors reasons not to trust it.';
}

// ─── Document parsing ─────────────────────────────────────────────────────────

interface DocumentFacts {
  title: string | null;
  metaDescription: string | null;
  hasCanonical: boolean;
  hasOgTitle: boolean;
  hasOgDescription: boolean;
  hasOgImage: boolean;
  hasTwitterCard: boolean;
  hasStructuredData: boolean;
  hasLocalBusinessSchema: boolean;
  isNoindex: boolean;
  hasViewport: boolean;
  viewportScalable: boolean;
  hasLang: boolean;
  hasFavicon: boolean;
  hasResponsiveHints: boolean;
  usesFlash: boolean;

  h1Count: number;
  h2Count: number;
  h3Count: number;
  firstHeadingIsH1: boolean;

  imageCount: number;
  imagesWithAlt: number;
  imagesLazyLoaded: number;
  imagesWithDimensions: number;

  scriptCount: number;
  blockingScriptCount: number;
  stylesheetCount: number;
  inlineStyleBytes: number;

  internalLinks: number;
  externalLinks: number;
  genericLinkTexts: number;

  formCount: number;
  inputsTotal: number;
  inputsLabelled: number;

  hasContactForm: boolean;
  hasTelLink: boolean;
  hasMailto: boolean;
  hasWhatsApp: boolean;
  hasBooking: boolean;
  hasOrdering: boolean;
  hasMapEmbed: boolean;
  hasAnalytics: boolean;
  hasCta: boolean;

  hasPrivacyPolicy: boolean;
  hasAboutLink: boolean;
  hasBusinessHours: boolean;
  hasAddress: boolean;
  socialLinks: string[];

  wordCount: number;
  copyrightYear: number | null;
  mixedContentCount: number;
  hasLandmarks: boolean;
  hasSkipLink: boolean;
  generator: string | null;
}

function parseDocument(html: string, lower: string, origin: string): DocumentFacts {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? visibleText(titleMatch[1]) : null;

  const robotsMeta = (metaContent(html, 'robots') || '').toLowerCase();
  const viewport = metaContent(html, 'viewport');

  // Headings
  const h1Count = countMatches(html, /<h1\b/gi);
  const h2Count = countMatches(html, /<h2\b/gi);
  const h3Count = countMatches(html, /<h3\b/gi);
  const firstHeading = html.match(/<h([1-6])\b/i);
  const firstHeadingIsH1 = firstHeading ? firstHeading[1] === '1' : false;

  // Images
  const imgTags = tagsOf(html, 'img');
  let imagesWithAlt = 0;
  let imagesLazyLoaded = 0;
  let imagesWithDimensions = 0;
  for (const tag of imgTags) {
    const alt = attr(tag, 'alt');
    if (alt !== null && alt.trim().length > 0) imagesWithAlt += 1;
    if ((attr(tag, 'loading') || '').toLowerCase() === 'lazy') imagesLazyLoaded += 1;
    if (attr(tag, 'width') && attr(tag, 'height')) imagesWithDimensions += 1;
  }

  // Scripts & styles
  const scriptTags = tagsOf(html, 'script');
  const externalScripts = scriptTags.filter((tag) => attr(tag, 'src'));
  const blockingScripts = externalScripts.filter(
    (tag) => !/\bdefer\b/i.test(tag) && !/\basync\b/i.test(tag) && !/type\s*=\s*["']module/i.test(tag)
  );
  const linkTags = tagsOf(html, 'link');
  const stylesheets = linkTags.filter(
    (tag) => (attr(tag, 'rel') || '').toLowerCase().includes('stylesheet')
  );
  const inlineStyleBytes = (html.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi) || []).reduce(
    (sum, block) => sum + Buffer.byteLength(block, 'utf8'),
    0
  );

  // Links
  const anchorTags = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || [];
  let internalLinks = 0;
  let externalLinks = 0;
  let genericLinkTexts = 0;
  const socialSet = new Set<string>();
  let originHost = '';
  try {
    originHost = new URL(origin).hostname.replace(/^www\./, '');
  } catch {
    /* leave blank: every absolute link then counts as external */
  }

  const SOCIAL_HOSTS: Record<string, string> = {
    'facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'linkedin.com': 'LinkedIn',
    'twitter.com': 'X / Twitter',
    'x.com': 'X / Twitter',
    'youtube.com': 'YouTube',
    'tiktok.com': 'TikTok',
    'pinterest.com': 'Pinterest',
  };

  for (const anchor of anchorTags) {
    const openTag = anchor.match(/<a\b[^>]*>/i)?.[0] || '';
    const href = (attr(openTag, 'href') || '').trim();
    const text = visibleText(anchor).toLowerCase();

    if (/^(click here|read more|here|more|link|learn more)$/.test(text)) genericLinkTexts += 1;

    if (!href || href.startsWith('#') || href.startsWith('javascript:')) continue;
    if (/^(tel:|mailto:)/i.test(href)) continue;

    if (/^https?:\/\//i.test(href)) {
      try {
        const host = new URL(href).hostname.replace(/^www\./, '');
        if (originHost && host === originHost) internalLinks += 1;
        else externalLinks += 1;
        for (const [socialHost, label] of Object.entries(SOCIAL_HOSTS)) {
          if (host === socialHost || host.endsWith(`.${socialHost}`)) socialSet.add(label);
        }
      } catch {
        externalLinks += 1;
      }
    } else {
      internalLinks += 1;
    }
  }

  // Forms
  const formCount = countMatches(html, /<form\b/gi);
  const inputTags = [...tagsOf(html, 'input'), ...tagsOf(html, 'textarea'), ...tagsOf(html, 'select')];
  const realInputs = inputTags.filter((tag) => {
    const type = (attr(tag, 'type') || 'text').toLowerCase();
    return !['hidden', 'submit', 'button', 'image', 'reset'].includes(type);
  });
  const labelFor = new Set(
    tagsOf(html, 'label')
      .map((tag) => attr(tag, 'for'))
      .filter((value): value is string => Boolean(value))
  );
  const inputsLabelled = realInputs.filter((tag) => {
    const id = attr(tag, 'id');
    return (
      (id && labelFor.has(id)) ||
      Boolean(attr(tag, 'aria-label')) ||
      Boolean(attr(tag, 'aria-labelledby')) ||
      Boolean(attr(tag, 'title'))
    );
  }).length;

  const hasEmailInput = /type\s*=\s*["']?email/i.test(html);
  const hasContactForm =
    formCount > 0 &&
    (hasEmailInput ||
      /name\s*=\s*["']?(message|enquiry|inquiry|comment|subject)/i.test(html) ||
      /contact/i.test(lower));

  // Copyright year
  const yearMatches = [
    ...html.matchAll(/(?:©|&copy;|copyright)[^0-9]{0,30}((?:19|20)\d{2})(?:\s*[-–—]\s*((?:19|20)\d{2}))?/gi),
  ];
  let copyrightYear: number | null = null;
  for (const match of yearMatches) {
    const year = Number(match[2] || match[1]);
    if (!Number.isNaN(year) && (copyrightYear === null || year > copyrightYear)) copyrightYear = year;
  }

  // Mixed content: http:// assets referenced from the page.
  const mixedContentCount = countMatches(
    html,
    /(?:src|href)\s*=\s*["']http:\/\/(?!localhost|127\.)/gi
  );

  const structuredDataBlocks = html.match(
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  ) || [];

  return {
    title,
    metaDescription: metaContent(html, 'description'),
    hasCanonical: linkTags.some((tag) => (attr(tag, 'rel') || '').toLowerCase() === 'canonical'),
    hasOgTitle: Boolean(metaContent(html, 'og:title')),
    hasOgDescription: Boolean(metaContent(html, 'og:description')),
    hasOgImage: Boolean(metaContent(html, 'og:image')),
    hasTwitterCard: Boolean(metaContent(html, 'twitter:card')),
    hasStructuredData: structuredDataBlocks.length > 0 || /itemscope/i.test(html),
    hasLocalBusinessSchema: structuredDataBlocks.some((block) =>
      /"@type"\s*:\s*"(LocalBusiness|Restaurant|Store|Dentist|MedicalBusiness|ProfessionalService|HealthAndBeautyBusiness|AutoRepair|Organization)"/i.test(
        block
      )
    ),
    isNoindex: /\bnoindex\b/.test(robotsMeta),
    hasViewport: Boolean(viewport),
    viewportScalable: viewport
      ? !/user-scalable\s*=\s*no/i.test(viewport) && !/maximum-scale\s*=\s*1(\.0)?\b/i.test(viewport)
      : true,
    hasLang: /<html[^>]*\blang\s*=\s*["']?[a-z]{2}/i.test(html),
    hasFavicon: linkTags.some((tag) => /icon/i.test(attr(tag, 'rel') || '')),
    hasResponsiveHints:
      /@media[^{]*\((?:max|min)-width/i.test(html) ||
      /tailwind|bootstrap|foundation|bulma|flexbox-grid/i.test(lower),
    usesFlash: /<embed\b[^>]*application\/x-shockwave-flash|\.swf\b|<applet\b/i.test(html),

    h1Count,
    h2Count,
    h3Count,
    firstHeadingIsH1,

    imageCount: imgTags.length,
    imagesWithAlt,
    imagesLazyLoaded,
    imagesWithDimensions,

    scriptCount: scriptTags.length,
    blockingScriptCount: blockingScripts.length,
    stylesheetCount: stylesheets.length,
    inlineStyleBytes,

    internalLinks,
    externalLinks,
    genericLinkTexts,

    formCount,
    inputsTotal: realInputs.length,
    inputsLabelled,

    hasContactForm,
    hasTelLink: /href\s*=\s*["']tel:/i.test(html),
    hasMailto: /href\s*=\s*["']mailto:/i.test(html),
    hasWhatsApp: /wa\.me\/|api\.whatsapp\.com|whatsapp:\/\//i.test(html),
    hasBooking:
      /\b(book now|book online|book a table|make a booking|appointment|reservation|reserve a table|schedule a (?:visit|consultation|call))\b/i.test(
        lower
      ) || /calendly\.com|simplybook|setmore|acuityscheduling|opentable|resy\.com/i.test(lower),
    hasOrdering:
      /\b(add to cart|add to basket|order online|checkout|buy now|shop now|view cart)\b/i.test(lower) ||
      /woocommerce|shopify|snipcart|foodpanda|ubereats|deliveroo/i.test(lower),
    hasMapEmbed: /google\.com\/maps|maps\.google|openstreetmap\.org\/export|mapbox|leaflet/i.test(lower),
    hasAnalytics:
      /googletagmanager\.com|google-analytics\.com|gtag\(|fbq\(|plausible\.io|matomo|hotjar|clarity\.ms/i.test(
        lower
      ),
    hasCta:
      /\b(get a quote|request a quote|contact us|call now|get started|free consultation|enquire now|book now|order now|sign up)\b/i.test(
        lower
      ),

    hasPrivacyPolicy: /privacy[- ]?policy|\/privacy/i.test(lower),
    hasAboutLink: /\babout (?:us|our)\b|href\s*=\s*["'][^"']*\/about/i.test(lower),
    hasBusinessHours:
      /\b(opening hours|business hours|hours of operation|mon(?:day)?\s*[-–—]\s*(?:fri|sat|sun))\b/i.test(
        lower
      ) || /\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*\s*[:：]?\s*\d{1,2}\s*[:.]?\d{0,2}\s*(am|pm)/i.test(lower),
    hasAddress:
      /<address\b/i.test(html) ||
      /\b(street|road|avenue|boulevard|plaza|block\s+\d|sector\s+[a-z0-9]|postal code|zip code|po box)\b/i.test(
        lower
      ),
    socialLinks: [...socialSet],

    wordCount: visibleText(html).split(/\s+/).filter(Boolean).length,
    copyrightYear,
    mixedContentCount,
    hasLandmarks: /<(main|nav|header|footer)\b/i.test(html) || /role\s*=\s*["'](main|navigation|banner)/i.test(html),
    hasSkipLink: /skip to (?:main )?content/i.test(lower),
    generator: metaContent(html, 'generator'),
  };
}

// ─── Check suites ─────────────────────────────────────────────────────────────

function runPerformanceChecks(
  c: IssueCollector,
  ctx: {
    page: FetchOutcome;
    htmlBytes: number;
    facts: DocumentFacts;
    headers: { contentEncoding: string; cacheControl: string | null };
  }
): void {
  const { page, htmlBytes, facts, headers } = ctx;
  const ttfb = page.ttfbMs ?? 0;
  const load = page.loadMs ?? 0;

  // 1 — Server response time
  if (ttfb <= 800) {
    c.pass('performance', `Server responds in ${ttfb} ms`);
  } else {
    const severity: IssueSeverity = ttfb > 2500 ? 'high' : 'medium';
    c.fail({
      id: 'perf-slow-ttfb',
      category: 'performance',
      severity,
      title: 'Server is slow to respond',
      detail: `The server took ${ttfb} ms to send the first byte. Above 800 ms visitors notice the delay, and Google treats it as a ranking signal.`,
      recommendation:
        'Move to faster hosting, enable server-side caching (or a CDN in front of the site), and check for slow database queries on the homepage.',
      points: ttfb > 2500 ? 28 : 15,
    });
  }

  // 2 — Full page download
  if (load <= 2500) {
    c.pass('performance', `Homepage HTML downloaded in ${load} ms`);
  } else {
    c.fail({
      id: 'perf-slow-load',
      category: 'performance',
      severity: load > 6000 ? 'high' : 'medium',
      title: 'Homepage takes too long to load',
      detail: `The homepage HTML took ${load} ms to download in full. More than half of mobile visitors abandon a page that takes over 3 seconds.`,
      recommendation:
        'Compress and resize images, remove unused plugins and scripts, and serve static assets from a CDN.',
      points: load > 6000 ? 22 : 12,
    });
  }

  // 3 — HTML weight
  if (htmlBytes <= 150 * 1024) {
    c.pass('performance', `Lean HTML document (${Math.round(htmlBytes / 1024)} KB)`);
  } else {
    c.fail({
      id: 'perf-heavy-html',
      category: 'performance',
      severity: htmlBytes > 500 * 1024 ? 'high' : 'low',
      title: 'HTML document is unusually heavy',
      detail: `The homepage HTML alone is ${Math.round(htmlBytes / 1024)} KB before images, CSS or JavaScript are counted.`,
      recommendation:
        'Move inline styles and data into external cached files, and strip page-builder markup that is not rendered.',
      points: htmlBytes > 500 * 1024 ? 14 : 6,
    });
  }

  // 4 — Compression
  c.check(
    /gzip|br|deflate|zstd/.test(headers.contentEncoding),
    'Text compression is enabled',
    {
      id: 'perf-no-compression',
      category: 'performance',
      severity: 'medium',
      title: 'Text compression is switched off',
      detail: 'The server returned the page uncompressed, so every visitor downloads several times more data than necessary.',
      recommendation: 'Enable gzip or Brotli compression in the web server or CDN. It is a one-line configuration change.',
      points: 12,
    }
  );

  // 5 — Caching
  c.check(Boolean(headers.cacheControl), 'Cache-control headers are set', {
    id: 'perf-no-cache-headers',
    category: 'performance',
    severity: 'low',
    title: 'No browser caching rules',
    detail: 'The server sends no Cache-Control header, so returning visitors re-download everything on every visit.',
    recommendation: 'Set Cache-Control headers for static assets (images, CSS, JS) to at least 30 days.',
    points: 7,
  });

  // 6 — Render-blocking scripts
  c.check(
    facts.blockingScriptCount <= 3,
    facts.blockingScriptCount === 0 ? 'No render-blocking scripts' : undefined,
    {
      id: 'perf-blocking-scripts',
      category: 'performance',
      severity: facts.blockingScriptCount > 8 ? 'high' : 'medium',
      title: 'Too many render-blocking scripts',
      detail: `${facts.blockingScriptCount} scripts load without defer or async, so the page cannot paint until each one has downloaded.`,
      recommendation: 'Add defer (or async where order does not matter) to third-party and non-critical scripts, and remove ones that are no longer used.',
      points: facts.blockingScriptCount > 8 ? 18 : 10,
    }
  );

  // 7 — Lazy loading
  c.check(
    facts.imageCount <= 5 || facts.imagesLazyLoaded > 0,
    facts.imagesLazyLoaded > 0 ? 'Images use lazy loading' : undefined,
    {
      id: 'perf-images-not-lazy',
      category: 'performance',
      severity: 'medium',
      title: 'Images are not lazy-loaded',
      detail: `${facts.imageCount} images load immediately, including ones far below the fold.`,
      recommendation: 'Add loading="lazy" to images that are not visible when the page first opens.',
      points: 9,
    }
  );

  // 8 — Stylesheet count
  c.check(facts.stylesheetCount <= 6, 'Stylesheet count is reasonable', {
    id: 'perf-many-stylesheets',
    category: 'performance',
    severity: 'low',
    title: 'Too many separate stylesheets',
    detail: `${facts.stylesheetCount} stylesheets are requested, each one an extra round trip before the page can render.`,
    recommendation: 'Combine stylesheets during the build, or remove plugin styles the theme does not use.',
    points: 6,
  });
}

function runSeoChecks(
  c: IssueCollector,
  ctx: {
    facts: DocumentFacts;
    robotsExists: boolean;
    sitemapExists: boolean;
    finalUrl: string;
  }
): void {
  const { facts, robotsExists, sitemapExists } = ctx;

  // 1 — noindex is the single most damaging SEO fault.
  if (facts.isNoindex) {
    c.fail({
      id: 'seo-noindex',
      category: 'seo',
      severity: 'critical',
      title: 'Website is blocked from Google',
      detail: 'The homepage carries a noindex instruction, which tells search engines to leave it out of results entirely.',
      recommendation: 'Remove the noindex meta tag. On WordPress, untick Settings → Reading → "Discourage search engines".',
      points: 45,
    });
  } else {
    c.pass('seo', 'Page is open to search engine indexing');
  }

  // 2 — Title
  const title = facts.title || '';
  if (!title) {
    c.fail({
      id: 'seo-missing-title',
      category: 'seo',
      severity: 'critical',
      title: 'Page title is missing',
      detail: 'The homepage has no <title>, so search results and browser tabs show the bare URL.',
      recommendation: 'Add a title of 50-60 characters containing the business name, what it does and the city it serves.',
      points: 20,
    });
  } else if (title.length < 15 || title.length > 65) {
    c.fail({
      id: 'seo-title-length',
      category: 'seo',
      severity: 'medium',
      title: title.length < 15 ? 'Page title is too short' : 'Page title is too long',
      detail: `The title is ${title.length} characters ("${title.slice(0, 80)}"). Google displays roughly 50-60.`,
      recommendation: 'Rewrite the title to 50-60 characters: business name, main service, and location.',
      points: 8,
    });
  } else {
    c.pass('seo', `Page title is well-formed (${title.length} characters)`);
  }

  // 3 — Meta description
  const description = facts.metaDescription || '';
  if (!description) {
    c.fail({
      id: 'seo-missing-description',
      category: 'seo',
      severity: 'high',
      title: 'Meta description is missing',
      detail: 'Without a meta description, Google invents the snippet shown under the link, which lowers the click-through rate.',
      recommendation: 'Write a 140-160 character description of the business and its main offer for the homepage.',
      points: 14,
    });
  } else if (description.length < 70 || description.length > 170) {
    c.fail({
      id: 'seo-description-length',
      category: 'seo',
      severity: 'low',
      title: 'Meta description length is off',
      detail: `The description is ${description.length} characters; search snippets show about 150.`,
      recommendation: 'Adjust the description to roughly 140-160 characters.',
      points: 5,
    });
  } else {
    c.pass('seo', 'Meta description is present and well-sized');
  }

  // 4 — H1
  if (facts.h1Count === 0) {
    c.fail({
      id: 'seo-missing-h1',
      category: 'seo',
      severity: 'high',
      title: 'No main heading (H1) on the page',
      detail: 'Search engines and screen readers use the H1 to understand what the page is about; this page has none.',
      recommendation: 'Add exactly one H1 to the homepage stating what the business offers and where.',
      points: 12,
    });
  } else if (facts.h1Count > 1) {
    c.fail({
      id: 'seo-multiple-h1',
      category: 'seo',
      severity: 'low',
      title: 'Multiple H1 headings',
      detail: `The page has ${facts.h1Count} H1 headings, which dilutes the topic signal.`,
      recommendation: 'Keep one H1 and demote the rest to H2.',
      points: 5,
    });
  } else {
    c.pass('seo', 'Exactly one H1 heading');
  }

  // 5 — Heading structure
  c.check(facts.h2Count > 0, 'Content is broken up with subheadings', {
    id: 'seo-no-subheadings',
    category: 'seo',
    severity: 'low',
    title: 'No subheadings on the page',
    detail: 'The page uses no H2 headings, so neither readers nor search engines can see its structure.',
    recommendation: 'Break the page into sections with H2 headings covering services, areas served and contact.',
    points: 5,
  });

  // 6 — Canonical
  c.check(facts.hasCanonical, 'Canonical URL is declared', {
    id: 'seo-missing-canonical',
    category: 'seo',
    severity: 'medium',
    title: 'No canonical URL',
    detail: 'Without a canonical tag, the same page reached by different URLs can be treated as duplicate content.',
    recommendation: 'Add <link rel="canonical"> pointing at the preferred URL of each page.',
    points: 7,
  });

  // 7 — Open Graph
  c.check(
    facts.hasOgTitle && facts.hasOgImage,
    'Open Graph tags are set for social sharing',
    {
      id: 'seo-missing-og',
      category: 'seo',
      severity: 'medium',
      title: 'Links shared on social media look broken',
      detail: 'Open Graph title/image tags are missing, so links posted on Facebook, WhatsApp or LinkedIn show no preview.',
      recommendation: 'Add og:title, og:description and og:image (1200×630) to every page.',
      points: 7,
    }
  );

  // 8 — Structured data
  c.check(facts.hasStructuredData, 'Structured data is present', {
    id: 'seo-no-structured-data',
    category: 'seo',
    severity: 'medium',
    title: 'No structured data (schema markup)',
    detail: 'The page has no JSON-LD schema, so Google cannot show rich results such as ratings, opening hours or the map pin.',
    recommendation: 'Add LocalBusiness JSON-LD with the name, address, phone, opening hours and geo coordinates.',
    points: 8,
  });

  // 9 — LocalBusiness schema specifically
  c.check(facts.hasLocalBusinessSchema, 'LocalBusiness schema is implemented', {
    id: 'seo-no-local-schema',
    category: 'seo',
    severity: 'medium',
    title: 'No LocalBusiness schema',
    detail: 'Local search results rely on LocalBusiness markup to match a site to a physical place; it is not present.',
    recommendation: 'Add LocalBusiness (or the closest subtype) JSON-LD including address, telephone and openingHours.',
    points: 7,
  });

  // 10 — robots.txt
  c.check(robotsExists, 'robots.txt is served', {
    id: 'seo-no-robots',
    category: 'seo',
    severity: 'low',
    title: 'No robots.txt file',
    detail: 'Crawlers get a 404 for /robots.txt, so crawl rules and the sitemap location cannot be declared.',
    recommendation: 'Publish a robots.txt that allows crawling and points to the sitemap.',
    points: 5,
  });

  // 11 — sitemap.xml
  c.check(sitemapExists, 'XML sitemap is published', {
    id: 'seo-no-sitemap',
    category: 'seo',
    severity: 'medium',
    title: 'No XML sitemap',
    detail: 'No sitemap was found at /sitemap.xml, so search engines have to discover every page by following links.',
    recommendation: 'Generate a sitemap.xml, reference it in robots.txt, and submit it in Google Search Console.',
    points: 7,
  });

  // 12 — Image alt coverage (SEO side)
  const altRatio = facts.imageCount === 0 ? 1 : facts.imagesWithAlt / facts.imageCount;
  c.check(altRatio >= 0.8, 'Images carry descriptive alt text', {
    id: 'seo-image-alt-coverage',
    category: 'seo',
    severity: 'low',
    title: 'Images are missing alt text',
    detail: `${facts.imageCount - facts.imagesWithAlt} of ${facts.imageCount} images have no alt attribute, so they contribute nothing to search relevance.`,
    recommendation: 'Describe each meaningful image in its alt attribute; leave alt="" only for decoration.',
    points: 6,
  });
}

function runSecurityChecks(
  c: IssueCollector,
  ctx: {
    isHttps: boolean;
    httpsRedirects: boolean | null;
    headers: {
      hsts: string | null;
      csp: string | null;
      xContentType: string | null;
      xFrame: string | null;
      referrerPolicy: string | null;
      permissionsPolicy: string | null;
      server: string | null;
      poweredBy: string | null;
    };
    facts: DocumentFacts;
  }
): void {
  const { isHttps, httpsRedirects, headers, facts } = ctx;

  // 1 — HTTPS
  if (isHttps) {
    c.pass('security', 'Site is served over HTTPS with a valid certificate');
  } else {
    c.fail({
      id: 'security-no-https',
      category: 'security',
      severity: 'critical',
      title: 'Website has no HTTPS encryption',
      detail: 'The site is served over plain HTTP. Chrome marks it "Not secure" in the address bar, and anything typed into a form travels unencrypted.',
      recommendation: 'Install a TLS certificate (Let\'s Encrypt is free and most hosts enable it in one click) and force all traffic to https.',
      points: 45,
    });
  }

  // 2 — HTTP → HTTPS redirect
  if (isHttps) {
    if (httpsRedirects === null) {
      c.pass('security', 'Plain HTTP is not served at all');
    } else {
      c.check(httpsRedirects, 'HTTP traffic is redirected to HTTPS', {
        id: 'security-no-https-redirect',
        category: 'security',
        severity: 'high',
        title: 'The http:// version of the site still loads',
        detail: 'Visiting the site over http does not redirect to https, so old links and typed addresses stay on the insecure version.',
        recommendation: 'Add a permanent 301 redirect from http to https at the server or CDN level.',
        points: 16,
      });
    }
  }

  // 3 — Mixed content
  c.check(!isHttps || facts.mixedContentCount === 0, 'No insecure mixed content', {
    id: 'security-mixed-content',
    category: 'security',
    severity: 'high',
    title: 'Secure page loads insecure resources',
    detail: `${facts.mixedContentCount} assets are referenced over plain http on an https page, which browsers block or flag.`,
    recommendation: 'Update those image, script and stylesheet URLs to https (or use protocol-relative paths).',
    points: 14,
  });

  // 4 — HSTS
  c.check(Boolean(headers.hsts), 'HSTS is enabled', {
    id: 'security-no-hsts',
    category: 'security',
    severity: 'medium',
    title: 'No HSTS header',
    detail: 'Strict-Transport-Security is not set, so a visitor\'s first request can still be downgraded to http.',
    recommendation: 'Send Strict-Transport-Security: max-age=31536000; includeSubDomains.',
    points: 8,
  });

  // 5 — CSP
  c.check(Boolean(headers.csp), 'Content-Security-Policy is set', {
    id: 'security-no-csp',
    category: 'security',
    severity: 'medium',
    title: 'No Content-Security-Policy',
    detail: 'Without a CSP, an injected script from a compromised plugin or ad runs with full access to the page.',
    recommendation: 'Add a Content-Security-Policy header, starting in report-only mode to find violations safely.',
    points: 9,
  });

  // 6 — X-Content-Type-Options
  c.check(Boolean(headers.xContentType), 'MIME sniffing is disabled', {
    id: 'security-no-xcto',
    category: 'security',
    severity: 'low',
    title: 'Missing X-Content-Type-Options header',
    detail: 'Browsers may guess the type of a response, which can turn an uploaded file into executable script.',
    recommendation: 'Send X-Content-Type-Options: nosniff.',
    points: 5,
  });

  // 7 — Clickjacking protection
  c.check(
    Boolean(headers.xFrame) || /frame-ancestors/i.test(headers.csp || ''),
    'Clickjacking protection is in place',
    {
      id: 'security-no-xfo',
      category: 'security',
      severity: 'medium',
      title: 'Site can be embedded in a hostile frame',
      detail: 'Neither X-Frame-Options nor a CSP frame-ancestors rule is set, so the site can be loaded inside another page and used for clickjacking.',
      recommendation: 'Send X-Frame-Options: SAMEORIGIN, or CSP frame-ancestors \'self\'.',
      points: 7,
    }
  );

  // 8 — Referrer policy
  c.check(Boolean(headers.referrerPolicy), 'Referrer-Policy is set', {
    id: 'security-no-referrer-policy',
    category: 'security',
    severity: 'low',
    title: 'No Referrer-Policy header',
    detail: 'Full URLs are leaked to every third-party resource the page loads.',
    recommendation: 'Send Referrer-Policy: strict-origin-when-cross-origin.',
    points: 4,
  });

  // 9 — Permissions policy
  c.check(Boolean(headers.permissionsPolicy), 'Permissions-Policy is set', {
    id: 'security-no-permissions-policy',
    category: 'security',
    severity: 'low',
    title: 'No Permissions-Policy header',
    detail: 'Embedded third-party content is not restricted from requesting camera, microphone or geolocation access.',
    recommendation: 'Send a Permissions-Policy header disabling the features the site does not use.',
    points: 3,
  });

  // 10 — Version disclosure
  const disclosure = [headers.server, headers.poweredBy]
    .filter((value): value is string => Boolean(value))
    .filter((value) => /\d+\.\d+/.test(value));
  const staleGenerator = facts.generator && /wordpress\s+[0-5]\./i.test(facts.generator);

  if (disclosure.length === 0 && !staleGenerator) {
    c.pass('security', 'Server does not advertise software versions');
  } else {
    c.fail({
      id: 'security-version-disclosure',
      category: 'security',
      severity: staleGenerator ? 'medium' : 'low',
      title: staleGenerator ? 'Outdated CMS version is published' : 'Server software version is exposed',
      detail: staleGenerator
        ? `The page advertises "${facts.generator}", an old release with publicly documented vulnerabilities.`
        : `Response headers disclose exact software versions (${disclosure.join('; ')}), which tells an attacker which exploits to try.`,
      recommendation: staleGenerator
        ? 'Update the CMS and its plugins to a currently supported release, then remove the generator meta tag.'
        : 'Suppress the Server and X-Powered-By version strings in the web server configuration.',
      points: staleGenerator ? 8 : 3,
    });
  }
}

function runMobileChecks(c: IssueCollector, ctx: { facts: DocumentFacts }): void {
  const { facts } = ctx;

  // 1 — Viewport
  if (!facts.hasViewport) {
    c.fail({
      id: 'mobile-no-viewport',
      category: 'mobile',
      severity: 'critical',
      title: 'Site is not built for mobile screens',
      detail: 'There is no viewport meta tag, so phones render the page at desktop width and the visitor has to pinch and zoom to read anything.',
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> and make the layout responsive.',
      points: 50,
    });
  } else {
    c.pass('mobile', 'Responsive viewport is declared');
  }

  // 2 — Zoom not disabled
  c.check(facts.viewportScalable, 'Visitors can zoom the page', {
    id: 'mobile-zoom-disabled',
    category: 'mobile',
    severity: 'medium',
    title: 'Pinch-to-zoom is disabled',
    detail: 'The viewport tag blocks zooming, which makes the site unusable for anyone who needs larger text.',
    recommendation: 'Remove user-scalable=no and maximum-scale=1 from the viewport tag.',
    points: 12,
  });

  // 3 — Responsive CSS
  c.check(facts.hasResponsiveHints, 'Responsive CSS rules detected', {
    id: 'mobile-no-responsive-css',
    category: 'mobile',
    severity: 'high',
    title: 'No responsive layout rules found',
    detail: 'No media queries or responsive framework were detected, so the layout probably does not adapt between phone and desktop.',
    recommendation: 'Add CSS media queries (or adopt a responsive theme) so the layout reflows below 768px.',
    points: 20,
  });

  // 4 — No Flash / applets
  c.check(!facts.usesFlash, 'No obsolete plugin content', {
    id: 'mobile-flash-content',
    category: 'mobile',
    severity: 'high',
    title: 'Page uses obsolete plugin content',
    detail: 'Flash or Java applet embeds were found. No current browser can play them, so that part of the page is blank for everyone.',
    recommendation: 'Replace Flash content with HTML5 video or modern markup.',
    points: 20,
  });

  // 5 — Click-to-call, which on mobile is the primary conversion path
  c.check(facts.hasTelLink, 'Phone number is tappable on mobile', {
    id: 'mobile-no-tel-link',
    category: 'mobile',
    severity: 'medium',
    title: 'Phone number cannot be tapped to call',
    detail: 'No tel: link was found, so mobile visitors have to copy the number by hand.',
    recommendation: 'Wrap the phone number in <a href="tel:+92..."> everywhere it appears.',
    points: 12,
  });
}

function runAccessibilityChecks(c: IssueCollector, ctx: { facts: DocumentFacts }): void {
  const { facts } = ctx;

  // 1 — lang
  c.check(facts.hasLang, 'Page language is declared', {
    id: 'a11y-missing-lang',
    category: 'accessibility',
    severity: 'medium',
    title: 'Page language is not declared',
    detail: 'The <html> element has no lang attribute, so screen readers do not know which pronunciation rules to use.',
    recommendation: 'Set <html lang="en"> (or the language the site is actually written in).',
    points: 12,
  });

  // 2 — Alt text
  const altRatio = facts.imageCount === 0 ? 1 : facts.imagesWithAlt / facts.imageCount;
  if (altRatio >= 0.9) {
    c.pass('accessibility', 'Images have alt text');
  } else {
    c.fail({
      id: 'a11y-missing-alt',
      category: 'accessibility',
      severity: altRatio < 0.5 ? 'high' : 'medium',
      title: 'Images are unreadable to screen readers',
      detail: `${facts.imageCount - facts.imagesWithAlt} of ${facts.imageCount} images have no alt text.`,
      recommendation: 'Add a short description to every informative image; use alt="" for purely decorative ones.',
      points: altRatio < 0.5 ? 20 : 11,
    });
  }

  // 3 — Form labels
  const labelRatio = facts.inputsTotal === 0 ? 1 : facts.inputsLabelled / facts.inputsTotal;
  c.check(labelRatio >= 0.8, 'Form fields are labelled', {
    id: 'a11y-unlabelled-inputs',
    category: 'accessibility',
    severity: 'medium',
    title: 'Form fields have no labels',
    detail: `${facts.inputsTotal - facts.inputsLabelled} of ${facts.inputsTotal} form fields have no label, aria-label or title.`,
    recommendation: 'Give each field a <label for="..."> or an aria-label describing what to enter.',
    points: 14,
  });

  // 4 — Landmarks
  c.check(facts.hasLandmarks, 'Page uses semantic landmarks', {
    id: 'a11y-no-landmarks',
    category: 'accessibility',
    severity: 'low',
    title: 'No semantic landmark elements',
    detail: 'The page has no <main>, <nav> or <header>, so assistive technology cannot jump between regions.',
    recommendation: 'Wrap the page regions in <header>, <nav>, <main> and <footer>.',
    points: 8,
  });

  // 5 — Heading order
  c.check(facts.h1Count === 0 || facts.firstHeadingIsH1, 'Heading order starts at H1', {
    id: 'a11y-heading-order',
    category: 'accessibility',
    severity: 'low',
    title: 'Headings start below H1',
    detail: 'The first heading on the page is not an H1, which breaks the document outline screen readers rely on.',
    recommendation: 'Order headings H1 → H2 → H3 without skipping levels.',
    points: 7,
  });

  // 6 — Skip link
  c.check(facts.hasSkipLink, 'A skip-to-content link is provided', {
    id: 'a11y-no-skip-link',
    category: 'accessibility',
    severity: 'low',
    title: 'No skip-to-content link',
    detail: 'Keyboard users must tab through the whole navigation on every page before reaching the content.',
    recommendation: 'Add a visually hidden "Skip to content" link as the first focusable element.',
    points: 6,
  });

  // 7 — Link text
  c.check(facts.genericLinkTexts <= 2, 'Link text is descriptive', {
    id: 'a11y-generic-link-text',
    category: 'accessibility',
    severity: 'low',
    title: 'Links use generic text',
    detail: `${facts.genericLinkTexts} links read as "click here" or "read more", which is meaningless out of context.`,
    recommendation: 'Rewrite link text to describe the destination, e.g. "See our pricing".',
    points: 5,
  });
}

function runContentChecks(c: IssueCollector, ctx: { facts: DocumentFacts }): void {
  const { facts } = ctx;
  const currentYear = new Date().getFullYear();

  // 1 — Enough content
  c.check(facts.wordCount >= 300, `Homepage carries ${facts.wordCount} words of content`, {
    id: 'content-thin',
    category: 'content',
    severity: facts.wordCount < 120 ? 'high' : 'medium',
    title: 'Homepage has very little content',
    detail: `Only ${facts.wordCount} words of visible text were found. Search engines have almost nothing to rank, and visitors little to read.`,
    recommendation: 'Write at least 300-500 words covering services, the areas served, and why to choose this business.',
    points: facts.wordCount < 120 ? 22 : 12,
  });

  // 2 — Address
  c.check(facts.hasAddress, 'A physical address is published', {
    id: 'content-no-address',
    category: 'content',
    severity: 'medium',
    title: 'No physical address on the page',
    detail: 'No street address was found. Local customers and Google both use it to confirm the business is real and nearby.',
    recommendation: 'Publish the full address in the footer and mark it up with <address> or LocalBusiness schema.',
    points: 14,
  });

  // 3 — Opening hours
  c.check(facts.hasBusinessHours, 'Opening hours are published', {
    id: 'content-no-hours',
    category: 'content',
    severity: 'medium',
    title: 'Opening hours are not published',
    detail: '"What time do they open?" is the most common question a local visitor arrives with, and the page does not answer it.',
    recommendation: 'List opening hours on the homepage and in openingHours schema markup.',
    points: 12,
  });

  // 4 — Email contact
  c.check(facts.hasMailto || facts.hasContactForm, 'There is a way to make contact in writing', {
    id: 'content-no-email',
    category: 'content',
    severity: 'medium',
    title: 'No email address or contact form',
    detail: 'Visitors who cannot phone during business hours have no way to get in touch.',
    recommendation: 'Add a monitored email address, a contact form, or both.',
    points: 12,
  });

  // 5 — About
  c.check(facts.hasAboutLink, 'The site explains who is behind the business', {
    id: 'content-no-about',
    category: 'content',
    severity: 'low',
    title: 'No About section',
    detail: 'Nothing on the page explains who runs the business, which weakens trust for a first-time visitor.',
    recommendation: 'Add an About page covering the team, history and credentials.',
    points: 7,
  });

  // 6 — Privacy policy
  c.check(facts.hasPrivacyPolicy, 'A privacy policy is linked', {
    id: 'content-no-privacy',
    category: 'content',
    severity: 'low',
    title: 'No privacy policy',
    detail: 'The site collects visitor data (forms, analytics) without publishing a privacy policy.',
    recommendation: 'Publish a privacy policy and link it in the footer.',
    points: 7,
  });

  // 7 — Freshness
  if (facts.copyrightYear === null) {
    c.pass('content');
  } else if (facts.copyrightYear < currentYear - 1) {
    c.fail({
      id: 'content-stale-copyright',
      category: 'content',
      severity: 'medium',
      title: `Site looks abandoned (copyright ${facts.copyrightYear})`,
      detail: `The footer still reads ${facts.copyrightYear}. Visitors read that as "this business may no longer be trading".`,
      recommendation: 'Update the copyright year automatically, and refresh the content so the site looks maintained.',
      points: 13,
    });
  } else {
    c.pass('content', 'Copyright year is current');
  }

  // 8 — Social proof
  c.check(facts.socialLinks.length > 0, `Linked social profiles: ${facts.socialLinks.join(', ')}`, {
    id: 'content-no-social',
    category: 'content',
    severity: 'low',
    title: 'No social media profiles linked',
    detail: 'The site links to no social profiles, so visitors cannot check recent activity or reviews.',
    recommendation: 'Link the active Facebook, Instagram or LinkedIn profiles from the header or footer.',
    points: 7,
  });
}

function runConversionChecks(c: IssueCollector, ctx: { facts: DocumentFacts }): void {
  const { facts } = ctx;

  // 1 — Contact form
  c.check(facts.hasContactForm, 'A contact form is available', {
    id: 'conv-no-contact-form',
    category: 'conversion',
    severity: 'high',
    title: 'No contact or enquiry form',
    detail: 'There is no form on the homepage, so an interested visitor has no low-friction way to start a conversation.',
    recommendation: 'Add a short enquiry form (name, phone, message) above the fold and send submissions to a monitored inbox.',
    points: 22,
  });

  // 2 — Click to call
  c.check(facts.hasTelLink, 'Click-to-call is enabled', {
    id: 'conv-no-click-to-call',
    category: 'conversion',
    severity: 'medium',
    title: 'Phone number is not click-to-call',
    detail: 'Mobile visitors cannot tap to dial, which is the fastest conversion path for a local business.',
    recommendation: 'Link every phone number with href="tel:…".',
    points: 14,
  });

  // 3 — Clear call to action
  c.check(facts.hasCta, 'The page has a clear call to action', {
    id: 'conv-no-cta',
    category: 'conversion',
    severity: 'high',
    title: 'No clear call to action',
    detail: 'No prominent "call now", "get a quote" or "book now" action was found, so the page does not tell visitors what to do next.',
    recommendation: 'Put one primary action in the header and repeat it at the end of each section.',
    points: 18,
  });

  // 4 — Booking
  c.check(facts.hasBooking, 'Online booking is available', {
    id: 'conv-no-booking',
    category: 'conversion',
    severity: 'medium',
    title: 'No online booking',
    detail: 'Appointments can only be made by phone during opening hours; after-hours demand is lost.',
    recommendation: 'Add online booking (an embedded scheduler is enough) so visitors can book at any time.',
    points: 13,
  });

  // 5 — Ordering / e-commerce
  c.check(facts.hasOrdering, 'Online ordering is available', {
    id: 'conv-no-ordering',
    category: 'conversion',
    severity: 'low',
    title: 'No online ordering or purchasing',
    detail: 'Products or services cannot be ordered through the site.',
    recommendation: 'Add online ordering or checkout if the business sells anything that can be bought without a conversation.',
    points: 9,
  });

  // 6 — Map
  c.check(facts.hasMapEmbed, 'A map shows visitors where to go', {
    id: 'conv-no-map',
    category: 'conversion',
    severity: 'low',
    title: 'No map or directions',
    detail: 'No embedded map was found, so visitors have to search for the location themselves.',
    recommendation: 'Embed a map on the contact section with a "Get directions" link.',
    points: 8,
  });

  // 7 — Analytics
  c.check(facts.hasAnalytics, 'Visitor analytics are installed', {
    id: 'conv-no-analytics',
    category: 'conversion',
    severity: 'medium',
    title: 'No analytics installed',
    detail: 'No analytics or pixel was detected, so there is no way to know how many visitors the site gets or what they do.',
    recommendation: 'Install Google Analytics 4 (or a privacy-friendly alternative) and track calls and form submissions as conversions.',
    points: 14,
  });
}
