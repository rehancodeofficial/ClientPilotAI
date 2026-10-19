/**
 * Business Digital Audit
 * ────────────────────────────────────────────────────────────────────────────
 * Combines two sources of evidence about a business:
 *
 *   1. Its website, examined in depth by ./websiteAudit — speed, search
 *      visibility, security, mobile, accessibility, content and conversion
 *      readiness, scored 0-100 with a letter grade and a prioritised issue list.
 *   2. Its public listing data (phone, reviews, OSM tags), which is all the
 *      evidence there is when a business has no website at all.
 *
 * Everything returned here is observed, never inferred by a model.
 */

import { isSafePublicUrl } from '../lib/security';
import {
  auditWebsite,
  gradeFor,
  normalizeWebsiteUrl,
  type WebsiteAuditReport,
  type WebsiteGrade,
} from './websiteAudit';

export type DetectionStatus = 'detected' | 'not_detected' | 'unknown';
export type DigitalMaturityLevel = 0 | 1 | 2 | 3 | 4;
export type EvidenceSource =
  | 'osm'
  | 'website'
  | 'website_crawl'
  | 'competitor_analysis'
  | 'user_input'
  | 'ai_inference';

export interface EvidenceItem {
  id: string;
  type: string;
  description: string;
  source: EvidenceSource;
  confidence: number;
  timestamp: string;
  isAiInference: boolean;
}

export interface AuditDataPayload {
  /** Legacy sub-scores, kept so existing dashboards keep working. */
  websiteScore: number;
  discoverabilityScore: number;
  engagementScore: number;
  conversionScore: number;
  informationScore: number;
  detectedServices: string[];
  technicalDetails?: {
    sslValid?: boolean;
    hasResponsiveMeta?: boolean;
    hasContactForm?: boolean;
    socialLinksCount?: number;
    crawlStatus?: string;
  };
  /** The full technical website report. Null when there is no website. */
  websiteAudit: WebsiteAuditReport | null;
  /** The website's own 0-100 health score, separate from the business score. */
  websiteHealthScore: number | null;
  websiteGrade: WebsiteGrade | null;
}

export interface BusinessAuditResult {
  websiteExists: DetectionStatus;
  httpsEnabled: DetectionStatus;
  mobileIndicator: DetectionStatus;
  bookingDetected: DetectionStatus;
  orderingDetected: DetectionStatus;
  contactFormDetected: DetectionStatus;
  socialPresenceDetected: DetectionStatus;
  digitalMaturityLevel: DigitalMaturityLevel;
  /** Overall digital-presence score for the business, 0-100. */
  auditScore: number;
  auditData: AuditDataPayload;
  evidence: EvidenceItem[];
}

/** Turns a boolean observation into the tri-state the database stores. */
const status = (value: boolean | null | undefined): DetectionStatus => {
  if (value === null || value === undefined) return 'unknown';
  return value ? 'detected' : 'not_detected';
};

let evidenceCounter = 0;
const evidenceId = (suffix: string): string =>
  `ev-${Date.now().toString(36)}-${(evidenceCounter += 1).toString(36)}-${suffix}`;

/**
 * Executes a full digital audit of a business.
 *
 * When a website is on record it is fetched and analysed in depth; the
 * resulting report is embedded in `auditData.websiteAudit` and drives the
 * headline score. When there is no website — or it cannot be reached — the
 * score reflects what little public presence remains, which is itself the
 * finding that matters for prospecting.
 */
