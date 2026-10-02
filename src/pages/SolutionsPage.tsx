import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { ArrowRight, CheckCircle2, Globe, Code2, BarChart2, Layers, Users2 } from 'lucide-react'

const solutions = [
  {
    num: '01',
    icon: Globe,
    audience: 'Digital Agencies',
    tag: 'For Digital Agencies',
    headline: 'Find clients before your competitors do.',
    desc: 'Digital agencies use ClientPilot to prospect at scale — discovering businesses with outdated sites, poor mobile experiences, or missing SEO foundations, then turning those findings into pipeline.',
    bullets: [
      'Identify businesses with specific digital gaps you can fix',
      'Generate outreach emails grounded in real website findings',
      'Qualify prospects before investing sales time',
      'Turn discovery into scoped developer briefs',
    ],
    accent: '#4cc02b',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Digital agency team working on client projects',
    stat: { value: '3×', label: 'faster pipeline building' },
  },
  {
    num: '02',
    icon: Code2,
    audience: 'Web Development Studios',
    tag: 'For Dev Studios',
    headline: 'Turn technical audits into sales conversations.',
    desc: "Development studios use ClientPilot to identify businesses that need what they build — whether that's performance optimization, mobile-first rebuilds, or full-stack custom applications.",
    bullets: [
      'Surface businesses with critical performance or mobile issues',
      'Auto-generate technical briefs for scoping and proposals',
      'Find local businesses underserved by modern web development',
      'Prioritize leads by technical complexity and budget signals',
    ],
    accent: '#3b82f6',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Developer studio team reviewing code and technical briefs',
    stat: { value: '40+', label: 'signals analyzed per site' },
  },
  {
    num: '03',
    icon: BarChart2,
    audience: 'SEO & Marketing Agencies',
    tag: 'For SEO Agencies',
    headline: 'Prospect based on real SEO gaps, not guesses.',
    desc: "Marketing agencies use ClientPilot to find businesses with measurable SEO deficits — missing schema, weak metadata, slow pages — and use those findings to show prospects exactly where they're losing.",
    bullets: [
      'Identify SEO gap patterns across target industries',
      'Generate outreach with specific findings as proof of value',
      'Benchmark prospects against industry leaders',
      'Build pipeline from businesses actively losing search visibility',
    ],
    accent: '#f59e0b',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'SEO and marketing analytics dashboard',
    stat: { value: '87%', label: 'prospect email open rate' },
  },
  {
    num: '04',
    icon: Layers,
    audience: 'Freelancers',
    tag: 'For Freelancers',
    headline: 'Build a steady flow of qualified projects.',
    desc: 'Freelance developers and designers use ClientPilot to fill their pipeline without cold calling — finding businesses that clearly need exactly what they offer and reaching out with personalized, evidence-backed messages.',
    bullets: [
      'Discover local businesses that need your specific skills',
      'Outreach that stands out because it references real problems',
      'Work independently on your own schedule',
      'Scale discovery as your practice grows',
    ],
    accent: '#8b5cf6',
    img: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Freelance developer working independently',
    stat: { value: '100%', label: 'evidence-backed outreach' },
  },
  {
    num: '05',
    icon: Users2,
    audience: 'B2B Sales Teams',
    tag: 'For Sales Teams',
    headline: 'Enrich leads with digital intelligence before the call.',
    desc: "Sales teams at software companies and agencies use ClientPilot to enrich inbound and outbound leads with digital presence data — knowing before the call what the prospect's website says about their maturity and needs.",
    bullets: [
      'Digital audit every prospect before the discovery call',
      'Know their website score, tech stack signals, and digital gaps',
      'Build calls around specific, research-backed observations',
      'Shorten sales cycles with better pre-call preparation',
    ],
    accent: '#ef4444',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Sales team reviewing prospect research before a call',
    stat: { value: '2×', label: 'shorter sales cycles' },
  },
]

