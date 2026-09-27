// scripts/rebrand-kaipu-to-industrial-knives.mjs
//
// One-shot brand-consolidation for machineknives project.
// Per audit-results/on-page-seo-audit-v1.md F-001 / F-002:
//   - src/config.yaml already declares site.name = "Industrial Knives"
//     and site.url  = "https://industrial-knives.net/"
//   - 401 occurrences of "KAIPU" still scattered across 143 source files
//   - 132 occurrences of "machine-knives.net" (legacy) across 128 files
//
// Strategy: longest-first replacement so a phrase rule never collides
// with a bare-word rule. The rule set is idempotent — re-running this
// script on a clean tree must yield zero changed files.
//
// Usage:
//   node scripts/rebrand-kaipu-to-industrial-knives.mjs --dry-run
//   node scripts/rebrand-kaipu-to-industrial-knives.mjs            # apply
//   node scripts/rebrand-kaipu-to-industrial-knives.mjs --brand    # brand-only pass
//   node scripts/rebrand-kaipu-to-industrial-knives.mjs --domain   # domain-only pass
//
// Run --dry-run first, eyeball the diff stats, then run for real.
// All file I/O is UTF-8 explicit (see .clinerules §0.5.1).

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const APPLY = !process.argv.includes('--dry-run');
const BRAND_ONLY = process.argv.includes('--brand');
const DOMAIN_ONLY = process.argv.includes('--domain');

// Longest-first. Each rule: [from, to]. String = case-sensitive substring
// (split/join avoids $& / $$ escape hazards). RegExp = global replace.
// Order matters: phrases must precede bare words, lowercase hostnames
// must precede bare-word regexes.
const BRAND_RULES = [
  // Multi-word brand phrases (longest).
  ['KAIPU Engineering', 'Industrial Knives Engineering'],
  ['Kaipu Engineering', 'Industrial Knives Engineering'],
  ['KAIPU Industrial Blades', 'Industrial Knives'],
  ['Kaipu Industrial Blades', 'Industrial Knives'],
  ['KAIPU industrial blades', 'Industrial Knives'],
  ['kaipu industrial blades', 'Industrial Knives'],

  // Bare-word brand mentions in prose.
  // Negative lookahead (?![-_]) preserves URL slugs (kaipu-...) and code
  // identifiers (kaipu_...) — per user direction URLs must stay stable,
  // so anything kaipu-foo or kaipu_foo is left alone.
  [/\bKaipu\b(?![-_])/g, 'Industrial Knives'],
  [/\bKAIPU\b(?![-_])/g, 'Industrial Knives'],
  [/\bkaipu\b(?![-_])/g, 'Industrial Knives'],
];

const DOMAIN_RULES = [
  // Email — explicit per user. Full address rewrite, not just domain.
  // Previous generic "@kaipu-industrial.com → @industrial-knives.com" was
  // wrong because it kept the local part (engineering@) — user wants the
  // whole new address to be info@industrial-knives.com.
  ['engineering@kaipu-industrial.com', 'info@industrial-knives.com'],

  // Site hostname: legacy → canonical. Config.yaml already declares
  // industrial-knives.net; this clears any hardcoded legacy URLs.
  ['www.machine-knives.net', 'www.industrial-knives.net'],
  ['machine-knives.net', 'industrial-knives.net'],
  ['Machine-Knives.net', 'Industrial-Knives.net'],

  // Legacy kaipu.com (if anything still references it).
  ['www.kaipu.com', 'www.industrial-knives.net'],
  ['kaipu.com', 'industrial-knives.net'],
];

const TARGETS = [
  'src/data',
  'src/components',
  'src/layouts',
  'src/pages',
  'src/lib',
  'src/utils',
  'src/navigation.ts',
  'src/content.config.ts',
  'src/config.yaml',
];

// Skip the audit cache, build output, vendored lockfiles, and anything
// that would invalidate the audit we are trying to close out.
const EXCLUDE_DIRS = new Set([
  'node_modules', '.astro', '.git', 'dist', '.next', '.vercel',
  'audit-results', 'public', '.vscode', '.cache', '.turbo',
]);

const EXTS = new Set([
  '.md', '.mdx',
  '.astro',
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.json', '.yaml', '.yml',
]);

function applyRules(text, rules) {
  let out = text;
  for (const [from, to] of rules) {
    if (typeof from === 'string') {
      if (out.includes(from)) out = out.split(from).join(to);
    } else {
      out = out.replace(from, to);
    }
  }
  return out;
}

async function* walk(target) {
  const abs = path.resolve(ROOT, target);
  let stat;
  try { stat = await fs.stat(abs); }
  catch { return; }
  if (stat.isFile()) { yield abs; return; }
  yield* walkDir(abs);
}

async function* walkDir(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(full);
    } else if (EXTS.has(path.extname(entry.name))) {
      yield full;
    }
  }
}

function countHits(text) {
  const matches = text.match(/Kaipu|KAIPU|kaipu|machine-knives/g);
  return matches ? matches.length : 0;
}

const stats = { scanned: 0, changed: 0, hits: 0, sample: [] };

const rules = BRAND_ONLY ? BRAND_RULES
  : DOMAIN_ONLY ? DOMAIN_RULES
  : [...BRAND_RULES, ...DOMAIN_RULES];

// === MAIN LOOP ===
const t0 = Date.now();

for (const target of TARGETS) {
  for await (const file of walk(target)) {
    stats.scanned++;
    const original = await fs.readFile(file, 'utf8');
    const updated = applyRules(original, rules);
    if (updated === original) continue;
    const occurrences = countHits(original);
    stats.changed++;
    stats.hits += occurrences;
    if (stats.sample.length < 200) {
      stats.sample.push({
        file: path.relative(ROOT, file),
        occurrences,
        delta: updated.length - original.length,
      });
    }
    if (APPLY) {
      await fs.writeFile(file, updated, 'utf8');
    }
  }
}

const ms = Date.now() - t0;
console.log(`\n[${APPLY ? 'APPLIED' : 'DRY-RUN'}] scanned ${stats.scanned} files in ${ms}ms`);
console.log(`                 changed ${stats.changed} files`);
console.log(`   estimated occurrences touched ${stats.hits}`);
console.log('\nFirst 25 changed files:');
for (const s of stats.sample) {
  console.log(`  ${s.file}  (~${s.occurrences} hits, Δ${s.delta >= 0 ? '+' : ''}${s.delta} bytes)`);
}
if (stats.changed > stats.sample.length) {
  console.log(`  ... and ${stats.changed - stats.sample.length} more (rerun with --dry-run to enumerate)`);
}
if (!APPLY && stats.changed > 0) {
  console.log('\nRe-run without --dry-run to apply.');
}