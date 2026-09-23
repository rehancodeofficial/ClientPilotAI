import { useState, useEffect } from 'react'
import { Moon, Sun, ChevronDown, LogOut, Search } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useTheme } from 'next-themes'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { NotificationBell } from './NotificationPanel'
import { DemoModeToggle } from '@/components/ui/DemoModeToggle'
import { GlobalSearchModal } from './GlobalSearchModal'

export function TopBar() {
  const { theme, setTheme } = useTheme()
  const userRole = useAppStore((s) => s.userRole)
  const userEmail = useAppStore((s) => s.userEmail)
  const setUserRole = useAppStore((s) => s.setUserRole)
  const setUserEmail = useAppStore((s) => s.setUserEmail)
  const navigate = useNavigate()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserRole(null)
    setUserEmail(null)
    navigate('/')
  }

  return (
    <>
      <header 
        className="h-[74px] shrink-0 flex items-center justify-between px-6 z-10 clay-floating rounded-none border-b border-(--border)"
      >
        {/* Left: workspace name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-3.5 py-1.5 clay-inset cursor-pointer hover:bg-(--surface-hover) transition-colors">
            <img src="/logo.png" alt="" className="h-6 w-6 rounded-lg object-cover drop-shadow-md" />
            <span className="text-[14px] font-bold text-(--text-primary) tracking-tight">
              Acme Software Agency
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
        {/* FYP Defense Demo Scenario Selector */}
        <DemoModeToggle />

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
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
          className="relative h-10 w-16 flex items-center clay-inset p-1"
          title="Toggle dark mode"
        >
          <div className={`h-8 w-8 rounded-full clay-raised flex items-center justify-center transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
            {theme === 'dark' ? <Moon className="h-4 w-4 text-(--primary)" /> : <Sun className="h-4 w-4 text-(--primary)" />}
          </div>
        </button>

        {/* Avatar */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity ml-2"
          onClick={() => navigate('/app/profile')}
          title="User Profile"
        >
          <div className="h-11 w-11 rounded-full clay-raised flex items-center justify-center text-(--primary) font-bold text-sm shrink-0">
            {userRole === 'admin' ? 'AD' : 'US'}
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-bold text-(--text-primary) leading-none">
              {userRole === 'admin' ? 'Admin User' : 'Normal User'}
            </p>
            <p className="text-[11px] text-(--text-secondary) leading-none mt-1.5 font-semibold">
              {userEmail || 'user@example.com'}
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
