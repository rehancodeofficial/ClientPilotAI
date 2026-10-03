import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, HelpCircle, Mail } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  badge?: string
}

const navLinks: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Product', href: '/product' },
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
]

const extraMobileLinks = [
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
  { label: 'Contact', href: '/contact', icon: Mail },
]

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Track scroll position for dynamic glassmorphism and compact header transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 16) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => location.pathname === path

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 font-sans ${
        scrolled
          ? 'bg-[#edede8]/98 backdrop-blur-md border-b border-black/10 shadow-[0_2px_16px_rgba(0,0,0,0.05)] py-2.5'
          : 'bg-[#edede8] border-b border-black/8 py-3.5'
      }`}
    >
      <div className="max-w-310 mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo with Live Pulse Indicator */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group text-charcoal-body select-none shrink-0"
        >
          <div className="relative flex items-center justify-center">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="w-8 h-8 rounded-lg overflow-hidden border border-black/10 shadow-xs bg-graphite-ink flex items-center justify-center shrink-0"
            >
              <img
                src="/logo.png"
                alt="ClientPilot AI Logo"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-pulse opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-pulse"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-graphite-ink font-heading flex items-center gap-1.5 leading-none">
              ClientPilot
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/5 text-[#5c5c5b] font-semibold border border-black/5">
                AI
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Animated Navigation (>= xl or lg with compact padding) */}
        <nav
          onMouseLeave={() => setHoveredPath(null)}
          className="hidden xl:flex items-center gap-1 bg-black/3 p-1.5 rounded-full border border-black/5"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href)
            const isHovered = hoveredPath === link.href

            return (
              <Link
                key={link.href}
                to={link.href}
                onMouseEnter={() => setHoveredPath(link.href)}
                className={`relative px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 rounded-full select-none ${
                  active
                    ? 'text-graphite-ink'
                    : isHovered
                    ? 'text-graphite-ink'
                    : 'text-[#5c5c5b] hover:text-graphite-ink'
                }`}
              >
                {/* Active or Hover Sliding Pill Animation */}
                {(active || isHovered) && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.38 }}
                    className={`absolute inset-0 rounded-full ${
                      active
                        ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-black/8'
                        : 'bg-black/5'
                    }`}
                  />
                )}

                <span className="relative z-10 flex items-center gap-1.5">
                  {link.label}
                  {link.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded-full bg-lime-pulse/15 text-[#2e7d1b] font-mono font-semibold">
                      {link.badge}
                    </span>
                  )}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions (Sign In + Start Free) */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          <Link
            to="/login"
            className="px-3.5 py-1.5 text-xs font-medium text-[#4a4a49] hover:text-graphite-ink hover:bg-black/5 rounded-full transition-all duration-150"
          >
            Sign In
          </Link>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Link
              to="/signup"
              className="relative group inline-flex items-center gap-2 px-4 h-9 rounded-full text-xs font-medium text-white bg-graphite-ink hover:bg-[#242424] transition-all shadow-sm shadow-black/10 overflow-hidden"
            >
              <span className="relative z-10 font-medium">Start Free</span>
              <ArrowRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            </Link>
          </motion.div>
        </div>

        {/* Tablet & Mobile Right Bar (< xl) */}
        <div className="flex items-center gap-2.5 xl:hidden">
          {/* Quick Sign In link on tablet */}
          <Link
            to="/login"
            className="hidden sm:inline-block px-3 py-1.5 text-xs font-medium text-[#4a4a49] hover:text-graphite-ink hover:bg-black/5 rounded-full transition-colors"
          >
            Sign In
          </Link>

          {/* Quick CTA button on tablet & mobile */}
          <Link
            to="/signup"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white bg-graphite-ink active:scale-95 transition-transform shadow-xs"
          >
            Start Free
          </Link>

          {/* Menu Hamburger / Close Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-charcoal-body bg-black/5 hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer (< xl) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="xl:hidden bg-[#edede8] border-b border-black/10 overflow-hidden shadow-lg"
          >
            <div className="max-w-310 mx-auto px-4 sm:px-6 pt-3 pb-6 space-y-4">
              {/* Responsive Navigation Grid (1 col on mobile, 3 cols on tablet) */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.03 },
                  },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5"
              >
                {navLinks.map((link) => {
                  const active = isActive(link.href)
                  return (
                    <motion.div
                      key={link.href}
                      variants={{
                        hidden: { opacity: 0, y: -6 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          active
                            ? 'bg-white text-graphite-ink shadow-xs border border-black/8 font-semibold'
                            : 'text-[#444443] hover:text-graphite-ink hover:bg-black/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {link.label}
                          {link.badge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-lime-pulse/15 text-[#2e7d1b] font-mono">
                              {link.badge}
                            </span>
                          )}
                        </span>
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-pulse" />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Extra links & Quick CTAs */}
              <div className="pt-3 border-t border-black/8 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {extraMobileLinks.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-[#5c5c5b] hover:text-graphite-ink bg-white/60 hover:bg-white border border-black/5 transition-colors"
                    >
                      <item.icon className="w-3.5 h-3.5 text-ash-subheading" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-medium text-charcoal-body bg-warm-stone hover:bg-quartz transition-colors text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-medium text-white bg-graphite-ink hover:bg-charcoal-body transition-colors shadow-xs text-center"
                  >
                    <span>Start Free</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
