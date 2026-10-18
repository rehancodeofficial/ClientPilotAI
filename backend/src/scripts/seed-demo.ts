/**
 * Provisions the demo workspace.
 *
 *   npm --prefix backend run seed:demo          # create or update
 *   npm --prefix backend run seed:demo -- --reset   # wipe demo data first
 *
 * Replaces migration 00014, which could not run: it inserted profile rows with
 * hand-picked UUIDs that had no auth.users row, violating the profiles FK.
 *
 * Here the demo accounts are genuine Supabase auth users created through the
 * admin API, so they sign in through the normal flow and the FK holds. Their
 * ids are allocated by Supabase rather than hardcoded, and the backend resolves
 * them by email — the fixed-UUID coupling is what made the previous approach
 * silently break.
 *
 * Seeded leads are confined to the demo workspace and prefixed `[Demo]`, so
 * demonstration data can never be mistaken for a real prospect.
 *
 * Idempotent: re-running updates in place rather than duplicating.
 */

import { createClient } from '@supabase/supabase-js';
import { assertRequiredEnv, env } from '../lib/env';

assertRequiredEnv();

const admin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export const DEMO_WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';
export const DEMO_WORKSPACE_NAME = 'Demo Workspace';

/** Demo accounts. Passwords are overridable for a shared environment. */
export const DEMO_ACCOUNTS = [
  {
    key: 'admin' as const,
    email: (process.env.DEMO_ADMIN_EMAIL || 'demo-admin@clientpilot.test').toLowerCase(),
    password: process.env.DEMO_ADMIN_PASSWORD || 'DemoAdmin!2026',
    fullName: 'Demo Admin',
    role: 'admin',
  },
  {
    key: 'user' as const,
    email: (process.env.DEMO_USER_EMAIL || 'demo-user@clientpilot.test').toLowerCase(),
    password: process.env.DEMO_USER_PASSWORD || 'DemoUser!2026',
    fullName: 'Demo User',
    role: 'user',
  },
];

const DEMO_LEAD_PREFIX = '[Demo]';

/**
 * Illustrative prospects. Deliberately fictional: invented business names on
 * reserved .test domains, so nothing here can be confused with, or send mail
 * to, a real business.
 */
const DEMO_LEADS = [
  {
    business_name: `${DEMO_LEAD_PREFIX} Northgate Bakery`,
    category: 'bakery',
    address: '14 Northgate Street',
    city: 'Demo City',
    lat: 24.8607, lng: 67.0011,
    has_website: false,
    website_url: null as string | null,
    contact_email: 'hello@northgate-bakery.test',
    contact_phone: '+10000000001',
    contact_source: 'osm_tag',
    contact_confidence: 0.4,
    score: { overall: 91, gap: 10, fit: 9, reviews: 8, density: 7, competitors: 9 },
    reasoning:
      'No website at all despite steady footfall. A single-page site with online ordering ' +
      'addresses the largest gap; local competitors already take orders online.',
  },
  {
    business_name: `${DEMO_LEAD_PREFIX} Riverside Dental Care`,
    category: 'clinic',
    address: '8 Riverside Avenue',
    city: 'Demo City',
    lat: 24.8720, lng: 67.0250,
    has_website: true,
    website_url: 'https://riverside-dental.test',
    contact_email: 'reception@riverside-dental.test',
    contact_phone: '+10000000002',
    contact_source: 'website_contact_page',
    contact_confidence: 0.85,
    score: { overall: 74, gap: 6, fit: 9, reviews: 7, density: 6, competitors: 7 },
    reasoning:
      'Site exists but has no appointment booking and fails mobile layout checks. ' +
      'Booking integration is the highest-value intervention for a practice of this size.',
  },
  {
    business_name: `${DEMO_LEAD_PREFIX} Summit Auto Works`,
    category: 'auto_service',
    address: '221 Summit Road',
    city: 'Demo City',
    lat: 24.8500, lng: 67.0400,
    has_website: true,
    website_url: 'https://summit-auto.test',
    contact_email: null,
    contact_phone: '+10000000003',
    contact_source: 'osm_tag',
    contact_confidence: 0.3,
    score: { overall: 58, gap: 5, fit: 6, reviews: 5, density: 6, competitors: 6 },
    reasoning:
      'Serviceable site without SSL on the quote form. Security remediation first, ' +
      'then local SEO; commercial upside is moderate.',
  },
  {
    business_name: `${DEMO_LEAD_PREFIX} Fern & Thistle Salon`,
    category: 'salon',
    address: '3 Market Lane',
    city: 'Demo City',
    lat: 24.8650, lng: 67.0150,
    has_website: false,
    website_url: null,
    contact_email: 'bookings@fern-thistle.test',
    contact_phone: '+10000000004',
    contact_source: 'website_homepage',
    contact_confidence: 0.6,
    score: { overall: 83, gap: 9, fit: 9, reviews: 7, density: 8, competitors: 8 },
    reasoning:
      'Social-only presence with a high booking volume handled by phone. ' +
      'Online scheduling would cut no-shows and is well matched to the category.',
  },
  {
    business_name: `${DEMO_LEAD_PREFIX} Copperpot Catering`,
    category: 'catering',
    address: '45 Dock Street',
    city: 'Demo City',
    lat: 24.8800, lng: 67.0300,
    has_website: true,
    website_url: 'https://copperpot-catering.test',
    contact_email: 'events@copperpot-catering.test',
    contact_phone: '+10000000005',
    contact_source: 'website_contact_page',
    contact_confidence: 0.9,
    score: { overall: 41, gap: 3, fit: 5, reviews: 4, density: 5, competitors: 4 },
    reasoning:
      'Digitally mature: responsive site, enquiry form, structured data present. ' +
      'Retained as a low-intent example — not every discovered business is an opportunity.',
  },
];

