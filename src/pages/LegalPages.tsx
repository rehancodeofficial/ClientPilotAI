import React, { useState } from 'react'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { motion } from 'framer-motion'
import { Shield, FileText, Cookie, CheckCircle2, ChevronDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any, delay }
  })
}

function LegalHero({ icon: Icon, badge, title, subtitle, date }: {
  icon: React.ElementType
  badge: string
  title: string
  subtitle: string
  date: string
}) {
  return (
    <section className="relative py-20 sm:py-28 border-b border-black/10 overflow-hidden bg-[#edede8]">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#4cc02b]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#4cc02b]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dbdbd2] border border-black/8 text-[#5c5c5b] text-xs font-mono mb-6"
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </motion.div>
        <motion.h1
          variants={fadeUp} custom={0.05} initial="hidden" animate="visible"
          className="text-4xl sm:text-5xl lg:text-[56px] font-normal tracking-[-0.01em] text-[#141414] font-heading leading-[1.08] mb-4"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={fadeUp} custom={0.12} initial="hidden" animate="visible"
          className="text-base sm:text-lg text-[#5c5c5b] max-w-2xl leading-relaxed mb-4"
        >
          {subtitle}
        </motion.p>
        <motion.p
          variants={fadeUp} custom={0.18} initial="hidden" animate="visible"
          className="text-xs font-mono text-[#8f8f8e]"
        >
          {date}
        </motion.p>
      </div>
    </section>
  )
}

function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="rounded-2xl border border-black/8 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 sm:px-8 py-5 flex items-center justify-between gap-4 text-left"
      >
        <h2 className="text-base sm:text-lg font-medium text-[#141414] font-heading">{title}</h2>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-[#8f8f8e] shrink-0" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="px-6 sm:px-8 pb-7 space-y-4 border-t border-black/5 pt-5 text-sm text-[#5c5c5b] leading-relaxed">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

function LegalBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#4cc02b] mt-1.5 shrink-0" />
      <span>{children}</span>
    </li>
  )
}

function LegalNavLinks({ exclude }: { exclude: string }) {
  const links = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Acceptable Use', href: '/acceptable-use' },
  ].filter(l => l.href !== exclude)
  return (
    <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-white border border-black/8 text-sm text-[#292929] hover:border-[#4cc02b]/40 hover:bg-[#eaf5e7] transition-all group"
        >
          <span>{link.label}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#8f8f8e] group-hover:text-[#4cc02b] group-hover:translate-x-0.5 transition-all" />
        </Link>
      ))}
    </div>
  )
}

