import React from 'react'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white">
      <PublicNavbar />
      <section className="py-16 sm:py-24">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 space-y-6 text-left">
          <h1 className="text-4xl font-normal text-[#292929] font-heading">Privacy Policy</h1>
          <p className="text-xs text-[#8f8f8e]">Last updated: October 1, 2026</p>

          <div className="space-y-4 text-sm text-[#6f6f6e] leading-relaxed p-8 rounded-[12px] bg-white border border-black/10">
            <h2 className="text-lg font-normal text-[#292929] font-heading">1. Data Collected</h2>
            <p>ClientPilot AI collects account data (email, name, agency credentials), workspace metadata, business/lead research inputs, website analysis cache, and cookies necessary for service functionality.</p>

            <h2 className="text-lg font-normal text-[#292929] font-heading">2. AI Processing</h2>
            <p>Data submitted for website analysis and opportunity scoring is processed securely using AI logic providers. We do not sell user lead databases or agency workspace telemetry to third parties.</p>

            <h2 className="text-lg font-normal text-[#292929] font-heading">3. Data Retention & User Rights</h2>
            <p>Users have full rights to request data export or account deletion. Workspace data is retained as long as your account remains active.</p>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white">
      <PublicNavbar />
      <section className="py-16 sm:py-24">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 space-y-6 text-left">
          <h1 className="text-4xl font-normal text-[#292929] font-heading">Terms of Service</h1>
          <p className="text-xs text-[#8f8f8e]">Last updated: October 1, 2026</p>

          <div className="space-y-4 text-sm text-[#6f6f6e] leading-relaxed p-8 rounded-[12px] bg-white border border-black/10">
            <h2 className="text-lg font-normal text-[#292929] font-heading">1. Account Responsibilities</h2>
            <p>You are responsible for maintaining the security of your account credentials and for all activities conducted within your workspace.</p>

            <h2 className="text-lg font-normal text-[#292929] font-heading">2. Acceptable Use</h2>
            <p>ClientPilot AI must be used responsibly for legitimate business discovery, website intelligence, and authorized outreach. Spamming or abusive crawling is strictly prohibited.</p>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}

export function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white">
      <PublicNavbar />
      <section className="py-16 sm:py-24">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 space-y-6 text-left">
          <h1 className="text-4xl font-normal text-[#292929] font-heading">Cookie Policy</h1>
          <div className="space-y-3 text-sm text-[#6f6f6e] leading-relaxed p-8 rounded-[12px] bg-white border border-black/10">
            <p>We use essential authentication cookies to manage your login sessions and preference cookies to preserve UI settings.</p>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}

export function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white">
      <PublicNavbar />
      <section className="py-16 sm:py-24">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 space-y-6 text-left">
          <h1 className="text-4xl font-normal text-[#292929] font-heading">Acceptable Use Policy</h1>
          <div className="space-y-3 text-sm text-[#6f6f6e] leading-relaxed p-8 rounded-[12px] bg-white border border-black/10">
            <p>Prohibits spamming, unauthorized automated scraping outside ClientPilot parameters, credential theft, or malicious site disruption.</p>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}