const STAGES: Record<string, string> = {
  [`${DEMO_LEAD_PREFIX} Northgate Bakery`]: 'qualified',
  [`${DEMO_LEAD_PREFIX} Riverside Dental Care`]: 'contacted',
  [`${DEMO_LEAD_PREFIX} Summit Auto Works`]: 'discovery',
  [`${DEMO_LEAD_PREFIX} Fern & Thistle Salon`]: 'qualified',
  [`${DEMO_LEAD_PREFIX} Copperpot Catering`]: 'discovery',
};

async function preflight() {
  // 00015 adds profiles.email and makes workspaces.owner_id nullable. Without
  // it this script fails midway, so check before writing anything.
  const { error } = await admin.from('profiles').select('email').limit(1);
  if (error && /column .*email.* does not exist/i.test(error.message)) {
    console.error(
      '\n[seed:demo] profiles.email is missing — migration 00015 has not been applied.\n' +
        'Apply supabase/migrations/00015_hardening_columns_indexes_rls.sql first,\n' +
        'then re-run this script.\n'
    );
    process.exit(1);
  }
}

async function resetDemoData() {
  console.log('--reset: removing existing demo data…');
  const { data: leads } = await admin
    .from('leads')
    .select('id')
    .eq('workspace_id', DEMO_WORKSPACE_ID);
  const ids = (leads ?? []).map((l) => l.id);

  if (ids.length > 0) {
    // Children first; several of these have ON DELETE CASCADE but not all.
    for (const table of [
      'lead_scores',
      'outreach_messages',
      'pipeline_stages',
      'business_audits',
      'opportunity_analysis',
      'competitor_analysis',
      'outcome_events',
      'proposals',
    ]) {
      await admin.from(table).delete().in('lead_id', ids);
    }
    await admin.from('leads').delete().in('id', ids);
  }
  console.log(`  removed ${ids.length} demo lead(s)`);
}

async function ensureWorkspace() {
  const { data: existing } = await admin
    .from('workspaces')
    .select('id')
    .eq('id', DEMO_WORKSPACE_ID)
    .maybeSingle();

  if (existing) {
    console.log(`  workspace ${DEMO_WORKSPACE_ID} already present`);
    return;
  }

  const { error } = await admin.from('workspaces').insert({
    id: DEMO_WORKSPACE_ID,
    name: DEMO_WORKSPACE_NAME,
    owner_id: null,
    plan: 'agency',
  });

  if (error) {
    if (/null value in column "owner_id"/i.test(error.message)) {
      console.error(
        '\n[seed:demo] workspaces.owner_id is still NOT NULL — migration 00015 ' +
          'has not been applied. Apply it first, then re-run.\n'
      );
      process.exit(1);
    }
    throw error;
  }
  console.log(`  created workspace ${DEMO_WORKSPACE_ID}`);
}

