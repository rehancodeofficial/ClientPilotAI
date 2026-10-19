import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Radar, Kanban, Users, Settings, ChevronLeft, ChevronRight,
  FileText, MessageSquare, Map, BarChart3, FlaskConical, Wand2, ShieldCheck,
  UserCog,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

// ============================================================
// Navigation Groups — Overview (Dashboard on top) / Intelligence / Workspace / System
// ============================================================

const overviewGroupUser = {
  label: 'OVERVIEW',
  items: [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  ],
}

const overviewGroupAdmin = {
  label: 'OVERVIEW',
  items: [
    { to: '/app/admin', label: 'Admin Portal', icon: ShieldCheck, end: false },
  ],
}

const intelligenceGroup = {
  label: 'INTELLIGENCE',
  items: [
    { to: '/app/discover', label: 'Opportunity Discovery', icon: Radar, end: false },
    { to: '/app/market', label: 'Market Intelligence', icon: BarChart3, end: false },
    { to: '/app/zones', label: 'Opportunity Zones', icon: Map, end: false },
    { to: '/app/evaluation', label: 'Intelligence Evaluation', icon: FlaskConical, end: false },
  ],
}

const workspaceGroup = {
  label: 'WORKSPACE',
  items: [
    { to: '/app/leads', label: 'All Opportunities', icon: Users, end: false },
    { to: '/app/pipeline', label: 'Pipeline CRM', icon: Kanban, end: false },
    { to: '/app/messages', label: 'Message Records', icon: MessageSquare, end: false },
    { to: '/app/proposals', label: 'Proposals', icon: FileText, end: false },
  ],
}

const systemGroupUser = {
  label: 'SYSTEM',
  items: [
    { to: '/app/profile', label: 'Profile Settings', icon: UserCog, end: false },
  ],
}

const systemGroupAdmin = {
  label: 'SYSTEM',
  items: [
    { to: '/app/settings', label: 'Workspace Settings', icon: Settings, end: false },
    { to: '/app/profile', label: 'Profile Settings', icon: UserCog, end: false },
  ],
}

// ============================================================
// NavGroup Component
// ============================================================
function NavGroup({
  label,
  items,
  collapsed,
  location,
}: {
  label: string
  items: { to: string; label: string; icon: React.ComponentType<{ className?: string }>; end: boolean }[]
  collapsed: boolean
  location: { pathname: string }
}) {
  if (items.length === 0) return null
  return (
    <div className="mb-1">
      <AnimatePresence>
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="text-[9px] font-bold text-(--text-secondary) tracking-widest uppercase px-3 pt-3 pb-1"
          >
            {label}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="space-y-0.5">
        {items.map(({ to, label: itemLabel, icon: Icon, end }) => {
          const isActive = end ? location.pathname === to : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-[13px] transition-all relative overflow-hidden',
                isActive
                  ? 'clay-raised bg-(--primary) text-[#101010] shadow-sm'
                  : 'text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)'
              )}
              title={collapsed ? itemLabel : undefined}
            >
              {isActive && (
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#101010]" />
              )}
              <Icon className={cn('h-4.25 w-4.25 shrink-0', isActive ? 'text-[#101010] ml-1' : '')} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="truncate"
                  >
                    {itemLabel}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================
// Sidebar
// ============================================================
export function Sidebar() {
  const navigate = useNavigate()
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggle = useAppStore((s) => s.toggleSidebar)
  const userRole = useAppStore((s) => s.userRole)
  const userEmail = useAppStore((s) => s.userEmail)
  const avatarUrl = useAppStore((s) => s.avatarUrl)
  const location = useLocation()

  const accountName = userEmail ? userEmail.split('@')[0] : 'Member'
  const initials = (userEmail ? userEmail.replace(/[^a-zA-Z]/g, '') : 'WA')
    .slice(0, 2)
    .toUpperCase() || 'WA'

  const overviewGroup = userRole === 'admin' ? overviewGroupAdmin : overviewGroupUser
  const systemGroup = userRole === 'admin' ? systemGroupAdmin : systemGroupUser

  return (
    <motion.div className="py-4 pl-4 h-screen"
      animate={{ width: collapsed ? 80 + 16 : 280 + 16 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <motion.aside
        className="clay-floating h-full flex flex-col overflow-hidden relative z-20"
      >
        {/* Logo / Brand */}
        <div className="h-16 flex items-center px-5 shrink-0 border-b border-(--border-subtle)">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/logo.png"
              alt="ClientPilot AI"
              className="h-8 w-8 rounded-md shrink-0 object-cover"
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="min-w-0"
                >
                  <p className="text-[15px] font-bold text-(--text-primary) leading-none whitespace-nowrap">
                    ClientPilot<span className="text-(--primary) ml-1 font-black">AI</span>
                  </p>
                  <p className="text-[10px] text-(--text-secondary) leading-none mt-1 whitespace-nowrap font-mono tracking-widest uppercase">
                    Intelligence Platform
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Person Profile Header at top of sidebar */}
        <div
          onClick={() => navigate('/app/profile')}
          className="mx-3 mt-3 mb-1 p-2 rounded-2xl clay-inset cursor-pointer hover:bg-(--surface-hover) transition-all flex items-center gap-2.5 group"
          title="Profile & Account Settings"
        >
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={accountName}
                className="h-10 w-10 rounded-xl object-cover border-1.5 border-(--primary) shadow-sm"
                onError={(e) => {
                  const t = e.currentTarget
                  t.style.display = 'none'
                  const fallback = t.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
            ) : (
              <div className="h-10 w-10 rounded-xl clay-raised flex items-center justify-center text-(--primary) font-black text-sm border border-(--primary)/30">
                {initials}
              </div>
            )}
            <div
              style={{ display: 'none' }}
              className="h-10 w-10 rounded-xl clay-raised items-center justify-center text-(--primary) font-black text-sm border border-(--primary)/30"
            >
              {initials}
            </div>
            {/* Active live indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--primary) opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-(--primary) border-2 border-(--surface)" />
            </span>
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                className="min-w-0 flex-1"
              >
                <p className="text-[13px] font-bold text-(--text-primary) leading-snug truncate group-hover:text-(--primary) transition-colors">
                  {accountName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-(--primary-soft) text-(--primary)">
                    {userRole === 'admin' ? 'Administrator' : 'Member'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-2 px-3">
          <NavGroup label={overviewGroup.label} items={overviewGroup.items} collapsed={collapsed} location={location} />
          <NavGroup label={intelligenceGroup.label} items={intelligenceGroup.items} collapsed={collapsed} location={location} />
          <NavGroup label={workspaceGroup.label} items={workspaceGroup.items} collapsed={collapsed} location={location} />
          <NavGroup label={systemGroup.label} items={systemGroup.items} collapsed={collapsed} location={location} />
        </nav>
      </motion.aside>
    </motion.div>
  )
}
