#!/usr/bin/env node
/**
 * _reorder-pillar-sections.mjs — restore logical §1→§2→§3→... ordering
 * across the 6 pillar cluster files.
 *
 * Why: pillar content was originally written in logical order, but
 * later padding sections were appended via insert_line=45 (top of
 * body) — which inverted the numbering. Result: §1 immediately followed
 * by §18, §11, §17, etc. — no narrative flow.
 *
 * Approach:
 *   1. Parse each pillar into frontmatter + intro + numbered sections.
 *   2. Apply the pillar-specific canonical order from
 *      _pillar-reorder-canonical.mjs.
 *   3. Inject a transition sentence (from the corresponding family
 *      transition file) at the head of each section so the narrative
 *      has semantic closure from the previous section.
 *   4. Re-emit the file in canonical order.
 *
 * Idempotent: re-running after the fix yields identical output.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CANONICAL_ORDER } from './_pillar-reorder-canonical.mjs';
import { COLD } from './_pillar-reorder-cold.mjs';
import { STAINLESS } from './_pillar-reorder-stainless.mjs';
import { HSS } from './_pillar-reorder-hss.mjs';
import { HOT } from './_pillar-reorder-hot.mjs';
import { CARBIDE } from './_pillar-reorder-carbide.mjs';
import { SELECTION } from './_pillar-reorder-selection.mjs';

const POST_DIR = 'src/data/post';
const TRANSITIONS = {
  'pillar-cold-work-tool-steel': COLD,
  'pillar-martensitic-stainless': STAINLESS,
  'pillar-high-speed-steel': HSS,
  'pillar-hot-work-tool-steel': HOT,
  'pillar-tungsten-carbide': CARBIDE,
  'pillar-selection-guide': SELECTION,
};

function parsePillar(raw) {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!fmMatch) throw new Error('No frontmatter found');
  const frontmatter = fmMatch[0];
  const body = raw.slice(frontmatter.length);

  const h1Match = body.match(/^#\s+[^\r\n]*\r?\n/m);
  if (!h1Match) throw new Error('No H1 found');
  const afterH1 = body.slice(h1Match[0].length);

  const sections = [];
  const sectionRe = /^## (\d+)\.\s+([^\r\n]+)\r?\n([\s\S]*?)(?=^## \d+\.|\Z)/gm;
  let m;
  while ((m = sectionRe.exec(afterH1)) !== null) {
    sections.push({ num: parseInt(m[1], 10), title: m[2], body: m[3] });
  }
  const introMatch = afterH1.match(/^([\s\S]*?)(?=^## \d+\.)/m);
  const intro = introMatch ? introMatch[1] : '';
  return { frontmatter, h1: h1Match[0], intro, sections };
}

function rebuild(parsed, order, transitions) {
  const byNum = new Map(parsed.sections.map((s) => [s.num, s]));
  const sorted = order.map((n) => byNum.get(n)).filter(Boolean);
  const extras = parsed.sections.filter((s) => !order.includes(s.num));
  let body = parsed.h1 + parsed.intro;
  for (const sec of sorted) {
    const trans = transitions[sec.num] || '';
    const trimmed = sec.body.replace(/^\s+/, '');
    if (trans) {
      body += `\n\n## ${sec.num}. ${sec.title}\n\n${trans}\n\n${trimmed}`;
    } else {
      body += `\n\n## ${sec.num}. ${sec.title}\n${trimmed}`;
    }
  }
  for (const sec of extras) {
    body += `\n\n## ${sec.num}. ${sec.title}\n${sec.body}`;
  }
  return parsed.frontmatter + body;
}

const files = readdirSync(POST_DIR).filter((f) => f.startsWith('pillar-') && f.endsWith('.md'));
let fixes = 0;
for (const f of files) {
  const slug = f.replace(/\.md$/, '');
  if (!CANONICAL_ORDER[slug]) continue;
  const full = join(POST_DIR, f);
  const raw = readFileSync(full, 'utf8');
  const parsed = parsePillar(raw);
  const order = CANONICAL_ORDER[slug];
  const currentOrder = parsed.sections.map((s) => s.num);
  if (JSON.stringify(currentOrder) === JSON.stringify(order)) {
    console.log(`[skip] ${slug}: already canonical`);
    continue;
  }
  const next = rebuild(parsed, order, TRANSITIONS[slug]);
  if (next !== raw) {
    writeFileSync(full, next, 'utf8');
    console.log(`[reorder] ${slug}: ${currentOrder.length} sections reordered ${currentOrder.slice(0,5).join('...')} → ${order.slice(0,5).join('...')}...`);
    fixes++;
  }
}
console.log(`[reorder] total: ${fixes} pillar${fixes === 1 ? '' : 's'} reordered`);