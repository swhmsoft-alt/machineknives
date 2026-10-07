// src/utils/seo-cta.mjs
// ─────────────────────────────────────────────────────────────────────────────
// CTA-suffix helper (Round 3 fix V2-P2b). Detects whether a description
// already contains a commercial call-to-action verb; if not, appends a
// default CTA that respects the 160-char SERP truncation limit.
//
// Used by both product single page and blog post single page templates so
// that every meta description ends with a click-driving verb.
//
// Design notes:
//   - Pure function; no I/O; safe to import from any Astro page.
//   - Does NOT mutate input; returns a new string (possibly truncated).
//   - Falls back to progressively shorter suffixes so the output is
//     guaranteed to be ≤ maxLen (default 160) when the input is non-empty.
//   - Pass `{ enabled: false }` to disable the auto-append (e.g. on a page
//     that already has its own custom CTA logic).
// ─────────────────────────────────────────────────────────────────────────────

const CTA_VERBS = [
  'request a quote',
  'request quote',
  'get a quote',
  'contact us',
  'send a drawing',
  'send your drawing',
  'request a callback',
  'talk to engineering',
  'order now',
  'buy now',
  'shop now',
  'learn more',
  'read more',
  'find out more',
  'download',
  'compare',
  'browse',
  'book a',
  'schedule a',
];

export function hasCta(s) {
  if (typeof s !== 'string' || !s) return false;
  const lower = s.toLowerCase();
  return CTA_VERBS.some((v) => lower.includes(v));
}

/**
 * Append a CTA suffix to a description if it lacks one.
 * Keeps total length ≤ maxLen by trying suffixes in order, then truncating
 * the description itself as a last resort.
 *
 * @param {string} description
 * @param {{ suffix?: string, shortSuffix?: string, maxLen?: number, enabled?: boolean }} [opts]
 * @returns {string}
 */
export function appendCtaIfMissing(description, opts = {}) {
  const {
    suffix = ' \u2192 custommachineknives.com/contact',
    shortSuffix = ' \u2192 /contact',
    maxLen = 160,
    enabled = true,
  } = opts;

  if (!description || typeof description !== 'string') return description || '';
  if (!enabled) return description;
  if (hasCta(description)) return description;

  // Strip a trailing period / whitespace so the arrow reads cleanly.
  const trimmed = description.replace(/[.\s\u2014\u2013]+$/u, '');

  // Try full suffix first.
  const candidate = trimmed + suffix;
  if (candidate.length <= maxLen) return candidate;

  // Fall back to short suffix.
  const candidate2 = trimmed + shortSuffix;
  if (candidate2.length <= maxLen) return candidate2;

  // Last resort: chop the description itself to fit the short suffix.
  const budget = maxLen - shortSuffix.length;
  if (budget <= 0) return shortSuffix;
  return trimmed.slice(0, budget).replace(/[,\s\u2014\u2013]+$/u, '') + shortSuffix;
}