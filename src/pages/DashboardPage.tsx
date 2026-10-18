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

  // State
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [summary, setSummary] = React.useState<DashboardSummaryResponse | null>(null)
  const [activities, setActivities] = React.useState<ActivityResponse['activities']>([])
  const [leads, setLeads] = React.useState<Lead[]>([])
  const [workspace, setWorkspace] = React.useState<WorkspaceInfo | null>(null)
  const [members, setMembers] = React.useState<any[]>([])
  
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

      {/* Slideover Lead Details Panel */}
      <LeadDetailPanel />
    </div>
  )
}
