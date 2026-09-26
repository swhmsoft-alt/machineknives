// scripts/fix-raster-refs.mjs
// ─────────────────────────────────────────────────────────────────────────────
// One-shot bulk rewriter: converts `.jpg` / `.jpeg` / `.png` references in
// HTML-emitting source files (.astro / .md / .mdx) to `.webp` so that
// `astro dev` serves real assets instead of 404s.
//
// Why this script exists
// ----------------------
// The codebase historically wrote `.jpg` / `.png` paths in its templates and
// relied on `scripts/postbuild.js` to rewrite them to `.webp` after
// `astro build`. That works for production output but NOT for the dev server:
// `npm run dev` skips `postbuild.js`, so every <img src=…jpg/png> in the
// rendered HTML 404s in dev mode (and on a fresh `git clone` before any
// build has run). This script moves every raster reference in source files
// to its real on-disk extension so dev / build share one truth.
//
// What it touches
// ---------------
//   src/pages/**/*.astro          — every <img src="…jpg"> / srcset="…jpg"
//   src/pages/**/*.md / .mdx      — frontmatter image fields
//   src/data/product/*.md         — product hero `image:` field
//
// What it leaves alone
// --------------------
//   • src/components/Favicons.astro and src/assets/favicons/** — browsers
//     and crawlers expect exact filenames for these. The prebuild script
//     already whitelists them.
//   • src/pages/quality.astro (JSON-LD `default.png` for Organization
//     schema) — keep as-is; it's an SEO field, not a renderable image.
//   • src/data/_images-catalog.json — pure catalog data, never rendered as
//     an <img>. postbuild.js still rewrites any HTML that consumes it.
//   • Any URL pointing to /_astro/** (already hashed / optimized).
//   • Any URL ending in `.svg` (we don't compress SVG).
//
// Idempotency
// -----------
// Re-running the script is safe: every replacement is guarded so we only
// touch paths whose companion `.webp` exists on disk. Anything that doesn't
// match (e.g. an `.png` favicon) is left alone.
//
// Usage
// -----
//   node scripts/fix-raster-refs.mjs
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');

/** File globs (relative to src/) we are willing to rewrite. */
const TARGET_GLOBS = [
  'src/pages/**/*.astro',
  'src/pages/**/*.md',
  'src/pages/**/*.mdx',
  'src/data/product/*.md',
];

/**
 * Returns true when `slug` (a URL or path stem, e.g. "/images/products/foo")
 * has a real `.webp` file sitting next to it in public/.
 */
function hasCompanionWebp(slug) {
  // Strip query string and leading slash, then map URL → disk path.
  const clean = slug.replace(/\?.*$/, '').replace(/^\/+/, '');
  // Only consider references that look like /images/** — that's where our
  // raster assets live. Anything else (CDN URLs, /_astro/**, etc.) we skip.
  if (!clean.startsWith('images/')) return false;
  const stem = path.join(PUBLIC_DIR, clean);
  return fs.existsSync(stem + '.webp');
}

/**
 * Walk src/ and yield every file path that matches TARGET_GLOBS. We do this
 * with a tiny recursive walker instead of `glob` to keep the script zero-
 * dependency (it has to run before npm install on a fresh checkout).
 */
function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

function isTarget(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  return TARGET_GLOBS.some((g) => {
    // Convert glob → regex. `**` matches zero or more path segments; `*`
    // matches a single segment. Escapes all other regex metacharacters.
    const re = new RegExp(
      '^' +
        g
          .replace(/[.+^${}()|[\]\\]/g, '\\$&')
          .replace(/\*\*/g, '<<DOUBLESTAR>>')
          .replace(/\*/g, '[^/]*')
          .replace(/<<DOUBLESTAR>>\//g, '(?:.*/)?')
          .replace(/<<DOUBLESTAR>>/g, '.*') +
        '$',
    );
    return re.test(rel);
  });
}

// Captures the *stem* (everything before the extension) so we can look up
// the companion webp. Anchored on either a leading slash (URL) or quote
// (frontmatter / attribute) so we never touch unrelated `.png` strings.
const RASTER_RE = /(['"\s(,/])([A-Za-z0-9_\-./]*?\/(?:images|homepage)\/[A-Za-z0-9_\-./]+)\.(jpg|jpeg|png)\b/g;

let touched = 0;
let rewrites = 0;
const detail = [];

for (const file of walk(path.join(ROOT, 'src'))) {
  if (!isTarget(file)) continue;
  touched += 1;

  const src = fs.readFileSync(file, 'utf8');
  let fileRewrites = 0;
  const next = src.replace(RASTER_RE, (match, lead, stem, ext) => {
    if (!hasCompanionWebp(stem)) return match; // skip — no companion
    fileRewrites += 1;
    return `${lead}${stem}.webp`;
  });

  if (fileRewrites > 0) {
    fs.writeFileSync(file, next, 'utf8');
    rewrites += fileRewrites;
    detail.push(`  ${path.relative(ROOT, file)}  (+${fileRewrites})`);
  }
}

console.log(`[fix-raster-refs] scanned ${touched} files, rewrote ${rewrites} reference(s).`);
if (detail.length) {
  console.log(detail.join('\n'));
}