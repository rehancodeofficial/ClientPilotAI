import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { Users, Mail, ShieldAlert, AlertTriangle, Building2 } from 'lucide-react'
import {
  getWorkspace,
  getWorkspaceMembers,
  type Workspace,
  type WorkspaceMember,
} from '@/api/profile'

/**
 * Workspace settings.
 *
 * Member data comes from /api/workspace/members, which reads the stored email
 * and the real last_sign_in_at from auth.users. The previous version queried
 * `profiles` directly with the anon key — which carried no email column — and
 * substituted the literals 'admin@clientpilotai.com' and
 * 'user@clientpilotai.com', showing an invented address for every member, with
 * "Active: Just now" hardcoded alongside it.
 *
 * Controls with no backing service (invites, per-member editing, 2FA policy,
 * session timeout) have been removed rather than left as inert buttons.
 */
export function SettingsPage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    Promise.all([getWorkspace(), getWorkspaceMembers()])
      .then(([ws, memberList]) => {
        if (!active) return
        setWorkspace(ws.workspace)
        setMembers(memberList)
        setError(null)
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Could not load workspace settings.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const formatLastSeen = (iso: string | null): string => {
    if (!iso) return 'Never signed in'
    const then = new Date(iso).getTime()
    const minutes = Math.floor((Date.now() - then) / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return new Date(iso).toLocaleDateString()
  }

  const initialsOf = (member: WorkspaceMember): string => {
    const basis = member.full_name || member.email || '?'
    return basis
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div className="p-6 max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Workspace Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Manage your workspace and the people in it.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-4 rounded-md border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-sm">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-red-600" />
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400">
              Could not load workspace settings
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-teal-600" />
                  Members
                </CardTitle>
                <p className="text-xs text-zinc-500">
                  {workspace
                    ? `People with access to ${workspace.name}.`
                    : 'People with access to this workspace.'}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2 mt-4">
                  <div className="h-16 w-full bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="h-16 w-full bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
              ) : members.length === 0 ? (
                <p className="text-sm text-zinc-500 mt-4 py-8 text-center">
                  No members found for this workspace.
                </p>
              ) : (
                <div className="rounded-md border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800 mt-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-500 font-medium">
                          {initialsOf(member)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <span className="truncate">{member.full_name || 'Unnamed member'}</span>
                            {member.role === 'admin' && (
                              <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            )}
                          </p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5 min-w-0">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{member.email || 'No address on record'}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge
                          variant={member.role === 'admin' ? 'warning' : 'secondary'}
                          className="uppercase text-[10px]"
                        >
                          {member.role}
                        </Badge>
                        <p className="text-[10px] text-zinc-400 mt-1">
                          {formatLastSeen(member.last_sign_in_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-600" />
                Workspace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 mt-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-zinc-600 dark:text-zinc-300">Name</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {loading ? '—' : workspace?.name ?? '—'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-zinc-600 dark:text-zinc-300">Members</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {loading ? '—' : members.length}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-zinc-600 dark:text-zinc-300">Created</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {workspace?.created_at
                    ? new Date(workspace.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
