// scripts/replace-canonical-domain.mjs
// ─────────────────────────────────────────────────────────────────────────────
// ONE-TIME: rewrite frontmatter `canonical:` host from industrial-knives.net
// → www.custommachineknives.com in src/data/post/*.md and *.mdx. Path portion
// (/blog/<cat>/<slug>/) is preserved verbatim.
//
// Idempotency: re-running on already-converted files is a no-op
// (no remaining industrial-knives.net in the canonical line).
//
// Scope: src/data/post/*.md, *.mdx. src/data/product/*.md has no hand-written
// canonical: (schema defaults to undefined → permalinks.ts auto-generates
// from SITE.site, which is already migrated in src/config.yaml).
//
// NOT wired into `npm run build`. This is a one-off migration. Safe to delete
// after the migration window closes.
// ─────────────────────────────────────────────────────────────────────────────

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = 'src/data/post';
const FROM_HOST = 'industrial-knives.net';
const TO_HOST = 'www.custommachineknives.com';

// Match a single frontmatter `canonical:` line and rewrite the host.
// Capture: (1) leading whitespace + `canonical:` + ws + opening single-quote
//          (2) the path portion after the host, up to the closing quote.
const HOST_RE = FROM_HOST.replace(/\./g, '\\.');
const CANONICAL_RE = new RegExp(
  `^([ \\t]*canonical:[ \\t]*')https://${HOST_RE}(/[^']*)'`,
  'm',
);

let changed = 0;
let skipped = 0;
let errors = 0;
const touched = [];

for (const filename of readdirSync(POSTS_DIR).sort()) {
  if (!filename.endsWith('.md') && !filename.endsWith('.mdx')) continue;
  const fullPath = join(POSTS_DIR, filename);
  let raw;
  try {
    raw = readFileSync(fullPath, 'utf8');
  } catch (e) {
    errors++;
    console.error(`[replace-canonical] read failed: ${filename}: ${e.message}`);
    continue;
  }

  const newRaw = raw.replace(CANONICAL_RE, (_match, prefix, pathTail) => `${prefix}https://${TO_HOST}${pathTail}'`);
  if (newRaw === raw) {
    skipped++;
    continue;
  }

  try {
    writeFileSync(fullPath, newRaw, 'utf8');
    changed++;
    touched.push(filename);
  } catch (e) {
    errors++;
    console.error(`[replace-canonical] write failed: ${filename}: ${e.message}`);
  }
}

console.log(`[replace-canonical] changed=${changed}  skipped=${skipped}  errors=${errors}  dir=${POSTS_DIR}`);
if (changed > 0) {
  console.log(`[replace-canonical] first 5 touched:`);
  for (const f of touched.slice(0, 5)) console.log(`  - ${f}`);
}
