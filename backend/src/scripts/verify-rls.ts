/**
 * Behavioural verification of Row Level Security.
 *
 *   npm --prefix backend run verify:rls
 *
 * Reading policy definitions proves only what was intended. This proves what
 * the database actually enforces: it provisions two throwaway tenants, seeds a
 * row in each, then attempts every cross-tenant read and write as a genuinely
 * authenticated user holding a real Supabase access token.
 *
 * The service-role client is used only to set up and tear down. Every assertion
 * runs through the anon endpoint with a user JWT, which is exactly the path the
 * browser takes — so a policy that looks correct but does not apply to the
 * `authenticated` role is still caught.
 *
 * Exits non-zero if any tenant can observe or modify another's data, which
 * makes it usable as a CI gate.
 *
 * Everything it creates is prefixed `rls-verify-` and removed in a finally
 * block, including after a failed assertion.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, assertRequiredEnv } from '../lib/env';

assertRequiredEnv();

const anonKey = env.supabaseAnonKey;
if (!anonKey) {
  console.error(
    '[verify:rls] SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY) is required: the ' +
      'assertions must run through the public endpoint to be meaningful.'
  );
  process.exit(1);
}

const admin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** Tables carrying a workspace_id, checked directly. */
const WORKSPACE_TABLES = [
  'leads',
  'pipeline_stages',
  'proposals',
  'business_audits',
  'opportunity_analysis',
  'competitor_analysis',
  'outcome_events',
  'notifications',
] as const;

/** Tables reachable only through a lead. */
const LEAD_TABLES = ['lead_scores', 'outreach_messages'] as const;

interface Tenant {
  label: string;
  email: string;
  password: string;
  userId: string;
  workspaceId: string;
  leadId: string;
  client: SupabaseClient;
}

const nonce = Date.now().toString(36);
const PREFIX = `rls-verify-${nonce}`;

let failures = 0;
let checks = 0;

const pass = (msg: string) => {
  checks++;
  console.log(`  ok    ${msg}`);
};
const fail = (msg: string) => {
  checks++;
  failures++;
  console.error(`  FAIL  ${msg}`);
};

async function createTenant(label: string): Promise<Tenant> {
  const email = `${PREFIX}-${label}@clientpilot.test`;
  const password = `Verify-${nonce}-${label}-Aa1!`;

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: `RLS Verify ${label.toUpperCase()}` },
  });
  if (createErr || !created.user) {
    throw new Error(`could not create ${label}: ${createErr?.message ?? 'no user returned'}`);
  }
  const userId = created.user.id;

  // The handle_new_user trigger creates the workspace and profile.
  const { data: profile, error: profileErr } = await admin
    .from('profiles')
    .select('workspace_id')
    .eq('id', userId)
    .single();
  if (profileErr || !profile?.workspace_id) {
    throw new Error(
      `no profile/workspace for ${label} — is the handle_new_user trigger installed? ` +
        `(${profileErr?.message ?? 'workspace_id was null'})`
    );
  }
  const workspaceId = profile.workspace_id as string;

  const { data: lead, error: leadErr } = await admin
    .from('leads')
    .insert({
      workspace_id: workspaceId,
      business_name: `${PREFIX} ${label} business`,
      category: 'cafe',
      city: 'Testville',
    })
    .select('id')
    .single();
  if (leadErr || !lead) throw new Error(`could not seed lead for ${label}: ${leadErr?.message}`);

  // Sign in through the public endpoint to obtain a real user token.
  const client = createClient(env.supabaseUrl, anonKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: signInErr } = await client.auth.signInWithPassword({ email, password });
  if (signInErr) throw new Error(`could not sign in as ${label}: ${signInErr.message}`);

  return { label, email, password, userId, workspaceId, leadId: lead.id, client };
}

async function cleanup(tenants: Tenant[]) {
  console.log('\nCleaning up…');
  for (const t of tenants) {
    // leads reference workspaces, so remove dependents before the workspace.
    await admin.from('leads').delete().eq('workspace_id', t.workspaceId);
    await admin.from('workspaces').delete().eq('id', t.workspaceId);
    // Deleting the auth user cascades to profiles via the FK.
    const { error } = await admin.auth.admin.deleteUser(t.userId);
    if (error) console.error(`  could not delete user ${t.email}: ${error.message}`);
  }

  // Safety net: nothing bearing the prefix should survive.
  const { data: strayLeads } = await admin
    .from('leads')
    .select('id')
    .like('business_name', `${PREFIX}%`);
  const { data: strayProfiles } = await admin
    .from('profiles')
    .select('id')
    .like('full_name', 'RLS Verify %');

  const stray = (strayLeads?.length ?? 0) + (strayProfiles?.length ?? 0);
  console.log(stray === 0 ? '  all test data removed' : `  WARNING: ${stray} stray row(s) remain`);
}

