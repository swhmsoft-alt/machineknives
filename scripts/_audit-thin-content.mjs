#!/usr/bin/env node
/**
 * _audit-thin-content.mjs — enumerate all posts in src/data/post/ that
 * still contain the generator template filler:
 *
 *   "... is a reference entry for industrial cutting tools and blades.
 *    The composition, hardness, heat treatment and application guidance
 *    are summarised below for engineering reference."
 *
 * Groups by steel family (regex on the title / slug) and prints a
 * digest table so the expansion script can target each family
 * uniformly. Read-only. Exits 1 if any findings.
 *
 * Usage:  node scripts/_audit-thin-content.mjs
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const POST_DIR = 'src/data/post';
const TEMPLATE = /is a reference entry for industrial cutting tools and blades/;
const files = readdirSync(POST_DIR).filter((f) => /\.mdx?$/.test(f)).sort();

// Family → pattern (matched on the canonical SLUG, not the title —
// slugs are stable; titles vary in punctuation/case).
const FAMILY_RULES = [
  { key: 'cold-work-D',       re: /^d[2-7]$/i },
  { key: 'cold-work-A',       re: /^a[2-468]$/i },
  { key: 'cold-work-O',       re: /^o1$/i },
  { key: 'cold-work-DC53',    re: /^dc53$/i },
  { key: 'cold-work-6CrW2Si', re: /^6crw2si$/i },
  { key: 'cold-work-ASP',     re: /^asp20\d\d$/i },
  { key: 'hot-work-H',        re: /^h1[13]$/i },
  { key: 'hss-M',             re: /^m[1-7]$|^m[12]\d$/i },
  { key: 'hss-T',             re: /^t1[15]$/i },
  { key: 'stainless-4xx',     re: /^4[24]0[a-c]$/i },
  { key: 'stainless-17-4PH',  re: /^17-4ph$/i },
  { key: 'carbide-YG',        re: /^yg[1-9]\d?$/i },
];

const families = new Map();      // family → [{ slug, title, wc, inTemplate }]
const orphans = [];
let totalAffected = 0;
let totalWithSubstantiveBody = 0;

for (const f of files) {
  const full = join(POST_DIR, f);
  const raw = readFileSync(full, 'utf8');
  const slug = f.replace(/\.mdx?$/, '');
  const titleMatch = raw.match(/^title:\s*'([^']+)'$/m);
  const title = titleMatch ? titleMatch[1] : '(no title)';
  const hasTemplate = TEMPLATE.test(raw);
  // Heuristic: "thin content" = template opening sentence present AND total wc < 200
  // (because the template + chemistry table alone is ~150 wc for materials).
  const wc = raw.split(/\s+/).filter(Boolean).length;

  // Find family from slug.
  let fam = 'other';
  for (const r of FAMILY_RULES) {
    if (r.re.test(slug)) { fam = r.key; break; }
  }
  if (fam === 'other') {
    orphans.push({ slug, title, wc, hasTemplate });
  } else {
    if (!families.has(fam)) families.set(fam, []);
    families.get(fam).push({ slug, title, wc, hasTemplate });
  }

  if (hasTemplate) totalAffected++;

  if (hasTemplate) totalAffected++;
  // Substantive body detection: presence of chemistry + hardness + heat-treatment keywords
  if (/Composition|Hardness|Heat treatment/i.test(raw)) totalWithSubstantiveBody++;
}

console.log('=== Family breakdown ===');
const sortedFamilies = [...families.entries()].sort((a, b) => b[1].length - a[1].length);
for (const [fam, list] of sortedFamilies) {
  const withTemplate = list.filter((x) => x.hasTemplate).length;
  const thinCount = list.filter((x) => x.hasTemplate && x.wc < 200).length;
  console.log(`  ${fam.padEnd(20)} n=${String(list.length).padStart(2)}  withTemplate=${String(withTemplate).padStart(2)}  thin(<200wc)=${thinCount}`);
}
console.log('');
console.log('=== Detail (per-family) ===');
for (const [fam, list] of sortedFamilies) {
  console.log(`-- ${fam} --`);
  for (const x of list.sort((a, b) => a.slug.localeCompare(b.slug))) {
    const flag = x.hasTemplate ? 'T' : ' ';
    console.log(`  [${flag}]  ${x.slug.padEnd(45)} wc=${String(x.wc).padStart(4)}  title="${x.title}"`);
  }
}
console.log('');
console.log(`=== Orphans (no family match) ===`);
if (!orphans.length) console.log('  (none)');
else for (const o of orphans) console.log(`  ${o.slug.padEnd(40)} title="${o.title}"`);
console.log('');
console.log(`Totals: families=${families.size}  postsScanned=${files.length}  templateHits=${totalAffected}  substantiveBody=${totalWithSubstantiveBody}  orphans=${orphans.length}`);
process.exit(totalAffected > 0 ? 1 : 0);