// scripts/build-okf.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Open Knowledge Format (OKF) bundle —Google 2026.06 v0.1.
// Generates a directory of cross-linked markdown files with YAML frontmatter
// at dist/okf/. AI agents can ingest this without scraping.
//
// Scope (minimal viable):
//   - dist/okf/index.md                    (master site index)
//   - dist/okf/knowledge/<id>/index.md     (one per src/data/facts/<id>.yaml)
//
// Why minimal: OKF is a no-confirmed-ranking-signal protocol-layer
// registration (per ai-seo-SKILL §"okf"). We expose our 4 knowledge nodes
// (the highest-trust, fact-grounded content) — products / blog are reachable
// via the HTML site + llms-full.txt, which already have higher AI visibility.
//
// Wired into `npm run build` after build-llms-full.mjs.
// ─────────────────────────────────────────────────────────────────────────────

import { glob } from 'glob';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const SRC_DATA = path.join(ROOT, 'src/data');
const DIST_DIR = path.join(ROOT, 'dist');
const OKF_DIR = path.join(DIST_DIR, 'okf');

const SITE_URL = 'https://custommachineknives.com';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Humanize a kebab-case slug: 'granulator-knife-recycling' → 'Granulator Knife Recycling'. */
function humanize(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Render a YAML frontmatter block + markdown body. */
function renderMarkdown(frontmatterObj, body) {
  const yamlStr = yaml.dump(frontmatterObj, {
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
    quotingType: '"',
  });
  return `---\n${yamlStr}---\n\n${body.trim()}\n`;
}
/**
 * Build the body of a knowledge node from the parsed facts.yaml.
 */
function knowledgeBody(parsed, canonical) {
  const gain = parsed.info_gain || {};
  const material = gain.material_constants || [];
  const processCtrls = gain.process_controls || [];
  const complianceCtrls = gain.compliance_controls || [];
  const forbidden = parsed.forbidden || {};

  const lines = [];
  lines.push(`# ${humanize(parsed.node.id)}`);
  lines.push('');
  lines.push(`> Single source of truth for ${humanize(parsed.node.id)} content.`);
  lines.push(`> All technical claims here are derived from \`src/data/facts/${parsed.node.id}.yaml\`.`);
  lines.push(`> For the canonical page, see: ${canonical}`);
  lines.push('');

  if (parsed.material?.spec) {
    lines.push('## Material');
    lines.push('');
    lines.push(`- Grade: ${parsed.material.spec}`);
    lines.push('');
  }

  if (material.length > 0) {
    lines.push('## Material Constants');
    lines.push('');
    for (const c of material) lines.push(`- ${c}`);
    lines.push('');
  }

  if (parsed.process?.bounds) {
    lines.push('## Process');
    lines.push('');
    lines.push(`- ${parsed.process.bounds}`);
    lines.push('');
  }

  if (processCtrls.length > 0) {
    lines.push('## Process Controls');
    lines.push('');
    for (const p of processCtrls) lines.push(`- ${p}`);
    lines.push('');
  }

  if (parsed.cert?.scope || complianceCtrls.length > 0) {
    lines.push('## Compliance');
    lines.push('');
    if (parsed.cert?.scope) lines.push(`- Scope: ${parsed.cert.scope}`);
    for (const c of complianceCtrls) lines.push(`- ${c}`);
    lines.push('');
  }

  const forbidSections = [
    { key: 'materials_not_in_input', label: 'Materials not in scope' },
    { key: 'standards_not_in_input', label: 'Standards not in scope' },
    { key: 'surface_treatments_not_in_input', label: 'Surface treatments not in scope' },
    { key: 'equipment_brands_not_in_input', label: 'Equipment brands not in scope' },
  ];
  const fabrications = forbidden.fabrications_prohibited || [];
  const hasAnyForbidden =
    forbidSections.some((s) => (forbidden[s.key] || []).length > 0) || fabrications.length > 0;

  if (hasAnyForbidden) {
    lines.push('## Out of Scope (forbidden —do not appear in published content)');
    lines.push('');
    for (const sec of forbidSections) {
      const items = forbidden[sec.key] || [];
      if (items.length > 0) {
        lines.push(`### ${sec.label}`);
        for (const it of items) lines.push(`- ${it}`);
        lines.push('');
      }
    }
    if (fabrications.length > 0) {
      lines.push('### Fabrications prohibited');
      for (const it of fabrications) lines.push(`- ${it}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}
// ─── Discover facts nodes ───────────────────────────────────────────────────

/**
 * Some facts.yaml files contain list items that mix double-quoted and
 * unquoted scalars in a single item (e.g. `- "Years in business" figures
 * beyond "since 1998"`). Per YAML 1.2 spec this is invalid; js-yaml v4
 * correctly rejects it. Wrap the entire scalar in single quotes so the
 * embedded double quotes become literal characters.
 *
 * Also strip UTF-8 BOM and normalize CRLF → LF (some files were authored
 * on Windows).
 */
function sanitizeYaml(content) {
  const lines = content.replace(/^﻿/, '').replace(/\r\n/g, '\n').split('\n');
  return lines
    .map((line) => {
      const m = line.match(/^(\s*-\s+)(.*)$/);
      if (!m) return line;
      const [, prefix, value] = m;
      if (value.startsWith("'")) return line;
      // Pattern: starts with `"X"` followed by space + more plain text.
      if (/^"[^"]+"\s+\S/.test(value)) {
        const escaped = value.replace(/'/g, "''");
        return prefix + "'" + escaped + "'";
      }
      return line;
    })
    .join('\n');
}

const factFiles = glob.sync('*.yaml', { cwd: path.join(SRC_DATA, 'facts') }).sort();
const knowledgeNodes = [];

for (const file of factFiles) {
  const id = path.basename(file, '.yaml');
  const raw = fs.readFileSync(path.join(SRC_DATA, 'facts', file), 'utf8');
  const sanitized = sanitizeYaml(raw);
  const parsed = yaml.load(sanitized, { schema: yaml.CORE_SCHEMA });
  // Heuristic canonical mapping — if the id matches a product slug, link to it.
  const productMatch = glob
    .sync('*.md', { cwd: path.join(SRC_DATA, 'product') })
    .find((p) => path.basename(p, '.md') === id);
  const canonical = productMatch
    ? `${SITE_URL}/products/${parsed.material?.spec?.toLowerCase().includes('skd11') ? 'granulator' : 'straight'}/${id}/`
    : `${SITE_URL}/products/`;

  const frontmatter = {
    type: 'KnowledgeNode',
    id,
    title: humanize(id),
    subject: 'IndustrialBladeEngineering',
    canonical,
    description: parsed.material?.spec
      ? `Engineering knowledge node: ${parsed.material.spec}, ${parsed.process?.bounds || 'see body'}.`
      : `Engineering knowledge node: ${humanize(id)}.`,
    source: `src/data/facts/${file}`,
    certification: parsed.cert?.scope || 'ISO 9001:2015 (material traceability per §8.5)',
    cross_links: ['/', '/products/', '/llms-full.txt', '/pricing.md'],
  };

  const body = knowledgeBody(parsed, canonical);
  knowledgeNodes.push({ id, frontmatter, body, path: path.join(OKF_DIR, 'knowledge', id, 'index.md') });
}

// ─── Write knowledge nodes ──────────────────────────────────────────────────

for (const node of knowledgeNodes) {
  fs.mkdirSync(path.dirname(node.path), { recursive: true });
  fs.writeFileSync(node.path, renderMarkdown(node.frontmatter, node.body), 'utf8');
}

// ─── Master index ───────────────────────────────────────────────────────────

const indexBody = [
  '# KAIPU —Open Knowledge Bundle',
  '',
  `> Generated by \`scripts/build-okf.mjs\` at build time.`,
  `> Canonical site: ${SITE_URL}`,
  `> Companion files: [llms.txt](/llms.txt) · [llms-full.txt](/llms-full.txt) · [pricing.md](/pricing.md)`,
  '',
  '## Knowledge Nodes',
  '',
  '> Single-source-of-truth engineering content, derived from `src/data/facts/*.yaml`.',
  '',
  ...knowledgeNodes.map((n) => `- [${n.frontmatter.title}](/okf/knowledge/${n.id}/) — ${n.frontmatter.description}`),
  '',
  '## Site Structure',
  '',
  '- Products: /products/',
  '- Services: /services/',
  '- Solutions: /solutions/',
  '- Industries: /industries/',
  '- Blog: /blog/',
  '- About: /about/',
  '- Contact: /contact/',
  '',
  '## Protocol',
  '',
  '- Format: Open Knowledge Format (OKF) v0.1 —directory of cross-linked markdown files with YAML frontmatter.',
  '- Frontmatter is the machine-readable metadata layer; markdown body is the human/agent readable knowledge layer.',
  '- Re-generation: every `npm run build`. Source of truth: `src/data/facts/*.yaml`.',
  '',
].join('\n');

const indexPath = path.join(OKF_DIR, 'index.md');
fs.mkdirSync(OKF_DIR, { recursive: true });
fs.writeFileSync(
  indexPath,
  renderMarkdown(
    { type: 'OKFBundle', title: 'KAIPU Open Knowledge Bundle', generated_by: 'scripts/build-okf.mjs', site: SITE_URL, version: 'okf-0.1' },
    indexBody,
  ),
  'utf8',
);

// ─── Summary ────────────────────────────────────────────────────────────────

console.log(`[build-okf] wrote ${knowledgeNodes.length} knowledge nodes + 1 index → ${OKF_DIR}/`);
console.log(`  nodes: ${knowledgeNodes.map((n) => n.id).join(', ')}`);