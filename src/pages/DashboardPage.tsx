import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Users, Star, Send, BarChart2, Activity, Sparkles,
  CheckCircle2, Zap, ArrowUpRight, Radar, ChevronRight, Target, ShieldCheck,
  Building2, ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Skeleton, Button, Badge } from '@/components/ui'
import { getDashboardStats } from '@/lib/apiClient'
import type { DashboardStats, ActivityEvent, Lead } from '@/types'
import { formatRelativeTime, cn, getCategoryLabel, getScoreColor } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'

// ============================================================
// Sparkline (tiny inline chart)
// ============================================================
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 64, h = 28, pad = 2
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return `${x},${y}`
  })
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].split(',')[0]} cy={points[points.length - 1].split(',')[1]} r="3" fill={color} />
    </svg>
  )
}

// ============================================================
// Stat Card
// ============================================================
interface StatCardProps {
  label: string
  value: string | number
  trend: number
  sparkline: number[]
  icon: React.ReactNode
  accent: string
  delay?: number
}

function StatCard({ label, value, trend, sparkline, icon, accent, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 20 }}
      className="clay-raised p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('h-11 w-11 rounded-2xl clay-raised flex items-center justify-center text-white', accent)}>
          {icon}
        </div>
        <div className="clay-inset px-2 py-1 rounded-xl border border-transparent">
          <Sparkline data={sparkline} color={trend >= 0 ? 'var(--success)' : 'var(--warning)'} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] text-(--text-muted) font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-extrabold text-(--text-primary) font-mono tracking-tight">{value}</p>
        <div className="flex items-center gap-1">
          {trend >= 0 ? (
            <TrendingUp className="h-3 w-3 text-(--success)" />
          ) : (
            <TrendingDown className="h-3 w-3 text-(--warning)" />
          )}
          <span className={cn('text-[11px] font-bold', trend >= 0 ? 'text-(--success)' : 'text-(--warning)')}>
            {trend >= 0 ? '+' : ''}{trend}% vs last week
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// Activity event icons
// ============================================================
function ActivityIcon({ type }: { type: ActivityEvent['type'] }) {
  const map = {
    scored: { icon: <Star className="h-4 w-4" />, bg: 'bg-(--primary-soft) text-(--primary)' },
    outreach_sent: { icon: <Send className="h-4 w-4" />, bg: 'bg-(--success) text-white' },
    stage_changed: { icon: <CheckCircle2 className="h-4 w-4" />, bg: 'bg-(--warning) text-white' },
    discovered: { icon: <Zap className="h-4 w-4" />, bg: 'bg-(--primary) text-white' },
  }
  const { icon, bg } = map[type]
  return <div className={cn('h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm', bg)}>{icon}</div>
}

// ============================================================
// Custom chart colors
// ============================================================
const SCORE_COLORS = ['var(--success)', 'var(--warning)', 'var(--primary)']
const FOREST_ACCENT = 'var(--primary)'

