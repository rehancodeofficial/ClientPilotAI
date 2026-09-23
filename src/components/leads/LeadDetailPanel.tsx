import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, MapPin, Phone, Globe, ExternalLink, Sparkles,
  Send, Save, CheckCircle2, Store, Mail, AlertCircle,
  Loader2, AtSign, Shield, Smartphone, ShoppingCart, Calendar,
  FileText, Activity, Users, Zap,
  Star, BarChart3, Target, MessageSquare, AlertTriangle,
  LayoutDashboard, ChevronRight, Info, RefreshCw, Award, TrendingUp,
} from 'lucide-react'
import { CAT_ICON } from '@/lib/icons'
import {
  Button, Badge, Sheet, Skeleton, Separator, Textarea, Progress,
} from '@/components/ui'
import {
  prepareLead, generateOutreach, sendOutreach, saveDraft,
  saveProposalApi, updateProposalStatusApi,
} from '@/lib/mockApi'
import { useAppStore } from '@/store/useAppStore'
import type {
  Lead, PipelineStage, Proposal,
  DetectionStatus, DigitalMaturityLevel, EvidenceItem,
  OutcomeEventType,
} from '@/types'
import { cn, getCategoryLabel, getScoreColor, getPipelineLabel } from '@/lib/utils'

// ============================================================
// Constants & helpers
// ============================================================
const STAGES: PipelineStage[] = ['discovery', 'qualified', 'contacted', 'client']

const MATURITY_LABELS: Record<DigitalMaturityLevel, string> = {
  0: 'Invisible',
  1: 'Basic',
  2: 'Informational',
  3: 'Transactional',
  4: 'Digitally Optimized',
}

const MATURITY_COLORS: Record<DigitalMaturityLevel, string> = {
  0: 'text-red-500',
  1: 'text-orange-500',
  2: 'text-yellow-500',
  3: 'text-blue-500',
  4: 'text-emerald-500',
}

const MATURITY_BG: Record<DigitalMaturityLevel, string> = {
  0: 'bg-red-100 dark:bg-red-950/50',
  1: 'bg-orange-100 dark:bg-orange-950/50',
  2: 'bg-yellow-100 dark:bg-yellow-950/50',
  3: 'bg-blue-100 dark:bg-blue-950/50',
  4: 'bg-emerald-100 dark:bg-emerald-950/50',
}

const OUTCOME_ICONS: Record<OutcomeEventType, typeof Activity> = {
  discovered: Target,
  audited: BarChart3,
  qualified: CheckCircle2,
  contacted: Send,
  replied: MessageSquare,
  meeting_booked: Calendar,
  proposal_sent: FileText,
  accepted: Award,
  rejected: AlertTriangle,
  won: Award,
  lost: AlertTriangle,
}

const OUTCOME_COLORS: Record<OutcomeEventType, string> = {
  discovered: 'text-blue-500',
  audited: 'text-indigo-500',
  qualified: 'text-cyan-500',
  contacted: 'text-violet-500',
  replied: 'text-purple-500',
  meeting_booked: 'text-sky-500',
  proposal_sent: 'text-amber-500',
  accepted: 'text-emerald-500',
  rejected: 'text-red-500',
  won: 'text-emerald-600',
  lost: 'text-red-600',
}

function detectionBadge(status: DetectionStatus) {
  if (status === 'detected') return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full"><CheckCircle2 className="h-3 w-3" />Detected</span>
  if (status === 'not_detected') return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/50 px-2 py-0.5 rounded-full"><X className="h-3 w-3" />Not Detected</span>
  return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full"><Info className="h-3 w-3" />Unknown</span>
}

function evidenceSourceBadge(source: EvidenceItem['source'], isAiInference: boolean) {
  const labels: Record<EvidenceItem['source'], string> = {
    osm: 'OpenStreetMap',
    website: 'Website Header/DNS',
    website_crawl: 'DOM Crawl',
    competitor_analysis: 'Competitor Engine',
    user_input: 'User Input',
    ai_inference: 'AI Inference',
  }

  if (isAiInference || source === 'ai_inference') {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700">
        <Sparkles className="h-2.5 w-2.5" />
        ✦ AI INFERENCE
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
      ✓ VERIFIED · {labels[source] || source}
    </span>
  )
}

