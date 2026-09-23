// ============================================================
// Core Domain Types
// ============================================================

export type PipelineStage = 'discovery' | 'qualified' | 'contacted' | 'client';

export type WebsiteStatus = 'none' | 'outdated' | 'has_website';

export type ScoreBand = 'high' | 'medium' | 'low';

export type BusinessCategory =
  | 'restaurant'
  | 'retail'
  | 'salon'
  | 'clinic'
  | 'auto_service'
  | 'bakery'
  | 'pharmacy'
  | 'tailor'
  | 'cafe'
  | 'gym'
  | 'electronics'
  | 'jewellery'
  | 'real_estate'
  | 'catering';

// ============================================================
// Score Breakdown
// ============================================================

export interface ScoreBreakdown {
  digitalPresenceGap: number; // 0-10
  categoryFit: number; // 0-10
  reviewActivity: number; // 0-10
  marketDensity: number; // 0-10
  competitorPresence: number; // 0-10
}

// ============================================================
// Outreach Message
// ============================================================

export interface OutreachMessage {
  id?: string;
  subject: string;
  body: string;
  followUp?: string;       // Short follow-up email variant
  whatsappBody?: string;   // WhatsApp/short outreach variant
  generatedAt?: string;    // ISO date string
  createdAt?: string;
  status?: 'draft' | 'sent';
  variant?: number;        // 1 or 2 (for "regenerate" toggle)
}

export interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done' | 'error';
}

// ============================================================
// Lead (core entity)
// ============================================================

export interface Lead {
  id: string;
  name: string;
  category: BusinessCategory;
  address: string;
  city: 'Karachi' | 'Lahore' | 'Islamabad' | 'Rawalpindi' | 'Faisalabad';
  phone?: string;
  rating?: number; // 1.0 - 5.0
  reviewCount?: number;
  websiteStatus: WebsiteStatus;
  websiteUrl?: string; // only if has_website or outdated
  score: number; // 0-100
  scoreBreakdown: ScoreBreakdown;
  pipelineStage: PipelineStage;
  discoveredAt: string; // ISO date string
  distance?: number; // km from search center
  aiAnalysis: string; // GPT reasoning text
  outreachMessages: OutreachMessage[]; // Outreach message variants
  latitude?: number;
  longitude?: number;

  // --- Lead contact enrichment fields ---
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  contactSource?: 'osm_tag' | 'website_homepage' | 'website_contact_page' | 'none' | 'manual';
  contactConfidence?: number;

  // --- AI outreach draft fields ---
  outreachSubject?: string;
  outreachBody?: string;
  outreachStatus?: 'draft' | 'approved' | 'sent';
  outreachGeneratedAt?: string;
  outreachSentAt?: string;

  // --- AI proposal draft fields ---
  proposalContent?: string;
  proposalStatus?: 'draft' | 'submitted' | 'reviewed' | 'replied' | 'accepted' | 'rejected';
  proposalGeneratedAt?: string;

  // --- AI/enrichment metadata ---
  lastEnrichmentRunAt?: string;
  lastError?: string | null;
  isPreparing?: boolean;   // transient UI flag — not persisted

  // --- FYP Intelligence Engine fields ---
  audit?: DigitalAudit;
  opportunityAnalysis?: OpportunityAnalysis;
  competitorAnalysis?: CompetitorAnalysisResult;
  outcomeEvents?: OutcomeEvent[];
}



// ============================================================
// Discovery / Search
// ============================================================

export interface DiscoveryParams {
  location: string;
  categories: BusinessCategory[];
  radiusKm: number;
}

export interface DiscoveryResult {
  leads: Lead[];
  totalFound: number;
  filteredCount: number;
  searchedAt: string;
}

// ============================================================
// Pipeline
// ============================================================

export interface PipelineColumn {
  stage: PipelineStage;
  label: string;
  leads: Lead[];
}

// ============================================================
// Dashboard Analytics
// ============================================================

