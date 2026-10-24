/**
 * Precision/recall check for website resolution.
 *
 *   npx ts-node src/scripts/check-website-resolver.ts
 *
 * The cases below are real businesses whose correct answer is known, half of
 * them chosen because an earlier, looser version of the resolver got them
 * wrong: it handed kaiser.com to "Kaiser Restaurant" and digitalpakistan.org
 * to "Biryani Of The Seas". A wrong website is worse than no website — the
 * user pitches the wrong company — so the cases expecting `null` matter as
 * much as the ones expecting a URL. Run this after touching the resolver.
 *
 * It queries live third-party sites, so an occasional failure can mean a
 * business changed its domain rather than a regression in this code.
 */
import 'dotenv/config';
import { resolveWebsite, candidateDomains } from '../services/websiteResolver';

// Businesses whose real website is known, to check the resolver's precision
// and recall at the same time. "expected" is the correct answer, or null when
// the right answer is "no website found".
const cases: Array<{ name: string; cc?: string; tags?: Record<string, unknown>; expected: string | null }> = [
  { name: 'Ginsoy Extreme Chinese', cc: 'pk', expected: 'ginsoy.com' },
  { name: 'Walkers of Whitehall', cc: 'gb', expected: 'walkersofwhitehall' },
  // Matched on the name, so either of this chain's domains is a correct
  // answer; the assertion is on the business, not on one particular domain.
  { name: 'Al Harmain Restaurant', cc: 'pk', expected: 'harmain' },
  { name: 'Kolachi Restaurant', cc: 'pk', expected: null },
  { name: 'Kaiser Restaurant', cc: 'pk', expected: null },
  { name: 'Biryani Of The Seas', cc: 'pk', expected: null },
  { name: 'New Quetta al-Hafiz Restaurant', cc: 'pk', expected: null },
  { name: 'Qadri Fast Food', cc: 'pk', expected: null },
  { name: 'Bilal Snacks', cc: 'pk', expected: null },
  { name: 'Pizza Hut', cc: 'pk', tags: { 'brand:wikidata': 'Q191615' }, expected: 'pizzahut' },
  { name: 'Tesco Express', cc: 'gb', tags: { 'brand:wikidata': 'Q9841' }, expected: null },
];

(async () => {
  let pass = 0;
  for (const c of cases) {
    const r = await resolveWebsite({ name: c.name, rawTags: c.tags, countryCode: c.cc });
    const got = r?.url ?? null;
    const ok = c.expected === null ? got === null : !!got && got.includes(c.expected);
    if (ok) pass += 1;
    console.log(
      `${ok ? 'PASS' : 'FAIL'}  ${c.name.padEnd(30)} got=${got ?? 'none'}` +
        `${r ? ` [${r.source}]` : ''}  expected=${c.expected ?? 'none'}` +
        `  probes=${candidateDomains(c.name, c.cc).length}`
    );
  }
  console.log(`\n${pass}/${cases.length} as expected`);
  if (pass !== cases.length) process.exitCode = 1;
})();

