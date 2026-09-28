#!/usr/bin/env node
/**
 * _expand-frontmatter-templates.mjs — Round 2 P2b expander.
 *
 * For each src/data/post/*.md whose `excerpt` and `metadata.description`
 * fields still contain the boilerplate template:
 *
 *   '<Title>. Chemistry, hardness, heat treatment, applications,
 *    cross-reference.'
 *
 * replaces both fields with a hand-curated, material-specific 80–160
 * char description that includes a CTA verb (compare / browse) to
 * eliminate the V2-P2b "description lacks CTA verb" CI warning.
 *
 * Idempotent: only touches files that still have the boilerplate in
 * both fields; files already expanded are left alone.
 *
 * --dry-run flag: prints planned changes without writing.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { FRONTMATTER_INTROS, SLUG_COUNT } from './_materials-frontmatter.mjs';

const POST_DIR = 'src/data/post';
const DRY_RUN = process.argv.includes('--dry-run');

// Detect boilerplate template (Round 1 generator output).
const EXCERPT_TEMPLATE = /^excerpt:\s*'[^']+?\. Chemistry, hardness, heat treatment, applications, cross-reference\.'$/m;
// Two indent variants seen in the corpus:
//   - correct:  '  description:' (2-space, inside `metadata:`)
//   - broken (left by the v1 expansion script): '      description:' (6-space)
// We match either and re-emit with 2-space indent on apply.
const DESC_TEMPLATE = /^(?:  |      )description:\s*'[^']+?\. Chemistry, hardness, heat treatment, applications, cross-reference\.'$/m;
// Indent-only repair: catch any leftover 6-space-indented description
// line (from the previous round of apply) and normalise to 2-space.
// Used to repair structural damage when the template pattern is gone.
const DESC_INDENT_REPAIR = /^      description:\s*'(.+)'$/m;

const files = readdirSync(POST_DIR).filter((f) => /\.mdx?$/.test(f)).sort();
const log = { fixed: 0, skipped: 0, errors: 0 };
const changes = [];

for (const f of files) {
  const slug = f.replace(/\.mdx?$/, '');
  if (!FRONTMATTER_INTROS[slug]) {
    log.skipped++;
    continue;
  }
  const full = join(POST_DIR, f);
  let raw;
  try {
    raw = readFileSync(full, 'utf8');
  } catch (e) {
    log.errors++;
    console.warn(`[fm] ✗ read failed: ${f}: ${e.message}`);
    continue;
  }
  const { excerpt, description } = FRONTMATTER_INTROS[slug];
  // Use the shorter of the two strings as the description to keep both
  // within the [80,160] char lint window — if excerpt is already in
  // range, just point description at excerpt.
  const desc = (description && description.length <= 160) ? description : excerpt;
  let next = raw;
  let changed = false;

  if (EXCERPT_TEMPLATE.test(next)) {
    next = next.replace(EXCERPT_TEMPLATE, `excerpt: '${excerpt}'`);
    changed = true;
  }
  if (DESC_TEMPLATE.test(next)) {
    // Strip leading 2-space OR 6-space indent, re-emit as 2-space.
    next = next.replace(DESC_TEMPLATE, `  description: '${desc}'`);
    changed = true;
  }
  // Indent-only repair (no template content change).
  if (DESC_INDENT_REPAIR.test(next)) {
    next = next.replace(DESC_INDENT_REPAIR, `  description: '$1'`);
    changed = true;
  }
  if (!changed) {
    log.skipped++;
    continue;
  }

  changes.push({ file: f, excerpt, desc });

  if (!DRY_RUN) {
    try {
      writeFileSync(full, next, 'utf8');
      log.fixed++;
    } catch (e) {
      log.errors++;
      console.warn(`[fm] ✗ write failed: ${f}: ${e.message}`);
    }
  }
}

console.log(`[fm] mode=${DRY_RUN ? 'dry-run' : 'apply'}`);
console.log(`[fm] dictEntries=${SLUG_COUNT}  fixed=${log.fixed}  skipped=${log.skipped}  errors=${log.errors}`);
if (changes.length) {
  console.log('');
  console.log('=== Planned changes ===');
  for (const c of changes) {
    console.log(`-- ${c.file}  excerpt=${c.excerpt.length}c  desc=${c.desc.length}c`);
  }
}

process.exit(log.errors > 0 ? 1 : 0);