import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import {
  Search, Globe, Brain, Target, Mail, Code2,
  ArrowRight, Check, Zap, Shield, Users, BarChart2,
  MessageSquare, TrendingUp, Layers, Filter
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any, delay }
  })
}

const accents = [
  '#4cc02b', '#2f851d', '#4cc02b', '#2f851d', '#4cc02b', '#2f851d',
  '#4cc02b', '#2f851d', '#4cc02b', '#2f851d', '#4cc02b', '#2f851d', '#4cc02b', '#2f851d'
]

const features = [
  {
    category: 'Discovery',
    icon: Search,
    title: 'Business Discovery Engine',
    desc: 'Find businesses by type, location, size, and industry. ClientPilot searches across directories, maps, and open web data to surface businesses that match your ideal client profile.',
    bullets: ['Industry & location filters', 'Company size targeting', 'Contact info enrichment', 'Google Maps integration'],
    accent: false
  },
  {
    category: 'Intelligence',
    icon: Globe,
    title: 'Website Intelligence Analysis',
    desc: 'Deep-analyze any website across 40+ signals covering performance, SEO, mobile experience, accessibility, UX quality, content strategy, and business capability indicators.',
    bullets: ['Core Web Vitals audit', 'SEO & meta analysis', 'Mobile responsiveness', 'Accessibility scoring'],
    accent: true
  },
  {
    category: 'AI Analysis',
    icon: Brain,
    title: 'AI Opportunity Detection',
    desc: 'Our AI engine reads the analysis and identifies specific digital gaps — the kinds of problems your agency can actually solve and turn into billable work.',
    bullets: ['Gap identification', 'Severity ranking', 'Service matching', 'Opportunity scoring'],
    accent: false
  },
  {
    category: 'Qualification',
    icon: Target,
    title: 'Smart Prospect Qualification',
    desc: 'Score and rank prospects using AI-generated qualification signals. Know which leads are worth your time before you pick up the phone.',
    bullets: ['Lead scoring model', 'Budget signal detection', 'Decision-maker identification', 'Buying intent signals'],
    accent: true
  },
  {
    category: 'Outreach',
    icon: Mail,
    title: 'Personalized Outreach Generator',
    desc: 'Turn your findings into highly specific, evidence-backed outreach emails that reference the actual problems found on each prospect\'s site.',
    bullets: ['Evidence-based messaging', 'Multiple tone options', 'Follow-up sequences', 'A/B variant generation'],
    accent: false
  },
  {
    category: 'Handoff',
    icon: Code2,
    title: 'Developer Brief Generator',
    desc: 'Convert opportunity findings into structured technical briefs your development team can use to scope, estimate, and propose work.',
    bullets: ['Technical requirements', 'Effort estimates', 'Priority ordering', 'Client-ready format'],
    accent: true
  },
  {
    category: 'Pipeline',
    icon: Layers,
    title: 'Prospect Pipeline Management',
    desc: 'Track all your discovered prospects, outreach status, and deal stages in one organized view your whole team can use.',
    bullets: ['Kanban pipeline view', 'Status tracking', 'Team notes', 'Activity history'],
    accent: false
  },
  {
    category: 'Analytics',
    icon: BarChart2,
    title: 'Market Intelligence Dashboard',
    desc: 'See aggregate patterns across your target market — which industries have the most digital gaps, which locations are underserved, and where your agency\'s services are most needed.',
    bullets: ['Market trend view', 'Gap heatmaps', 'Industry benchmarks', 'Opportunity density maps'],
    accent: true
  },
  {
    category: 'Collaboration',
    icon: Users,
    title: 'Team Workspaces',
    desc: 'Collaborate across your agency with shared workspaces, prospect assignments, and status visibility.',
    bullets: ['Multi-user workspaces', 'Role-based access', 'Shared prospect lists', 'Team notes & comments'],
    accent: false
  },
  {
    category: 'Speed',
    icon: Zap,
    title: 'Batch Analysis at Scale',
    desc: 'Analyze hundreds of businesses in hours. Run bulk discovery jobs and get back comprehensive reports for your entire target list.',
    bullets: ['Batch discovery mode', 'Scheduled scans', 'Export to CSV/JSON', 'API access (Pro+)'],
    accent: true
  },
  {
    category: 'Automation',
    icon: Filter,
    title: 'Smart Filtering & Automation',
    desc: 'Set up saved searches, automated alerts for new opportunities, and rule-based lead routing so the most valuable prospects always reach the right person.',
    bullets: ['Saved search templates', 'Email alerts', 'Lead routing rules', 'Webhook triggers'],
    accent: false
  },
  {
    category: 'Messaging',
    icon: MessageSquare,
    title: 'Conversation Tracking',
    desc: 'Log and track outreach conversations, follow-ups, and prospect responses directly in ClientPilot without leaving your workflow.',
    bullets: ['Message threading', 'Response tracking', 'Follow-up reminders', 'Email sync (coming soon)'],
    accent: true
  },
  {
    category: 'Growth',
    icon: TrendingUp,
    title: 'Agency Performance Insights',
    desc: 'Understand which types of prospects convert best, which outreach approaches work, and where your pipeline is healthiest.',
    bullets: ['Conversion analytics', 'Outreach performance', 'Revenue forecasting', 'Win/loss analysis'],
    accent: false
  },
  {
    category: 'Security',
    icon: Shield,
    title: 'Privacy & Compliance',
    desc: 'ClientPilot analyzes only publicly available information. All data handling is GDPR compliant with full data deletion on request.',
    bullets: ['GDPR compliant', 'Public data only', 'Data deletion on request', 'Encrypted storage'],
    accent: true
  },
]

