import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { ArrowRight, Heart, Globe, Sparkles, Layers, Cpu, Compass, CheckCircle2, Search, Shield, Zap, Star } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any, delay },
  }),
}

const founders = [
  {
    name: 'Muhammad Rehan Hussain',
    role: 'Co-Founder · Software Engineer',
    image: '/rehan.jpeg',
    bio: "Muhammad Rehan Hussain is one of the minds behind ClientPilot, contributing to the product's technical direction, software architecture, and engineering.",
    secondaryBio:
      'His focus is on turning the ClientPilot vision into a scalable technology platform that can help agencies discover opportunities, understand digital problems, and build better solutions.',
    focusAreas: [
      'Software Architecture',
      'Backend Engineering',
      'AI & Automation',
      'Product Engineering',
      'Systems & Infrastructure',
    ],
  },
  {
    name: 'Wajiha Zehra',
    role: 'Co-Founder · Software Engineer',
    image: '/wajiha.jpeg',
    bio: 'Wajiha Zehra is one of the minds behind ClientPilot, contributing to product direction, user experience, frontend engineering, and the overall vision of the platform.',
    secondaryBio:
      'Her focus is on creating a product that is not only technically capable, but also intuitive, useful, and valuable for agencies and businesses.',
    focusAreas: [
      'Product Strategy',
      'Frontend Engineering',
      'UI/UX',
      'Product Experience',
      'AI-Powered Workflows',
    ],
  },
]

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative py-24 lg:py-32 border-b border-black/10 overflow-hidden bg-[#edede8]">
        {/* Background Image with refined gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=80"
            alt="Agency Modern Workspace"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#edede8]/90 via-[#edede8]/80 to-[#edede8]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,192,43,0.08),transparent_50%)]" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dbdbd2] border border-black/8 text-[#5c5c5b] text-xs font-mono mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#4cc02b]" />
            <span className="font-mono text-[11px] text-[#4a4a49]">About ClientPilot</span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            custom={0.05}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl lg:text-[64px] font-normal tracking-[-0.01em] text-[#292929] font-heading leading-[1.05] max-w-3xl mb-6"
          >
            Giving every business a digital identity.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={0.15}
            initial="hidden"
            animate="visible"
            className="text-lg text-[#5c5c5b] max-w-2xl leading-relaxed"
          >
            ClientPilot was built on a simple belief: every small business deserves a great digital presence — and the agencies that build those presences deserve better tools to find the people who need them.
          </motion.p>
        </div>
      </section>

      {/* The Minds Behind ClientPilot (Founder Story Section) */}
      <section className="py-24 bg-[#edede8] border-b border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-16">
          {/* Section Heading & Context */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dbdbd2] text-[11px] font-mono uppercase tracking-wider text-[#4a4a49] mb-4 border border-black/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cc02b]" />
              Minds Behind the Product
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={0.05}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#141414] font-heading tracking-tight mb-4"
            >
              The Minds Behind ClientPilot
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-lg font-medium text-[#292929] mb-2"
            >
              Built from an idea. Driven by a shared vision.
            </motion.p>
            <motion.p
              variants={fadeUp}
              custom={0.15}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-sm sm:text-base text-[#5c5c5b] leading-relaxed"
            >
              ClientPilot was born from a simple idea: make it easier for businesses to be discovered, understood, and digitally transformed. Behind that vision are the two minds shaping ClientPilot from the ground up.
            </motion.p>
          </div>

          {/* 2-Column Founder Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {founders.map((founder, idx) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                className="p-8 sm:p-10 rounded-2xl bg-white border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all"
              >
                <div className="space-y-6">
                  {/* Avatar & Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="relative">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-black/10 shadow-md bg-[#edede8] shrink-0">
                        <img
                          src={founder.image}
                          alt={founder.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#4cc02b] border-2 border-white shadow-sm" />
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-normal text-[#141414] font-heading tracking-tight">
                        {founder.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-[#4cc02b] font-mono mt-0.5">
                        {founder.role}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#8f8f8e]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#141414]" />
                        <span>ClientPilot Co-Founder</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio Paragraphs */}
                  <div className="space-y-3 pt-2 text-sm text-[#5c5c5b] leading-relaxed border-t border-black/5">
                    <p>{founder.bio}</p>
                    <p className="text-[#6f6f6e]">{founder.secondaryBio}</p>
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="pt-6 mt-6 border-t border-black/5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8f8f8e] block mb-3">
                    Focus Areas
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {founder.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal text-[#292929] bg-[#edede8] border border-black/5 hover:bg-[#dbdbd2] transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4cc02b]" />
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Full-Width Dark / High-Contrast Vision Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl bg-[#141414] text-white p-8 sm:p-12 lg:p-14 overflow-hidden border border-black/20 shadow-xl"
          >
            {/* Subtle background gradient glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4cc02b]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#4cc02b] border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4cc02b] animate-pulse" />
                  One Vision
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal font-heading tracking-tight text-white leading-tight">
                  Two minds. One mission.
                </h3>
                <p className="text-lg sm:text-xl font-normal text-[#4cc02b] font-heading">
                  Giving every business a digital identity.
                </p>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">
                  ClientPilot is being built with a long-term vision: to give every business a digital identity and make the opportunities within that identity easier to discover. What started as an idea is being developed into a platform designed for the future of digital agencies.
                </p>

                {/* 4 Pillars */}
                <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono text-white/80">
                  {['Discover.', 'Understand.', 'Connect.', 'Build.'].map((pillar) => (
                    <span key={pillar} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4cc02b]" />
                      <span>{pillar}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-4">
                <Link
                  to="/features"
                  className="group inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full text-sm font-medium text-[#141414] bg-white hover:bg-[#edede8] transition-all duration-200 shadow-md w-full sm:w-auto"
                >
                  <span>Explore ClientPilot</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full text-sm font-normal text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200 w-full sm:w-auto text-center"
                >
                  See How It Works
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white border-b border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-5"
            >
              <span className="text-xs font-mono uppercase text-[#8f8f8e] block">Our Mission</span>
              <h2 className="text-3xl sm:text-4xl font-normal text-[#292929] font-heading tracking-tight">
                AI finds the opportunity. Human expertise turns it into the solution.
              </h2>
              <p className="text-base text-[#6f6f6e] leading-relaxed">
                We built ClientPilot because we watched great agencies waste hours cold-emailing businesses who didn't need them — and miss the ones who did. The problem wasn't effort. It was intelligence.
              </p>
              <p className="text-base text-[#6f6f6e] leading-relaxed">
                ClientPilot gives agencies the intelligence layer they've always needed: a way to find businesses with real digital problems, understand those problems in depth, and start conversations grounded in evidence rather than guesswork.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <div className="rounded-2xl overflow-hidden border border-black/10 shadow-md h-56 bg-[#edede8]">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
                  alt="ClientPilot team agency workspace"
                  className="w-full h-full object-cover"
                />
              </div>

              {[
                {
                  icon: Globe,
                  title: 'A world where businesses have great digital presences',
                  desc: 'We believe that every small and medium business deserves a professional, effective digital presence — and that the agencies capable of delivering that deserve better ways to find their clients.',
                },
                {
                  icon: Heart,
                  title: 'Built with agencies, for agencies',
                  desc: 'ClientPilot was designed with real feedback from digital agencies, development studios, SEO specialists, and freelancers. Every feature solves a real workflow problem.',
                },
              ].map((item) => (
                <div key={item.title} className="p-6 sm:p-7 rounded-2xl bg-[#edede8] border border-black/5 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#dbdbd2] flex items-center justify-center text-[#353535] shadow-xs">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-normal text-[#292929] font-heading">{item.title}</h3>
                  <p className="text-sm text-[#6f6f6e] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-24 border-b border-black/10 overflow-hidden">
        {/* Background image + overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=80"
            alt="Agency collaboration"
            className="w-full h-full object-cover opacity-[0.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#edede8] via-[#edede8]/95 to-[#edede8]" />
          {/* Dot grid pattern */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #4cc02b22 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          {/* Ambient green glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[#4cc02b]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="mb-14">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dbdbd2] border border-black/8 text-[#5c5c5b] text-xs font-mono mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-[#4cc02b]" />
              OUR PRINCIPLES
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="text-3xl sm:text-4xl font-normal text-[#292929] font-heading"
            >
              What we stand for
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Search,
                num: '01',
                title: 'Evidence before outreach',
                desc: 'We believe cold outreach should be grounded in real findings, not assumptions. ClientPilot helps agencies reach out with evidence, not guesses.',
                accent: '#4cc02b',
              },
              {
                icon: Star,
                num: '02',
                title: 'Quality over quantity',
                desc: 'A hundred businesses with genuine digital problems are more valuable than ten thousand contacts without context. We optimize for relevance, not volume.',
                accent: '#f59e0b',
              },
              {
                icon: Sparkles,
                num: '03',
                title: 'Transparency in AI',
                desc: 'Every AI finding in ClientPilot is traceable. We show agencies exactly what signals we found and why we scored opportunities the way we did.',
                accent: '#3b82f6',
              },
              {
                icon: Shield,
                num: '04',
                title: 'Privacy by design',
                desc: 'ClientPilot analyzes only publicly available information. We don\'t scrape private data or use anything that isn\'t already visible to anyone on the internet.',
                accent: '#8b5cf6',
              },
              {
                icon: Zap,
                num: '05',
                title: 'Built for craft',
                desc: 'The best agencies win because of their craft. We help them find clients who deserve that craft — not just any client who\'ll sign a contract.',
                accent: '#ef4444',
              },
              {
                icon: Heart,
                num: '06',
                title: 'Genuine opportunity',
                desc: 'We exist to create win-win outcomes: agencies find better clients, and businesses get the digital help they actually need.',
                accent: '#ec4899',
              },
            ].map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group relative p-7 rounded-2xl bg-white/90 backdrop-blur-sm border border-black/8 shadow-sm flex flex-col gap-4 h-full hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Subtle accent glow on hover */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                  style={{ background: val.accent }}
                />
                {/* Number + Icon row */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ background: val.accent + '18', color: val.accent }}
                  >
                    <val.icon className="w-5 h-5" />
                  </div>
                  <span
                    className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border"
                    style={{ color: val.accent, borderColor: val.accent + '40', background: val.accent + '0f' }}
                  >
                    {val.num}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-medium text-[#141414] font-heading mb-1.5">{val.title}</h3>
                  <p className="text-sm text-[#6f6f6e] leading-relaxed">{val.desc}</p>
                </div>

                {/* Bottom accent bar on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to right, ${val.accent}40, ${val.accent}, ${val.accent}40)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#edede8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-10 sm:p-16 rounded-2xl bg-[#141414] text-white text-center space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight font-heading">
              Join the agencies finding better clients.
            </h2>
            <p className="text-white/60 max-w-md mx-auto text-base">
              Start free. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-[#141414] bg-white hover:bg-[#edede8] transition-all"
              >
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-white border border-white/20 hover:border-white/40 transition-all"
              >
                Talk to Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
