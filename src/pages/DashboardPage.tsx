import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Radar,
  Sparkles,
  ArrowRight,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserPlus,
  Layers,
  FileText,
  ChevronRight,
  Filter,
} from 'lucide-react'
import {
  ScoreBadge,
  SignalChip,
  StatTile,
  EmptyState,
  ActivityFeedItem,
} from '@/components/dashboard'
import { Button, Card, Progress, Skeleton, Badge } from '@/components/ui'
import { apiGet, apiPost } from '@/api/client'
import { useAppStore } from '@/store/useAppStore'
import { LeadDetailPanel } from '@/components/leads/LeadDetailPanel'
import type { Lead } from '@/types'
import { cn } from '@/lib/utils'

interface DashboardSummaryResponse {
  metrics: {
    discovered: number
    qualified: number
    contacted: number
    won: number
  }
  sparklines: {
    discovered: Array<{ date: string; value: number }>
  }
  proposals: {
    total: number
    statusCounts: Record<string, number>
    acceptRate: number
    replyRate: number
  }
}

interface ActivityResponse {
  activities: Array<{
    id: string
    type: string
    title: string
    description?: string
    timestamp: string
    leadId?: string
    leadName?: string
  }>
}

interface WorkspaceInfo {
  id: string
  name: string
  plan: 'free' | 'starter' | 'agency' | 'pro' | 'enterprise'
  owner_id: string | null
}