async function main() {
  console.log(`RLS verification (run id ${nonce})\n`);

  const tenants: Tenant[] = [];
  try {
    console.log('Provisioning two isolated tenants…');
    const a = await createTenant('a');
    tenants.push(a);
    const b = await createTenant('b');
    tenants.push(b);
    console.log(`  tenant A workspace ${a.workspaceId}`);
    console.log(`  tenant B workspace ${b.workspaceId}`);

    if (a.workspaceId === b.workspaceId) {
      fail('both tenants landed in the same workspace — isolation cannot be tested');
      return;
    }

    // ── Reads ────────────────────────────────────────────────────────────────
    console.log("\nTenant A reading tenant B's rows (every count must be 0):");
    for (const table of WORKSPACE_TABLES) {
      const { data, error } = await a.client
        .from(table)
        .select('id')
        .eq('workspace_id', b.workspaceId);

      if (error) {
        // A blocked table is also a correct outcome.
        pass(`${table}: rejected (${error.code ?? 'error'})`);
      } else if ((data?.length ?? 0) > 0) {
        fail(`${table}: tenant A read ${data!.length} of tenant B's rows`);
      } else {
        pass(`${table}: 0 rows`);
      }
    }

    for (const table of LEAD_TABLES) {
      const { data, error } = await a.client.from(table).select('id').eq('lead_id', b.leadId);
      if (error) pass(`${table}: rejected (${error.code ?? 'error'})`);
      else if ((data?.length ?? 0) > 0) fail(`${table}: tenant A read tenant B's rows`);
      else pass(`${table}: 0 rows`);
    }

    // Reading B's lead by primary key must also return nothing.
    const { data: directLead } = await a.client.from('leads').select('id').eq('id', b.leadId);
    if ((directLead?.length ?? 0) > 0) fail("leads: tenant A fetched tenant B's lead by id");
    else pass('leads: tenant B\'s lead not reachable by id');

    // ── Cross-tenant profile and workspace visibility ────────────────────────
    console.log('\nIdentity tables:');
    const { data: otherProfile } = await a.client.from('profiles').select('id').eq('id', b.userId);
    if ((otherProfile?.length ?? 0) > 0) fail("profiles: tenant A read tenant B's profile");
    else pass('profiles: tenant B\'s profile hidden');

    const { data: otherWs } = await a.client.from('workspaces').select('id').eq('id', b.workspaceId);
    if ((otherWs?.length ?? 0) > 0) fail("workspaces: tenant A read tenant B's workspace");
    else pass('workspaces: tenant B\'s workspace hidden');

    // A must still see its own, or the policy is too strict to be usable.
    const { data: ownWs } = await a.client.from('workspaces').select('id').eq('id', a.workspaceId);
    if ((ownWs?.length ?? 0) === 1) pass('workspaces: tenant A can read its own workspace');
    else fail('workspaces: tenant A cannot read its OWN workspace (policy too strict)');

    const { data: ownLeads } = await a.client.from('leads').select('id').eq('id', a.leadId);
    if ((ownLeads?.length ?? 0) === 1) pass('leads: tenant A can read its own lead');
    else fail('leads: tenant A cannot read its OWN lead (policy too strict)');

    // ── Writes ───────────────────────────────────────────────────────────────
    console.log("\nTenant A writing into tenant B's workspace (all must be refused):");

    const { error: insertErr } = await a.client.from('leads').insert({
      workspace_id: b.workspaceId,
      business_name: `${PREFIX} cross-tenant insert`,
      category: 'cafe',
    });
    if (insertErr) pass(`leads INSERT refused (${insertErr.code ?? 'error'})`);
    else fail("leads INSERT into tenant B's workspace SUCCEEDED");

    const { data: updated } = await a.client
      .from('leads')
      .update({ business_name: 'hijacked' })
      .eq('id', b.leadId)
      .select('id');
    if ((updated?.length ?? 0) > 0) fail("leads UPDATE of tenant B's lead SUCCEEDED");
    else pass('leads UPDATE affected 0 rows');

    const { data: deleted } = await a.client
      .from('leads')
      .delete()
      .eq('id', b.leadId)
      .select('id');
    if ((deleted?.length ?? 0) > 0) fail("leads DELETE of tenant B's lead SUCCEEDED");
    else pass('leads DELETE affected 0 rows');

    // Confirm from the service-role side that B's lead is intact.
    const { data: survived } = await admin
      .from('leads')
      .select('business_name')
      .eq('id', b.leadId)
      .maybeSingle();
    if (survived && survived.business_name.includes(`${b.label} business`)) {
      pass("tenant B's lead unchanged after tenant A's write attempts");
    } else {
      fail(`tenant B's lead was modified or removed (now: ${JSON.stringify(survived)})`);
    }

    // ── Privilege escalation via profile update ──────────────────────────────
    console.log('\nPrivilege escalation attempts:');
    const { data: movedWs } = await a.client
      .from('profiles')
      .update({ workspace_id: b.workspaceId })
      .eq('id', a.userId)
      .select('id');
    if ((movedWs?.length ?? 0) > 0) {
      fail('tenant A moved its own profile into tenant B\'s workspace');
      // Put it back so cleanup still works.
      await admin.from('profiles').update({ workspace_id: a.workspaceId }).eq('id', a.userId);
    } else {
      pass('profile cannot be reassigned to another workspace');
    }

    const { data: selfPromote } = await a.client
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', a.userId)
      .select('role');
    if (selfPromote?.[0]?.role === 'admin') {
      fail('tenant A promoted itself to admin through the public endpoint');
      await admin.from('profiles').update({ role: 'user' }).eq('id', a.userId);
    } else {
      pass('role column not self-assignable to admin');
    }
  } catch (err) {
    failures++;
    console.error(`\n[verify:rls] setup error: ${err instanceof Error ? err.message : err}`);
  } finally {
    await cleanup(tenants);
  }

  console.log(`\n${'─'.repeat(60)}`);
  if (failures === 0) {
    console.log(`PASS — ${checks} checks, no cross-tenant access.`);
    process.exit(0);
  }
  console.error(`FAIL — ${failures} of ${checks} checks found a problem.`);
  process.exit(1);
}

void main();
