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
      <section className="relative py-20 sm:py-28 border-b border-black/10 text-center overflow-hidden bg-[#edede8]">
        {/* Background Image with refined gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=80"
            alt="Product Digital Presence Workspace"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#edede8]/90 via-[#edede8]/85 to-[#edede8]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#4cc02b]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eaf5e7] border border-[#4cc02b]/30 text-[#2a7a18] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#4cc02b] shadow-[0_0_8px_rgba(76,192,43,0.8)]" />
            <span>PRODUCT ARCHITECTURE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-normal text-[#141414] tracking-[-0.01em] font-heading max-w-4xl mx-auto leading-tight">
            The intelligence layer behind modern agency prospecting.
          </h1>
          <p className="text-lg text-[#5c5c5b] max-w-3xl mx-auto font-normal leading-relaxed">
            ClientPilot connects business discovery, digital intelligence, opportunity detection, qualification, outreach, and agency execution into one unified workspace.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/signup" className="inline-flex items-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-white bg-[#141414] hover:bg-[#292929] transition-all shadow-sm">
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-[#292929] bg-white border border-black/10 hover:bg-[#f4f4ef] transition-all shadow-xs">
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
            <div key={idx} id={sec.id} className="p-6 sm:p-8 rounded-2xl bg-white border border-black/8 shadow-sm flex flex-col md:flex-row items-start gap-6 text-left hover:border-black/15 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#edede8] border border-black/5 flex items-center justify-center text-[#292929] shrink-0">
                <sec.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 text-left flex-1 min-w-0">
                <span className="text-[11px] font-mono text-[#8f8f8e] uppercase tracking-wider">{sec.subtitle}</span>
                <h2 className="text-xl sm:text-2xl font-normal text-[#141414] font-heading tracking-tight">{sec.title}</h2>
                <p className="text-sm text-[#5c5c5b] leading-relaxed max-w-4xl">{sec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
