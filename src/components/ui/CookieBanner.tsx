import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, Cookie } from 'lucide-react'

const STORAGE_KEY = 'clientpilot_cookie_consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-banner"
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-9999 w-[calc(100%-2rem)] max-w-2xl"
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
        >
          <div className="relative bg-white/95 backdrop-blur-xl border border-black/8 rounded-2xl shadow-2xl shadow-black/12 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-lime-pulse/10 border border-lime-pulse/20 flex items-center justify-center">
              <Cookie className="w-5 h-5 text-[#2a7a18]" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal-body leading-snug mb-0.5">
                We use cookies to improve your experience
              </p>
              <p className="text-xs text-slate-caption leading-relaxed">
                We use essential and analytics cookies to make ClientPilot work better for you.{' '}
                <Link
                  to="/cookies"
                  className="text-[#2a7a18] underline underline-offset-2 hover:text-lime-pulse transition-colors"
                >
                  Learn more
                </Link>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="cookie-decline-btn"
                onClick={decline}
                className="px-4 h-9 rounded-full text-xs font-medium text-charcoal-body bg-warm-stone hover:bg-pebble border border-black/8 transition-all"
              >
                Decline
              </button>
              <button
                id="cookie-accept-btn"
                onClick={accept}
                className="px-4 h-9 rounded-full text-xs font-medium text-white bg-graphite-ink hover:bg-charcoal-body shadow-sm transition-all"
              >
                Accept All
              </button>
            </div>

            {/* Close */}
            <button
              id="cookie-close-btn"
              onClick={decline}
              aria-label="Close cookie banner"
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-slate-caption hover:text-charcoal-body hover:bg-pebble transition-all sm:hidden"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
