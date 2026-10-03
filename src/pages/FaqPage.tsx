import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { ChevronDown, HelpCircle, Wand2, MessageCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = ['All', 'Product & AI', 'Audits & Crawling', 'Data & Privacy', 'Pricing & Teams']

  const faqs = [
    {
      cat: 'Product & AI',
      q: 'What is ClientPilot AI?',
      a: 'ClientPilot is an AI-powered client acquisition and digital intelligence platform designed specifically for software, web, SEO, and creative agencies.'
    },
    {
      cat: 'Product & AI',
      q: 'Who is ClientPilot for?',
      a: 'Software agencies, web design studios, SEO firms, digital agencies, and independent technical freelancers looking for high-probability commercial client opportunities.'
    },
    {
      cat: 'Audits & Crawling',
      q: 'Does ClientPilot modify client websites automatically?',
      a: 'No. ClientPilot identifies opportunities, highlights digital deficiencies, and creates developer-ready specifications. Human engineers and agency teams remain responsible for actual code implementations.'
    },
    {
      cat: 'Product & AI',
      q: 'Does ClientPilot replace agency sales teams?',
      a: 'No. It acts as an intelligence copilot — automating research, auditing, and outreach drafting so agency sales professionals can focus on closing conversations.'
    },
    {
      cat: 'Audits & Crawling',
      q: 'Are AI audit recommendations always verifiable?',
      a: 'Yes. Every finding in ClientPilot includes raw technical evidence, severity ratings, and confidence levels so your team can verify before reaching out.'
    },
    {
      cat: 'Audits & Crawling',
      q: 'Can I import my own prospect lists and domains?',
      a: 'Yes, ClientPilot supports uploading CSV lead lists, domain batches, or Google Maps locations directly into the intelligence pipeline.'
    },
    {
      cat: 'Data & Privacy',
      q: 'Is ClientPilot compliant with privacy regulations (GDPR/CCPA)?',
      a: 'Yes. ClientPilot analyzes strictly public internet data and metadata. We do not scrape private databases or sell agency workspace telemetry.'
    },
    {
      cat: 'Pricing & Teams',
      q: 'Can I use ClientPilot with my entire agency team?',
      a: 'Yes. Team plans include multi-seat workspaces, role permissions (Admin, Member, Viewer), and unified client pipelines.'
    },
    {
      cat: 'Pricing & Teams',
      q: 'Is there a free trial on paid tiers?',
      a: 'Yes, all paid plans include a 14-day free trial with full feature access and no credit card required to start.'
    }
  ]

  const filteredFaqs = activeCategory === 'All' ? faqs : faqs.filter(f => f.cat === activeCategory)

  return (
    <div className="min-h-screen bg-[#edede8] text-charcoal-body font-sans selection:bg-lime-pulse selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero Section with Ambient Glow & Workspace Photo Overlay */}
      <section className="relative py-20 sm:py-28 border-b border-black/10 overflow-hidden bg-[#edede8]">
        {/* Background Image with refined gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
            alt="Agency Support"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#edede8]/90 via-[#edede8]/85 to-[#edede8]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-pulse/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-300 mx-auto px-4 sm:px-6 text-center space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-normal text-graphite-ink tracking-tight font-heading max-w-3xl mx-auto leading-[1.04]">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-[#5c5c5b] max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about ClientPilot AI, our audit methodology, integrations, and pricing.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-graphite-ink text-white shadow-xs ring-2 ring-lime-pulse/40'
                    : 'bg-white/80 border border-black/8 text-[#4a4a49] hover:bg-white hover:text-graphite-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="py-16 sm:py-20 bg-[#edede8]">
        <div className="max-w-215 mx-auto px-4 sm:px-6 space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-lime-pulse/40 shadow-[0_4px_20px_rgba(76,192,43,0.08)]'
                    : 'bg-white border-black/8 shadow-xs hover:border-black/15'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-medium text-base text-graphite-ink hover:text-lime-pulse transition-colors cursor-pointer"
                >
                  <span className="font-heading text-[16px] sm:text-[17px] flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-pulse" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-ash-subheading shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-lime-pulse' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 sm:px-6 pb-6 text-sm text-[#5c5c5b] leading-relaxed border-t border-black/5 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

          {/* Quick Help Box */}
          <div className="mt-12 p-8 rounded-2xl bg-[#eaf5e7] border border-lime-pulse/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#2e7d1b] font-semibold">
                <MessageCircle className="w-4 h-4" />
                <span>Still have questions?</span>
              </div>
              <h3 className="text-lg font-normal text-graphite-ink font-heading">
                Can't find the answer you're looking for?
              </h3>
              <p className="text-xs text-[#5c5c5b]">
                Our solutions engineering team is always available to walk you through a live demonstration.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 h-11 rounded-full text-xs font-medium text-white bg-graphite-ink hover:bg-charcoal-body transition-all shrink-0 shadow-sm"
            >
              <span>Talk to Our Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
