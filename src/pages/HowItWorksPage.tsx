import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { ArrowRight, Search, Globe, Brain, Target, Mail, Code2, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: Search,
    accent: '#4cc02b',
    title: 'Define Your Ideal Client',
    desc: 'Tell ClientPilot what a good client looks like for your agency. Set your target industry, business size, location, service needs, and any other filters that matter.',
    detail: 'ClientPilot learns from your preferences and gets smarter with every search you run. The more specific you are, the more relevant your results.',
    img: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Agency team defining target client profile',
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
    accent: '#3b82f6',
    title: 'AI Discovers Businesses',
    desc: 'Our engine searches across directories, maps, and the public web to find businesses that match your criteria — returning complete records with website, contact info, and location data.',
    detail: 'ClientPilot surfaces hundreds of matching businesses in seconds, not hours. Each result includes everything you need to begin analysis.',
    img: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'AI discovering businesses on the web',
    visual: {
      label: 'Discovery Results',
      items: [
        { key: "Mario's Pizza Co.", value: 'mario-pizza.com · Chicago' },
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
    accent: '#8b5cf6',
    title: 'Analyze Digital Presence',
    desc: 'Every discovered business gets a comprehensive website audit across performance, SEO, mobile experience, accessibility, UX quality, content, and business capability signals.',
    detail: 'A full 40+ signal analysis runs automatically for every business in your list. You get structured findings, not just scores.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Website analysis and digital intelligence dashboard',
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
    accent: '#f59e0b',
    title: 'Score & Qualify Prospects',
    desc: "AI reviews the analysis findings and scores each prospect on how well they fit your agency's services. Separate the genuinely valuable opportunities from the noise.",
    detail: "Qualification scoring factors in problem severity, your service match, budget signals, and the prospect's likely readiness to invest.",
    img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Prospect scoring and qualification system',
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
    accent: '#ef4444',
    title: 'Generate Personalized Outreach',
    desc: "Turn your findings into highly specific, evidence-backed email drafts that reference the actual problems on each prospect's website. Not templates — real context.",
    detail: 'Each draft includes specific findings, proposed solutions tied to your services, and a clear value proposition grounded in data.',
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Personalized outreach email generation',
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
    accent: '#0ea5e9',
    title: 'Hand Off to Your Team',
    desc: 'When a prospect is interested, convert the opportunity findings into a structured technical brief your development team can use to scope, estimate, and propose work.',
    detail: "No more translating discovery findings into dev-speak. ClientPilot generates developer-ready briefs with technical requirements, priority ordering, and effort estimates.",
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Developer team receiving handoff brief',
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
      <section className="relative py-20 lg:py-28 border-b border-black/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80"
            alt="Agency workspace"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#edede8]/80 via-[#edede8]/90 to-[#edede8]" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#4cc02b]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#4cc02b]/6 rounded-full blur-2xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dbdbd2] border border-black/8 text-[#5c5c5b] text-xs font-mono mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#4cc02b] shadow-[0_0_8px_rgba(76,192,43,0.8)]" />
            HOW IT WORKS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-[60px] font-normal tracking-[-0.01em] text-[#141414] font-heading leading-[1.06] max-w-3xl mb-6"
          >
            From discovery to proposal in one intelligent workflow.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-lg text-[#5c5c5b] max-w-2xl leading-relaxed mb-8"
          >
            ClientPilot replaces hours of manual research with an AI-powered workflow that surfaces the right prospects, analyzes their digital presence, and helps you win the conversation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link to="/signup" className="inline-flex items-center gap-2 px-6 h-11 rounded-full text-sm font-medium text-white bg-[#141414] hover:bg-[#292929] transition-all shadow-sm">
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/features" className="inline-flex items-center gap-2 px-6 h-11 rounded-full text-sm font-medium text-[#292929] bg-white border border-black/10 hover:bg-[#f4f4ef] transition-all">
              See All Features
            </Link>
          </motion.div>

          {/* Step count pills */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}
            className="flex flex-wrap gap-2 mt-10"
          >
            {steps.map((s) => (
              <a
                key={s.num}
                href={`#step-${s.num}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/8 text-xs text-[#5c5c5b] hover:border-black/20 hover:text-[#141414] transition-all"
              >
                <span className="font-mono text-[10px] text-[#8f8f8e]">{s.num}</span>
                {s.title}
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 sm:py-24 border-b border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0
            return (
              <motion.div
                key={step.num}
                id={`step-${step.num}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-3xl border border-black/8 overflow-hidden bg-white shadow-sm"
              >
                {/* Accent top border */}
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(to right, ${step.accent}60, ${step.accent}, ${step.accent}60)` }} />

                <div className={`grid grid-cols-1 lg:grid-cols-2 min-h-[480px] ${!isEven ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  
                  {/* ── Text panel ─────────────────────────────────── */}
                  <div className="p-8 sm:p-10 xl:p-14 flex flex-col justify-center space-y-6">
                    {/* Step number + icon */}
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-mono font-bold px-3 py-1 rounded-full border"
                        style={{ color: step.accent, borderColor: step.accent + '40', background: step.accent + '10' }}
                      >
                        STEP {step.num}
                      </span>
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: step.accent + '18', color: step.accent }}
                      >
                        <step.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-normal text-[#141414] font-heading tracking-tight mb-3 leading-snug">
                        {step.title}
                      </h2>
                      <p className="text-base text-[#5c5c5b] leading-relaxed">{step.desc}</p>
                    </div>

                    <p className="text-sm text-[#8f8f8e] leading-relaxed border-l-2 pl-4" style={{ borderColor: step.accent + '60' }}>
                      {step.detail}
                    </p>

                    {/* Mock UI panel */}
                    <div className="rounded-2xl border border-black/8 overflow-hidden bg-[#f8f8f5] shadow-sm">
                      <div className="px-4 py-2.5 border-b border-black/8 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#4cc02b]/50" />
                          </div>
                          <span className="text-xs text-[#8f8f8e] ml-1 font-mono">{step.visual.label}</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ color: step.accent, background: step.accent + '15' }}>
                          Live
                        </span>
                      </div>
                      <div className="p-3 space-y-1.5">
                        {step.visual.items.map((item, i) => (
                          <motion.div
                            key={item.key}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 + 0.3 }}
                            className="flex items-center justify-between py-2 px-3 rounded-lg bg-white border border-black/5 gap-3"
                          >
                            <span className="text-xs text-[#6f6f6e] shrink-0 font-medium">{item.key}</span>
                            <span className="text-xs font-mono text-[#141414] text-right">{item.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── Image panel ─────────────────────────────────── */}
                  <div className="relative overflow-hidden min-h-[300px] lg:min-h-0">
                    <img
                      src={step.img}
                      alt={step.imgAlt}
                      className="w-full h-full object-cover"
                      style={{ minHeight: 300 }}
                    />
                    {/* Gradient fade to text panel */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isEven
                          ? 'linear-gradient(to right, white 0%, transparent 30%)'
                          : 'linear-gradient(to left, white 0%, transparent 30%)',
                      }}
                    />
                    {/* Bottom fade for mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent lg:hidden" />

                    {/* Floating badge */}
                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm border border-black/8 rounded-2xl px-4 py-3 shadow-md">
                      <div className="text-[10px] font-mono text-[#8f8f8e] uppercase tracking-wider mb-0.5">Step</div>
                      <div className="text-lg font-mono font-bold" style={{ color: step.accent }}>{step.num}</div>
                    </div>

                    {/* Accent color strip at bottom */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ background: `linear-gradient(to right, ${step.accent}40, ${step.accent}80, ${step.accent}40)` }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Summary stats strip */}
      <section className="py-16 border-b border-black/10 bg-[#edede8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '6', label: 'Workflow steps', sub: 'end-to-end' },
              { value: '40+', label: 'Analysis signals', sub: 'per business' },
              { value: '<2 min', label: 'Discovery to insight', sub: 'automated' },
              { value: '100%', label: 'Human-reviewed', sub: 'before sending' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="p-6 rounded-2xl bg-white border border-black/8 shadow-sm text-center"
              >
                <div className="text-3xl font-normal text-[#141414] font-heading tracking-tight mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-[#292929]">{stat.label}</div>
                <div className="text-xs text-[#8f8f8e] mt-0.5">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl bg-[#141414] text-white p-10 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4cc02b]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4cc02b]/8 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-5">
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight font-heading">
                Start your first discovery in minutes.
              </h2>
              <p className="text-white/60 max-w-md mx-auto text-base">
                Free to start. No credit card required. See results before you commit to a plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link to="/signup" className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-[#141414] bg-white hover:bg-[#edede8] transition-all">
                  Start Free Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/pricing" className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-white border border-white/20 hover:border-white/40 transition-all">
                  View Pricing
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
