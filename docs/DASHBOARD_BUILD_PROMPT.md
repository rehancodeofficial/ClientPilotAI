# Build prompt — four role dashboards (Upwork-inspired)

Paste the **Shared context** section plus **one** dashboard section per task. Don't
paste all four at once; each is a session's worth of work and they share plumbing
that should be built once (see *Build order*).

---

## Shared context — include this every time

You are working in `ClientPilotAI`, a B2B client-acquisition platform. Agencies and
freelancers discover local businesses via OpenStreetMap, audit their digital
presence, score the opportunity with AI, then generate outreach and proposals.

**Stack:** React 19 + TypeScript + Vite 8, Tailwind CSS v4, Zustand 5, Recharts 3,
Framer Motion 12, `@dnd-kit`, Leaflet 1.9, lucide-react. Backend is Express 5 +
TypeScript on Supabase (Postgres + RLS + Auth). React Router v7.

**Where things live:**
- Pages: `src/pages/*.tsx`, routed in `src/App.tsx` under `/app/*`
- Layout: `src/components/layout/` — `AppShell`, `Sidebar`, `TopBar`, `AuthGuard`
- UI kit: `src/components/ui/index.tsx`
- API layer: `src/api/*.ts` — all calls go through `src/api/client.ts`
- Store: `src/store/useAppStore.ts`
- Backend routes: `backend/src/routes/*.ts`, mounted in `backend/src/app.ts`
- Migrations: `supabase/migrations/` — add new ones, never edit applied ones

### Design system — use these, do not invent new ones

The UI is **claymorphic**: soft, layered, rounded, with inset and raised shadow
depth rather than hard borders.

Utility classes (defined in `src/index.css`):
`clay-raised`, `clay-inset`, `clay-floating`, `clay-btn-primary`, `clay-row`,
`clay-skeleton`

Colour tokens — **always** reference these, never hex literals:
`--text-primary`, `--text-secondary`, `--text-muted`, `--bg`, `--surface`,
`--surface-raised`, `--surface-elevated`, `--surface-hover`, `--border`,
`--border-subtle`, `--primary`, `--primary-hover`, `--primary-soft`, `--accent`,
`--success`, `--warning`, `--danger`, `--info`

This project uses Tailwind v4's parenthesis syntax for custom properties:
`text-(--text-primary)`, `bg-(--surface)`, `border-(--border)`. Match that.

Components available from `@/components/ui`:
`Avatar, Badge, Button, Card, CardContent, CardDescription, CardFooter,
CardHeader, CardTitle, Input, Label, Progress, Select, Separator, Sheet,
Skeleton, Slider, Tabs, Textarea, Tooltip`

Charts: Recharts. Follow the existing palette conventions in
`src/pages/MarketIntelligencePage.tsx`. Icons: lucide-react.

Light and dark mode both work via `next-themes` — verify both.

### Hard constraints

1. **No invented data. Ever.** Every number, label and chart series must trace to
   a real column in the schema below. If a widget needs data that does not exist,
   either add a migration for it or leave the widget out — do not fill it with a
   plausible-looking placeholder. This codebase previously shipped a 1,064-line
   mock dataset and a fabricated stats bar; both were removed deliberately.
   There is **no revenue, deal-value, invoice or earnings data** in the schema, so
   an "earnings" widget cannot be built without first adding that column.

2. **No silent fallbacks.** On a failed request, render an error state. Never
   substitute sample data. `src/api/client.ts` throws `ApiError` — let it.

3. **Real empty states.** A new workspace has zero leads. Every list, chart and
   stat needs a designed empty state that tells the user the next action
   ("No leads yet — run a discovery scan"), not a zero or a blank panel.

4. **Loading and error states for every async panel.** Use `Skeleton`.

5. **Responsive to 375px.** Sidebar collapses, tables become cards, no horizontal
   page scroll.

