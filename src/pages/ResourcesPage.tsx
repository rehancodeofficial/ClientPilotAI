import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import {
  BookOpen,
  ArrowRight,
  Wand2,
  FileCode2,
  TrendingUp,
  Search,
  CheckCircle2,
  Layers,
  Compass,
  Download
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function ResourcesPage() {
  const [selectedTag, setSelectedTag] = useState('All')

  const tags = ['All', 'Agency Playbooks', 'Audit Frameworks', 'AI Outreach', 'Technical SEO', 'Conversion Optimization']

  const resources = [
    {
      title: 'The Agency Prospecting Playbook',
      category: 'Agency Playbooks',
      desc: 'A practical framework for discovering high-intent businesses, identifying opportunities, and starting better client conversations.',
      readTime: '8 min read',
      badge: 'Featured Guide',
      featured: true,
      slug: '/resources/agency-prospecting-playbook',
    },
    {
      title: '40+ Technical Audit Signals Every Web Studio Should Scan',
      category: 'Audit Frameworks',
      desc: 'A practical checklist for identifying website performance, UX, SEO, accessibility, and technical gaps worth investigating.',
      readTime: '6 min read',
      badge: 'Framework',
      featured: false,
      slug: '/resources/technical-audit-signals',
    },
    {
      title: 'Evidence-Based Outreach: Turning Technical Gaps into Opportunities',
      category: 'AI Outreach',
      desc: 'How verified website findings can turn generic prospecting into specific, relevant conversations.',
      readTime: '5 min read',
      badge: 'Case Study',
      featured: false,
      slug: '/resources/evidence-based-outreach',
    },
    {
      title: 'Structuring Developer-Ready Handoff Briefs from Audit Findings',
      category: 'Conversion Optimization',
      desc: 'Turn website findings into clear requirements, priorities, acceptance criteria, and actionable engineering tasks.',
      readTime: '7 min read',
      badge: 'Technical',
      featured: false,
      slug: '/resources/developer-ready-handoff-briefs',
    },
    {
      title: 'Local SEO & Schema Markup Deficit Analysis',
      category: 'Technical SEO',
      desc: 'Learn how to identify missing local SEO signals and structured-data opportunities across business websites.',
      readTime: '4 min read',
      badge: 'Playbook',
      featured: false,
      slug: '/resources/local-seo-schema-analysis',
    },
    {
      title: 'AI Lead Qualification & Decision-Maker Reachability Framework',
      category: 'Agency Playbooks',
      desc: 'A practical framework for evaluating lead fit, commercial opportunity, and the best path to relevant decision-makers.',
      readTime: '6 min read',
      badge: 'Guide',
      featured: false,
      slug: '/resources/ai-lead-qualification-framework',
    }
  ]

  const filteredResources = selectedTag === 'All' ? resources : resources.filter(r => r.category === selectedTag)

  return (
    <div className="min-h-screen bg-[#edede8] text-charcoal-body font-sans selection:bg-lime-pulse selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero Section with Ambient Glow & Workspace Overlay */}
      <section className="relative py-20 sm:py-28 border-b border-black/10 overflow-hidden bg-[#edede8]">
        {/* Background Image with refined gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=2000&q=80"
            alt="Agency Knowledge Center"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#edede8]/90 via-[#edede8]/85 to-[#edede8]" />
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-lime-pulse/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-300 mx-auto px-4 sm:px-6 text-center space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-normal text-graphite-ink tracking-tight font-heading max-w-3xl mx-auto leading-[1.04]">
            Resources, Guides & Frameworks
          </h1>
          <p className="text-base sm:text-lg text-[#5c5c5b] max-w-2xl mx-auto leading-relaxed">
            Practical strategies, technical audit blueprints, and client acquisition workflows for modern digital agencies.
          </p>

          {/* Tag Filter Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-graphite-ink text-white shadow-xs ring-2 ring-lime-pulse/40'
                    : 'bg-white/80 border border-black/8 text-[#4a4a49] hover:bg-white hover:text-graphite-ink'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="py-16 sm:py-24 bg-[#edede8]">
        <div className="max-w-300 mx-auto px-4 sm:px-6 space-y-12">
          
          {/* Resource Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res, idx) => (
              <motion.div
                key={res.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className={`p-7 rounded-2xl border flex flex-col justify-between transition-all duration-200 ${
                  res.featured
                    ? 'bg-[#eaf5e7] border-lime-pulse/40 shadow-[0_8px_30px_rgba(76,192,43,0.1)]'
                    : 'bg-white border-black/8 hover:border-black/15 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-black/5 text-[#4a4a49]">
                      {res.badge}
                    </span>
                    <span className="text-[11px] font-mono text-ash-subheading">{res.readTime}</span>
                  </div>

                  <Link to={res.slug} className="block group">
                    <h3 className="text-lg font-normal text-graphite-ink font-heading leading-snug mb-2.5 group-hover:text-lime-pulse transition-colors">
                      {res.title}
                    </h3>
                  </Link>
                  <p className="text-xs sm:text-sm text-[#5c5c5b] leading-relaxed mb-6">
                    {res.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs font-medium text-graphite-ink">
                  <span className="flex items-center gap-1.5 text-[#2e7d1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-pulse" />
                    {res.category}
                  </span>
                  <Link
                    to={res.slug}
                    className="inline-flex items-center gap-1 text-graphite-ink hover:text-lime-pulse transition-colors group cursor-pointer"
                  >
                    Read Guide
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Interactive Callout */}
          <div className="p-8 sm:p-12 rounded-2xl bg-graphite-ink text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-2 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-lime-pulse">
                <Wand2 className="w-3.5 h-3.5" />
                <span>LIVE PLATFORM ACCESS</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-normal font-heading tracking-tight">
                Turn guides into actionable client pipeline.
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Scan your first 50 business prospects for free with ClientPilot's automated website intelligence engine.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-xs sm:text-sm font-medium text-graphite-ink bg-white hover:bg-[#edede8] transition-all shadow-sm"
              >
                <span>Start Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
