import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Search, Globe, Wand2, Target, Mail, Code2, ShieldCheck, Brain, ArrowRight } from 'lucide-react'

const sections = [
  {
    id: 'discovery',
    num: '01',
    title: 'Business Discovery',
    subtitle: 'Find businesses matching your target market.',
    desc: 'Scan open map databases and business directories using target keywords, locations, industries, and business models. Filter out irrelevant entities before spending energy on technical evaluation.',
    icon: Search,
    accent: '#4cc02b',
    bg: 'from-[#eaf5e7] to-[#f4f7f2]',
    tags: ['Industry filters', 'Location targeting', 'Contact enrichment', 'Maps integration'],
    img: 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'digital-intelligence',
    num: '02',
    title: 'Digital Intelligence',
    subtitle: 'Understand websites and digital presence.',
    desc: 'Deep multi-vector analysis across technical performance, mobile UX, SEO tags, accessibility compliance, conversion paths, and business capabilities. 40+ signals per site, automatically.',
    icon: Globe,
    accent: '#2f851d',
    bg: 'from-[#f0f5ed] to-[#f7faf5]',
    tags: ['Core Web Vitals', 'SEO analysis', 'Mobile audit', 'Accessibility'],
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'opportunity-intelligence',
    num: '03',
    title: 'Opportunity Intelligence',
    subtitle: 'Convert findings into agency deliverables.',
    desc: 'ClientPilot doesn\'t just show errors — it maps technical deficiencies directly to commercial agency deliverables like custom web development, booking flows, or SEO revamps.',
    icon: Wand2,
    accent: '#4cc02b',
    bg: 'from-[#eaf5e7] to-[#f4f7f2]',
    tags: ['Gap mapping', 'Service matching', 'Revenue estimate', 'Priority ranking'],
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lead-intelligence',
    num: '04',
    title: 'Lead Intelligence',
    subtitle: 'Prioritize using transparent signals.',
    desc: 'Understand exactly why a prospect scored 84/100 using clear breakdowns: severity, service fit, evidence confidence, business fit, reachability, and commercial potential.',
    icon: Target,
    accent: '#2f851d',
    bg: 'from-[#f0f5ed] to-[#f7faf5]',
    tags: ['Lead scoring', 'Budget signals', 'Decision-makers', 'Intent signals'],
    img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'outreach',
    num: '05',
    title: 'Outreach Intelligence',
    subtitle: 'Create evidence-backed personalized outreach.',
    desc: 'Generate tailored outreach drafts referencing real, verified website gaps. Every draft requires human review before dispatch, maintaining full brand authority.',
    icon: Mail,
    accent: '#4cc02b',
    bg: 'from-[#eaf5e7] to-[#f4f7f2]',
    tags: ['Evidence-based', 'Tone options', 'Follow-up sequences', 'A/B variants'],
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'developer-handoff',
    num: '06',
    title: 'Developer Handoff',
    subtitle: 'Convert opportunities into actionable requirements.',
    desc: 'Seamlessly structure won opportunities into developer-ready task briefs with problem description, evidence, affected URLs, recommended fix, and acceptance criteria.',
    icon: Code2,
    accent: '#2f851d',
    bg: 'from-[#f0f5ed] to-[#f7faf5]',
    tags: ['Technical briefs', 'Effort estimates', 'Priority ordering', 'Client-ready'],
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'qa',
    num: '07',
    title: 'QA & Verification',
    subtitle: 'Verify implemented improvements.',
    desc: 'Run post-project audits to confirm that implemented code changes resolved the original detected gap. Results categorized as Pass / Partial / Fail / Needs Review.',
    icon: ShieldCheck,
    accent: '#4cc02b',
    bg: 'from-[#eaf5e7] to-[#f4f7f2]',
    tags: ['Pass/Fail audits', 'Before/after compare', 'Client reports', 'Auto-recheck'],
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'agency-intelligence',
    num: '08',
    title: 'Agency Memory',
    subtitle: 'Learn from your agency\'s decisions.',
    desc: 'ClientPilot continuously refines lead qualification based on which recommendations your agency accepts, rejects, or closes into revenue. Gets smarter with every deal.',
    icon: Brain,
    accent: '#2f851d',
    bg: 'from-[#f0f5ed] to-[#f7faf5]',
    tags: ['Outcome learning', 'Win/loss signals', 'Preference memory', 'Smarter scoring'],
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80',
  },
]