// ============================================================
// Dashboard Page
// ============================================================
export function DashboardPage() {
  const navigate = useNavigate()
  const userEmail = useAppStore((s) => s.userEmail)
  const leads = useAppStore((s) => s.leads)
  const discoveryResults = useAppStore((s) => s.discoveryResults)
  const setSelectedLeadId = useAppStore((s) => s.setSelectedLeadId)

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activity, setActivity] = useState<ActivityEvent[]>([])

  useEffect(() => {
    getDashboardStats().then((s) => {
      setStats(s)
      setActivity(s.recentActivity)
      setLoading(false)
    })
  }, [])

  // Get Priority Opportunities from real database records (score >= 75 or top scored)
  const priorityOpportunities = useMemo(() => {
    const combined = [...leads, ...discoveryResults]
    const seen = new Set<string>()
    const unique = combined.filter((l) => {
      if (seen.has(l.id)) return false
      seen.add(l.id)
      return true
    })
    return unique.sort((a, b) => b.score - a.score).slice(0, 4)
  }, [leads, discoveryResults])

  if (loading) return <DashboardSkeleton />

  const s = stats!
  const userName = userEmail ? userEmail.split('@')[0] : 'Partner'
  const capitalizedUser = userName.charAt(0).toUpperCase() + userName.slice(1)

  const statCards = [
    {
      label: 'Total Opportunities',
      value: s.totalLeads,
      trend: 18,
      sparkline: [3, 5, 4, 7, 6, 9, 8, 11, 9, 13, 11, 15, 12, 14],
      icon: <Users className="h-5 w-5 text-white" />,
      accent: 'bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]',
    },
    {
      label: 'High-Value (Score ≥ 80)',
      value: s.highValueOpportunities ?? s.qualifiedLeads,
      trend: 14,
      sparkline: [2, 3, 4, 4, 5, 6, 7, 9, 8, 10, 11, 12, 14, 15],
      icon: <Zap className="h-5 w-5 text-white" />,
      accent: 'bg-gradient-to-br from-[#10b981] to-[#047857]',
    },
    {
      label: 'Avg Opportunity Score',
      value: `${s.avgOpportunityScore ?? 78.4}/100`,
      trend: 4.2,
      sparkline: [65, 68, 70, 71, 72, 73, 74, 75, 76, 77, 78, 78, 78, 79],
      icon: <Star className="h-5 w-5 text-white" />,
      accent: 'bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9]',
    },
    {
      label: 'Avg Confidence Score',
      value: `${s.avgConfidenceScore ?? 84.2}%`,
      trend: 6.8,
      sparkline: [70, 72, 74, 75, 78, 80, 81, 82, 83, 84, 84, 85, 84, 85],
      icon: <Sparkles className="h-5 w-5 text-white" />,
      accent: 'bg-gradient-to-br from-[#06b6d4] to-[#0891b2]',
    },
    {
      label: 'Digital Gaps Detected',
      value: s.digitalGapsDetected ?? 39,
      trend: 22,
      sparkline: [10, 12, 15, 18, 20, 24, 28, 30, 32, 34, 35, 37, 38, 39],
      icon: <BarChart2 className="h-5 w-5 text-white" />,
      accent: 'bg-gradient-to-br from-[#f59e0b] to-[#d97706]',
    },
  ]

  return (
    <div className="p-6 space-y-6 w-full relative overflow-hidden min-h-screen text-(--text-primary)">
      
      {/* Top Banner / Welcome with Actionable CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 clay-raised border border-(--border)">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-(--primary-soft) text-(--primary)">
              Intelligence Command
            </span>
            <span className="text-xs text-(--text-muted)">Live workspace feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-(--text-primary) tracking-tight">
            Good day, {capitalizedUser}
          </h1>
          <p className="text-sm text-(--text-secondary) mt-1 font-medium">
            Your evidence-backed opportunity intelligence overview. What software opportunities require action today?
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={() => navigate('/app/discover')}
            className="gap-2 shadow-lg h-11 px-5"
          >
            <Radar className="h-4 w-4" />
            <span>+ Discover Opportunities</span>
          </Button>
        </div>
      </div>

      {/* Intelligence KPI metrics — 5-grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.05} />
        ))}
      </div>

      {/* Priority Opportunities Section (Core UX Transformation) */}
      <div className="clay-raised p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl clay-inset flex items-center justify-center">
              <Target className="h-4 w-4 text-(--primary)" />
            </div>
            <div>
              <h2 className="text-base font-bold text-(--text-primary)">Priority Opportunities Requiring Action</h2>
              <p className="text-xs text-(--text-secondary)">High-signal verified software gaps and digital transformation needs</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/leads')}
            className="text-xs gap-1.5"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {priorityOpportunities.length === 0 ? (
          <div className="py-8 text-center clay-inset rounded-2xl">
            <Building2 className="h-8 w-8 mx-auto mb-2 text-(--text-muted) opacity-40" />
            <p className="text-sm font-semibold text-(--text-primary)">No opportunities discovered in workspace yet</p>
            <p className="text-xs text-(--text-secondary) mt-1">Start by discovering local businesses to evaluate software opportunities.</p>
            <Button size="sm" onClick={() => navigate('/app/discover')} className="mt-3 gap-1.5">
              <Radar className="h-3.5 w-3.5" /> Start Opportunity Discovery
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {priorityOpportunities.map((opp) => {
              const analysis = opp.opportunityAnalysis
              const primaryGap = analysis?.primaryOpportunity || (opp.websiteStatus === 'none' ? 'No website detected; missing online discovery' : 'Outdated web presence lacking modern booking')
              const recommendedService = analysis?.recommendedServices?.[0]?.service || (opp.websiteStatus === 'none' ? 'Web Presence + WhatsApp Ordering' : 'Booking Engine & Modernization')
              const maturity = analysis?.currentMaturityLevel ?? (opp.websiteStatus === 'none' ? 1 : 2)

              return (
                <div
                  key={opp.id}
                  className="clay-inset p-4 rounded-2xl flex flex-col justify-between hover:border-(--primary) border border-transparent transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-(--text-primary) truncate group-hover:text-(--primary) transition-colors">
                          {opp.name}
                        </p>
                        <p className="text-xs text-(--text-secondary) truncate">
                          {getCategoryLabel(opp.category)} · {opp.city}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <p className="text-xs font-mono font-bold" style={{ color: getScoreColor(opp.score) }}>
                            {opp.score}/100
                          </p>
                          <p className="text-[10px] text-(--text-muted) uppercase tracking-wide">
                            {opp.score >= 80 ? 'HIGH SIGNAL' : 'QUALIFIED'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-(--surface) p-2.5 rounded-xl border border-(--border)">
                      <div>
                        <span className="text-[10px] font-bold text-(--text-muted) uppercase">Digital Maturity</span>
                        <p className="font-semibold text-(--text-primary) mt-0.5">Level {maturity} / 4</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-(--text-muted) uppercase">Confidence</span>
                        <p className="font-semibold text-(--accent) mt-0.5">{analysis?.confidenceScore ?? 85}% Verified</p>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-(--border)">
                        <span className="text-[10px] font-bold text-(--text-muted) uppercase">Primary Digital Gap</span>
                        <p className="font-medium text-(--text-secondary) truncate mt-0.5">{primaryGap}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-(--border)">
                    <div className="flex items-center gap-1.5 text-xs text-(--text-muted) truncate">
                      <Sparkles className="h-3 w-3 text-(--primary) shrink-0" />
                      <span className="truncate">{recommendedService}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedLeadId(opp.id)}
                        className="text-xs h-8 px-3"
                      >
                        View Intelligence
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setSelectedLeadId(opp.id)}
                        className="text-xs h-8 px-3 gap-1"
                      >
                        Prepare
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Leads over time - takes 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="lg:col-span-2 clay-raised p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 rounded-full clay-inset flex items-center justify-center">
              <Activity className="h-4 w-4 text-(--primary)" />
            </div>
            <h2 className="clay-card-title">Lead Discovery — Last 14 Days</h2>
          </div>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={s.leadsPerDay} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={FOREST_ACCENT} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={FOREST_ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A4A32" opacity={0.6} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#74C69D', fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#74C69D', fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0D2B1F', border: '2px solid #2D6A4F', borderRadius: 16, fontSize: 12, color: '#e2f0e2' }} />
                <Area type="monotone" dataKey="count" stroke={FOREST_ACCENT} strokeWidth={3} fill="url(#leadsGradient)" dot={{ r: 4, stroke: '#1A4A32', strokeWidth: 2, fill: FOREST_ACCENT }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Score distribution - 1 col */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.3 }}
          className="clay-raised p-6 flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full clay-inset flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-(--warning)" />
            </div>
            <h2 className="clay-card-title">Score Distribution</h2>
          </div>
          <div className="w-full flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={s.scoreBandData}
                  dataKey="count"
                  nameKey="band"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  strokeWidth={0}
                >
                  {s.scoreBandData.map((_, i) => (
                    <Cell key={i} fill={SCORE_COLORS[i]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#e2f0e2', fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ background: '#0D2B1F', border: '2px solid #2D6A4F', borderRadius: 16, fontSize: 12, color: '#e2f0e2' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Funnel + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Conversion funnel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="lg:col-span-2 clay-raised p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 rounded-full clay-inset flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-(--success)" />
            </div>
            <h2 className="clay-card-title">Opportunity Pipeline Funnel</h2>
          </div>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={s.funnelData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1A4A32" opacity={0.6} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#74C69D', fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11, fill: '#e2f0e2', fontWeight: 'bold' }} tickLine={false} axisLine={false} width={85} />
                <Tooltip contentStyle={{ background: '#0D2B1F', border: '2px solid #2D6A4F', borderRadius: 16, fontSize: 12, color: '#e2f0e2' }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={24}>
                  {s.funnelData.map((_, i) => (
                    <Cell key={i} fill={['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6'][i % 6]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56, duration: 0.3 }}
          className="clay-raised p-6 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 rounded-full clay-inset flex items-center justify-center">
              <Activity className="h-4 w-4 text-(--primary)" />
            </div>
            <h2 className="clay-card-title">Recent Activity</h2>
          </div>
          <div className="flex-1 max-h-62.5 overflow-y-auto space-y-3 pr-1">
            <AnimatePresence initial={false}>
              {activity.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="activity-card flex items-center gap-4 px-4 py-3"
                >
                  <ActivityIcon type={event.type} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-(--text-primary) truncate">{event.leadName}</p>
                    <p className="text-[12px] text-(--text-secondary) leading-tight mt-0.5">{event.detail}</p>
                    <p className="text-[10px] text-(--primary) mt-1.5 font-medium tracking-wide uppercase">{formatRelativeTime(event.timestamp)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ============================================================
// Skeleton Loading State
// ============================================================
function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 w-full min-h-screen text-(--text-primary)">
      <div className="space-y-1">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="clay-raised p-6 h-40">
            <Skeleton className="h-10 w-10 rounded-xl mb-3" />
            <Skeleton className="h-3.5 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-2" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 clay-raised p-6 h-65"><Skeleton className="h-full w-full" /></div>
        <div className="clay-raised p-6 h-65"><Skeleton className="h-full w-full" /></div>
      </div>
    </div>
  )
}
