import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import {
  ArrowRight, CheckCircle2, Globe, Code2,
  BarChart2, Layers, Users2, ArrowUpRight,
} from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const solutions = [
  {
    num: '01',
    icon: Globe,
    audience: 'Digital Agencies',
    tag: 'For Digital Agencies',
    headline: 'Find clients before your competitors do.',
    desc: 'Prospect at scale — discover businesses with outdated sites, poor mobile experiences, or missing SEO foundations, then turn findings into pipeline.',
    bullets: [
      'Identify businesses with specific digital gaps you can fix',
      'Generate outreach emails grounded in real website findings',
      'Qualify prospects before investing sales time',
      'Turn discovery into scoped developer briefs',
    ],
    accent: '#4cc02b',
    stat: { value: '3x', label: 'faster pipeline building' },
    bg: '#0d2b1f',
  },
  {
    num: '02',
    icon: Code2,
    audience: 'Web Dev Studios',
    tag: 'For Dev Studios',
    headline: 'Turn technical audits into sales conversations.',
    desc: "Identify businesses that need what you build — whether that's performance optimization, mobile-first rebuilds, or full-stack custom applications.",
    bullets: [
      'Surface businesses with critical performance or mobile issues',
      'Auto-generate technical briefs for scoping and proposals',
      'Find local businesses underserved by modern dev',
      'Prioritize leads by technical complexity and budget signals',
    ],
    accent: '#2f851d',
    stat: { value: '40+', label: 'signals analyzed per site' },
    bg: '#0e2417',
  },
  {
    num: '03',
    icon: BarChart2,
    audience: 'SEO Agencies',
    tag: 'For SEO Agencies',
    headline: 'Prospect based on real SEO gaps, not guesses.',
    desc: "Find businesses with measurable SEO deficits — missing schema, weak metadata, slow pages — and show prospects exactly where they're losing.",
    bullets: [
      'Identify SEO gap patterns across target industries',
      'Generate outreach with specific findings as proof of value',
      'Benchmark prospects against industry leaders',
      'Build pipeline from businesses losing search visibility',
    ],
    accent: '#4cc02b',
    stat: { value: '87%', label: 'prospect email open rate' },
    bg: '#0d2b1f',
  },
  {
    num: '04',
    icon: Layers,
    audience: 'Freelancers',
    tag: 'For Freelancers',
    headline: 'Build a steady flow of qualified projects.',
    desc: 'Fill your pipeline without cold calling — find businesses that clearly need exactly what you offer and reach out with personalized, evidence-backed messages.',
    bullets: [
      'Discover local businesses that need your specific skills',
      'Outreach that stands out by referencing real problems',
      'Work independently on your own schedule',
      'Scale discovery as your practice grows',
    ],
    accent: '#2f851d',
    stat: { value: '100%', label: 'evidence-backed outreach' },
    bg: '#0e2417',
  },
  {
    num: '05',
    icon: Users2,
    audience: 'B2B Sales Teams',
    tag: 'For Sales Teams',
    headline: 'Enrich leads with digital intelligence before the call.',
    desc: "Know before the call what a prospect's website says about their maturity and needs. No more going in blind.",
    bullets: [
      'Digital audit every prospect before the discovery call',
      'Know their website score, tech stack, and digital gaps',
      'Build calls around specific, research-backed observations',
      'Shorten sales cycles with better pre-call preparation',
    ],
    accent: '#4cc02b',
    stat: { value: '2x', label: 'shorter sales cycles' },
    bg: '#0d2b1f',
  },
]

const sharedFeatures = [
  { title: 'Business Discovery Engine', desc: 'Find matching businesses across directories, maps, and the public web.' },
  { title: 'Website Intelligence Analysis', desc: 'Deep audit of 40+ signals per business — performance, SEO, mobile, and more.' },
  { title: 'AI Opportunity Detection', desc: 'Automatically surfaces the gaps your agency can fix and bill for.' },
  { title: 'Smart Lead Qualification', desc: 'Score and rank prospects before investing any sales time.' },
  { title: 'Personalized Outreach Generator', desc: 'Evidence-backed drafts that reference actual website findings.' },
  { title: 'Developer Brief Generator', desc: 'Turn won opportunities into structured technical handoffs.' },
]

