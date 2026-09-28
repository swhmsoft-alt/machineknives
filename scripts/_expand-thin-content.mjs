#!/usr/bin/env node
/**
 * _expand-thin-content.mjs — idempotent expander for Round-1 generator
 * template opener. For every src/data/post/*.md that still contains
 *
 *   "<Material> is a reference entry for industrial cutting tools and
 *    blades. The composition, hardness, heat treatment and application
 *    guidance are summarised below for engineering reference."
 *
 * replaces that paragraph with the canonical opening from
 * scripts/_materials-dictionary.mjs (slug-keyed). Files without a
 * dictionary entry use a generic factual placeholder that names the
 * entry and explicitly references the body content — NO fabricated
 * material claims.
 *
 * Idempotent: re-running after the fix is a no-op. Skips files where
 * the template phrase no longer exists (e.g. already expanded, or the
 * body never had it).
 *
 * --dry-run flag: prints the planned diff for each file without writing.
 *
 * Usage:
 *   node scripts/_expand-thin-content.mjs            # apply all
 *   node scripts/_expand-thin-content.mjs --dry-run # preview only
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { MATERIALS_INTROS, genericReplacement } from './_materials-dictionary.mjs';

const POST_DIR = 'src/data/post';
const DRY_RUN = process.argv.includes('--dry-run');

// Split the file on the YAML frontmatter boundary. The body section
// starts after the closing `---` of the frontmatter. We match the
// template only against the body, so the regex can't accidentally
// slurp in title/excerpt/description fields from the frontmatter.
function splitFrontmatter(raw) {
  // Match leading `---` line + YAML body + closing `---` line.
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) return { frontmatter: '', body: raw, separator: '' };
  return {
    frontmatter: m[0],
    body: raw.slice(m[0].length),
    separator: m[0].endsWith('\n') ? '' : '\n',
  };
}

// Match the template opener paragraph in BODY context only. The body
// starts immediately after frontmatter (often preceded by a blank line).
// Leading char is alphanumeric to handle "17-4 PH", "6CrW2Si", etc.
const TEMPLATE_RE = /^([A-Za-z0-9][\s\S]*?) is a reference entry for industrial cutting tools and blades\. The composition, hardness, heat treatment and application guidance are summarised below for engineering reference\.$/m;

const files = readdirSync(POST_DIR).filter((f) => /\.mdx?$/.test(f)).sort();

const log = { fixed: 0, skipped: 0, errors: 0, dryRun: DRY_RUN };
const changes = [];

for (const f of files) {
  const full = join(POST_DIR, f);
  let raw;
  try {
    raw = readFileSync(full, 'utf8');
  } catch (e) {
    log.errors++;
    console.warn(`[expand] ✗ read failed: ${f}: ${e.message}`);
    continue;
  }
  const slug = f.replace(/\.mdx?$/, '');

  const { frontmatter, body, separator } = splitFrontmatter(raw);
  const m = TEMPLATE_RE.exec(body);
  if (!m) {
    log.skipped++;
    continue;
  }
  // The captured group is the material name; used only as a fallback
  // anchor when no dictionary entry exists.
  const leadingName = m[1].trim();

  // Look up the canonical opening. Priority: slug-keyed entry, then
  // fall back to a generic factual placeholder.
  let opening;
  let source = 'generic fallback';
  if (MATERIALS_INTROS[slug]) {
    opening = MATERIALS_INTROS[slug].opening;
    source = MATERIALS_INTROS[slug].source;
  } else {
    // Extract the title from frontmatter for the generic anchor.
    const titleMatch = raw.match(/^title:\s*'([^']+)'$/m);
    const title = titleMatch ? titleMatch[1] : leadingName;
    opening = genericReplacement(title);
  }

  // Replace the template paragraph in the BODY with the canonical
  // opening. Preserve trailing blank lines so the next content
  // (chemistry table, hardness list, etc.) starts cleanly.
  const newBody = body.replace(TEMPLATE_RE, () => `${opening}\n\n`);
  const next = `${frontmatter}${separator}${newBody}`;

  if (next === raw) {
    log.skipped++;
    continue;
  }

  changes.push({
    file: f,
    slug,
    source,
    before: m[0],
    after: opening,
  });

  if (!DRY_RUN) {
    try {
      writeFileSync(full, next, 'utf8');
      log.fixed++;
    } catch (e) {
      log.errors++;
      console.warn(`[expand] ✗ write failed: ${f}: ${e.message}`);
    }
  }
}

console.log(`[expand] mode=${DRY_RUN ? 'dry-run' : 'apply'}`);
console.log(`[expand] fixed=${log.fixed}  skipped=${log.skipped}  errors=${log.errors}`);
if (changes.length) {
  console.log('');
  console.log('=== Planned changes ===');
  for (const c of changes) {
    console.log(`-- ${c.file}  (source: ${c.source})`);
    console.log(`   - ${c.before.slice(0, 100)}${c.before.length > 100 ? '...' : ''}`);
    console.log(`   + ${c.after.slice(0, 100)}${c.after.length > 100 ? '...' : ''}`);
  }
}

process.exit(log.errors > 0 ? 1 : 0);