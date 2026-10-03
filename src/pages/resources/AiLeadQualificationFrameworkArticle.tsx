import React from 'react'
import { ResourceArticleLayout } from '@/components/layout/ResourceArticleLayout'

export function AiLeadQualificationFrameworkArticle() {
  return (
    <ResourceArticleLayout
      title="AI Lead Qualification & Decision-Maker Reachability Framework"
      category="Agency Playbooks"
      readTime="6 min read"
    >
      <p className="text-lg text-[#5c5c5b] italic mb-8">
        How automated intelligence scoring separates vanity prospect lists from high-converting, decision-maker-accessible opportunities.
      </p>

      <p>
        In modern agency growth operations, time is the single most constrained resource. Spending 30 minutes crafting bespoke video pitches for companies with non-responsive gatekeepers or negligible marketing budgets rapidly leads to pipeline fatigue.
      </p>
      <p>
        The solution is an automated, multi-tiered qualification engine that scores both <strong>opportunity intent</strong> (the severity of digital shortcomings) and <strong>reachability</strong> (the availability of direct decision-maker communication channels).
      </p>

      <hr />

      <h2>The Dual-Vector Qualification Matrix</h2>

      <h3>Vector 1: Commercial Opportunity Score (0 - 100)</h3>
      <p>
        Measures the financial justification for an engagement based on visible business health and technical necessity:
      </p>
      <ul>
        <li><strong>Commercial Activity Indicators:</strong> Active job postings for marketing/sales roles, recent press announcements, verified high review volume.</li>
        <li><strong>Digital Modernity Deficit:</strong> Non-responsive templates, sub-standard mobile performance, lack of modern booking widgets.</li>
        <li><strong>Estimated Budget Capacity:</strong> Employee headcount, physical footprint/locations, estimated annual turnover.</li>
      </ul>

      <hr />

      <h3>Vector 2: Decision-Maker Reachability Index (0 - 100)</h3>
      <p>
        Evaluates the friction involved in reaching an actual economic decision-maker (Managing Partner, Founder, CMO, VP Growth):
      </p>
      <ul>
        <li><strong>Executive Email Deliverability:</strong> Verified MX record routing, catch-all status, and SMTP inbox validation.</li>
        <li><strong>LinkedIn Leadership Footprint:</strong> Active posting frequency of C-suite executives within the last 30 days.</li>
        <li><strong>Direct Contact Line Availability:</strong> Direct executive extension or direct SMS vs. generic reception desk IVR routing.</li>
      </ul>

      <hr />

      <h2>Tiered Action Framework</h2>
      <ul>
        <li><strong>Tier 1 (High Opportunity + High Reachability):</strong> Immediate bespoke multi-channel sequence (personalized Loom audit + LinkedIn connection + phone follow-up).</li>
        <li><strong>Tier 2 (High Opportunity + Medium Reachability):</strong> Semi-automated evidence-based email sequence leading with specific diagnostic brief.</li>
        <li><strong>Tier 3 (Low Opportunity or Low Reachability):</strong> Archive or queue for batch programmatic retargeting.</li>
      </ul>

      <blockquote>
        <p>
          "When you qualify leads across both need and reachability before drafting a single word of outreach, your agency's closing velocity doubles while sales burnout plummets."
        </p>
      </blockquote>
    </ResourceArticleLayout>
  )
}
