import React from 'react'
import { ResourceArticleLayout } from '@/components/layout/ResourceArticleLayout'

export function AgencyProspectingPlaybookArticle() {
  return (
    <ResourceArticleLayout
      title="The Agency Prospecting Playbook"
      subtitle="How modern agencies can discover better opportunities without relying on generic prospect lists."
      category="Agency Playbooks"
      readTime="8 min read"
    >

      <p>Finding potential clients is easy.</p>
      <p>Finding <strong>businesses that actually have a reason to talk to your agency</strong> is much harder.</p>
      <p>A traditional prospecting workflow usually starts with a list: company name, email address, phone number, industry, and location. The sales team then works through that list hoping that some businesses happen to need what the agency offers.</p>
      <p>ClientPilot approaches the problem differently.</p>
      <p>Instead of starting with a contact list, start with the <strong>business opportunity</strong>.</p>
      <p>The goal is to identify businesses where there is visible evidence that digital work could create value, understand what that opportunity looks like, and only then decide whether the business is worth approaching.</p>

      <hr />

      <h2>1. Start with the business, not the contact</h2>
      <p>A lead is more than a person's name and email address.</p>
      <p>A useful prospect profile should answer:</p>
      <ul>
        <li>What does the business do?</li>
        <li>Where does it operate?</li>
        <li>Who does it serve?</li>
        <li>What digital assets does it have?</li>
        <li>How strong is its website?</li>
        <li>Is the website mobile-friendly?</li>
        <li>Does it appear technically healthy?</li>
        <li>Is local search information complete?</li>
        <li>Are there obvious conversion problems?</li>
        <li>Are there missing trust signals?</li>
        <li>Does the business appear commercially relevant to your agency?</li>
      </ul>
      <p>This changes prospecting from:</p>
      <blockquote><p>"Who can I email?"</p></blockquote>
      <p>to:</p>
      <blockquote><p>"Which businesses have an identifiable problem that my agency can solve?"</p></blockquote>
      <p>That distinction matters.</p>

      <hr />

      <h2>2. Define your ideal opportunity</h2>
      <p>Before collecting leads, define what a useful opportunity looks like.</p>
      <p>For a web development agency, signals might include:</p>
      <ul>
        <li>Outdated website technology</li>
        <li>Poor mobile experience</li>
        <li>Slow page performance</li>
        <li>Broken or missing navigation</li>
        <li>Weak conversion paths</li>
        <li>Missing calls to action</li>
        <li>Poor content structure</li>
        <li>Broken links</li>
        <li>Inconsistent branding</li>
        <li>Missing accessibility considerations</li>
      </ul>
      <p>For an SEO agency:</p>
      <ul>
        <li>Weak page titles</li>
        <li>Poor heading structure</li>
        <li>Missing structured data</li>
        <li>Weak local signals</li>
        <li>Thin service pages</li>
        <li>Missing location pages</li>
        <li>Indexation problems</li>
        <li>Poor internal linking</li>
        <li>Weak search intent alignment</li>
      </ul>
      <p>For a design agency:</p>
      <ul>
        <li>Inconsistent visual identity</li>
        <li>Weak hierarchy</li>
        <li>Poor typography</li>
        <li>Outdated layouts</li>
        <li>Unclear messaging</li>
        <li>Low-quality visual assets</li>
        <li>Inconsistent components</li>
      </ul>
      <p>The important principle is simple:</p>
      <p><strong>Your opportunity definition should match the service you actually sell.</strong></p>

      <hr />

      <h2>3. Discover businesses systematically</h2>
      <p>A prospecting system can combine multiple discovery sources:</p>
      <ul>
        <li>Geographic searches</li>
        <li>Industry directories</li>
        <li>Business listings</li>
        <li>Public websites</li>
        <li>Search results</li>
        <li>Existing CRM data</li>
        <li>Imported lead lists</li>
        <li>Referral databases</li>
        <li>Manually selected companies</li>
      </ul>
      <p>The discovery stage should produce candidates—not automatically classify every candidate as a qualified lead.</p>
      <p>That distinction keeps your pipeline clean.</p>

      <hr />

      <h2>4. Verify before analyzing</h2>
      <p>A discovered business should pass a basic verification layer.</p>

      <h3>Business identity</h3>
      <p>Confirm:</p>
      <ul>
        <li>Business name</li>
        <li>Website</li>
        <li>Location</li>
        <li>Industry</li>
        <li>Contact information where available</li>
      </ul>

      <h3>Website availability</h3>
      <p>Determine whether:</p>
      <ul>
        <li>The domain resolves</li>
        <li>The site is reachable</li>
        <li>HTTPS is enabled</li>
        <li>The primary pages load</li>
        <li>Redirects behave normally</li>
      </ul>

      <h3>Business relevance</h3>
      <p>Determine whether the business actually matches your agency's target market.</p>
      <p>There is little value in spending expensive analysis resources on a company outside your service area or target segment.</p>

      <hr />

      <h2>5. Audit the digital presence</h2>
      <p>Once a business passes basic verification, analyze its digital identity.</p>
      <p>A useful audit can cover five layers.</p>

      <h3>Layer 1 — Performance</h3>
      <p>Look for:</p>
      <ul>
        <li>Slow-loading pages</li>
        <li>Large images</li>
        <li>Excessive JavaScript</li>
        <li>Render-blocking resources</li>
        <li>Poor interaction responsiveness</li>
        <li>Layout instability</li>
      </ul>
      <p>Core Web Vitals are designed to measure important aspects of real-world user experience, and web.dev recommends treating performance as part of building a high-quality web experience rather than chasing a single score.</p>

      <h3>Layer 2 — Technical health</h3>
      <p>Check:</p>
      <ul>
        <li>HTTP status codes</li>
        <li>HTTPS</li>
        <li>Redirects</li>
        <li>Canonical URLs</li>
        <li>Sitemap availability</li>
        <li>Robots directives</li>
        <li>Broken links</li>
        <li>Duplicate pages</li>
        <li>Metadata</li>
      </ul>

      <h3>Layer 3 — Search visibility</h3>
      <p>Review:</p>
      <ul>
        <li>Page titles</li>
        <li>Meta descriptions</li>
        <li>Headings</li>
        <li>Internal links</li>
        <li>Search intent</li>
        <li>Local information</li>
        <li>Structured data</li>
        <li>Indexability</li>
      </ul>
      <p>Google recommends following its Search Essentials and SEO guidance rather than treating any single technical metric as a guarantee of search performance.</p>

      <h3>Layer 4 — Conversion experience</h3>
      <p>Ask:</p>
      <ul>
        <li>Is the primary service obvious?</li>
        <li>Is the next action obvious?</li>
        <li>Can visitors quickly understand the value proposition?</li>
        <li>Are contact options easy to find?</li>
        <li>Is the mobile experience usable?</li>
        <li>Are trust signals visible?</li>
        <li>Are forms unnecessarily difficult?</li>
      </ul>

      <h3>Layer 5 — Accessibility</h3>
      <p>Check:</p>
      <ul>
        <li>Keyboard navigation</li>
        <li>Text alternatives</li>
        <li>Form labels</li>
        <li>Focus states</li>
        <li>Color contrast</li>
        <li>Heading structure</li>
        <li>Error handling</li>
        <li>Interactive controls</li>
      </ul>
      <p>WCAG 2.2 organizes accessibility around four principles: perceivable, operable, understandable, and robust.</p>

      <hr />

      <h2>6. Turn findings into opportunities</h2>
      <p>Not every problem deserves a sales email.</p>
      <p>A useful opportunity should connect:</p>
      <p><strong>Evidence → Business impact → Potential solution</strong></p>

      <h4>Evidence</h4>
      <p>The mobile navigation makes key service pages difficult to reach.</p>

      <h4>Potential impact</h4>
      <p>Visitors may struggle to discover important services or contact the business.</p>

      <h4>Potential solution</h4>
      <p>Redesign the mobile navigation and simplify the conversion path.</p>

      <p>That is much stronger than:</p>
      <blockquote><p>"Your website needs improvement."</p></blockquote>
      <p>Specificity creates relevance.</p>

      <hr />

      <h2>7. Prioritize opportunities</h2>
      <p>A practical opportunity score can consider:</p>

      <h3>Severity</h3>
      <p>How significant is the issue?</p>

      <h3>Business relevance</h3>
      <p>Does it affect something commercially important?</p>

      <h3>Visibility</h3>
      <p>Can the problem be clearly demonstrated?</p>

      <h3>Service fit</h3>
      <p>Does it match what your agency sells?</p>

      <h3>Effort</h3>
      <p>Can your team realistically solve it?</p>

      <p>A simple internal model could be:</p>
      <p><strong>Opportunity Priority = Impact × Evidence × Service Fit</strong></p>
      <p>The exact formula is less important than having a consistent process.</p>

      <hr />

      <h2>8. Build evidence before outreach</h2>
      <p>The strongest outreach usually contains something concrete.</p>
      <p>Instead of:</p>
      <blockquote><p>"We help businesses improve their websites."</p></blockquote>
      <p>Try:</p>
      <blockquote><p>"I noticed your primary service page is difficult to reach from mobile navigation. I also found that the page doesn't clearly guide visitors toward the next action. We mapped a simpler conversion path that could be worth testing."</p></blockquote>
      <p>The second message demonstrates that someone actually looked.</p>

      <hr />

      <h2>9. Qualify before sending</h2>
      <p>Before contacting a business, ask:</p>
      <ul>
        <li>Is this the right industry?</li>
        <li>Is the business inside our target market?</li>
        <li>Is there a meaningful opportunity?</li>
        <li>Can we prove the issue?</li>
        <li>Does our service solve it?</li>
        <li>Is the likely project commercially reasonable?</li>
        <li>Can we identify an appropriate decision-maker?</li>
        <li>Is outreach legally and operationally appropriate?</li>
      </ul>
      <p>If several answers are "no," move the lead down the priority list.</p>

      <hr />

      <h2>10. Personalization should come from evidence</h2>
      <p>Good personalization is not inserting a company name into a template.</p>
      <p>It is explaining <strong>why this particular business is relevant</strong>.</p>
      <p>Useful personalization can reference:</p>
      <ul>
        <li>A specific page</li>
        <li>A visible technical issue</li>
        <li>A service offering</li>
        <li>A local opportunity</li>
        <li>A conversion path</li>
        <li>A product experience</li>
        <li>A content gap</li>
      </ul>
      <p>The objective is not to make an email look personalized.</p>
      <p>The objective is to make the recipient understand:</p>
      <p><strong>"They actually looked at my business."</strong></p>

      <hr />

      <h2>11. Know when not to send</h2>
      <p>A mature prospecting system should also produce a <strong>do-not-contact</strong> decision.</p>
      <p>Avoid outreach when:</p>
      <ul>
        <li>The business is clearly outside the target market.</li>
        <li>The evidence is weak.</li>
        <li>The issue is insignificant.</li>
        <li>The business already has a solution that fits the need.</li>
        <li>Contact information is inappropriate or unreliable.</li>
        <li>The intended communication would violate applicable requirements.</li>
        <li>The opportunity cannot be explained honestly.</li>
      </ul>
      <p>More leads are not automatically better.</p>
      <p>Better opportunities are.</p>

      <hr />

      <h2>12. Turn sales intelligence into delivery intelligence</h2>
      <p>The best prospecting systems should not stop at outreach.</p>
      <p>A useful opportunity record can eventually become:</p>
      <p><strong>Discovery → Audit → Opportunity → Outreach → Conversation → Proposal → Project → Developer Handoff → QA</strong></p>
      <p>This creates continuity between sales and delivery.</p>
      <p>The developer does not need to rediscover the problem.</p>
      <p>The project team receives:</p>
      <ul>
        <li>Evidence</li>
        <li>URLs</li>
        <li>Screenshots</li>
        <li>Problem description</li>
        <li>Business context</li>
        <li>Recommended solution</li>
        <li>Priority</li>
        <li>Acceptance criteria</li>
      </ul>
      <p>That is where prospecting becomes part of the agency operating system.</p>

      <hr />

      <h2>Final takeaway</h2>
      <p>Modern agency prospecting does not need to begin with a giant spreadsheet.</p>
      <p>It can begin with a better question:</p>
      <p><strong>Which businesses have a real, observable opportunity that our agency is equipped to solve?</strong></p>
      <p>Discover businesses. Understand their digital presence. Find meaningful gaps. Capture evidence. Qualify the opportunity. Start a relevant conversation. Then turn the opportunity into delivery-ready work.</p>
      <p>That is the foundation of evidence-based prospecting.</p>
      <p><strong>ClientPilot helps agencies move from lead lists to opportunity intelligence.</strong></p>
    </ResourceArticleLayout>
  )
}
