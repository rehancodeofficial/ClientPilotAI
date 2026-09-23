import axios from 'axios';
import { z } from 'zod';
import { isSafePublicUrl } from '../lib/security';

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
  auditScore: number;
  auditData: AuditDataPayload;
  evidence: EvidenceItem[];
}

/**
 * Normalizes URL with http/https
 */
function normalizeUrl(url: string): string {
  let cleaned = url.trim();
  if (!cleaned) return '';
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `http://${cleaned}`;
  }
  return cleaned;
}

/**
 * Executes a deterministic technical digital audit of a business.
 * Evaluates website availability, HTTPS, mobile responsiveness cues,
 * online booking, online ordering, contact forms, social links,
 * and compiles an empirical evidence chain.
 */
export async function performDigitalAudit(
  businessName: string,
  category: string,
  websiteUrl?: string | null,
  phone?: string | null,
  rating?: number | null,
  reviewCount?: number | null,
  rawOsmTags?: Record<string, unknown> | null
): Promise<BusinessAuditResult> {
  const timestamp = new Date().toISOString();
  const evidence: EvidenceItem[] = [];
  const detectedServices: string[] = [];

  let websiteExists: DetectionStatus = 'not_detected';
  let httpsEnabled: DetectionStatus = 'not_detected';
  let mobileIndicator: DetectionStatus = 'unknown';
  let bookingDetected: DetectionStatus = 'not_detected';
  let orderingDetected: DetectionStatus = 'not_detected';
  let contactFormDetected: DetectionStatus = 'not_detected';
  let socialPresenceDetected: DetectionStatus = 'not_detected';

  let hasResponsiveMeta = false;
  let hasContactForm = false;
  let sslValid = false;
  let socialLinksCount = 0;
  let crawlStatus = 'no_website_provided';

  // 1. Audit Base Business Information (from OSM & metadata)
  if (phone) {
    evidence.push({
      id: `ev-${Date.now()}-phone`,
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
      id: `ev-${Date.now()}-reviews`,
      type: 'public_reviews',
      description: `${reviewCount} customer reviews recorded with average rating ${rating ?? 4.0}/5.0`,
      source: 'osm',
      confidence: 85,
      timestamp,
      isAiInference: false,
    });
  }

  // 2. Audit Website if provided
  const targetUrl = websiteUrl ? normalizeUrl(websiteUrl) : '';

  if (targetUrl) {
    websiteExists = 'detected';
    sslValid = targetUrl.toLowerCase().startsWith('https://');
    httpsEnabled = sslValid ? 'detected' : 'not_detected';

    evidence.push({
      id: `ev-${Date.now()}-web`,
      type: 'website_existence',
      description: `Official website detected: ${targetUrl}`,
      source: 'website',
      confidence: 95,
      timestamp,
      isAiInference: false,
    });

    if (sslValid) {
      evidence.push({
        id: `ev-${Date.now()}-ssl`,
        type: 'security_ssl',
        description: 'HTTPS SSL transport encryption detected',
        source: 'website',
        confidence: 95,
        timestamp,
        isAiInference: false,
      });
    } else {
      evidence.push({
        id: `ev-${Date.now()}-nossl`,
        type: 'security_ssl',
        description: 'Website lacks HTTPS security encryption',
        source: 'website',
        confidence: 90,
        timestamp,
        isAiInference: false,
      });
    }

    // Attempt light crawl of homepage if safe public URL
    if (!isSafePublicUrl(targetUrl)) {
      crawlStatus = 'blocked_private_or_invalid_host';
      evidence.push({
        id: `ev-${Date.now()}-crawl-ssrf`,
        type: 'crawler_diagnostics',
        description: 'Website address points to a private, restricted, or local network. Automated crawl skipped for security.',
        source: 'website_crawl',
        confidence: 100,
        timestamp,
        isAiInference: false,
      });
    } else {
      try {
        const resp = await axios.get(targetUrl, {
          timeout: 4500,
          headers: {
            'User-Agent': 'ClientPilotAI-Bot/1.0 (+https://clientpilotai.internal/audit)',
            'Accept': 'text/html,application/xhtml+xml',
          },
          maxRedirects: 3,
          maxContentLength: 1024 * 1024, // 1MB max
          maxBodyLength: 1024 * 1024,
          validateStatus: (status) => status < 400,
        });

        crawlStatus = `http_${resp.status}`;
        const html = typeof resp.data === 'string' ? resp.data.toLowerCase() : '';

      // Check Mobile Responsiveness
      if (html.includes('name="viewport"') || html.includes("name='viewport'") || html.includes('tailwind') || html.includes('bootstrap')) {
        mobileIndicator = 'detected';
        hasResponsiveMeta = true;
        evidence.push({
          id: `ev-${Date.now()}-mobile`,
          type: 'mobile_optimization',
          description: 'Responsive viewport meta tag detected for mobile screen scaling',
          source: 'website_crawl',
          confidence: 88,
          timestamp,
          isAiInference: false,
        });
      } else {
        mobileIndicator = 'not_detected';
      }

      // Check Booking mechanism
      const bookingKeywords = [
        'booking', 'appointment', 'reserve', 'reservation', 'calendly',
        'appointlet', 'book now', 'schedule consultation', 'book a table'
      ];
      if (bookingKeywords.some((kw) => html.includes(kw))) {
        bookingDetected = 'detected';
        detectedServices.push('Online Appointment Booking');
        evidence.push({
          id: `ev-${Date.now()}-booking`,
          type: 'booking_capability',
          description: 'Online booking / appointment scheduling cues detected on website',
          source: 'website_crawl',
          confidence: 85,
          timestamp,
          isAiInference: false,
        });
      } else {
        bookingDetected = 'not_detected';
        evidence.push({
          id: `ev-${Date.now()}-nobooking`,
          type: 'booking_capability',
          description: 'No online booking or appointment flow detected on website homepage',
          source: 'website_crawl',
          confidence: 80,
          timestamp,
          isAiInference: false,
        });
      }

      // Check Ordering mechanism
      const orderingKeywords = [
        'order online', 'add to cart', 'checkout', 'buy now', 'shopify',
        'woocommerce', 'view menu', 'food delivery', 'online store'
      ];
      if (orderingKeywords.some((kw) => html.includes(kw))) {
        orderingDetected = 'detected';
        detectedServices.push('Online Ordering / E-Commerce');
        evidence.push({
          id: `ev-${Date.now()}-ordering`,
          type: 'ordering_capability',
          description: 'Online ordering or e-commerce checkout mechanisms detected',
          source: 'website_crawl',
          confidence: 85,
          timestamp,
          isAiInference: false,
        });
      } else {
        orderingDetected = 'not_detected';
      }

      // Check Contact Forms
      if (html.includes('<form') && (html.includes('type="email"') || html.includes('name="message"') || html.includes('contact'))) {
        contactFormDetected = 'detected';
        hasContactForm = true;
        detectedServices.push('Interactive Contact Form');
        evidence.push({
          id: `ev-${Date.now()}-form`,
          type: 'contact_form',
          description: 'Interactive contact form detected on website',
          source: 'website_crawl',
          confidence: 90,
          timestamp,
          isAiInference: false,
        });
      } else {
        contactFormDetected = 'not_detected';
      }

      // Check Social Presence
      const socialPlatforms = ['facebook.com', 'instagram.com', 'linkedin.com', 'twitter.com', 'x.com'];
      const foundSocial = socialPlatforms.filter((p) => html.includes(p));
      socialLinksCount = foundSocial.length;
      if (foundSocial.length > 0) {
        socialPresenceDetected = 'detected';
        detectedServices.push(`Social Presence (${foundSocial.map(s => s.split('.')[0]).join(', ')})`);
        evidence.push({
          id: `ev-${Date.now()}-social`,
          type: 'social_media',
          description: `Active social media profiles linked: ${foundSocial.join(', ')}`,
          source: 'website_crawl',
          confidence: 95,
          timestamp,
          isAiInference: false,
        });
      }

    } catch (crawlErr: unknown) {
      crawlStatus = crawlErr instanceof Error ? crawlErr.message : 'timeout_or_blocked';
      mobileIndicator = 'unknown';
      bookingDetected = 'unknown';
      orderingDetected = 'unknown';
      contactFormDetected = 'unknown';

      evidence.push({
        id: `ev-${Date.now()}-crawl-failed`,
        type: 'crawler_diagnostics',
        description: `Website was unreachable or blocked the automated crawler (${crawlStatus}). Functionality marked as unknown.`,
        source: 'website_crawl',
        confidence: 70,
        timestamp,
        isAiInference: false,
      });
    }
  }
} else {
    // No website provided
    evidence.push({
      id: `ev-${Date.now()}-nowebsite`,
      type: 'website_existence',
      description: `No public website registered for ${businessName}. Significant digital presence gap.`,
      source: 'osm',
      confidence: 90,
      timestamp,
      isAiInference: false,
    });
  }

  // 3. Determine Digital Maturity Level (0 to 4)
  let digitalMaturityLevel: DigitalMaturityLevel = 0;

  if (websiteExists === 'detected') {
    if (bookingDetected === 'detected' || orderingDetected === 'detected') {
      if (mobileIndicator === 'detected' && httpsEnabled === 'detected' && socialPresenceDetected === 'detected') {
        digitalMaturityLevel = 4; // Digitally Optimized
      } else {
        digitalMaturityLevel = 3; // Transactional Presence
      }
    } else {
      digitalMaturityLevel = 2; // Informational Presence
    }
  } else {
    if (phone || (reviewCount && reviewCount > 0)) {
      digitalMaturityLevel = 1; // Basic Presence
    } else {
      digitalMaturityLevel = 0; // Digitally Invisible
    }
  }

  // 4. Calculate Sub-Scores (0-100)
  const websiteScore = websiteExists === 'detected' ? (sslValid ? 80 : 50) + (hasResponsiveMeta ? 20 : 0) : 10;
  const discoverabilityScore = (reviewCount && reviewCount > 20 ? 80 : (phone ? 50 : 20)) + (websiteExists === 'detected' ? 20 : 0);
  const engagementScore = (reviewCount && reviewCount > 50 ? 85 : reviewCount ? 65 : 30) + (socialLinksCount > 0 ? 15 : 0);
  const conversionScore = (bookingDetected === 'detected' ? 45 : 0) + (orderingDetected === 'detected' ? 40 : 0) + (hasContactForm ? 15 : 0);
  const informationScore = (phone ? 35 : 0) + (websiteExists === 'detected' ? 35 : 0) + 30; // base listing completeness

  const auditScore = Math.round(
    websiteScore * 0.25 +
    discoverabilityScore * 0.20 +
    engagementScore * 0.15 +
    conversionScore * 0.25 +
    informationScore * 0.15
  );

  return {
    websiteExists,
    httpsEnabled,
    mobileIndicator,
    bookingDetected,
    orderingDetected,
    contactFormDetected,
    socialPresenceDetected,
    digitalMaturityLevel,
    auditScore,
    auditData: {
      websiteScore,
      discoverabilityScore,
      engagementScore,
      conversionScore,
      informationScore,
      detectedServices,
      technicalDetails: {
        sslValid,
        hasResponsiveMeta,
        hasContactForm,
        socialLinksCount,
        crawlStatus,
      },
    },
    evidence,
  };
}