6. **Accessibility.** Keyboard-reachable controls, real `<button>`/`<a>` elements
   (the old Profile page used non-interactive `div`s as toggles — don't), labelled
   form fields, and chart data also available as text or a table.

### Role and plan model — read carefully

`profiles.role` is one of `'admin' | 'user' | 'client'` (constrained in migration
`00017`). **Agency and freelancer are not roles.** They are the same product
differing by `workspaces.plan`, which is one of
`'free' | 'starter' | 'agency' | 'pro' | 'enterprise'`.

- **Freelancer** = a single-seat workspace (`free` / `starter`). Seat limit 1.
- **Agency** = a multi-seat workspace (`agency` = 5, `pro` = 25, `enterprise` =
  unlimited). `public.workspace_seat_limit(workspace_id)` returns the limit.
- **Admin** = `role = 'admin'`. Platform operator, sees across all workspaces.
- **Client** = `role = 'client'`. An **external** party — the agency's own
  customer. See the security boundary below.

So the Agency and Freelancer dashboards are **one adaptive dashboard**, not two
codebases. Build a single page that reveals team features when
`seatLimit > 1`. Do not duplicate it.

### 🔒 The client security boundary — the most important rule here

A client is external. They may see **only** the audit findings and the proposal
for **their own business**, via a grant row in `client_portal_access`
(`user_id`, `lead_id`, `revoked_at IS NULL`).

A client must **never** see:
- the opportunity score, confidence score, or any `lead_scores` /
  `opportunity_analysis` row — that is your private assessment *of them*
- any `outreach_messages` row, or `leads.outreach_subject` / `leads.outreach_body`
  — that is your sales pitch *to them*
- `pipeline_stages` — your sales funnel position for them
- `competitor_analysis`, `outcome_events`
- any other lead, client, or workspace

Client profiles carry `workspace_id IS NULL`, so every workspace-scoped RLS
policy denies them by default. **This is deliberate** — the failure mode of a
forgotten policy is "client sees nothing" rather than "client sees everything".

Consequently: clients hold **no RLS policy on the business tables**, and the
client dashboard must be served exclusively by backend endpoints
(`/api/portal/*`) that authorise against `client_portal_access` and return an
**explicit allowlist of safe columns**. RLS filters rows, not columns, and a
single `leads` row contains the outreach draft and internal score for that very
client. Never `select *` on `leads` for a client. Never pass a lead id from the
client and trust it — always re-check the grant.

---

## Data inventory — what actually exists

14 tables. Columns you will actually use:

| Table | Useful columns |
|---|---|
| `workspaces` | `id, name, owner_id, plan, settings, created_at` |
| `profiles` | `id, workspace_id, full_name, email, role, avatar_url, timezone, created_at` |
| `leads` | `id, workspace_id, business_name, category, address, city, lat, lng, phone, has_website, website_url, contact_email, contact_phone, contact_source, contact_confidence, outreach_status, outreach_sent_at, proposal_status, created_at` (35 cols total) |
| `lead_scores` | `overall_score, digital_presence_gap, category_fit, review_activity, market_density, competitor_presence, ai_reasoning, model_used, created_at` |
| `business_audits` | `website_exists, https_enabled, mobile_indicator, booking_detected, ordering_detected, contact_form_detected, social_presence_detected, digital_maturity_level, audit_score, evidence (jsonb), created_at` |
| `opportunity_analysis` | `opportunity_score, confidence_score, current_maturity_level, target_maturity_level, maturity_gap, primary_opportunity, recommended_services (jsonb), estimated_complexity, estimated_duration, estimated_project_range, reasoning (jsonb), evidence (jsonb)` |
| `proposals` | `id, lead_id, workspace_id, title, content (markdown), status, created_at, updated_at` |
| `pipeline_stages` | `lead_id, workspace_id, stage, changed_at, changed_by` — append-only history; current stage is the latest row per lead |
| `outreach_messages` | `lead_id, subject, content, status, variant, created_at` |
| `outcome_events` | `lead_id, event_type, event_date, source, notes` |
| `competitor_analysis` | `lead_id, competitor_data (jsonb), competitive_gap (jsonb)` |
| `notifications` | `id, workspace_id, user_id, lead_id, type, title, message, read, created_at` |
| `client_portal_access` | `workspace_id, user_id, lead_id, invited_by, created_at, revoked_at` |
| `geocoding_cache` | internal; ignore |

Pipeline stages: `discovery → qualified → contacted → client`.
Proposal statuses: `draft → submitted → reviewed → replied → accepted → rejected`.
The audit's 7 signals each hold `'detected' | 'not_detected' | 'unknown'`.

**Existing endpoints:** `GET/POST /api/leads`, `GET /api/leads/:id`,
`POST /api/leads/discover`, `PATCH /api/leads/:id/stage`,
`GET/POST /api/proposals`, `PATCH /api/proposals/:id/status`,
`GET /api/audits/:leadId`, `GET /api/opportunities/:leadId`,
`GET /api/opportunities/zones`, `GET /api/competitors/:leadId`,
`GET /api/outcomes/timeline`, `GET /api/intelligence/market|evaluation|dashboard`,
`GET /api/analytics/overview`, `GET /api/admin/users`,
`GET/PATCH /api/profile`, `GET /api/workspace`, `GET /api/workspace/members`.

Endpoints that do **not** exist yet and must be built are listed per dashboard.

### Build order

1. `/api/portal/*` + `client_portal_access` invite flow (blocks the Client dashboard)
2. Shared dashboard primitives: `StatTile`, `TrendSparkline`, `EmptyState`,
   `ScoreBadge`, `SignalChip`, `ActivityFeedItem` — build once in
   `src/components/dashboard/`, reuse in all four
3. Agency/Freelancer adaptive dashboard
4. Admin dashboard
5. Client dashboard

---

## 1. Admin Dashboard — `/app/admin`

**Persona:** you, operating the platform. Not an agency user. Replaces the
existing `AdminDashboardPage.tsx`.

**Upwork parallel:** Upwork's internal trust-and-ops view — tenant health, usage,
abuse signals, not a sales funnel.

**Build:**
- **Platform stat strip:** total workspaces, total users, workspaces active in
  last 7d (a workspace with a lead or proposal created in that window), total
  leads discovered, total proposals, AI calls today. Each must be a real count.
- **Plan distribution:** donut of `workspaces.plan`, with seat utilisation per
  plan (`profiles` count vs `workspace_seat_limit`). Flags workspaces over their
  seat limit — a real condition worth surfacing.
- **Growth chart:** signups and workspace creation per week from
  `profiles.created_at` / `workspaces.created_at`. Area chart, 12 weeks.
- **Workspace table:** name, plan, seats used/limit, lead count, proposal count,
  last activity, owner email. Sortable, searchable, paginated server-side.
  Row click → a workspace detail drawer.
- **User management:** the existing role change (`PATCH /api/admin/users/:id/role`)
  plus search by email and filter by role. Guard against an admin demoting
  themselves — that is how you lock yourself out.
- **AI usage and cost:** per-workspace AI call counts and token spend. **Requires
  a new `ai_usage_events` table** (`workspace_id, route, model, prompt_tokens,
  completion_tokens, latency_ms, created_at`) — write the migration, log from
  `backend/src/services/openai.ts`. Without it, omit this panel; do not estimate.
- **System health:** poll `/health/ready`; show database connectivity, whether an
  AI provider key is configured, whether an email provider is configured. The env
  layer (`backend/src/lib/env.ts`) already exposes `hasAnyAiKey` and
  `hasEmailProvider` — surface them via a new `GET /api/admin/system`. Report
  booleans only, never key values.

**New endpoints:** `GET /api/admin/overview`, `GET /api/admin/workspaces`
(paginated), `GET /api/admin/workspaces/:id`, `GET /api/admin/system`.
All behind `adminMiddleware`.

**Must not:** expose any API key, secret, or raw token; allow an admin to read a
workspace's outreach drafts or proposal bodies without an explicit, logged
reason — aggregate counts are the default, content is not.

---

## 2 & 3. Agency + Freelancer Dashboard — `/app` (one adaptive page)

**Persona:** your paying customer. Replaces/absorbs `ClayDashboardPage.tsx` and
`DashboardPage.tsx` (there are currently two competing dashboards — consolidate
to one and delete the other).

**Upwork parallel — the freelancer "Find work" home.** This is the closest and
most useful analogy, and it maps almost one-to-one:

| Upwork | ClientPilot |
|---|---|
| "Best matches" job feed with relevance | Discovered leads ranked by `opportunity_score` |
| Job card: budget, skills, client history | Lead card: category, maturity gap, missing signals, contact confidence |
| Saved jobs | Leads at `qualified` stage |
| Proposals sent, with status | `proposals` by `status` |
| Active contracts | Leads at `client` stage |
| Profile completeness nudge | Workspace setup completeness (see below) |
| Connects balance | Plan quota remaining (once Phase 6 metering exists) |

**Build:**

- **Top stat strip (4 tiles):** leads discovered, qualified, contacted,
  won (`client` stage). Each with a 30-day sparkline from `leads.created_at` /
  `pipeline_stages.changed_at`. Clicking a tile filters the pipeline below.

- **"Best opportunities" feed — the centrepiece.** Mirror Upwork's job feed:
  a vertical list of rich cards, newest-and-highest-scoring first. Each card:
  business name, category, city, a prominent `ScoreBadge` (0–100 with the
  high/moderate/low band colouring already used in the codebase), the top two or
  three *missing* audit signals as `SignalChip`s ("No website", "No HTTPS",
  "No online booking"), `primary_opportunity` from `opportunity_analysis`, the
  `estimated_project_range`, and a contact-confidence indicator. Primary action
  "Prepare lead", secondary "View details" (opens the existing
  `LeadDetailPanel`). Infinite scroll or "Load more", not pagination.
  Filters along the top: score band, category, city, has-website, stage.
  Sort: score, newest, maturity gap.

- **Pipeline snapshot:** a compact four-column read-only view of the Kanban with
  counts and the top three leads per stage; "Open pipeline" links to
  `/app/pipeline`. Do not rebuild drag-and-drop here.

- **Proposal status board:** counts per proposal status with the accepted rate.
  Include `submitted → replied` conversion, which is genuinely actionable.

- **Activity feed:** merge `outcome_events`, `pipeline_stages` changes,
  `outreach_messages` sends and `proposals` status changes into one reverse-chron
  timeline, each row linking to its lead. Needs a new
  `GET /api/activity?limit=&before=` that unions those sources server-side —
  do not fetch four lists and merge in the browser.

- **Setup completeness card (Upwork's profile-completeness pattern):** a
  `Progress` bar over real conditions — has run a discovery scan, has enriched a
  lead, has generated outreach, has sent outreach, has created a proposal, has
  invited a teammate (multi-seat only). Each incomplete item is a link to the
  action. This is the single best onboarding lever on the page.

- **Market mini-map:** reuse the Leaflet setup from `LeadDiscoveryPage.tsx`,
  showing the current workspace's leads as score-coloured markers. Lazy-load it;
  Leaflet is heavy and the bundle is already 1.6 MB.

**Plan-adaptive behaviour — the only difference between freelancer and agency:**
- `seatLimit === 1` (freelancer): hide all team UI entirely. Do not show a
  disabled "Invite teammate" button — show nothing, and surface the upgrade path
  only in the setup card.
- `seatLimit > 1` (agency): add a **Team panel** — members from
  `GET /api/workspace/members` with seats used/limit, each member's leads touched
  and proposals created in the last 30 days, and an invite control. Add an
  "assigned to" filter on the opportunity feed. Assignment **requires a new
  `leads.assigned_to` column** (uuid → `profiles.id`) — write the migration.
- Gate on `workspaces.plan` fetched from `GET /api/workspace`, never on anything
  client-supplied.

**New endpoints:** `GET /api/dashboard/summary` (stat strip + sparklines in one
round trip), `GET /api/activity`, `GET /api/leads?sort=&filter=&cursor=`
(server-side sort/filter/paginate — the current `GET /api/leads` returns the
entire workspace and will not scale past a few hundred leads),
`POST /api/workspace/invite`.

**Watch out:** `GET /api/leads` currently also pulls the **whole**
`pipeline_stages` history for the workspace on every call and de-duplicates in
JavaScript. Do not build the feed on top of that. Add a server-side current-stage
resolution (a lateral join on the latest `changed_at`, which
`idx_pipeline_stages_workspace_lead_changed` now supports).

---

## 4. Client Dashboard — `/portal`

**Persona:** the agency's customer. A local business owner, non-technical,
arriving from an invite link. Probably on a phone.

**Route it outside `/app`** — `/portal`, with its own guard and its own minimal
shell. Do **not** reuse `AppShell` or `Sidebar`: they contain navigation to lead
discovery and the pipeline, which a client must never see.

**Upwork parallel — the client-side proposal view.** An Upwork client sees the
proposals submitted to them, the freelancer's reasoning, and can accept, message
or decline. Same shape here: the agency has audited the client's business and
proposed work; the client reviews the evidence and responds.

**Build:**
- **Header:** their own business name (`leads.business_name`) and the agency's
  name (`workspaces.name`). Nothing else.
- **"Your digital presence" scorecard:** the 7 audit signals as pass/fail/unknown
  rows, each with the plain-language `evidence` entry from
  `business_audits.evidence`. Show `audit_score` and `digital_maturity_level`
  framed constructively — this is a findings report, not a grade.
  **Do not show `opportunity_score` or `confidence_score`.**
- **"What we recommend":** `primary_opportunity` and `recommended_services` from
  `opportunity_analysis`, plus `estimated_complexity` and `estimated_duration`.
  **Not** `maturity_gap`, **not** the `reasoning` jsonb — that reasoning is
  written for the agency and discusses the client as a sales target.
- **The proposal:** render `proposals.content` markdown cleanly, with the title
  and status. Actions: **Accept**, **Request changes** (free-text), **Decline**.
  Each writes an `outcome_events` row and moves `proposals.status`. This is the
  point of the whole dashboard — make the primary action unmissable.
- **Simple message thread** with the agency, scoped to this grant. Requires a new
  `portal_messages` table (`grant_id, sender_user_id, body, created_at, read_at`).
- **No navigation to anything else.** One page, one business, one proposal.

**New endpoints — all under `/api/portal`, all authorising against
`client_portal_access` with `revoked_at IS NULL`:**
- `GET /api/portal/context` → business name, agency name, grant id
- `GET /api/portal/audit` → the 7 signals + evidence + audit_score only
- `GET /api/portal/recommendation` → allowlisted opportunity fields only
- `GET /api/portal/proposal` → title, content, status, timestamps
- `POST /api/portal/proposal/respond` → accept / request-changes / decline
- `GET|POST /api/portal/messages`

Resolve the grant from `req.user.sub` **server-side** on every request. Never
accept a `lead_id` or `grant_id` from the client as the authorisation subject.
Write each handler's `select()` as an explicit column list and add a comment
saying why — a future `select('*')` here is a data leak.

**Invite flow (agency side, build first):** on a lead at the `client` stage, an
"Invite client to portal" action that takes an email, creates a Supabase auth
user with `role = 'client'` and `workspace_id = NULL`, inserts the
`client_portal_access` grant, and sends a magic link. A revoke control that sets
`revoked_at`. Surface active portal invites in the agency dashboard's team panel.

**Acceptance test — write this as an automated test, not a manual check:**
sign in as a client and assert that every one of these returns no data:
their own lead's `outreach_body`, any `lead_scores` row, any `opportunity_score`,
any `pipeline_stages` row, any *other* lead in the same workspace, and any other
workspace. Model it on `backend/src/scripts/verify-rls.ts`, which already does
this two-tenant proof for the agency case, and add it to
`npm --prefix backend run verify:rls`.

---

## Definition of done (all four)

- [ ] `npx tsc -b` clean at the repo root; `npx tsc --noEmit` clean in `backend/`
- [ ] `npm run build` succeeds
- [ ] Every panel has loading, error, empty and populated states — all four seen
- [ ] No hardcoded business, person, email, score or metric anywhere
- [ ] Light and dark mode both verified
- [ ] 375px wide with no horizontal scroll
- [ ] Keyboard-navigable; charts have a text equivalent
- [ ] `npm --prefix backend run verify:rls` passes, including the new client assertions
- [ ] `npm run verify:migrations` passes for any migration added
- [ ] No `select('*')` in any `/api/portal` handler