/** Creates the auth user if absent, then points its profile at the demo workspace. */
async function ensureAccount(account: (typeof DEMO_ACCOUNTS)[number]) {
  // There is no "get user by email" in the admin API, so page through the list.
  let userId: string | undefined;
  for (let page = 1; page <= 20 && !userId; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    userId = data.users.find((u) => u.email?.toLowerCase() === account.email)?.id;
    if (data.users.length < 200) break;
  }

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: { full_name: account.fullName },
    });
    if (error || !data.user) throw new Error(`creating ${account.email}: ${error?.message}`);
    userId = data.user.id;
    console.log(`  created auth user ${account.email}`);
  } else {
    // Keep the password aligned with the configured value.
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password: account.password,
      email_confirm: true,
    });
    if (error) console.warn(`  could not reset password for ${account.email}: ${error.message}`);
    console.log(`  auth user ${account.email} already present`);
  }

  // The signup trigger made a personal workspace; move the profile to the demo
  // one and drop the now-orphaned workspace so it does not clutter the tenant list.
  const { data: profile } = await admin
    .from('profiles')
    .select('workspace_id')
    .eq('id', userId)
    .maybeSingle();

  const personalWorkspaceId = profile?.workspace_id as string | undefined;

  const { error: upsertErr } = await admin.from('profiles').upsert(
    {
      id: userId,
      workspace_id: DEMO_WORKSPACE_ID,
      full_name: account.fullName,
      email: account.email,
      role: account.role,
    },
    { onConflict: 'id' }
  );
  if (upsertErr) throw new Error(`profile for ${account.email}: ${upsertErr.message}`);

  if (personalWorkspaceId && personalWorkspaceId !== DEMO_WORKSPACE_ID) {
    const { count } = await admin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', personalWorkspaceId);
    if ((count ?? 0) === 0) {
      await admin.from('workspaces').delete().eq('id', personalWorkspaceId);
      console.log(`    removed empty auto-created workspace ${personalWorkspaceId}`);
    }
  }

  return userId;
}

async function seedLeads(createdBy: string) {
  let inserted = 0;
  let updated = 0;

  for (const demo of DEMO_LEADS) {
    const { score, reasoning, ...leadColumns } = demo;

    const { data: existing } = await admin
      .from('leads')
      .select('id')
      .eq('workspace_id', DEMO_WORKSPACE_ID)
      .eq('business_name', demo.business_name)
      .maybeSingle();

    let leadId: string;
    if (existing) {
      const { error } = await admin
        .from('leads')
        .update({ ...leadColumns, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (error) throw new Error(`updating ${demo.business_name}: ${error.message}`);
      leadId = existing.id;
      updated++;
    } else {
      const { data, error } = await admin
        .from('leads')
        .insert({ ...leadColumns, workspace_id: DEMO_WORKSPACE_ID, source: 'demo_seed' })
        .select('id')
        .single();
      if (error || !data) throw new Error(`inserting ${demo.business_name}: ${error?.message}`);
      leadId = data.id;
      inserted++;
    }

    // One score row per lead; replace rather than accumulate on re-run.
    await admin.from('lead_scores').delete().eq('lead_id', leadId);
    const { error: scoreErr } = await admin.from('lead_scores').insert({
      lead_id: leadId,
      overall_score: score.overall,
      digital_presence_gap: score.gap,
      category_fit: score.fit,
      review_activity: score.reviews,
      market_density: score.density,
      competitor_presence: score.competitors,
      ai_reasoning: reasoning,
      model_used: 'demo_seed',
    });
    if (scoreErr) throw new Error(`score for ${demo.business_name}: ${scoreErr.message}`);

    // Current pipeline stage, as a single history row.
    const stage = STAGES[demo.business_name] ?? 'discovery';
    await admin.from('pipeline_stages').delete().eq('lead_id', leadId);
    const { error: stageErr } = await admin.from('pipeline_stages').insert({
      lead_id: leadId,
      workspace_id: DEMO_WORKSPACE_ID,
      stage,
      changed_by: createdBy,
    });
    if (stageErr) throw new Error(`stage for ${demo.business_name}: ${stageErr.message}`);
  }

  console.log(`  ${inserted} lead(s) inserted, ${updated} updated`);
}

async function main() {
  const reset = process.argv.includes('--reset');

  console.log(`Seeding demo workspace into ${env.supabaseUrl}\n`);
  await preflight();

  console.log('Workspace:');
  await ensureWorkspace();
  if (reset) await resetDemoData();

  console.log('\nAccounts:');
  const ids: Record<string, string> = {};
  for (const account of DEMO_ACCOUNTS) {
    ids[account.key] = await ensureAccount(account);
  }

  console.log('\nLeads:');
  await seedLeads(ids.admin);

  const { count: leadCount } = await admin
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', DEMO_WORKSPACE_ID);

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Demo workspace ready — ${leadCount ?? 0} lead(s).`);
  console.log('\nSign in at /login with:');
  for (const account of DEMO_ACCOUNTS) {
    console.log(`  ${account.role.padEnd(5)} ${account.email}`);
  }
  console.log(
    '\nPasswords come from DEMO_ADMIN_PASSWORD / DEMO_USER_PASSWORD, or the\n' +
      'defaults in this script. Set them in the environment before seeding a\n' +
      'shared or production project.'
  );
}

main().catch((err) => {
  console.error(`\n[seed:demo] failed: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
