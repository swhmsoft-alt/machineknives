#!/usr/bin/env node
/**
 * _clean-pillar-links.mjs — one-shot cleanup for the 6 pillar files.
 *
 * Fixes two issues found during pillar-cluster finalisation:
 *   1. Trailing whitespace inside markdown-link URL targets
 *      (e.g. `[text](/blog/materials-encyclopedia/foo/   )` — would 404).
 *   2. Markdown links pointing at `/scripts/*.mjs` — these are technical
 *      references in author notes, not navigation targets. The Astro
 *      blog route doesn't serve `/scripts/`, so they would 404 in
 *      production. Convert to inline code (remove link, keep code style).
 *
 * Idempotent: re-running after the fix is a no-op.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const POST_DIR = 'src/data/post';
const PILLAR_PREFIX = 'pillar-';

const files = readdirSync(POST_DIR)
  .filter((f) => f.startsWith(PILLAR_PREFIX) && f.endsWith('.md'))
  .sort();

let totalFixes = 0;

for (const f of files) {
  const full = join(POST_DIR, f);
  const raw = readFileSync(full, 'utf8');
  let next = raw;
  let fixes = 0;

  // 1. Strip trailing whitespace inside link URL targets.
  //    Matches ](   ...)   where '...' contains trailing whitespace.
  //    We replace with ](...) — single space removed.
  //    Use a regex to find ]( ... ) with whitespace, capturing non-ws content.
  const trailingWs = /\]\((\S+?)[ \t]+\)/g;
  next = next.replace(trailingWs, (_m, url) => {
    fixes++;
    return `](${url})`;
  });

  // 2. Convert markdown links to /scripts/*.mjs into inline code.
  //    Pattern: [`path/to/file.mjs`](/scripts/path/to/file.mjs)
  //    Replacement: `path/to/file.mjs`  (inline code, no link).
  const scriptLinks = /\[`([^`]+?\.(?:mjs|js|ts))`\]\(\/scripts\/[^)]+\)/g;
  next = next.replace(scriptLinks, (_m, filename) => {
    fixes++;
    return `\`${filename}\``;
  });

  if (next !== raw && fixes > 0) {
    writeFileSync(full, next, 'utf8');
    console.log(`[clean] ${f}: ${fixes} fix${fixes === 1 ? '' : 'es'}`);
    totalFixes += fixes;
  }
}

console.log(`[clean] total fixes applied: ${totalFixes}`);