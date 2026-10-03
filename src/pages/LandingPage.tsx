import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import {
  ArrowRight,
  Check,
  Search,
  Globe,
  Target,
  Mail,
  Code2,
  Brain,
  Zap,
  Shield,
  TrendingUp,
  Users,
  BarChart2,
  MessageSquare,
  Star,
  ChevronRight
} from 'lucide-react'

// ─── Animation helpers ───────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE, delay }
  })
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay }
  })
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="text-center space-y-1"
    >
      <div className="text-3xl sm:text-4xl font-normal text-charcoal-body font-heading tracking-tight">{value}</div>
      <div className="text-sm text-slate-caption">{label}</div>
    </motion.div>
  )
}

// ─── Workflow Circle card (Section 3) ────────────────────────────────────────
function WorkflowCircleCard({
  num,
  icon: Icon,
  title,
  desc,
  delay = 0
}: {
  num: string
  icon: React.ElementType
  title: string
  desc: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="relative aspect-square rounded-2xl bg-white/90 backdrop-blur-sm border border-black/8 p-5 flex flex-col justify-center items-center text-center group cursor-default shadow-xs hover:shadow-md hover:border-lime-pulse/40 transition-all duration-300 overflow-hidden"
    >
      {/* Subtle greenish hover tint glow */}
      <div className="absolute inset-0 bg-linear-to-b from-lime-pulse/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Step badge top pill */}
      <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lime-pulse/10 border border-lime-pulse/25 text-slate-caption group-hover:border-lime-pulse/40 transition-colors">
        <span className="w-1 h-1 rounded-full bg-lime-pulse" />
        <span className="font-mono text-[10px] font-semibold text-graphite-ink">{num}</span>
      </div>

      <div className="w-10 h-10 rounded-xl bg-linen-canvas border border-black/5 flex items-center justify-center text-graphite-ink shrink-0 mb-2 group-hover:bg-lime-pulse/15 group-hover:text-[#1e6112] group-hover:border-lime-pulse/30 transition-all duration-200">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <h3 className="text-sm font-medium text-charcoal-body mb-1 font-heading leading-tight">{title}</h3>
      <p className="text-[11px] text-slate-caption leading-snug max-w-35">{desc}</p>
    </motion.div>
  )
}

