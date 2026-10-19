/**
 * Runs the website audit engine against one or more URLs and prints the report.
 *
 *   npx ts-node src/scripts/audit-website.ts https://example.com
 */
import { auditWebsite } from '../services/websiteAudit';

async function main() {
  const urls = process.argv.slice(2);
  if (urls.length === 0) {
    console.error('Usage: ts-node src/scripts/audit-website.ts <url> [url...]');
    process.exit(1);
  }

  for (const url of urls) {
    const report = await auditWebsite(url);
    console.log(`\n${'='.repeat(70)}`);
    console.log(`${report.url}  →  ${report.score}/100  (${report.grade})`);
    console.log(`${'='.repeat(70)}`);
    if (!report.reachable) {
      console.log(`UNREACHABLE: ${report.failureReason}`);
      continue;
    }
    console.log(report.verdict);
    console.log(`\nMetrics: ttfb=${report.metrics.ttfbMs}ms load=${report.metrics.loadMs}ms ` +
      `html=${Math.round((report.metrics.htmlBytes || 0) / 1024)}KB words=${report.metrics.wordCount} ` +
      `images=${report.metrics.imageCount} scripts=${report.metrics.scriptCount}`);
    console.log(`Tech: ${report.technologies.join(', ') || 'none detected'}`);
    console.log('\nCategories:');
    for (const category of report.categories) {
      console.log(
        `  ${category.label.padEnd(26)} ${String(category.score).padStart(3)}/100 ` +
          `(${category.grade}, weight ${category.weight}%, ${category.checksPassed}/${category.checksTotal} checks passed)`
      );
    }
    console.log(`\nIssues (${report.issues.length}):`);
    for (const issue of report.issues) {
      console.log(`  [${issue.severity.toUpperCase().padEnd(8)}] -${String(issue.points).padStart(2)}  ${issue.title}`);
    }
    console.log(`\nStrengths (${report.strengths.length}):`);
    for (const strength of report.strengths) console.log(`  ✓ ${strength}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