export function DashboardPage() {
  const navigate = useNavigate()
  const userRole = useAppStore((s) => s.userRole)
  const userEmail = useAppStore((s) => s.userEmail)

  // Redirect administrators to the dedicated Admin Portal & Dashboard
  React.useEffect(() => {
    if (userRole === 'admin') {
      navigate('/app/admin', { replace: true })
    }
  }, [userRole, navigate])

  // State
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [summary, setSummary] = React.useState<DashboardSummaryResponse | null>(null)
  const [activities, setActivities] = React.useState<ActivityResponse['activities']>([])
  const [leads, setLeads] = React.useState<Lead[]>([])
  const [workspace, setWorkspace] = React.useState<WorkspaceInfo | null>(null)
  const [members, setMembers] = React.useState<any[]>([])
  const [updatingPlan, setUpdatingPlan] = React.useState<string | null>(null)
  const [planMessage, setPlanMessage] = React.useState<string | null>(null)
  
  // Filtering & Interactivity
  const [selectedStageFilter, setSelectedStageFilter] = React.useState<string | null>(null)
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)

  // Load Dashboard Data
  React.useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    async function loadData() {
      try {
        const [sumRes, actRes, leadsRes, wsRes] = await Promise.all([
          apiGet<DashboardSummaryResponse>('/dashboard/summary').catch(() => null),
          apiGet<ActivityResponse>('/activity?limit=15').catch(() => ({ activities: [] })),
          apiGet<Lead[]>('/leads').catch(() => []),
          apiGet<{ workspace: WorkspaceInfo }>('/workspace').catch(() => ({ workspace: { id: '', name: 'Workspace', plan: 'free', owner_id: null } })),
        ])

        if (!isMounted) return

        setSummary(sumRes)
        setActivities(actRes?.activities || [])
        setLeads(Array.isArray(leadsRes) ? leadsRes : [])
        setWorkspace((wsRes?.workspace as WorkspaceInfo) || null)

        // If multi-seat agency plan, load members
        const plan = wsRes?.workspace?.plan || 'free'
        if (['agency', 'pro', 'enterprise'].includes(plan)) {
          const membersRes = await apiGet<{ members: any[] }>('/workspace/members').catch(() => ({ members: [] }))
          if (isMounted) setMembers(membersRes?.members || [])
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard metrics')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  // Seat limit calculation
  const plan = workspace?.plan || 'free'
  const isMultiSeat = ['agency', 'pro', 'enterprise'].includes(plan)
  const seatLimit = plan === 'enterprise' ? 'Unlimited' : plan === 'pro' ? 25 : plan === 'agency' ? 5 : 1

  const handleSelectPlan = async (targetPlan: string) => {
    if (targetPlan === plan) return
    setUpdatingPlan(targetPlan)
    setPlanMessage(null)
    try {
      const { apiPatch } = await import('@/api/client')
      await apiPatch('/workspace', { plan: targetPlan })
      setWorkspace((prev) => prev ? { ...prev, plan: targetPlan as any } : null)
      setPlanMessage(`Workspace successfully transitioned to the ${targetPlan.toUpperCase()} plan.`)
      setTimeout(() => setPlanMessage(null), 4000)
    } catch {
      setPlanMessage('Failed to update plan. Please try again.')
    } finally {
      setUpdatingPlan(null)
    }
  }

  const AVAILABLE_PLANS = [
    {
      id: 'free',
      name: 'Free Explorer',
      price: '$0',
      period: '/mo',
      badge: 'Starter Tier',
      description: 'Ideal for freelance developers & solo auditors testing digital opportunity scoring.',
      seats: '1 Seat',
      scans: '25 Scans / mo',
      features: ['25 Local Business Scans', 'Basic Digital Audit Signals', 'Opportunity Score Preview', 'Community Support'],
    },
    {
      id: 'starter',
      name: 'Starter Pro',
      price: '$49',
      period: '/mo',
      badge: 'Solopreneur',
      description: 'For growing freelancers seeking to discover active commercial web & SEO projects.',
      seats: '1 Seat',
      scans: '250 Scans / mo',
      features: ['250 Local Business Scans', 'Complete Technical Audit Signals', 'AI Outreach Pitch Drafts', 'Email Support'],
    },
    {
      id: 'agency',
      name: 'Agency Scale',
      price: '$149',
      period: '/mo',
      badge: 'Most Popular',
      popular: true,
      description: 'Built for agencies and boutique studios scaling multi-client pipeline acquisition.',
      seats: '5 Seats Included',
      scans: '1,000 Scans / mo',
      features: ['1,000 Local Business Scans', 'White-Label PDF Proposals', 'Pipeline CRM & Multi-Seat Access', 'Priority SLA Support'],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$299',
      period: '/mo',
      badge: 'High Volume',
      description: 'Advanced intelligence for high-velocity sales and engineering development teams.',
      seats: '25 Seats Included',
      scans: '5,000 Scans / mo',
      features: ['5,000 Local Business Scans', 'Market Intelligence & Zones', 'Custom Webhooks & Export APIs', 'Dedicated Phone Support'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$599',
      period: '/mo',
      badge: 'Unlimited Scale',
      description: 'Unlimited prospecting capacity with custom scoring weights and dedicated strategist.',
      seats: 'Unlimited Seats',
      scans: 'Unlimited Scans',
      features: ['Unlimited Discovery Scans', 'Custom AI Scoring Models', 'Custom Contracts & Invoicing', 'Dedicated Account Strategist'],
    },
  ]

  // Filtered leads for Best Opportunities feed
  const rankedLeads = React.useMemo(() => {
    let list = [...leads]
    if (selectedStageFilter) {
      list = list.filter((l) => (l.pipelineStage || 'discovery').toLowerCase() === selectedStageFilter.toLowerCase())
    }
    return list.sort((a, b) => (b.score || 0) - (a.score || 0))
  }, [leads, selectedStageFilter])

  // Setup completeness calculations
  const setupTasks = React.useMemo(() => {
    const hasDiscovered = leads.length > 0
    const hasEnriched = leads.some((l) => !!l.contactEmail || !!l.contactPhone)
    const hasScored = leads.some((l) => (l.score || 0) > 0)
    const hasProposal = (summary?.proposals?.total || 0) > 0
    const hasContacted = (summary?.metrics?.contacted || 0) > 0

    const tasks = [
      { id: 'discover', label: 'Run your first discovery scan', done: hasDiscovered, href: '/app/discover' },
      { id: 'audit', label: 'Audit a business digital presence', done: hasScored, href: '/app/leads' },
      { id: 'enrich', label: 'Enrich contact info for a lead', done: hasEnriched, href: '/app/leads' },
      { id: 'outreach', label: 'Draft or send outreach message', done: hasContacted, href: '/app/messages' },
      { id: 'proposal', label: 'Generate client proposal', done: hasProposal, href: '/app/proposals' },
    ]

    if (isMultiSeat) {
      tasks.push({
        id: 'team',
        label: 'Invite a team member',
        done: members.length > 1,
        href: '/app/settings',
      })
    }

    const completed = tasks.filter((t) => t.done).length
    const percent = Math.round((completed / tasks.length) * 100)
    return { tasks, completed, total: tasks.length, percent }
  }, [leads, summary, isMultiSeat, members])

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full text-(--text-primary)">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 clay-raised rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-(--primary-soft) text-(--primary)">
              {workspace?.name || 'Workspace'}
            </span>
            <span className="text-xs text-(--text-muted)">
              Plan: <strong className="capitalize text-(--text-primary)">{plan}</strong> ({isMultiSeat ? `Multi-seat: ${members.length}/${seatLimit}` : 'Freelancer'})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
            Client Acquisition Center
          </h1>
          <p className="text-xs sm:text-sm text-(--text-secondary) mt-1">
            Discover local businesses, analyze digital gap signals, and deliver high-converting proposals.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={() => navigate('/app/discover')}
            className="clay-btn-primary gap-2 h-10 px-4 text-xs sm:text-sm"
          >
            <Radar className="w-4 h-4" />
            <span>Discover Opportunities</span>
          </Button>
        </div>
      </div>

      {/* Error Banner if any */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-(--danger)/20 flex items-center gap-3 text-sm text-(--danger)">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4-Tile Stat Strip (Upwork-style Pipeline Click-to-Filter) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatTile
          label="Leads Discovered"
          value={summary?.metrics?.discovered ?? leads.length}
          trendData={summary?.sparklines?.discovered}
          isLoading={loading}
          isActive={selectedStageFilter === null}
          onClick={() => setSelectedStageFilter(null)}
          subtext="Total opportunities tracked"
        />
        <StatTile
          label="Qualified Stage"
          value={summary?.metrics?.qualified ?? leads.filter((l) => l.pipelineStage === 'qualified').length}
          isLoading={loading}
          isActive={selectedStageFilter === 'qualified'}
          onClick={() => setSelectedStageFilter(selectedStageFilter === 'qualified' ? null : 'qualified')}
          subtext="High-fit audited prospects"
        />
        <StatTile
          label="Contacted"
          value={summary?.metrics?.contacted ?? leads.filter((l) => l.pipelineStage === 'contacted').length}
          isLoading={loading}
          isActive={selectedStageFilter === 'contacted'}
          onClick={() => setSelectedStageFilter(selectedStageFilter === 'contacted' ? null : 'contacted')}
          subtext="Outreach drafted or sent"
        />
        <StatTile
          label="Won / Client Stage"
          value={summary?.metrics?.won ?? leads.filter((l) => l.pipelineStage === 'client').length}
          isLoading={loading}
          isActive={selectedStageFilter === 'client'}
          onClick={() => setSelectedStageFilter(selectedStageFilter === 'client' ? null : 'client')}
          trendColor="var(--success)"
          subtext="Converted clients"
        />
      </div>

      {/* Main Grid: Best Matches Feed (Left) & Sidebar Snapshot (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols wide): "Best Matches" Opportunities Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-(--accent)" />
              <h2 className="text-base sm:text-lg font-heading font-bold text-(--text-primary)">
                Best Opportunities Feed
              </h2>
              {selectedStageFilter && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-(--accent-soft) text-(--accent) capitalize">
                  Filter: {selectedStageFilter}
                </span>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/app/leads')}
              className="text-xs gap-1.5"
            >
              <span>View All ({leads.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Leads Feed Cards */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="clay-raised p-5 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-48 rounded" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full rounded" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : rankedLeads.length === 0 ? (
            <EmptyState
              title="No opportunities found"
              description={
                selectedStageFilter
                  ? `No leads currently in the "${selectedStageFilter}" stage. Run a discovery scan or change filters.`
                  : "You haven't discovered any local business leads in this workspace yet."
              }
              actionLabel="Run Discovery Scan"
              onAction={() => navigate('/app/discover')}
            />
          ) : (
            <div className="space-y-3">
              {rankedLeads.slice(0, 8).map((lead) => {
                const opp = lead.opportunityAnalysis
                const audit = lead.audit
                const score = opp?.opportunityScore ?? lead.score ?? 50

                // Missing audit signals
                const missingSignals: string[] = []
                if (!lead.website || audit?.websiteExists === 'not_detected') missingSignals.push('website')
                if (audit?.httpsEnabled === 'not_detected') missingSignals.push('https')
                if (audit?.mobileIndicator === 'not_detected') missingSignals.push('mobile')
                if (audit?.bookingDetected === 'not_detected') missingSignals.push('booking')
                if (audit?.socialPresenceDetected === 'not_detected') missingSignals.push('social')

                return (
                  <div
                    key={lead.id}
                    className="clay-raised p-4 sm:p-5 transition-all hover:bg-(--surface-hover) rounded-xl flex flex-col justify-between gap-3 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-(--text-primary) truncate">
                            {lead.name}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-(--surface-raised) text-(--text-secondary) capitalize">
                            {lead.category || 'Business'}
                          </span>
                          {lead.city && (
                            <span className="text-xs text-(--text-muted)">
                              {lead.city}
                            </span>
                          )}
                        </div>

                        {opp?.primaryOpportunity && (
                          <p className="text-xs text-(--text-secondary) mt-1.5 line-clamp-2">
                            {opp.primaryOpportunity}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0">
                        <ScoreBadge score={score} showBand size="md" />
                      </div>
                    </div>

                    {/* Missing Signals Chips */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {missingSignals.slice(0, 3).map((sig) => (
                        <SignalChip key={sig} type={sig} isMissing />
                      ))}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-(--border-subtle)">
                      <span className="text-[11px] text-(--text-muted) capitalize">
                        Stage: <strong>{lead.pipelineStage || 'discovery'}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            useAppStore.getState().setSelectedLeadId(lead.id)
                          }}
                          className="text-xs h-8 px-2.5"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            useAppStore.getState().setSelectedLeadId(lead.id)
                            navigate('/app/pipeline')
                          }}
                          className="clay-btn-primary text-xs h-8 px-3"
                        >
                          Prepare Lead
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Setup Progress, Team / Plan adaptive, Activity Timeline */}
        <div className="space-y-6">
          {/* Setup Completeness Card (Upwork Profile-Completeness Pattern) */}
          <div className="clay-raised p-5 space-y-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-(--text-primary)">
                  Workspace Setup
                </h3>
                <p className="text-xs text-(--text-secondary)">
                  {setupTasks.completed} of {setupTasks.total} steps completed
                </p>
              </div>
              <span className="text-sm font-bold font-mono text-(--accent)">
                {setupTasks.percent}%
              </span>
            </div>

            <Progress value={setupTasks.percent} className="h-2" />

            <div className="space-y-2 pt-1">
              {setupTasks.tasks.map((task) => (
                <a
                  key={task.id}
                  href={task.href}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                    task.done
                      ? 'text-(--text-muted) line-through'
                      : 'text-(--text-primary) font-medium hover:bg-(--surface-raised)'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${task.done ? 'text-(--success)' : 'text-(--text-muted)'}`}
                    />
                    <span>{task.label}</span>
                  </div>
                  {!task.done && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </a>
              ))}
            </div>
          </div>

          {/* Proposal Status Board */}
          <div className="clay-raised p-5 space-y-3 rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-(--text-primary)">
                Proposal Status
              </h3>
              <span className="text-xs text-(--text-muted)">
                Accept Rate: <strong className="text-(--success)">{summary?.proposals?.acceptRate ?? 0}%</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="clay-inset p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-(--text-muted) block">Draft</span>
                <span className="text-lg font-bold tabular-nums text-(--text-primary)">
                  {summary?.proposals?.statusCounts?.draft ?? 0}
                </span>
              </div>
              <div className="clay-inset p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-(--text-muted) block">Submitted</span>
                <span className="text-lg font-bold tabular-nums text-(--text-primary)">
                  {summary?.proposals?.statusCounts?.submitted ?? 0}
                </span>
              </div>
              <div className="clay-inset p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-(--text-muted) block">Accepted</span>
                <span className="text-lg font-bold tabular-nums text-(--success)">
                  {summary?.proposals?.statusCounts?.accepted ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Team Panel — Strictly shown when seatLimit > 1 */}
          {isMultiSeat && (
            <div className="clay-raised p-5 space-y-3 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-(--accent)" />
                  <h3 className="text-sm font-bold text-(--text-primary)">
                    Agency Team ({members.length}/{seatLimit})
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/app/settings')}
                  className="text-xs h-7 px-2"
                >
                  <UserPlus className="w-3 h-3 mr-1" />
                  Invite
                </Button>
              </div>

              <div className="space-y-2 pt-1">
                {members.slice(0, 4).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-(--surface-raised)"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-(--text-primary) truncate">
                        {member.full_name || 'Teammate'}
                      </p>
                      <p className="text-[10px] text-(--text-muted) truncate">
                        {member.email || 'No email registered'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize text-[10px]">
                      {member.role || 'Member'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unified Activity Feed */}
          <div className="clay-raised p-5 space-y-3 rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-(--text-primary)">
                Recent Activity
              </h3>
              <span className="text-xs text-(--text-muted)">Live Feed</span>
            </div>

            {activities.length === 0 ? (
              <p className="text-xs text-(--text-muted) py-4 text-center">
                No recent activity recorded.
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {activities.slice(0, 8).map((act) => (
                  <ActivityFeedItem
                    key={act.id}
                    id={act.id}
                    type={act.type}
                    title={act.title}
                    description={act.description}
                    timestamp={act.timestamp}
                    leadId={act.leadId}
                    leadName={act.leadName}
                    onLeadClick={(id) => {
                      const found = leads.find((l) => l.id === id)
                      if (found) setSelectedLead(found)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plans & Workspace Subscription Section */}
      <div className="clay-floating p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-(--border-subtle) pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-(--primary-soft) text-(--primary)">
                Workspace Capacity & Plans
              </span>
              <span className="text-xs text-(--text-muted)">
                Current Active: <strong className="capitalize text-(--text-primary)">{plan}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-(--text-primary)">
              Available Subscription Tiers
            </h2>
            <p className="text-xs sm:text-sm text-(--text-secondary) mt-0.5">
              Review platform capabilities across all tiers and customize your active workspace plan.
            </p>
          </div>

          {planMessage && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-(--primary-soft) text-(--primary) text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{planMessage}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {AVAILABLE_PLANS.map((p) => {
            const isCurrent = (workspace?.plan || 'free').toLowerCase() === p.id.toLowerCase()
            return (
              <div
                key={p.id}
                className={cn(
                  'relative rounded-xl p-4 flex flex-col justify-between transition-all duration-200',
                  isCurrent
                    ? 'clay-raised border-2 border-(--primary) shadow-md ring-2 ring-(--primary)/20'
                    : 'clay-inset hover:border-(--border) border border-transparent'
                )}
              >
                {/* Active or Popular Badge */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-(--text-muted)">
                    {p.badge}
                  </span>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-(--primary) text-white shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-(--text-primary) leading-tight">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-2xl font-black text-(--text-primary)">{p.price}</span>
                    <span className="text-xs text-(--text-muted)">{p.period}</span>
                  </div>
                  <p className="text-[11px] text-(--text-secondary) leading-snug mb-3">
                    {p.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-(--border-subtle) text-[11px] text-(--text-primary)">
                    <div className="flex items-center gap-1.5 font-semibold text-(--primary)">
                      <Users className="w-3.5 h-3.5" />
                      <span>{p.seats}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-(--text-secondary)">
                      <Radar className="w-3.5 h-3.5 text-(--primary)" />
                      <span>{p.scans}</span>
                    </div>
                    <ul className="space-y-1 pt-1.5">
                      {p.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[10.5px] text-(--text-muted) leading-tight">
                          <CheckCircle2 className="w-3 h-3 text-(--primary) shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-(--border-subtle)">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-(--primary) text-white flex items-center justify-center gap-1 cursor-default opacity-90"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Current Plan</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(p.id)}
                      disabled={updatingPlan === p.id}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold clay-raised hover:bg-(--surface-hover) text-(--text-primary) transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>{updatingPlan === p.id ? 'Updating...' : `Select ${p.name.split(' ')[0]}`}</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
