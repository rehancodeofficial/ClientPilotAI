/**
 * Regression tests for pulling a phone number and an email out of a page.
 *
 *   npx ts-node src/scripts/check-contact-extraction.ts
 *
 * Offline and instant — no network. The negative cases are the point: the
 * previous phone pattern matched any two runs of digits separated by a space,
 * so it returned "2024 10" from a copyright footer, and the email sweep took
 * the first regex match on the page, which is often an analytics or
 * error-reporting address rather than the business's inbox.
 */
import { extractPhone, extractEmails } from '../services/enrichment';

const cases: Array<[string, string | null]> = [
  ['<a href="tel:+922134534567">Call us</a>', '+922134534567'],
  ['<p>Call 0300 1234567 today</p>', '0300 1234567'],
  ['<p>Phone: +44 20 7630 6644</p>', '+44 20 7630 6644'],
  ['<p>(021) 345-67890</p>', '(021) 345-67890'],
  ['<footer>© 2024 10 Acme Ltd</footer>', null],
  ['<p>Order #12345 placed 2026 01 15</p>', null],
  ['<script>var id="+1 999 0000000"</script><p>no phone here</p>', null],
];

let pass = 0;
for (const [html, expected] of cases) {
  const got = extractPhone(html);
  const ok = expected === null ? got === null : got === expected;
  if (ok) pass += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  phone  got=${JSON.stringify(got)} expected=${JSON.stringify(expected)}  <- ${html.slice(0, 48)}`);
}

const emailCases: Array<[string, string | null]> = [
  ['<a href="mailto:info@shop.pk">Email</a><p>tracker@sentry.io</p>', 'info@shop.pk'],
  ['<p>sales@biz.com and bob@biz.com</p>', 'sales@biz.com'],
  ['<p>yourname@example.com</p>', null],
  ['<img src="logo@2x.png"><p>hello@cafe.co.uk</p>', 'hello@cafe.co.uk'],
  ['<p>bob@biz.com</p><a href="mailto:contact@biz.com">c</a>', 'contact@biz.com'],
];
for (const [html, expected] of emailCases) {
  const [got = null] = extractEmails(html);
  const ok = got === expected;
  if (ok) pass += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  email  got=${JSON.stringify(got)} expected=${JSON.stringify(expected)}  <- ${html.slice(0, 48)}`);
}
console.log(`\n${pass}/${cases.length + emailCases.length} passed`);

if (pass !== cases.length + emailCases.length) process.exitCode = 1;
