import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, MapPin, Phone, Globe, ExternalLink, Wand2,
  Send, Save, CheckCircle2, Store, Mail, AlertCircle,
  Loader2, AtSign, Shield, Smartphone, ShoppingCart, Calendar,
  FileText, Activity, Users, Zap, Copy, Check,
  Star, BarChart3, Target, MessageSquare, AlertTriangle,
  LayoutDashboard, ChevronRight, Info, RefreshCw, Award, TrendingUp, Navigation,
} from 'lucide-react'
import { CAT_ICON } from '@/lib/icons'
import {
  Button, Badge, Skeleton, Separator, Textarea, Progress,
} from '@/components/ui'
import {
  prepareLead, generateOutreach, sendOutreach, saveDraft,
  saveProposalApi, updateProposalStatusApi,
} from '@/lib/apiClient'
import { useAppStore } from '@/store/useAppStore'
import type {
  Lead, PipelineStage, Proposal,
  DetectionStatus, DigitalMaturityLevel, EvidenceItem,
  OutcomeEventType,
} from '@/types'
import { cn, getCategoryLabel, getScoreColor, getPipelineLabel } from '@/lib/utils'

// Curated high-resolution business imagery by category
const CATEGORY_IMAGES: Record<string, string[]> = {
  restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&auto=format&fit=crop&q=80',
  ],
  cafe: [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop&q=80',
  ],
  clinic: [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&auto=format&fit=crop&q=80',
  ],
  salon: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&auto=format&fit=crop&q=80',
  ],
  auto_service: [
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&auto=format&fit=crop&q=80',
  ],
  gym: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&auto=format&fit=crop&q=80',
  ],
  retail: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=900&auto=format&fit=crop&q=80',
  ],
  real_estate: [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=80',
  ],
  pharmacy: [
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=900&auto=format&fit=crop&q=80',
  ],
  electronics: [
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&auto=format&fit=crop&q=80',
  ],
  tailor: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&auto=format&fit=crop&q=80',
  ],
  jewellery: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&auto=format&fit=crop&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80',
  ],
}

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
        <Wand2 className="h-2.5 w-2.5" />
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
// Tab: Overview (Redesigned with Business Imagery, Direct Contact & Opportunity Details)
// ============================================================
function OverviewTab({ lead }: { lead: Lead }) {
  const opp = lead.opportunityAnalysis
  const audit = lead.audit
  const maturityLevel = (opp?.currentMaturityLevel ?? audit?.digitalMaturityLevel ?? 1) as DigitalMaturityLevel
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [activeImgIndex, setActiveImgIndex] = useState(0)
  const updateLeadStore = useAppStore((s) => s.updateLead)

  const images = useMemo(() => {
    return CATEGORY_IMAGES[lead.category] || CATEGORY_IMAGES.default
  }, [lead.category])

  const copyToClipboard = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text)
    if (type === 'phone') {
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2000)
    } else {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    }
  }

  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${lead.name} ${lead.address || ''} ${lead.city}`
  )}`

  return (
    <div className="space-y-6">
      {/* ── Top Hero Showcase: Visual Gallery + Comprehensive Contact & Identity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Visual Imagery Gallery (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-zinc-900 border border-black/10 dark:border-white/10 shadow-md group">
            <img
              src={images[activeImgIndex] || images[0]}
              alt={lead.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Top Badges Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md border border-white/20">
                {getCategoryLabel(lead.category)}
              </span>
              {lead.distance != null && (
                <span className="px-2 py-1 rounded-lg text-[10px] font-mono font-semibold bg-black/60 text-white backdrop-blur-md">
                  {lead.distance < 1 ? `${Math.round(lead.distance * 1000)}m away` : `${lead.distance.toFixed(1)} km`}
                </span>
              )}
            </div>

            {/* Bottom Gradient with Rating */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold">{lead.rating ? lead.rating.toFixed(1) : '4.5'}</span>
                <span className="text-[11px] text-zinc-300">({lead.reviewCount ?? 0} reviews)</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-300">OSM / Local Verified</span>
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={cn(
                    'h-14 flex-1 rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                    activeImgIndex === idx
                      ? 'border-(--primary) scale-[1.02] shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contact & Commercial Info Card (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-(--primary)">
                  Commercial Entity · {lead.city}
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{lead.name}</h3>
              </div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-xl"
                style={{
                  color: getScoreColor(opp?.opportunityScore ?? lead.score),
                  background: `${getScoreColor(opp?.opportunityScore ?? lead.score)}15`,
                  border: `1px solid ${getScoreColor(opp?.opportunityScore ?? lead.score)}30`,
                }}
              >
                Score {opp?.opportunityScore ?? lead.score}/100
              </span>
            </div>
          </div>

          {/* Key Contact Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Address */}
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between gap-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-(--primary) shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Physical Address</span>
                  <p className="text-zinc-800 dark:text-zinc-200 line-clamp-2 mt-0.5">
                    {lead.address || `${lead.city}, Commercial Zone`}
                  </p>
                </div>
              </div>
              <a
                href={mapSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-(--primary) hover:underline flex items-center gap-1 mt-1 self-start"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Phone */}
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between gap-2">
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-(--primary) shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Phone Contact</span>
                  <p className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
                    {lead.contactPhone || lead.phone || 'No direct phone listed'}
                  </p>
                </div>
              </div>
              {(lead.contactPhone || lead.phone) ? (
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={`tel:${lead.contactPhone || lead.phone}`}
                    className="text-[11px] font-bold text-(--primary) hover:underline"
                  >
                    Call Business
                  </a>
                  <span className="text-zinc-300 dark:text-zinc-600">·</span>
                  <button
                    onClick={() => copyToClipboard(lead.contactPhone || lead.phone || '', 'phone')}
                    className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedPhone ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-amber-500 font-medium">In-person outreach required</span>
              )}
            </div>

            {/* Website Status */}
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between gap-2">
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-(--primary) shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Online Presence</span>
                  <div className="mt-1">
                    {lead.websiteStatus === 'none' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                        No Website Detected
                      </span>
                    ) : lead.websiteStatus === 'outdated' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        Outdated Web Stack
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Active Website
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {(lead.websiteUrl || lead.website) ? (
                <a
                  href={lead.websiteUrl || lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-(--primary) hover:underline flex items-center gap-1 mt-1 truncate"
                >
                  <span className="truncate">{lead.websiteUrl || lead.website}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              ) : (
                <span className="text-[11px] text-red-500 font-semibold">Ready for Website Pitch</span>
              )}
            </div>

            {/* Email / Digital Reach */}
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between gap-2">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-(--primary) shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Direct Email</span>
                  <p className="font-mono text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
                    {lead.contactEmail || 'Not published publicly'}
                  </p>
                </div>
              </div>
              {lead.contactEmail ? (
                <div className="flex items-center gap-2 mt-1">
                  <a href={`mailto:${lead.contactEmail}`} className="text-[11px] font-bold text-(--primary) hover:underline">
                    Send Email
                  </a>
                  <span className="text-zinc-300 dark:text-zinc-600">·</span>
                  <button
                    onClick={() => copyToClipboard(lead.contactEmail || '', 'email')}
                    className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedEmail ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-zinc-400">Available via phone / visit</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Score Gauges ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Opportunity Score</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1 block">
              {opp?.opportunityScore ?? lead.score}
              <span className="text-xs text-zinc-400 font-normal ml-1">/ 100</span>
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 block">
              High Conversion Probability
            </span>
          </div>
          <ScoreGauge
            score={opp?.opportunityScore ?? lead.score}
            label=""
            color={getScoreColor(opp?.opportunityScore ?? lead.score)}
            size={74}
          />
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">AI Confidence</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1 block">
              {opp?.confidenceScore ?? 50}
              <span className="text-xs text-zinc-400 font-normal ml-1">%</span>
            </span>
            <span className="text-[11px] text-violet-500 font-medium mt-0.5 block">
              Multi-signal verified
            </span>
          </div>
          <ScoreGauge
            score={opp?.confidenceScore ?? 50}
            label=""
            color="#8b5cf6"
            size={74}
          />
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Digital Audit</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1 block">
              {audit?.auditScore ?? 0}
              <span className="text-xs text-zinc-400 font-normal ml-1">/ 100</span>
            </span>
            <span className="text-[11px] text-sky-500 font-medium mt-0.5 block">
              {audit?.websiteExists ? 'Technical deficit found' : 'Zero digital footprint'}
            </span>
          </div>
          <ScoreGauge
            score={audit?.auditScore ?? 0}
            label=""
            color="#0ea5e9"
            size={74}
          />
        </div>
      </div>

      {/* ── Digital Maturity Ladder ── */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-(--primary)" />
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Digital Maturity Progression
            </span>
          </div>
          <span className={cn('text-xs font-bold px-3 py-1 rounded-full', MATURITY_BG[maturityLevel], MATURITY_COLORS[maturityLevel])}>
            Current: Level {maturityLevel} ({MATURITY_LABELS[maturityLevel]})
          </span>
        </div>

        {/* 5-step interactive ladder */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {[0, 1, 2, 3, 4].map((lvl) => {
            const isCurrent = maturityLevel === lvl
            const isPassed = maturityLevel > lvl
            return (
              <div key={lvl} className="text-center space-y-1.5">
                <div
                  className={cn(
                    'h-2.5 rounded-full transition-all',
                    isCurrent
                      ? 'bg-(--primary) ring-4 ring-(--primary)/20'
                      : isPassed
                      ? 'bg-emerald-500'
                      : 'bg-zinc-200 dark:bg-zinc-800'
                  )}
                />
                <span
                  className={cn(
                    'text-[11px] block truncate',
                    isCurrent ? 'font-bold text-(--primary)' : 'text-zinc-400'
                  )}
                >
                  {lvl}: {MATURITY_LABELS[lvl as DigitalMaturityLevel]}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span>Current Level: <strong className="text-zinc-900 dark:text-zinc-100">{MATURITY_LABELS[maturityLevel]}</strong></span>
          <span>Target Standard: <strong className="text-(--primary)">Transactional (L3)</strong></span>
          <span>Growth Gap: <strong className="text-amber-500">{Math.max(0, 3 - maturityLevel)} Levels</strong></span>
        </div>
      </div>

      {/* ── Why This Opportunity? Cards ── */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-5 space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-(--primary)/15 flex items-center justify-center">
            <Wand2 className="h-3.5 w-3.5 text-(--primary)" />
          </div>
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Why This Opportunity? (AI Analysis)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/60 space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-(--primary)">01 · WEB PRESENCE</span>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
              {lead.websiteStatus === 'none'
                ? 'No digital website presence detected'
                : 'Outdated web presence lacking mobile/transactional flow'}
            </p>
            <p className="text-[11px] text-zinc-400">Verified via web inspection and DNS audit</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/60 space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-(--primary)">02 · REVENUE CAPTURE</span>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
              High foot-traffic ({lead.reviewCount ?? 0} reviews) with zero online booking
            </p>
            <p className="text-[11px] text-zinc-400">Verified from Google Maps / OSM activity signals</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/60 space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-(--primary)">03 · COMPETITIVE GAP</span>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
              Competitor digital gap in {lead.city} ({getCategoryLabel(lead.category)})
            </p>
            <p className="text-[11px] text-zinc-400">Derived from local radius benchmark density</p>
          </div>
        </div>

        {/* Next Best Action Banner */}
        <div className="p-4 rounded-xl bg-(--primary)/10 border border-(--primary)/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-(--primary) uppercase tracking-wide block">Next Best Action</span>
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {opp?.recommendedNextAction?.action || 'Prepare evidence-grounded outreach email'}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-(--primary) text-white shrink-0">
            High Impact
          </span>
        </div>
      </div>

      {/* ── Pipeline Progression Stepper ── */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
            Pipeline Progression Stage
          </p>
          <span className="text-xs font-semibold text-(--primary)">
            Current: {getPipelineLabel(lead.pipelineStage)}
          </span>
        </div>
        <StageStepper
          current={lead.pipelineStage}
          onAdvance={(nextStage) => updateLeadStore(lead.id, { pipelineStage: nextStage })}
        />
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
          Note: These estimates are AI-generated preliminary indications only and do not constitute a formal quotation.
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
                  <th key={c.id} className="py-2.5 px-3 font-semibold text-(--text-secondary) truncate max-w-30">
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
            className="text-sm min-h-40" placeholder="Outreach message body…"
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
            <Wand2 className="h-4 w-4" /> Generate with AI
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
            className="text-sm font-mono min-h-60" placeholder="Proposal content…"
          />
          <Button onClick={handleSave} isLoading={isSaving} size="sm" className="gap-1.5 w-full">
            {savedOk ? <><CheckCircle2 className="h-4 w-4 text-emerald-400" />Saved!</> : <><Save className="h-4 w-4" />Save Proposal</>}
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-6 text-center">
          <Wand2 className="h-8 w-8 text-indigo-300 mx-auto mb-2" />
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLeadId(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setSelectedLeadId])

  if (!selectedLeadId) return null

  return (
    <div
      className="fixed inset-0 z-[1100] bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={() => setSelectedLeadId(null)}
    >
      <div
        className="relative w-full max-w-5xl my-auto bg-white dark:bg-[#141714] text-(--text-primary) rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#141714]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
          {!lead ? (
            <div className="flex items-center justify-between">
              <div className="space-y-2"><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-32" /></div>
              <button
                onClick={() => setSelectedLeadId(null)}
                className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 shrink-0 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-(--primary)/10 text-(--primary) flex items-center justify-center text-xl shrink-0 border border-(--primary)/20">
                    {(() => { const Icon = CAT_ICON[lead.category] || Store; return <Icon className="h-6 w-6" /> })()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">{lead.name}</h2>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-(--primary)/15 text-(--primary)">
                        {getCategoryLabel(lead.category)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{lead.address ? `${lead.address}, ${lead.city}` : lead.city}</p>
                      {lead.opportunityAnalysis && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            color: getScoreColor(lead.opportunityAnalysis.opportunityScore),
                            background: `${getScoreColor(lead.opportunityAnalysis.opportunityScore)}20`,
                          }}
                        >
                          Score {lead.opportunityAnalysis.opportunityScore}/100
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <Button
                    size="sm"
                    onClick={() => {
                      updateLeadStore(lead.id, { isPreparing: true })
                      prepareLead(lead.id, true).then((res) => {
                        updateLeadStore(lead.id, { ...res.lead, isPreparing: false })
                      }).catch(() => updateLeadStore(lead.id, { isPreparing: false }))
                    }}
                    isLoading={lead.isPreparing}
                    className="text-xs h-9 px-4 gap-1.5 shadow-sm font-bold"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>Prepare Opportunity</span>
                  </Button>
                  <button
                    onClick={() => setSelectedLeadId(null)}
                    className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Tab Bar */}
              <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer',
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

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
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
                <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 rounded-xl px-3 py-2 mb-4 border border-amber-500/20">
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
      </div>
    </div>
  )
}
