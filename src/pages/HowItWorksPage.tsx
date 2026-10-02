import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import {
  ArrowRight, Search, Globe, Brain, Target,
  Mail, Code2, Terminal, ChevronRight,
} from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const steps = [
  {
    num: '01',
    icon: Search,
    accent: '#4cc02b',
    title: 'Define Your Ideal Client',
    short: 'Profile Setup',
    desc: 'Tell ClientPilot exactly what a great client looks like for your agency — industry, location, size, service needs, budget signals. The more specific, the sharper the results.',
    detail: 'ClientPilot learns from your preferences and gets smarter with every search. Filters stack: narrow by tech stack signals, review recency, employee count, and more.',
    img: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Agency team defining target client profile',
    terminal: [
      { label: 'industry',  value: 'restaurants' },
      { label: 'location',  value: 'Chicago, IL + 50mi' },
      { label: 'team_size', value: '10-100' },
      { label: 'need',      value: 'website + seo' },
      { label: 'budget',    value: 'established' },
    ],
    stat: { value: '40+', sub: 'filter dimensions' },
  },
  {
    num: '02',
    icon: Globe,
    accent: '#3b82f6',
    title: 'AI Discovers Businesses',
    short: 'Discovery',
    desc: 'Our engine searches directories, maps, and the public web — returning complete records with website URLs, contact info, and location data. Hundreds of matches in seconds.',
    detail: 'No manual googling. No CSV scraping. You get a live, structured feed of matching businesses sorted by relevance to your criteria.',
    img: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'AI discovering businesses across the web',
    terminal: [
      { label: "Mario's Pizza Co.",    value: 'mario-pizza.com' },
      { label: 'Lakeside Grill',       value: 'lakesidegrill.net' },
      { label: 'The Patio Kitchen',    value: 'thepatiokitchen.com' },
      { label: 'Golden Dragon',        value: 'goldendragonchi.com' },
      { label: 'Farm Table Bistro',    value: 'farmtablebistro.com' },
    ],
    stat: { value: '<30s', sub: 'discovery time' },
  },
  {
    num: '03',
    icon: Brain,
    accent: '#8b5cf6',
    title: 'Analyze Digital Presence',
    short: 'Audit',
    desc: 'Every discovered business gets a comprehensive website audit across performance, SEO, mobile experience, accessibility, UX quality, and content signals. 40+ dimensions per site.',
    detail: 'A full audit runs automatically for every business in your list. You get structured findings grounded in real data, not assumptions.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Website analysis dashboard showing performance metrics',
    terminal: [
      { label: 'performance',   value: '28/100 · Critical' },
      { label: 'seo',           value: '41/100 · High priority' },
      { label: 'mobile',        value: '35/100 · Critical' },
      { label: 'accessibility', value: '52/100 · Moderate' },
      { label: 'content',       value: '60/100 · Good' },
    ],
    stat: { value: '40+', sub: 'signals per site' },
  },
  {
    num: '04',
    icon: Target,
    accent: '#f59e0b',
    title: 'Score and Qualify',
    short: 'Scoring',
    desc: 'AI reviews analysis findings and scores each prospect on fit — problem severity, service alignment, budget signals, and readiness to invest. Separate hot leads from the noise.',
    detail: 'Qualification scoring combines audit severity with your agency profile to surface only the prospects worth your sales time.',
    img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Prospect scoring and sales qualification',
    terminal: [
      { label: 'opportunity',  value: '87/100 · Hot' },
      { label: 'service_fit',  value: 'Web + SEO + Mobile' },
      { label: 'budget',       value: 'Established' },
      { label: 'severity',     value: 'Critical on 3/5' },
      { label: 'action',       value: 'Prioritize now' },
    ],
    stat: { value: '3x', sub: 'lead quality uplift' },
  },
  {
    num: '05',
    icon: Mail,
    accent: '#ef4444',
    title: 'Generate Outreach',
    short: 'Outreach',
    desc: "Turn findings into highly specific, evidence-backed email drafts that reference actual problems on each prospect's website. Not templates — real, contextual messages.",
    detail: 'Each draft includes specific findings, proposed solutions tied to your services, and a clear value proposition grounded in data your prospect can verify.',
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Personalized email outreach being composed',
    terminal: [
      { label: 'subject',   value: 'Quick note on your mobile site' },
      { label: 'opening',   value: 'Found your site via Google Maps...' },
      { label: 'finding_1', value: 'Mobile load: 8.4s (avg 2.1s)' },
      { label: 'finding_2', value: 'No schema markup detected' },
      { label: 'cta',       value: 'Free 15-min review call' },
    ],
    stat: { value: '87%', sub: 'open rate average' },
  },
  {
    num: '06',
    icon: Code2,
    accent: '#0ea5e9',
    title: 'Hand Off to Your Team',
    short: 'Handoff',
    desc: 'When a prospect says yes, convert opportunity findings into a structured technical brief — priority ordering, effort estimates, and requirements ready for your dev team.',
    detail: 'No more translating discovery findings into dev-speak. ClientPilot generates developer-ready briefs automatically so you can scope and close faster.',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Developer team reviewing technical handoff brief',
    terminal: [
      { label: 'type',       value: 'Website rebuild + SEO' },
      { label: 'priority_1', value: 'Mobile-first responsive' },
      { label: 'priority_2', value: 'Core Web Vitals fix' },
      { label: 'priority_3', value: 'Schema + local SEO' },
      { label: 'scope',      value: '6-8 wks · $12k-$18k' },
    ],
    stat: { value: '2x', sub: 'faster scoping' },
  },
]



