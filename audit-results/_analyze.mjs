#!/usr/bin/env node
/**
 * _analyze.mjs — read-only audit harness for the on-page SEO review.
 * Scans src/, public/, worker/ (excludes .astro/, dist/, node_modules/,
 * audit-results/, ai-seo/, docs/) and emits six JSON blobs to stdout,
 * each preceded by a `<<<SECTION:...>>>` marker line.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = 'c:/Users/User/Desktop/machineknives';
const SCAN_DIRS = ['src', 'public', 'worker'];
const EXCLUDE = [
  '.astro/', 'dist/', 'node_modules/', 'audit-results/',
  'ai-seo/', 'docs/', 'package-lock.json', '.git/',
];
const FILE_EXT = new Set(['.astro', '.ts', '.md', '.mdx', '.yaml', '.json']);

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e.name);
    const rel = relative(ROOT, p).replace(/\\/g, '/');
    if (EXCLUDE.some((s) => rel.includes(s))) continue;
    if (e.isDirectory()) walk(p, out);
    else if (FILE_EXT.has('.' + e.name.split('.').pop())) out.push(p);
  }
  return out;
}

const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));
console.error(`scanned ${files.length} files`);

// ---------- (1) brand + domain occurrences ----------
const BRAND = /KAIPU/gi;
const DOMAIN_LEGACY = /machine-knives\.net/gi;
const DOMAIN_NEW = /industrial-knives\.net/gi;
const brandHits = [], legacyHits = [], newHits = [];
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    BRAND.lastIndex = 0;
    if (BRAND.test(line)) brandHits.push({ file: relative(ROOT, f).replace(/\\/g, '/'), line: i + 1, text: line.trim().slice(0, 200) });
    DOMAIN_LEGACY.lastIndex = 0;
    if (DOMAIN_LEGACY.test(line)) legacyHits.push({ file: relative(ROOT, f).replace(/\\/g, '/'), line: i + 1, text: line.trim().slice(0, 200) });
    DOMAIN_NEW.lastIndex = 0;
    if (DOMAIN_NEW.test(line)) newHits.push({ file: relative(ROOT, f).replace(/\\/g, '/'), line: i + 1, text: line.trim().slice(0, 200) });
  });
}

// ---------- (2) placeholder alt + raw <img> + loading="eager" ----------
const ALT_PH = /alt=["']([^"']*?(?:placeholder|todo|tbd|fixme|xxx)[^"']*?)["']/gi;
const RAW_IMG = /<img\s/gi;
const EAGER = /loading=["']eager["']/gi;
const altHits = [], imgHits = [], eagerHits = [];
for (const f of files) {
  if (!/\.astro$/.test(f)) continue;
  const text = readFileSync(f, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    ALT_PH.lastIndex = 0; let m;
    while ((m = ALT_PH.exec(line))) altHits.push({ file: relative(ROOT, f).replace(/\\/g, '/'), line: i + 1, alt: m[1] });
    RAW_IMG.lastIndex = 0;
    if (RAW_IMG.test(line)) imgHits.push({ file: relative(ROOT, f).replace(/\\/g, '/'), line: i + 1, snippet: line.trim().slice(0, 180) });
    EAGER.lastIndex = 0;
    if (EAGER.test(line)) eagerHits.push({ file: relative(ROOT, f).replace(/\\/g, '/'), line: i + 1, snippet: line.trim().slice(0, 180) });
  });
}

// ---------- (3) encoding corruption (em-dash near digits) ----------
const DASH = /(\d)—(\d)|(\d)—(\D)|(\D)—(\d)/g;
const encodingHits = [];
for (const f of files) {
  if (!/\.(astro|md|mdx|ts)$/.test(f)) continue;
  const text = readFileSync(f, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    DASH.lastIndex = 0; let m;
    while ((m = DASH.exec(line))) encodingHits.push({ file: relative(ROOT, f).replace(/\\/g, '/'), line: i + 1, snippet: line.trim().slice(0, 200), match: m[0] });
  });
}

// ---------- (4) blog frontmatter summary ----------
const POST_DIR = join(ROOT, 'src/data/post');
function parseFrontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!m) return { fm: {}, body: raw };
  const fm = {}; let key = null; let arrBuf = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (line.startsWith('  - ')) { if (arrBuf) arrBuf.push(line.slice(4).trim().replace(/^["']|["']$/g, '')); continue; }
    const kv = /^([\w-]+):\s*(.*)$/.exec(line); if (!kv) continue;
    key = kv[1]; let val = kv[2].trim();
    if (val === '') { arrBuf = []; fm[key] = arrBuf; continue; }
    arrBuf = null;
    val = val.replace(/^["']|["']$/g, '');
    if (/^\d{4}-\d{2}-\d{2}/.test(val)) val = new Date(val).toISOString().slice(0, 10);
    else if (val === 'true') val = true;
    else if (val === 'false') val = false;
    fm[key] = val;
  }
  return { fm, body: m[2] };
}

const postFiles = readdirSync(POST_DIR).filter((f) => /\.(md|mdx)$/.test(f)).sort();
const posts = [];
for (const f of postFiles) {
  const full = join(POST_DIR, f);
  const raw = readFileSync(full, 'utf8');
  const { fm, body } = parseFrontmatter(raw);
  const wordCount = body.replace(/```[\s\S]*?```/g, '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  const desc = (fm.metadata && fm.metadata.description) || fm.excerpt || '';
  posts.push({
    file: f,
    title: fm.title ?? null,
    type: fm.type ?? 'article',
    entityType: fm.entityType ?? null,
    comparisonType: fm.comparisonType ?? null,
    category: fm.category ?? null,
    publishDate: fm.publishDate ?? null,
    updateDate: fm.updateDate ?? null,
    author: fm.author ?? null,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    excerpt_present: Boolean(fm.excerpt),
    description_present: Boolean(desc),
    description_len: String(desc).length,
    image_present: Boolean(fm.image),
    wordCount,
  });
}

const titleMap = new Map();
for (const p of posts) if (p.title) titleMap.set(p.title, (titleMap.get(p.title) || 0) + 1);
const dupTitles = [...titleMap.entries()].filter(([, n]) => n > 1).map(([t, n]) => ({ title: t, count: n }));

const descBuckets = { missing: 0, short_lt80: 0, ok_80_160: 0, long_160_320: 0, too_long: 0 };
for (const p of posts) {
  if (!p.description_present) descBuckets.missing++;
  else if (p.description_len < 80) descBuckets.short_lt80++;
  else if (p.description_len <= 160) descBuckets.ok_80_160++;
  else if (p.description_len <= 320) descBuckets.long_160_320++;
  else descBuckets.too_long++;
}

const wcBuckets = { tiny_lt300: 0, small_300_800: 0, medium_800_1500: 0, long_1500_3000: 0, very_long_3000_plus: 0 };
for (const p of posts) {
  const w = p.wordCount;
  if (w < 300) wcBuckets.tiny_lt300++;
  else if (w < 800) wcBuckets.small_300_800++;
  else if (w < 1500) wcBuckets.medium_800_1500++;
  else if (w < 3000) wcBuckets.long_1500_3000++;
  else wcBuckets.very_long_3000_plus++;
}

const today = new Date('2026-09-27');
const stale = posts.filter((p) => p.publishDate && !p.updateDate)
  .map((p) => ({ ...p, ageDays: Math.round((today - new Date(p.publishDate)) / 86400000) }))
  .filter((p) => p.ageDays > 365).sort((a, b) => b.ageDays - a.ageDays);

const noImage = posts.filter((p) => !p.image_present);

const byType = {}, byCategory = {};
for (const p of posts) {
  byType[p.type] = (byType[p.type] || 0) + 1;
  byCategory[p.category || '(none)'] = (byCategory[p.category || '(none)'] || 0) + 1;
}

// ---------- (5) internal link graph ----------
const hrefRe = /href=["'](\/[^"'#?]*?)["']/g;
const linkGraph = new Map();
function addEdge(from, to) {
  if (!linkGraph.has(from)) linkGraph.set(from, new Set());
  linkGraph.get(from).add(to);
}
for (const f of files) {
  if (!/\.(astro|md|mdx)$/.test(f)) continue;
  const text = readFileSync(f, 'utf8');
  const fromPath = relative(ROOT, f).replace(/\\/g, '/');
  hrefRe.lastIndex = 0; let m;
  while ((m = hrefRe.exec(text))) addEdge(fromPath, m[1]);
}
const inbound = new Map();
for (const [, tos] of linkGraph) for (const t of tos) inbound.set(t, (inbound.get(t) || 0) + 1);

// ---------- emit ----------
const sections = {
  'BRAND': { total: brandHits.length, hits: brandHits },
  'DOMAIN_LEGACY': { total: legacyHits.length, hits: legacyHits },
  'DOMAIN_NEW': { total: newHits.length, hits: newHits },
  'ALT_PLACEHOLDER': { total: altHits.length, hits: altHits },
  'RAW_IMG': { total: imgHits.length, hits: imgHits },
  'EAGER_LOAD': { total: eagerHits.length, hits: eagerHits },
  'ENCODING': { total: encodingHits.length, hits: encodingHits },
  'POSTS': { total: posts.length, byType, byCategory, descBuckets, wcBuckets, duplicateTitles: dupTitles, staleCount: stale.length, staleTop30: stale.slice(0, 30), missingImage: noImage.length, missingImageSamples: noImage.slice(0, 30), posts },
  'LINK_GRAPH': { totalNodes: linkGraph.size, inboundSamples: [...inbound.entries()].sort((a, b) => a[1] - b[1]).slice(0, 30), outboundTop: [...linkGraph.entries()].map(([k, v]) => ({ from: k, n: v.size })).sort((a, b) => b.n - a.n).slice(0, 20) },
};
for (const [k, v] of Object.entries(sections)) {
  process.stdout.write('<<<SECTION:' + k + '>>>' + '\n');
  process.stdout.write(JSON.stringify(v) + '\n');
}