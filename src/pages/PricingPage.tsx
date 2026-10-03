import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Check, ArrowRight, Zap } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any, delay }
  })
}

const tiers = [
  {
    name: 'Free',
    price: { monthly: '$0', annual: '$0' },
    sub: 'For exploring ClientPilot.',
    features: [
      'Up to 50 businesses / month',
      'Basic website analysis',
      'Opportunity identification',
      'Community support',
    ],
    missing: ['Outreach generation', 'API access', 'Team features'],
    cta: 'Start Free',
    ctaLink: '/signup',
    featured: false,
  },
  {
    name: 'Starter',
    price: { monthly: '$19', annual: '$16' },
    sub: 'For freelancers and small agencies.',
    features: [
      'Up to 500 businesses / month',
      'Full website intelligence',
      'Outreach draft generation',
      'Prospect scoring',
      'Email support',
    ],
    missing: ['Team workspaces', 'API access', 'Webhooks'],
    cta: 'Start Starter',
    ctaLink: '/signup',
    featured: false,
  },
  {
    name: 'Agency',
    price: { monthly: '$49', annual: '$41' },
    sub: 'For growing agencies ready to scale.',
    features: [
      'Up to 2,000 businesses / month',
      'Full website intelligence',
      'Advanced outreach generation',
      'Team workspaces (up to 5 users)',
      'Developer brief generation',
      'Priority support',
    ],
    missing: ['API access', 'Webhooks'],
    cta: 'Start Agency',
    ctaLink: '/signup',
    featured: true,
    badge: 'Most Popular',
  },
  {
    name: 'Pro',
    price: { monthly: '$99', annual: '$83' },
    sub: 'For established agencies and sales teams.',
    features: [
      'Up to 10,000 businesses / month',
      'Full website intelligence',
      'Advanced outreach generation',
      'Team workspaces (unlimited users)',
      'Developer brief generation',
      'API access',
      'Webhooks & integrations',
      'Priority support',
    ],
    missing: [],
    cta: 'Start Pro',
    ctaLink: '/signup',
    featured: false,
  },
  {
    name: 'Enterprise',
    price: { monthly: 'Custom', annual: 'Custom' },
    sub: 'For larger organizations with custom needs.',
    features: [
      'Unlimited businesses',
      'Custom discovery limits',
      'White-label options',
      'SSO & SAML',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom integrations',
      'Onboarding support',
    ],
    missing: [],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    featured: false,
  },
]

const faqs = [
  {
    q: 'Is there a free trial on paid plans?',
    a: 'Yes — all paid plans come with a 14-day free trial. No credit card required to start.'
  },
  {
    q: 'What counts as a "business"?',
    a: 'A business is any company or organization you discover and analyze using ClientPilot. Your monthly limit resets at the start of each billing period.'
  },
  {
    q: 'Can I change plans at any time?',
    a: 'Yes. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades take effect at the next billing cycle.'
  },
  {
    q: 'What is included in website intelligence?',
    a: 'A full analysis across 40+ signals: performance, Core Web Vitals, SEO, mobile experience, accessibility, UX quality, content strategy, and business capability indicators.'
  },
  {
    q: 'Do you offer annual billing discounts?',
    a: 'Yes — choosing annual billing gives you approximately 15–20% off the monthly rate across all plans.'
  },
  {
    q: 'Is ClientPilot GDPR compliant?',
    a: 'Yes. ClientPilot analyzes only publicly available information. We are GDPR compliant and support data deletion requests.'
  },
]

