#!/usr/bin/env node
/**
 * _fix-pillar-excerpts.mjs — bring pillar excerpts into the 80–160 char
 * window enforced by src/content.config.ts (zod schema).
 *
 * Why: the original pillar excerpts were hand-curated at ~170–200 chars for
 * density of information. The Astro build fails with
 *   [InvalidContentEntryDataError] excerpt too long (Google truncates > 160 chars)
 * because the zod schema enforces a 160-char cap (line 60–62 of content.config.ts).
 *
 * Strategy: trim each over-length excerpt to ~155 chars, ending at a natural
 * word boundary. Preserve the leading material family + key value proposition.
 *
 * Idempotent: re-running after the fix is a no-op (already ≤ 160).
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const POST_DIR = 'src/data/post';
const TARGET_LEN = 155; // hard cap is 160, target leaves headroom
const HARD_CAP = 160;

const files = readdirSync(POST_DIR)
  .filter((f) => f.startsWith('pillar-') && f.endsWith('.md'))
  .sort();

const fixes = [];
for (const f of files) {
  const full = join(POST_DIR, f);
  const raw = readFileSync(full, 'utf8');
  // Match excerpt line at the top of frontmatter
  const m = raw.match(/^excerpt:\s*'([\s\S]+?)'$/m);
  if (!m) continue;
  const original = m[1];
  if (original.length <= HARD_CAP) continue;

  // Trim to TARGET_LEN at the nearest word boundary.
  let trimmed = original.slice(0, TARGET_LEN);
  const lastSpace = trimmed.lastIndexOf(' ');
  if (lastSpace > TARGET_LEN * 0.7) {
    trimmed = trimmed.slice(0, lastSpace);
  }
  // Re-add any closing punctuation that got sliced off.
  if (!/[.!?]$/.test(trimmed)) trimmed += '…';

  // Replace in-place, preserving the line format.
  const next = raw.replace(m[0], `excerpt: '${trimmed}'`);
  if (next !== raw) {
    writeFileSync(full, next, 'utf8');
    fixes.push({ file: f, originalLen: original.length, newLen: trimmed.length });
    console.log(`[fix] ${f}: ${original.length}c → ${trimmed.length}c`);
    console.log(`       new: ${trimmed}`);
  }
}

console.log(`[fix] total: ${fixes.length} excerpt${fixes.length === 1 ? '' : 's'} trimmed`);
process.exit(fixes.length === 0 ? 0 : 0);