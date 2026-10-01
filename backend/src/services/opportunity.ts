import { z } from 'zod';
import type { BusinessAuditResult, DigitalMaturityLevel, EvidenceItem } from './audit';
import { createAiClient, getResolvedModel, hasApiKey } from '../lib/aiConfig';

// ─── Output Schema ────────────────────────────────────────────────────────────

const RecommendedServiceSchema = z.object({
  service: z.string().min(1),
  category: z.string().min(1),
  detectedProblem: z.string().min(1),
  reason: z.string().min(1),
  expectedBenefit: z.string().min(1),
  estimatedComplexity: z.enum(['Low', 'Medium', 'High']).default('Medium'),
});

export type RecommendedService = z.infer<typeof RecommendedServiceSchema>;

const RecommendedNextActionSchema = z.object({
  action: z.string().min(1),
  channel: z.enum(['email', 'whatsapp', 'call', 'in_person']).default('email'),
  objective: z.string().min(1),
  rationale: z.string().min(1),
});

export type RecommendedNextAction = z.infer<typeof RecommendedNextActionSchema>;

const OpportunitySynthesisSchema = z.object({
  primaryOpportunity: z.string().min(1),
  secondaryOpportunities: z.array(z.string()).default([]),
  recommendedServices: z.array(RecommendedServiceSchema).default([]),
  estimatedComplexity: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  estimatedDuration: z.string().min(1),
  suggestedTeam: z.array(z.string()).default([]),
  preliminaryInvestmentRange: z.string().min(1),
  reasoning: z.array(z.string()).default([]),
  aiInferences: z.array(z.string()).default([]),
  recommendedNextAction: RecommendedNextActionSchema,
});

export interface OpportunityAnalysisResult {
  opportunityScore: number;
  confidenceScore: number;
  dimensions: {
    digitalGap: number;
    categoryFit: number;
    reviewActivity: number;
    marketDensity: number;
    competitorPresence: number;
    commercialPotential: number;
    businessNeed: number;
    evidenceQuality: number;
  };
  currentMaturityLevel: DigitalMaturityLevel;
  targetMaturityLevel: DigitalMaturityLevel;
  maturityGap: number;
  primaryOpportunity: string;
  secondaryOpportunities: string[];
  recommendedServices: RecommendedService[];
  estimatedScope: {
    projectType: string;
    complexity: 'Low' | 'Medium' | 'High';
    duration: string;
    suggestedTeam: string[];
    preliminaryInvestmentRange: string;
  };
  reasoning: string[];
  evidence: EvidenceItem[];
  recommendedNextAction: RecommendedNextAction;
}

/**
 * Maps category to commercial viability and target maturity standard
 */
function getCategoryStandards(category: string): { categoryFit: number; targetMaturity: DigitalMaturityLevel } {
  const cat = category.toLowerCase();
  if (['clinic', 'doctors', 'dentist'].some((k) => cat.includes(k))) {
    return { categoryFit: 10, targetMaturity: 3 }; // High need for appointments
  }
  if (['restaurant', 'cafe', 'fast_food', 'bakery'].some((k) => cat.includes(k))) {
    return { categoryFit: 9, targetMaturity: 3 }; // Need for online menu/ordering
  }
  if (['salon', 'spa', 'gym', 'fitness_centre'].some((k) => cat.includes(k))) {
    return { categoryFit: 9, targetMaturity: 3 }; // Need for scheduling & packages
  }
  if (['retail', 'shop', 'electronics', 'jewellery'].some((k) => cat.includes(k))) {
    return { categoryFit: 8, targetMaturity: 3 }; // Catalog & delivery
  }
  if (['real_estate', 'auto_service'].some((k) => cat.includes(k))) {
    return { categoryFit: 8, targetMaturity: 2 }; // Inquiries & portfolio
  }
  return { categoryFit: 7, targetMaturity: 2 };
}

/** Removes ```json fences some models wrap JSON responses in. */
function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith('```')) return trimmed;
  return trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
}

