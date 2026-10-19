/**
 * Audits every lead in a workspace that does not have a stored audit yet.
 *
 *   npx ts-node src/scripts/backfill-audits.ts [--limit N] [--refresh] [--workspace <id>]
 *
 * The HTTP endpoint (POST /api/audits/run-all) caps a single request at 200
 * leads so it cannot hold a connection open indefinitely; this script has no
 * such limit and is the right tool for a first full backfill.
 */
import { supabaseAdmin } from '../lib/supabase';
import { performDigitalAudit } from '../services/audit';

const CONCURRENCY = 4;

function flag(name: string): string | null {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return null;
  return process.argv[index + 1] ?? '';
}

async function auditOne(workspaceId: string, lead: Record<string, any>) {
  const result = await performDigitalAudit(
    lead.business_name,
    lead.category,
    lead.website_url || lead.website,
    lead.phone || lead.contact_phone,
    lead.rating ?? null,
    lead.review_count ?? null,
    lead.raw_osm_tags as Record<string, unknown>
  );

  const { error } = await supabaseAdmin.from('business_audits').upsert(
    {
      workspace_id: workspaceId,
      lead_id: lead.id,
      website_exists: result.websiteExists,
      https_enabled: result.httpsEnabled,
      mobile_indicator: result.mobileIndicator,
      booking_detected: result.bookingDetected,
      ordering_detected: result.orderingDetected,
      contact_form_detected: result.contactFormDetected,
      social_presence_detected: result.socialPresenceDetected,
      digital_maturity_level: result.digitalMaturityLevel,
      audit_score: result.auditScore,
      audit_data: result.auditData,
      evidence: result.evidence,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'workspace_id,lead_id' }
  );

  if (error) throw new Error(`${lead.business_name}: ${error.message}`);

  const health = result.auditData.websiteHealthScore;
  return `${String(result.auditScore).padStart(3)}  ${health === null ? ' — ' : `${String(health).padStart(3)}`}  ${result.auditData.websiteGrade ?? ' '}  ${lead.business_name}`;
}

async function main() {
  const limit = Number(flag('limit') || '0') || Infinity;
  const refresh = process.argv.includes('--refresh');
  const workspaceFilter = flag('workspace');

  const { data: workspaces, error: wsErr } = await supabaseAdmin
    .from('workspaces')
    .select('id, name');
  if (wsErr) throw wsErr;

  for (const workspace of workspaces || []) {
    if (workspaceFilter && workspace.id !== workspaceFilter) continue;

    const { data: existing } = await supabaseAdmin
      .from('business_audits')
      .select('lead_id')
      .eq('workspace_id', workspace.id);
    const done = new Set((existing || []).map((row) => row.lead_id as string));

    const { data: leads, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const queue = (leads || []).filter((lead) => refresh || !done.has(lead.id)).slice(0, limit);
    console.log(
      `\n[${workspace.name}] ${queue.length} lead(s) to audit (${(leads || []).length} total, ${done.size} already audited)`
    );
    if (queue.length === 0) continue;
    console.log('BIZ  WEB  GR  BUSINESS');

    let ok = 0;
    let failed = 0;
    for (let i = 0; i < queue.length; i += CONCURRENCY) {
      const batch = queue.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(batch.map((lead) => auditOne(workspace.id, lead)));
      for (const result of results) {
        if (result.status === 'fulfilled') {
          ok += 1;
          console.log(result.value);
        } else {
          failed += 1;
          console.warn(`  ✗ ${result.reason instanceof Error ? result.reason.message : result.reason}`);
        }
      }
    }
    console.log(`[${workspace.name}] done — ${ok} audited, ${failed} failed`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
