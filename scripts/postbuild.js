import { glob } from 'glob';
import fs from 'node:fs';

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