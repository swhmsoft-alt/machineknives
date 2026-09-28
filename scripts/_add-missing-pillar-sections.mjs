#!/usr/bin/env node
/**
 * _add-missing-pillar-sections.mjs — fill in the one missing §N per
 * pillar. Each pillar is missing exactly one section that was skipped
 * during the original writing. After this script inserts the section,
 * run _reorder-pillar-sections.mjs to verify the canonical ordering.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { COLD } from './_missing-cold.mjs';
import { STAINLESS } from './_missing-stainless.mjs';
import { HSS } from './_missing-hss.mjs';
import { HOT } from './_missing-hot.mjs';
import { CARBIDE } from './_missing-carbide.mjs';
import { SELECTION } from './_missing-selection.mjs';

const POST_DIR = 'src/data/post';

const MISSING = {
  'pillar-cold-work-tool-steel': COLD,
  'pillar-martensitic-stainless': STAINLESS,
  'pillar-high-speed-steel': HSS,
  'pillar-hot-work-tool-steel': HOT,
  'pillar-tungsten-carbide': CARBIDE,
  'pillar-selection-guide': SELECTION,
};

let inserted = 0;
for (const [slug, sec] of Object.entries(MISSING)) {
  const full = join(POST_DIR, `${slug}.md`);
  const raw = readFileSync(full, 'utf8');

  // Check whether section is already present.
  const re = new RegExp(`^##\\s+${sec.num}\\.\\s+${sec.title.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}`, 'm');
  if (re.test(raw)) {
    console.log(`[skip] ${slug}: §${sec.num} ${sec.title} already present`);
    continue;
  }

  // Insert just before `## ${sec.num + 1}.` heading. If not found, append.
  const lines = raw.split(/\r?\n/);
  let insertAt = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(new RegExp(`^##\\s+${sec.num + 1}\\.\\s+`))) {
      insertAt = i;
      break;
    }
  }
  if (insertAt < 0) insertAt = lines.length;

  const sectionText = `## ${sec.num}. ${sec.title}\n\n${sec.body}\n`;
  const before = lines.slice(0, insertAt).join('\n');
  const after = lines.slice(insertAt).join('\n');
  // Ensure exactly one blank line between content blocks
  const beforeFixed = before.endsWith('\n\n') ? before : (before + '\n');
  const next = beforeFixed + sectionText + '\n' + after;

  writeFileSync(full, next, 'utf8');
  console.log(`[insert] ${slug}: §${sec.num} ${sec.title} inserted before line ${insertAt + 1}`);
  inserted++;
}

console.log(`[insert] total: ${inserted} section${inserted === 1 ? '' : 's'} inserted`);