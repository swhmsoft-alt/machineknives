// scripts/build-llms-full.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Aggregated /llms-full.txt —machine-readable full-site context for LLMs/agents.
//
// Reads:
//   - public/llms.txt                  (site structure + editorial principles)
//   - public/llms/*.txt                (knowledge nodes —fact-grounded)
//   - src/data/product/*.md            (product catalog —frontmatter only)
//   - src/data/post/*.md               (comparison + case-study + glossary)
//
// Output:
//   - dist/llms-full.txt               (single file AI ingestion target)
//
// Wired into `npm run build` between postbuild.js and audit-schema-strict.mjs.
//
// Why one file: AI agents and context windows prefer one large, well-organized
// file over hundreds of HTTP fetches. See ai-seo-SKILL §"Machine-Readable Files
// for AI Agents" / "llms-full.txt" guidance. The format mirrors the spec at
// llmstxt.org and is non-overlapping with the curated llms.txt at the root.
// ─────────────────────────────────────────────────────────────────────────────

import { glob } from 'glob';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const DIST_DIR = path.join(ROOT, 'dist');
const SRC_DATA = path.join(ROOT, 'src/data');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Minimal YAML frontmatter parser. Returns `{ data: {key: string}, body }`.
 * Sufficient for our schema (flat scalar fields only — title, excerpt,
 * category, bladeMaterial, hardness, type, draft). Array / nested values are
 * ignored; consumers must tolerate that.
 */
function parseFrontmatter(md) {
  // Strip UTF-8 BOM if present (some files start with U+FEFF).
  const stripped = md.replace(/^\uFEFF/, '');
  const match = stripped.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, body: stripped };
  const yaml = match[1];
  const body = stripped.slice(match[0].length).replace(/^\r?\n/, '');
  const data = {};
  for (const line of yaml.split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_][\w]*):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    }
    data[m[1]] = value;
  }
  return { data, body };
}

/**
 * Local URL for a product file. Mirrors src/pages/products/[...slug].astro
 * for the common case (no subcategories array):
 *   /products/<category>/<slug>/
 */
function productUrl(category, file) {
  const slug = path.basename(file, '.md');
  return `/products/${category}/${slug}/`;
}
// ─── Build sections ─────────────────────────────────────────────────────────

const sections = [];

// (1) Site overview from llms.txt (Site Structure + Editorial Principles).
const llmsTxt = fs.readFileSync(path.join(PUBLIC_DIR, 'llms.txt'), 'utf8');
sections.push(llmsTxt.trim());

// (2) Knowledge Nodes — full text (the fact-grounded source of truth).
const nodeFiles = glob.sync('*.txt', { cwd: path.join(PUBLIC_DIR, 'llms') }).sort();
if (nodeFiles.length > 0) {
  sections.push('\n\n---\n\n# Knowledge Nodes —Full Text\n');
  sections.push(
    '> Each node below is a single source of truth, derived from src/data/facts/<node-id>.yaml.',
  );
  sections.push('> No fabricated metrics, brands, certifications, or production capacity.\n');
  for (const nodeFile of nodeFiles) {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'llms', nodeFile), 'utf8');
    sections.push('\n' + content.trim());
  }
}

