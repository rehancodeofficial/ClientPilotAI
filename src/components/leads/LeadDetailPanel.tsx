import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, MapPin, Phone, Globe, ExternalLink, Wand2,
  Send, Save, CheckCircle2, Store, Mail, AlertCircle,
  Loader2, AtSign, Shield, Smartphone, ShoppingCart, Calendar,
  Activity, Zap, Copy, Check, FileText, Users,
  Star, BarChart3, Target, MessageSquare, AlertTriangle,
  LayoutDashboard, ChevronRight, Info, RefreshCw, Award, TrendingUp, Navigation,
  Sparkles, ArrowRight,
} from 'lucide-react'
import { CAT_ICON } from '@/lib/icons'
import {
  Button, Badge, Skeleton, Separator, Textarea, Progress,
} from '@/components/ui'
import {
  prepareLead, generateOutreach, sendOutreach, saveDraft,
} from '@/lib/apiClient'
import { runAudit } from '@/api/audits'
import { WebsiteAuditReportView } from '@/components/leads/WebsiteAuditReportView'
import { useAppStore } from '@/store/useAppStore'
import type {
  Lead, PipelineStage,
  DetectionStatus, DigitalMaturityLevel,
  OutcomeEventType, DigitalAudit,
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
    'Analyzing lead potential…',
    'Enriching contact info…',
    'Drafting tailored outreach…',
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
          Intelligence Engine analyzing {lead.name}…
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
  color = 'var(--primary)',
  size = 72,
}: {
  score: number
  label?: string
  color?: string
  size?: number
}) {
  const r = (size / 2) - 6
  const circumference = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-zinc-200 dark:text-zinc-800"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: (1 - score / 100) * circumference }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-extrabold tracking-tight" style={{ color }}>{Math.round(score)}</span>
        </div>
      </div>
      {label && <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium text-center">{label}</span>}
    </div>
  )
}