// Privacy Policy
export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white overflow-x-hidden">
      <PublicNavbar />
      <LegalHero
        icon={Shield}
        badge="PRIVACY POLICY"
        title="Your privacy, protected."
        subtitle="ClientPilot AI is built on the principle that your agency data, workspace intelligence, and client information belong to you — not us."
        date="Effective Date: October 1, 2026 · Last Updated: October 1, 2026"
      />
      <section className="py-16 sm:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 space-y-4">
          <AccordionSection title="1. Information We Collect">
            <p className="font-medium text-[#292929]">We may collect the following categories of information when you use ClientPilot AI:</p>
            <div className="space-y-4 pt-1">
              <div>
                <h3 className="text-xs font-mono uppercase text-[#8f8f8e] mb-2 tracking-wider">Account Information</h3>
                <ul className="space-y-1.5">
                  <LegalBullet>Name, email address, password (hashed), company name, and role when creating an account</LegalBullet>
                  <LegalBullet>Profile details you optionally add to your workspace settings</LegalBullet>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase text-[#8f8f8e] mb-2 tracking-wider">Business & Workspace Information</h3>
                <ul className="space-y-1.5">
                  <LegalBullet>Agency details, team members, and workspace configurations you set up within ClientPilot</LegalBullet>
                  <LegalBullet>Client leads, prospect lists, pipeline stages, and notes you enter into the platform</LegalBullet>
                  <LegalBullet>Target domains, business names, locations, and industries you provide for discovery or analysis</LegalBullet>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase text-[#8f8f8e] mb-2 tracking-wider">Usage Information</h3>
                <ul className="space-y-1.5">
                  <LegalBullet>Pages viewed, features used, search queries, and actions taken within the platform</LegalBullet>
                  <LegalBullet>Device type, browser type, IP address (approximate), and approximate location</LegalBullet>
                  <LegalBullet>Session duration, click patterns, and interaction metadata for product improvement purposes</LegalBullet>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase text-[#8f8f8e] mb-2 tracking-wider">Communications</h3>
                <ul className="space-y-1.5">
                  <LegalBullet>Information you provide when contacting us, requesting support, or submitting feedback</LegalBullet>
                  <LegalBullet>Correspondence history for resolving support tickets or account issues</LegalBullet>
                </ul>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection title="2. How We Use Your Information">
            <ul className="space-y-2">
              <LegalBullet>To create and maintain your account and provide access to ClientPilot AI features and services</LegalBullet>
              <LegalBullet>To process website intelligence analysis, opportunity scoring, and AI-generated recommendations</LegalBullet>
              <LegalBullet>To generate personalized outreach drafts and developer briefs based on your workspace settings</LegalBullet>
              <LegalBullet>To send product-related communications, account confirmations, security alerts, and feature updates</LegalBullet>
              <LegalBullet>To improve ClientPilot's features and build better AI models using aggregate, anonymized usage patterns</LegalBullet>
              <LegalBullet>To respond to your support requests, questions, and feedback</LegalBullet>
              <LegalBullet>To comply with applicable legal obligations and enforce our Terms of Service</LegalBullet>
            </ul>
          </AccordionSection>

          <AccordionSection title="3. AI Processing & Data Handling">
            <p>When you submit domains or business targets for website analysis, data is processed through our AI intelligence pipeline under strict data processing agreements with our AI providers.</p>
            <p><strong className="text-[#292929]">We do not:</strong></p>
            <ul className="space-y-2">
              <LegalBullet>Sell your agency's lead lists, prospect databases, or workspace telemetry to any third party</LegalBullet>
              <LegalBullet>Use your submitted targets to train AI models without explicit consent</LegalBullet>
              <LegalBullet>Share your workspace findings with other ClientPilot customers or competitors</LegalBullet>
            </ul>
            <p>ClientPilot analyzes only publicly available information. We do not access private data or scrape authenticated pages.</p>
          </AccordionSection>

          <AccordionSection title="4. Information Sharing & Disclosure">
            <p>We do not sell your personal information. We may share information only in the following limited circumstances:</p>
            <ul className="space-y-2">
              <LegalBullet><strong className="text-[#292929]">Service providers:</strong> Trusted third-party providers who assist in operating the platform under strict confidentiality agreements</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Legal requirements:</strong> If required by applicable law, regulation, or valid legal process</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Business transfers:</strong> In connection with a merger or acquisition, with advance notice provided to you</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Safety:</strong> To protect the rights, property, or safety of ClientPilot, our users, or others</LegalBullet>
            </ul>
          </AccordionSection>

          <AccordionSection title="5. Data Retention & User Rights">
            <p>We retain your data for as long as your account is active. After account deletion, personal data is removed within 30 days except where retention is required by law.</p>
            <p>You may have the following rights regarding your data:</p>
            <ul className="space-y-2">
              <LegalBullet><strong className="text-[#292929]">Access:</strong> Request a copy of the personal data we hold about you</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Rectification:</strong> Correct inaccurate or incomplete data</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Erasure:</strong> Request deletion of your account and associated personal data</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Portability:</strong> Export your workspace data in a machine-readable format</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Object:</strong> Object to certain processing activities, such as marketing communications</LegalBullet>
            </ul>
            <p>To exercise these rights, contact us at <strong className="text-[#141414]">privacy@clientpilot.ai</strong>.</p>
          </AccordionSection>

          <AccordionSection title="6. Security">
            <p>We implement industry-standard security measures including:</p>
            <ul className="space-y-2">
              <LegalBullet>Encryption of data in transit (TLS 1.2+) and at rest (AES-256)</LegalBullet>
              <LegalBullet>Secure, hashed password storage using bcrypt standards</LegalBullet>
              <LegalBullet>Role-based access controls and internal data access auditing</LegalBullet>
              <LegalBullet>Regular security reviews and vulnerability assessments</LegalBullet>
            </ul>
          </AccordionSection>

          <AccordionSection title="7. Cookies & Tracking">
            <p>ClientPilot uses cookies to operate the platform and improve your experience. See our <Link to="/cookies" className="text-[#4cc02b] hover:underline">Cookie Policy</Link> for full details and how to manage your preferences.</p>
          </AccordionSection>

          <AccordionSection title="8. International Transfers">
            <p>ClientPilot is operated from US-based servers. If you access our services internationally, your data may be transferred to the US. For EEA, UK, or Swiss users, we ensure appropriate safeguards including Standard Contractual Clauses (SCCs) where applicable.</p>
          </AccordionSection>

          <AccordionSection title="9. Children's Privacy">
            <p>ClientPilot AI is not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware such information has been provided, we will delete it promptly.</p>
          </AccordionSection>

          <AccordionSection title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. For material changes, we will notify you by email or within the platform at least 14 days before the changes take effect.</p>
          </AccordionSection>

          <AccordionSection title="11. Contact Us">
            <div className="p-5 rounded-xl bg-[#f4f4ef] border border-black/5 space-y-2 text-sm">
              <p><strong className="text-[#141414]">ClientPilot AI — Privacy Team</strong></p>
              <p>Email: <a href="mailto:privacy@clientpilot.ai" className="text-[#4cc02b] hover:underline">privacy@clientpilot.ai</a></p>
              <p>Support: <a href="mailto:support@clientpilot.ai" className="text-[#4cc02b] hover:underline">support@clientpilot.ai</a></p>
            </div>
          </AccordionSection>

          <LegalNavLinks exclude="/privacy" />
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}

// Terms of Service
export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white overflow-x-hidden">
      <PublicNavbar />
      <LegalHero
        icon={FileText}
        badge="TERMS OF SERVICE"
        title="Terms of Service"
        subtitle="By accessing or using ClientPilot AI, you agree to these Terms of Service. Please read them carefully before using our platform."
        date="Effective Date: October 1, 2026 · Last Updated: October 1, 2026"
      />
      <section className="py-16 sm:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 space-y-4">

          <AccordionSection title="1. Acceptance of Terms">
            <p>These Terms of Service constitute a legally binding agreement between you and ClientPilot AI governing your access to and use of the platform, website, APIs, and related services.</p>
            <p>By registering for an account, accessing the Service, or using any part of the platform, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, you may not use the Service.</p>
          </AccordionSection>

          <AccordionSection title="2. Account Registration & Responsibilities">
            <p>To access ClientPilot AI, you must create an account. You agree to:</p>
            <ul className="space-y-2">
              <LegalBullet>Provide accurate, current, and complete information during registration</LegalBullet>
              <LegalBullet>Maintain the security of your account credentials and immediately notify us of any unauthorized access</LegalBullet>
              <LegalBullet>Be responsible for all activities conducted under your account</LegalBullet>
              <LegalBullet>Not share your account credentials with any third party or allow others to use your account</LegalBullet>
              <LegalBullet>Keep your account information updated and accurate at all times</LegalBullet>
            </ul>
            <p>You must be at least 16 years old to create an account.</p>
          </AccordionSection>

          <AccordionSection title="3. Acceptable Use">
            <p>You agree to use ClientPilot AI only for lawful, legitimate business purposes. You agree not to:</p>
            <ul className="space-y-2">
              <LegalBullet>Use the Service to spam, harass, or send unsolicited bulk communications</LegalBullet>
              <LegalBullet>Attempt to scrape or extract data from ClientPilot beyond normal use</LegalBullet>
              <LegalBullet>Circumvent, disable, or interfere with security features of the Service</LegalBullet>
              <LegalBullet>Use the Service to build a competing product without our written consent</LegalBullet>
              <LegalBullet>Submit false, misleading, or unauthorized data to the platform</LegalBullet>
              <LegalBullet>Violate any applicable laws, regulations, or third-party rights</LegalBullet>
            </ul>
            <p>Full details are available in our <Link to="/acceptable-use" className="text-[#4cc02b] hover:underline">Acceptable Use Policy</Link>.</p>
          </AccordionSection>

          <AccordionSection title="4. Subscription Plans & Billing">
            <ul className="space-y-2">
              <LegalBullet><strong className="text-[#292929]">Free Plan:</strong> Available indefinitely with usage limits as defined on our Pricing page</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Paid Plans:</strong> Billed monthly or annually in advance; prices subject to change with 30 days notice</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Upgrades:</strong> Take effect immediately with prorated charges applied to your next billing cycle</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Downgrades:</strong> Take effect at the end of the current billing period</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Free Trials:</strong> Paid plans include a 14-day free trial; you will be charged after the trial unless you cancel</LegalBullet>
            </ul>
          </AccordionSection>

          <AccordionSection title="5. Intellectual Property">
            <p>ClientPilot AI and all associated software, algorithms, designs, and content are the exclusive property of ClientPilot AI and its licensors. You retain full ownership of data and content you create within the platform.</p>
            <p>By using the Service, you grant us a limited, non-exclusive license to process your data solely for the purpose of providing the Service to you.</p>
          </AccordionSection>

          <AccordionSection title="6. Disclaimer of Warranties">
            <p>ClientPilot AI is provided "as is" and "as available" without warranties of any kind. AI-generated recommendations and website intelligence findings are for informational purposes only and are not a guarantee of business outcomes.</p>
          </AccordionSection>

          <AccordionSection title="7. Limitation of Liability">
            <p>To the maximum extent permitted by law, ClientPilot AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total cumulative liability for any claims shall not exceed the amount you paid to us in the 12 months preceding the claim.</p>
          </AccordionSection>

          <AccordionSection title="8. Termination">
            <p>You may terminate your account at any time. We may suspend or terminate your account if we determine that you have violated these Terms. Upon termination, your access will cease and your data will be handled in accordance with our Privacy Policy.</p>
          </AccordionSection>

          <AccordionSection title="9. Changes to These Terms">
            <p>We may update these Terms from time to time. For material changes, we will notify you by email or within the platform at least 14 days before changes take effect.</p>
          </AccordionSection>

          <AccordionSection title="10. Contact">
            <div className="p-5 rounded-xl bg-[#f4f4ef] border border-black/5 space-y-2 text-sm">
              <p><strong className="text-[#141414]">ClientPilot AI — Legal</strong></p>
              <p>Email: <a href="mailto:legal@clientpilot.ai" className="text-[#4cc02b] hover:underline">legal@clientpilot.ai</a></p>
              <p>Support: <a href="mailto:support@clientpilot.ai" className="text-[#4cc02b] hover:underline">support@clientpilot.ai</a></p>
            </div>
          </AccordionSection>

          <LegalNavLinks exclude="/terms" />
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}

// Cookie Policy
export function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white overflow-x-hidden">
      <PublicNavbar />
      <LegalHero
        icon={Cookie}
        badge="COOKIE POLICY"
        title="Cookie Policy"
        subtitle="This policy explains what cookies are, which cookies ClientPilot AI uses, and how you can manage your preferences."
        date="Effective Date: October 1, 2026 · Last Updated: October 1, 2026"
      />
      <section className="py-16 sm:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 space-y-4">

          <AccordionSection title="1. What Are Cookies?">
            <p>Cookies are small text files placed on your device when you visit a website. They help websites function correctly, remember preferences, and provide information about user interactions.</p>
            <p>Cookies can be session cookies (deleted when you close your browser) or persistent cookies (remain until deleted or expired).</p>
          </AccordionSection>

          <AccordionSection title="2. Cookies We Use">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#4cc02b]" />
                  <h3 className="text-sm font-medium text-[#141414]">Essential / Strictly Necessary Cookies</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#eaf5e7] text-[#2e7d1b] border border-[#4cc02b]/20">Required</span>
                </div>
                <p>These cookies are required for the platform to function and cannot be disabled. They include session authentication tokens, CSRF protection, and workspace preference cookies.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <h3 className="text-sm font-medium text-[#141414]">Performance & Analytics Cookies</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Optional</span>
                </div>
                <p>These cookies help us understand how users interact with the platform in aggregate. They do not identify you personally and help us improve the product.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <h3 className="text-sm font-medium text-[#141414]">Preference / Functional Cookies</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Optional</span>
                </div>
                <p>These cookies remember your preferences such as UI layout, theme settings, and filter states so you don't have to reset them each visit.</p>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection title="3. Third-Party Cookies">
            <p>Some features may utilize third-party services that set their own cookies, including:</p>
            <ul className="space-y-2">
              <LegalBullet><strong className="text-[#292929]">Analytics providers</strong> for aggregated product usage analysis</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Payment processors</strong> to manage secure checkout sessions</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Customer support tools</strong> to maintain live chat continuity</LegalBullet>
            </ul>
            <p>We do not use third-party advertising or retargeting cookies on the ClientPilot platform.</p>
          </AccordionSection>

          <AccordionSection title="4. Managing Your Cookie Preferences">
            <ul className="space-y-2">
              <LegalBullet><strong className="text-[#292929]">Browser settings:</strong> Most browsers allow you to block or delete cookies. Note that disabling essential cookies may impact platform functionality</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Platform preferences:</strong> Non-essential cookies can be managed through your account settings once logged in</LegalBullet>
              <LegalBullet><strong className="text-[#292929]">Opt-out links:</strong> Where applicable, third-party analytics providers offer opt-out mechanisms through their privacy pages</LegalBullet>
            </ul>
          </AccordionSection>

          <AccordionSection title="5. Changes to This Cookie Policy">
            <p>We may update this Cookie Policy to reflect changes in technology or regulations. Material changes will be communicated by updating the "Last Updated" date and providing notice within the platform.</p>
          </AccordionSection>

          <LegalNavLinks exclude="/cookies" />
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}

