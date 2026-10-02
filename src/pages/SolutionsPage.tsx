import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }
  })
}

const solutions = [
  {
    audience: 'Digital Agencies',
    headline: 'Find clients before your competitors do.',
    desc: 'Digital agencies use ClientPilot to prospect at scale — discovering businesses with outdated sites, poor mobile experiences, or missing SEO foundations, then turning those findings into pipeline.',
    bullets: [
      'Identify businesses with specific digital gaps you can fix',
      'Generate outreach emails grounded in real website findings',
      'Qualify prospects before investing sales time',
      'Turn discovery into scoped developer briefs',
    ],
    tag: 'For Digital Agencies',
    accent: false,
  },
  {
    audience: 'Web Development Studios',
    headline: 'Turn technical audits into sales conversations.',
    desc: 'Development studios use ClientPilot to identify businesses that need what they build — whether that\'s performance optimization, mobile-first rebuilds, or full-stack custom applications.',
    bullets: [
      'Surface businesses with critical performance or mobile issues',
      'Auto-generate technical briefs for scoping and proposals',
      'Find local businesses underserved by modern web development',
      'Prioritize leads by technical complexity and budget signals',
    ],
    tag: 'For Dev Studios',
    accent: true,
  },
  {
    audience: 'SEO & Marketing Agencies',
    headline: 'Prospect based on real SEO gaps, not guesses.',
    desc: 'Marketing agencies use ClientPilot to find businesses with measurable SEO deficits — missing schema, weak metadata, slow pages — and use those findings to show prospects exactly where they\'re losing.',
    bullets: [
      'Identify SEO gap patterns across target industries',
      'Generate outreach with specific findings as proof of value',
      'Benchmark prospects against industry leaders',
      'Build pipeline from businesses actively losing search visibility',
    ],
    tag: 'For SEO Agencies',
    accent: false,
  },
  {
    audience: 'Freelancers',
    headline: 'Build a steady flow of qualified projects.',
    desc: 'Freelance developers and designers use ClientPilot to fill their pipeline without cold calling — finding businesses that clearly need exactly what they offer and reaching out with personalized, evidence-backed messages.',
    bullets: [
      'Discover local businesses that need your specific skills',
      'Outreach that stands out because it references real problems',
      'Work independently on your own schedule',
      'Scale discovery as your practice grows',
    ],
    tag: 'For Freelancers',
    accent: true,
  },
  {
    audience: 'B2B Sales Teams',
    headline: 'Enrich leads with digital intelligence before the call.',
    desc: 'Sales teams at software companies and agencies use ClientPilot to enrich inbound and outbound leads with digital presence data — knowing before the call what the prospect\'s website says about their maturity and needs.',
    bullets: [
      'Digital audit every prospect before the discovery call',
      'Know their website score, tech stack signals, and digital gaps',
      'Build calls around specific, research-backed observations',
      'Shorten sales cycles with better pre-call preparation',
    ],
    tag: 'For Sales Teams',
    accent: false,
  },
]

export function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 border-b border-black/10 overflow-hidden bg-[#edede8]">
        {/* Background Image with refined gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"
            alt="Agency Solutions Workspace"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#edede8]/90 via-[#edede8]/85 to-[#edede8]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#4cc02b]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eaf5e7] border border-[#4cc02b]/30 text-[#2a7a18] text-xs font-mono mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#4cc02b] shadow-[0_0_8px_rgba(76,192,43,0.8)]" />
            <span>TAILORED SOLUTIONS</span>
          </motion.div>
          <motion.h1
            variants={fadeUp} custom={0.05}
            initial="hidden" animate="visible"
            className="text-4xl sm:text-5xl lg:text-[64px] font-normal tracking-[-0.01em] text-[#141414] font-heading leading-[1.05] max-w-3xl mb-6"
          >
            Built for agencies of every kind.
          </motion.h1>
          <motion.p
            variants={fadeUp} custom={0.15}
            initial="hidden" animate="visible"
            className="text-lg text-[#5c5c5b] max-w-xl leading-relaxed mb-8"
          >
            ClientPilot is purpose-built for agencies, studios, and freelancers who want to find better clients — not just more contacts.
          </motion.p>
          <motion.div
            variants={fadeUp} custom={0.25}
            initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-white bg-[#141414] hover:bg-[#292929] transition-all shadow-sm"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-[#292929] bg-white border border-black/10 hover:bg-[#f4f4ef] transition-all shadow-xs"
            >
              See How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 border-b border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-20">
          {solutions.map((sol, idx) => (
            <motion.div
              key={sol.audience}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              {/* Text */}
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dbdbd2] text-xs">
                  {sol.tag}
                </span>
                <h2 className="text-2xl sm:text-3xl font-normal text-[#292929] font-heading tracking-tight">
                  {sol.headline}
                </h2>
                <p className="text-base text-[#6f6f6e] leading-relaxed">{sol.desc}</p>
                <ul className="space-y-3">
                  {sol.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-[#292929]">
                      <CheckCircle2 className="w-4 h-4 text-[#4cc02b] shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-5 h-10 rounded-full text-sm text-white bg-[#141414] hover:bg-[#292929] transition-all"
                  >
                    Get started
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Visual card */}
              <div>
                <div className={`p-8 rounded-2xl border ${
                  sol.accent
                    ? 'bg-[#dbdbd2] border-black/8'
                    : 'bg-white border-black/8'
                }`}>
                  <div className="text-2xl sm:text-3xl font-normal text-[#292929] font-heading mb-2">
                    {sol.audience}
                  </div>
                  <div className="text-sm text-[#6f6f6e] mb-6">
                    ClientPilot finds the right clients for {sol.audience.toLowerCase()}.
                  </div>
                  <div className="space-y-2">
                    {sol.bullets.map((b, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-black/5 last:border-0">
                        <span className="w-5 h-5 rounded-full bg-[#4cc02b]/15 flex items-center justify-center shrink-0">
                          <span className="text-[#2a7a18] text-[10px]">✓</span>
                        </span>
                        <span className="text-xs text-[#292929]">{b}</span>
                      </div>
                    ))}
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
              Your agency deserves better prospects.
            </h2>
            <p className="text-white/60 max-w-md mx-auto text-base">
              Start discovering businesses that actually need what you build.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-[#141414] bg-white hover:bg-[#edede8] transition-all"
            >
              Start Free Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
