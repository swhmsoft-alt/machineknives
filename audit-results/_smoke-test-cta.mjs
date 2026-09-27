// audit-results/_smoke-test-cta.mjs
// Smoke test for src/utils/seo-cta.mjs. Run with: node audit-results/_smoke-test-cta.mjs
import { appendCtaIfMissing, hasCta } from '../src/utils/seo-cta.mjs';

const tests = [
  // [name, input, expectedSubstr, expectedMaxLen]
  ['empty', '', '', 0],
  ['already-has-cta-preserved', 'D2 bed knife for tissue. Request a quote online.', 'Request a quote', 60],
  ['missing-cta-short-full-suffix', 'D2 bed knife for tissue.', '\u2192 industrial-knives.net/contact', 60],
  ['missing-cta-medium', 'D2 high-carbon high-chromium cold-work tool steel bed knife for paper and tissue converting lines. HRC 60, 15 micro-hone, 18 degree clearance angle, ISO 9001:2015 material traceability.', '\u2192 /contact', 160],
  ['missing-cta-very-long-truncated', 'a'.repeat(200), '\u2192 /contact', 160],
  ['disabled-noop', 'D2 bed knife', '', 12], // enabled:false -> return input unchanged (12 chars)
];

let pass = 0;
let fail = 0;
for (const [name, input, expectedSubstr, expectedMaxLen] of tests) {
  const opts = name.startsWith('disabled') ? { enabled: false } : {};
  const result = appendCtaIfMissing(input, opts);
  const okSubstr = expectedSubstr === '' || result.includes(expectedSubstr);
  const okLen = expectedMaxLen === 0 ? result.length === 0 : result.length <= expectedMaxLen;
  const ok = okSubstr && okLen;
  if (ok) {
    pass++;
    console.log(`  \u2713 ${name}: ${result.length} chars`);
  } else {
    fail++;
    console.log(`  \u2717 ${name}: expected len<=${expectedMaxLen} and substring "${expectedSubstr}"`);
    console.log(`     got: ${result.length} chars: ${JSON.stringify(result)}`);
  }
}

// hasCta tests
const ctaCases = [
  ['plain text', 'D2 bed knife for paper.', false],
  ['with "request a quote"', 'D2 bed knife. Request a quote now.', true],
  ['with "compare"', 'Compare D2 vs SKD11.', true],
  ['empty', '', false],
];
for (const [name, input, expected] of ctaCases) {
  const got = hasCta(input);
  if (got === expected) {
    pass++;
    console.log(`  \u2713 hasCta(${name}): ${got}`);
  } else {
    fail++;
    console.log(`  \u2717 hasCta(${name}): expected ${expected}, got ${got}`);
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);