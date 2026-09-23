# Client Pilot AI — Complete Project Documentation & Feature Specification

> **Version:** 1.0.0  
> **Platform:** Client Pilot AI (`ClientPilotAI`)  
> **Target Market:** B2B Agencies, Digital Consultants, Web Developers, Freelancers & Sales Teams  
> **Stack:** React 19, TypeScript, Vite, Tailwind CSS v4 (Claymorphism UI), Node.js / Express 5, Supabase (PostgreSQL + RLS + Realtime), Google Gemini AI (`gemini-2.5-flash`), OpenStreetMap (Overpass & Nominatim).

---

## Table of Contents

1. [Executive Summary & Product Vision](#1-executive-summary--product-vision)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Comprehensive Feature Breakdown](#4-comprehensive-feature-breakdown)
   - [4.1 Geospatial Lead Discovery & Search Engine](#41-geospatial-lead-discovery--search-engine)
   - [4.2 Multi-Factor AI Lead Scoring Engine](#42-multi-factor-ai-lead-scoring-engine)
   - [4.3 Contact Enrichment & Web Crawling Pipeline](#43-contact-enrichment--web-crawling-pipeline)
   - [4.4 Hyper-Personalized AI Outreach Engine](#44-hyper-personalized-ai-outreach-engine)
   - [4.5 Drag-and-Drop Pipeline CRM (Kanban Board)](#45-drag-and-drop-pipeline-crm-kanban-board)
   - [4.6 AI Proposal Generator & Deal Workflow Manager](#46-ai-proposal-generator--deal-workflow-manager)
   - [4.7 Visual Analytics & Executive Intelligence Dashboard](#47-visual-analytics--executive-intelligence-dashboard)
   - [4.8 Multi-Tenant Admin & User Governance Panel](#48-multi-tenant-admin--user-governance-panel)
   - [4.9 Real-Time Notification Center & WebSockets](#49-real-time-notification-center--websockets)
   - [4.10 Unified Lead Detail Drawer & One-Click "Prepare Lead" Action](#410-unified-lead-detail-drawer--one-click-prepare-lead-action)
   - [4.11 Authentication, RBAC & Security](#411-authentication-rbac--security)
   - [4.12 Modern Claymorphic UI/UX Design System](#412-modern-claymorphic-uiux-design-system)
5. [Database Schema & Data Model](#5-database-schema--data-model)
6. [API Specification & Endpoint Reference](#6-api-specification--endpoint-reference)
7. [Environment Variables & Setup Guide](#7-environment-variables--setup-guide)
8. [Production Deployment Architecture](#8-production-deployment-architecture)

---

## 1. Executive Summary & Product Vision

**Client Pilot AI** is an all-in-one, intelligent B2B client acquisition and deal pipeline platform. It transforms how digital agencies, software consultancies, and freelance professionals discover high-intent local businesses, diagnose digital presence deficiencies, enrich direct decision-maker contact details, generate persuasive cold outreach, draft full project proposals, and shepherd prospects across a visual sales funnel.

### Core Value Proposition
- **Eliminate Manual Prospecting:** Search real-world local businesses across 14+ commercial categories in any geographic radius using OpenStreetMap geospatial intelligence.
- **Data-Driven Opportunity Scoring:** Every discovered business is evaluated by Google Gemini AI across 5 dimensions (Digital Presence Gap, Category Fit, Review Activity, Market Density, Competitor Presence) to surface high-probability clients.
- **Zero-Friction Preparation:** With a single click ("Prepare Lead"), the platform extracts contact emails and phone numbers from map metadata and live web pages, writes tailored multi-variant outreach emails, and generates complete bespoke project proposals.
- **Integrated Deal Pipeline:** Visual Kanban board powered by drag-and-drop mechanics to monitor prospects from initial discovery to qualified deal and paying client.

---

## 2. High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND CLIENT (VITE + REACT 19)               │
│  - Zustand Global Store              - Claymorphic Design System       │
│  - React Router DOM v7               - Framer Motion Micro-Animations   │
│  - Leaflet Geospatial Maps           - @dnd-kit Drag-and-Drop Kanban   │
│  - Recharts Visual Analytics         - Supabase Realtime Client        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST + WSS Realtime
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER (EXPRESS 5 + TS)                   │
│  - JWT Bearer Authentication         - Express Rate Limiting           │
│  - Supabase Service Admin SDK        - Robust Zod Schema Validation    │
│  - Resilient Error Handling          - CORS Security Policy            │
└───┬───────────────────────────────┬───────────────────────────────┬────┘
    │                               │                               │
    ▼                               ▼                               ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│     SUPABASE POSTGRES │ │   GOOGLE GEMINI 2.5   │ │   EXTERNAL CRAWLER    │
│  - RLS Policies       │ │  - Structured JSON    │ │  - OSM Nominatim      │
│  - Workspaces / Users │ │  - Lead Scoring       │ │  - Overpass Turbo QL  │
│  - Leads & Scores     │ │  - Outreach Drafting  │ │  - Website Scraper    │
│  - Proposals & Stages │ │  - Proposal Creation  │ │  - Email & Tel Parser │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
```

---

## 3. Technology Stack

### Frontend
- **Framework & Runtime:** React 19, TypeScript, Vite 8
- **Styling & Theming:** Tailwind CSS v4, Custom Claymorphic Design Tokens (smooth drop shadows, inset clay borders, light/dark mode switching via `next-themes` and CSS root variables)
- **State Management:** Zustand 5 (global store with persistent UI preferences, optimistic updates, and real-time subscription management)
- **Data Visualization & Charts:** Recharts 3 (Area charts, Bar charts, Pie charts, sparklines)
- **Interactivity & Gestures:** Framer Motion 12 (spring physics, layout animations, modal transitions)
- **Drag-and-Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Mapping & Geospatial:** Leaflet 1.9, `@types/leaflet`, custom DivIcon SVG score badges
- **Iconography:** Lucide React (over 50 custom-tailored contextual icons)

### Backend
- **Runtime:** Node.js 18+ / 20+, Express 5, TypeScript
- **Validation:** Zod 4 for runtime input contract enforcement
- **AI SDK:** `@google/generative-ai` (`gemini-2.5-flash`), with architectural readiness for OpenAI fallback
- **Security & Protection:** `express-rate-limit`, `cors`, `jsonwebtoken`
- **HTTP Client & Crawling:** Axios with custom user-agents, timeout handling, and HTML regex parsing

### Database & Auth
- **Database Engine:** Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication:** Supabase Auth (Email / Password, JWT validation, automated user triggers)
- **Realtime Replication:** PostgreSQL Change Data Capture (CDC) via Supabase Channels for asynchronous score updates and collaboration

---

## 4. Comprehensive Feature Breakdown

### 4.1 Geospatial Lead Discovery & Search Engine
- **OpenStreetMap Integration:** Queries the global OpenStreetMap database via Overpass Turbo QL and Nominatim geocoding.
- **Geocoding & Location Search:** Full-text location resolution (e.g., "Clifton, Karachi", "Gulberg, Lahore", "F-7 Islamabad") converting addresses to latitude/longitude coordinates.
- **Radius-Based Scanning:** Configurable search radius from 500m up to 50,000m (50km).
- **14 Commercial Business Categories Supported:**
  1. Restaurants & Fast Food (`restaurant`)
  2. Retail & General Stores (`retail`)
  3. Salons & Beauty Clinics (`salon`)
  4. Clinics, Doctors & Dentists (`clinic`)
  5. Auto Services & Mechanics (`auto_service`)
  6. Bakeries & Confectioneries (`bakery`)
  7. Pharmacies (`pharmacy`)
  8. Tailoring & Boutiques (`tailor`)
  9. Cafes & Coffee Shops (`cafe`)
  10. Gyms & Fitness Centers (`gym`)
  11. Electronics & Mobile Outlets (`electronics`)
  12. Jewellery & Gems (`jewellery`)
  13. Real Estate Consultancies (`real_estate`)
  14. Catering & Event Services (`catering`)
- **Interactive Leaflet Radar Map:**
  - Dynamic marker clustering with custom circular badges displaying the real-time AI Opportunity Score.
  - Interactive popup showing business category, rating, website presence, and a direct link to open the Lead Detail Drawer.
  - Dual view modes: Toggle seamlessly between Map View and Card Grid View.
- **Database Persistence & Upsert:** Discovered businesses are automatically upserted into the user's workspace database without creating duplicates (`UNIQUE(workspace_id, osm_id)`).

---

### 4.2 Multi-Factor AI Lead Scoring Engine
Evaluates every prospective business across 5 critical dimensions (scaled 0–10) using Google Gemini 2.5 Flash to generate an overall opportunity score (0–100):

| Scoring Factor | Scale | Description & Analytical Criteria |
| :--- | :---: | :--- |
| **Digital Presence Gap** | 0 – 10 | Measures deficiency in modern digital footprint: missing website, lack of SSL, unoptimized mobile experience, or lack of online booking/ordering. |
| **Category Fit** | 0 – 10 | Analyzes the commercial viability of agency digital transformation services (e.g., clinics, salons, and restaurants have very high demand for web & booking systems). |
| **Review Activity** | 0 – 10 | Assesses customer volume, reputation velocity, and public engagement. |
| **Market Density** | 0 – 10 | Evaluates regional commercial density to identify if the lead is in a bustling commercial hub. |
| **Competitor Presence** | 0 – 10 | Gauges competitive intensity in the immediate neighborhood that pushes the business to modernize to avoid losing market share. |

- **Score Bands:**
  - **High Intent (80–100):** Emerald badge. Prime target with high digital gaps and strong commercial viability.
  - **Moderate Intent (50–79):** Amber badge. Secondary target with partial online presence.
  - **Low Intent (<50):** Slate/Muted badge. Established digital presence or low commercial fit.
- **Qualitative AI Reasoning:** Generates a personalized executive diagnostic summary highlighting exactly why this lead needs digital services and what specific improvements are recommended.

---

### 4.3 Contact Enrichment & Web Crawling Pipeline
- **Dual-Source Contact Extraction:**
  - **Level 1 (OSM Metadata):** Extracts official phone numbers, emails, and website URLs tagged directly in OpenStreetMap nodes.
  - **Level 2 (Automated Web Crawler):** If a website URL exists, the system crawls the homepage and attempts to crawl dedicated `/contact`, `/contact-us`, or `/about` subpages.
- **Noise & Asset Filtering:** Strips image assets (`.png`, `.svg`, `.webp`), scripts, CSS, and tracker domains (`sentry.io`, placeholder domains) to guarantee clean email addresses.
- **Confidence Scoring & Source Attribution:** Tracks where the contact information came from (`osm_tag`, `website_homepage`, `website_contact_page`, or `manual`) along with an algorithmic confidence rating (0–100%).
- **Inline Contact Editing:** Users can edit or add emails and phone numbers on the fly with one-click clipboard copying.

---

### 4.4 Hyper-Personalized AI Outreach Engine
- **Tailored Cold Email Generation:** Powered by Gemini 2.5 Flash. Rather than generic templates, the AI references the specific business name, category, city, address, website deficiency, and competitive positioning.
- **Multi-Channel Variants:**
  - **Cold Outreach Email:** Persuasive subject line and body focused on fixing the exact digital presence gap.
  - **Follow-Up Email:** Short, polite nudge message for subsequent follow-ups.
  - **WhatsApp / SMS Short Outreach:** Condensed direct message optimized for mobile messaging apps.
- **In-Drawer Editor & Validator:** Review, customize, and edit drafts before sending.
- **One-Click Send & State Progression:** Sending an outreach email automatically marks the message as `sent`, updates timestamps, and advances the lead from `Qualified` to `Contacted`.
- **Draft Persistence:** Save custom-edited messages as drafts to Supabase with instant retrieval.

---

### 4.5 Drag-and-Drop Pipeline CRM (Kanban Board)
- **4 Native Funnel Stages:**
  1. **Discovery:** Newly found leads scanned from geographic queries.
  2. **Qualified:** Leads identified as high-opportunity prospects ready for outreach.
  3. **Contacted:** Prospects who have been sent cold emails or WhatsApp pitches.
  4. **Client:** Won deals actively onboarding or under contract.
- **Smooth Drag-and-Drop:** Built using `@dnd-kit` with touch-screen and mouse pointer sensors, collision detection (`closestCorners`), and smooth Framer Motion transitions.
- **Persistent Stage Synchronization:** Dragging a card across columns updates the state optimistically and immediately records an audit row in `pipeline_stages` in Supabase.
- **Quick Filters & Search:** Filter Kanban cards by business category, score threshold, or search query.

---

### 4.6 AI Proposal Generator & Deal Workflow Manager
- **Context-Aware Proposal Generation:** Automatically drafts a structured commercial project proposal in Markdown containing:
  - Executive Overview
  - Identified Digital Presence Deficiencies
  - Proposed Scope of Work (Custom Website, Booking Engine, Local SEO, Mobile Optimization)
  - Commercial Deliverables & Milestones
  - Investment Breakdown & ROI Justification
- **Dedicated Proposals Module (`/app/proposals`):**
  - Search, filter, and inspect all created proposals across the workspace.
  - Integrated Markdown viewer and editor with live character and word counters.
- **Proposal Lifecycle Tracking:**
  - `Draft` → `Submitted` → `Reviewed` → `Replied` → `Accepted` → `Rejected`
- **One-Click Status Updates & Deletions:** Modify proposal workflow states or delete outdated proposals with instant UI updates.

---

### 4.7 Visual Analytics & Executive Intelligence Dashboard
- **Executive Metric Cards:**
  - **Total Discovered Leads:** Overall database volume with weekly change indicators.
  - **Qualified Opportunity Leads:** Filtered high-value targets.
  - **Outreach Velocity:** Number of emails and messages delivered.
  - **Pipeline Conversion Rate:** Percentage of total leads converted to paying clients.
  - **Interactive Sparklines:** 7-day velocity micro-trend lines rendered via embedded SVG.
- **14-Day Lead Acquisition Velocity Chart:** Area chart displaying daily prospect discovery counts.
- **Pipeline Stage Conversion Funnel:** Bar chart illustrating drop-off and progression across funnel stages.
- **Lead Quality Distribution:** Doughnut / Pie chart detailing the proportion of High, Medium, and Low opportunity leads.
- **Live Activity Feed:** Chronological streaming log of system events (leads discovered, scores calculated, emails dispatched, and pipeline moves).

---

### 4.8 Multi-Tenant Admin & User Governance Panel
- **Accessible via `/app/admin` (Guarded by `AdminGuard`):**
- **User Governance:**
  - List all registered users across the platform with creation dates, last sign-in timestamps, and workspace bindings.
  - Elevate standard users to `admin` or demote administrators to `user` via live Supabase updates.
- **Workspace Auditing:**
  - Inspect any workspace's total leads, funnel health, and outreach dispatch volume.
  - Deep-dive into any user's individual leads, scoring breakdown, and communication history for quality assurance.

---

### 4.9 Real-Time Notification Center & WebSockets
- **Interactive Notification Flyout:** Accessible via top navigation bar bell icon with an unread badge indicator.
- **Event Categories:**
  - New high-scoring leads found
  - Pipeline stage movements
  - Outreach emails delivered
  - Proposal views and status updates
  - System diagnostics and background batch completions
- **Supabase Realtime WebSockets:**
  - Subscribes to `leads` and `lead_scores` table updates.
  - Automatically updates the UI in real-time when asynchronous background AI scoring tasks complete.

---

### 4.10 Unified Lead Detail Drawer & One-Click "Prepare Lead" Action
- **One-Click "Prepare Lead" Workflow:**
  When a lead is opened for the first time, the platform can automatically:
  1. Crawl for contact information (email, phone, social links).
  2. Call Gemini 2.5 Flash to generate cold outreach email + follow-up + WhatsApp messages.
  3. Call Gemini 2.5 Flash to generate a full Markdown proposal.
  4. Persist all outputs to the database and update the UI simultaneously.
- **Tabbed Interface:**
  - **Overview & Intelligence Tab:** Radar score breakdown, key business metadata, address, website link, and AI diagnostic reasoning.
  - **Outreach Tab:** Recipient email validator, editable subject and body, regenerate button, save draft, and send email action.
  - **Proposal Tab:** Proposal preview, title editor, Markdown content area, save proposal button, and workflow state selector.

---

### 4.11 Authentication, RBAC & Security
- **Supabase Authentication:** Secure email/password login and signup with session persistence in `localStorage`.
- **Automated Profile Provisioning:** PostgreSQL database trigger (`00002_user_trigger.sql`) automatically creates a default personal `workspace` and links a new `profile` row upon user signup.
- **Row Level Security (RLS):** Every database table (`workspaces`, `profiles`, `leads`, `lead_scores`, `pipeline_stages`, `outreach_messages`, `proposals`) enforces RLS policies ensuring users can only read and write data belonging to their workspace.
- **Backend JWT Verification:** Express middleware checks Supabase bearer tokens on every protected API route.
- **API Rate Limiting:** `express-rate-limit` prevents abusive scanning or denial-of-service attempts.

---

### 4.12 Modern Claymorphic UI/UX Design System
- **Claymorphic Visual Language:** Smooth rounded radii (`rounded-2xl`, `rounded-[24px]`), dual layered drop-shadows with inset highlights (`clay-card`, `clay-raised`, `clay-inset`), giving an elegant, tactile, premium aesthetic.
- **Dark & Light Mode Support:** Dynamic CSS variables toggle between a crisp modern white/slate theme and an ultra-sleek deep charcoal/slate dark theme.
- **Collapsible Responsive Navigation:** Mobile-friendly sidebar and AppShell with quick access to Dashboard, Lead Discovery, Pipeline, All Leads, Messages, Proposals, Admin, and Settings.

---

## 5. Database Schema & Data Model

### 1. `workspaces`
Represents the organizational container for multi-tenancy.
```sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2. `profiles`
Extends `auth.users` with application-specific attributes.
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'user', -- 'admin' | 'user'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3. `leads`
Stores all discovered business entities and enriched contact information.
```sql
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    category TEXT NOT NULL,
    address TEXT,
    city TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    phone TEXT,
    has_website BOOLEAN DEFAULT FALSE,
    website_url TEXT,
    osm_id TEXT,
    source TEXT DEFAULT 'osm',
    raw_osm_tags JSONB,
    contact_email TEXT,
    contact_phone TEXT,
    website TEXT,
    contact_source TEXT,
    contact_confidence INT DEFAULT 0,
    outreach_subject TEXT,
    outreach_body TEXT,
    outreach_status TEXT DEFAULT 'draft',
    outreach_generated_at TIMESTAMPTZ,
    outreach_sent_at TIMESTAMPTZ,
    proposal_content TEXT,
    proposal_status TEXT DEFAULT 'draft',
    proposal_generated_at TIMESTAMPTZ,
    last_enrichment_run_at TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (workspace_id, osm_id)
);
```

### 4. `lead_scores`
Stores AI scoring dimensions and executive reasoning.
```sql
CREATE TABLE lead_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
    digital_presence_gap INT CHECK (digital_presence_gap BETWEEN 0 AND 10),
    category_fit INT CHECK (category_fit BETWEEN 0 AND 10),
    review_activity INT CHECK (review_activity BETWEEN 0 AND 10),
    market_density INT CHECK (market_density BETWEEN 0 AND 10),
    competitor_presence INT CHECK (competitor_presence BETWEEN 0 AND 10),
    ai_reasoning TEXT,
    model_used TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (lead_id)
);
```

### 5. `pipeline_stages`
Records stage transitions for pipeline audit history.
```sql
CREATE TABLE pipeline_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    stage pipeline_stage NOT NULL DEFAULT 'discovery',
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 6. `outreach_messages`
Stores generated, drafted, and sent outreach messages.
```sql
CREATE TABLE outreach_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    subject TEXT,
    content TEXT NOT NULL,
    status outreach_status DEFAULT 'draft', -- 'draft' | 'approved' | 'sent'
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(lead_id)
);
```

### 7. `proposals`
Stores client proposals with lifecycle state tracking.
```sql
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (workspace_id, lead_id)
);
```

---

## 6. API Specification & Endpoint Reference

All protected endpoints require the following HTTP Header:
```http
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

### 6.1 Leads Endpoints (`/api/leads`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/leads` | Fetches all leads in the current user's workspace, joined with their latest score, outreach message, and active pipeline stage. |
| `POST` | `/api/leads/discover` | Executes geospatial discovery via OSM Overpass using `location` or `lat`/`lng`, `categories`, and `radiusMeters`. Persists new leads and triggers AI scoring. |
| `POST` | `/api/leads/:id/score` | Re-evaluates or forces AI scoring for a specific lead using Gemini 2.5 Flash. |
| `POST` | `/api/leads/:id/outreach` | Generates a 3-variant outreach draft (Cold email, follow-up, WhatsApp). |
| `POST` | `/api/leads/:id/prepare` | **One-click workflow:** Performs contact enrichment, drafts outreach, and generates an AI proposal in a single request. |
| `POST` | `/api/leads/:id/send-outreach` | Marks an outreach message as sent, updates lead email, and advances pipeline stage to `contacted`. |
| `POST` | `/api/leads/:id/save-draft` | Saves modified subject and body content as a draft. |
| `PATCH` | `/api/leads/:id/stage` | Updates a lead's pipeline stage (`discovery`, `qualified`, `contacted`, `client`). |

### 6.2 Proposals Endpoints (`/api/proposals`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/proposals` | Lists all proposals created within the user's workspace with joined business details. |
| `GET` | `/api/proposals/:id` | Returns complete details for a single proposal. |
| `POST` | `/api/proposals/generate` | Generates a customized Markdown commercial proposal for a given `leadId`. |
| `POST` | `/api/proposals` | Upserts a proposal (unique per `workspace_id` + `lead_id`). |
| `PATCH` | `/api/proposals/:id/status`| Updates proposal status (`draft`, `submitted`, `reviewed`, `replied`, `accepted`, `rejected`). |
| `DELETE`| `/api/proposals/:id` | Deletes a proposal record. |

### 6.3 Analytics Endpoints (`/api/analytics`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/analytics/overview` | Computes aggregated workspace metrics: total leads, qualified leads, outreach sent, conversion rate, 14-day velocity array, and funnel stage counts. |

### 6.4 Admin Endpoints (`/api/admin`) *(Restricted to role = 'admin')*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/users` | Lists all platform users, their role, timestamps, and full workspace lead metrics. |
| `PATCH` | `/api/admin/users/:id/role` | Updates a user's role to either `'admin'` or `'user'`. |

### 6.5 Diagnostics Endpoints (`/api/ai`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/ai/test` | Public connectivity probe verifying that `GEMINI_API_KEY` is loaded, correctly formatted, and able to generate content. |

---

## 7. Environment Variables & Setup Guide

### Frontend Configuration (`.env.local`)
```env
# Supabase credentials (obtained from Supabase Project Settings -> API)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API URL (leave empty or set to http://localhost:3001/api for local dev)
VITE_API_URL=http://localhost:3001/api

# Optional: Force offline demo mock data if testing without live Supabase
VITE_FORCE_DEMO=false
```

### Backend Configuration (`/backend/.env`)
```env
PORT=3001

# Supabase Project credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-supabase-jwt-secret-here

# Google Gemini API Key (starts with AIza...)
GEMINI_API_KEY=AIzaSy...

# Optional: Frontend URL for CORS in production
FRONTEND_URL=https://clientpilotai.vercel.app
```

---

## 8. Production Deployment Architecture

```
                  ┌───────────────────────────────┐
                  │          DNS / DOMAIN         │
                  └───────────────┬───────────────┘
                                  │
          ┌───────────────────────┴───────────────────────┐
          │                                               │
          ▼                                               ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐
│        VERCEL (FRONTEND)      │       │       RAILWAY (BACKEND)       │
│  - Static Asset CDN           │       │  - Express 5 Node.js Server   │
│  - Single Page App (SPA)      │       │  - Overpass OSM Proxy         │
│  - Environment Variables      │       │  - Gemini AI Processing       │
│  - Automatic Preview Builds   │       │  - Web Scraping Worker        │
└───────────────┬───────────────┘       └───────────────┬───────────────┘
                │                                       │
                └───────────────────┬───────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │     SUPABASE MANAGED CLOUD    │
                    │  - PostgreSQL Database        │
                    │  - Realtime WebSockets        │
                    │  - GoTrue Auth Engine         │
                    └───────────────────────────────┘
```

### Deployment Instructions
1. **Database:** Execute SQL migration files (`00001_initial_schema.sql` through `00007_outreach_messages_unique_lead.sql`) in the Supabase SQL Editor.
2. **Backend:** Deploy `/backend` to Railway or Render. Set all environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `GEMINI_API_KEY`, `FRONTEND_URL`).
3. **Frontend:** Connect the root repository to Vercel. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_URL` (pointing to your deployed backend URL).