// ============================================================
// Stage stepper
// ============================================================
function StageStepper({ current, onAdvance }: { current: PipelineStage; onAdvance: (s: PipelineStage) => void }) {
  const currentIdx = STAGES.indexOf(current)
  return (
    <div className="flex items-center gap-0">
      {STAGES.map((stage, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        return (
          <div key={stage} className="flex items-center flex-1">
            <button
              onClick={() => onAdvance(stage)}
              className="flex flex-col items-center gap-1 flex-1 group"
            >
              <motion.div
                animate={{ scale: active ? 1.1 : 1 }}
                className={cn(
                  'stage-dot text-xs',
                  done && 'completed',
                  active && 'active'
                )}
              >
                {done ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
              </motion.div>
              <span className={cn(
                'text-xs font-medium whitespace-nowrap',
                active ? 'text-indigo-600 dark:text-indigo-400' : done ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'
              )}>
                {getPipelineLabel(stage)}
              </span>
            </button>
            {i < STAGES.length - 1 && (
              <div className={cn('stage-connector', done ? 'filled' : '')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================
// Preparation Banner
// ============================================================
function PreparationBanner({ lead }: { lead: Lead }) {
  const steps = [
    'Running digital audit…',
    'Analyzing opportunity score…',
    'Benchmarking competitors…',
    'Enriching contact info…',
    'Generating evidence-grounded outreach…',
    'Drafting AI proposal…',
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
          Intelligence Engine preparing {lead.name}…
        </span>
      </div>
      <div className="space-y-1.5 pl-6">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-indigo-500 dark:text-indigo-400">
            <Loader2 className="h-3 w-3 animate-spin" style={{ animationDelay: `${i * 0.2}s` }} />
            {step}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ============================================================
// Score Gauge (circular)
// ============================================================
function ScoreGauge({
  score,
  label,
  color = '#6366f1',
  size = 80,
}: {
  score: number
  label: string
  color?: string
  size?: number
}) {
  const r = (size / 2) - 7
  const circumference = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: (1 - score / 100) * circumference }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold" style={{ color }}>{Math.round(score)}</span>
        </div>
      </div>
      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium text-center">{label}</span>
    </div>
  )
}

// ============================================================
// Tab: Overview
// ============================================================
function OverviewTab({ lead }: { lead: Lead }) {
  const opp = lead.opportunityAnalysis
  const audit = lead.audit
  const maturityLevel = (opp?.currentMaturityLevel ?? audit?.digitalMaturityLevel ?? 1) as DigitalMaturityLevel

  return (
    <div className="space-y-5">
      {/* Score Gauges */}
      <div className="flex items-start justify-around gap-4 py-3">
        <ScoreGauge
          score={opp?.opportunityScore ?? lead.score}
          label="Opportunity Score"
          color={getScoreColor(opp?.opportunityScore ?? lead.score)}
        />
        <ScoreGauge
          score={opp?.confidenceScore ?? 50}
          label="Confidence"
          color="#8b5cf6"
        />
        <ScoreGauge
          score={audit?.auditScore ?? 0}
          label="Digital Audit"
          color="#0ea5e9"
        />
      </div>

      {/* Digital Maturity Ladder (0 Invisible -> 4 Optimized) */}
      <div className="rounded-xl border border-(--border) bg-(--surface) p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-(--text-muted) uppercase tracking-wider">Digital Maturity Ladder</span>
          <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', MATURITY_BG[maturityLevel], MATURITY_COLORS[maturityLevel])}>
            Level {maturityLevel}: {MATURITY_LABELS[maturityLevel]}
          </span>
        </div>

        {/* 5-step interactive ladder */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {[0, 1, 2, 3, 4].map((lvl) => {
            const isCurrent = maturityLevel === lvl;
            const isPassed = maturityLevel > lvl;
            return (
              <div key={lvl} className="text-center space-y-1">
                <div
                  className={cn(
                    'h-2 rounded-full transition-all',
                    isCurrent
                      ? 'bg-(--primary) ring-2 ring-(--primary)/30'
                      : isPassed
                      ? 'bg-emerald-500'
                      : 'bg-(--border)'
                  )}
                />
                <span className={cn(
                  'text-[10px] block truncate',
                  isCurrent ? 'font-bold text-(--primary)' : 'text-(--text-muted)'
                )}>
                  {lvl}: {MATURITY_LABELS[lvl as DigitalMaturityLevel]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-(--text-secondary) pt-1 border-t border-(--border)">
          <span>Current: <strong className="text-(--text-primary)">{MATURITY_LABELS[maturityLevel]}</strong></span>
          <span>Target: <strong className="text-(--primary)">Transactional (L3)</strong></span>
          <span>Gap: <strong className="text-amber-500">{Math.max(0, 3 - maturityLevel)} Levels</strong></span>
        </div>
      </div>

      {/* WHY THIS OPPORTUNITY? Signature Explainer Component */}
      <div className="rounded-xl border border-(--border) bg-(--surface-raised) p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-(--primary-soft) flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-(--primary)" />
          </div>
          <span className="text-xs font-bold text-(--text-primary) uppercase tracking-wider">
            Why This Opportunity?
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2.5 p-2 rounded-lg bg-(--surface) border border-(--border)">
            <span className="font-mono text-[10px] font-bold text-(--primary) shrink-0 mt-0.5">01</span>
            <div>
              <p className="font-semibold text-(--text-primary)">
                {lead.websiteStatus === 'none'
                  ? 'No digital website presence detected'
                  : 'Outdated web presence lacking mobile/transactional flow'}
              </p>
              <p className="text-[11px] text-(--text-muted) mt-0.5">✓ Verified via web inspection and DNS audit</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-lg bg-(--surface) border border-(--border)">
            <span className="font-mono text-[10px] font-bold text-(--primary) shrink-0 mt-0.5">02</span>
            <div>
              <p className="font-semibold text-(--text-primary)">
                High customer volume ({lead.reviewCount ?? 0} reviews) with zero transactional capture
              </p>
              <p className="text-[11px] text-(--text-muted) mt-0.5">✓ Verified from Google Maps / OSM activity signals</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-lg bg-(--surface) border border-(--border)">
            <span className="font-mono text-[10px] font-bold text-(--primary) shrink-0 mt-0.5">03</span>
            <div>
              <p className="font-semibold text-(--text-primary)">
                Competitor digital gap in {lead.city} ({getCategoryLabel(lead.category)})
              </p>
              <p className="text-[11px] text-(--text-muted) mt-0.5">✓ Derived from local radius benchmark density</p>
            </div>
          </div>
        </div>

        {/* Next Best Action Banner */}
        <div className="mt-2 p-3 rounded-xl bg-(--primary-soft) border border-(--primary)/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-(--primary) uppercase tracking-wide">Next Best Action</span>
            <p className="text-xs font-semibold text-(--text-primary)">
              {opp?.recommendedNextAction?.action || 'Prepare evidence-grounded outreach email'}
            </p>
          </div>
          <Badge variant="default" className="text-[10px]">
            High Impact
          </Badge>
        </div>
      </div>

      {/* Primary Opportunity */}
      {opp?.primaryOpportunity && (
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 p-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Target className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Primary Opportunity</span>
          </div>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">{opp.primaryOpportunity}</p>
        </div>
      )}

      {/* Quick metadata */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
          <span>{lead.address}, {lead.city}</span>
        </div>
        {(lead.phone || lead.contactPhone) && (
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
            <span className="font-mono">{lead.contactPhone || lead.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-zinc-400 shrink-0" />
          <Badge variant={lead.websiteStatus === 'none' ? 'warning' : 'secondary'}>
            {lead.websiteStatus === 'none' ? 'No website detected' : lead.websiteStatus === 'outdated' ? 'Outdated site' : 'Has website'}
          </Badge>
          {(lead.websiteUrl || lead.website) && (
            <a
              href={lead.websiteUrl || lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-500 hover:underline flex items-center gap-0.5 truncate max-w-[140px]"
            >
              Visit <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          )}
        </div>
        {lead.rating && (
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Star className="h-4 w-4 text-amber-400 shrink-0" />
            <span>{lead.rating.toFixed(1)} ({lead.reviewCount ?? 0} reviews)</span>
          </div>
        )}
      </div>

      {/* Pipeline Stage */}
      <div>
        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-3">Pipeline Stage</p>
        <StageStepper current={lead.pipelineStage} onAdvance={() => {}} />
      </div>
    </div>
  )
}

// ============================================================
// Tab: Digital Audit
// ============================================================
function DigitalAuditTab({ lead }: { lead: Lead }) {
  const audit = lead.audit
  if (!audit) {
    return (
      <div className="rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-10 text-center">
        <BarChart3 className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-zinc-400">No audit data yet</p>
        <p className="text-xs text-zinc-400 mt-1">Run "Prepare Opportunity" to trigger the digital audit engine.</p>
      </div>
    )
  }

  const categoryScores = [
    { label: 'Website', value: audit.auditData.websiteScore, icon: Globe },
    { label: 'Discoverability', value: audit.auditData.discoverabilityScore, icon: TrendingUp },
    { label: 'Engagement', value: audit.auditData.engagementScore, icon: Users },
    { label: 'Conversion', value: audit.auditData.conversionScore, icon: Zap },
    { label: 'Information', value: audit.auditData.informationScore, icon: Info },
  ]

  const detectionItems = [
    { label: 'Website Presence', status: audit.websiteExists, icon: Globe },
    { label: 'HTTPS / SSL', status: audit.httpsEnabled, icon: Shield },
    { label: 'Mobile Responsive', status: audit.mobileIndicator, icon: Smartphone },
    { label: 'Online Booking', status: audit.bookingDetected, icon: Calendar },
    { label: 'Online Ordering', status: audit.orderingDetected, icon: ShoppingCart },
    { label: 'Contact Form', status: audit.contactFormDetected, icon: Mail },
    { label: 'Social Presence', status: audit.socialPresenceDetected, icon: Users },
  ]

  return (
    <div className="space-y-5">
      {/* Overall Audit Score */}
      <div className="flex items-center gap-4">
        <ScoreGauge score={audit.auditScore} label="Audit Score" color="#0ea5e9" />
        <div>
          <p className="text-lg font-black text-zinc-800 dark:text-zinc-100">{audit.auditScore}/100</p>
          <p className="text-xs text-zinc-500">Overall Digital Presence</p>
          <p className={cn('text-sm font-bold mt-1', MATURITY_COLORS[audit.digitalMaturityLevel])}>
            Level {audit.digitalMaturityLevel} — {MATURITY_LABELS[audit.digitalMaturityLevel]}
          </p>
        </div>
      </div>

      {/* Category Scores */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Category Breakdown</p>
        <div className="space-y-2">
          {categoryScores.map(({ label, value, icon: Icon }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{label}</span>
                </div>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{value}/100</span>
              </div>
              <Progress value={value} className="h-1.5" />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Feature Detection Grid */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">Feature Detection</p>
        <div className="grid grid-cols-1 gap-2">
          {detectionItems.map(({ label, status, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
              </div>
              {detectionBadge(status)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Tab: Opportunity
// ============================================================
function OpportunityTab({ lead }: { lead: Lead }) {
  const opp = lead.opportunityAnalysis
  if (!opp) {
    return (
      <div className="rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-10 text-center">
        <Target className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-zinc-400">No opportunity analysis yet</p>
        <p className="text-xs text-zinc-400 mt-1">Run "Prepare Opportunity" to compute the opportunity intelligence profile.</p>
      </div>
    )
  }

  const COMPLEXITY_COLOR: Record<string, string> = {
    Low: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/50',
    Medium: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/50',
    High: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-950/50',
  }

  return (
    <div className="space-y-5">
      {/* Score gauges */}
      <div className="flex items-start justify-around gap-4 py-2">
        <ScoreGauge score={opp.opportunityScore} label="Opportunity" color={getScoreColor(opp.opportunityScore)} />
        <ScoreGauge score={opp.confidenceScore} label="Confidence" color="#8b5cf6" />
      </div>

      {/* Primary Opportunity */}
      <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Target className="h-3.5 w-3.5 text-indigo-500" />
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Primary Opportunity</span>
        </div>
        <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">{opp.primaryOpportunity}</p>
      </div>

      {/* Secondary Opportunities */}
      {opp.secondaryOpportunities.length > 0 && (
        <div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Secondary Opportunities</p>
          <div className="space-y-1.5">
            {opp.secondaryOpportunities.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <ChevronRight className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Recommended Services */}
      {opp.recommendedServices.length > 0 && (
        <div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">Recommended Agency Services</p>
          <div className="space-y-2.5">
            {opp.recommendedServices.map((svc, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{svc.service}</p>
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', COMPLEXITY_COLOR[svc.estimatedComplexity])}>
                    {svc.estimatedComplexity}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{svc.detectedProblem}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">{svc.reason}</p>
                {svc.expectedBenefit && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">↗ {svc.expectedBenefit}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Project Scope Estimate */}
      <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4 border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-1.5 mb-3">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Preliminary Scope Estimate</p>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mb-3 italic">
          ⚠️ These estimates are AI-generated preliminary indications only and do not constitute a formal quotation.
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-[10px] text-zinc-500 uppercase">Type</p><p className="font-semibold text-zinc-800 dark:text-zinc-200">{opp.estimatedScope.projectType}</p></div>
          <div><p className="text-[10px] text-zinc-500 uppercase">Complexity</p><p className="font-semibold text-zinc-800 dark:text-zinc-200">{opp.estimatedScope.complexity}</p></div>
          <div><p className="text-[10px] text-zinc-500 uppercase">Duration</p><p className="font-semibold text-zinc-800 dark:text-zinc-200">{opp.estimatedScope.duration}</p></div>
          <div><p className="text-[10px] text-zinc-500 uppercase">Range</p><p className="font-semibold text-zinc-800 dark:text-zinc-200">{opp.estimatedScope.preliminaryInvestmentRange}</p></div>
        </div>
      </div>

      {/* Next Best Action */}
      {opp.recommendedNextAction && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Recommended Next Action</span>
          </div>
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mb-1">{opp.recommendedNextAction.action}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{opp.recommendedNextAction.rationale}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">{opp.recommendedNextAction.channel}</Badge>
            <span className="text-xs text-zinc-500">{opp.recommendedNextAction.objective}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Tab: Evidence
// ============================================================
function EvidenceTab({ lead }: { lead: Lead }) {
  const allEvidence: EvidenceItem[] = [
    ...(lead.audit?.evidence ?? []),
    ...(lead.opportunityAnalysis?.evidence ?? []),
  ]

  if (allEvidence.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-10 text-center">
        <Shield className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-zinc-400">No evidence collected yet</p>
        <p className="text-xs text-zinc-400 mt-1">Evidence is assembled during the audit and analysis phases.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Shield className="h-4 w-4 text-zinc-400" />
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{allEvidence.length} Evidence Items</p>
      </div>
      {allEvidence.map((item) => (
        <div key={item.id} className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-snug">{item.description}</p>
            {evidenceSourceBadge(item.source, item.isAiInference)}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
              <div className="h-1.5 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-full">
                <div className="h-1.5 bg-indigo-400 rounded-full" style={{ width: `${item.confidence}%` }} />
              </div>
              {item.confidence}% confidence
            </div>
            <span className="text-[9px] text-zinc-400">{new Date(item.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// Tab: Competitors
// ============================================================
function CompetitorsTab({ lead }: { lead: Lead }) {
  const analysis = lead.competitorAnalysis
  if (!analysis || analysis.competitors.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-10 text-center">
        <Users className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-zinc-400">No competitor data yet</p>
        <p className="text-xs text-zinc-400 mt-1">Competitor benchmarking runs during the intelligence preparation phase.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4 border border-zinc-200 dark:border-zinc-700">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Market Summary</p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Competitive Gaps */}
      {analysis.competitiveGaps.length > 0 && (
        <div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Identified Competitive Gaps</p>
          <div className="space-y-1.5">
            {analysis.competitiveGaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-zinc-700 dark:text-zinc-300">{gap}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitive Intelligence Feature Matrix */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Competitive Intelligence Matrix</p>
        <div className="overflow-x-auto rounded-xl border border-(--border)">
          <table className="w-full text-xs text-left">
            <thead className="bg-(--surface-raised) text-(--text-muted) border-b border-(--border)">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Capability</th>
                <th className="py-2.5 px-3 font-bold text-(--primary) bg-(--primary-soft)/30">Target ({lead.name})</th>
                {analysis.competitors.slice(0, 2).map((c, i) => (
                  <th key={c.id} className="py-2.5 px-3 font-semibold text-(--text-secondary) truncate max-w-[120px]">
                    Peer {i + 1}: {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border) bg-(--surface)">
              <tr>
                <td className="py-2 px-3 font-medium text-(--text-secondary)">Website Presence</td>
                <td className="py-2 px-3 font-bold bg-(--primary-soft)/20">
                  {analysis.targetComparison.targetHasWebsite ? <span className="text-emerald-500 font-bold">✓ Detected</span> : <span className="text-red-500 font-bold">✕ None</span>}
                </td>
                {analysis.competitors.slice(0, 2).map((c) => (
                  <td key={c.id} className="py-2 px-3">
                    {c.websiteExists ? <span className="text-emerald-500">✓ Detected</span> : <span className="text-zinc-400">✕ None</span>}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-(--text-secondary)">Online Booking Flow</td>
                <td className="py-2 px-3 font-bold bg-(--primary-soft)/20">
                  {analysis.targetComparison.targetHasBooking ? <span className="text-emerald-500 font-bold">✓ Detected</span> : <span className="text-red-500 font-bold">✕ Missing</span>}
                </td>
                {analysis.competitors.slice(0, 2).map((c) => (
                  <td key={c.id} className="py-2 px-3">
                    {c.bookingExists ? <span className="text-emerald-500">✓ Available</span> : <span className="text-zinc-400">✕ None</span>}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-(--text-secondary)">Online Ordering</td>
                <td className="py-2 px-3 font-bold bg-(--primary-soft)/20">
                  <span className="text-red-500 font-bold">✕ None</span>
                </td>
                {analysis.competitors.slice(0, 2).map((c) => (
                  <td key={c.id} className="py-2 px-3">
                    {c.orderingExists ? <span className="text-emerald-500">✓ Available</span> : <span className="text-zinc-400">✕ None</span>}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-(--text-secondary)">Digital Maturity Level</td>
                <td className="py-2 px-3 font-bold bg-(--primary-soft)/20 text-(--primary)">
                  Level {analysis.targetComparison.targetMaturity}
                </td>
                {analysis.competitors.slice(0, 2).map((c) => (
                  <td key={c.id} className="py-2 px-3 font-semibold text-(--text-primary)">
                    Level {c.digitalMaturity}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Competitor List */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Local Peers ({analysis.competitors.length})</p>
        <div className="space-y-2">
          {analysis.competitors.map((peer) => (
            <div key={peer.id} className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{peer.name}</p>
                  {peer.address && <p className="text-[11px] text-zinc-400 truncate">{peer.address}</p>}
                </div>
                <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', MATURITY_BG[peer.digitalMaturity as DigitalMaturityLevel], MATURITY_COLORS[peer.digitalMaturity as DigitalMaturityLevel])}>
                  L{peer.digitalMaturity}
                </span>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {peer.websiteExists && <span className="text-[10px] bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">Website</span>}
                {peer.bookingExists && <span className="text-[10px] bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 px-2 py-0.5 rounded-full font-medium">Booking</span>}
                {peer.orderingExists && <span className="text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">Ordering</span>}
                {peer.rating && <span className="text-[10px] bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full font-medium">★ {peer.rating.toFixed(1)}</span>}
                {peer.distanceKm && <span className="text-[10px] bg-zinc-100 dark:bg-zinc-700 text-zinc-500 px-2 py-0.5 rounded-full">{peer.distanceKm.toFixed(1)} km</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Tab: Outreach (evidence-grounded)
// ============================================================
function OutreachTab({ lead }: { lead: Lead }) {
  const updateLeadStore = useAppStore((s) => s.updateLead)
  const updateLeadOutreachStore = useAppStore((s) => s.updateLeadOutreach)

  const firstMsg = lead.outreachMessages?.[0]
  const [subject, setSubject] = useState(() => lead.outreachSubject ?? firstMsg?.subject ?? '')
  const [body, setBody] = useState(() => lead.outreachBody ?? firstMsg?.body ?? '')
  const [recipientEmail, setRecipientEmail] = useState(() => lead.contactEmail ?? '')
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastSyncedOutreachRef = useRef<string | null>(null)
  const lastSyncedEmailRef = useRef<string | undefined>(lead.contactEmail)

  useEffect(() => {
    const nextSubject = lead.outreachSubject ?? firstMsg?.subject ?? ''
    const nextBody = lead.outreachBody ?? firstMsg?.body ?? ''
    const syncKey = [lead.id, lead.outreachGeneratedAt ?? '', firstMsg?.id ?? '', nextSubject, nextBody].join('|')
    if ((!nextSubject && !nextBody) || lastSyncedOutreachRef.current === syncKey) return
    setSubject(nextSubject); setBody(nextBody)
    lastSyncedOutreachRef.current = syncKey
  }, [lead.id, lead.outreachGeneratedAt, lead.outreachSubject, lead.outreachBody, firstMsg?.id, firstMsg?.subject, firstMsg?.body])

  useEffect(() => {
    if (!lead.contactEmail || lead.contactEmail === lastSyncedEmailRef.current) return
    setRecipientEmail(lead.contactEmail)
    lastSyncedEmailRef.current = lead.contactEmail
  }, [lead.contactEmail])

  const handleRegenerate = async () => {
    setIsRegenerating(true); setError(null); setSentSuccess(false)
    try {
      const generated = await generateOutreach(lead.id)
      const nextSubject = generated.subject ?? ''; const nextBody = generated.body ?? ''
      const generatedAt = generated.generatedAt ?? new Date().toISOString()
      if (!nextBody.trim()) throw new Error('AI did not return an outreach message.')
      setSubject(nextSubject); setBody(nextBody)
      updateLeadStore(lead.id, { outreachSubject: nextSubject, outreachBody: nextBody, outreachStatus: 'draft', outreachGeneratedAt: generatedAt, lastError: null })
      updateLeadOutreachStore(lead.id, { ...generated, subject: nextSubject, body: nextBody, status: 'draft', generatedAt })
    } catch (e) { setError(e instanceof Error ? e.message : 'AI generation failed') }
    finally { setIsRegenerating(false) }
  }

  const handleSend = async () => {
    if (!body.trim()) return
    if (!recipientEmail.trim()) { setError('Add the recipient email address before sending.'); return }
    setIsSending(true); setError(null)
    try {
      await sendOutreach(lead.id, { subject, body, status: 'sent' }, recipientEmail)
      setSentSuccess(true)
      updateLeadStore(lead.id, { outreachStatus: 'sent', outreachSentAt: new Date().toISOString() })
      setTimeout(() => setSentSuccess(false), 3000)
    } catch (e) { setError(e instanceof Error ? e.message : 'Send failed') }
    finally { setIsSending(false) }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true); setError(null)
    try {
      await saveDraft(lead.id, { subject, body, status: 'draft' })
      setSavedSuccess(true)
      updateLeadStore(lead.id, { outreachSubject: subject, outreachBody: body, outreachStatus: 'draft' })
      setTimeout(() => setSavedSuccess(false), 2000)
    } catch (e) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setIsSaving(false) }
  }

  const hasContent = !!(body.trim())

  return (
    <div className="space-y-4">
      {/* Evidence Used badge */}
      {lead.opportunityAnalysis && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
          <Shield className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
          <p className="text-xs text-indigo-700 dark:text-indigo-400">
            Outreach generated using <span className="font-bold">{(lead.audit?.evidence?.length ?? 0) + (lead.opportunityAnalysis?.evidence?.length ?? 0)} evidence items</span> from the intelligence engine.
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 rounded-lg px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
        </div>
      )}

      {lead.isPreparing ? (
        <div className="space-y-2">
          <div className="h-7 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
          <div className="h-32 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
        </div>
      ) : hasContent ? (
        <div className="space-y-3">
          {/* Recipient */}
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">Recipient Email</label>
            <div className="flex items-center gap-2">
              <AtSign className="h-4 w-4 text-zinc-400 shrink-0" />
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="business@example.com"
                className="flex-1 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          {/* Subject */}
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">Subject</label>
            <input
              type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Body */}
          <Textarea
            value={body} onChange={(e) => setBody(e.target.value)}
            className="text-sm min-h-[160px]" placeholder="Outreach message body…"
          />
          {/* WhatsApp variant */}
          {firstMsg?.whatsappBody && (
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-1">WhatsApp Variant</p>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">{firstMsg.whatsappBody}</p>
            </div>
          )}
          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={handleRegenerate} isLoading={isRegenerating} variant="outline" size="sm" className="gap-1.5">
              <RefreshCw className="h-4 w-4" /> Regenerate
            </Button>
            <Button onClick={handleSend} isLoading={isSending} size="sm" className="gap-1.5">
              {sentSuccess ? <><CheckCircle2 className="h-4 w-4 text-emerald-400" />Sent!</> : <><Send className="h-4 w-4" />Send</>}
            </Button>
            <Button onClick={handleSaveDraft} isLoading={isSaving} variant="outline" size="sm" className="gap-1.5">
              {savedSuccess ? <><CheckCircle2 className="h-4 w-4 text-emerald-500" />Saved</> : <><Save className="h-4 w-4" />Save Draft</>}
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-6 text-center">
          <Mail className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Outreach is generated automatically during intelligence preparation. Click the button below to regenerate.
          </p>
          <Button onClick={handleRegenerate} isLoading={isRegenerating} size="sm" className="mt-3 gap-1.5">
            <Sparkles className="h-4 w-4" /> Generate with AI
          </Button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Tab: Proposal
// ============================================================
const STATUSES_LIST: Proposal['status'][] = ['draft', 'submitted', 'reviewed', 'replied', 'accepted', 'rejected']
const STATUS_LABELS: Record<Proposal['status'], string> = {
  draft: 'Draft', submitted: 'Submitted', reviewed: 'Reviewed',
  replied: 'Replied', accepted: 'Accepted', rejected: 'Rejected',
}

function ProposalTab({ lead }: { lead: Lead }) {
  const proposals = useAppStore((s) => s.proposals)
  const addProposal = useAppStore((s) => s.addProposal)
  const updateProposalStatusStore = useAppStore((s) => s.updateProposalStatus)

  const existingProposal = useMemo(() => proposals.find(p => p.leadId === lead.id), [proposals, lead.id])
  const [proposalTitle, setProposalTitle] = useState(() => existingProposal?.title || `AI Proposal — ${lead.name}`)
  const [proposalContent, setProposalContent] = useState(() => lead.proposalContent || existingProposal?.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!proposalTitle || !proposalContent) return
    setIsSaving(true); setError(null)
    try {
      const saved = await saveProposalApi({ leadId: lead.id, title: proposalTitle, content: proposalContent, status: existingProposal?.status || 'draft' })
      addProposal(saved); setSavedOk(true); setTimeout(() => setSavedOk(false), 3000)
    } catch (e) { setError(e instanceof Error ? e.message : 'Save failed') }
    finally { setIsSaving(false) }
  }

  const handleStatusChange = async (newStatus: Proposal['status']) => {
    if (!existingProposal) return
    updateProposalStatusStore(existingProposal.id, newStatus)
    try { await updateProposalStatusApi(existingProposal.id, newStatus) }
    catch (err) { console.error('Failed to update proposal status:', err); updateProposalStatusStore(existingProposal.id, existingProposal.status) }
  }

  const hasContent = !!(proposalContent || existingProposal?.content)

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 rounded-lg px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
        </div>
      )}
      {lead.isPreparing ? (
        <div className="space-y-2">
          <div className="h-7 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
          <div className="h-40 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
        </div>
      ) : hasContent ? (
        <div className="space-y-3">
          {/* Status selector */}
          {existingProposal && (
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">Proposal Status</label>
              <div className="flex gap-1.5 flex-wrap">
                {STATUSES_LIST.map((s) => (
                  <button key={s} onClick={() => handleStatusChange(s)}
                    className={cn('text-xs px-3 py-1 rounded-full font-medium transition-colors',
                      existingProposal.status === s ? 'bg-(--primary) text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    )}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Title */}
          <input type="text" value={proposalTitle} onChange={(e) => setProposalTitle(e.target.value)}
            className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {/* Content */}
          <Textarea value={proposalContent} onChange={(e) => setProposalContent(e.target.value)}
            className="text-sm font-mono min-h-[240px]" placeholder="Proposal content…"
          />
          <Button onClick={handleSave} isLoading={isSaving} size="sm" className="gap-1.5 w-full">
            {savedOk ? <><CheckCircle2 className="h-4 w-4 text-emerald-400" />Saved!</> : <><Save className="h-4 w-4" />Save Proposal</>}
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-6 text-center">
          <Sparkles className="h-8 w-8 text-indigo-300 mx-auto mb-2" />
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Proposal is generated automatically during intelligence preparation.
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Tab: Activity (Outcome Events)
// ============================================================
function ActivityTab({ lead }: { lead: Lead }) {
  const events = lead.outcomeEvents ?? []
  if (events.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-10 text-center">
        <Activity className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-zinc-400">No events recorded yet</p>
        <p className="text-xs text-zinc-400 mt-1">Events are logged as the opportunity progresses through the pipeline.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">{events.length} Events</p>
      {events.map((event) => {
        const Icon = OUTCOME_ICONS[event.eventType] ?? Activity
        const colorClass = OUTCOME_COLORS[event.eventType] ?? 'text-zinc-400'
        return (
          <div key={event.id} className="flex items-start gap-3 py-2.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', colorClass)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 capitalize">{event.eventType.replace(/_/g, ' ')}</p>
              {event.notes && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{event.notes}</p>}
              <p className="text-[10px] text-zinc-400 mt-1">{new Date(event.eventDate).toLocaleDateString()} · {event.source.replace(/_/g, ' ')}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================
// Tab definitions
// ============================================================
type TabId = 'overview' | 'audit' | 'opportunity' | 'evidence' | 'competitors' | 'outreach' | 'proposal' | 'activity'

const TABS: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'audit', label: 'Audit', icon: BarChart3 },
  { id: 'opportunity', label: 'Opportunity', icon: Target },
  { id: 'evidence', label: 'Evidence', icon: Shield },
  { id: 'competitors', label: 'Competitors', icon: Users },
  { id: 'outreach', label: 'Outreach', icon: Send },
  { id: 'proposal', label: 'Proposal', icon: FileText },
  { id: 'activity', label: 'Activity', icon: Activity },
]


// ============================================================
// Main Lead Detail Panel
// ============================================================
export function LeadDetailPanel() {
  const selectedLeadId = useAppStore((s) => s.selectedLeadId)
  const setSelectedLeadId = useAppStore((s) => s.setSelectedLeadId)
  const updateLeadStore = useAppStore((s) => s.updateLead)
  const addProposal = useAppStore((s) => s.addProposal)
  const leads = useAppStore((s) => s.leads)
  const discoveryResults = useAppStore((s) => s.discoveryResults)
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const lead = useMemo(
    () =>
      leads.find((l) => l.id === selectedLeadId) ??
      discoveryResults.find((l) => l.id === selectedLeadId) ??
      null,
    [leads, discoveryResults, selectedLeadId]
  )

  const preparedLeadRef = useRef<string | null>(null)

  useEffect(() => {
    if (!lead || preparedLeadRef.current === lead.id) return
    const alreadyPrepared = !!(lead.outreachBody && lead.proposalContent)
    if (alreadyPrepared) { preparedLeadRef.current = lead.id; return }
    preparedLeadRef.current = lead.id
    updateLeadStore(lead.id, { isPreparing: true })
    prepareLead(lead.id)
      .then((result) => {
        updateLeadStore(lead.id, { ...result.lead, isPreparing: false })
        if (result.proposalContent) {
          addProposal({
            id: `ai-${lead.id}`,
            leadId: lead.id,
            workspaceId: '',
            title: result.proposalTitle || `AI Proposal — ${lead.name}`,
            content: result.proposalContent,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        }
        if (result.partialError) console.warn('[Prepare] Partial error:', result.partialError)
      })
      .catch((err) => {
        console.error('[Prepare] Failed:', err)
        updateLeadStore(lead.id, { isPreparing: false, lastError: err instanceof Error ? err.message : 'Preparation failed' })
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id])

  useEffect(() => {
    if (!selectedLeadId) { preparedLeadRef.current = null; setActiveTab('overview') }
  }, [selectedLeadId])



  return (
    <Sheet open={!!selectedLeadId} onClose={() => setSelectedLeadId(null)} width="w-[600px]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-5 py-4">
        {!lead ? (
          <div className="flex items-center justify-between">
            <div className="space-y-2"><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-32" /></div>
            <button onClick={() => setSelectedLeadId(null)} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl shrink-0">
                  {(() => { const Icon = CAT_ICON[lead.category] || Store; return <Icon className="h-6 w-6" /> })()}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">{lead.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{getCategoryLabel(lead.category)} · {lead.city}</p>
                    {lead.opportunityAnalysis && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: getScoreColor(lead.opportunityAnalysis.opportunityScore), background: `${getScoreColor(lead.opportunityAnalysis.opportunityScore)}20` }}>
                        Score {lead.opportunityAnalysis.opportunityScore}
                      </span>
                    )}
                  </div>
                </div>
              </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      updateLeadStore(lead.id, { isPreparing: true })
                      prepareLead(lead.id, true).then((res) => {
                        updateLeadStore(lead.id, { ...res.lead, isPreparing: false })
                      }).catch(() => updateLeadStore(lead.id, { isPreparing: false }))
                    }}
                    isLoading={lead.isPreparing}
                    className="text-xs h-8 px-3 gap-1.5 shadow-sm"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Prepare Opportunity</span>
                  </Button>
                  <button
                    onClick={() => setSelectedLeadId(null)}
                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-(--surface-hover) text-(--text-muted) hover:text-(--text-primary) transition-colors shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

            {/* Tab Bar */}
            <div className="flex gap-0.5 overflow-x-auto scrollbar-hide -mx-1 px-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0',
                    activeTab === id
                      ? 'bg-(--primary) text-white shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {!lead ? (
          <div className="space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : (
          <>
            {/* Preparation / error banners */}
            <AnimatePresence>
              {lead.isPreparing && (
                <motion.div key="prep-banner" className="mb-4">
                  <PreparationBanner lead={lead} />
                </motion.div>
              )}
            </AnimatePresence>
            {lead.lastError && !lead.isPreparing && (
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 rounded-lg px-3 py-2 mb-4">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                Partial enrichment: {lead.lastError}
              </div>
            )}

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === 'overview' && <OverviewTab lead={lead} />}
                {activeTab === 'audit' && <DigitalAuditTab lead={lead} />}
                {activeTab === 'opportunity' && <OpportunityTab lead={lead} />}
                {activeTab === 'evidence' && <EvidenceTab lead={lead} />}
                {activeTab === 'competitors' && <CompetitorsTab lead={lead} />}
                {activeTab === 'outreach' && <OutreachTab key={lead.id} lead={lead} />}
                {activeTab === 'proposal' && <ProposalTab key={`prop-${lead.id}`} lead={lead} />}
                {activeTab === 'activity' && <ActivityTab lead={lead} />}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </Sheet>
  )
}