// ─── Feature card (Bento Grid) ─────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  desc,
  accent = false,
  image,
  delay = 0
}: {
  icon: React.ElementType
  title: string
  desc: string
  accent?: boolean
  image?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className={`rounded-2xl border flex flex-col overflow-hidden group cursor-default shadow-sm ${
        accent
          ? 'bg-warm-stone border-black/8'
          : 'bg-white border-black/8 hover:border-black/14'
      }`}
    >
      {image && (
        <div className="w-full h-40 overflow-hidden border-b border-black/8 bg-linen-canvas relative shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="w-10 h-10 rounded-full bg-pebble flex items-center justify-center text-iron-nav shrink-0 group-hover:bg-[#b0b0b0] transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-normal text-charcoal-body mb-1 font-heading">{title}</h3>
          <p className="text-sm text-slate-caption leading-relaxed">{desc}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Step card ───────────────────────────────────────────────────────────────
function StepCard({ num, title, desc, delay }: { num: string; title: string; desc: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="flex gap-4 group"
    >
      <div className="shrink-0 w-9 h-9 rounded-xl bg-linen-canvas border border-black/8 group-hover:bg-lime-pulse/15 group-hover:border-lime-pulse/30 group-hover:text-[#1e6112] flex items-center justify-center font-mono text-xs text-graphite-ink font-semibold transition-colors duration-200">
        {num}
      </div>
      <div className="pt-1">
        <h3 className="text-base font-medium text-charcoal-body font-heading mb-1">{title}</h3>
        <p className="text-sm text-slate-caption leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

// ─── Testimonial card ────────────────────────────────────────────────────────
function TestimonialCard({ quote, author, role, delay }: { quote: string; author: string; role: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="p-4.5 rounded-xl bg-white border border-black/8 space-y-4"
    >
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-lime-pulse text-lime-pulse" />
        ))}
      </div>
      <p className="text-sm text-charcoal-body leading-relaxed">"{quote}"</p>
      <div>
        <div className="text-xs font-medium text-charcoal-body">{author}</div>
        <div className="text-xs text-slate-caption">{role}</div>
      </div>
    </motion.div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="min-h-screen bg-linen-canvas text-charcoal-body font-sans selection:bg-lime-pulse selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* ── 1. HERO — fullscreen video background with overlaid content ──── */}
      <section className="relative min-h-[92vh] flex flex-col overflow-hidden border-b border-black/10 bg-linen-canvas">

        {/* Fullscreen background video shifted right & cropped */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <video
            autoPlay muted loop playsInline
            className="absolute top-0 right-[-10%] sm:right-[-15%] lg:right-[-20%] w-[115%] lg:w-[125%] h-full object-cover object-[80%_center] scale-105"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Gradient overlay — warm linen fade from bottom so text pops */}
        <div className="absolute inset-0 bg-linear-to-b from-linen-canvas/20 via-linen-canvas/10 to-linen-canvas/70 pointer-events-none z-1" />
        {/* Left-side text legibility overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-linen-canvas via-linen-canvas/90 to-transparent pointer-events-none z-1 w-full lg:w-[58%]" />

        {/* Foreground content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="max-w-300 mx-auto px-4 sm:px-6 py-24 lg:py-32 w-full">
            <div className="max-w-xl sm:max-w-2xl space-y-7">

              {/* Badge */}
              <motion.div
                variants={fadeUp} custom={0}
                initial="hidden" animate="visible"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-black/8 text-charcoal-body text-xs font-normal shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-lime-pulse animate-pulse" />
                <span>AI-POWERED CLIENT ACQUISITION</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                custom={0.1}
                initial="hidden"
                animate="visible"
                className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold tracking-[-0.03em] text-graphite-ink leading-[1.05] font-heading"
              >
                Find the businesses<br className="hidden sm:block" /> that{' '}
                <span className="text-lime-pulse">need your agency.</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={fadeUp} custom={0.2}
                initial="hidden" animate="visible"
                className="text-base sm:text-lg text-iron-nav font-normal leading-relaxed max-w-lg"
              >
                ClientPilot discovers businesses, analyzes their digital presence, identifies real opportunities, and helps your agency win more clients.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeUp} custom={0.3}
                initial="hidden" animate="visible"
                className="flex flex-col sm:flex-row items-start gap-3"
              >
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-sm font-normal text-white bg-graphite-ink hover:bg-charcoal-body hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/20 transition-all"
                >
                  <span>Start Finding Opportunities</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-sm font-normal text-charcoal-body bg-white/80 backdrop-blur-sm border border-black/10 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>See How It Works</span>
                </Link>
              </motion.div>

              {/* Footnote */}
              <motion.p
                variants={fadeIn} custom={0.55}
                initial="hidden" animate="visible"
                className="text-xs text-slate-caption"
              >
                One intelligent workflow from discovery to opportunity. Free to start.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST BAR (Social proof numbers) ──────────────────────────── */}
      <section className="py-14 bg-white border-b border-black/10">
        <div className="max-w-300 mx-auto px-4 sm:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-black/8">
            <StatCard value="10,000+" label="Businesses analyzed" delay={0} />
            <StatCard value="3.4×" label="More qualified leads" delay={0.1} />
            <StatCard value="68%" label="Time saved on research" delay={0.2} />
            <StatCard value="$0" label="To start discovering" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ── 3. PROBLEM / WORKFLOW SECTION ───────────────────────────────── */}
      <section className="relative py-20 bg-linear-to-b from-linen-canvas via-[#ebf4e7]/40 to-linen-canvas border-b border-black/10 overflow-hidden">
        {/* Soft greenish ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-180 h-90 bg-lime-pulse/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-300 mx-auto px-4 sm:px-6">
          <Section className="">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-14">
              <div className="lg:col-span-7">
                <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-pulse/15 border border-lime-pulse/30 text-[11px] font-mono font-medium text-[#246314] uppercase mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-pulse" />
                  The Workflow
                </motion.span>
                <motion.h2
                  variants={fadeUp} custom={0.1}
                  className="text-3xl sm:text-4xl font-normal tracking-[-0.01em] text-charcoal-body mb-4 font-heading"
                >
                  Stop searching for clients. Start discovering opportunities.
                </motion.h2>
                <motion.p variants={fadeUp} custom={0.2} className="text-base sm:text-lg text-slate-caption leading-relaxed">
                  Finding potential clients is easy. Finding businesses with problems your agency can actually solve is much harder. ClientPilot connects business discovery, digital intelligence, opportunity detection, qualification, and outreach into one workflow.
                </motion.p>
              </div>
              <div className="lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="rounded-2xl overflow-hidden border border-lime-pulse/25 shadow-lg relative group"
                >
                  <div className="absolute inset-0 bg-linear-to-t from-lime-pulse/15 via-transparent to-transparent pointer-events-none z-1" />
                  <img
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80"
                    alt="Agency workflow collaboration"
                    className="w-full h-56 sm:h-64 object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { num: '01', title: 'Business Discovery', desc: "Discover businesses that match your agency's target market using AI-powered search.", icon: Search, delay: 0 },
                { num: '02', title: 'Digital Intelligence', desc: 'Analyze websites across 40+ technical, SEO, performance, and UX signals.', icon: Globe, delay: 0.05 },
                { num: '03', title: 'Opportunity Detection', desc: 'Identify meaningful digital gaps and rank opportunities by impact.', icon: Brain, delay: 0.1 },
                { num: '04', title: 'Smart Qualification', desc: 'Separate interesting businesses from genuinely relevant opportunities.', icon: Target, delay: 0.15 },
                { num: '05', title: 'Personalized Outreach', desc: 'Turn verified findings into highly relevant, evidence-backed outreach.', icon: Mail, delay: 0.2 },
              ].map((card) => (
                <WorkflowCircleCard key={card.title} num={card.num} icon={card.icon} title={card.title} desc={card.desc} delay={card.delay} />
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── 4. WEBSITE INTELLIGENCE (text + visual) ──────────────────────── */}
      <section className="py-20 bg-white border-b border-black/10">
        <div className="max-w-300 mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-5 space-y-5">
              <motion.span
                variants={fadeUp} custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="text-xs font-mono text-ash-subheading uppercase block"
              >
                Website Intelligence
              </motion.span>
              <motion.h2
                variants={fadeUp} custom={0.1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="text-3xl sm:text-4xl font-normal text-charcoal-body font-heading tracking-tight"
              >
                Understand what a website is doing — and where it is falling short.
              </motion.h2>
              <motion.p
                variants={fadeUp} custom={0.2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="text-base text-slate-caption leading-relaxed"
              >
                ClientPilot analyzes websites across technical, performance, mobile, SEO, accessibility, UX, content, and business capability signals to give you a complete picture before your first conversation.
              </motion.p>

              <motion.div
                variants={fadeUp} custom={0.3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2 text-sm text-charcoal-body"
              >
                {[
                  'Technical health', 'Performance score',
                  'Mobile experience', 'SEO & meta tags',
                  'Accessibility', 'UX & conversion paths',
                  'Content quality', 'Business capabilities'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-pulse shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUp} custom={0.4}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
              >
                <Link
                  to="/features"
                  className="inline-flex items-center gap-2 text-sm text-charcoal-body hover:text-graphite-ink transition-colors group"
                >
                  Explore all features
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Intelligence UI mockup + Real Web Audit visual */}
            <div className="lg:col-span-7 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.98 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.01 }}
                className="p-3 bg-linen-canvas rounded-2xl border border-black/10 shadow-xl overflow-hidden"
              >
                {/* Mock UI: Intelligence Dashboard */}
                <div className="bg-white border-black/8 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-black/8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-lime-pulse" />
                      <span className="text-xs font-medium text-charcoal-body">Website Intelligence — apexstudio.io</span>
                    </div>
                    <span className="text-xs text-ash-subheading font-mono">Score: 34/100</span>
                  </div>
                  {/* Scores grid */}
                  <div className="p-4 grid grid-cols-4 gap-3">
                    {[
                      { label: 'Performance', score: 28, color: '#ef4444' },
                      { label: 'SEO', score: 41, color: '#f59e0b' },
                      { label: 'Mobile', score: 35, color: '#ef4444' },
                      { label: 'Accessibility', score: 52, color: '#f59e0b' },
                    ].map((item) => (
                      <div key={item.label} className="p-3 rounded-lg bg-linen-canvas text-center">
                        <div className="text-lg font-mono font-normal" style={{ color: item.color }}>{item.score}</div>
                        <div className="text-[10px] text-ash-subheading mt-0.5">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Opportunities list */}
                  <div className="px-4 pb-4 space-y-2">
                    {[
                      { text: 'No mobile-responsive layout detected', sev: 'Critical' },
                      { text: 'Missing schema markup for local business', sev: 'High' },
                      { text: 'No SSL certificate on menu subdomain', sev: 'Critical' },
                      { text: 'Page speed score below 30 on mobile', sev: 'High' },
                    ].map((item) => (
                      <div key={item.text} className="flex items-start gap-2.5 py-1.5">
                        <span className={`mt-0.5 shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          item.sev === 'Critical'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}>{item.sev}</span>
                        <span className="text-xs text-charcoal-body">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Team collaborating on website audit findings */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-xl overflow-hidden border border-black/10 shadow-md h-48"
              >
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="Agency team analyzing website performance and conversion paths"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. FEATURES BENTO GRID ───────────────────────────────────────── */}
      <section className="py-20 bg-linen-canvas border-b border-black/10">
        <div className="max-w-300 mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-14">
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs font-mono text-ash-subheading uppercase block mb-3"
            >
              What ClientPilot Does
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl font-normal text-charcoal-body font-heading tracking-tight"
            >
              Every tool your agency needs to win more business.
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={Search}
              title="Business Discovery"
              desc="Find businesses by type, location, and industry that match your agency's ideal client profile."
              image="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80"
              delay={0}
            />
            <FeatureCard
              icon={BarChart2}
              title="Digital Presence Analysis"
              desc="Deep-scan websites across 40+ signals: performance, SEO, mobile, accessibility, UX, and more."
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
              delay={0.05}
              accent
            />
            <FeatureCard
              icon={Target}
              title="Opportunity Scoring"
              desc="AI ranks every gap by severity, relevance, and your agency's service capability."
              image="606cd2a5-726b-4aea-9c20-8a2e08749bd6.png"
              delay={0.1}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Prospect Qualification"
              desc="Score and filter leads using AI-generated qualification signals before you invest time."
              image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
              delay={0.15}
              accent
            />
            <FeatureCard
              icon={MessageSquare}
              title="Outreach Generation"
              desc="Auto-generate personalized, insight-driven email drafts grounded in real findings."
              image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
              delay={0.2}
            />
            <FeatureCard
              icon={Code2}
              title="Developer Handoff"
              desc="Turn opportunities into technical briefs your dev team can act on immediately."
              image="a3924b2f1dae.jpeg"
              delay={0.25}
              accent
            />
            <FeatureCard icon={Users}   
                title="Team Collaboration"
                desc="Share prospects, notes, and status updates across your agency team."
                image="10-Smart-Ways-to-Better-Team-Collaboration-1.webp"
                delay={0.3} />

            <FeatureCard icon={Shield}
                title="Privacy First"
                desc="All analysis uses only publicly available information — fully GDPR compliant."
                image='image.png'
                delay={0.35} 
              
                accent />
            <FeatureCard icon={Zap} 
                title="Fast Automation"            
                desc="Run discovery and analysis at scale — analyze hundreds of businesses in hours, not weeks." 
                image='fast.jpeg'
                delay={0.4} />
          </div>
        </div>
      </section>

      {/* ── 6. HOW IT WORKS (steps) ─────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-black/10">
        <div className="max-w-300 mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            <div>
              <motion.span
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-xs font-mono text-ash-subheading uppercase block mb-3"
              >
                How It Works
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-4xl font-normal text-charcoal-body font-heading tracking-tight mb-4"
              >
                From discovery to proposal in one workflow.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="text-base text-slate-caption leading-relaxed mb-10"
              >
                ClientPilot replaces hours of manual research with an AI-powered workflow that surfaces the right prospects at the right time.
              </motion.p>

              <div className="space-y-8">
                <StepCard num="01" title="Define your ideal client" desc="Set your target industry, location, business size, and service type. ClientPilot learns what a good match looks like for your agency." delay={0} />
                <StepCard num="02" title="AI discovers businesses" desc="Our engine finds hundreds of businesses matching your profile — with contact info, website, social presence, and location data." delay={0.08} />
                <StepCard num="03" title="Analyze digital presence" desc="Each business gets a full digital audit: website performance, SEO gaps, mobile quality, missing integrations, and UX problems." delay={0.16} />
                <StepCard num="04" title="Score & qualify leads" desc="AI ranks opportunities by severity and relevance to your service offering, so you spend time on the highest-value prospects." delay={0.24} />
                <StepCard num="05" title="Generate personalized outreach" desc="Turn findings into email drafts grounded in evidence — not generic templates — that get real responses." delay={0.32} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10"
              >
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 px-6 h-11 rounded-full text-sm font-normal text-white bg-graphite-ink hover:bg-charcoal-body transition-all"
                >
                  See full walkthrough
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            {/* Real agency team photo + Pipeline mock */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:sticky lg:top-24 space-y-4"
            >
              <div className="rounded-2xl overflow-hidden border border-black/10 shadow-md h-48 bg-linen-canvas">
                <img
                  src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern team executing client acquisition workflow"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3 bg-linen-canvas rounded-2xl border border-black/10 shadow-xl">
                <div className="bg-white border border-black/8 overflow-hidden">
                  <div className="px-4 py-3 border-b border-black/8 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-lime-pulse" />
                    <span className="text-xs font-medium text-charcoal-body">Discovery Pipeline</span>
                    <span className="ml-auto text-xs text-ash-subheading font-mono">14 prospects</span>
                  </div>
                  <div className="p-4 space-y-2">
                    {[
                      { name: 'Mario\'s Pizza Co.', score: 87, tag: 'Web redesign', status: 'Hot' },
                      { name: 'Lakeside Dental', score: 74, tag: 'SEO + Mobile', status: 'Warm' },
                      { name: 'Greene & Sons Law', score: 91, tag: 'Full rebuild', status: 'Hot' },
                      { name: 'Riverdale HVAC', score: 62, tag: 'Performance', status: 'Warm' },
                      { name: 'Peak Fitness Studio', score: 78, tag: 'Booking UX', status: 'Hot' },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center gap-3 py-2 border-b border-black/5 last:border-0">
                        <div className="w-7 h-7 rounded-full bg-linen-canvas flex items-center justify-center text-[10px] font-mono text-charcoal-body shrink-0">
                          {item.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-charcoal-body truncate">{item.name}</div>
                          <div className="text-[10px] text-slate-caption">{item.tag}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            item.status === 'Hot'
                              ? 'bg-lime-pulse/10 text-[#2a7a18]'
                              : 'bg-[#f59e0b]/10 text-[#92400e]'
                          }`}>{item.status}</div>
                          <div className="text-[10px] text-ash-subheading mt-0.5 font-mono">{item.score}/100</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pb-4">
                    <div className="w-full py-2 rounded-full text-center text-xs font-normal text-white bg-graphite-ink cursor-pointer hover:bg-charcoal-body transition-colors">
                      Generate outreach for top 5
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

     

      {/* ── 8. PRICING ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-white border-b border-black/10">
        <div className="max-w-300 mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl font-normal text-charcoal-body font-heading tracking-tight mb-3"
            >
              Start finding better opportunities.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base text-slate-caption"
            >
              Clear, transparent pricing with no hidden fees.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Tiers */}
            {[
              {
                name: 'Free', price: '$0', sub: 'For exploring ClientPilot.', features: ['Business discovery', 'Website analysis', 'Opportunities'],
                cta: 'Start Free', ctaLink: '/signup', featured: false, delay: 0
              },
              {
                name: 'Starter', price: '$19', sub: 'For freelancers and small agencies.', features: ['Higher discovery limits', 'Website intelligence', 'Outreach drafts'],
                cta: 'Start Starter', ctaLink: '/signup', featured: false, delay: 0.05
              },
              {
                name: 'Agency', price: '$49', sub: 'For growing agencies.', features: ['Multiple users', 'Advanced intelligence', 'Developer handoff'],
                cta: 'Start Agency', ctaLink: '/signup', featured: true, delay: 0.1, badge: 'Most Popular'
              },
              {
                name: 'Pro', price: '$99', sub: 'For established sales teams.', features: ['Automation & API access', 'Webhooks', 'Priority support'],
                cta: 'Start Pro', ctaLink: '/signup', featured: false, delay: 0.15
              },
              {
                name: 'Enterprise', price: 'Custom', sub: 'For larger organizations.', features: ['Configurable limits & SSO', 'Dedicated SLA', 'Custom integrations'],
                cta: 'Contact Sales', ctaLink: '/contact', featured: false, delay: 0.2
              },
            ].map((tier) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: tier.delay, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className={`relative p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all duration-200 ${
                  tier.featured
                    ? 'bg-[#eaf5e7] border-lime-pulse/40 shadow-[0_8px_30px_rgba(76,192,43,0.12)]'
                    : 'bg-linen-canvas border-black/8 hover:border-black/15 shadow-sm'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-graphite-ink text-white text-[11px] font-medium tracking-wide shadow-md whitespace-nowrap">
                      <Zap className="w-3 h-3 text-white fill-white" />
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-normal text-charcoal-body font-heading">{tier.name}</h3>
                  <div className="text-3xl font-normal text-charcoal-body font-mono my-3">
                    {tier.price}
                    {tier.price !== '$0' && tier.price !== 'Custom' && (
                      <span className="text-xs text-slate-caption font-sans ml-0.5">/mo</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-caption mb-5 leading-relaxed">{tier.sub}</p>
                  <ul className="space-y-2.5 text-xs text-[#5c5c5b] mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className={`w-3.5 h-3.5 shrink-0 ${tier.featured ? 'text-[#2e7d1b]' : 'text-lime-pulse'}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to={tier.ctaLink}
                  className={`w-full py-2.5 rounded-full text-xs font-medium text-center transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-sm ${
                    tier.featured
                      ? 'text-white bg-graphite-ink hover:bg-charcoal-body'
                      : 'text-charcoal-body bg-warm-stone hover:bg-quartz'
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-xs text-ash-subheading"
          >
            All plans include a 14-day free trial. No credit card required.
          </motion.div>
        </div>
      </section>

      {/* ── 9. FINAL CTA BAND ───────────────────────────────────────────── */}
      <section className="py-20 bg-linen-canvas">
        <div className="max-w-300 mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-10 sm:p-16 rounded-2xl bg-graphite-ink text-white text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-pulse" />
              Trusted by agencies worldwide
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.01em] font-heading max-w-2xl mx-auto">
              Your next client is already out there.
            </h2>
            <p className="text-base text-white/60 max-w-lg mx-auto leading-relaxed">
              Start discovering businesses with digital gaps your agency can solve — in the time it takes to make a coffee.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm font-normal text-graphite-ink bg-white hover:bg-linen-canvas transition-all"
              >
                Start Free Today
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm font-normal text-white border border-white/20 hover:border-white/40 transition-all"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
