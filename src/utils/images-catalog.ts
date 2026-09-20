/**
 * Image catalog — typed accessor for `src/data/_images-catalog.json`.
 *
 * The JSON file is the canonical source of truth (see docs/image-catalog.md
 * for the replacement workflow). This module just makes it ergonomic to
 * consume from .astro / .ts files.
 *
 * Field schema (compact keys keep the JSON readable):
 *   p  path        — public URL, e.g. '/images/about/hero.svg'
 *   a  alt         — alt text (already present in the JSON)
 *   r  ratio       — '16/9' | '4/3' | '1/1' | '21/9' | 'cover'
 *   s  size        — [width, height] intrinsic
 *   o  role        — 'hero' | 'content' | 'steps' | 'cover' | 'placeholder'
 *   w  owner       — page slug / section this image serves
 *   t  status      — 'placeholder' | 'approved' | 'needs-replacement'
 *   n  notes       — optional, only on entries that need extra context
 */

import catalogJson from '~/data/_images-catalog.json';

export type ImageRole = 'hero' | 'content' | 'steps' | 'cover' | 'placeholder';
export type ImageStatus = 'placeholder' | 'approved' | 'needs-replacement';
export type ImageRatio = '16/9' | '4/3' | '1/1' | '21/9' | 'cover';

export interface ImageCatalogEntry {
  p: string;
  a: string;
  r: ImageRatio;
  s: [number, number];
  o: ImageRole;
  w: string;
  t: ImageStatus;
  n?: string;
}

interface RawCatalog {
  _about: string;
  [key: string]: string | ImageCatalogEntry;
}

const catalog = catalogJson as unknown as RawCatalog;

export const ABOUT = catalog._about;

export interface ListedEntry {
  key: string;
  entry: ImageCatalogEntry;
}

export const entries: ListedEntry[] = Object.entries(catalog)
  .filter(([k]) => k !== '_about')
  .map(([key, value]) => ({ key, entry: value as ImageCatalogEntry }));

export function listByRole(role: ImageRole): ListedEntry[] {
  return entries.filter((e) => e.entry.o === role);
}

export function listByStatus(status: ImageStatus): ListedEntry[] {
  return entries.filter((e) => e.entry.t === status);
}

export const ROLE_LABEL: Record<ImageRole, string> = {
  hero: 'Hero',
  content: 'Content',
  steps: 'Steps',
  cover: 'Cover',
  placeholder: 'Placeholder',
};

export const STATUS_LABEL: Record<ImageStatus, string> = {
  placeholder: 'Placeholder',
  approved: 'Approved',
  'needs-replacement': 'Needs replacement',
};

export const ROLE_ORDER: readonly ImageRole[] = ['hero', 'content', 'steps', 'cover', 'placeholder'];

export function summary(): { total: number; byStatus: Record<ImageStatus, number>; byRole: Record<ImageRole, number> } {
  const byStatus: Record<ImageStatus, number> = { placeholder: 0, approved: 0, 'needs-replacement': 0 };
  const byRole: Record<ImageRole, number> = { hero: 0, content: 0, steps: 0, cover: 0, placeholder: 0 };
  for (const { entry } of entries) {
    byStatus[entry.t]++;
    byRole[entry.o]++;
  }
  return { total: entries.length, byStatus, byRole };
}
