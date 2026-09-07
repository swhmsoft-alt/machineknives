import type { CollectionEntry } from 'astro:content';

export const LEVEL1_CATEGORIES = ['circular', 'straight', 'serrated', 'shear', 'granulator', 'custom'] as const;
export type Level1Category = (typeof LEVEL1_CATEGORIES)[number];

export interface CategoryMeta {
  /** Plural form used in titles / nav links. */
  title: string;
  /** Singular form used on product detail pages ("More Circular Blades" -> no, singular for label). */
  label: string;
  description: string;
  icon: string;
}

export const CATEGORIES: Record<Level1Category, CategoryMeta> = {
  circular: {
    title: 'Circular Blades',
    label: 'Circular Blade',
    description: 'Slitting and cutting circular knives for paper, film, foil and tape.',
    icon: 'tabler:circle',
  },
  straight: {
    title: 'Straight Blades',
    label: 'Straight Blade',
    description: 'Top blades for slitting, sheeting and converting lines.',
    icon: 'tabler:rectangle',
  },
  serrated: {
    title: 'Serrated Blades',
    label: 'Serrated Blade',
    description: 'Toothed blades for tear-strips and perforations.',
    icon: 'tabler:wave-saw-tool',
  },
  shear: {
    title: 'Shear Blades',
    label: 'Shear Blade',
    description: 'Industrial shear blades for guillotine and swing-beam cutting.',
    icon: 'tabler:scissors',
  },
  granulator: {
    title: 'Granulator Knives',
    label: 'Granulator Knife',
    description: 'Rotor and stator knives for plastics granulators.',
    icon: 'tabler:rotate',
  },
  custom: {
    title: 'Custom Blades',
    label: 'Custom Blade',
    description: 'Reverse-engineered from your sample or drawing.',
    icon: 'tabler:tool',
  },
};

export function isLevel1Category(value: string): value is Level1Category {
  return (LEVEL1_CATEGORIES as readonly string[]).includes(value);
}

/** Build a category page URL: /products/{level1}[/{sub1}[/{sub2}[/{sub3}]]]/ */
export function buildCategoryHref(level1: string, subcategories: readonly string[] = []): string {
  return ['/products', level1, ...subcategories].join('/') + '/';
}

/** Build a product page URL: /products/{level1}[/{sub1}/...]/[productId]/ */
export function buildProductHref(
  level1: string,
  productId: string,
  subcategories: readonly string[] = []
): string {
  return ['/products', level1, ...subcategories, productId].join('/') + '/';
}

/** Convenience wrapper that reads the product's own frontmatter. */
export function buildProductHrefFromEntry(product: CollectionEntry<'product'>): string {
  const subcategories = product.data.subcategories ?? [];
  return buildProductHref(product.data.category, product.id, subcategories);
}

/**
 * Parse a `[...slug]` value into its parts. The first segment is always the
 * level-1 category; the rest are subcategory segments.
 */
export function splitSlug(slug: string | undefined): string[] {
  if (!slug) return [];
  return slug.split('/').filter(Boolean);
}

/**
 * Humanize a slug segment for use as a heading when no metadata is registered
 * for it (i.e. level 2 / level 3 subcategories defined only by products).
 */
export function humanizeSlugSegment(segment: string): string {
  return segment
    .split('-')
    .map((part) => (part.length === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join(' ');
}