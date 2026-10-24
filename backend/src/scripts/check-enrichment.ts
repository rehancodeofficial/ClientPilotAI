/**
 * Exercises website resolution and contact enrichment without writing anything.
 *
 *   npx ts-node src/scripts/check-enrichment.ts "Karachi" restaurant
 *
 * Runs the same discovery the API runs, then enriches each business the way
 * the background queue does, and prints what each step actually found. Use it
 * to tell "this area's businesses publish nothing" apart from "a step in the
 * pipeline is broken".
 */
import 'dotenv/config';
import { discoverBusinessesByLocation, reverseGeocodeCountry } from '../services/osm';
import { enrichLeadContact } from '../services/enrichment';

const LIMIT = Number(process.env.CHECK_LIMIT || 12);

async function main() {
  const [location = 'Karachi', ...categories] = process.argv.slice(2);

  console.log(`Discovering "${location}" for [${categories.join(', ') || 'all categories'}]…\n`);
  const discovery = await discoverBusinessesByLocation({
    location,
    categories,
    radiusMeters: 3000,
    limit: LIMIT,
  });

  // Mirrors the route: the searched country, not the per-business tag, is what
  // tells the resolver which country TLDs to try.
  const searchCountryCode =
    discovery.geocodedLocation.countryCode ||
    (await reverseGeocodeCountry(discovery.geocodedLocation.lat, discovery.geocodedLocation.lng));

  const businesses = discovery.businesses.slice(0, LIMIT);
  console.log(
    `${discovery.businesses.length} businesses near ${discovery.geocodedLocation.displayName} ` +
      `(country: ${searchCountryCode ?? 'unknown'}); enriching the first ${businesses.length}.\n`
  );

  const fromOsm = {
    website: businesses.filter((b) => b.website).length,
    phone: businesses.filter((b) => b.phone).length,
    email: businesses.filter((b) => b.email).length,
  };

  let website = 0;
  let email = 0;
  let phone = 0;
  let socials = 0;
  const bySource = new Map<string, number>();

  for (const business of businesses) {
    const started = Date.now();
    const result = await enrichLeadContact({
      name: business.name,
      websiteUrl: business.website,
      rawOsmTags: business.rawTags,
      countryCode: business.rawTags['addr:country'] || searchCountryCode,
    });

    if (result.website) {
      website += 1;
      const key = result.websiteSource || 'unknown';
      bySource.set(key, (bySource.get(key) || 0) + 1);
    }
    if (result.email) email += 1;
    if (result.phone) phone += 1;
    if (Object.keys(result.socialLinks).length > 0) socials += 1;

    console.log(
      `• ${business.name}\n` +
        `    website: ${result.website ?? '—'}${result.websiteSource ? ` [${result.websiteSource}]` : ''}` +
        `${result.website && !result.websiteReachable ? ' (unreachable)' : ''}\n` +
        `    email:   ${result.email ?? '—'}${result.email ? ` [${result.source}]` : ''}\n` +
        `    phone:   ${result.phone ?? '—'}\n` +
        `    social:  ${Object.keys(result.socialLinks).join(', ') || '—'}   (${Date.now() - started}ms)`
    );
  }

  const pct = (n: number) => `${n}/${businesses.length} (${Math.round((n / businesses.length) * 100)}%)`;
  console.log(
    `\n── Summary ──────────────────────────────────────────────\n` +
      `From OSM tags alone:  website ${fromOsm.website}, phone ${fromOsm.phone}, email ${fromOsm.email}\n` +
      `After enrichment:     website ${pct(website)}, email ${pct(email)}, ` +
      `phone ${pct(phone)}, social ${pct(socials)}\n` +
      `Website sources:      ${
        [...bySource.entries()].map(([k, v]) => `${k} ${v}`).join(', ') || 'none'
      }`
  );
}

main().catch((err: unknown) => {
  console.error('\n❌ Check failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