function StepContent({ step, align }: { step: typeof steps[0]; align: 'left' | 'right' }) {
  return (
    <div style={{ textAlign: align === 'right' ? 'right' : 'left' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        marginBottom: 12,
        flexDirection: align === 'right' ? 'row-reverse' : 'row',
      }}>
        <span style={{
          fontFamily: 'monospace',
          fontSize: 11, fontWeight: 700, letterSpacing: '1px',
          color: step.accent, background: `${step.accent}14`,
          border: `1px solid ${step.accent}30`,
          borderRadius: 999, padding: '3px 10px',
        }}>
          STEP {step.num}
        </span>
        <span style={{ fontSize: 10, color: '#8f8f8e', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
          {step.short}
        </span>
      </div>

      <h2 style={{
        fontSize: 'clamp(1.4rem, 2vw, 1.9rem)',
        fontWeight: 700,
        letterSpacing: '-0.03em',
        color: '#141414',
        margin: '0 0 10px',
        lineHeight: 1.15,
        fontFamily: 'var(--font-heading)',
      }}>
        {step.title}
      </h2>

      <p style={{ fontSize: 14, color: '#5c5c5b', lineHeight: 1.7, margin: '0 0 12px', maxWidth: 380 }}>
        {step.desc}
      </p>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: `${step.accent}10`,
        border: `1px solid ${step.accent}30`,
        borderRadius: 12, padding: '8px 14px',
        marginBottom: 16,
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: step.accent, letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)' }}>
          {step.stat.value}
        </span>
        <span style={{ fontSize: 11, color: '#8f8f8e', fontFamily: 'monospace' }}>{step.stat.sub}</span>
      </div>
    </div>
  )
}

function StepImage({ step, inView }: { step: typeof steps[0], inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
      style={{
        width: '100%',
        height: '320px',
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to bottom, ${step.accent}20, transparent)`,
        mixBlendMode: 'multiply', zIndex: 1
      }} />
      <img
        src={step.img}
        alt={step.imgAlt}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 2,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
        padding: '6px 12px', borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: 8,
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: step.accent }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#141414', fontFamily: 'monospace' }}>
          STEP {step.num}
        </span>
      </div>
    </motion.div>
  )
}

function StepRow({ step, idx }: { step: typeof steps[0]; idx: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const isEven = idx % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      id={`step-${step.num}`}
      style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'start' }}
    >
      {isEven ? (
        <div style={{ paddingRight: 40, paddingTop: 8, paddingBottom: 60 }}>
          <StepContent step={step} align="right" />
        </div>
      ) : (
        <StepImage step={step} inView={inView} />
      )}

      {/* Timeline centre */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 22 }}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: `${step.accent}18`,
            border: `2px solid ${step.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: step.accent, flexShrink: 0, zIndex: 2,
            boxShadow: `0 0 24px ${step.accent}30`,
          }}
        >
          <step.icon size={20} />
        </motion.div>
        {idx < steps.length - 1 && (
          <div style={{
            width: 2, flex: 1, minHeight: 80,
            background: `linear-gradient(to bottom, ${step.accent}60, ${steps[idx + 1].accent}30)`,
            marginTop: 4,
          }} />
        )}
      </div>

      {!isEven ? (
        <div style={{ paddingLeft: 40, paddingTop: 8, paddingBottom: 60 }}>
          <StepContent step={step} align="left" />
        </div>
      ) : (
        <div style={{ paddingBottom: 60 }} />
      )}
    </motion.div>
  )
}

export function HowItWorksPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}
    >
      <PublicNavbar />

      {/* Hero */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', overflow: 'hidden', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(76,192,43,0.12) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: '10%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px', borderRadius: 999,
              background: '#dbdbd2', border: '1px solid rgba(0,0,0,0.08)',
              fontSize: 10, fontFamily: 'monospace', letterSpacing: '1px',
              color: '#6f6f6e', marginBottom: 24,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4cc02b', boxShadow: '0 0 8px #4cc02b' }} />
            HOW IT WORKS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65, ease: EASE }}
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              color: '#141414',
              margin: '0 0 20px',
              fontFamily: 'var(--font-heading)',
              maxWidth: 800,
            }}
          >
            Six steps.<br />
            <span style={{ color: '#4cc02b' }}>One</span> intelligent workflow.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55, ease: EASE }}
            style={{ fontSize: 16, color: '#5c5c5b', maxWidth: 560, lineHeight: 1.7, margin: '0 0 36px' }}
          >
            ClientPilot replaces hours of manual research with a fully automated pipeline — from discovery to signed proposal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
          >
            <Link
              to="/signup"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '0 28px', height: 48, borderRadius: 999,
                background: '#141414', color: '#fff',
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
              }}
            >
              Start Free <ArrowRight size={15} />
            </Link>
            <Link
              to="/features"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '0 24px', height: 48, borderRadius: 999,
                background: '#fff', color: '#292929',
                fontSize: 14, fontWeight: 500, textDecoration: 'none',
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              All Features
            </Link>
          </motion.div>

          {/* Step quick-nav */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 40 }}
          >
            {steps.map((s) => (
              <a
                key={s.num}
                href={`#step-${s.num}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 999,
                  background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                  fontSize: 11, color: '#6f6f6e', textDecoration: 'none',
                }}
              >
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#8f8f8e' }}>{s.num}</span>
                {s.short}
                <ChevronRight size={10} />
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          {steps.map((step, idx) => (
            <StepRow key={step.num} step={step} idx={idx} />
          ))}
        </div>
      </section>

      {/* Light stats strip */}
      <section style={{ background: '#ffffff', padding: '64px 24px', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { value: '6', label: 'Workflow steps', sub: 'end-to-end' },
              { value: '40+', label: 'Analysis signals', sub: 'per business' },
              { value: '<2 min', label: 'Discovery to insight', sub: 'fully automated' },
              { value: '100%', label: 'Human-reviewed', sub: 'before sending' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: EASE }}
                style={{ textAlign: 'center', padding: '28px 16px' }}
              >
                <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.04em', color: '#141414', fontFamily: 'var(--font-heading)', marginBottom: 6 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#292929', marginBottom: 2 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 11, color: '#8f8f8e', fontFamily: 'monospace' }}>
                  {stat.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Light CTA Banner */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              position: 'relative', borderRadius: 28, overflow: 'hidden',
              background: '#ffffff', padding: '72px 48px', textAlign: 'center',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(76,192,43,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#dbdbd2', border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 999, padding: '5px 14px',
                fontSize: 10, fontFamily: 'monospace', letterSpacing: '1px',
                color: '#6f6f6e', marginBottom: 24,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4cc02b', display: 'inline-block' }} />
                FREE TO START
              </div>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.04em',
                color: '#141414', fontFamily: 'var(--font-heading)', margin: '0 0 16px', lineHeight: 1.1,
              }}>
                Start your first discovery<br />in minutes.
              </h2>
              <p style={{ fontSize: 15, color: '#5c5c5b', maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.6 }}>
                Free to start. No credit card. See real results before you commit to a plan.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  to="/signup"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '0 32px', height: 50, borderRadius: 999,
                    background: '#141414', color: '#fff',
                    fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  }}
                >
                  Start Free Now <ArrowRight size={15} />
                </Link>
                <Link
                  to="/pricing"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '0 28px', height: 50, borderRadius: 999,
                    background: '#fff', color: '#292929',
                    fontSize: 14, fontWeight: 500, textDecoration: 'none',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
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
