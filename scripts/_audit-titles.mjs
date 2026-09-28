#!/usr/bin/env node
/**
 * _audit-titles.mjs — one-shot audit to enumerate suspicious title patterns
 * across all posts in src/data/post/. Patterns flagged:
 *
 *   (1) Truncated-title: title ends with a non-terminal word, e.g.
 *       - "...Tool Steel: Sligh"      (colon + 3-5 letters, no terminator)
 *       - "...High-Speed"            (missing "Steel")
 *       - "...Hot-Work"              (missing "Tool Steel")
 *       - "...Cold-Work"             (missing "Tool Steel")
 *       - "...5-Factor"              (mid-phrase break)
 *       - "...Lower to"              (colon + trailing preposition phrase)
 *       - "...Hard"                  (adjective, no noun)
 *
 *   (2) Excerpt self-repetition: the title string appears twice consecutively
 *       in the excerpt field, separated by a period.
 *
 * Idempotent: read-only. Writes summary to stdout. Exit 1 if any finding.
 *
 * Usage:  node scripts/_audit-titles.mjs
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const POST_DIR = 'src/data/post';
const files = readdirSync(POST_DIR).filter((f) => /\.mdx?$/.test(f)).sort();

// Allow known terminal-grade suffixes for materials-encyclopedia
// (anything else ending without one of these in this category is suspect).
const ACCEPTABLE_TAIL_FOR_STEEL_GRADES = [
  'Steel', 'Alloy', 'Iron', 'Carbide', 'Cemented Carbide',
  'Tool Steel', 'High-Speed Steel', 'Cold-Work Tool Steel',
  'Hot-Work Tool Steel', 'Stainless Steel', 'Martensitic Stainless Steel',
  'Cobalt-Bearing Tungsten Super High-Speed Steel',
  'Cobalt-Bearing High-Speed Steel',
  'Cobalt-Bearing Super High-Speed Steel',
  'Refined Cold-Work Tool Steel',
];

const PATTERNS_TRUNC = [
  /:\s+[A-Z][a-z]{1,4}'$/,                 // ': Sligh', ': Hard', ': Option', ': Lowe', ': Excel'
  /:\s+[a-z]+\s+to'$/i,                    // ': Lower to'
  /\bHot-Work'$/i,
  /\bCold-Work'$/i,
  /\bHigh-Speed'$/,
  /\b5-Factor'$/,                          // truncated phrase
  /\b4-Factor'$/,
  /\b3-Factor'$/,
  /\bThe Industrial Knives\b/,
];

const PATTERN_EXCERPT_DUP = /excerpt:\s*'([^']+?)\1/;

const findings = { truncated: [], excerptDup: [], other: [] };

for (const f of files) {
  const full = join(POST_DIR, f);
  const raw = readFileSync(full, 'utf8');
  const titleMatch = raw.match(/^title:\s*'([^']+)'$/m);
  const excerptMatch = raw.match(/^excerpt:\s*'([^']+)'$/m);
  if (!titleMatch) continue;
  const title = titleMatch[1];

  for (const re of PATTERNS_TRUNC) {
    if (re.test("'" + title + "'")) {
      findings.truncated.push({ file: f, title, reason: re.toString() });
      break;
    }
  }

  if (excerptMatch) {
    const ex = excerptMatch[1];
    const dupMatch = ex.match(/^(.+?)\.\s*\1\./);
    if (dupMatch) {
      findings.excerptDup.push({ file: f, excerpt: ex.slice(0, 80) + '...' });
    }
  }
}

console.log('=== Truncated title candidates ===');
if (!findings.truncated.length) console.log('  (none)');
for (const t of findings.truncated) {
  console.log(`  [${t.file}]  title='${t.title}'  /${t.reason}/`);
}
console.log('');
console.log('=== Excerpt self-repetition ===');
if (!findings.excerptDup.length) console.log('  (none)');
for (const e of findings.excerptDup) {
  console.log(`  [${e.file}]  ${e.excerpt}`);
}
console.log('');
console.log(`Totals: truncated=${findings.truncated.length}  excerptDup=${findings.excerptDup.length}`);
process.exit(findings.truncated.length + findings.excerptDup.length > 0 ? 1 : 0);