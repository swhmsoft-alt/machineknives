import { defineMiddleware } from 'astro:middleware';

/**
 * Astro middleware that normalizes internal href="/path" links in every HTML
 * response so they always end with exactly one trailing slash.
 *
 * Applies to:
 *   - SSR (any server adapter, e.g. @astrojs/vercel)
 *   - `astro dev` dev server (Vite middleware mode)
 *
 * Does NOT apply to:
 *   - SSG output (handled by scripts/postbuild.js at build time, since the
 *     body stream from an upstream handler is already consumed by Astro's
 *     generator and rewriting it in middleware would break static build)
 *
 * The regex is identical to scripts/postbuild.js to keep the two paths
 * consistent. The result is always exactly one `/` — never `//`.
 *
 * IMPORTANT: we read the body via `response.clone().text()` so the original
 * response body stream remains untouched. If no rewrite is needed we return
 * the original response unchanged; if a rewrite is needed we return a brand
 * new Response with the rewritten body. This avoids the
 * `Body is unusable: Body has already been read` error during SSG.
 */
// Capture the path body WITHOUT the leading `/`. Any leading/trailing extra
// slashes inside `p` are stripped before re-emitting, so the output is
// guaranteed to be exactly `/path/` (never `//` or `///`).
const LINK_RE = /href="\/([^".#?]+)"/g;

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('text/html')) {
    return response;
  }

  // Clone before reading so the original response body stays usable.
  // The capture group `p` already includes the leading `/`, so we only need
  // to append a single trailing `/`. Result is always exactly one `/` — never
  // `//`.
  const html = await response.clone().text();
  const rewritten = html.replace(LINK_RE, (_match, p) => {
    // Strip any extra leading/trailing slashes from the captured path, then
    // re-emit it wrapped in exactly one leading and one trailing slash.
    // Result is always `/path/` (never `//` or `///`).
    const clean = p.replace(/^\/+|\/+$/g, '');
    return `href="/${clean}/"`;
  });
  if (rewritten === html) {
    return response;
  }

  return new Response(rewritten, {
    status: response.status,
    headers: response.headers,
  });
});