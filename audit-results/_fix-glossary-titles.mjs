#!/usr/bin/env node
/**
 * _fix-glossary-titles.mjs — one-shot post-processor for audit F-006.
 * For every src/data/post/glossary-*.md that still has
 *   title: 'undefined — Industry Glossary Entry'
 *   or **undefined** at the start of the body paragraph (right after the
 *   closing frontmatter `---` line)
 * rewrite both, deriving the term name from the filename stem.
 *
 * Uses line-level regex substitution (NOT string-split) so the frontmatter
 * and body structure are preserved verbatim.
 *
 * Idempotent: re-running after the fix is a no-op.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const POST_DIR = 'c:/Users/User/Desktop/machineknives/src/data/post';
const files = readdirSync(POST_DIR).filter((f) => /^glossary-.*\.md$/.test(f)).sort();

// Compound acronyms: key is the URL stem fragment, value is the display form.
const COMPOUND_ACRONYMS = {
  pvd: 'PVD',
  tin: 'TiN',
  ticn: 'TiCN',
  tialn: 'TiAlN',
  crn: 'CrN',
  alcrn: 'AlCrN',
  dlc: 'DLC',
  'ta-c': 'Ta-C',
};

function humanize(stem) {
  const stemLower = stem.toLowerCase();
  for (const [acr, display] of Object.entries(COMPOUND_ACRONYMS)) {
    if (stemLower === acr || stemLower === `${acr}-coating`) {
      return `${display} coating`;
    }
  }
  return stem
    .split('-')
    .map((w) => (w.length === 0 ? '' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

let fixed = 0;
let skipped = 0;
const log = [];

for (const f of files) {
  const full = join(POST_DIR, f);
  const raw = readFileSync(full, 'utf8');

  const stem = f.replace(/^glossary-/, '').replace(/\.md$/, '');
  const termName = humanize(stem);

  let next = raw;

  // Fix #1 — the title line in frontmatter.
  next = next.replace(
    /title:\s*'undefined\s+\u2014\s+Industry Glossary Entry'/,
    `title: '${termName} \u2014 Industry Glossary Entry'`
  );

  // Fix #2 — the bolded **undefined** that opens the body. Simple global
  // replace; the frontmatter cannot legitimately contain this token.
  next = next.replaceAll('**undefined**', `**${termName}**`);

  if (next !== raw) {
    writeFileSync(full, next, 'utf8');
    fixed++;
    log.push(`  FIXED  ${f}  ->  "${termName}"`);
  } else {
    skipped++;
  }
}

console.log(`glossary title fix: ${fixed} fixed, ${skipped} already clean (of ${files.length})`);
console.log(log.join('\n'));