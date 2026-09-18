// src/data/topics.ts
// ─────────────────────────────────────────────────────────────────────────────
// Blog topic framework — the single source of truth for the 9 blog topics.
//
// "主题即分类" (Topic = Category): every blog post sets its `category`
// frontmatter to one of the slugs below, and the AstroWind template's
// built-in category routes (/category/{slug}/) pick them up automatically.
//
// Why centralize:
//   • One definition powers the Header dropdown, the /blog/ landing-page
//     topic grid, the /blog/topics/ index page, breadcrumbs and JSON-LD
//     emissions — no string drift between 9 different call-sites.
//   • New topics are added by inserting one entry here; everything else
//     (navigation, grids, schemas) updates for free.
//   • The 3 `contentType` values let downstream templates switch layout
//     (compact glossary list, wide comparison table, or normal article list)
//     and emit the right schema.org markup for AI citation.
// ─────────────────────────────────────────────────────────────────────────────

import { getPermalink } from '~/utils/permalinks';

export type TopicContentType = 'article' | 'glossary' | 'comparison';

/** Human-readable icon name; resolved via `astro-icon` (tabler set). */
export interface Topic {
  /** URL slug; used as the post `category` value and the `/category/{slug}/` route. */
  slug: string;
  /** Display title (English). */
  title: string;
  /** Short marketing/SEO description (~140 chars), surfaced in topic grids. */
  description: string;
  /** Tabler icon name (e.g. `tabler:scale`). */
  icon: string;
  /**
   * Content layout for posts in this topic.
   *  - `article`    : standard blog post (topics 1–5)
   *  - `glossary`   : short, structured entries (topics 6–7)
   *  - `comparison` : single-page table / matrix (topics 8–9)
   */
  contentType: TopicContentType;
  /** Target post count, used in topic cards and the topics index page. */
  targetCount: number;
  /** Human count label, e.g. "5", "200+", "500+". Shown in cards. */
  countLabel: string;
  /** Schema.org @type for posts in this topic (used in JSON-LD). */
  jsonLdType: 'Article' | 'DefinedTerm' | 'ItemList' | 'Table';
}

export const TOPICS: ReadonlyArray<Topic> = [
  // ── 1. Material Comparison ───────────────────────────────────────────────
  {
    slug: 'material-comparison',
    title: 'Material Comparison',
    description: 'Head-to-head comparisons of blade steels, carbides and coatings to back specification decisions.',
    icon: 'tabler:scale',
    contentType: 'article',
    targetCount: 5,
    countLabel: '5',
    jsonLdType: 'Article',
  },
  // ── 2. Selection Guides ──────────────────────────────────────────────────
  {
    slug: 'selection-guide',
    title: 'Selection Guides',
    description: 'Step-by-step methodology for choosing the right industrial blade for your substrate and line.',
    icon: 'tabler:list-check',
    contentType: 'article',
    targetCount: 8,
    countLabel: '8',
    jsonLdType: 'Article',
  },
  // ── 3. Maintenance & Care ────────────────────────────────────────────────
  {
    slug: 'maintenance',
    title: 'Maintenance & Care',
    description: 'Re-sharpening, storage, in-process care and life-extension routines that keep blades in service.',
    icon: 'tabler:tool',
    contentType: 'article',
    targetCount: 6,
    countLabel: '6',
    jsonLdType: 'Article',
  },
  // ── 4. Troubleshooting ────────────────────────────────────────────────────
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Diagnose premature wear, chipping, burr and chatter with field-tested decision flows.',
    icon: 'tabler:alert-triangle',
    contentType: 'article',
    targetCount: 5,
    countLabel: '5',
    jsonLdType: 'Article',
  },
  // ── 5. Case Studies ───────────────────────────────────────────────────────
  {
    slug: 'case-studies',
    title: 'Case Studies',
    description: 'Real converters, recyclers and metalworking lines — what failed, what we changed, what it shipped at.',
    icon: 'tabler:briefcase',
    contentType: 'article',
    targetCount: 6,
    countLabel: '6',
    jsonLdType: 'Article',
  },
  // ── 6. Materials Encyclopedia ─────────────────────────────────────────────
  {
    slug: 'materials-encyclopedia',
    title: 'Materials Encyclopedia',
    description: 'Concise reference entries for industrial blade materials, steels and carbides — cited by AI search.',
    icon: 'tabler:book',
    contentType: 'glossary',
    targetCount: 200,
    countLabel: '200+',
    jsonLdType: 'DefinedTerm',
  },
  // ── 7. Industry Glossary ──────────────────────────────────────────────────
  {
    slug: 'glossary',
    title: 'Industry Glossary',
    description: 'Industrial blade terminology defined for engineers, buyers and procurement teams.',
    icon: 'tabler:vocabulary',
    contentType: 'glossary',
    targetCount: 500,
    countLabel: '500+',
    jsonLdType: 'DefinedTerm',
  },
  // ── 8. Coatings Comparison Table ──────────────────────────────────────────
  {
    slug: 'coatings-comparison',
    title: 'Coating Comparison Table',
    description: 'TiN, TiCN, CrN, DLC, AlCrN and more — hardness, friction, temperature and substrate fit side by side.',
    icon: 'tabler:table',
    contentType: 'comparison',
    targetCount: 1,
    countLabel: 'Live table',
    jsonLdType: 'Table',
  },
  // ── 9. Material Grade Converter ───────────────────────────────────────────
  {
    slug: 'material-grade-converter',
    title: 'Material Grade Converter',
    description: 'Cross-reference ASTM / AISI, JIS, DIN / EN and GB designations for tool steel and carbide grades.',
    icon: 'tabler:arrows-exchange',
    contentType: 'comparison',
    targetCount: 1,
    countLabel: 'Live table',
    jsonLdType: 'Table',
  },
] as const;

/** Fast slug → Topic lookup. */
const TOPIC_BY_SLUG: ReadonlyMap<string, Topic> = new Map(TOPICS.map((t) => [t.slug, t]));

/** All topic slugs as a readonly tuple. */
export const TOPIC_SLUGS: ReadonlyArray<string> = TOPICS.map((t) => t.slug);

/** Get a topic by slug. Returns `undefined` for unknown slugs (e.g. legacy posts). */
export function getTopic(slug: string | undefined | null): Topic | undefined {
  if (!slug) return undefined;
  return TOPIC_BY_SLUG.get(slug);
}

/** Resolve a topic slug to its canonical category URL, e.g. `/category/material-comparison/`. */
export function topicHref(slug: string): string {
  return getPermalink(slug, 'category');
}

/** Resolve a topic to its canonical category URL. */
export function topicHrefFor(topic: Topic): string {
  return getPermalink(topic.slug, 'category');
}

/** Build the "Browse all topics" landing page URL. */
export function topicsIndexHref(): string {
  return getPermalink('/blog/topics');
}
