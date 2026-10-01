import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { ArrowRight, Heart, Globe } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }
  })
}

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero */}
      <section className="py-20 lg:py-28 bg-[#edede8] border-b border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dbdbd2] text-xs mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#4cc02b]" />
            About
          </motion.div>
          <motion.h1
            variants={fadeUp} custom={0.05}
            initial="hidden" animate="visible"
            className="text-4xl sm:text-5xl lg:text-[64px] font-normal tracking-[-0.01em] text-[#292929] font-heading leading-[1.05] max-w-3xl mb-6"
          >
            Giving every business a digital identity.
          </motion.h1>
          <motion.p
            variants={fadeUp} custom={0.15}
            initial="hidden" animate="visible"
            className="text-lg text-[#6f6f6e] max-w-2xl leading-relaxed"
          >
            ClientPilot was built on a simple belief: every small business deserves a great digital presence — and the agencies that build those presences deserve better tools to find the people who need them.
          </motion.p>
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
                { icon: Globe, title: 'A world where businesses have great digital presences', desc: 'We believe that every small and medium business deserves a professional, effective digital presence — and that the agencies capable of delivering that deserve better ways to find their clients.' },
                { icon: Heart, title: 'Built with agencies, for agencies', desc: 'ClientPilot was designed with real feedback from digital agencies, development studios, SEO specialists, and freelancers. Every feature solves a real workflow problem.' },
              ].map((item) => (
                <div key={item.title} className="p-[18px] rounded-xl bg-[#edede8] border border-black/5 space-y-3">
                  <div className="w-9 h-9 rounded-full bg-[#c0c0c0] flex items-center justify-center text-[#353535]">
                    <item.icon className="w-4 h-4" />
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
      <section className="py-20 bg-[#edede8] border-b border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-3xl sm:text-4xl font-normal text-[#292929] font-heading mb-12"
          >
            What we stand for
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Evidence before outreach', desc: 'We believe cold outreach should be grounded in real findings, not assumptions. ClientPilot helps agencies reach out with evidence, not guesses.' },
              { title: 'Quality over quantity', desc: 'A hundred businesses with genuine digital problems are more valuable than ten thousand contacts without context. We optimize for relevance, not volume.' },
              { title: 'Transparency in AI', desc: 'Every AI finding in ClientPilot is traceable. We show agencies exactly what signals we found and why we scored opportunities the way we did.' },
              { title: 'Privacy by design', desc: 'ClientPilot analyzes only publicly available information. We don\'t scrape private data or use anything that isn\'t already visible to anyone on the internet.' },
              { title: 'Built for craft', desc: 'The best agencies win because of their craft. We help them find clients who deserve that craft — not just any client who\'ll sign a contract.' },
              { title: 'Genuine opportunity', desc: 'We exist to create win-win outcomes: agencies find better clients, and businesses get the digital help they actually need.' },
            ].map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07, duration: 0.5 }}
                className="p-[18px] rounded-xl bg-white border border-black/8"
              >
                <h3 className="text-base font-normal text-[#292929] font-heading mb-2">{val.title}</h3>
                <p className="text-sm text-[#6f6f6e] leading-relaxed">{val.desc}</p>
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
