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
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }
  })
}

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
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero */}
      <section className="py-20 lg:py-28 bg-[#edede8] border-b border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp} custom={0}
            initial="hidden" animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dbdbd2] text-xs font-normal mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#4cc02b]" />
            Features
          </motion.div>
          <motion.h1
            variants={fadeUp} custom={0.1}
            initial="hidden" animate="visible"
            className="text-4xl sm:text-5xl lg:text-[64px] font-normal tracking-[-0.01em] text-[#292929] font-heading leading-[1.05] max-w-3xl mb-6"
          >
            Everything your agency needs to win more clients.
          </motion.h1>
          <motion.p
            variants={fadeUp} custom={0.2}
            initial="hidden" animate="visible"
            className="text-lg text-[#6f6f6e] max-w-2xl leading-relaxed mb-8"
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
              className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-full text-sm text-white bg-[#141414] hover:bg-[#292929] transition-all"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-full text-sm text-[#292929] bg-[#dbdbd2] hover:bg-[#d0d0c8] transition-all"
            >
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20 border-b border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className={`p-[18px] rounded-xl border flex flex-col gap-4 ${
                  f.accent
                    ? 'bg-[#dbdbd2] border-black/8'
                    : 'bg-white border-black/8'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#c0c0c0] flex items-center justify-center text-[#353535]">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase text-[#8f8f8e] mt-1">{f.category}</span>
                </div>
                <div>
                  <h3 className="text-base font-normal text-[#292929] font-heading mb-2">{f.title}</h3>
                  <p className="text-sm text-[#6f6f6e] leading-relaxed mb-3">{f.desc}</p>
                  <ul className="space-y-1.5">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-[#6f6f6e]">
                        <Check className="w-3.5 h-3.5 text-[#4cc02b] shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
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
              Ready to find opportunities your competitors are missing?
            </h2>
            <p className="text-white/60 text-base max-w-lg mx-auto">
              Start with a free account. No credit card required.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-[#141414] bg-white hover:bg-[#edede8] transition-all"
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
