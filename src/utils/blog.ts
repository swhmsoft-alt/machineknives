import type { PaginateFunction } from 'astro';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Post, Taxonomy } from '~/types';
import { APP_BLOG } from 'astrowind:config';
import { cleanSlug, trimSlash, POST_PERMALINK_PATTERN, TAG_BASE } from './permalinks';

const generatePermalink = async ({
  id,
  slug,
  publishDate,
  category,
}: {
  id: string;
  slug: string;
  publishDate: Date;
  category: string | undefined;
}) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%category%', category || '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> => {
  const { id, data } = post;
  const { Content, remarkPluginFrontmatter } = await render(post);

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    author,
    draft = false,
    metadata = {},
  } = data;

  const slug = cleanSlug(id);
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

  // ─── Hard assertion: every blog post must declare a category ───────────
  // Topics and categories are the same taxonomy. A post without a category
  // has no place under /blog/<category>/<slug>/ — the canonical URL scheme
  // requires three nested segments and the middle one must be a real
  // category slug. Surfacing missing categories as a build error keeps the
  // "禁止删除/丢失文章" guarantee honest: a forgotten `category:` field
  // becomes a red build, not a silent orphan URL.
  if (!rawCategory || !String(rawCategory).trim()) {
    throw new Error(
      `[blog-migration] Post "${id}" is missing a \`category:\` field in its frontmatter. ` +
        `Every blog post must declare exactly one category.`,
    );
  }
  const category = {
    slug: cleanSlug(rawCategory),
    title: rawCategory,
  };

  const tags = rawTags.map((tag: string) => ({
    slug: cleanSlug(tag),
    title: tag,
  }));

  return {
    id: id,
    slug: slug,
    permalink: await generatePermalink({ id, slug, publishDate, category: category?.slug }),

    publishDate: publishDate,
    updateDate: updateDate,

    title: title,
    excerpt: excerpt,
    image: image,

    category: category,
    tags: tags,
    author: author,

    draft: draft,

    metadata,

    Content: Content,
    // or 'content' in case you consume from API

    readingTime: remarkPluginFrontmatter?.readingTime,
  };
};

const load = async function (): Promise<Array<Post>> {
  const posts = await getCollection('post');
  const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post));

  const results = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((post) => !post.draft);

  return results;
};

let _posts: Array<Post>;

/** */
export const isBlogEnabled = APP_BLOG.isEnabled;
export const isRelatedPostsEnabled = APP_BLOG.isRelatedPostsEnabled;
export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;
export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;
export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;
export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;

export const blogListRobots = APP_BLOG.list.robots;
export const blogPostRobots = APP_BLOG.post.robots;
export const blogCategoryRobots = APP_BLOG.category.robots;
export const blogTagRobots = APP_BLOG.tag.robots;

export const blogPostsPerPage = APP_BLOG?.postsPerPage;

/**
 * Number of posts shown on the /blog/ home page. No pagination — the home
 * page renders exactly this many newest posts and stops.
 */
export const BLOG_HOME_POST_COUNT = 12;

/**
 * Minimum post count required for a category to paginate. Categories with
 * fewer than this many posts render as a single archive page
 * (/blog/<category>/) with no /2/, /3/, … URLs. Set to 18 per editorial
 * spec: pagination is reserved for topic-shaped content (glossary,
 * encyclopedia), not for small per-category archives.
 */
export const CATEGORY_PAGINATION_THRESHOLD = 18;

/** */
export const fetchPosts = async (): Promise<Array<Post>> => {
  if (!_posts) {
    _posts = await load();
  }

  return _posts;
};

