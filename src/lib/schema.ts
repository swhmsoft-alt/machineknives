// src/lib/schema.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zero-Trust Schema Architecture — 编译时第一层防御
// 用途：为新增页面提供类型安全的 Schema 工厂，所有 Schema 生成必须经过 validateSchemaGraph。
// 注意：白名单常量必须与 scripts/audit-schema-strict.mjs 保持同步（双层防御共用同一份真理）。
// ─────────────────────────────────────────────────────────────────────────────

// ─── 路由白名单（基于 src/pages 实际目录）─────────────────────────────────
// 与 scripts/audit-schema-strict.mjs 中的 SCHEMA_PERMISSIONS 同步。
// `Article` 在所有内容路由（products / services / industries）都允许：
// 内容页通常同时承载 Product / Service / Industry 实体 *和* 描述性 Article
// 元数据（headline / author / dateModified）。Article schema 不替换主实体，
// 只是给 AI 引擎一个可直接抽取的、带作者和时间戳的"知识条目"。
export const SCHEMA_PERMISSIONS = {
  '/products/':   ['Product', 'Article', 'CollectionPage', 'BreadcrumbList', 'FAQPage', 'HowTo', 'WebPage', 'ItemList'],
  '/services/':   ['Service', 'Article', 'CollectionPage', 'BreadcrumbList', 'FAQPage', 'HowTo', 'WebPage', 'ItemList'],
  '/industries/': ['Article', 'CollectionPage', 'BreadcrumbList', 'FAQPage', 'WebPage', 'ItemList'],
} as const;

// 未知路径的兜底白名单（绝对禁止 Product / Offer / Service 等高危商业实体）
export const SAFE_FALLBACK_TYPES = [
  'WebPage', 'Article', 'BreadcrumbList', 'FAQPage', 'ItemList', 'AboutPage', 'ContactPage',
] as const;

// 通用全局实体 + 常见嵌套类型（任何页面都允许）
export const GLOBAL_TYPES = [
  'Organization', 'WebSite', 'ImageObject', 'SearchAction',
  'ListItem', 'HowToStep', 'Question', 'Answer', 'Offer',
  'ContactPoint', 'ContactPage', 'Brand', 'Person', 'Country',
  'PostalAddress', 'GeoCoordinates', 'OpeningHoursSpecification',
] as const;

// ─── 类型定义 ──────────────────────────────────────────────────────────────

/**
 * 允许的 pageType 联合类型。新增页面必须使用下列之一；
 * VS Code / astro check 会在拼写错误或非法值时立刻画红线。
 */
export type AllowedPageType =
  | 'product-detail'      // /products/<slug>/
  | 'product-hub'         // /products/
  | 'service-detail'      // /services/<slug>/
  | 'service-hub'         // /services/
  | 'industry-hub'        // /industries/ + 子页面
  | 'webpage'             // 通用兜底
  | 'blog-post';          // 博客文章

export interface SchemaEntity {
  '@type': string;
  '@id'?: string;
  [key: string]: unknown;
}

// ─── 核心：编译时阀门 ──────────────────────────────────────────────────────

/**
 * 终极拦截阀门：在 generatePageSchema 内部或调用方组装完 graph 后调用。
 * 越权或未注册路径 → 立即 throw，阻断 npm run dev / astro build。
 */
export function validateSchemaGraph(urlPath: string, graph: SchemaEntity[]): void {
  const matchedRule = Object.keys(SCHEMA_PERMISSIONS).find((prefix) => urlPath.includes(prefix));
  const isKnown = !!matchedRule;
  const allowed = isKnown
    ? SCHEMA_PERMISSIONS[matchedRule as keyof typeof SCHEMA_PERMISSIONS]
    : SAFE_FALLBACK_TYPES;

  for (const entity of graph) {
    const t = entity['@type'];

    // 放行全局 / 嵌套实体
    if ((GLOBAL_TYPES as readonly string[]).includes(t)) continue;

    if (!(allowed as readonly string[]).includes(t)) {
      if (!isKnown) {
        throw new Error(
          `🚨 [Schema 拦截 - 新增页面保护]\n` +
          `   拦截到未注册的新增路由: ${urlPath}\n` +
          `   当前仅允许基础类型: ${SAFE_FALLBACK_TYPES.join(', ')}\n` +
          `   👉 修复: 若为交易产品，请在 SCHEMA_PERMISSIONS 中注册白名单；` +
          `若为内容，请修改 pageType 剥离 ${t}。`,
        );
      }
      throw new Error(
        `🚨 [Schema 拦截 - 越权修改保护]\n` +
        `   页面 ${urlPath} 尝试越权生成非法实体 "@type":"${t}"！\n` +
        `   该路径规则仅允许: ${allowed.join(', ')}`,
      );
    }
  }
}

