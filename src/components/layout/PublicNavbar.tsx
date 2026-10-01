import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'

const navLinks = [
  { label: 'Product', href: '/product' },
  { label: 'Features', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
]

const mobileLinks = [...navLinks, { label: 'About', href: '/about' }, { label: 'FAQ', href: '/faq' }, { label: 'Contact', href: '/contact' }]

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-[#edede8]/90 backdrop-blur-md border-b border-black/10 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group text-[#292929]">
          <div className="w-5 h-5 rounded-full bg-[#141414] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#4cc02b]" />
          </div>
          <span className="text-base font-normal tracking-tight text-[#292929] font-heading">
            ClientPilot <span className="text-xs text-[#6f6f6e] font-normal">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-normal transition-colors ${
                isActive(link.href)
                  ? 'text-[#141414]'
                  : 'text-[#353535] hover:text-[#141414]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-normal text-[#353535] hover:text-[#141414] transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-[18px] h-[38px] rounded-full text-sm font-normal text-white bg-[#141414] hover:bg-[#292929] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <span>Start Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/signup"
            className="px-3 py-1.5 rounded-full text-xs font-normal text-white bg-[#141414]"
          >
            Start Free
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full text-[#292929] hover:bg-[#dbdbd2] transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden bg-[#edede8] border-b border-black/10 overflow-hidden"
          >
            <div className="px-6 pt-3 pb-6 space-y-4">
              <div className="flex flex-col gap-1">
                {mobileLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 text-base font-normal transition-colors capitalize ${
                      isActive(link.href)
                        ? 'text-[#141414]'
                        : 'text-[#292929] hover:text-[#141414]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="pt-3 border-t border-black/10 grid gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full text-sm font-normal text-[#292929] bg-[#dbdbd2] hover:bg-[#d0d0c8] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full text-sm font-normal text-white bg-[#141414] hover:bg-[#292929] transition-colors"
                >
                  Start Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
