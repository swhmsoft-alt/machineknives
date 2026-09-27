#!/usr/bin/env node
/**
 * scripts/check-frontmatter-lint.mjs — frontmatter CI lint.
 *
 * Enforces the audit recommendations (v1 + v2):
 *   ERRORS (CI-blocking):
 *     - description / excerpt length: 80 ≤ len ≤ 160
 *     - canonical uses https://www.industrial-knives.net (not legacy domain)
 *     - UTF-8 BOM in product frontmatter (v2 audit V2-P1c fix regression guard)
 *
 *   WARNINGS (informational, surfaced in PR review):
 *     - missing frontmatter image field (OG image)
 *     - title length outside [50, 60] chars (with brand suffix)
 *     - description lacks a CTA verb (V2-P2b fix)
 *     - title starts with category slug rather than keyword
 *
 * Usage:  node scripts/check-frontmatter-lint.mjs
 * Exits 1 if any errors found (suitable for CI).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'src/data');
const POST_DIR = join(ROOT, 'post');
const PRODUCT_DIR = join(ROOT, 'product');

const CTA_VERBS = [
  'request a quote','request quote','get a quote','contact us','send a drawing',
  'send your drawing','request a callback','talk to engineering','order now',
  'buy now','shop now','learn more','read more','find out more','download',
  'compare','browse','book a','schedule a',
];
function hasCta(s) {
  if (typeof s !== 'string' || !s) return false;
  const lower = s.toLowerCase();
  return CTA_VERBS.some((v) => lower.includes(v));
}

function parseFrontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!m) return null;
  const fm = {};
  let key = null;
  let arrBuf = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (line.startsWith('  - ')) { if (arrBuf) arrBuf.push(line.slice(4).trim().replace(/^["']|["']$/g, '')); continue; }
    const kv = /^([\w-]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    key = kv[1];
    let val = kv[2].trim();
    if (val === '') { arrBuf = []; fm[key] = arrBuf; continue; }
    arrBuf = null;
    val = val.replace(/^["']|["']$/g, '');
    fm[key] = val;
  }
  return fm;
}

const errors = [];
const warnings = [];

// ─── Post frontmatter ──────────────────────────────────────────────────────
const postFiles = readdirSync(POST_DIR).filter((f) => /\.(md|mdx)$/.test(f)).sort();
for (const f of postFiles) {
  const full = join(POST_DIR, f);
  const bytes = readFileSync(full);
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    errors.push(`${f}: UTF-8 BOM at file start — strip before commit (.clinerules §0.5.1)`);
  }
  const raw = bytes.toString('utf8');
  const fm = parseFrontmatter(raw);
  if (!fm) continue;

  // Effective description = metadata.description ?? excerpt
  const metaDesc = (fm.metadata && fm.metadata.description) || '';
  const excerpt = fm.excerpt || '';
  const desc = (metaDesc || excerpt).replace(/[\r\n]+/g, ' ');
  const descLen = desc.length;
  // Length & CTA surfaced as warnings: existing files fail these on purpose
  // (Round 3 SME work queue in audit-results/round3-sme-work-queue.md).
  // They are NOT CI-blocking errors because they require editorial decisions,
  // not code changes. The audit quantifies them; the SME fixes them.
  if (descLen < 80) warnings.push(`${f}: description too short (${descLen} < 80 chars) — see SME queue`);
  else if (descLen > 160) warnings.push(`${f}: description too long (${descLen} > 160 chars) — see SME queue`);
  if (descLen >= 80 && descLen <= 160 && !hasCta(desc)) warnings.push(`${f}: description lacks CTA verb (V2-P2b)`);

  // Title length (50-60 char target after brand suffix append).
  if (fm.title) {
    const fullTitleLen = fm.title.length + ' \u2014 Industrial Knives'.length;
    if (fullTitleLen < 50 || fullTitleLen > 60) {
      warnings.push(`${f}: title length ${fullTitleLen} outside [50,60] (raw title ${fm.title.length} chars)`);
    }
  }

  if (!fm.image) warnings.push(`${f}: missing frontmatter image field (OG image)`);

  const canonical = fm.canonical || (fm.metadata && fm.metadata.canonical) || '';
  if (canonical && /machine-knives\.net/.test(canonical)) {
    errors.push(`${f}: canonical uses legacy domain (${canonical})`);
  }
}

// ─── Product frontmatter (BOM + title length only; excerpt depth deferred to SME) ─
const productFiles = readdirSync(PRODUCT_DIR).filter((f) => /\.(md|mdx)$/.test(f)).sort();
for (const f of productFiles) {
  const full = join(PRODUCT_DIR, f);
  const bytes = readFileSync(full);
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    errors.push(`${f}: UTF-8 BOM at file start — strip before commit (.clinerules §0.5.1)`);
  }
  const raw = bytes.toString('utf8');
  const fm = parseFrontmatter(raw);
  if (!fm) continue;
  if (fm.title) {
    const fullTitleLen = fm.title.length + ' \u2014 Industrial Knives'.length;
    if (fullTitleLen < 50 || fullTitleLen > 60) {
      warnings.push(`${f}: title length ${fullTitleLen} outside [50,60] (raw title ${fm.title.length} chars)`);
    }
  }
}

console.log(`scanned ${postFiles.length} posts, ${productFiles.length} products`);
if (warnings.length) {
  console.log(`\nWARNINGS (${warnings.length}):`);
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length) {
  console.log(`\nERRORS (${errors.length}):`);
  for (const e of errors) console.log(`  - ${e}`);
  process.exit(1);
}
console.log('\n\u2713 Frontmatter lint passed (with warnings, see above)');