export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-charcoal-body font-sans selection:bg-lime-pulse selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero */}
      <section className="py-20 lg:py-28 bg-[#edede8] border-b border-black/10">
        <div className="max-w-300 mx-auto px-4 sm:px-6">
          <motion.h1
            variants={fadeUp} custom={0.1}
            initial="hidden" animate="visible"
            className="text-5xl sm:text-6xl lg:text-[72px] font-normal tracking-tight text-charcoal-body font-heading leading-[1.04] max-w-3xl mb-6"
          >
            Everything your agency needs to win more clients.
          </motion.h1>
          <motion.p
            variants={fadeUp} custom={0.2}
            initial="hidden" animate="visible"
            className="text-lg text-slate-caption max-w-2xl leading-relaxed mb-8"
          >
            ClientPilot brings together business discovery, digital intelligence, AI opportunity analysis, qualification, outreach, and pipeline management into one intelligent workspace.
          </motion.p>
          <motion.div
            variants={fadeUp} custom={0.3}
            initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-full text-sm text-white bg-graphite-ink hover:bg-charcoal-body transition-all"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-full text-sm text-charcoal-body bg-warm-stone hover:bg-quartz transition-all"
            >
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="relative py-20 border-b border-black/10 overflow-hidden">
        {/* Dot-grid background */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #29292914 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {/* Ambient top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-48 bg-lime-pulse/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-300 mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, idx) => {
              const accent = accents[idx] || '#4cc02b'
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="group relative p-6 sm:p-7 rounded-2xl border border-black/8 bg-white flex flex-col justify-between gap-5 transition-all duration-300 shadow-sm hover:shadow-lg hover:border-black/12 overflow-hidden"
                >
                  {/* Corner glow */}
                  <div
                    className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
                    style={{ background: accent }}
                  />

                  <div>
                    <div className="flex items-start justify-between mb-5">
                      {/* Gradient icon badge */}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${accent}22 0%, ${accent}10 100%)`,
                          border: `1px solid ${accent}28`,
                          color: accent
                        }}
                      >
                        <f.icon className="w-5.5 h-5.5" style={{ width: 22, height: 22 }} />
                      </div>
                      <span
                        className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border font-semibold"
                        style={{ color: accent, borderColor: accent + '35', background: accent + '0f' }}
                      >
                        {f.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-graphite-ink font-heading mb-2">{f.title}</h3>
                      <p className="text-sm text-[#5c5c5b] leading-relaxed mb-4">{f.desc}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 pt-3 border-t border-black/5">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-[#5c5c5b]">
                        <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0" style={{ background: accent + '18' }}>
                          <Check className="w-2 h-2" style={{ color: accent }} />
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Animated bottom accent bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(to right, ${accent}30, ${accent}, ${accent}30)` }}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-20 bg-[#edede8]">
        <div className="max-w-300 mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-10 sm:p-16 rounded-2xl bg-graphite-ink text-white text-center space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight font-heading">
              Ready to find opportunities your competitors are missing?
            </h2>
            <p className="text-white/60 text-base max-w-lg mx-auto">
              Start with a free account. No credit card required.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-graphite-ink bg-white hover:bg-[#edede8] transition-all"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
