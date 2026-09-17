// src/utils/breadcrumb.ts
// ─────────────────────────────────────────────────────────────────────────────
// Friendly breadcrumb labels for the static route tree.
//
// Most Astro pages do NOT need to do anything special — PageLayout calls
// buildBreadcrumbItems(Astro.url.pathname) and renders <Breadcrumb /> on every
// page automatically. Pages whose last segment is a dynamic value (product
// title, blog post title, subcategory name) build their items manually using
// `buildBreadcrumbItems` plus the resolved last-segment label and pass the
// resulting array into the same <Breadcrumb /> component for rendering.
//
// Adding a new static route: drop the slug into the appropriate lookup table
// below. The helper is the single source of truth for human-readable labels
// across both the visible breadcrumb and the JSON-LD BreadcrumbList emitted
// by ~/layouts/Layout.astro.
// ─────────────────────────────────────────────────────────────────────────────

import {
  buildCategoryHref,
  getCategoryMeta,
  humanizeSlugSegment,
  type Level1Category,
} from '~/utils/products';
import { getPermalink } from '~/utils/permalinks';

export interface BreadcrumbItem {
  /** Visible label. */
  text: string;
  /** Link target. Omit (or set to '') for the current (last) item. */
  href?: string;
}

// ─── Static-route label tables ─────────────────────────────────────────────
// Each entry maps a single URL segment to the label shown in the breadcrumb.

const INDUSTRY_LABELS: Record<string, string> = {
  'printing-packaging': 'Printing & Packaging',
  'paper-tissue': 'Paper & Tissue',
  'food-processing': 'Food Processing',
  'plastics-recycling': 'Plastics Recycling',
  converting: 'Converting',
  metalworking: 'Metalworking',
};

const STATIC_PAGE_LABELS: Record<string, string> = {
  products: 'Products',
  industries: 'Industries',
  solutions: 'Solutions',
  services: 'Services',
  about: 'About',
  contact: 'Contact',
  quality: 'Quality & Certifications',
  blog: 'Blog',
};

const HOME_LABEL = 'Home';

/** Normalise a pathname so the helpers below can split it reliably. */
function normalize(pathname: string): string[] {
  return pathname.split('/').map((s) => s.trim()).filter(Boolean);
}

/**
 * Resolve a single URL segment to its human-readable label. Returns undefined
 * when the segment is unknown so the caller can fall back to humanizing.
 */
function resolveSegmentLabel(segment: string, parentSegments: readonly string[]): string | undefined {
  // Industry leaf — only when parent is /industries/.
  if (parentSegments[0] === 'industries' && parentSegments.length === 1) {
    return INDUSTRY_LABELS[segment];
  }
  // Static page label — only when at the top level (length 0 → length 1).
  if (parentSegments.length === 0) {
    return STATIC_PAGE_LABELS[segment];
  }
  return undefined;
}

/**
 * Build the visible breadcrumb trail for the given pathname.
 *
 * Returns the full chain from Home through the second-to-last segment. The
 * caller is expected to push the current-page item on the end, so deep pages
 * with dynamic last-segment titles (products, blog posts) can keep full
 * control over the final label without duplicating segment-resolution logic.
 *
 * Returns an empty array for the home page itself (no breadcrumb on `/`).
 */
export function buildBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = normalize(pathname);
  if (segments.length === 0) return [];

  const items: BreadcrumbItem[] = [{ text: HOME_LABEL, href: '/' }];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const parentSegments = segments.slice(0, i);
    const label = resolveSegmentLabel(seg, parentSegments) ?? humanizeSlugSegment(seg);
    const href = '/' + [...parentSegments, seg].join('/') + '/';
    items.push({ text: label, href });
  }

  return items;
}

/**
 * Build a breadcrumb chain for a product category page (level-1 or deeper
 * subcategory). The chain always starts at Home → Products, then walks the
 * L1 category and any subcategory segments with their friendly labels.
 */
export function buildProductCategoryBreadcrumb(
  level1: Level1Category,
  subcategories: readonly string[] = []
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { text: HOME_LABEL, href: '/' },
    { text: 'Products', href: getPermalink('/products') },
  ];
  const meta = getCategoryMeta(level1);
  items.push({ text: meta.title, href: buildCategoryHref(level1) });
  subcategories.forEach((seg, idx) => {
    items.push({
      text: humanizeSlugSegment(seg),
      href: buildCategoryHref(level1, subcategories.slice(0, idx + 1)),
    });
  });
  return items;
}

/**
 * Build a breadcrumb chain for a product detail page. Walks L1 category +
 * subcategories and appends the product's own title as the current-page item.
 */
export function buildProductDetailBreadcrumb(
  level1: Level1Category,
  subcategories: readonly string[],
  productTitle: string
): BreadcrumbItem[] {
  const items = buildProductCategoryBreadcrumb(level1, subcategories);
  items.push({ text: productTitle });
  return items;
}

/**
 * Build a breadcrumb chain for a blog post. Omit the category params when
 * the post has no category — the breadcrumb collapses Home → Blog → Title.
 */
export function buildBlogPostBreadcrumb(
  postTitle: string,
  categoryTitle?: string,
  categorySlug?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { text: HOME_LABEL, href: '/' },
    { text: 'Blog', href: getPermalink('/blog') },
  ];
  if (categoryTitle && categorySlug) {
    items.push({ text: categoryTitle, href: getPermalink(categorySlug, 'category') });
  }
  items.push({ text: postTitle });
  return items;
}
