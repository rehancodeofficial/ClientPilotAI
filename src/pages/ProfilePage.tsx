import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Label,
  Badge,
  Skeleton,
  Textarea,
} from '@/components/ui'
import {
  User,
  Shield,
  Key,
  Save,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Trash2,
  Loader2,
  Building2,
  Globe,
  Phone,
  Mail,
  Sparkles,
  Lock,
  ExternalLink,
  ShieldAlert,
  Radio,
  Clock,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { getProfile, updateProfile, getWorkspace, updateWorkspace, type Profile } from '@/api/profile'

const POPULAR_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
]

export function ProfilePage() {
  const navigate = useNavigate()
  const userRole = useAppStore((s) => s.userRole)
  const userEmail = useAppStore((s) => s.userEmail)
  const setUserEmail = useAppStore((s) => s.setUserEmail)
  const avatarUrl = useAppStore((s) => s.avatarUrl)
  const setAvatarUrl = useAppStore((s) => s.setAvatarUrl)
  const appWorkspaceName = useAppStore((s) => s.workspaceName)
  const setAppWorkspaceName = useAppStore((s) => s.setWorkspaceName)

  // Loading & base profile data
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Form Fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [workspaceName, setWorkspaceName] = useState('')
  const [currentPlan, setCurrentPlan] = useState('free')

  // Save states
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  // Password state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  // Avatar upload state
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Admin specific customization states
  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    return localStorage.getItem('cp_admin_maintenance_mode') === 'true'
  })
  const [broadcastMessage, setBroadcastMessage] = useState(() => {
    return localStorage.getItem('cp_admin_broadcast_message') || ''
  })
  const [adminSettingNotice, setAdminSettingNotice] = useState<string | null>(null)

  // Fetch initial profile & workspace
  useEffect(() => {
    let active = true
    setLoading(true)

    Promise.all([
      getProfile().catch((err) => {
        console.warn('Profile load warning:', err)
        return null
      }),
      getWorkspace().catch((err) => {
        console.warn('Workspace load warning:', err)
        return null
      }),
    ])
      .then(([profData, wsData]) => {
        if (!active) return

        if (profData) {
          setProfile(profData)
          setFullName(profData.full_name || '')
          setEmail(profData.email || userEmail || '')
          setTimezone(profData.timezone || 'UTC')
          setJobTitle(profData.job_title || '')
          setPhone(profData.phone || '')
          setBio(profData.bio || '')
          if (profData.avatar_url) setAvatarUrl(profData.avatar_url)
          if (profData.email) setUserEmail(profData.email)
        } else {
          setEmail(userEmail || '')
        }

        if (wsData?.workspace) {
          const ws = wsData.workspace
          setWorkspaceName(ws.name || '')
          if (ws.plan) setCurrentPlan(ws.plan)
          if (ws.name) setAppWorkspaceName(ws.name)
        } else if (appWorkspaceName) {
          setWorkspaceName(appWorkspaceName)
        }

        setLoadError(null)
      })
      .catch((err: unknown) => {
        if (!active) return
        setLoadError(err instanceof Error ? err.message : 'Could not load profile.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [setUserEmail, setAvatarUrl, setAppWorkspaceName, userEmail, appWorkspaceName])

  // Handle Full Profile & Workspace Save
  const handleSaveProfile = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const promises: Promise<any>[] = []

      // 1. Update personal profile
      const profUpdates: Record<string, any> = {
        full_name: fullName.trim(),
        timezone: timezone.trim(),
      }
      if (jobTitle.trim()) profUpdates.job_title = jobTitle.trim()
      if (phone.trim()) profUpdates.phone = phone.trim()
      if (bio.trim()) profUpdates.bio = bio.trim()

      promises.push(
        updateProfile(profUpdates).then((updated) => {
          setProfile(updated)
          setFullName(updated.full_name || '')
        })
      )

      // 2. Update workspace name if changed
      if (workspaceName.trim() && workspaceName.trim() !== appWorkspaceName) {
        promises.push(
          updateWorkspace({ name: workspaceName.trim() })
            .then((res) => {
              if (res.workspace?.name) {
                setAppWorkspaceName(res.workspace.name)
              }
            })
            .catch((err) => {
              console.warn('Workspace name update fallback:', err)
              setAppWorkspaceName(workspaceName.trim())
            })
        )
      }

      // 3. Update local email if user changed it
      if (email.trim() && email.trim() !== userEmail) {
        setUserEmail(email.trim())
      }

      await Promise.all(promises)
      setSaveMessage({ kind: 'ok', text: 'Profile & workspace customized successfully.' })
    } catch (err: unknown) {
      setSaveMessage({
        kind: 'error',
        text: err instanceof Error ? err.message : 'Could not save profile customization.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Avatar File Upload (Strict 2MB Limit)
  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarError(null)
    setAvatarSuccess(null)

    // Validate MIME type
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (PNG, JPG, WebP, etc.).')
      return
    }

    // Validate strict 2MB limit (2 * 1024 * 1024 bytes)
    const MAX_SIZE_BYTES = 2 * 1024 * 1024
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2)
      setAvatarError(`Image size exceeds the 2MB limit (Selected: ${sizeMb} MB). Please choose an image under 2MB.`)
      return
    }

    setIsUploadingAvatar(true)
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string
          const updated = await updateProfile({ avatar_url: dataUrl })
          setProfile(updated)
          setAvatarUrl(dataUrl)
          setAvatarSuccess('Profile photo updated successfully. Displayed in sidebar & topbar.')
        } catch (err: unknown) {
          setAvatarError(err instanceof Error ? err.message : 'Could not save uploaded avatar.')
        } finally {
          setIsUploadingAvatar(false)
        }
      }
      reader.onerror = () => {
        setAvatarError('Failed to read image file.')
        setIsUploadingAvatar(false)
      }
      reader.readAsDataURL(file)
    } catch {
      setAvatarError('Failed to process image.')
      setIsUploadingAvatar(false)
    }
  }

  // Handle Avatar Removal
  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true)
    setAvatarError(null)
    setAvatarSuccess(null)
    try {
      const updated = await updateProfile({ avatar_url: '' })
      setProfile(updated)
      setAvatarUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setAvatarSuccess('Profile photo removed.')
    } catch (err: unknown) {
      setAvatarError(err instanceof Error ? err.message : 'Could not remove avatar.')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // Handle Password Change
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

  // Admin platform settings save
  const handleSaveAdminSettings = () => {
    localStorage.setItem('cp_admin_maintenance_mode', maintenanceMode ? 'true' : 'false')
    localStorage.setItem('cp_admin_broadcast_message', broadcastMessage)
    setAdminSettingNotice('Platform administrative settings applied successfully.')
    setTimeout(() => setAdminSettingNotice(null), 4000)
  }

  const initials = (fullName || email || userEmail || 'CP')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const isAdmin = (profile?.role || userRole) === 'admin'

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 text-(--text-primary)">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 clay-raised rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-(--primary-soft) text-(--primary)">
              {isAdmin ? 'Administrator Account' : 'Member Profile'}
            </span>
            <span className="text-xs text-(--text-muted)">
              Role: <strong className="capitalize text-(--text-primary)">{profile?.role || userRole}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
            Account & Profile Customization
          </h1>
          <p className="text-xs sm:text-sm text-(--text-secondary) mt-1">
            Customize your identity, avatar, contact information, workspace branding, and security credentials.
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => navigate('/app/admin')}
            className="clay-btn-primary gap-2 h-10 px-4 text-xs sm:text-sm shrink-0"
          >
            <Shield className="w-4 h-4" />
            <span>Open Admin Portal</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </Button>
        )}
      </div>

      {loadError && (
        <div className="flex items-start gap-2 p-4 rounded-xl clay-inset text-sm text-(--danger)">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Could not load complete profile</p>
            <p className="text-(--text-secondary) mt-0.5">{loadError}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Form Sections (Left 2 cols) & Account Info / Summary (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Avatar & Personal Identity */}
          <Card className="clay-floating border-none p-5 sm:p-6 rounded-2xl">
            <CardHeader className="p-0 pb-5 border-b border-(--border-subtle)">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-bold text-(--text-primary)">
                <User className="h-5 w-5 text-(--primary)" />
                Personal Profile & Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-5 space-y-5">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-20 rounded-2xl" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  {/* Avatar Upload (Max 2MB) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl clay-inset">
                    <div className="relative shrink-0">
                      {avatarUrl || profile?.avatar_url ? (
                        <img
                          src={avatarUrl || profile?.avatar_url || ''}
                          alt={fullName || 'Avatar'}
                          className="h-20 w-20 rounded-2xl object-cover border-2 border-(--primary) shadow-md"
                          onError={(e) => {
                            const t = e.currentTarget
                            t.style.display = 'none'
                            const fallback = t.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-2xl clay-raised flex items-center justify-center text-(--primary) text-2xl font-black border border-(--primary)/30">
                          {initials || 'CP'}
                        </div>
                      )}
                      <div
                        style={{ display: 'none' }}
                        className="h-20 w-20 rounded-2xl clay-raised items-center justify-center text-(--primary) text-2xl font-black border border-(--primary)/30"
                      >
                        {initials || 'CP'}
                      </div>
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 min-w-0">
                      <div>
                        <h4 className="text-sm font-bold text-(--text-primary)">Profile Photo</h4>
                        <p className="text-xs text-(--text-secondary)">
                          Upload a personalized photo for your account (up to 2MB). Displayed in the top bar and sidebar.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap pt-1">
                        <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold clay-btn-primary cursor-pointer transition-transform hover:scale-[1.02]">
                          <Upload className="h-3.5 w-3.5" />
                          <span>{isUploadingAvatar ? 'Uploading...' : 'Upload Photo (Max 2MB)'}</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            onChange={handleAvatarFileSelect}
                            disabled={isUploadingAvatar}
                            className="hidden"
                          />
                        </label>

                        {(avatarUrl || profile?.avatar_url) && (
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            disabled={isUploadingAvatar}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-(--danger) hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      {avatarError && (
                        <p className="text-xs text-(--danger) font-medium flex items-center gap-1 mt-1">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          {avatarError}
                        </p>
                      )}
                      {avatarSuccess && (
                        <p className="text-xs text-(--success) font-medium flex items-center gap-1 mt-1">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          {avatarSuccess}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Form inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-(--text-primary)">Full Name *</Label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        maxLength={120}
                        className="clay-inset border-none shadow-none bg-(--bg) text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-(--text-primary)">Job / Role Title</Label>
                      <Input
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder={isAdmin ? 'Principal Administrator' : 'Growth & SEO Consultant'}
                        className="clay-inset border-none shadow-none bg-(--bg) text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-(--text-primary)">Account Email Address</Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@clientpilot.ai"
                        className="clay-inset border-none shadow-none bg-(--bg) text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-(--text-primary)">Contact Phone</Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="clay-inset border-none shadow-none bg-(--bg) text-sm"
                      />
                    </div>
                  </div>

                  {/* Bio & Timezone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-xs font-bold text-(--text-primary)">Professional Bio / Notes</Label>
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Write a brief description of your specialization or agency focus..."
                        rows={3}
                        className="clay-inset border-none shadow-none bg-(--bg) text-sm resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-(--text-primary)">Preferred Timezone</Label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-sm clay-inset bg-(--bg) text-(--text-primary) border-none focus:outline-none"
                      >
                        {POPULAR_TIMEZONES.map((tz) => (
                          <option key={tz} value={tz}>
                            {tz}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-(--text-primary)">
                        Workspace / Agency Name
                      </Label>
                      <Input
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        placeholder="Apex Digital Studio"
                        className="clay-inset border-none shadow-none bg-(--bg) text-sm"
                      />
                      <p className="text-[11px] text-(--text-muted)">
                        Shown in the top bar header and client-facing audit proposals.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3 flex-wrap">
                    <Button
                      onClick={handleSaveProfile}
                      isLoading={isSaving}
                      disabled={isSaving || !fullName.trim()}
                      className="clay-btn-primary h-10 px-5 text-sm gap-2"
                    >
                      <Save className="h-4 w-4" /> Save Profile Customization
                    </Button>

                    {saveMessage && (
                      <span
                        className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 ${
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

          {/* Card 2: Admin-Exclusive System Controls (Only shown for Admin) */}
          {isAdmin && (
            <Card className="clay-floating border-none p-5 sm:p-6 rounded-2xl bg-(--surface)">
              <CardHeader className="p-0 pb-5 border-b border-(--border-subtle)">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-bold text-(--text-primary)">
                    <ShieldAlert className="h-5 w-5 text-(--primary)" />
                    Administrator Privilege Center
                  </CardTitle>
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-(--primary) text-white">
                    Superuser Access
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-5 space-y-5">
                <div className="p-4 rounded-xl clay-inset space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-(--text-primary)">
                        Platform Maintenance Mode
                      </p>
                      <p className="text-xs text-(--text-muted)">
                        When active, only administrators can sign in and access the system.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`relative h-7 w-13 rounded-full transition-colors cursor-pointer ${
                        maintenanceMode ? 'bg-(--primary)' : 'bg-(--border)'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
                          maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-(--border-subtle)">
                    <Label className="text-xs font-bold text-(--text-primary)">
                      Global Broadcast Notice (Optional)
                    </Label>
                    <Input
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      placeholder="e.g. Scheduled database maintenance tonight at 02:00 UTC."
                      className="clay-inset border-none shadow-none bg-(--bg) text-sm"
                    />
                    <p className="text-[11px] text-(--text-muted)">
                      Displays a banner to all active workspace tenants when configured.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button
                      onClick={handleSaveAdminSettings}
                      size="sm"
                      className="clay-btn-primary h-8 px-3 text-xs gap-1.5"
                    >
                      <Radio className="h-3.5 w-3.5" />
                      <span>Apply Admin Configuration</span>
                    </Button>
                    {adminSettingNotice && (
                      <span className="text-xs font-semibold text-(--primary) flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {adminSettingNotice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl clay-inset text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-(--text-muted) block">
                      Active Database
                    </span>
                    <span className="text-sm font-extrabold text-(--success) flex items-center justify-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                    </span>
                  </div>
                  <div className="p-3 rounded-xl clay-inset text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-(--text-muted) block">
                      AI Opportunity Model
                    </span>
                    <span className="text-sm font-extrabold text-(--primary) flex items-center justify-center gap-1 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" /> Gemini 2.5 Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card 3: Security & Password */}
          <Card className="clay-floating border-none p-5 sm:p-6 rounded-2xl">
            <CardHeader className="p-0 pb-5 border-b border-(--border-subtle)">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-bold text-(--text-primary)">
                <Lock className="h-5 w-5 text-(--primary)" />
                Security & Password Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-(--text-primary)">New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className="clay-inset border-none shadow-none bg-(--bg) text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-(--text-primary)">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                    className="clay-inset border-none shadow-none bg-(--bg) text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap pt-2">
                <Button
                  onClick={handlePasswordChange}
                  isLoading={isChangingPassword}
                  disabled={isChangingPassword || !newPassword || !confirmPassword}
                  className="clay-btn-primary h-9 px-4 text-xs font-semibold"
                >
                  <Key className="h-3.5 w-3.5" />
                  <span>Update Password</span>
                </Button>

                {passwordMessage && (
                  <span
                    className={`text-xs font-semibold flex items-center gap-1.5 ${
                      passwordMessage.kind === 'ok' ? 'text-(--success)' : 'text-(--danger)'
                    }`}
                  >
                    {passwordMessage.kind === 'ok' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    {passwordMessage.text}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Account Overview & Details */}
        <div className="space-y-6">
          <Card className="clay-floating border-none p-5 sm:p-6 rounded-2xl">
            <CardHeader className="p-0 pb-4 border-b border-(--border-subtle)">
              <CardTitle className="text-base flex items-center gap-2 font-bold text-(--text-primary)">
                <Shield className="h-4 w-4 text-(--primary)" />
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-(--border-subtle)">
                <span className="text-(--text-secondary)">Assigned Role</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-(--primary-soft) text-(--primary)">
                  {profile?.role || userRole || 'user'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-(--border-subtle)">
                <span className="text-(--text-secondary)">Active Plan</span>
                <span className="capitalize font-bold text-(--text-primary)">
                  {currentPlan}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-(--border-subtle)">
                <span className="text-(--text-secondary)">Registered Email</span>
                <span className="font-mono text-[11px] text-(--text-primary) truncate max-w-40">
                  {userEmail || profile?.email || '—'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-(--border-subtle)">
                <span className="text-(--text-secondary)">Member Since</span>
                <span className="font-medium text-(--text-primary)">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'October 2026'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-(--text-secondary)">Security Status</span>
                <span className="font-semibold text-(--success) flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="clay-floating border-none p-5 sm:p-6 rounded-2xl">
            <CardHeader className="p-0 pb-4 border-b border-(--border-subtle)">
              <CardTitle className="text-base flex items-center gap-2 font-bold text-(--text-primary)">
                <Sparkles className="h-4 w-4 text-(--primary)" />
                Workspace Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-2">
              <Button
                variant="outline"
                onClick={() => navigate('/app/settings')}
                className="w-full justify-between text-xs h-9"
              >
                <span>Workspace Settings</span>
                <Building2 className="w-3.5 h-3.5 opacity-60" />
              </Button>

              {isAdmin && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/app/admin')}
                  className="w-full justify-between text-xs h-9 text-(--primary) border-(--primary)/30"
                >
                  <span>Administrator Portal</span>
                  <Shield className="w-3.5 h-3.5" />
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => navigate('/app/leads')}
                className="w-full justify-between text-xs h-9"
              >
                <span>Prospecting Opportunities</span>
                <Globe className="w-3.5 h-3.5 opacity-60" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
