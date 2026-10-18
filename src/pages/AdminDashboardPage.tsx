import * as React from 'react'
import {
  Shield,
  Users,
  Briefcase,
  Layers,
  Activity,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Cpu,
  Mail,
  Database,
  Building2,
  Zap,
} from 'lucide-react'
import { StatTile, EmptyState } from '@/components/dashboard'
import { Button, Input, Badge, Skeleton } from '@/components/ui'
import { apiGet, apiPatch } from '@/api/client'
import { useAppStore } from '@/store/useAppStore'

interface AdminOverview {
  stats: {
    totalWorkspaces: number
    totalUsers: number
    activeWorkspaces7d: number
    totalLeads: number
    totalProposals: number
  }
  planDistribution: Record<string, number>
}

interface AdminSystemHealth {
  database: 'connected' | 'unreachable'
  aiConfigured: boolean
  emailConfigured: boolean
  environment: string
}

interface AdminUser {
  id: string
  email?: string
  fullName: string
  role: string
  createdAt: string
  lastSignInAt?: string
  workspace: {
    id: string
    name: string
    totalLeads: number
    totalOutreachSent: number
    leadsByStage: {
      discovery: number
      qualified: number
      contacted: number
      client: number
    }
  } | null
}

export function AdminDashboardPage() {
  const currentEmail = useAppStore((s) => s.userEmail)

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [overview, setOverview] = React.useState<AdminOverview | null>(null)
  const [system, setSystem] = React.useState<AdminSystemHealth | null>(null)
  const [users, setUsers] = React.useState<AdminUser[]>([])

  // Search & Filter state
  const [search, setSearch] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState<string>('all')
  const [roleUpdatingId, setRoleUpdatingId] = React.useState<string | null>(null)
  const [actionMessage, setActionMessage] = React.useState<string | null>(null)

  const loadAdminData = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [ovRes, sysRes, usersRes] = await Promise.all([
        apiGet<AdminOverview>('/admin/overview').catch(() => null),
        apiGet<AdminSystemHealth>('/admin/system').catch(() => null),
        apiGet<AdminUser[]>('/admin/users').catch(() => []),
      ])

      setOverview(ovRes)
      setSystem(sysRes)
      setUsers(Array.isArray(usersRes) ? usersRes : [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load platform data')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadAdminData()
  }, [loadAdminData])

  // Handle Role Change
  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user' | 'client') => {
    setRoleUpdatingId(userId)
    setActionMessage(null)
    try {
      await apiPatch(`/admin/users/${userId}/role`, { role: newRole })
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
      setActionMessage(`Role updated successfully to ${newRole}`)
    } catch (err: unknown) {
      setActionMessage(err instanceof Error ? err.message : 'Failed to update user role')
    } finally {
      setRoleUpdatingId(null)
    }
  }

  // Filtered users list
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.workspace?.name || '').toLowerCase().includes(search.toLowerCase())

      const matchRole =
        roleFilter === 'all' || (u.role || 'user').toLowerCase() === roleFilter.toLowerCase()

      return matchSearch && matchRole
    })
  }, [users, search, roleFilter])

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full text-(--text-primary)">
      {/* Platform Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 clay-raised rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-(--danger)/10 text-(--danger)">
              Platform Administration
            </span>
            <span className="text-xs text-(--text-muted)">
              Operator: <strong className="text-(--text-primary)">{currentEmail}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
            Trust & Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-(--text-secondary) mt-1">
            Global tenant health, platform resource metrics, and role governance.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadAdminData}
          disabled={loading}
          className="gap-2 h-10 px-4 text-xs sm:text-sm shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </Button>
      </div>

      {/* System Health Strip (Real booleans from /api/admin/system) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 clay-inset rounded-xl">
        <div className="flex items-center gap-3">
          <Database className={`w-4 h-4 ${system?.database === 'connected' ? 'text-(--success)' : 'text-(--danger)'}`} />
          <div className="text-xs">
            <span className="text-(--text-muted) block">Database:</span>
            <strong className="capitalize text-(--text-primary)">
              {system?.database || 'Connecting...'}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Cpu className={`w-4 h-4 ${system?.aiConfigured ? 'text-(--success)' : 'text-(--warning)'}`} />
          <div className="text-xs">
            <span className="text-(--text-muted) block">AI Provider:</span>
            <strong className="text-(--text-primary)">
              {system?.aiConfigured ? 'Configured & Active' : 'Not Configured'}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className={`w-4 h-4 ${system?.emailConfigured ? 'text-(--success)' : 'text-(--warning)'}`} />
          <div className="text-xs">
            <span className="text-(--text-muted) block">Outreach Email:</span>
            <strong className="text-(--text-primary)">
              {system?.emailConfigured ? 'Live Sending Ready' : 'Disabled'}
            </strong>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 text-xs rounded-lg bg-(--surface-raised) border border-(--border) text-(--text-primary)">
          {actionMessage}
        </div>
      )}

      {/* Platform Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatTile
          label="Total Workspaces"
          value={overview?.stats?.totalWorkspaces ?? '—'}
          isLoading={loading}
          subtext="Total tenant workspaces"
        />
        <StatTile
          label="Total Accounts"
          value={overview?.stats?.totalUsers ?? '—'}
          isLoading={loading}
          subtext="Registered users"
        />
        <StatTile
          label="Active (Last 7d)"
          value={overview?.stats?.activeWorkspaces7d ?? '—'}
          isLoading={loading}
          trendColor="var(--accent)"
          subtext="Active workspace tenants"
        />
        <StatTile
          label="Leads Discovered"
          value={overview?.stats?.totalLeads ?? '—'}
          isLoading={loading}
          subtext="All workspaces combined"
        />
        <StatTile
          label="Proposals Generated"
          value={overview?.stats?.totalProposals ?? '—'}
          isLoading={loading}
          trendColor="var(--success)"
          subtext="Client proposals created"
        />
      </div>

      {/* Plan Distribution Cards */}
      <div className="clay-raised p-5 space-y-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-(--accent)" />
            <h2 className="text-base font-bold text-(--text-primary)">
              Plan Distribution & Capacity
            </h2>
          </div>
          <span className="text-xs text-(--text-muted)">Live workspace tiers</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(overview?.planDistribution || { free: 0, starter: 0, agency: 0, pro: 0, enterprise: 0 }).map(
            ([tier, count]) => (
              <div key={tier} className="clay-inset p-3 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-(--text-muted) block capitalize">
                  {tier}
                </span>
                <span className="text-xl font-bold tabular-nums text-(--text-primary)">
                  {count}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* User Governance & Workspace Mapping */}
      <div className="clay-raised p-5 sm:p-6 space-y-4 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-(--text-primary)">
              User Directory & Role Governance
            </h2>
            <p className="text-xs text-(--text-secondary)">
              Manage tenant accounts and adjust platform access privileges.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
              <Input
                placeholder="Search user or workspace..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-xs w-48 sm:w-64"
              />
            </div>

            <div className="flex items-center gap-1 clay-inset p-1 rounded-lg">
              {(['all', 'admin', 'user', 'client'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors capitalize ${
                    roleFilter === r
                      ? 'bg-(--primary) text-white'
                      : 'text-(--text-secondary) hover:text-(--text-primary)'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-(--border) text-(--text-secondary)">
                <th className="py-2.5 px-3 font-semibold">User</th>
                <th className="py-2.5 px-3 font-semibold">Workspace</th>
                <th className="py-2.5 px-3 font-semibold">Current Role</th>
                <th className="py-2.5 px-3 font-semibold">Created</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td colSpan={5} className="py-3 px-3">
                      <Skeleton className="h-6 w-full rounded" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-(--text-muted)">
                    No users matching the search query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.email === currentEmail
                  return (
                    <tr key={u.id} className="hover:bg-(--surface-hover) transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-(--text-primary)">
                          {u.fullName || 'User'}
                        </div>
                        <div className="text-[11px] text-(--text-muted) font-mono">
                          {u.email || '—'}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {u.workspace ? (
                          <div>
                            <span className="font-medium text-(--text-primary)">
                              {u.workspace.name}
                            </span>
                            <span className="text-[10px] text-(--text-muted) block">
                              {u.workspace.totalLeads} leads tracked
                            </span>
                          </div>
                        ) : (
                          <span className="text-(--text-muted) italic">No workspace</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <Badge
                          variant={u.role === 'admin' ? 'default' : 'secondary'}
                          className="capitalize text-[10px]"
                        >
                          {u.role || 'user'}
                        </Badge>
                      </td>

                      <td className="py-3 px-3 text-(--text-muted) tabular-nums">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-3 text-right">
                        {isCurrent ? (
                          <span className="text-[10px] text-(--text-muted) italic">
                            Current session
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {u.role !== 'admin' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={roleUpdatingId === u.id}
                                onClick={() => handleRoleChange(u.id, 'admin')}
                                className="h-7 text-[11px] px-2.5"
                              >
                                Make Admin
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={roleUpdatingId === u.id}
                                onClick={() => handleRoleChange(u.id, 'user')}
                                className="h-7 text-[11px] px-2.5"
                              >
                                Revoke Admin
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