export interface StatCard {
  label: string;
  value: number | string;
  trend: number; // percentage change vs last week, can be negative
  sparkline: number[]; // 7 data points
}

export interface ActivityEvent {
  id: string;
  type: 'scored' | 'outreach_sent' | 'stage_changed' | 'discovered';
  leadName: string;
  detail: string;
  timestamp: string; // ISO date string
}

export interface DashboardStats {
  totalLeads: number;
  qualifiedLeads: number;
  outreachSent: number;
  conversionRate: number;
  leadsPerDay: { date: string; count: number }[];
  funnelData: { stage: string; count: number }[];
  scoreBandData: { band: string; count: number }[];
  recentActivity: ActivityEvent[];
  // FYP Business Opportunity Intelligence Metrics
  highValueOpportunities?: number;
  avgOpportunityScore?: number;
  avgConfidenceScore?: number;
  digitalGapsDetected?: number;
}

// ============================================================
// App State (zustand)
// ============================================================

export interface FilterState {
  scoreBand: ScoreBand | 'all';
  category: BusinessCategory | 'all';
  pipelineStage: PipelineStage | 'all';
  sortBy: 'score' | 'distance' | 'name' | 'discoveredAt';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
}

// ============================================================
// Notifications
// ============================================================

export type NotificationType = 'lead' | 'proposal' | 'pipeline' | 'outreach' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO date string
  read: boolean;
  leadId?: string;
}

// ============================================================
// Digital Maturity & Evidence Engine Types (FYP Intelligence)
// ============================================================

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
  confidence: number; // 0 - 100
  timestamp: string;
  isAiInference: boolean;
}

