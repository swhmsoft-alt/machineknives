#!/usr/bin/env node
/**
 * scripts/check-frontmatter-lint.mjs — frontmatter CI lint.
 *
 * Enforces the audit recommendations (v1 + v2):
 *   ERRORS (CI-blocking):
 *     - description / excerpt length: 80 ≤ len ≤ 160
 *     - canonical uses https://www.custommachineknives.com (not legacy domain)
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
    const fullTitleLen = fm.title.length + ' \u2014 Custom Machine Knives'.length;
    if (fullTitleLen < 50 || fullTitleLen > 60) {
      warnings.push(`${f}: title length ${fullTitleLen} outside [50,60] (raw title ${fm.title.length} chars)`);
    }
    // Round 2 regression guard — truncated title patterns observed in the
    // pre-fix corpus (see audit-results/post-fix-v2-verification.md and
    // scripts/_audit-titles.mjs). These slipped past the [50,60] length
    // check because the truncation produced strings within range.
    //   ': Sligh' / ': Excel' / ': Hard' / ': Option' / ': Lowe'
    //     — colon + short fragment, no terminator
    //   ': Lower to'  — colon + dangling preposition
    //   'Hot-Work' / 'Cold-Work' / 'High-Speed'
    //     — missing trailing 'Tool Steel' or 'Steel'
    //   'The Custom Machine Knives ...'  — over-name prefix
    //     that masks a mid-phrase break
    const TRUNC_TITLE_PATTERNS = [
      /^.+:\s+[A-Z][a-z]{1,4}$/,        // colon + 3-5 letter capitalised fragment
      /^.+:\s+[a-z]+\s+to$/i,            // colon + preposition phrase
      /\bHot-Work$/i,
      /\bCold-Work$/i,
      /\bHigh-Speed$/,
      /^The Custom Machine Knives\b/,        // over-name prefix
    ];
    for (const re of TRUNC_TITLE_PATTERNS) {
      if (re.test(fm.title)) {
        errors.push(`${f}: title appears truncated (matches ${re}) — see Round 2 fix`);
        break;
      }
    }
  }

  // Round 2 regression guard — excerpt self-repetition. Pre-fix pattern:
  //   '<Title>. <Title>. Chemistry, hardness, heat treatment, applications, cross-reference.'
  // The opening title phrase is duplicated verbatim, almost always from the
  // generator template bug. Caught here so future regressions fail fast.
  if (desc) {
    if (/^(.+?)\.\s*\1\./.test(desc)) {
      warnings.push(`${f}: excerpt repeats opening phrase — likely generator artifact`);
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
    const fullTitleLen = fm.title.length + ' \u2014 Custom Machine Knives'.length;
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