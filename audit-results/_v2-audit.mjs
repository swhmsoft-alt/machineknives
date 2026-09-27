// audit-results/_v2-audit.mjs
// v2 single-page on-page-SEO audit. Static read-only pass over src/data/.
// Outputs JSON dataset (stdout + on-page-seo-audit-v2-single-pages.json).

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'src', 'data');
const OUT_DIR = path.resolve(process.cwd(), 'audit-results');
const BRAND_SUFFIX = ' — Industrial Knives';

const CTA_VERBS = [
  'request a quote','request quote','get a quote','contact us','send a drawing',
  'send your drawing','request a callback','talk to engineering','order now',
  'buy now','shop now','learn more','read more','find out more','download',
  'compare','browse','book a','schedule a',
];
const CATEGORY_KEYWORDS = {
  circular: ['circular','blade'],
  straight: ['straight','blade'],
  serrated: ['serrated','blade'],
  shear: ['shear','blade'],
  granulator: ['granulator','knife','blade'],
  custom: ['custom','blade'],
};

const charLen = (s) => (typeof s === 'string' ? Array.from(s).length : 0);
const pct = (n, d) => (d === 0 ? '0%' : ((n / d) * 100).toFixed(1) + '%');
const bucketLengths = (arr) => {
  const b = { lt30:0, b30_50:0, b50_60:0, b60_80:0, b80_120:0, ge120:0 };
  for (const n of arr) {
    if (n < 30) b.lt30++;
    else if (n < 50) b.b30_50++;
    else if (n < 60) b.b50_60++;
    else if (n < 80) b.b60_80++;
    else if (n < 120) b.b80_120++;
    else b.ge120++;
  }
  return b;
};
const findDupes = (items) => {
  const m = new Map();
  for (const it of items) if (it) m.set(it, (m.get(it) || 0) + 1);
  return [...m.entries()].filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]).slice(0, 10);
};
const hasCta = (s) => {
  if (typeof s !== 'string' || !s) return false;
  const l = s.toLowerCase();
  return CTA_VERBS.some((v) => l.includes(v));
};
const productTitleHasKeyword = (t, cat) => {
  if (typeof t !== 'string') return false;
  const head = t.toLowerCase().slice(0, 30);
  const kws = CATEGORY_KEYWORDS[cat] || ['blade', 'knife'];
  return kws.some((k) => head.includes(k));
};

function listMd(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => path.join(dir, f)).sort();
}
function parseFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const hasBom = raw.charCodeAt(0) === 0xfeff;
  return {
    relPath: path.relative(process.cwd(), file),
    fm: parseFrontmatter(raw),
    hasBom,
  };
}

// Minimal frontmatter parser tailored to this dataset. Supports:
//   key: value
//   key: 'value with spaces'
//   key: "value with spaces"
//   key:\n  - item\n  - item
//   key:\n  nested: value\nReturns an object with only known keys; nested objects are 1 level deep.
function parseFrontmatter(raw) {
  // Strip UTF-8 BOM if present (per .clinerules §0.5, BOMs in this project
  // are a Windows/PowerShell write artefact and must not reach downstream
  // parsers — see scripts/check-unicode.mjs).
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const lines = m[1].split(/\r?\n/);
  const out = {};
  let i = 0;
  const unquote = (s) => {
    s = s.trim();
    if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
      return s.slice(1, -1);
    }
    return s;
  };
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) { i++; continue; }
    const m1 = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m1) { i++; continue; }
    const key = m1[1];
    const rest = m1[2].trim();
    if (rest === '') {
      // nested block: collect indented lines
      const child = {};
      const arr = [];
      i++;
      while (i < lines.length) {
        const cl = lines[i];
        if (!cl.trim()) { i++; continue; }
        if (!/^\s/.test(cl)) break;
        const cm = cl.match(/^\s+(?:-\s*)?([A-Za-z_][\w-]*):\s*(.*)$/);
        if (cm) {
          child[cm[1]] = unquote(cm[2]);
        } else {
          const am = cl.match(/^\s+-\s*(.*)$/);
          if (am) arr.push(unquote(am[1]));
        }
        i++;
      }
      out[key] = Object.keys(child).length ? child : arr;
    } else {
      out[key] = unquote(rest);
      i++;
    }
  }
  return out;
}

