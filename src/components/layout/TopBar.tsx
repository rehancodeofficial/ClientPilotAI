import { useState, useEffect } from 'react'
import { Moon, Sun, ChevronDown, LogOut, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useTheme } from 'next-themes'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { NotificationBell } from './NotificationPanel'
import { GlobalSearchModal } from './GlobalSearchModal'

export function TopBar() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark')

  const userRole = useAppStore((s) => s.userRole)
  const userEmail = useAppStore((s) => s.userEmail)
  const setUserRole = useAppStore((s) => s.setUserRole)
  const avatarUrl = useAppStore((s) => s.avatarUrl)
  const workspaceName = useAppStore((s) => s.workspaceName)
  const setWorkspaceName = useAppStore((s) => s.setWorkspaceName)
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  // Derived from the signed-in address.
  const accountName = userEmail ? userEmail.split('@')[0] : 'Account'
  const initials = (userEmail ? userEmail.replace(/[^a-zA-Z]/g, '') : 'AC')
    .slice(0, 2)
    .toUpperCase() || 'AC'
  const setUserEmail = useAppStore((s) => s.setUserEmail)
  const navigate = useNavigate()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Fetch real workspace name dynamically if not in store
  useEffect(() => {
    if (!workspaceName) {
      import('@/api/client').then(({ apiGet }) => {
        apiGet<{ workspace: { name?: string } }>('/workspace')
          .then((res) => {
            if (res?.workspace?.name) {
              setWorkspaceName(res.workspace.name)
            }
          })
          .catch(() => {})
      })
    }
  }, [workspaceName, setWorkspaceName])

  const displayWorkspace = workspaceName || (userEmail ? `${userEmail.split('@')[0]}'s Workspace` : 'Workspace')

  // Global keyboard shortcut: ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const clearAuth = useAppStore((s) => s.clearAuth)

  const handleLogout = async () => {
    try {
      let rawApiUrl = (import.meta.env.VITE_API_URL || '/api').trim()
      if (rawApiUrl.startsWith('http')) {
        if (rawApiUrl.endsWith('/')) rawApiUrl = rawApiUrl.slice(0, -1)
        if (!rawApiUrl.endsWith('/api')) rawApiUrl += '/api'
      } else if (!rawApiUrl.startsWith('/api')) {
        rawApiUrl = '/api'
      }
      await fetch(`${rawApiUrl}/auth/logout`, { method: 'POST' }).catch(() => {})
    } finally {
      clearAuth()
      navigate('/')
    }
  }

  return (
    <>
      <header 
        className="h-18.5 shrink-0 flex items-center justify-between px-6 z-10 clay-floating rounded-none border-b border-(--border-subtle)"
      >
        {/* Left: dynamic workspace name & sidebar collapse toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl clay-inset hover:bg-(--surface-hover) text-(--text-secondary) hover:text-(--text-primary) transition-all cursor-pointer flex items-center justify-center shrink-0"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>

          <div className="flex items-center gap-3 px-3.5 py-1.5 clay-inset cursor-pointer hover:bg-(--surface-hover) transition-colors">
            <img src="/logo.png" alt="" className="h-6 w-6 rounded-lg object-cover drop-shadow-md" />
            <span className="text-[14px] font-bold text-(--text-primary) tracking-tight">
              {displayWorkspace}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-(--text-muted)" />
          </div>

          {/* Center-Left: Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 clay-inset text-(--text-muted) hover:text-(--text-primary) text-xs font-medium transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-(--text-muted)" />
            <span>Search businesses, opportunities, proposals...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-(--surface) text-(--text-muted) border border-(--border)">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: live indicator + actions */}
        <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full clay-inset">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--primary) opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-(--primary)" />
          </span>
          <span className="text-[11px] font-extrabold text-(--primary) tracking-widest uppercase">Live</span>
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* Dark mode toggle */}
        <button 
          onClick={() => setTheme(isDark ? 'light' : 'dark')} 
          className="relative h-10 w-16 flex items-center clay-inset p-1 cursor-pointer transition-colors"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <div className={`h-8 w-8 rounded-full clay-raised flex items-center justify-center transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`}>
            {isDark ? <Moon className="h-4 w-4 text-(--primary)" /> : <Sun className="h-4 w-4 text-(--primary)" />}
          </div>
        </button>

        {/* Avatar */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity ml-2"
          onClick={() => navigate('/app/profile')}
          title="User Profile"
        >
          {avatarUrl ? (
            <div className="h-11 w-11 rounded-full overflow-hidden clay-raised border-1.5 border-(--primary) shrink-0 flex items-center justify-center bg-(--surface)">
              <img
                src={avatarUrl}
                alt={accountName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const t = e.currentTarget
                  t.style.display = 'none'
                  const fb = t.nextElementSibling as HTMLElement
                  if (fb) fb.style.display = 'flex'
                }}
              />
              <div style={{ display: 'none' }} className="h-full w-full items-center justify-center text-(--primary) font-bold text-sm">
                {initials}
              </div>
            </div>
          ) : (
            <div className="h-11 w-11 rounded-full clay-raised flex items-center justify-center text-(--primary) font-bold text-sm shrink-0">
              {initials}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-[13px] font-bold text-(--text-primary) leading-none">
              {accountName}
            </p>
            <p className="text-[11px] text-(--text-secondary) leading-none mt-1.5 font-semibold">
              {userRole === 'admin' ? 'Administrator' : 'Member'}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout} 
          title="Log out" 
          className="relative h-10 w-10 flex items-center justify-center clay-raised hover:text-(--danger) text-(--text-secondary) ml-2"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>

    {/* Global Search Modal Triggered by ⌘K */}
    <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