/** */
export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(slugs)) return [];

  const posts = await fetchPosts();

  return slugs.reduce(function (r: Array<Post>, slug: string) {
    posts.some(function (post: Post) {
      return slug === post.slug && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findPostsByIds = async (ids: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(ids)) return [];

  const posts = await fetchPosts();

  return ids.reduce(function (r: Array<Post>, id: string) {
    posts.some(function (post: Post) {
      return id === post.id && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findLatestPosts = async ({ count }: { count?: number }): Promise<Array<Post>> => {
  const _count = count || 4;
  const posts = await fetchPosts();

  return posts ? posts.slice(0, _count) : [];
};

/**
 * Build the static paths for /blog/<category>/ — the category landing page.
 *
 * Emits exactly one URL per category that has at least one post. This is
 * always the page-1 view of the category archive; subsequent pages
 * (/blog/<category>/2/, /3/, …) are emitted separately by
 * `getStaticPathsBlogCategoryEntries`.
 */
export const getStaticPathsBlogCategoryIndex = async () => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];

  const posts = await fetchPosts();
  const categories: Map<string, Taxonomy> = new Map();
  posts.forEach((post) => {
    if (post.category?.slug) {
      categories.set(post.category.slug, post.category);
    }
  });

  return Array.from(categories.entries()).map(([categorySlug, category]) => ({
    params: { category: categorySlug },
    props: {
      category,
      posts: posts.filter((post) => post.category?.slug === categorySlug),
    },
  }));
};

/**
 * Build the static paths for /blog/<category>/<slug>/ — the catch-all route
 * underneath every category.
 *
 * Two kinds of entries are emitted per category:
 *   - `kind: 'post'` — one entry per real article slug. The route renders
 *     the single-post page.
 *   - `kind: 'page'` — one entry per pagination index (2..N), ONLY for
 *     categories whose post count exceeds `CATEGORY_PAGINATION_THRESHOLD`.
 *     The route renders the category archive at page N with prev/next links.
 *
 * Categories below the threshold produce no pagination entries, so
 * /blog/<category>/2/, /3/, … simply do not exist for them. This keeps the
 * URL graph honest: a /2/ URL means "there really is a page 2 here".
 */
export const getStaticPathsBlogCategoryEntries = async () => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];

  const posts = await fetchPosts();
  const byCategory: Map<string, { category: Taxonomy; posts: Post[] }> = new Map();
  posts.forEach((post) => {
    if (post.category?.slug) {
      const bucket = byCategory.get(post.category.slug);
      if (bucket) {
        bucket.posts.push(post);
      } else {
        byCategory.set(post.category.slug, { category: post.category, posts: [post] });
      }
    }
  });

  type PostEntry = {
    params: { category: string; slug: string };
    props: { kind: 'post'; post: Post };
  };
  type PageEntry = {
    params: { category: string; slug: string };
    props: {
      kind: 'page';
      category: Taxonomy;
      pageNumber: number;
      totalPages: number;
      posts: Post[];
      prevUrl: string;
      nextUrl: string | undefined;
    };
  };
  type Entry = PostEntry | PageEntry;
  const out: Entry[] = [];

  for (const [categorySlug, { category, posts: catPosts }] of byCategory) {
    // 1) one entry per real post slug
    for (const post of catPosts) {
      out.push({
        params: { category: categorySlug, slug: post.slug },
        props: { kind: 'post' as const, post },
      });
    }

    // 2) pagination entries (only when over the threshold)
    if (catPosts.length > CATEGORY_PAGINATION_THRESHOLD) {
      const totalPages = Math.ceil(catPosts.length / blogPostsPerPage);
      for (let n = 2; n <= totalPages; n++) {
        const offset = (n - 1) * blogPostsPerPage;
        out.push({
          params: { category: categorySlug, slug: String(n) },
          props: {
            kind: 'page' as const,
            category,
            pageNumber: n,
            totalPages,
            posts: catPosts.slice(offset, offset + blogPostsPerPage),
            prevUrl: n > 2 ? `/blog/${categorySlug}/${n - 1}/` : `/blog/${categorySlug}/`,
            nextUrl: n < totalPages ? `/blog/${categorySlug}/${n + 1}/` : undefined,
          },
        });
      }
    }
  }

  return out;
};

/** */
export const getStaticPathsBlogTag = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogTagRouteEnabled) return [];

  const posts = await fetchPosts();
  const tags: Record<string, Taxonomy> = {};
  posts.map((post) => {
    if (Array.isArray(post.tags)) {
      post.tags.map((tag) => {
        tags[tag.slug] = tag;
      });
    }
  });

  return Array.from(Object.keys(tags)).flatMap((tagSlug) =>
    paginate(
      posts.filter((post) => Array.isArray(post.tags) && post.tags.find((elem) => elem.slug === tagSlug)),
      {
        params: { tag: tagSlug, blog: TAG_BASE || undefined },
        pageSize: blogPostsPerPage,
        props: { tag: tags[tagSlug] },
      }
    )
  );
};

/** */
export async function getRelatedPosts(originalPost: Post, maxResults: number = 4): Promise<Post[]> {
  const allPosts = await fetchPosts();
  const originalTagsSet = new Set(originalPost.tags ? originalPost.tags.map((tag) => tag.slug) : []);

  const postsWithScores = allPosts.reduce((acc: { post: Post; score: number }[], iteratedPost: Post) => {
    if (iteratedPost.slug === originalPost.slug) return acc;

    let score = 0;
    if (iteratedPost.category && originalPost.category && iteratedPost.category.slug === originalPost.category.slug) {
      score += 5;
    }

    if (iteratedPost.tags) {
      iteratedPost.tags.forEach((tag) => {
        if (originalTagsSet.has(tag.slug)) {
          score += 1;
        }
      });
    }

    acc.push({ post: iteratedPost, score });
    return acc;
  }, []);

  postsWithScores.sort((a, b) => b.score - a.score);

  const selectedPosts: Post[] = [];
  let i = 0;
  while (selectedPosts.length < maxResults && i < postsWithScores.length) {
    selectedPosts.push(postsWithScores[i].post);
    i++;
  }

  return selectedPosts;
}
