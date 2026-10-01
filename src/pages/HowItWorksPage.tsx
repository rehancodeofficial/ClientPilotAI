import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { ArrowRight, Search, Globe, Brain, Target, Mail, Code2 } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }
  })
}

const steps = [
  {
    num: '01',
    icon: Search,
    title: 'Define Your Ideal Client',
    desc: 'Tell ClientPilot what a good client looks like for your agency. Set your target industry, business size, location, service needs, and any other filters that matter.',
    detail: 'ClientPilot learns from your preferences and gets smarter with every search you run. The more specific you are, the more relevant your results.',
    visual: {
      label: 'Client Profile Setup',
      items: [
        { key: 'Industry', value: 'Restaurants & Hospitality' },
        { key: 'Location', value: 'Chicago, IL + 50mi radius' },
        { key: 'Team size', value: '10–100 employees' },
        { key: 'Service need', value: 'Website + SEO' },
        { key: 'Budget signal', value: 'Established business' },
      ]
    }
  },
  {
    num: '02',
    icon: Globe,
    title: 'AI Discovers Businesses',
    desc: 'Our engine searches across directories, maps, and the public web to find businesses that match your criteria — returning complete records with website, contact info, and location data.',
    detail: 'ClientPilot surfaces hundreds of matching businesses in seconds, not hours. Each result includes everything you need to begin analysis.',
    visual: {
      label: 'Discovery Results',
      items: [
        { key: 'Mario\'s Pizza Co.', value: 'mario-pizza.com · Chicago' },
        { key: 'Lakeside Grill', value: 'lakesidegrill.net · Evanston' },
        { key: 'The Patio Kitchen', value: 'thepatiokitchen.com · Oak Park' },
        { key: 'Golden Dragon', value: 'goldendragonchi.com · Chinatown' },
        { key: 'Farm Table Bistro', value: 'farmtablebistro.com · Lincoln Park' },
      ]
    }
  },
  {
    num: '03',
    icon: Brain,
    title: 'Analyze Digital Presence',
    desc: 'Every discovered business gets a comprehensive website audit across performance, SEO, mobile experience, accessibility, UX quality, content, and business capability signals.',
    detail: 'A full 40+ signal analysis runs automatically for every business in your list. You get structured findings, not just scores.',
    visual: {
      label: 'Website Analysis',
      items: [
        { key: 'Performance', value: '28/100 · Critical' },
        { key: 'SEO', value: '41/100 · High priority' },
        { key: 'Mobile', value: '35/100 · Critical' },
        { key: 'Accessibility', value: '52/100 · Moderate' },
        { key: 'Content quality', value: '60/100 · Good' },
      ]
    }
  },
  {
    num: '04',
    icon: Target,
    title: 'Score & Qualify Prospects',
    desc: 'AI reviews the analysis findings and scores each prospect on how well they fit your agency\'s services. Separate the genuinely valuable opportunities from the noise.',
    detail: 'Qualification scoring factors in problem severity, your service match, budget signals, and the prospect\'s likely readiness to invest.',
    visual: {
      label: 'Qualification Score',
      items: [
        { key: 'Opportunity score', value: '87/100 · Hot lead' },
        { key: 'Service match', value: 'Web + SEO + Mobile' },
        { key: 'Budget signal', value: 'Established · Multi-location' },
        { key: 'Problem severity', value: 'Critical on 3 of 5 signals' },
        { key: 'Recommended action', value: 'Prioritize outreach' },
      ]
    }
  },
  {
    num: '05',
    icon: Mail,
    title: 'Generate Personalized Outreach',
    desc: 'Turn your findings into highly specific, evidence-backed email drafts that reference the actual problems on each prospect\'s website. Not templates — real context.',
    detail: 'Each draft includes specific findings, proposed solutions tied to your services, and a clear value proposition grounded in data.',
    visual: {
      label: 'Outreach Draft',
      items: [
        { key: 'Subject', value: 'Quick note on your mobile site speed' },
        { key: 'Opening', value: 'Found your site via Google Maps...' },
        { key: 'Finding 1', value: 'Mobile load time: 8.4s (avg: 2.1s)' },
        { key: 'Finding 2', value: 'No schema markup for restaurant' },
        { key: 'CTA', value: 'Free 15-min website review call' },
      ]
    }
  },
  {
    num: '06',
    icon: Code2,
    title: 'Hand Off to Your Team',
    desc: 'When a prospect is interested, convert the opportunity findings into a structured technical brief your development team can use to scope, estimate, and propose work.',
    detail: 'No more translating discovery findings into dev-speak. ClientPilot generates developer-ready briefs with technical requirements, priority ordering, and effort estimates.',
    visual: {
      label: 'Developer Brief',
      items: [
        { key: 'Project type', value: 'Website rebuild + SEO foundation' },
        { key: 'Priority 1', value: 'Mobile-first responsive layout' },
        { key: 'Priority 2', value: 'Core Web Vitals optimization' },
        { key: 'Priority 3', value: 'Schema markup + local SEO' },
        { key: 'Est. scope', value: '6–8 weeks · $12,000–$18,000' },
      ]
    }
  },
]

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero */}
      <section className="py-20 lg:py-28 bg-[#edede8] border-b border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dbdbd2] text-xs mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#4cc02b]" />
            How It Works
          </motion.div>
          <motion.h1
            variants={fadeUp} custom={0.05}
            initial="hidden" animate="visible"
            className="text-4xl sm:text-5xl lg:text-[64px] font-normal tracking-[-0.01em] text-[#292929] font-heading leading-[1.05] max-w-3xl mb-6"
          >
            From discovery to proposal in one intelligent workflow.
          </motion.h1>
          <motion.p
            variants={fadeUp} custom={0.15}
            initial="hidden" animate="visible"
            className="text-lg text-[#6f6f6e] max-w-2xl leading-relaxed mb-8"
          >
            ClientPilot replaces hours of manual research with an AI-powered workflow that surfaces the right prospects, analyzes their digital presence, and helps you win the conversation.
          </motion.p>
          <motion.div
            variants={fadeUp} custom={0.25}
            initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 h-11 rounded-full text-sm text-white bg-[#141414] hover:bg-[#292929] transition-all"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-6 h-11 rounded-full text-sm text-[#292929] bg-[#dbdbd2] hover:bg-[#d0d0c8] transition-all"
            >
              See All Features
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 border-b border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-24">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              {/* Text */}
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-black/10 flex items-center justify-center font-mono text-sm text-[#6f6f6e]">
                    {step.num}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#c0c0c0] flex items-center justify-center text-[#353535]">
                    <step.icon className="w-4 h-4" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-normal text-[#292929] font-heading tracking-tight">
                  {step.title}
                </h2>
                <p className="text-base text-[#6f6f6e] leading-relaxed">{step.desc}</p>
                <p className="text-sm text-[#8f8f8e] leading-relaxed border-l-2 border-black/10 pl-4">
                  {step.detail}
                </p>
              </div>

              {/* Visual mock */}
              <div className="lg:col-span-7">
                <div className="p-3 bg-white rounded-lg border border-black/10 shadow-xl">
                  <div className="bg-[#edede8] rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-black/8 flex items-center gap-2 bg-white">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#4cc02b]/40" />
                      </div>
                      <span className="text-xs text-[#8f8f8e] ml-2 font-mono">{step.visual.label}</span>
                    </div>
                    <div className="p-4 space-y-2">
                      {step.visual.items.map((item, i) => (
                        <motion.div
                          key={item.key}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.07 + 0.2 }}
                          className="flex items-center justify-between py-2 px-3 rounded-lg bg-white border border-black/5"
                        >
                          <span className="text-xs text-[#6f6f6e]">{item.key}</span>
                          <span className="text-xs font-medium text-[#292929] text-right max-w-[55%] truncate">{item.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#edede8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-10 sm:p-16 rounded-2xl bg-[#141414] text-white text-center space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight font-heading">
              Start your first discovery in minutes.
            </h2>
            <p className="text-white/60 max-w-lg mx-auto text-base">
              Free to start. No credit card required. See results before you commit to a plan.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-[#141414] bg-white hover:bg-[#edede8] transition-all"
            >
              Start Free Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