export interface DigitalAudit {
  id?: string;
  leadId: string;
  workspaceId: string;
  websiteExists: DetectionStatus;
  httpsEnabled: DetectionStatus;
  mobileIndicator: DetectionStatus;
  bookingDetected: DetectionStatus;
  orderingDetected: DetectionStatus;
  contactFormDetected: DetectionStatus;
  socialPresenceDetected: DetectionStatus;
  digitalMaturityLevel: DigitalMaturityLevel;
  auditScore: number; // 0 - 100
  auditData: {
    websiteScore: number; // 0 - 100
    discoverabilityScore: number; // 0 - 100
    engagementScore: number; // 0 - 100
    conversionScore: number; // 0 - 100
    informationScore: number; // 0 - 100
    detectedServices: string[];
    technicalDetails?: {
      sslValid?: boolean;
      hasResponsiveMeta?: boolean;
      hasContactForm?: boolean;
      socialLinksCount?: number;
    };
  };
  evidence: EvidenceItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RecommendedServiceItem {
  service: string;
  category: string;
  detectedProblem: string;
  reason: string;
  expectedBenefit: string;
  estimatedComplexity: 'Low' | 'Medium' | 'High';
}

export interface RecommendedNextAction {
  action: string;
  channel: 'email' | 'whatsapp' | 'call' | 'in_person';
  objective: string;
  rationale: string;
}

export interface OpportunityAnalysis {
  id?: string;
  leadId: string;
  workspaceId: string;
  opportunityScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100%
  dimensions: {
    digitalGap: number; // 0 - 10
    categoryFit: number; // 0 - 10
    reviewActivity: number; // 0 - 10
    marketDensity: number; // 0 - 10
    competitorPresence: number; // 0 - 10
    commercialPotential: number; // 0 - 10
    businessNeed: number; // 0 - 10
    evidenceQuality: number; // 0 - 10
  };
  currentMaturityLevel: DigitalMaturityLevel;
  targetMaturityLevel: DigitalMaturityLevel;
  maturityGap: number;
  primaryOpportunity: string;
  secondaryOpportunities: string[];
  recommendedServices: RecommendedServiceItem[];
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
  createdAt?: string;
  updatedAt?: string;
}

export interface CompetitorPeer {
  id: string;
  name: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
  websiteExists: boolean;
  bookingExists: boolean;
  orderingExists: boolean;
  digitalMaturity: DigitalMaturityLevel;
  distanceKm?: number;
}

export interface CompetitorAnalysisResult {
  id?: string;
  leadId: string;
  workspaceId: string;
  competitors: CompetitorPeer[];
  targetComparison: {
    targetMaturity: DigitalMaturityLevel;
    competitorAvgMaturity: number;
    targetHasBooking: boolean;
    competitorsWithBookingPct: number;
    targetHasWebsite: boolean;
    competitorsWithWebsitePct: number;
  };
  competitiveGaps: string[];
  summary: string;
  createdAt?: string;
}

export type OutcomeEventType =
  | 'discovered'
  | 'audited'
  | 'qualified'
  | 'contacted'
  | 'replied'
  | 'meeting_booked'
  | 'proposal_sent'
  | 'accepted'
  | 'rejected'
  | 'won'
  | 'lost';

export interface OutcomeEvent {
  id: string;
  leadId: string;
  workspaceId: string;
  eventType: OutcomeEventType;
  eventDate: string;
  source: 'user_action' | 'system_pipeline' | 'email_outreach';
  notes?: string;
  createdAt?: string;
}

export interface OpportunityZone {
  zoneName: string;
  centerLat: number;
  centerLng: number;
  totalOpportunities: number;
  avgOpportunityScore: number;
  avgMaturityLevel: number;
  topCategory: string;
  highPriorityCount: number;
}

export interface MarketIntelligenceStats {
  totalOpportunities: number;
  avgOpportunityScore: number;
  avgConfidenceScore: number;
  digitalMaturityDistribution: { level: DigitalMaturityLevel; label: string; count: number }[];
  topCategoryOpportunities: { category: string; count: number; avgScore: number }[];
  digitalGapDistribution: { gap: string; percentage: number; count: number }[];
  opportunityZones: OpportunityZone[];
}

export interface ModelEvaluationStats {
  totalAnalyzed: number;
  totalWithOutcomes: number;
  scoreBands: {
    band: '80-100 (High)' | '60-79 (Medium)' | '0-59 (Low)';
    leadCount: number;
    replies: number;
    proposalsSent: number;
    wonDeals: number;
    replyRatePct: number;
    conversionRatePct: number;
  }[];
  evidenceQualityStats: {
    avgConfidencePct: number;
    verifiedContactsPct: number;
    directCrawlCoveragePct: number;
  };
  researchMetrics: {
    correlationDescription: string;
    hasSufficientData: boolean;
    sampleSize: number;
  };
}

export interface Proposal {
  id: string;
  leadId: string;
  workspaceId: string;
  title: string;
  content: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'replied' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  leads?: {
    business_name: string;
    category: string;
    address: string;
    city: string;
  };
}

export interface AppState {
  leads: Lead[];
  selectedLeadId: string | null;
  filters: FilterState;
  discoveryResults: Lead[];
  isDiscovering: boolean;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  userRole: 'admin' | 'user' | null;
  userEmail: string | null;
  proposals: Proposal[];
  notifications: Notification[];
  isDemoMode: boolean;
  selectedDemoScenario: string | null;

  // Actions
  setLeads: (leads: Lead[]) => void;
  setSelectedLeadId: (id: string | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setDiscoveryResults: (leads: Lead[]) => void;
  setIsDiscovering: (val: boolean) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setUserRole: (role: 'admin' | 'user' | null) => void;
  setUserEmail: (email: string | null) => void;
  updateLeadStage: (id: string, stage: PipelineStage) => void;
  updateLeadOutreach: (id: string, message: OutreachMessage) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  setProposals: (proposals: Proposal[]) => void;
  addProposal: (proposal: Proposal) => void;
  updateProposalStatus: (id: string, status: Proposal['status']) => void;
  deleteProposal: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  setIsDemoMode: (val: boolean) => void;
  setSelectedDemoScenario: (scenario: string | null) => void;
}

