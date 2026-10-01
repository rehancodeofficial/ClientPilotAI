import React from 'react'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { BookOpen } from 'lucide-react'

export function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white">
      <PublicNavbar />

      <section className="py-16 sm:py-24 border-b border-black/10 text-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[200px] bg-[#dbdbd2] text-[#292929] text-xs font-normal">
            <span className="w-2 h-2 rounded-full bg-[#4cc02b]" />
            <span>KNOWLEDGE BASE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-normal text-[#292929] tracking-[-0.01em] font-heading max-w-4xl mx-auto">
            Resources & Guides
          </h1>
          <p className="text-base text-[#6f6f6e] max-w-2xl mx-auto font-normal">
            Learn best practices for agency prospecting, website analysis, and client acquisition.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="p-10 rounded-[12px] bg-white border border-black/10 space-y-3 flex flex-col items-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#c0c0c0] flex items-center justify-center text-[#353535] mb-1">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-normal text-[#292929] font-heading">Resources are growing.</h2>
            <p className="text-xs text-[#6f6f6e] max-w-md">
              We are actively compiling editorial guides on website intelligence, technical SEO audits, and agency qualification frameworks.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            {[
              'Agency Growth', 'Website Intelligence', 'Technical SEO', 'UX Audit Guidelines',
              'Prospecting Manuals', 'AI Outreach Workflows', 'Client Qualification', 'Product Updates'
            ].map((cat, idx) => (
              <div key={idx} className="p-3.5 rounded-[12px] bg-white border border-black/10 text-xs font-normal text-[#292929]">
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