/**
 * Analyzes a business opportunity using a hybrid rule-based + AgentRouter LLM approach.
 * Never invents facts; anchors all outputs to the provided digital audit & evidence chain.
 */
export async function analyzeBusinessOpportunity(
  lead: {
    id: string;
    name: string;
    category: string;
    address: string;
    city: string;
    phone?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
    websiteUrl?: string | null;
  },
  audit: BusinessAuditResult,
  /** Optional: number of real competitors found in the same area (from competitors service) */
  nearbyCompetitorCount?: number | null
): Promise<OpportunityAnalysisResult> {
  const timestamp = new Date().toISOString();
  const evidenceList: EvidenceItem[] = [...audit.evidence];

  // 1. Rule-Based Feature Extraction
  const { categoryFit, targetMaturity } = getCategoryStandards(lead.category);
  const currentMaturity = audit.digitalMaturityLevel;
  const maturityGap = Math.max(0, targetMaturity - currentMaturity);

  // Digital Gap Score (0-10)
  let digitalGap = 10;
  if (audit.websiteExists === 'detected') {
    if (audit.digitalMaturityLevel >= 4) digitalGap = 2;
    else if (audit.digitalMaturityLevel === 3) digitalGap = 4;
    else digitalGap = 7;
  } else {
    digitalGap = 10;
  }

  // Review Activity Score (0-10)
  const reviews = lead.reviewCount ?? 0;
  const reviewActivity = reviews >= 100 ? 10 : reviews >= 50 ? 8 : reviews >= 15 ? 6 : reviews > 0 ? 4 : 2;

  // Market Density (0-10)
  // Derived from actual nearby competitor count when available.
  // If no competitor data was provided, we use 5 (neutral) to avoid inflating scores.
  const marketDensity: number = nearbyCompetitorCount != null
    ? Math.min(10, Math.round(1 + (nearbyCompetitorCount / 5))) // 0 competitors → 1, 20+ → 5
    : 5; // neutral — unknown, not inflated

  // Competitor Presence (0-10)
  // High competitor density = high demand = higher opportunity for the service agency.
  // Derived from same count as market density.
  const competitorPresence: number = nearbyCompetitorCount != null
    ? Math.min(10, Math.round(2 + (nearbyCompetitorCount / 4)))
    : 5; // neutral — unknown

  // Business Need Score (0-10)
  const businessNeed = Math.min(10, Math.round(digitalGap * 0.6 + maturityGap * 2.0));

  // Commercial Potential (0-10)
  const commercialPotential = Math.min(10, Math.round(categoryFit * 0.5 + reviewActivity * 0.3 + (reviews > 30 ? 2 : 1)));

  // Evidence Quality Score (0-10)
  const hasDirectWebsite = audit.websiteExists === 'detected';
  const hasDirectPhone = !!lead.phone;
  const hasReviews = reviews > 0;
  let evidenceQuality = 4;
  if (hasDirectPhone) evidenceQuality += 2;
  if (hasReviews) evidenceQuality += 2;
  if (hasDirectWebsite) evidenceQuality += 2;

  // 2. Compute Deterministic Mathematical Opportunity Score (0-100)
  // Weighted equation:
  const rawOpportunityScore = Math.round(
    digitalGap * 3.0 +
    businessNeed * 2.0 +
    categoryFit * 1.5 +
    commercialPotential * 1.5 +
    competitorPresence * 1.0 +
    reviewActivity * 1.0
  );
  const opportunityScore = Math.min(100, Math.max(10, rawOpportunityScore));

  // 3. Compute Independent Confidence Score (0-100%)
  // Measures data completeness, source verification, and lack of unknown values
  let confidenceScore = 40; // baseline
  if (hasDirectPhone) confidenceScore += 20;
  if (hasReviews) confidenceScore += 15;
  if (hasDirectWebsite && audit.auditData.technicalDetails?.crawlStatus?.startsWith('http')) {
    confidenceScore += 25; // website crawl succeeded
  } else if (!lead.websiteUrl) {
    confidenceScore += 15; // validated absence from directory
  }
  confidenceScore = Math.min(95, Math.max(25, confidenceScore));

  // 4. Formulate Prompt for AgentRouter Qualitative Synthesis
  const prompt = `
You are the Chief Opportunity Analyst of Client Pilot AI, an intelligent B2B business intelligence engine for software agencies.
Analyze the following empirical business data and digital audit findings.
Do NOT invent unobserved features. Ground all recommendations on the facts provided.

BUSINESS PROFILE:
- Name: "${lead.name}"
- Category: "${lead.category}"
- Location: "${lead.address}, ${lead.city}"
- Stated Phone: "${lead.phone || 'None'}"
- Reviews: ${lead.reviewCount ?? 0} (Avg Rating: ${lead.rating ?? 'N/A'}/5.0)

DIGITAL AUDIT FINDINGS:
- Website Status: ${audit.websiteExists} (URL: ${lead.websiteUrl || 'None'})
- HTTPS / SSL: ${audit.httpsEnabled}
- Mobile Scaling Meta: ${audit.mobileIndicator}
- Online Booking Detected: ${audit.bookingDetected}
- Online Ordering Detected: ${audit.orderingDetected}
- Contact Form Detected: ${audit.contactFormDetected}
- Social Presence: ${audit.socialPresenceDetected}
- Current Digital Maturity: Level ${currentMaturity} / 4
- Target Digital Maturity: Level ${targetMaturity} / 4 (Maturity Gap: ${maturityGap} levels)
- Calculated Opportunity Score: ${opportunityScore}/100
- Calculated Confidence Score: ${confidenceScore}%

TASK:
1. Provide a "primaryOpportunity" title (e.g. "Bespoke Online Booking & Consultation Portal" or "Modern Responsive Website & WhatsApp Ordering Flow").
2. Provide 2-3 "secondaryOpportunities".
3. Recommend 2-4 agency services formatted as:
   - service: name of service (e.g. "Appointment Booking System")
   - category: e.g. "Web Development" | "Conversion Optimization" | "Local SEO"
   - detectedProblem: exact finding from audit (e.g. "No booking mechanism detected on website")
   - reason: why this matters for their business
   - expectedBenefit: specific expected operational benefit (avoid fake revenue guarantees)
   - estimatedComplexity: "Low" | "Medium" | "High"
4. Provide estimated preliminary scope:
   - estimatedComplexity: "Low" | "Medium" | "High"
   - estimatedDuration: e.g. "3-5 weeks"
   - suggestedTeam: e.g. ["Frontend Developer", "Backend Developer", "UI/UX Designer"]
   - preliminaryInvestmentRange: e.g. "PKR 150,000 - 300,000" (Clearly labeled as preliminary estimate)
5. Provide 3-4 bullet points of explainable "reasoning" connecting the data points.
6. Provide "aiInferences" (conclusions derived logically from evidence).
7. Recommend a "recommendedNextAction":
   - action: clear step e.g. "Dispatch personalized digital audit outreach"
   - channel: "email" | "whatsapp" | "call"
   - objective: e.g. "Initiate conversation with business owner regarding booking modernization"
   - rationale: why this is the best next step

Return valid JSON conforming to the requested schema.
`;

  const systemInstruction = `You are a strict, evidence-driven B2B opportunity intelligence system. You never hallucinate website features or metrics. All statements must tie directly to the provided audit facts.`;

  let synthesis: z.infer<typeof OpportunitySynthesisSchema> = {
    primaryOpportunity: lead.websiteUrl ? 'Conversion & Booking Optimization' : 'Digital Presence & Website Development',
    secondaryOpportunities: ['Mobile Experience Refinement', 'Local SEO & Discoverability'],
    recommendedServices: [
      {
        service: lead.websiteUrl ? 'Online Appointment Flow' : 'Custom Responsive Website',
        category: 'Web Development',
        detectedProblem: lead.websiteUrl ? 'No online appointment mechanism detected' : 'No public website detected',
        reason: 'Customers in this category require instant digital access and booking capabilities.',
        expectedBenefit: 'Streamlined customer intake and 24/7 self-service engagement.',
        estimatedComplexity: 'Medium',
      },
    ],
    estimatedComplexity: 'Medium',
    estimatedDuration: '3-4 weeks',
    suggestedTeam: ['Frontend Developer', 'UI/UX Designer'],
    preliminaryInvestmentRange: 'PKR 150,000 - 250,000 (Preliminary Estimate)',
    reasoning: [
      `Digital maturity is currently at Level ${currentMaturity}, lagging behind the category standard of Level ${targetMaturity}.`,
      `Customer demand is demonstrated by ${reviews} existing public reviews.`,
    ],
    aiInferences: [
      'Customers are likely seeking digital channels based on category commercial density.',
    ],
    recommendedNextAction: {
      action: 'Send personalized audit outreach',
      channel: lead.phone ? 'whatsapp' : 'email',
      objective: 'Present digital gap findings to the decision maker',
      rationale: 'High opportunity score paired with verifiable public contact data.',
    },
  };

  try {
    if (hasApiKey()) {
      const client = createAiClient();
      const messages = [
        { role: 'system' as const, content: systemInstruction + '\nRespond with JSON matching the requested structure.' },
        { role: 'user' as const, content: prompt },
      ];

      let response;
      try {
        response = await client.chat.completions.create({
          model: getResolvedModel(),
          messages,
          temperature: 0.3,
          response_format: { type: 'json_object' },
        });
      } catch (formatError: unknown) {
        // Some AgentRouter models reject JSON mode; retry once without it.
        console.warn(
          '[OpportunityService] response_format not supported by model, retrying without JSON mode:',
          formatError instanceof Error ? formatError.message : String(formatError)
        );
        response = await client.chat.completions.create({
          model: getResolvedModel(),
          messages,
          temperature: 0.3,
        });
      }

      const text = response.choices[0]?.message?.content || '';
      if (text) {
        const parsed = JSON.parse(stripCodeFence(text));
        const validated = OpportunitySynthesisSchema.safeParse(parsed);
        if (validated.success) {
          synthesis = validated.data;
        }
      }
    }
  } catch (err: unknown) {
    console.warn('[OpportunityService] AgentRouter synthesis fallback used:', err instanceof Error ? err.message : String(err));
  }

  // Add AI inferences as flagged evidence items
  synthesis.aiInferences.forEach((inf, idx) => {
    evidenceList.push({
      id: `ev-${Date.now()}-inf-${idx}`,
      type: 'ai_opportunity_inference',
      description: inf,
      source: 'ai_inference',
      confidence: 75,
      timestamp,
      isAiInference: true,
    });
  });

  return {
    opportunityScore,
    confidenceScore,
    dimensions: {
      digitalGap,
      categoryFit,
      reviewActivity,
      marketDensity,
      competitorPresence,
      commercialPotential,
      businessNeed,
      evidenceQuality,
    },
    currentMaturityLevel: currentMaturity,
    targetMaturityLevel: targetMaturity,
    maturityGap,
    primaryOpportunity: synthesis.primaryOpportunity,
    secondaryOpportunities: synthesis.secondaryOpportunities,
    recommendedServices: synthesis.recommendedServices,
    estimatedScope: {
      projectType: synthesis.primaryOpportunity,
      complexity: synthesis.estimatedComplexity,
      duration: synthesis.estimatedDuration,
      suggestedTeam: synthesis.suggestedTeam,
      preliminaryInvestmentRange: synthesis.preliminaryInvestmentRange,
    },
    reasoning: synthesis.reasoning,
    evidence: evidenceList,
    recommendedNextAction: synthesis.recommendedNextAction,
  };
}