export function ProductPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-charcoal-body font-sans selection:bg-lime-pulse selection:text-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative py-20 sm:py-28 border-b border-black/10 text-center overflow-hidden bg-[#edede8]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=80"
            alt="Product Digital Presence Workspace"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#edede8]/90 via-[#edede8]/85 to-[#edede8]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-pulse/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-lime-pulse/8 rounded-full blur-2xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-300 mx-auto px-4 sm:px-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eaf5e7] border border-lime-pulse/30 text-[#2a7a18] text-xs font-mono"
          >
            <span className="w-2 h-2 rounded-full bg-lime-pulse shadow-[0_0_8px_rgba(76,192,43,0.8)] animate-pulse" />
            <span>PRODUCT ARCHITECTURE</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-5xl sm:text-6xl lg:text-[72px] font-normal text-graphite-ink tracking-tight font-heading max-w-4xl mx-auto leading-[1.04]"
          >
            The intelligence layer behind modern agency prospecting.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-[#5c5c5b] max-w-3xl mx-auto font-normal leading-relaxed"
          >
            ClientPilot connects business discovery, digital intelligence, opportunity detection, qualification, outreach, and agency execution into one unified workspace.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="pt-2 flex justify-center gap-3"
          >
            <Link to="/signup" className="inline-flex items-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-white bg-graphite-ink hover:bg-charcoal-body transition-all shadow-sm">
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-charcoal-body bg-white border border-black/10 hover:bg-[#f4f4ef] transition-all shadow-xs">
              <span>See How It Works</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Detailed Product Sections — alternating layout with images */}
      <section className="py-10 sm:py-16">
        <div className="max-w-300 mx-auto px-4 sm:px-6 space-y-8">
          {sections.map((sec, idx) => {
            const isEven = idx % 2 === 0
            return (
              <motion.div
                key={sec.id}
                id={sec.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2 }}
                className={`relative rounded-3xl overflow-hidden border border-black/8 shadow-sm bg-linear-to-br ${sec.bg} transition-all duration-300 hover:shadow-md hover:border-black/12`}
              >
                {/* Decorative corner glow */}
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ background: sec.accent }}
                />

                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch min-h-70`}>
                  {/* Text side */}
                  <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center space-y-5 relative z-10">
                    {/* Number + icon row */}
                    <div className="flex items-center gap-3">
                      <span
                        className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border"
                        style={{ color: sec.accent, borderColor: sec.accent + '40', background: sec.accent + '12' }}
                      >
                        {sec.num}
                      </span>
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ background: sec.accent + '18', color: sec.accent }}
                      >
                        <sec.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-wider text-ash-subheading mb-1.5">{sec.subtitle}</p>
                      <h2 className="text-2xl sm:text-3xl font-normal text-graphite-ink font-heading tracking-tight leading-snug">{sec.title}</h2>
                    </div>

                    <p className="text-sm sm:text-base text-[#5c5c5b] leading-relaxed max-w-lg">{sec.desc}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {sec.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                          style={{ color: sec.accent, borderColor: sec.accent + '35', background: sec.accent + '0f' }}
                        >
                          <span className="w-1 h-1 rounded-full" style={{ background: sec.accent }} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Image side */}
                  <div className="lg:w-95 xl:w-110 shrink-0 relative overflow-hidden min-h-55 lg:min-h-0">
                    <img
                      src={sec.img}
                      alt={sec.title}
                      className="w-full h-full object-cover opacity-70"
                      style={{ minHeight: 220 }}
                    />
                    {/* Gradient fade into bg */}
                    <div
                      className={`absolute inset-0 ${
                        isEven
                          ? 'bg-linear-to-r from-transparent via-transparent to-transparent lg:bg-linear-to-l'
                          : 'bg-linear-to-l from-transparent via-transparent to-transparent lg:bg-linear-to-r'
                      }`}
                      style={{
                        background: isEven
                          ? 'linear-gradient(to left, transparent 40%, var(--from-color) 100%)'
                          : 'linear-gradient(to right, transparent 40%, var(--from-color) 100%)',
                      }}
                    />
                    {/* Bottom overlay for mobile */}
                    <div className="absolute inset-0 bg-linear-to-t from-white/30 to-transparent lg:hidden" />

                    {/* Floating stat badge */}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-black/8 rounded-xl px-3.5 py-2.5 shadow-sm">
                      <span className="text-[10px] font-mono uppercase text-ash-subheading block">Module</span>
                      <span className="text-sm font-medium text-graphite-ink">{sec.title}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-300 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-graphite-ink text-white p-10 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-lime-pulse/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime-pulse/8 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-5">
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight font-heading">Ready to see it in action?</h2>
              <p className="text-white/60 max-w-md mx-auto text-base">Start free. No credit card required.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link to="/signup" className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-graphite-ink bg-white hover:bg-[#edede8] transition-all">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/how-it-works" className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-white border border-white/20 hover:border-white/40 transition-all">
                  See How It Works
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