export async function performDigitalAudit(
  businessName: string,
  _category: string,
  websiteUrl?: string | null,
  phone?: string | null,
  rating?: number | null,
  reviewCount?: number | null,
  _rawOsmTags?: Record<string, unknown> | null
): Promise<BusinessAuditResult> {
  const timestamp = new Date().toISOString();
  const evidence: EvidenceItem[] = [];
  const detectedServices: string[] = [];

  // ─── 1. Listing-level evidence ──────────────────────────────────────────────

  if (phone) {
    evidence.push({
      id: evidenceId('phone'),
      type: 'contact_telephone',
      description: `Direct phone number (${phone}) verified in public directory`,
      source: 'osm',
      confidence: 90,
      timestamp,
      isAiInference: false,
    });
  }

  if (reviewCount && reviewCount > 0) {
    evidence.push({
      id: evidenceId('reviews'),
      type: 'public_reviews',
      description: `${reviewCount} customer reviews recorded with average rating ${rating ?? 'n/a'}/5.0`,
      source: 'osm',
      confidence: 85,
      timestamp,
      isAiInference: false,
    });
  }

  // ─── 2. Website audit ───────────────────────────────────────────────────────

  const targetUrl = websiteUrl ? normalizeWebsiteUrl(websiteUrl) : '';
  let report: WebsiteAuditReport | null = null;

  if (targetUrl && isSafePublicUrl(targetUrl)) {
    report = await auditWebsite(targetUrl);
  } else if (targetUrl) {
    evidence.push({
      id: evidenceId('crawl-blocked'),
      type: 'crawler_diagnostics',
      description:
        'Website address points to a private, restricted or non-web host. Automated audit skipped for security.',
      source: 'website_crawl',
      confidence: 100,
      timestamp,
      isAiInference: false,
    });
  }

  const websiteExists: DetectionStatus = targetUrl ? 'detected' : 'not_detected';
  const checks = report?.checks ?? {};
  const reachable = report?.reachable === true;

  let httpsEnabled: DetectionStatus = 'not_detected';
  let mobileIndicator: DetectionStatus = 'unknown';
  let bookingDetected: DetectionStatus = 'not_detected';
  let orderingDetected: DetectionStatus = 'not_detected';
  let contactFormDetected: DetectionStatus = 'not_detected';
  let socialPresenceDetected: DetectionStatus = 'not_detected';

  if (!targetUrl) {
    evidence.push({
      id: evidenceId('nowebsite'),
      type: 'website_existence',
      description: `No public website registered for ${businessName}. Significant digital presence gap.`,
      source: 'osm',
      confidence: 90,
      timestamp,
      isAiInference: false,
    });
    mobileIndicator = 'not_detected';
  } else if (!reachable) {
    // The site is on record but does not load — worse than having none, because
    // customers who look for it find a broken page.
    httpsEnabled = 'unknown';
    mobileIndicator = 'unknown';
    bookingDetected = 'unknown';
    orderingDetected = 'unknown';
    contactFormDetected = 'unknown';
    socialPresenceDetected = 'unknown';

    evidence.push({
      id: evidenceId('unreachable'),
      type: 'website_availability',
      description: `Website ${targetUrl} could not be loaded (${report?.failureReason ?? 'request failed'}). Customers searching for this business reach a broken page.`,
      source: 'website_crawl',
      confidence: 95,
      timestamp,
      isAiInference: false,
    });
  } else if (report) {
    httpsEnabled = status(checks.isHttps === true);
    mobileIndicator = status(checks.hasViewport === true);
    bookingDetected = status(checks.hasBooking === true);
    orderingDetected = status(checks.hasOrdering === true);
    contactFormDetected = status(checks.hasContactForm === true);
    socialPresenceDetected = status(report.metrics.socialLinks.length > 0);

    if (checks.hasBooking === true) detectedServices.push('Online Appointment Booking');
    if (checks.hasOrdering === true) detectedServices.push('Online Ordering / E-Commerce');
    if (checks.hasContactForm === true) detectedServices.push('Interactive Contact Form');
    if (checks.hasClickToCall === true) detectedServices.push('Click-to-Call');
    if (checks.hasWhatsApp === true) detectedServices.push('WhatsApp Contact');
    if (checks.hasMapEmbed === true) detectedServices.push('Embedded Map / Directions');
    if (checks.hasAnalytics === true) detectedServices.push('Visitor Analytics');
    if (report.metrics.socialLinks.length > 0) {
      detectedServices.push(`Social Presence (${report.metrics.socialLinks.join(', ')})`);
    }

    // Headline evidence: the score itself, then the most serious findings.
    evidence.push({
      id: evidenceId('website-score'),
      type: 'website_health',
      description: `Website technical audit scored ${report.score}/100 (grade ${report.grade}) across ${report.categories.length} categories. ${report.verdict}`,
      source: 'website_crawl',
      confidence: 95,
      timestamp,
      isAiInference: false,
    });

    for (const category of report.categories) {
      evidence.push({
        id: evidenceId(`cat-${category.category}`),
        type: `website_${category.category}`,
        description: `${category.label}: ${category.score}/100 (${category.checksPassed} of ${category.checksTotal} checks passed)`,
        source: 'website_crawl',
        confidence: 92,
        timestamp,
        isAiInference: false,
      });
    }

    for (const issue of report.issues.filter((i) => i.severity === 'critical' || i.severity === 'high')) {
      evidence.push({
        id: evidenceId(issue.id),
        type: `issue_${issue.category}`,
        description: `${issue.title} — ${issue.detail}`,
        source: 'website_crawl',
        confidence: 90,
        timestamp,
        isAiInference: false,
      });
    }

    for (const strength of report.strengths.slice(0, 6)) {
      evidence.push({
        id: evidenceId('strength'),
        type: 'website_strength',
        description: strength,
        source: 'website_crawl',
        confidence: 90,
        timestamp,
        isAiInference: false,
      });
    }
  }

  // ─── 3. Digital maturity level ──────────────────────────────────────────────

  let digitalMaturityLevel: DigitalMaturityLevel = 0;

  if (websiteExists === 'detected' && reachable) {
    if (bookingDetected === 'detected' || orderingDetected === 'detected') {
      digitalMaturityLevel =
        mobileIndicator === 'detected' &&
        httpsEnabled === 'detected' &&
        socialPresenceDetected === 'detected'
          ? 4
          : 3;
    } else {
      digitalMaturityLevel = 2;
    }
  } else if (phone || (reviewCount && reviewCount > 0) || websiteExists === 'detected') {
    digitalMaturityLevel = 1;
  }

  // ─── 4. Scores ──────────────────────────────────────────────────────────────
  //
  // `websiteHealthScore` answers "how good is this website?" on its own terms.
  // `auditScore` answers "how strong is this business's digital presence?",
  // which also accounts for a business that is findable without a website.

  const websiteHealthScore = report && reachable ? report.score : null;

  const categoryScore = (name: string): number =>
    report?.categories.find((c) => c.category === name)?.score ?? 0;

  const discoverabilityScore = reachable
    ? Math.round(categoryScore('seo') * 0.7 + (reviewCount && reviewCount > 20 ? 30 : phone ? 18 : 6))
    : (reviewCount && reviewCount > 20 ? 45 : phone ? 30 : 10);

  const engagementScore = Math.round(
    (reviewCount && reviewCount > 50 ? 60 : reviewCount ? 40 : 15) +
      (report ? Math.min(25, report.metrics.socialLinks.length * 12) : 0) +
      (checks.hasAnalytics === true ? 15 : 0)
  );

  const conversionScore = reachable ? categoryScore('conversion') : 0;
  const informationScore = reachable
    ? categoryScore('content')
    : (phone ? 30 : 0) + (reviewCount ? 15 : 0);

  // Listing-only strength, used when there is no usable website.
  const listingScore = Math.min(
    100,
    (phone ? 40 : 0) + (reviewCount ? Math.min(35, reviewCount) : 0) + (rating && rating >= 4 ? 15 : 0)
  );

  const auditScore =
    websiteHealthScore !== null
      ? Math.round(websiteHealthScore * 0.75 + Math.min(100, discoverabilityScore) * 0.15 + Math.min(100, engagementScore) * 0.1)
      : Math.round(listingScore * 0.35); // no reachable website caps the business at 35

  return {
    websiteExists,
    httpsEnabled,
    mobileIndicator,
    bookingDetected,
    orderingDetected,
    contactFormDetected,
    socialPresenceDetected,
    digitalMaturityLevel,
    auditScore: Math.max(0, Math.min(100, auditScore)),
    auditData: {
      websiteScore: websiteHealthScore ?? 0,
      discoverabilityScore: Math.min(100, discoverabilityScore),
      engagementScore: Math.min(100, engagementScore),
      conversionScore,
      informationScore: Math.min(100, informationScore),
      detectedServices,
      technicalDetails: {
        sslValid: checks.isHttps === true,
        hasResponsiveMeta: checks.hasViewport === true,
        hasContactForm: checks.hasContactForm === true,
        socialLinksCount: report?.metrics.socialLinks.length ?? 0,
        crawlStatus: report
          ? report.reachable
            ? `http_${report.httpStatus}`
            : report.failureReason ?? 'unreachable'
          : 'no_website_provided',
      },
      websiteAudit: report,
      websiteHealthScore,
      websiteGrade: websiteHealthScore === null ? null : gradeFor(websiteHealthScore),
    },
    evidence,
  };
}

export { auditWebsite, gradeFor, normalizeWebsiteUrl };
export type { WebsiteAuditReport, WebsiteGrade };
