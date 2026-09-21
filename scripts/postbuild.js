import { glob } from 'glob';
import fs from 'node:fs';
import path from 'node:path';

// IMPORTANT: do NOT skip `index.html` files. In `trailingSlash: 'always'` mode
// every route becomes `dist/<route>/index.html`, so ignoring them would skip
// every page and the SSG normalization would do nothing.
const files = glob.sync('dist/**/*.html', { ignore: ['dist/_astro/**'] });

// Post-build script: normalize all internal `href="/path"` links in every
// generated HTML page so they always end with a single trailing slash.
//
// Strategy:
//   - Match `href="/..."` (internal absolute path)
//   - Stop the captured body at `.`, `?`, `#` to avoid touching file extensions,
//     query strings and fragments
//   - Make the existing trailing slash optional in the match, then always emit
//     exactly one `/`. This guarantees the result is `/path/` (never `//`).
//
// Skipped:
//   - href values containing `.`, `?` or `#` (asset, query, fragment)
//   - any href not starting with `/` (external, mailto:, javascript:, etc.)
//
// Note: we intentionally avoid the `**` glob pattern inside any comment so
// that the `*` `*` `/` sequence does not terminate the block comment early.
// Capture the path body WITHOUT the leading `/`. Any leading/trailing extra
// slashes inside `p` are stripped before re-emitting, so the output is
// guaranteed to be exactly `/path/` (never `//` or `///`).
const LINK_RE = /href="\/([^".#?]+)"/g;

let touched = 0;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf-8');
  // Callback preserves the `href="` prefix and trailing `"`. The capture group
  // `p` already includes the leading `/`, so we only need to append a single
  // trailing `/`. Result is always exactly one `/` — never `//`.
  const next = html.replace(LINK_RE, (_match, p) => {
    // Strip any extra leading/trailing slashes from the captured path, then
    // re-emit it wrapped in exactly one leading and one trailing slash.
    // Result is always `/path/` (never `//` or `///`).
    const clean = p.replace(/^\/+|\/+$/g, '');
    return `href="/${clean}/"`;
  });
  if (next !== html) {
    fs.writeFileSync(file, next, 'utf-8');
    touched += 1;
  }
}

console.log(`[postbuild] trailing-slash normalization: rewrote ${touched}/${files.length} HTML files.`);

// ─────────────────────────────────────────────────────────────────────────────
// Post-build script 2: WebP <picture> wrapping.
// ─────────────────────────────────────────────────────────────────────────────
// scripts/optimize-images.mjs (run earlier in the build chain) emits a same-
// name `.webp` next to every JPG/JPEG/PNG under dist/. We wrap any matching
// `<img src="/.../foo.jpg">` (or .jpeg / .png) in a `<picture>` with a WebP
// `<source>` first, leaving the original `<img>` intact as the legacy fallback.
//
// Astro's <Image /> already emits its own <picture> for ESM-imported images
// via the asset pipeline. The files we want to upgrade live under public/
// (copied verbatim to dist/), so they never go through that pipeline. Doing
// the wrap in a post-build step means every emitted HTML page picks up the
// WebP automatically — no template changes, no content authoring changes.
//
// Caveats handled below:
//   • External URLs (http(s)://, data:, mailto:) → skipped.
//   • <img> already inside a <picture> from a previous run → skipped
//     (idempotent: re-running the build doesn't double-wrap).
//   • All original <img> attributes are preserved verbatim.

const DIST_ROOT = path.resolve('dist');
const RASTER_SRC_RE = /<img\b([^>]*?)\ssrc=\"(\/[^"]+\.(?:jpg|jpeg|png))\"([^>]*?)\/?>/gi;

let wrapped = 0;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf-8');
  let result = '';
  let cursor = 0;
  let pictureDepth = 0;
  RASTER_SRC_RE.lastIndex = 0;
  let m;
  let localWrapped = 0;

  while ((m = RASTER_SRC_RE.exec(html)) !== null) {
    const matchStart = m.index;
    result += html.slice(cursor, matchStart);
    // Track <picture> nesting by counting opens/closes between cursor and the
    // current match. An <img> we encounter while pictureDepth > 0 is the
    // inner <img> of a <picture> we wrote in a previous build — leave it.
    const between = html.slice(cursor, matchStart);
    pictureDepth += (between.match(/<picture\b/gi) || []).length;
    pictureDepth -= (between.match(/<\/picture>/gi) || []).length;

    const [, pre, src, post] = m;
    const webpSrc = src.replace(/\.(?:jpg|jpeg|png)$/i, '.webp');
    const distWebp = path.join(DIST_ROOT, webpSrc);

    if (pictureDepth > 0 || !fs.existsSync(distWebp)) {
      result += m[0];
    } else {
      result += `<picture><source type=\"image/webp\" srcset=\"${webpSrc}\" /><img${pre} src=\"${src}\"${post}></picture>`;
      localWrapped += 1;
    }
    cursor = matchStart + m[0].length;
  }
  result += html.slice(cursor);

  if (localWrapped > 0) {
    fs.writeFileSync(file, result, 'utf-8');
    wrapped += localWrapped;
  }
}

console.log(`[postbuild] WebP <picture> wrapping: upgraded ${wrapped} <img> tags across ${files.length} HTML files.`);