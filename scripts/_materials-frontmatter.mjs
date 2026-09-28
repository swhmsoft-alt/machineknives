/**
 * _materials-frontmatter.mjs — index that merges the 4 family-level
 * frontmatter dicts into a single lookup. Used by
 * scripts/_expand-frontmatter-templates.mjs.
 *
 * Each family dict is keyed by post slug. Total 27 entries.
 */
import { STAINLESS } from './_materials-frontmatter-stainless.mjs';
import { COLD_WORK } from './_materials-frontmatter-cold.mjs';
import { HOT_HSS } from './_materials-frontmatter-hot-hss.mjs';
import { CARBIDE } from './_materials-frontmatter-carbide.mjs';

export const FRONTMATTER_INTROS = {
  ...STAINLESS,
  ...COLD_WORK,
  ...HOT_HSS,
  ...CARBIDE,
};

export const SLUG_COUNT = Object.keys(FRONTMATTER_INTROS).length;