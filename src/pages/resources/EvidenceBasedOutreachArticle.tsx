import React from 'react'
import { ResourceArticleLayout } from '@/components/layout/ResourceArticleLayout'

export function EvidenceBasedOutreachArticle() {
  return (
    <ResourceArticleLayout
      title="Evidence-Based Outreach: Turning Technical Gaps into Opportunities"
      subtitle="How verified website audit findings transform generic cold prospecting into personalized, high-conversion agency conversations."
      category="AI Outreach"
      readTime="5 min read"
    >
      <p>
        Traditional cold email campaigns for agencies suffer from abysmal reply rates (&lt; 1-2%). The reason is simple: generic emails like <em>"We are an award-winning web agency and can help you revamp your website"</em> sound identical to hundreds of spam messages founders and marketing directors receive every week.
      </p>
      <p>
        <strong>Evidence-based outreach</strong> flips this dynamic. Instead of pitching your agency's services upfront, you share one verified, high-impact finding about their current digital infrastructure that is currently costing them leads or revenue.
      </p>

      <hr />

      <h2>The 3 Pillars of Evidence-Based Outreach</h2>

      <h3>1. Specificity Over Flattery</h3>
      <p>
        Don't say: <em>"I noticed your website is slow."</em><br />
        Say: <em>"I ran a diagnostic on your mobile homepage and noticed the hero video background transfers 14.8MB uncompressed, resulting in a 5.4-second mobile LCP delay on 4G connections."</em>
      </p>

      <h3>2. The Revenue Connection</h3>
      <p>
        Technical metrics matter only when connected to business consequences. If a local clinic has broken mobile tap targets on their "Book Appointment" button, that is not a CSS flaw—it is a monthly lost patient revenue leak.
      </p>

      <h3>3. Low-Friction Value Delivery</h3>
      <p>
        Do not ask for a 30-minute call in your first email. Offer a short, 90-second video walkthrough or a 1-page PDF brief diagnosing the exact fix. When prospects see immediate competence, they initiate the conversation.
      </p>

      <hr />

      <h2>High-Performing Email Frameworks</h2>

      <h3>Template A: The Core Web Vitals Revenue Leak</h3>
      <blockquote>
        <p>
          "Hi [First Name],<br /><br />
          I was researching leading [Industry] companies in [City] and came across [Company Name].<br /><br />
          While checking your mobile experience, I noticed that your mobile hero section takes 4.8s to load on standard LTE connections, primarily due to unoptimized WebP banner assets and non-deferred tracking scripts.<br /><br />
          According to Google's retail benchmarks, bringing that under 2.2s typically yields a 12-18% lift in mobile appointment submissions.<br /><br />
          I put together a 2-minute screen recording breaking down the 3 specific code adjustments needed to resolve this. Would it be helpful if I send the link over?<br /><br />
          Best,<br />
          [Your Name]"
        </p>
      </blockquote>

      <h3>Template B: The Local Schema & Rich Snippets Deficit</h3>
      <blockquote>
        <p>
          "Hi [First Name],<br /><br />
          Quick question regarding [Company Name]'s local search presence in [City].<br /><br />
          I noticed your primary service pages are missing structured <code>LocalBusiness</code> and <code>ServiceArea</code> JSON-LD schema tags, which prevents Google Maps and Rich Snippets from displaying your 4.9-star review badge in local search pack results.<br /><br />
          Your main local competitor [Competitor Name] is currently capturing those visual snippet cards.<br /><br />
          Happy to share the schema code snippet ready for your developer to paste in. Let me know if you'd like me to send it through."
        </p>
      </blockquote>

      <hr />

      <h2>Key Takeaways</h2>
      <ul>
        <li>Never pitch before demonstrating diagnostic competence.</li>
        <li>Focus on 1 or 2 high-impact issues rather than overwhelming the prospect with a 40-page PDF report.</li>
        <li>Keep initial calls to action conversational (e.g., "Mind if I share the video?" vs. "Book a demo on my Calendly").</li>
      </ul>
    </ResourceArticleLayout>
  )
}
