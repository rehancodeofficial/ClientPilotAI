import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Wand2,
  Mail,
  Clock,
  ShieldCheck
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any, delay },
  }),
}

export function ContactPage() {
  const [category, setCategory] = useState('Sales')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'validation_error' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('validation_error')
      setErrorMessage('Please fill out all required fields (Name, Work Email, and Message).')
      return
    }

    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setName('')
      setEmail('')
      setCompany('')
      setSubject('')
      setMessage('')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#edede8] text-charcoal-body font-sans selection:bg-lime-pulse selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero Section with Ambient Green Glow */}
      <section className="relative py-20 sm:py-28 border-b border-black/10 overflow-hidden bg-[#edede8]">
        {/* Soft Ambient Background Elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-pulse/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-lime-pulse/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-300 mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <motion.h1
              variants={fadeUp}
              custom={0.05}
              initial="hidden"
              animate="visible"
              className="text-5xl sm:text-6xl lg:text-[72px] font-normal text-graphite-ink tracking-tight font-heading leading-[1.04]"
            >
              Let’s talk about your agency’s pipeline.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={0.15}
              initial="hidden"
              animate="visible"
              className="text-base sm:text-lg text-[#5c5c5b] max-w-2xl mx-auto leading-relaxed"
            >
              Have questions about ClientPilot, our intelligence methodology, pricing tiers, or custom API volume? Connect directly with our team.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content: Form + Value & Direct Channels */}
      <section className="py-16 sm:py-24 bg-[#edede8]">
        <div className="max-w-300 mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 bg-white p-7 sm:p-10 rounded-2xl border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative"
            >
              {/* Subtle top indicator */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-black/8">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-lime-pulse" />
                  <span className="text-sm font-semibold text-graphite-ink font-heading">Send a Message</span>
                </div>
                <span className="text-[11px] font-mono text-ash-subheading">Average response time: &lt; 2 hours</span>
              </div>

              {/* Status alerts */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-[#eaf5e7] text-[#2a7a18] border border-lime-pulse/40 text-xs sm:text-sm flex items-start gap-3 shadow-xs"
                >
                  <CheckCircle2 className="w-5 h-5 text-lime-pulse shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#1b5e10]">Thank you! Your message has been received.</span>
                    <span className="text-[#2a7a18] text-xs">Our partnerships and sales team will review your note and get back to you shortly.</span>
                  </div>
                </motion.div>
              )}

              {status === 'validation_error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs sm:text-sm flex items-center gap-3 shadow-xs"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category selector */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[#70706e] mb-2 tracking-wider">
                    Select Inquiry Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Sales', 'Product questions', 'Technical support', 'Partnerships', 'Feedback'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          category === cat
                            ? 'bg-graphite-ink text-white shadow-sm ring-2 ring-lime-pulse/40'
                            : 'bg-[#f4f4ef] border border-black/8 text-[#4a4a49] hover:bg-[#e8e8df] hover:text-graphite-ink'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4a4a49] mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f8f6] border border-black/10 text-sm text-graphite-ink placeholder:text-[#a0a09e] focus:outline-none focus:border-lime-pulse focus:ring-2 focus:ring-lime-pulse/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4a4a49] mb-1.5">
                      Work Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@vertexagency.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f8f6] border border-black/10 text-sm text-graphite-ink placeholder:text-[#a0a09e] focus:outline-none focus:border-lime-pulse focus:ring-2 focus:ring-lime-pulse/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Company & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4a4a49] mb-1.5">
                      Agency / Company Name
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Vertex Interactive"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f8f6] border border-black/10 text-sm text-graphite-ink placeholder:text-[#a0a09e] focus:outline-none focus:border-lime-pulse focus:ring-2 focus:ring-lime-pulse/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4a4a49] mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Scaling agency discovery volume"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f8f6] border border-black/10 text-sm text-graphite-ink placeholder:text-neutral-400 focus:outline-none focus:border-lime-pulse focus:ring-2 focus:ring-lime-pulse/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-[#4a4a49] mb-1.5">
                    How can we help? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your agency, your team size, and what you're looking to achieve with ClientPilot..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f8f6] border border-black/10 text-sm text-graphite-ink placeholder:text-[#a0a09e] focus:outline-none focus:border-lime-pulse focus:ring-2 focus:ring-lime-pulse/20 focus:bg-white transition-all resize-y"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full h-12 rounded-xl bg-graphite-ink hover:bg-[#252525] text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:scale-[1.005] active:scale-[0.99] cursor-pointer group"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-lime-pulse" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4 text-lime-pulse transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Right Column: Direct Info & Why Choose ClientPilot */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Highlight Card with Light Greenish Accent */}
              <div className="p-7 rounded-2xl bg-[#eaf5e7] border border-lime-pulse/40 shadow-[0_8px_30px_rgba(76,192,43,0.1)] space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#2e7d1b] font-semibold uppercase">
                  <Wand2 className="w-4 h-4 text-lime-pulse" />
                  <span>Custom Agency Workflows</span>
                </div>
                <h3 className="text-xl font-normal text-graphite-ink font-heading leading-snug">
                  Need a tailored rollout for 10+ seats or custom API integrations?
                </h3>
                <p className="text-xs sm:text-sm text-[#4a4a49] leading-relaxed">
                  We work closely with agency leadership to build customized discovery parameters, white-label developer briefs, and automated webhook pipelines.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#2a7a18]">
                  <span className="w-2 h-2 rounded-full bg-lime-pulse" />
                  <span>Dedicated solutions engineer assigned</span>
                </div>
              </div>

              {/* Direct Details Card */}
              <div className="p-7 rounded-2xl bg-white border border-black/8 shadow-sm space-y-5">
                <span className="text-[11px] font-mono uppercase text-ash-subheading tracking-wider block">
                  Direct Inquiries
                </span>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#f4f4ef] border border-black/5 flex items-center justify-center text-charcoal-body shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-ash-subheading">General & Sales Email</div>
                      <a href="mailto:support@clientpilot.ai" className="text-sm font-medium text-graphite-ink hover:text-lime-pulse transition-colors">
                        support@clientpilot.ai
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#f4f4ef] border border-black/5 flex items-center justify-center text-charcoal-body shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-ash-subheading">Operating Hours</div>
                      <div className="text-sm font-medium text-graphite-ink">
                        Monday – Friday, 8am – 7pm EST
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#f4f4ef] border border-black/5 flex items-center justify-center text-charcoal-body shrink-0">
                      <ShieldCheck className="w-4 h-4 text-lime-pulse" />
                    </div>
                    <div>
                      <div className="text-xs text-ash-subheading">Privacy Promise</div>
                      <div className="text-xs text-[#5c5c5b] leading-relaxed">
                        We never share your information or sell agency outreach data.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
