import React from 'react'
import { Link } from 'react-router-dom'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Search, Globe, Sparkles, Target, Mail, Code2, ShieldCheck, Brain, ArrowRight } from 'lucide-react'

export function ProductPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="py-16 sm:py-24 border-b border-black/10 text-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[200px] bg-[#dbdbd2] text-[#292929] text-xs font-normal">
            <span className="w-2 h-2 rounded-full bg-[#4cc02b]" />
            <span>PRODUCT OVERVIEW</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-normal text-[#292929] tracking-[-0.01em] font-heading max-w-4xl mx-auto leading-tight">
            The intelligence layer behind modern agency prospecting.
          </h1>
          <p className="text-lg text-[#6f6f6e] max-w-3xl mx-auto font-normal leading-relaxed">
            ClientPilot connects business discovery, digital intelligence, opportunity detection, qualification, outreach, and agency execution into one unified workspace.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/signup" className="inline-flex items-center gap-2 px-6 h-[44px] rounded-[200px] text-sm font-normal text-white bg-[#141414] hover:bg-[#292929] transition-all">
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 px-6 h-[44px] rounded-[200px] text-sm font-normal text-[#292929] bg-[#dbdbd2] hover:bg-[#d0d0c8] transition-all">
              <span>See How It Works</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Detailed Product Sections */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">
          {[
            {
              id: 'discovery',
              title: 'Business Discovery',
              subtitle: 'Find businesses matching your target market.',
              desc: 'Scan open map databases and business directories using target keywords, locations, industries, and business models. Filter out irrelevant entities before spending energy on technical evaluation.',
              icon: Search
            },
            {
              id: 'digital-intelligence',
              title: 'Digital Intelligence',
              subtitle: 'Understand websites and digital presence.',
              desc: 'Deep multi-vector analysis across technical performance, mobile UX, SEO tags, accessibility compliance, conversion paths, and business capabilities.',
              icon: Globe
            },
            {
              id: 'opportunity-intelligence',
              title: 'Opportunity Intelligence',
              subtitle: 'Convert findings into potential agency services.',
              desc: 'ClientPilot doesn’t just show errors — it maps technical deficiencies directly to commercial agency deliverables like custom web development, booking flows, or SEO revamps.',
              icon: Sparkles
            },
            {
              id: 'lead-intelligence',
              title: 'Lead Intelligence',
              subtitle: 'Prioritize opportunities using transparent signals.',
              desc: 'Understand exactly why a prospect scored 84/100 using clear breakdowns: severity, service fit, evidence confidence, business fit, reachability, and commercial potential.',
              icon: Target
            },
            {
              id: 'outreach',
              title: 'Outreach Intelligence',
              subtitle: 'Create evidence-backed personalized outreach.',
              desc: 'Generate tailored outreach drafts referencing real, verified website gaps. Every draft requires human review before dispatch, maintaining full brand authority.',
              icon: Mail
            },
            {
              id: 'developer-handoff',
              title: 'Developer Handoff',
              subtitle: 'Convert opportunities into actionable requirements.',
              desc: 'Seamlessly structure won opportunities into developer-ready task briefs with problem description, evidence, affected URLs, recommended fix, and acceptance criteria.',
              icon: Code2
            },
            {
              id: 'qa',
              title: 'QA & Verification',
              subtitle: 'Verify implemented improvements.',
              desc: 'Run post-project audits to confirm that implemented code changes resolved the original detected gap (Pass / Partial / Fail / Needs Review).',
              icon: ShieldCheck
            },
            {
              id: 'agency-intelligence',
              title: 'Agency Memory',
              subtitle: 'Learn from your agency’s decisions and outcomes.',
              desc: 'ClientPilot continuously refines lead qualification based on which recommendations your agency accepts, rejects, or closes into revenue.',
              icon: Brain
            }
          ].map((sec, idx) => (
            <div key={idx} id={sec.id} className="p-[18px] rounded-[12px] bg-white border border-black/10 flex flex-col md:flex-row items-start gap-6 text-left">
              <div className="w-10 h-10 rounded-full bg-[#c0c0c0] flex items-center justify-center text-[#353535] shrink-0">
                <sec.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-left">
                <span className="text-xs font-mono text-[#8f8f8e] uppercase">{sec.subtitle}</span>
                <h2 className="text-2xl font-normal text-[#292929] font-heading">{sec.title}</h2>
                <p className="text-sm text-[#6f6f6e] leading-relaxed max-w-4xl">{sec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
