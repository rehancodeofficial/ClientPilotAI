import React, { useState } from 'react'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { ChevronDown } from 'lucide-react'

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'What is ClientPilot?',
      a: 'ClientPilot is an AI-powered client acquisition and digital intelligence platform for modern agencies.'
    },
    {
      q: 'Who is ClientPilot for?',
      a: 'Software agencies, web agencies, SEO agencies, design agencies, digital agencies, and freelancers.'
    },
    {
      q: 'Does ClientPilot modify websites automatically?',
      a: 'No. ClientPilot identifies opportunities, provides recommendations, creates structured handoffs, and can verify implemented changes. Human developers remain responsible for implementation.'
    },
    {
      q: 'Does ClientPilot replace agency sales teams?',
      a: 'No. It supports research, qualification, opportunity identification, and outreach workflows.'
    },
    {
      q: 'Are AI recommendations always correct?',
      a: 'No. ClientPilot should provide evidence and confidence levels, and users should review important recommendations.'
    },
    {
      q: 'Can I import my own leads?',
      a: 'Yes, the product architecture supports bringing existing business/lead data into the analysis workflow.'
    },
    {
      q: 'Can ClientPilot analyze any website?',
      a: 'The system clearly communicates supported URLs, access limitations, crawl failures, and cases where available evidence is insufficient.'
    },
    {
      q: 'Does ClientPilot use external data providers?',
      a: 'The architecture can use external providers where useful, while keeping provider integrations replaceable.'
    },
    {
      q: 'Can I use ClientPilot with my team?',
      a: 'Yes, team roles and workspace permissions are supported.'
    },
    {
      q: 'Is there a free plan?',
      a: 'Yes, the initial pricing model includes a Free plan with limited usage.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white">
      <PublicNavbar />

      <section className="py-16 sm:py-24 border-b border-black/10 text-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[200px] bg-[#dbdbd2] text-[#292929] text-xs font-normal">
            <span className="w-2 h-2 rounded-full bg-[#4cc02b]" />
            <span>HELP & FAQ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-normal text-[#292929] tracking-[-0.01em] font-heading max-w-4xl mx-auto">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-[#6f6f6e] max-w-2xl mx-auto">
            Everything you need to know about ClientPilot and how it works.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-[12px] bg-white border border-black/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-normal text-base text-[#292929] hover:text-black transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#6f6f6e] transition-transform ${isOpen ? 'rotate-180 text-black' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[#6f6f6e] leading-relaxed border-t border-black/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