// Acceptable Use Policy
export function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white overflow-x-hidden">
      <PublicNavbar />
      <LegalHero
        icon={CheckCircle2}
        badge="ACCEPTABLE USE POLICY"
        title="Acceptable Use Policy"
        subtitle="ClientPilot AI is a professional platform for ethical business discovery and digital intelligence. These rules protect all users and the integrity of our services."
        date="Effective Date: October 1, 2026 · Last Updated: October 1, 2026"
      />
      <section className="py-16 sm:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 space-y-4">

          <AccordionSection title="1. Purpose">
            <p>This Acceptable Use Policy sets out the rules governing use of the ClientPilot AI platform, API, and related services. By using our platform, you agree to comply with this policy in addition to our Terms of Service. Violations may result in immediate suspension or termination of your account.</p>
          </AccordionSection>

          <AccordionSection title="2. Permitted Uses">
            <p>ClientPilot AI is designed for the following legitimate business activities:</p>
            <ul className="space-y-2">
              <LegalBullet>Discovering small and medium-sized businesses that may benefit from digital services your agency provides</LegalBullet>
              <LegalBullet>Analyzing publicly available website data and digital signals to identify genuine service opportunities</LegalBullet>
              <LegalBullet>Generating personalized, evidence-backed outreach communications for lawful cold outreach</LegalBullet>
              <LegalBullet>Creating developer technical briefs and proposals for agency-client engagements</LegalBullet>
              <LegalBullet>Managing a sales pipeline of discovered business opportunities within your team workspace</LegalBullet>
              <LegalBullet>Accessing the platform API for authorized automation within your subscription limits</LegalBullet>
            </ul>
          </AccordionSection>

          <AccordionSection title="3. Prohibited Uses">
            <div className="space-y-5 pt-1">
              <div>
                <h3 className="text-xs font-mono uppercase text-[#8f8f8e] mb-2 tracking-wider">Spam & Harassment</h3>
                <ul className="space-y-1.5">
                  <LegalBullet>Sending unsolicited bulk email campaigns using ClientPilot-generated content at abusive volumes</LegalBullet>
                  <LegalBullet>Repeatedly contacting individuals who have clearly declined further communication</LegalBullet>
                  <LegalBullet>Using ClientPilot to facilitate phishing, scamming, or deceptive impersonation</LegalBullet>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase text-[#8f8f8e] mb-2 tracking-wider">Unauthorized Scraping & Crawling</h3>
                <ul className="space-y-1.5">
                  <LegalBullet>Attempting to scrape or extract data from the ClientPilot platform beyond permitted API usage</LegalBullet>
                  <LegalBullet>Using automated bots to circumvent rate limits or platform access controls</LegalBullet>
                  <LegalBullet>Reverse-engineering the platform's intelligence algorithms or AI models</LegalBullet>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase text-[#8f8f8e] mb-2 tracking-wider">Security Violations</h3>
                <ul className="space-y-1.5">
                  <LegalBullet>Attempting to gain unauthorized access to other users' accounts or data</LegalBullet>
                  <LegalBullet>Introducing malware, viruses, or malicious code into the platform</LegalBullet>
                  <LegalBullet>Conducting security scanning or denial-of-service attacks without written authorization</LegalBullet>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase text-[#8f8f8e] mb-2 tracking-wider">Legal & Ethical Violations</h3>
                <ul className="space-y-1.5">
                  <LegalBullet>Violating applicable laws including CAN-SPAM, GDPR, CCPA, or other anti-spam and privacy regulations</LegalBullet>
                  <LegalBullet>Using ClientPilot to target protected classes or engage in discriminatory outreach</LegalBullet>
                  <LegalBullet>Reselling or sublicensing access to the platform without written consent from ClientPilot AI</LegalBullet>
                </ul>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection title="4. Outreach Standards">
            <p>When using the platform's outreach features, you agree to:</p>
            <ul className="space-y-2">
              <LegalBullet>Represent your agency and services truthfully and accurately in all outreach communications</LegalBullet>
              <LegalBullet>Honor opt-out and unsubscribe requests promptly and without exception</LegalBullet>
              <LegalBullet>Not falsely attribute AI-generated findings to human-authored research without disclosure</LegalBullet>
              <LegalBullet>Comply with applicable laws governing commercial electronic messaging in your jurisdiction</LegalBullet>
            </ul>
          </AccordionSection>

          <AccordionSection title="5. API Usage Limits">
            <p>You agree not to exceed your plan's API call limits or use the API to build services that directly compete with ClientPilot without written agreement. API responses may not be redistributed to third parties outside your agency workspace.</p>
          </AccordionSection>

          <AccordionSection title="6. Enforcement">
            <p>In the event of a violation, we may:</p>
            <ul className="space-y-2">
              <LegalBullet>Issue a warning and request correction of the behavior</LegalBullet>
              <LegalBullet>Temporarily suspend your account pending investigation</LegalBullet>
              <LegalBullet>Permanently terminate your account without refund for serious or repeated violations</LegalBullet>
              <LegalBullet>Report violations to relevant authorities where required by law</LegalBullet>
            </ul>
          </AccordionSection>

          <AccordionSection title="7. Reporting Violations">
            <p>If you become aware of any usage that violates this policy, please report it to <a href="mailto:abuse@clientpilot.ai" className="text-[#4cc02b] hover:underline">abuse@clientpilot.ai</a>. We take all reports seriously and investigate promptly.</p>
          </AccordionSection>

          <LegalNavLinks exclude="/acceptable-use" />
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}
