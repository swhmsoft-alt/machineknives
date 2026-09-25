// src/utils/redirects.ts
// ─────────────────────────────────────────────────────────────────────────────
// Build the static redirect map consumed by astro.config.ts → `redirects`.
//
// The blog migration moves:
//   - posts   from /<slug>/                  → /blog/<category>/<slug>/
//   - categories from /category/<slug>/      → /blog/<slug>/
//   - blog pagination from /blog/<n>/       → /blog/
//   - topics index from /blog/topics/       → /blog/
//
// "禁止删除/丢失文章" is enforced by enumerating one redirect per .md file
// in src/data/post/ at config load time. No URL is hand-maintained; the
// corpus is the source of truth.
//
// IMPORTANT: this module is invoked by astro.config.ts at *config* time,
// BEFORE the Astro content system (`astro:content`) is wired up. It must
// NOT depend on `astro:content` — that's why we read .md frontmatter
// directly from disk here instead of going through ~/utils/blog.fetchPosts.
// ─────────────────────────────────────────────────────────────────────────────

import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

interface RedirectEntry {
  source: string;
  destination: string;
}

interface PostEntry {
  slug: string;
  category: string;
}

const POSTS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'post');

// Match the slugify used by src/utils/permalinks.ts (cleanSlug → limax).
// We keep a minimal implementation here to avoid pulling in `limax` from
// config-time code (where Vite resolution may not yet include src/utils/).
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Parse just the `category:` field from a Markdown file's frontmatter block.
 * Only what's needed for the redirect map — no need to spin up a YAML lib.
 */
const extractCategory = (raw: string): string | undefined => {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return undefined;
  const catLine = fmMatch[1].match(/^category:\s*(.*)$/m);
  if (!catLine) return undefined;
  return slugify(catLine[1].trim().replace(/^['"]|['"]$/g, ''));
};

/**
 * Enumerate every post in src/data/post/, returning its filename-derived
 * slug and the slugified category from its frontmatter. Posts missing a
 * category throw immediately — the build-time hard assertion in
 * ~/utils/blog.getNormalizedPost enforces the same invariant.
 */
const readPostEntries = (): PostEntry[] => {
  const entries: PostEntry[] = [];
  for (const filename of readdirSync(POSTS_DIR)) {
    if (!filename.endsWith('.md')) continue;
    const slug = filename.replace(/\.md$/, '');
    const raw = readFileSync(join(POSTS_DIR, filename), 'utf8');
    const category = extractCategory(raw);
    if (!category) {
      throw new Error(
        `[redirects] Post "${filename}" is missing a \`category:\` field in its frontmatter. ` +
          `Every blog post must declare exactly one category.`,
      );
    }
    entries.push({ slug, category });
  }
  return entries;
};

// The build output for the previous site emitted 9 home pagination pages
// (/blog/2/ .. /blog/9/). Cover that range as a constant so we don't have
// to enumerate it inline. Any future /blog/<n>/ URL above 9 will simply
// 404 — there is no fallback archive to send the user to.
const OLD_HOME_PAGINATION_COUNT = 9;

/**
 * Build the full redirect map. Wired into astro.config.ts via:
 *
 *   redirects: buildRedirectMap(),
 *
 * Astro 7's `redirects` config option accepts a plain `Record<source,
 * destination>` (status defaults to 301). We return a synchronous object
 * — the corpus read is cheap (fs.readdirSync + N fs.readFileSync) and
 * Astro needs the data at config-evaluation time, not as a Promise.
 *
 * For `output: 'static'`, Astro emits a `<source>/index.html` for each
 * entry with a `<meta http-equiv="refresh">` redirect. Search engines and
 * browsers honour that as a permanent move, but it does not return a
 * literal HTTP 301 status. If the deployment adapter changes (e.g. to
 * Cloudflare Pages or Netlify), Astro will additionally write a
 * `_redirects` file with proper 301s.
 */
export const buildRedirectMap = (): Record<string, string> => {
  const posts = readPostEntries();
  const redirects: Record<string, string> = {};

  // 1) Per-post redirect: /<slug>/  →  /blog/<category>/<slug>/
  for (const post of posts) {
    redirects[`/${post.slug}/`] = `/blog/${post.category}/${post.slug}/`;
  }

  // 2) Per-category redirect: /category/<slug>/  →  /blog/<slug>/
  const seenCategories = new Set<string>();
  for (const post of posts) {
    if (seenCategories.has(post.category)) continue;
    seenCategories.add(post.category);
    redirects[`/category/${post.category}/`] = `/blog/${post.category}/`;
  }

  // 3) Old home pagination: /blog/2/ .. /blog/9/  →  /blog/
  for (let n = 2; n <= OLD_HOME_PAGINATION_COUNT; n++) {
    redirects[`/blog/${n}/`] = '/blog/';
  }

  // 4) Old topics index: /blog/topics/  →  /blog/
  redirects['/blog/topics/'] = '/blog/';

  return redirects;
};

// Re-exported for clarity in call sites that want the explicit shape.
export type { RedirectEntry };