// ─── 工厂函数 ──────────────────────────────────────────────────────────────

/**
 * 类型安全的 Schema 工厂。新增页面应通过此函数生成 Schema。
 *
 * @example
 * ```astro
 * ---
 * import { generatePageSchema } from '~/lib/schema';
 * const graph = generatePageSchema('product-detail', Astro.url.pathname, {
 *   name: 'Slitter Blade',
 *   sku: 'SB-001',
 *   price: 1250,
 * });
 * ---
 * <script type="application/ld+json" set:html={JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })} />
 * ```
 */
export function generatePageSchema<T extends AllowedPageType>(
  pageType: T,
  urlPath: string,
  builder: (type: T) => SchemaEntity[],
): SchemaEntity[] {
  const graph = builder(pageType);
  validateSchemaGraph(urlPath, graph);
  return graph;
}

// ─── 快捷 builder（示例骨架，未来扩展时补全）──────────────────────────────

export function buildProductDetail(opts: {
  name: string;
  sku?: string;
  description?: string;
  image?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}): SchemaEntity {
  const entity: SchemaEntity = {
    '@type': 'Product',
    name: opts.name,
  };
  if (opts.sku) entity.sku = opts.sku;
  if (opts.description) entity.description = opts.description;
  if (opts.image) entity.image = opts.image;
  if (typeof opts.price === 'number') {
    entity.offers = {
      '@type': 'Offer',
      price: opts.price,
      priceCurrency: opts.currency || 'USD',
      availability: `https://schema.org/${opts.availability || 'InStock'}`,
    };
  }
  return entity;
}

export function buildBreadcrumb(items: ReadonlyArray<{ name: string; url: string }>): SchemaEntity {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function buildFaqPage(qas: ReadonlyArray<{ q: string; a: string }>): SchemaEntity {
  return {
    '@type': 'FAQPage',
    mainEntity: qas.map((qa) => ({
      '@type': 'Question',
      name: qa.q,
      acceptedAnswer: { '@type': 'Answer', text: qa.a },
    })),
  };
}

/**
 * Build a Schema.org Article entity for AI-extractable metadata on content
 * pages. Always accompanies the primary entity (Product / Service / etc.)
 * — Article does NOT replace the primary entity, it adds the
 * headline / author / dateModified layer that AI engines (ChatGPT,
 * Perplexity, Google AIO) extract most reliably.
 *
 * Author defaults to "Industrial Knives Engineering" Organization — the engineering
 * team that authors our content. Per E-E-A-T guidance we use Organization
 * as the author entity rather than a Person, because individual engineer
 * names are intentionally not exposed.
 *
 * @example
 * buildArticle({
 *   headline: 'D2 Bed Knife for Tissue Converting',
 *   description: 'D2 high-carbon ...',
 *   dateModified: '2026-09-26',
 *   author: { name: 'Industrial Knives Engineering', url: 'https://www.industrial-knives.net/about/' },
 *   url: 'https://www.industrial-knives.net/products/straight/bed-knife-tissue/',
 * })
 */
export function buildArticle(opts: {
  headline: string;
  description?: string;
  dateModified?: string;
  datePublished?: string;
  /** Optional ISO 8601 string. Falls back to dateModified. */
  inLanguage?: string;
  author?: { name: string; url?: string };
  publisher?: { name: string; logoUrl?: string };
  url?: string;
  image?: string;
  /** A Schema.org @type describing what this Article is about (e.g. "Product", "Service"). */
  about?: { '@type': string; [key: string]: unknown };
}): SchemaEntity {
  const authorEntity = opts.author
    ? {
        '@type': 'Organization',
        name: opts.author.name,
        ...(opts.author.url ? { url: opts.author.url } : {}),
      }
    : { '@type': 'Organization', name: 'Industrial Knives Engineering' };

  const publisherEntity = opts.publisher
    ? {
        '@type': 'Organization',
        name: opts.publisher.name,
        ...(opts.publisher.logoUrl ? { logo: { '@type': 'ImageObject', url: opts.publisher.logoUrl } } : {}),
      }
    : { '@type': 'Organization', name: 'Industrial Knives' };

  const entity: SchemaEntity = {
    '@type': 'Article',
    headline: opts.headline,
  };
  if (opts.description) entity.description = opts.description;
  if (opts.dateModified) entity.dateModified = opts.dateModified;
  if (opts.datePublished) entity.datePublished = opts.datePublished;
  if (opts.inLanguage) entity.inLanguage = opts.inLanguage;
  if (opts.url) entity.mainEntityOfPage = { '@type': 'WebPage', '@id': opts.url };
  if (opts.image) entity.image = opts.image;
  entity.author = authorEntity;
  entity.publisher = publisherEntity;
  if (opts.about) entity.about = opts.about as SchemaEntity;
  return entity;
}