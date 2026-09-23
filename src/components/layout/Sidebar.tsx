import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Radar, Kanban, Users, Settings, ChevronLeft, ChevronRight,
  FileText, MessageSquare, Map, BarChart3, FlaskConical, Sparkles, ShieldCheck,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

// ============================================================
// Navigation Groups — Intelligence / Workspace / System
// ============================================================

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
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/app/leads', label: 'All Opportunities', icon: Users, end: false },
    { to: '/app/pipeline', label: 'Pipeline CRM', icon: Kanban, end: false },
    { to: '/app/messages', label: 'Message Records', icon: MessageSquare, end: false },
    { to: '/app/proposals', label: 'Proposals', icon: FileText, end: false },
  ],
}

const systemGroupUser = {
  label: 'SYSTEM',
  items: [] as { to: string; label: string; icon: typeof Settings; end: boolean }[],
}

const systemGroupAdmin = {
  label: 'SYSTEM',
  items: [
    { to: '/app/admin', label: 'Admin Panel', icon: ShieldCheck, end: false },
    { to: '/app/settings', label: 'Settings', icon: Settings, end: false },
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
                'flex items-center gap-3 px-3 py-2.5 rounded-2xl font-semibold text-[13px] transition-all relative overflow-hidden',
                isActive
                  ? 'clay-inset bg-(--primary-soft) text-(--primary)'
                  : 'text-(--text-secondary) hover:bg-(--surface-raised) hover:text-(--text-primary)'
              )}
              title={collapsed ? itemLabel : undefined}
            >
              {isActive && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-(--primary)" />
              )}
              <Icon className={cn('h-[17px] w-[17px] shrink-0', isActive && 'ml-1')} />
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
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggle = useAppStore((s) => s.toggleSidebar)
  const userRole = useAppStore((s) => s.userRole)
  const location = useLocation()

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
        <div className="h-20 flex items-center px-5 shrink-0">
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

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-2 px-3">
          <NavGroup label={intelligenceGroup.label} items={intelligenceGroup.items} collapsed={collapsed} location={location} />
          <NavGroup label={workspaceGroup.label} items={workspaceGroup.items} collapsed={collapsed} location={location} />
          <NavGroup label={systemGroup.label} items={systemGroup.items} collapsed={collapsed} location={location} />
        </nav>

        {/* Intelligence badge */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-4 mb-4 px-4 py-3 clay-inset"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3 w-3 text-(--primary)" />
                <p className="text-[10px] font-bold text-(--text-secondary) uppercase tracking-widest">Powered by</p>
              </div>
              <p className="text-[12px] font-bold text-(--text-primary) truncate">Gemini 2.5 Flash</p>
              <p className="text-[10px] text-(--text-secondary) mt-0.5">Business Intelligence Engine</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <div className="p-4 pt-0">
          <button
            onClick={toggle}
            className="w-full flex items-center justify-center h-10 clay-raised text-(--text-secondary) hover:text-(--primary)"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </motion.aside>
    </motion.div>
  )
}