// (3) Product catalog — frontmatter only (truth lives in product page + facts).
const productFiles = glob.sync('*.md', { cwd: path.join(SRC_DATA, 'product') }).sort();
const products = [];
for (const file of productFiles) {
  const { data } = parseFrontmatter(fs.readFileSync(path.join(SRC_DATA, 'product', file), 'utf8'));
  if (data.draft === 'true') continue;
  products.push({ file, data });
}
sections.push('\n\n---\n\n# Product Catalog\n');
sections.push(
  `> ${products.length} products across 6 categories. Detail-level specs and process data: see individual product pages linked below.\n`,
);
for (const { file, data } of products) {
  const title = data.title || path.basename(file, '.md');
  sections.push(`\n## ${title}`);
  if (data.category) sections.push(`- Category: ${data.category}`);
  if (data.bladeMaterial) sections.push(`- Material: ${data.bladeMaterial}`);
  if (data.hardness) sections.push(`- Hardness: ${data.hardness}`);
  if (data.excerpt) sections.push(`- ${data.excerpt}`);
  if (data.category) sections.push(`- URL: ${productUrl(data.category, file)}`);
}
// (4) Comparison + case-study + glossary posts — high-AI-citation content types.
const postFiles = glob.sync('*.md', { cwd: path.join(SRC_DATA, 'post') });
const comparisons = [];
const caseStudies = [];
const glossaries = [];
const encyclopedia = [];
for (const file of postFiles) {
  const { data } = parseFrontmatter(fs.readFileSync(path.join(SRC_DATA, 'post', file), 'utf8'));
  if (data.draft === 'true') continue;
  if (data.type === 'comparison') comparisons.push({ file, data });
  else if (file.startsWith('case-study-')) caseStudies.push({ file, data });
  else if (file.startsWith('glossary-')) glossaries.push({ file, data });
  else encyclopedia.push({ file, data });
}

if (comparisons.length > 0) {
  sections.push('\n\n---\n\n# Comparison Articles\n');
  sections.push(
    `> ${comparisons.length} head-to-head comparison articles —the format AI engines cite most often for [X vs Y] queries.\n`,
  );
  for (const { file, data } of comparisons) {
    const title = data.title || path.basename(file, '.md');
    sections.push(`\n## ${title}`);
    if (data.excerpt) sections.push(data.excerpt);
  }
}

if (caseStudies.length > 0) {
  sections.push('\n\n---\n\n# Case Studies\n');
  sections.push(
    `> ${caseStudies.length} engineering case studies with documented outcomes, material/process context, and traceability.\n`,
  );
  for (const { file, data } of caseStudies) {
    const title = data.title || path.basename(file, '.md');
    sections.push(`\n## ${title}`);
    if (data.excerpt) sections.push(data.excerpt);
  }
}

if (glossaries.length > 0) {
  sections.push('\n\n---\n\n# Industry Glossary\n');
  sections.push(
    `> ${glossaries.length} short reference entries —optimized for "What is X?" queries.\n`,
  );
  for (const { file, data } of glossaries) {
    const title = data.title || path.basename(file, '.md');
    sections.push(`- ${title}`);
  }
}

if (encyclopedia.length > 0) {
  sections.push('\n\n---\n\n# Materials Encyclopedia\n');
  sections.push(
    `> ${encyclopedia.length} steel/material grade entries —grounded in production data, not marketing copy.\n`,
  );
  for (const { file, data } of encyclopedia) {
    const title = data.title || path.basename(file, '.md');
    sections.push(`- ${title}`);
  }
}

// (5) Footer — restated editorial principles for self-containment.
sections.push('\n\n---\n\n# Editorial Principles (Summary)\n');
sections.push(
  [
    '- All technical content is derived from documented engineering data, not marketing copy.',
    '- Material specifications cite specific steel grades (D2, M2, SKD11, tungsten carbide).',
    '- Process control points cover heat treatment, fixturing, edge preparation, and inter-process datum verification.',
    '- Compliance scope is limited to ISO 9001:2015 with §8.5 material traceability.',
    '- No specific equipment brands, customer names, production capacity, or geographic shipment specifics are cited.',
    '- Knowledge nodes are single-source-of-truth. Product catalog excerpts are derived from frontmatter; for process control, see the linked product page and its corresponding facts source.',
  ].join('\n'),
);

// ─── Write ──────────────────────────────────────────────────────────────────

const output = sections.join('\n') + '\n';
const outPath = path.join(DIST_DIR, 'llms-full.txt');
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.writeFileSync(outPath, output, 'utf8');

console.log(`[build-llms-full] wrote ${output.length.toLocaleString()} chars → ${outPath}`);
console.log(
  `  nodes: ${nodeFiles.length} | products: ${products.length} | comparisons: ${comparisons.length} | case-studies: ${caseStudies.length} | glossaries: ${glossaries.length} | encyclopedia: ${encyclopedia.length}`,
);