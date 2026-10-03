import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function PublicFooter() {
  return (
    <footer className="bg-linen-canvas border-t border-black/10 text-slate-caption pt-16 pb-12 font-sans">
      <div className="max-w-300 mx-auto px-4 sm:px-6">
        
        {/* Top CTA Banner in Footer - Gleap Warm Stone Card (#dbdbd2) */}
        <div className="mb-16 p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl bg-warm-stone flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 border border-black/8 shadow-sm">
          <div className="max-w-xl text-center md:text-left space-y-2">
            <h3 className="text-2xl sm:text-3xl font-normal text-charcoal-body font-heading tracking-tight leading-tight">
              Your next client may already be out there.
            </h3>
            <p className="text-sm text-slate-caption leading-relaxed">
              Discover businesses, understand their digital gaps, and win more clients with ClientPilot AI.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            {/* Dark Pill Primary Button */}
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-white bg-graphite-ink hover:bg-charcoal-body transition-all shadow-xs"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {/* Stone Pill Secondary Button */}
            <Link
              to="/how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-charcoal-body bg-frosted-white border border-black/10 hover:bg-[#fcfaf5] transition-all shadow-xs"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Main 4-column Links Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-black/10">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 text-charcoal-body group">
              <img
                src="/logo.png"
                alt="ClientPilot AI Logo"
                className="w-7 h-7 rounded-lg object-cover border border-black/10 shadow-xs"
              />
              <span className="text-lg font-semibold tracking-tight font-heading text-graphite-ink">
                ClientPilot AI
              </span>
            </Link>

            <p className="text-sm text-slate-caption max-w-sm leading-relaxed">
              AI-powered client acquisition and digital intelligence for modern software agencies.
            </p>

            <div className="pt-2 text-xs font-normal text-charcoal-body flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-pulse" />
              Giving every business a digital identity.
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium uppercase tracking-wider text-charcoal-body">Product</h4>
            <ul className="space-y-2 text-sm text-slate-caption">
              <li><Link to="/product" className="hover:text-charcoal-body transition-colors">Product Overview</Link></li>
              <li><Link to="/features" className="hover:text-charcoal-body transition-colors">Features</Link></li>
              <li><Link to="/solutions" className="hover:text-charcoal-body transition-colors">Solutions</Link></li>
              <li><Link to="/how-it-works" className="hover:text-charcoal-body transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:text-charcoal-body transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium uppercase tracking-wider text-charcoal-body">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-caption">
              <li><Link to="/resources" className="hover:text-charcoal-body transition-colors">Resources</Link></li>
              <li><Link to="/faq" className="hover:text-charcoal-body transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-charcoal-body transition-colors">Contact</Link></li>
              <li><Link to="/about" className="hover:text-charcoal-body transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <h4 className="text-xs font-medium uppercase tracking-wider text-charcoal-body">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-caption">
              <li><Link to="/privacy" className="hover:text-charcoal-body transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-charcoal-body transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-charcoal-body transition-colors">Cookie Policy</Link></li>
              <li><Link to="/acceptable-use" className="hover:text-charcoal-body transition-colors">Acceptable Use</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ash-subheading">
          <p>© {new Date().getFullYear()} ClientPilot AI. All rights reserved.</p>
          <p>Find better prospects. Understand their digital gaps. Win more clients.</p>
        </div>

      </div>
    </footer>
  )
}
