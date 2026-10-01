import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function PublicFooter() {
  return (
    <footer className="bg-[#edede8] border-t border-black/10 text-[#6f6f6e] pt-16 pb-12 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Top CTA Banner in Footer - Gleap Warm Stone Card (#dbdbd2) */}
        <div className="mb-16 p-8 sm:p-10 rounded-[12px] bg-[#dbdbd2] flex flex-col md:flex-row items-center justify-between gap-6 border border-black/5">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-normal text-[#292929] font-heading tracking-tight mb-2">
              Your next client may already be out there.
            </h3>
            <p className="text-sm text-[#6f6f6e]">
              Discover businesses, understand their digital gaps, and win more clients with ClientPilot AI.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Dark Pill Primary Button */}
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-[44px] rounded-[200px] text-sm font-normal text-white bg-[#141414] hover:bg-[#292929] transition-all"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {/* Stone Pill Secondary Button */}
            <Link
              to="/how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-[44px] rounded-[200px] text-sm font-normal text-[#292929] bg-[#ffffff] border border-black/10 hover:bg-[#fcfaf5] transition-all"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Main 4-column Links Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-black/10">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2 text-[#292929]">
              <div className="w-4 h-4 rounded-full bg-[#141414] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cc02b]" />
              </div>
              <span className="text-lg font-normal tracking-tight font-heading">
                ClientPilot AI
              </span>
            </Link>

            <p className="text-sm text-[#6f6f6e] max-w-sm leading-relaxed">
              AI-powered client acquisition and digital intelligence for modern software agencies.
            </p>

            <div className="pt-2 text-xs font-normal text-[#292929] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4cc02b]" />
              Giving every business a digital identity.
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium uppercase tracking-wider text-[#292929]">Product</h4>
            <ul className="space-y-2 text-sm text-[#6f6f6e]">
              <li><Link to="/product" className="hover:text-[#292929] transition-colors">Product Overview</Link></li>
              <li><Link to="/features" className="hover:text-[#292929] transition-colors">Features</Link></li>
              <li><Link to="/solutions" className="hover:text-[#292929] transition-colors">Solutions</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#292929] transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:text-[#292929] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium uppercase tracking-wider text-[#292929]">Resources</h4>
            <ul className="space-y-2 text-sm text-[#6f6f6e]">
              <li><Link to="/resources" className="hover:text-[#292929] transition-colors">Resources</Link></li>
              <li><Link to="/faq" className="hover:text-[#292929] transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-[#292929] transition-colors">Contact</Link></li>
              <li><Link to="/about" className="hover:text-[#292929] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <h4 className="text-xs font-medium uppercase tracking-wider text-[#292929]">Legal</h4>
            <ul className="space-y-2 text-sm text-[#6f6f6e]">
              <li><Link to="/privacy" className="hover:text-[#292929] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#292929] transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-[#292929] transition-colors">Cookie Policy</Link></li>
              <li><Link to="/acceptable-use" className="hover:text-[#292929] transition-colors">Acceptable Use</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8f8f8e]">
          <p>© {new Date().getFullYear()} ClientPilot AI. All rights reserved.</p>
          <p>Find better prospects. Understand their digital gaps. Win more clients.</p>
        </div>

      </div>
    </footer>
  )
}