function auditProduct({ relPath, fm, hasBom }) {
  const title = fm.title ?? '';
  const excerpt = fm.excerpt ?? '';
  const metaDesc = fm.metadata?.description ?? '';
  const category = fm.category ?? '';
  const fullTitle = `${title}${BRAND_SUFFIX}`;
  const titleLen = charLen(fullTitle);
  const descLen = charLen(excerpt);
  return {
    file: relPath,
    id: fm.id ?? path.basename(relPath, '.md'),
    title, titleLen: charLen(title),
    fullTitle, fullTitleLen: titleLen,
    titleBucket:
      titleLen < 30 ? '<30' :
      titleLen < 50 ? '30-49' :
      titleLen < 60 ? '50-59' :
      titleLen < 80 ? '60-79' : '80+',
    excerpt, excerptLen: charLen(excerpt),
    hasMetaDescOverride: Boolean(metaDesc),
    metaDescLen: charLen(metaDesc),
    metaDesc,
    effectiveDescLen: descLen,
    effectiveDescBucket:
      descLen === 0 ? '0-empty' :
      descLen < 80 ? '<80' :
      descLen < 120 ? '80-119' :
      descLen <= 160 ? '120-160' : '>160',
    category,
    titleKeyword: productTitleHasKeyword(title, category),
    cta: hasCta(excerpt),
    hasImage: Boolean(fm.image),
    draft: Boolean(fm.draft),
    hasBom,
  };
}

function auditPost({ relPath, fm, hasBom }) {
  const title = fm.title ?? '';
  const excerpt = fm.excerpt ?? '';
  const metaDesc = fm.metadata?.description ?? '';
  const tags = Array.isArray(fm.tags) ? fm.tags : [];
  const category = fm.category ?? '';
  const type = fm.type ?? 'article';
  const fullTitle = `${title}${BRAND_SUFFIX}`;
  const titleLen = charLen(fullTitle);
  const descLen = charLen(excerpt);
  return {
    file: relPath,
    slug: path.basename(relPath, '.md'),
    title, titleLen: charLen(title),
    fullTitle, fullTitleLen: titleLen,
    titleBucket:
      titleLen < 30 ? '<30' :
      titleLen < 50 ? '30-49' :
      titleLen < 60 ? '50-59' :
      titleLen < 80 ? '60-79' : '80+',
    excerpt, excerptLen: charLen(excerpt),
    hasMetaDescOverride: Boolean(metaDesc),
    metaDescLen: charLen(metaDesc),
    metaDesc,
    metaDescIgnoredByTemplate: Boolean(metaDesc) && metaDesc !== excerpt,
    effectiveDescLen: descLen,
    effectiveDescBucket:
      descLen === 0 ? '0-empty' :
      descLen < 80 ? '<80' :
      descLen < 120 ? '80-119' :
      descLen <= 160 ? '120-160' : '>160',
    category, type, tagsCount: tags.length,
    cta: hasCta(excerpt),
    hasImage: Boolean(fm.image),
    publishDate: fm.publishDate instanceof Date ? fm.publishDate.toISOString().slice(0, 10) : String(fm.publishDate ?? ''),
    hasBom,
  };
}

function aggregate(items) {
  const all = items.length;
  const drafts = items.filter((i) => i.draft).length;
  return {
    total: all,
    drafts,
    live: all - drafts,
    titleBuckets: bucketLengths(items.map((i) => i.fullTitleLen)),
    titleDupes: findDupes(items.map((i) => i.title)),
    fullTitleDupes: findDupes(items.map((i) => i.fullTitle)),
    descBuckets: bucketLengths(items.map((i) => i.effectiveDescLen)),
    descDupes: findDupes(items.map((i) => i.effectiveDesc)),
    missingDesc: items.filter((i) => i.effectiveDescLen === 0).length,
    missingImage: items.filter((i) => !i.hasImage).length,
    ctaPresent: items.filter((i) => i.cta).length,
    metaDescIgnored: items.filter((i) => i.metaDescIgnoredByTemplate).length,
    metaDescPresent: items.filter((i) => i.hasMetaDescOverride).length,
    bomCount: items.filter((i) => i.hasBom).length,
  };
}

const productFiles = listMd(path.join(ROOT, 'product'));
const postFiles = listMd(path.join(ROOT, 'post'));
const productRows = productFiles.map(parseFile).map(auditProduct);
const postRows = postFiles.map(parseFile).map(auditPost);
// Buckets reflect LIVE products only so compliance rates (live/total) line up.
const productLiveRows = productRows.filter((r) => !r.draft);
const productAgg = aggregate(productLiveRows);
const postAgg = aggregate(postRows);

const dataset = {
  meta: {
    generatedAt: new Date().toISOString(),
    scope: 'product-single + blog-post-single',
    productCount: productRows.length,
    postCount: postRows.length,
    brandSuffix: BRAND_SUFFIX,
    titleLengthTarget: '50–60 chars',
    descriptionLengthTarget: '120–160 chars',
  },
  product: { summary: productAgg, rows: productRows },
  post: { summary: postAgg, rows: postRows },
};

const json = JSON.stringify(dataset, null, 2);
process.stdout.write(json + '\n');
const outFile = path.join(OUT_DIR, 'on-page-seo-audit-v2-single-pages.json');
fs.writeFileSync(outFile, json, 'utf8');
process.stderr.write(`\n[v2-audit] products=${productRows.length} drafts=${productAgg.drafts} live=${productAgg.live}\n[v2-audit] posts=${postRows.length}\n[v2-audit] JSON written -> ${path.relative(process.cwd(), outFile)}\n`);