function SolutionCard({ sol, idx }: { sol: typeof solutions[0]; idx: number }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.07, duration: 0.6, ease: EASE }}
      id={`sol-${sol.num}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 24,
        border: '1px solid rgba(0,0,0,0.08)',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'box-shadow 300ms ease, transform 300ms ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px ${sol.accent}30`
          : '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      {/* Light header with accent subtle tint */}
      <div style={{
        background: `${sol.accent}0a`,
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '28px 28px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: `radial-gradient(circle, ${sol.accent}20 0%, transparent 70%)`,
          transition: 'opacity 300ms',
          opacity: hovered ? 1 : 0.4,
        }} />

        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: '#fff', border: `1px solid ${sol.accent}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sol.accent,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <sol.icon size={20} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: sol.accent, letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
              {sol.stat.value}
            </div>
            <div style={{ fontSize: 10, color: '#8f8f8e', fontFamily: 'monospace', letterSpacing: '0.3px' }}>
              {sol.stat.label}
            </div>
          </div>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#fff', border: `1px solid ${sol.accent}30`,
          borderRadius: 999, padding: '3px 10px', marginBottom: 10,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: sol.accent, letterSpacing: '0.5px', fontFamily: 'monospace' }}>
            {sol.tag.toUpperCase()}
          </span>
        </div>

        <h2 style={{
          fontSize: '1.15rem', fontWeight: 700, color: '#141414',
          letterSpacing: '-0.02em', lineHeight: 1.3, margin: 0,
          fontFamily: 'var(--font-heading)', position: 'relative', zIndex: 1,
          maxWidth: 280,
        }}>
          {sol.headline}
        </h2>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 28px 28px' }}>
        <p style={{ fontSize: 13, color: '#5c5c5b', lineHeight: 1.65, margin: '0 0 20px' }}>
          {sol.desc}
        </p>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sol.bullets.map((b) => (
            <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#292929' }}>
              <CheckCircle2 size={15} style={{ color: sol.accent, flexShrink: 0, marginTop: 1 }} />
              {b}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Link
            to="/signup"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '0 18px', height: 38, borderRadius: 999,
              background: '#141414', color: '#fff',
              fontSize: 12, fontWeight: 600, textDecoration: 'none',
              transition: 'background 200ms',
            }}
          >
            Get started <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export function SolutionsPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}
    >
      <PublicNavbar />

      {/* Hero — full-width editorial */}
      <section style={{
        background: 'var(--bg)',
        padding: '100px 24px 72px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        {/* Lime glow */}
        <div style={{ position: 'absolute', top: -100, right: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(76,192,43,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px', borderRadius: 999,
              background: '#dbdbd2', border: '1px solid rgba(0,0,0,0.08)',
              fontSize: 10, fontFamily: 'monospace', letterSpacing: '1px',
              color: '#6f6f6e', marginBottom: 28,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4cc02b', boxShadow: '0 0 8px #4cc02b' }} />
            TAILORED SOLUTIONS
          </motion.div>

          <div>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.65, ease: EASE }}
                className="text-5xl sm:text-6xl lg:text-[72px] font-normal tracking-[-0.025em] leading-[1.04] text-charcoal-body font-heading mb-6"
              >
                Built for{' '}
                <span className="text-lime-pulse">every kind</span>
                {' '}of agency.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.55, ease: EASE }}
                style={{ fontSize: 16, color: '#5c5c5b', maxWidth: 480, lineHeight: 1.7, margin: '0 0 36px' }}
              >
                ClientPilot is purpose-built for agencies, studios, and freelancers who want to find better clients — not just more contacts.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                style={{ display: 'flex', gap: 12 }}
              >
                <Link
                  to="/signup"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '0 28px', height: 50, borderRadius: 999,
                    background: '#141414', color: '#fff',
                    fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  }}
                >
                  Start Free <ArrowRight size={15} />
                </Link>
                <Link
                  to="/how-it-works"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '0 24px', height: 50, borderRadius: 999,
                    background: '#fff', color: '#292929',
                    fontSize: 14, fontWeight: 500, textDecoration: 'none',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  See How It Works
                </Link>
              </motion.div>
            </div>


          </div>
        </div>
      </section>

      {/* Bento grid of solution cards */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Section label */}
          <div style={{ marginBottom: 40 }}>
            <span style={{
              fontSize: 10, fontFamily: 'monospace', letterSpacing: '1.5px',
              color: '#8f8f8e', textTransform: 'uppercase',
            }}>
              Solutions by team type
            </span>
          </div>

          {/* 3-col top row, 2-col bottom row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 20 }}>
            {solutions.slice(0, 3).map((sol, idx) => (
              <SolutionCard key={sol.num} sol={sol} idx={idx} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {solutions.slice(3).map((sol, idx) => (
              <SolutionCard key={sol.num} sol={sol} idx={idx + 3} />
            ))}
          </div>
        </div>
      </section>

      {/* What every team gets — horizontal scrolling feature strip */}
      <section style={{ background: '#fafaf8', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 48 }}
          >
            <div style={{ fontSize: 10, fontFamily: 'monospace', letterSpacing: '1.5px', color: '#8f8f8e', marginBottom: 12, textTransform: 'uppercase' }}>
              Core infrastructure
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 800, letterSpacing: '-0.04em', color: '#141414',
              fontFamily: 'var(--font-heading)', margin: 0,
            }}>
              What every team gets.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {sharedFeatures.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
                style={{
                  padding: '20px 22px',
                  background: '#fff', borderRadius: 16,
                  border: '1px solid rgba(0,0,0,0.07)',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'rgba(76,192,43,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4cc02b' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#141414', margin: '0 0 4px', fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 12, color: '#6f6f6e', margin: 0, lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
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
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(76,192,43,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em',
                color: '#141414', fontFamily: 'var(--font-heading)', margin: '0 0 16px', lineHeight: 1.1,
              }}>
                Your agency deserves<br />better prospects.
              </h2>
              <p style={{ fontSize: 15, color: '#5c5c5b', maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.6 }}>
                Start discovering businesses that actually need what you build.
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
                  Start Free Today <ArrowRight size={15} />
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
