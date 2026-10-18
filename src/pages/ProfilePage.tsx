import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label, Badge, Skeleton } from '@/components/ui'
import { User, Shield, Key, Save, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { getProfile, updateProfile, type Profile } from '@/api/profile'
import { supabase } from '@/lib/supabaseClient'

/**
 * Account settings.
 *
 * Every control here writes somewhere real. The previous version resolved an
 * 800ms timer and reported "Profile updated successfully" without issuing a
 * request, offered a password form with no submit handler, and rendered the
 * notification preferences as plain divs with no state behind them. Controls
 * that have no backing service yet are now absent rather than decorative.
 */
export function ProfilePage() {
  const userRole = useAppStore((s) => s.userRole)
  const setUserEmail = useAppStore((s) => s.setUserEmail)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    getProfile()
      .then((data) => {
        if (!active) return
        setProfile(data)
        setName(data.full_name ?? '')
        if (data.email) setUserEmail(data.email)
        setLoadError(null)
      })
      .catch((err: unknown) => {
        if (!active) return
        setLoadError(err instanceof Error ? err.message : 'Could not load your profile.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [setUserEmail])

  const trimmedName = name.trim()
  const nameChanged = !!profile && trimmedName !== (profile.full_name ?? '')

  const handleSave = async () => {
    if (!nameChanged || trimmedName.length === 0) return
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const updated = await updateProfile({ full_name: trimmedName })
      setProfile(updated)
      setName(updated.full_name ?? '')
      setSaveMessage({ kind: 'ok', text: 'Profile updated.' })
    } catch (err: unknown) {
      setSaveMessage({
        kind: 'error',
        text: err instanceof Error ? err.message : 'Could not save your profile.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordMessage(null)

    if (newPassword.length < 8) {
      setPasswordMessage({ kind: 'error', text: 'Password must be at least 8 characters.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ kind: 'error', text: 'The two passwords do not match.' })
      return
    }

    setIsChangingPassword(true)
    try {
      const { apiPost } = await import('@/api/client')
      await apiPost('/auth/change-password', {
        newPassword,
      })
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMessage({ kind: 'ok', text: 'Password updated successfully.' })
    } catch (err: unknown) {
      setPasswordMessage({
        kind: 'error',
        text: err instanceof Error ? err.message : 'Could not update your password.',
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const initials = (trimmedName || profile?.email || '')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="p-6 max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-(--text-primary)">User Profile</h1>
        <p className="text-sm text-(--text-secondary) mt-0.5">
          Manage your personal account settings.
        </p>
      </div>

      {loadError && (
        <div className="flex items-start gap-2 p-4 rounded-xl clay-inset text-sm text-(--danger)">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Could not load your profile</p>
            <p className="text-(--text-secondary) mt-0.5">{loadError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="clay-floating border-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-(--primary)" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full clay-inset flex items-center justify-center text-(--primary) text-xl font-bold">
                      {initials || '—'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Full Name</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={120}
                        className="clay-inset border-none shadow-none bg-(--bg)"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email Address</Label>
                      <Input
                        value={profile?.email ?? ''}
                        disabled
                        className="clay-inset border-none shadow-none bg-(--bg) opacity-70"
                      />
                      <p className="text-[11px] text-(--text-secondary)">
                        Changing your email requires verifying the new address.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-3 flex-wrap">
                    <Button
                      onClick={handleSave}
                      isLoading={isSaving}
                      disabled={!nameChanged || trimmedName.length === 0 || isSaving}
                      className="clay-btn-primary h-9 px-4 text-sm gap-2"
                    >
                      <Save className="h-4 w-4" /> Save Changes
                    </Button>
                    {saveMessage && (
                      <span
                        className={`text-sm font-medium flex items-center gap-1.5 ${
                          saveMessage.kind === 'ok' ? 'text-(--success)' : 'text-(--danger)'
                        }`}
                      >
                        {saveMessage.kind === 'ok' ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        {saveMessage.text}
                      </span>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="clay-floating border-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-4 w-4 text-(--primary)" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5 max-w-md">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="clay-inset border-none shadow-none bg-(--bg)"
                />
              </div>
              <div className="space-y-1.5 max-w-md">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="clay-inset border-none shadow-none bg-(--bg)"
                />
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePasswordChange}
                  isLoading={isChangingPassword}
                  disabled={isChangingPassword || !newPassword || !confirmPassword}
                  className="mt-2"
                >
                  Update Password
                </Button>
                {passwordMessage && (
                  <span
                    className={`text-sm font-medium mt-2 ${
                      passwordMessage.kind === 'ok' ? 'text-(--success)' : 'text-(--danger)'
                    }`}
                  >
                    {passwordMessage.text}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="clay-floating border-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-(--primary)" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--text-secondary)">Role</span>
                <Badge
                  variant={(profile?.role ?? userRole) === 'admin' ? 'warning' : 'secondary'}
                  className="uppercase text-[10px]"
                >
                  {profile?.role ?? userRole ?? 'user'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--text-secondary)">Member since</span>
                <span className="text-sm text-(--text-primary) font-medium">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString(undefined, {
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