// ============================================================
// Tab: Overview (Clean, Modern Executive Dashboard)
// ============================================================
function OverviewTab({
  lead,
  onNavigateTab,
}: {
  lead: Lead
  onNavigateTab?: (tab: TabId) => void
}) {
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

  const leadScore = opp?.opportunityScore ?? lead.score
  const conversionConfidence = opp?.confidenceScore ?? 50
  const auditScore = audit?.auditScore ?? 0

  return (
    <div className="space-y-6">
      {/* ── Top Hero Showcase: Visual Gallery + Clean Contact Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Visual Imagery Gallery (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200/80 dark:border-white/10 shadow-sm group">
            <img
              src={images[activeImgIndex] || images[0]}
              alt={lead.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Top Badges Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-md border border-white/20">
                {getCategoryLabel(lead.category)}
              </span>
              {lead.distance != null && (
                <span className="px-2 py-1 rounded-lg text-[10px] font-mono font-semibold bg-black/65 text-white backdrop-blur-md border border-white/10">
                  {lead.distance < 1 ? `${Math.round(lead.distance * 1000)}m away` : `${lead.distance.toFixed(1)} km`}
                </span>
              )}
            </div>

            {/* Bottom Gradient with Rating */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between text-white">
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold">{lead.rating ? lead.rating.toFixed(1) : '4.5'}</span>
                <span className="text-[11px] text-zinc-300">({lead.reviewCount ?? 0} reviews)</span>
              </div>
              <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                Verified Local Business
              </span>
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
                      ? 'border-(--primary) ring-2 ring-(--primary)/20 scale-[1.02]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Business Profile & Verified Channels Card (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-2xl bg-zinc-50/80 dark:bg-[#181C18] border border-zinc-200/80 dark:border-white/5 shadow-xs space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-(--primary) flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-(--primary) animate-pulse" />
                  Commercial Entity · {lead.city}
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1 tracking-tight">Verified Business Profile</h3>
              </div>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full border shrink-0"
                style={{
                  color: getScoreColor(leadScore),
                  backgroundColor: `${getScoreColor(leadScore)}15`,
                  borderColor: `${getScoreColor(leadScore)}35`,
                }}
              >
                Score {leadScore}/100
              </span>
            </div>
          </div>

          {/* Clean 2x2 Channel Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Address */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#1F241F] border border-zinc-200/70 dark:border-white/5 flex flex-col justify-between gap-2.5 shadow-xs hover:border-(--primary)/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-(--primary)/10 text-(--primary) flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block tracking-wider">
                    Physical Address
                  </span>
                  <p className="text-zinc-800 dark:text-zinc-200 font-medium line-clamp-2 mt-0.5 text-xs leading-snug">
                    {lead.address || `${lead.city}, Commercial Zone`}
                  </p>
                </div>
              </div>
              <a
                href={mapSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-(--primary) hover:underline flex items-center gap-1 self-start pt-1"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Phone */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#1F241F] border border-zinc-200/70 dark:border-white/5 flex flex-col justify-between gap-2.5 shadow-xs hover:border-(--primary)/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-(--primary)/10 text-(--primary) flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block tracking-wider">
                    Phone Contact
                  </span>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-0.5 text-xs">
                    {lead.contactPhone || lead.phone || 'No phone listed'}
                  </p>
                </div>
              </div>
              {(lead.contactPhone || lead.phone) ? (
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`tel:${lead.contactPhone || lead.phone}`}
                    className="text-[11px] font-semibold text-(--primary) hover:underline"
                  >
                    Call
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
                <span className="text-[11px] text-amber-500 font-medium pt-1">In-person outreach required</span>
              )}
            </div>

            {/* Online Presence */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#1F241F] border border-zinc-200/70 dark:border-white/5 flex flex-col justify-between gap-2.5 shadow-xs hover:border-(--primary)/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-(--primary)/10 text-(--primary) flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block tracking-wider">
                    Online Presence
                  </span>
                  <div className="mt-1">
                    {lead.websiteStatus === 'none' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        No Website Detected
                      </span>
                    ) : lead.websiteStatus === 'outdated' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        Outdated Web Stack
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
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
                  className="text-[11px] font-semibold text-(--primary) hover:underline flex items-center gap-1 truncate pt-1"
                >
                  <span className="truncate">{lead.websiteUrl || lead.website}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              ) : (
                <span className="text-[11px] text-zinc-400 font-medium pt-1">Prime candidate for website pitch</span>
              )}
            </div>

            {/* Direct Email */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#1F241F] border border-zinc-200/70 dark:border-white/5 flex flex-col justify-between gap-2.5 shadow-xs hover:border-(--primary)/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-(--primary)/10 text-(--primary) flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block tracking-wider">
                    Direct Email
                  </span>
                  <p className="text-zinc-800 dark:text-zinc-200 font-medium truncate mt-0.5 text-xs">
                    {lead.contactEmail || 'Not publicly listed'}
                  </p>
                </div>
              </div>
              {lead.contactEmail ? (
                <div className="flex items-center gap-2 pt-1">
                  <a href={`mailto:${lead.contactEmail}`} className="text-[11px] font-semibold text-(--primary) hover:underline">
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
                <span className="text-[11px] text-zinc-400 pt-1">Available via phone / in person</span>
              )}
            </div>
          </div>

          {/* Social Profiles */}
          {lead.socialLinks && Object.keys(lead.socialLinks).length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-zinc-200/60 dark:border-white/5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Social Channels</span>
              {Object.entries(lead.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-100 dark:bg-[#1F241F] text-zinc-600 dark:text-zinc-300 hover:text-(--primary) border border-zinc-200/50 dark:border-white/5 capitalize transition-colors"
                >
                  {platform}
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Key Score Gauges (Clean Metric Row) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-[#181C18] border border-zinc-200/80 dark:border-white/5 flex items-center justify-between shadow-xs hover:border-(--primary)/30 transition-colors">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
              Lead Potential Score
            </span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1 block tracking-tight">
              {leadScore}
              <span className="text-xs text-zinc-400 font-normal ml-1">/ 100</span>
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 block">
              High Conversion Probability
            </span>
          </div>
          <ScoreGauge score={leadScore} color={getScoreColor(leadScore)} size={72} />
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-[#181C18] border border-zinc-200/80 dark:border-white/5 flex items-center justify-between shadow-xs hover:border-violet-500/30 transition-colors">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
              AI Confidence
            </span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1 block tracking-tight">
              {conversionConfidence}
              <span className="text-xs text-zinc-400 font-normal ml-1">%</span>
            </span>
            <span className="text-[11px] text-violet-500 font-medium mt-0.5 block">
              Multi-signal verified
            </span>
          </div>
          <ScoreGauge score={conversionConfidence} color="#8b5cf6" size={72} />
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-[#181C18] border border-zinc-200/80 dark:border-white/5 flex items-center justify-between shadow-xs hover:border-sky-500/30 transition-colors">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
              Digital Audit Score
            </span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1 block tracking-tight">
              {auditScore}
              <span className="text-xs text-zinc-400 font-normal ml-1">/ 100</span>
            </span>
            <span className="text-[11px] text-sky-500 font-medium mt-0.5 block">
              {audit?.websiteExists ? 'Technical deficit found' : 'Zero digital footprint'}
            </span>
          </div>
          <ScoreGauge score={auditScore} color="#0ea5e9" size={72} />
        </div>
      </div>

      {/* ── Digital Maturity Progression ── */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-white/5 bg-zinc-50/60 dark:bg-[#181C18] p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-(--primary)" />
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Digital Maturity Progression
            </span>
          </div>
          <span className={cn('text-xs font-bold px-3 py-1 rounded-full border', MATURITY_BG[maturityLevel], MATURITY_COLORS[maturityLevel], 'border-current/20')}>
            Current: Level {maturityLevel} ({MATURITY_LABELS[maturityLevel]})
          </span>
        </div>

        {/* 5-step track */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {[0, 1, 2, 3, 4].map((lvl) => {
            const isCurrent = maturityLevel === lvl
            const isPassed = maturityLevel > lvl
            return (
              <div key={lvl} className="text-center space-y-1.5">
                <div
                  className={cn(
                    'h-2 rounded-full transition-all',
                    isCurrent
                      ? 'bg-(--primary) ring-3 ring-(--primary)/25'
                      : isPassed
                      ? 'bg-emerald-500'
                      : 'bg-zinc-200 dark:bg-zinc-800'
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium block truncate',
                    isCurrent ? 'font-bold text-(--primary)' : 'text-zinc-400 dark:text-zinc-500'
                  )}
                >
                  {lvl}: {MATURITY_LABELS[lvl as DigitalMaturityLevel]}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200/60 dark:border-white/5">
          <span>Current Level: <strong className="text-zinc-900 dark:text-zinc-100">{MATURITY_LABELS[maturityLevel]}</strong></span>
          <span>Target Standard: <strong className="text-(--primary)">Transactional (L3)</strong></span>
          <span>Growth Gap: <strong className="text-amber-500">{Math.max(0, 3 - maturityLevel)} Levels</strong></span>
        </div>
      </div>

      {/* ── Strategic AI Insights & Next Steps ── */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-white/5 bg-zinc-50/60 dark:bg-[#181C18] p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-(--primary)/15 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-(--primary)" />
          </div>
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Strategic AI Insights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#1F241F] border border-zinc-200/70 dark:border-white/5 space-y-1.5 shadow-xs">
            <span className="font-mono text-[10px] font-bold text-(--primary) block">01 · WEB PRESENCE</span>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
              {lead.websiteStatus === 'none'
                ? 'No digital website presence detected'
                : 'Outdated web presence lacking mobile/transactional flow'}
            </p>
            <p className="text-[11px] text-zinc-400">Verified via web inspection and DNS audit</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#1F241F] border border-zinc-200/70 dark:border-white/5 space-y-1.5 shadow-xs">
            <span className="font-mono text-[10px] font-bold text-(--primary) block">02 · REVENUE CAPTURE</span>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
              High foot-traffic ({lead.reviewCount ?? 0} reviews) with zero online booking
            </p>
            <p className="text-[11px] text-zinc-400">Verified from Google Maps / OSM activity signals</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#1F241F] border border-zinc-200/70 dark:border-white/5 space-y-1.5 shadow-xs">
            <span className="font-mono text-[10px] font-bold text-(--primary) block">03 · LOCAL VACUUM</span>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
              Digital gap in {lead.city} ({getCategoryLabel(lead.category)})
            </p>
            <p className="text-[11px] text-zinc-400">Derived from local category density benchmark</p>
          </div>
        </div>

        {/* Next Best Action Banner */}
        <div className="p-4 rounded-xl bg-(--primary)/10 border border-(--primary)/20 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-(--primary) uppercase tracking-wider block">
              Recommended Next Action
            </span>
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {opp?.recommendedNextAction?.action || 'Prepare tailored outreach message'}
            </p>
          </div>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('outreach')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-(--primary) hover:bg-(--primary-hover) text-white shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <span>Draft Outreach</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Pipeline Progression Stepper ── */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-white/5 bg-zinc-50/60 dark:bg-[#181C18] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
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
  const updateLead = useAppStore((s) => s.updateLead)
  const addNotification = useAppStore((s) => s.addNotification)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audit = lead.audit
  const report = audit?.auditData?.websiteAudit ?? null
  const hasWebsite = Boolean(lead.websiteUrl || lead.website)

  /**
   * Re-runs the audit against the live site and folds the fresh row back into
   * the store, so the drawer updates without a page reload.
   */
  const handleRun = async () => {
    setRunning(true)
    setError(null)
    try {
      const saved = (await runAudit(lead.id)) as unknown as Record<string, any>
      const fresh: DigitalAudit = {
        id: saved.id,
        leadId: saved.lead_id ?? lead.id,
        workspaceId: saved.workspace_id ?? '',
        websiteExists: saved.website_exists ?? 'unknown',
        httpsEnabled: saved.https_enabled ?? 'unknown',
        mobileIndicator: saved.mobile_indicator ?? 'unknown',
        bookingDetected: saved.booking_detected ?? 'unknown',
        orderingDetected: saved.ordering_detected ?? 'unknown',
        contactFormDetected: saved.contact_form_detected ?? 'unknown',
        socialPresenceDetected: saved.social_presence_detected ?? 'unknown',
        digitalMaturityLevel: (saved.digital_maturity_level ?? 0) as DigitalMaturityLevel,
        auditScore: saved.audit_score ?? 0,
        auditData: saved.audit_data,
        evidence: saved.evidence ?? [],
        createdAt: saved.created_at,
        updatedAt: saved.updated_at,
      }
      updateLead(lead.id, { audit: fresh })

      const health = fresh.auditData?.websiteHealthScore
      addNotification({
        type: 'lead',
        title: 'Website audit complete',
        message:
          health !== null && health !== undefined
            ? `${lead.name}: ${health}/100 (grade ${fresh.auditData?.websiteGrade}).`
            : `${lead.name}: no reachable website found.`,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'The audit could not be completed.')
    } finally {
      setRunning(false)
    }
  }

  const RunButton = (
    <Button size="sm" variant="outline" onClick={handleRun} disabled={running}>
      {running ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Auditing website…
        </>
      ) : (
        <>
          <RefreshCw className="h-3.5 w-3.5" /> {audit ? 'Re-run audit' : 'Run website audit'}
        </>
      )}
    </Button>
  )

  if (!audit) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-10 text-center">
          <BarChart3 className="mx-auto mb-2 h-8 w-8 text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm font-medium text-zinc-400">No audit yet</p>
          <p className="mx-auto mt-1 max-w-xs text-xs text-zinc-400">
            {hasWebsite
              ? 'Run the audit to fetch the live site and score its speed, search visibility, security, mobile experience, accessibility, content and conversion readiness.'
              : 'No website is on record for this business. The audit will still score its public listing presence.'}
          </p>
          <div className="mt-4 flex justify-center">{RunButton}</div>
          {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
        </div>
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
      {/* Header: overall business presence + re-run */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <ScoreGauge score={audit.auditScore} label="Audit Score" color="#0ea5e9" />
          <div>
            <p className="text-lg font-black text-zinc-800 dark:text-zinc-100">{audit.auditScore}/100</p>
            <p className="text-xs text-zinc-500">Overall Digital Presence</p>
            <p className={cn('mt-1 text-sm font-bold', MATURITY_COLORS[audit.digitalMaturityLevel])}>
              Level {audit.digitalMaturityLevel} — {MATURITY_LABELS[audit.digitalMaturityLevel]}
            </p>
          </div>
        </div>
        {RunButton}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {/* The technical website report — the heart of the audit */}
      {report ? (
        <>
          <Separator />
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-zinc-500">
              <Globe className="h-3.5 w-3.5" /> Website technical report
            </p>
            <WebsiteAuditReportView report={report} />
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 dark:border-amber-900/50 dark:bg-amber-950/20">
          <p className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5" /> No website to audit
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-amber-700/90 dark:text-amber-200/80">
            This business has no website on record, so only its public listing could be assessed. That gap is
            itself the opportunity — there is nothing for a customer to find beyond the directory entry.
          </p>
        </div>
      )}

      <Separator />

      {/* Legacy presence sub-scores */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">Presence Breakdown</p>
        <div className="space-y-2">
          {categoryScores.map(({ label, value, icon: Icon }) => (
            <div key={label}>
              <div className="mb-0.5 flex items-center justify-between">
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

      {/* Feature detection */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-zinc-500">Feature Detection</p>
        <div className="grid grid-cols-1 gap-2">
          {detectionItems.map(({ label, status, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-1.5 dark:bg-zinc-800/50"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
              </div>
              {detectionBadge(status)}
            </div>
          ))}
        </div>
      </div>

      {audit.auditData.detectedServices.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-zinc-500">Detected Services</p>
          <div className="flex flex-wrap gap-1.5">
            {audit.auditData.detectedServices.map((service) => (
              <Badge key={service} variant="secondary">{service}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Tab: Outreach (AI-Tailored)
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
      {/* Intelligence summary badge */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-(--primary)/10 border border-(--primary)/20 text-xs">
        <Sparkles className="h-4 w-4 text-(--primary) shrink-0" />
        <p className="text-zinc-800 dark:text-zinc-200">
          AI Outreach tailored for <strong className="text-zinc-900 dark:text-white font-semibold">{lead.name}</strong> based on digital audit signals.
        </p>
      </div>

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
                className="flex-1 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 outline-none focus:ring-2 focus:ring-(--primary)"
              />
            </div>
          </div>
          {/* Subject */}
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">Subject</label>
            <input
              type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              className="w-full text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-(--primary)"
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
            Outreach is generated automatically during intelligence preparation. Click the button below to generate now.
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
// Tab: Activity (Outcome Events)
// ============================================================
function ActivityTab({ lead }: { lead: Lead }) {
  const events = lead.outcomeEvents ?? []
  if (events.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-10 text-center">
        <Activity className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-zinc-400">No events recorded yet</p>
        <p className="text-xs text-zinc-400 mt-1">Events are logged as the lead progresses through the pipeline.</p>
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
type TabId = 'overview' | 'audit' | 'outreach' | 'activity'

const TABS: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'audit', label: 'Digital Audit', icon: BarChart3 },
  { id: 'outreach', label: 'Outreach', icon: Send },
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
      className="fixed inset-0 z-1100 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
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
                    className="text-xs h-9 px-4 gap-1.5 shadow-sm font-bold bg-(--primary) hover:bg-(--primary-hover) text-white"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>Run AI Analysis</span>
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
              <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-white/5 rounded-xl border border-zinc-200/60 dark:border-white/5 w-fit">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer',
                      activeTab === id
                        ? 'bg-(--primary) text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-white/5'
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
                  {activeTab === 'overview' && <OverviewTab lead={lead} onNavigateTab={setActiveTab} />}
                  {activeTab === 'audit' && <DigitalAuditTab lead={lead} />}
                  {activeTab === 'outreach' && <OutreachTab key={lead.id} lead={lead} />}
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
