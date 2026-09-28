#!/usr/bin/env node
/**
 * _normalize-pillar-links.mjs — convert bare-slug and placeholder links
 * in the pillar cluster to canonical /blog/<category>/<slug>/ form.
 *
 * Why: in production, the Astro route emits canonical URLs as
 * `/blog/<category>/<slug>/index.html`. Bare `/<slug>/` redirects
 * exist in astro.config.mjs, but it's cleaner to link directly to
 * the canonical URL so the user's browser doesn't pay a 301 cost
 * on every cross-reference.
 *
 * Conversions:
 *   `/pillar-cold-work-tool-steel/`           → `/blog/selection-guide/pillar-cold-work-tool-steel/`
 *   `/blog/materials-encyclopedia/a2/`        → unchanged (already canonical)
 *   `/blog/materials-encyclopedia/dc53/`      → unchanged (already canonical)
 *   `/blog/selection-guide/5-factor-.../`      → unchanged (already canonical)
 *   `/blog/coatings-comparison/`              → unchanged
 *   `/blog/troubleshooting/`                   → unchanged
 *   `/blog/troubleshooting-premature-wear/`     → unchanged
 *   `/blog/material-comparison/9cr18mov-vs-440c/` → unchanged
 *
 * Idempotent.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const POST_DIR = 'src/data/post';
const PILLAR_SLUGS = [
  'pillar-cold-work-tool-steel',
  'pillar-martensitic-stainless',
  'pillar-high-speed-steel',
  'pillar-hot-work-tool-steel',
  'pillar-tungsten-carbide',
  'pillar-selection-guide',
];

const files = readdirSync(POST_DIR)
  .filter((f) => f.startsWith('pillar-') && f.endsWith('.md'))
  .sort();

let totalFixes = 0;

for (const f of files) {
  const full = join(POST_DIR, f);
  const raw = readFileSync(full, 'utf8');
  let next = raw;
  let fixes = 0;

  for (const slug of PILLAR_SLUGS) {
    // Match ](  /pillar-foo/  ) — with optional whitespace inside the parens.
    const bare = new RegExp(`\\]\\(\\s*/${slug}/\\s*\\)`, 'g');
    const canonical = `](/blog/selection-guide/${slug}/)`;
    next = next.replace(bare, () => {
      fixes++;
      return canonical;
    });
  }

  if (next !== raw && fixes > 0) {
    writeFileSync(full, next, 'utf8');
    console.log(`[normalize] ${f}: ${fixes} link${fixes === 1 ? '' : 's'} normalised`);
    totalFixes += fixes;
  }
}

console.log(`[normalize] total: ${totalFixes} link${totalFixes === 1 ? '' : 's'} canonicalised across ${files.length} pillar${files.length === 1 ? '' : 's'}`);