export function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 border-b border-black/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=80"
            alt="Agency team collaboration"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#edede8]/85 via-[#edede8]/90 to-[#edede8]" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-[#4cc02b]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dbdbd2] border border-black/8 text-[#5c5c5b] text-xs font-mono mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#4cc02b] shadow-[0_0_8px_rgba(76,192,43,0.8)]" />
            TAILORED SOLUTIONS
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-[60px] font-normal tracking-[-0.01em] text-[#141414] font-heading leading-[1.06] max-w-3xl mb-6"
          >
            Built for agencies of every kind.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-lg text-[#5c5c5b] max-w-xl leading-relaxed mb-8"
          >
            ClientPilot is purpose-built for agencies, studios, and freelancers who want to find better clients — not just more contacts.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link to="/signup" className="inline-flex items-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-white bg-[#141414] hover:bg-[#292929] transition-all shadow-sm">
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-[#292929] bg-white border border-black/10 hover:bg-[#f4f4ef] transition-all">
              See How It Works
            </Link>
          </motion.div>

          {/* Audience quick-nav */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mt-10"
          >
            {solutions.map((s) => (
              <a
                key={s.num}
                href={`#sol-${s.num}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/8 text-xs text-[#5c5c5b] hover:border-black/20 hover:text-[#141414] transition-all"
              >
                <span className="font-mono text-[10px] text-[#8f8f8e]">{s.num}</span>
                {s.audience}
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 sm:py-24 border-b border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">
          {solutions.map((sol, idx) => {
            const isEven = idx % 2 === 0
            return (
              <motion.div
                key={sol.num}
                id={`sol-${sol.num}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-3xl border border-black/8 overflow-hidden bg-white shadow-sm"
              >
                {/* Accent top strip */}
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(to right, ${sol.accent}50, ${sol.accent}, ${sol.accent}50)` }} />

                <div className={`grid grid-cols-1 lg:grid-cols-2 min-h-[460px] ${!isEven ? 'lg:[&>*:first-child]:order-2' : ''}`}>

                  {/* ── Text panel ─────────────────────────────────── */}
                  <div className="p-8 sm:p-10 xl:p-14 flex flex-col justify-center space-y-6">
                    {/* Tag + icon */}
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                        style={{ color: sol.accent, borderColor: sol.accent + '40', background: sol.accent + '10' }}
                      >
                        <sol.icon className="w-3 h-3" />
                        {sol.tag}
                      </span>
                      <span className="text-[11px] font-mono text-[#8f8f8e]">{sol.num} / {solutions.length.toString().padStart(2, '0')}</span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-normal text-[#141414] font-heading tracking-tight mb-3 leading-snug">
                        {sol.headline}
                      </h2>
                      <p className="text-base text-[#5c5c5b] leading-relaxed">{sol.desc}</p>
                    </div>

                    <ul className="space-y-3">
                      {sol.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-sm text-[#292929]">
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: sol.accent }} />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-4 pt-2">
                      <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 px-6 h-10 rounded-full text-sm font-medium text-white transition-all shadow-sm"
                        style={{ background: '#141414' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#292929')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#141414')}
                      >
                        Get started <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {/* Stat pill */}
                      <div className="px-3.5 py-2 rounded-xl border text-center" style={{ borderColor: sol.accent + '30', background: sol.accent + '08' }}>
                        <div className="text-lg font-normal font-heading tracking-tight" style={{ color: sol.accent }}>{sol.stat.value}</div>
                        <div className="text-[10px] font-mono text-[#8f8f8e] leading-tight">{sol.stat.label}</div>
                      </div>
                    </div>
                  </div>

                  {/* ── Image panel ─────────────────────────────────── */}
                  <div className="relative overflow-hidden min-h-[300px] lg:min-h-0">
                    <img
                      src={sol.img}
                      alt={sol.imgAlt}
                      className="w-full h-full object-cover"
                      style={{ minHeight: 300 }}
                    />
                    {/* Gradient fade to text panel */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isEven
                          ? 'linear-gradient(to right, white 0%, transparent 25%)'
                          : 'linear-gradient(to left, white 0%, transparent 25%)',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent lg:hidden" />

                    {/* Floating audience badge */}
                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm border border-black/8 rounded-2xl px-4 py-3 shadow-md max-w-[160px]">
                      <div className="text-[10px] font-mono text-[#8f8f8e] uppercase tracking-wider mb-0.5">Solution for</div>
                      <div className="text-sm font-medium text-[#141414] leading-tight">{sol.audience}</div>
                    </div>

                    {/* Bottom accent */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ background: `linear-gradient(to right, ${sol.accent}40, ${sol.accent}80, ${sol.accent}40)` }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Comparison strip */}
      <section className="py-16 border-b border-black/10 bg-[#edede8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-normal text-[#141414] font-heading mb-3">What every team gets</h2>
            <p className="text-[#5c5c5b] max-w-xl mx-auto text-sm leading-relaxed">
              Regardless of your agency type, ClientPilot gives you the same core intelligence infrastructure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Business Discovery Engine', desc: 'Find matching businesses across directories, maps, and the public web.' },
              { title: 'Website Intelligence Analysis', desc: 'Deep audit of 40+ signals per business — performance, SEO, mobile, and more.' },
              { title: 'AI Opportunity Detection', desc: 'Automatically surfaces the gaps your agency can fix and bill for.' },
              { title: 'Smart Lead Qualification', desc: 'Score and rank prospects before investing any sales time.' },
              { title: 'Personalized Outreach Generator', desc: 'Evidence-backed drafts that reference actual website findings.' },
              { title: 'Developer Brief Generator', desc: 'Turn won opportunities into structured technical handoffs.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="p-6 rounded-2xl bg-white border border-black/8 shadow-sm hover:shadow-md hover:border-black/12 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#eaf5e7] flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#4cc02b]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#141414] font-heading mb-1">{item.title}</h3>
                    <p className="text-xs text-[#6f6f6e] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
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
            className="relative rounded-3xl bg-[#141414] text-white p-10 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4cc02b]/12 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#4cc02b]/8 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-5">
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight font-heading">Your agency deserves better prospects.</h2>
              <p className="text-white/60 max-w-md mx-auto text-base">Start discovering businesses that actually need what you build.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link to="/signup" className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-[#141414] bg-white hover:bg-[#edede8] transition-all">
                  Start Free Today <ArrowRight className="w-4 h-4" />
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
