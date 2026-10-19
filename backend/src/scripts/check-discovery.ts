/**
 * Exercises the business discovery pipeline without touching the database.
 *
 *   npx ts-node src/scripts/check-discovery.ts "Karachi" salon
 *
 * Prints whether the result came from an Overpass mirror or the Nominatim
 * fallback, which is the difference between "OpenStreetMap is busy" and "this
 * area really has no matching businesses".
 */
import 'dotenv/config';
import { discoverBusinessesByLocation } from '../services/osm';

async function main() {
  const [location = 'Karachi', ...categories] = process.argv.slice(2);
  const startedAt = Date.now();

  console.log(`Searching "${location}" for [${categories.join(', ') || 'all categories'}]…\n`);

  try {
    const result = await discoverBusinessesByLocation({
      location,
      categories,
      radiusMeters: 3000,
      limit: 25,
    });

    console.log(
      `\n✅ ${result.businesses.length} businesses in ${Date.now() - startedAt} ms ` +
        `near ${result.geocodedLocation.displayName}`
    );
    for (const business of result.businesses.slice(0, 10)) {
      console.log(
        `   ${business.name} — ${business.category}${business.website ? ` — ${business.website}` : ''}`
      );
    }
  } catch (err: unknown) {
    console.error(`\n❌ Discovery failed after ${Date.now() - startedAt} ms`);
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
