import { glob } from 'glob';
import fs from 'node:fs';

// IMPORTANT: do NOT skip `index.html` files. In `trailingSlash: 'always'` mode
// every route becomes `dist/<route>/index.html`, so ignoring them would skip
// every page and the SSG normalization would do nothing.
const files = glob.sync('dist/**/*.html', { ignore: ['dist/_astro/**'] });

// ─────────────────────────────────────────────────────────────────────────────
// Post-build script 1: trailing-slash normalization.
// ─────────────────────────────────────────────────────────────────────────────
// Normalize all internal `href="/path"` links so they always end with a single
// trailing slash.
const LINK_RE = /href=\"\/([^\".#?]+)\"/g;

let touched = 0;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf-8');
  const next = html.replace(LINK_RE, (_match, p) => {
    const clean = p.replace(/^\/+|\/+$/g, '');
    return `href=\"/${clean}/\"`;
  });
  if (next !== html) {
    fs.writeFileSync(file, next, 'utf-8');
    touched += 1;
  }
}

console.log(`[postbuild] trailing-slash normalization: rewrote ${touched}/${files.length} HTML files.`);

// ─────────────────────────────────────────────────────────────────────────────
// Post-build script 2: rewrite <img>/<source> raster references to .webp.
// ─────────────────────────────────────────────────────────────────────────────
// scripts/prebuild-images.mjs (run BEFORE `astro build`) has already replaced
// every JPG/JPEG/PNG under public/ with a same-name `.webp` (and deleted the
// original). Astro copied those WebPs into dist/. But the HTML still references
// the old `.jpg` / `.jpeg` / `.png` paths because the templates were written
// before the build renamed the assets.
//
// This pass rewrites every internal raster reference to its .webp counterpart
// in three places:
//
//   1. `<img src="/.../foo.{jpg,jpeg,png}">` → `<img src="/.../foo.webp">`
//   2. `<source srcset="/.../foo.{jpg,jpeg,png}">` → `.webp`
//   3. `srcset="/.../foo.jpg 1x, /.../foo@2x.jpg 2x"` → all `.webp`
//
// External URLs (http(s)://, data:, mailto:) are skipped. Astro's
// `/_astro/...` hashed asset paths are skipped (they're not raw raster files
// from public/).
//
// We rewrite all references in one pass; the previous version of this script
// wrapped `<img>` in `<picture>` for fallback, but the originals no longer
// exist (prebuild deleted them), so the fallback is meaningless — direct
// rewrite is simpler and correct.
const RASTER_SRC_RE = /<img\b([^>]*?)\ssrc=\"(\/[^\"]+)\.(jpg|jpeg|png)([^\"]*)\"([^>]*?)\/?>/gi;
const RASTER_SRCSET_RE = /<source\b([^>]*?)\ssrcset=\"(\/[^\"]+)\.(jpg|jpeg|png)([^\"]*)\"([^>]*?)\/?>/gi;
// Bare srcset= on <img>, possibly multiple comma-separated entries with width
// descriptors. We replace the extension on every jpg/jpeg/png path inside.
const BARE_SRCSET_RE = /srcset=\"([^\"]+)\"/g;

function rewriteSrcsetValue(value) {
  // Each entry looks like `/path/to/foo.jpg 1x` or `/path/to/foo.jpg 480w`.
  // Replace the .jpg/.jpeg/.png suffix on each path with .webp.
  return value.replace(/(\/[^,\s"]+)\.(jpg|jpeg|png)/gi, '$1.webp');
}

let rewrites = 0;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf-8');
  let next = html;

  // (1) <img src="...">
  next = next.replace(RASTER_SRC_RE, (_m, pre, path, _ext, qs, post) => {
    rewrites += 1;
    return `<img${pre} src="${path}.webp${qs}"${post}>`;
  });

  // (2) <source srcset="...">
  next = next.replace(RASTER_SRCSET_RE, (_m, pre, path, _ext, qs, post) => {
    rewrites += 1;
    return `<source${pre} srcset="${path}.webp${qs}"${post}>`;
  });

  // (3) Bare srcset="..." on <img>, with multi-entry descriptors.
  next = next.replace(BARE_SRCSET_RE, (_m, value) => {
    const rewritten = rewriteSrcsetValue(value);
    if (rewritten !== value) rewrites += 1;
    return `srcset="${rewritten}"`;
  });

  if (next !== html) {
    fs.writeFileSync(file, next, 'utf-8');
  }
}

console.log(`[postbuild] WebP src rewrite: updated ${rewrites} raster reference(s) across ${files.length} HTML files.`);