export function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const [selectedMobilePlan, setSelectedMobilePlan] = useState('Agency')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#edede8] text-charcoal-body font-sans selection:bg-lime-pulse selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 border-b border-black/10 overflow-hidden bg-[#edede8]">
        {/* Background Image with refined gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=2000&q=80"
            alt="Agency Growth"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#edede8]/90 via-[#edede8]/85 to-[#edede8]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-pulse/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-300 mx-auto px-4 sm:px-6 text-left">
          <motion.h1
            variants={fadeUp} custom={0.05}
            initial="hidden" animate="visible"
            className="text-5xl sm:text-6xl lg:text-[72px] font-normal tracking-tight text-graphite-ink font-heading leading-[1.04] max-w-3xl mb-6"
          >
            Clear pricing. No surprises.
          </motion.h1>
          <motion.p
            variants={fadeUp} custom={0.15}
            initial="hidden" animate="visible"
            className="text-lg text-[#5c5c5b] max-w-xl leading-relaxed mb-8"
          >
            Start free. Upgrade when you need more. Every plan includes a 14-day free trial on paid tiers.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            variants={fadeUp} custom={0.25}
            initial="hidden" animate="visible"
            className="flex items-center gap-3"
          >
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                !annual
                  ? 'bg-graphite-ink text-white'
                  : 'bg-warm-stone text-charcoal-body hover:bg-quartz'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
                annual
                  ? 'bg-graphite-ink text-white'
                  : 'bg-warm-stone text-charcoal-body hover:bg-quartz'
              }`}
            >
              Annual
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-colors ${
                annual ? 'bg-white/20 text-white' : 'bg-lime-pulse/15 text-[#2a7a18]'
              }`}>Save 20%</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pricing grid */}
      <section className="py-20 border-b border-black/10">
        <div className="max-w-300 mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className={`relative p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all duration-200 ${
                  tier.featured
                    ? 'bg-[#eaf5e7] border-lime-pulse/40 shadow-[0_8px_30px_rgba(76,192,43,0.12)]'
                    : 'bg-white border-black/8 hover:border-black/15 shadow-sm'
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
                  <div className="my-3">
                    <span className="text-3xl font-mono font-normal text-charcoal-body">
                      {annual ? tier.price.annual : tier.price.monthly}
                    </span>
                    {tier.price.monthly !== '$0' && tier.price.monthly !== 'Custom' && (
                      <span className="text-xs text-slate-caption ml-1">/mo</span>
                    )}
                    {annual && tier.price.annual !== 'Custom' && tier.price.annual !== '$0' && (
                      <div className="text-[10px] text-slate-caption mt-0.5">billed annually</div>
                    )}
                  </div>
                  <p className="text-xs text-slate-caption mb-5 leading-relaxed">{tier.sub}</p>

                  <ul className="space-y-2.5 mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-charcoal-body">
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${tier.featured ? 'text-[#2e7d1b]' : 'text-lime-pulse'}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                    {tier.missing.map((m) => (
                      <li key={m} className="flex items-start gap-2 text-xs text-ash-subheading line-through decoration-pebble">
                        <div className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={tier.ctaLink}
                  className={`w-full py-2.5 rounded-full text-xs font-medium text-center transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-sm ${
                    tier.featured
                      ? 'bg-graphite-ink text-white hover:bg-charcoal-body'
                      : 'bg-warm-stone text-charcoal-body hover:bg-quartz'
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-xs text-ash-subheading space-y-1"
          >
            <p>All paid plans include a 14-day free trial. No credit card required to start.</p>
            <p>Need something custom? <Link to="/contact" className="text-charcoal-body underline underline-offset-2">Contact our sales team</Link>.</p>
          </motion.div>
        </div>
      </section>

      {/* Feature comparison (Responsive — No Horizontal Scroll on Mobile) */}
      <section className="py-20 bg-white border-b border-black/10">
        <div className="max-w-225 mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-2xl sm:text-3xl font-normal text-charcoal-body font-heading mb-8 sm:mb-10 text-center"
          >
            What's included in each plan
          </motion.h2>

          {/* ── Mobile View: Plan Selector & Stacked Feature List (< md) ── */}
          <div className="block md:hidden">
            {/* Plan Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
              {tiers.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedMobilePlan(t.name)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedMobilePlan === t.name
                      ? 'bg-graphite-ink text-white shadow-xs'
                      : 'bg-linen-canvas text-charcoal-body border border-black/8 hover:bg-warm-stone'
                  }`}
                >
                  {t.name} {t.badge && '★'}
                </button>
              ))}
            </div>

            {/* Selected Plan Details Card */}
            <div className="p-6 rounded-2xl bg-[#f8f8f5] border border-black/8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/8">
                <div>
                  <span className="text-xs font-mono text-ash-subheading uppercase">Selected Plan</span>
                  <h3 className="text-lg font-semibold text-graphite-ink font-heading">{selectedMobilePlan}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-graphite-ink">
                    {annual
                      ? tiers.find(t => t.name === selectedMobilePlan)?.price.annual
                      : tiers.find(t => t.name === selectedMobilePlan)?.price.monthly}
                  </div>
                  <span className="text-[10px] text-slate-caption">
                    {annual ? 'billed annually' : 'monthly'}
                  </span>
                </div>
              </div>

              {/* Feature items */}
              <div className="space-y-3 pt-1">
                {[
                  { label: 'Business discovery', key: 'discovery' },
                  { label: 'Website intelligence', key: 'intel' },
                  { label: 'Opportunity scoring', key: 'scoring' },
                  { label: 'Outreach generation', key: 'outreach' },
                  { label: 'Team workspaces', key: 'workspaces' },
                  { label: 'Developer briefs', key: 'briefs' },
                  { label: 'API access', key: 'api' },
                  { label: 'Webhooks', key: 'webhooks' },
                  { label: 'SSO / SAML', key: 'sso' },
                  { label: 'Support', key: 'support' },
                ].map((item, idx) => {
                  const planIdx = ['Free', 'Starter', 'Agency', 'Pro', 'Enterprise'].indexOf(selectedMobilePlan)
                  const values = [
                    ['50 / month', 'Basic analysis', 'Included', 'Not included', 'Not included', 'Not included', 'Not included', 'Not included', 'Not included', 'Community support'],
                    ['500 / month', 'Full 40+ signals', 'Included', 'Included', 'Not included', 'Not included', 'Not included', 'Not included', 'Not included', 'Standard email'],
                    ['2,000 / month', 'Full 40+ signals', 'Included', 'Advanced AI drafts', 'Up to 5 seats', 'Included', 'Not included', 'Not included', 'Not included', 'Priority queue'],
                    ['10,000 / month', 'Full 40+ signals', 'Included', 'Advanced AI drafts', 'Unlimited seats', 'Included', 'Full API access', 'Webhooks included', 'Not included', 'Priority queue'],
                    ['Unlimited', 'Full 40+ signals', 'Included', 'Advanced AI drafts', 'Unlimited seats', 'Included', 'Custom rate limits', 'Custom pipelines', 'SSO / SAML', 'Dedicated manager'],
                  ]
                  const val = values[planIdx] ? values[planIdx][idx] : '—'
                  const isIncluded = val !== 'Not included' && val !== '—'

                  return (
                    <div key={item.label} className="flex items-start justify-between gap-3 text-xs py-1.5 border-b border-black/4">
                      <span className="text-[#5c5c5b]">{item.label}</span>
                      <span className={`font-medium text-right ${isIncluded ? 'text-graphite-ink' : 'text-ash-subheading line-through'}`}>
                        {val}
                      </span>
                    </div>
                  )
                })}
              </div>

              <Link
                to={tiers.find(t => t.name === selectedMobilePlan)?.ctaLink || '/signup'}
                className="block w-full py-3 rounded-xl text-center text-xs font-semibold bg-graphite-ink text-white hover:bg-charcoal-body transition-colors mt-4 no-underline"
              >
                Choose {selectedMobilePlan}
              </Link>
            </div>
          </div>

          {/* ── Desktop View: Full Table (>= md) ── */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/8">
                  <th className="text-left py-3 pr-4 text-charcoal-body font-normal w-48">Feature</th>
                  {['Free', 'Starter', 'Agency', 'Pro', 'Enterprise'].map((t) => (
                    <th key={t} className={`text-center py-3 px-2 font-normal ${t === 'Agency' ? 'text-charcoal-body bg-[#edede8] rounded-t-lg font-semibold' : 'text-slate-caption'}`}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {[
                  { label: 'Business discovery', vals: ['50/mo', '500/mo', '2,000/mo', '10,000/mo', 'Unlimited'] },
                  { label: 'Website intelligence', vals: ['Basic', '✓', '✓', '✓', '✓'] },
                  { label: 'Opportunity scoring', vals: ['✓', '✓', '✓', '✓', '✓'] },
                  { label: 'Outreach generation', vals: ['—', '✓', '✓', '✓', '✓'] },
                  { label: 'Team workspaces', vals: ['—', '—', 'Up to 5', 'Unlimited', 'Unlimited'] },
                  { label: 'Developer briefs', vals: ['—', '—', '✓', '✓', '✓'] },
                  { label: 'API access', vals: ['—', '—', '—', '✓', '✓'] },
                  { label: 'Webhooks', vals: ['—', '—', '—', '✓', '✓'] },
                  { label: 'SSO / SAML', vals: ['—', '—', '—', '—', '✓'] },
                  { label: 'Support', vals: ['Community', 'Email', 'Priority', 'Priority', 'Dedicated'] },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="py-3 pr-4 text-charcoal-body text-xs">{row.label}</td>
                    {row.vals.map((v, i) => (
                      <td key={i} className={`py-3 px-2 text-center text-xs ${
                        v === '—' ? 'text-pebble' : 'text-charcoal-body'
                      } ${i === 2 ? 'bg-[#edede8] font-medium' : ''}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#edede8] border-b border-black/10">
        <div className="max-w-200 mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-2xl sm:text-3xl font-normal text-charcoal-body font-heading mb-10"
          >
            Frequently asked questions
          </motion.h2>

          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white rounded-xl border border-black/8 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                >
                  <span className="text-sm font-normal text-charcoal-body">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === idx ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-ash-subheading shrink-0 text-lg leading-none"
                  >
                    +
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-slate-caption leading-relaxed">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#edede8]">
        <div className="max-w-300 mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-10 sm:p-16 rounded-2xl bg-graphite-ink text-white text-center space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight font-heading">
              Start finding opportunities today.
            </h2>
            <p className="text-white/60 max-w-md mx-auto text-base">
              Free to start. 14-day trial on all paid plans. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-graphite-ink bg-white hover:bg-[#edede8] transition-all"
              >
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-sm text-white border border-white/20 hover:border-white/40 transition-all"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
