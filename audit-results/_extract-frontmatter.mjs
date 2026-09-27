#!/usr/bin/env node
/**
 * _extract-frontmatter.mjs
 * Read-only helper for the on-page SEO audit. Scans every blog post under
 * src/data/post/, extracts the YAML frontmatter fields needed for sampling
 * (type, category, publishDate, updateDate, author, word count, title,
 * description/excerpt length, image presence, tag count) and emits one
 * JSON line per file to stdout. Intended to be piped into a Node-side
 * aggregation step; nothing here writes to disk.
 */
import { readFileSync } from 'node:fs';
import { glob } from 'node:fs';

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const POST_DIR = 'c:/Users/User/Desktop/machineknives/src/data/post';

function parseFrontmatter(raw) {
  // Tiny YAML-frontmatter parser sufficient for the well-formed post files
  // we maintain (no nested anchors, no multi-line scalars beyond `|-`).
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!m) return { fm: {}, body: raw };
  const fmText = m[1];
  const body = m[2];
  const fm = {};
  let key = null;
  let arrBuf = null;
  for (const line of fmText.split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (line.startsWith('  - ')) {
      if (arrBuf) arrBuf.push(line.slice(4).trim().replace(/^["']|["']$/g, ''));
      continue;
    }
    const kv = /^([\w-]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    key = kv[1];
    let val = kv[2].trim();
    if (val === '') {
      arrBuf = [];
      fm[key] = arrBuf;
      continue;
    }
    arrBuf = null;
    val = val.replace(/^["']|["']$/g, '');
    if (/^\d{4}-\d{2}-\d{2}/.test(val)) val = new Date(val).toISOString().slice(0, 10);
    else if (val === 'true') val = true;
    else if (val === 'false') val = false;
    fm[key] = val;
  }
  return { fm, body };
}

const files = readdirSync(POST_DIR).filter((f) => /\.(md|mdx)$/.test(f));
const out = [];
for (const f of files) {
  const full = join(POST_DIR, f);
  const raw = readFileSync(full, 'utf8');
  const { fm, body } = parseFrontmatter(raw);
  const wordCount = body.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length;
  out.push({
    file: f,
    title: fm.title ?? null,
    type: fm.type ?? 'article',
    category: fm.category ?? null,
    publishDate: fm.publishDate ?? null,
    updateDate: fm.updateDate ?? null,
    author: fm.author ?? null,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    excerpt_len: fm.excerpt ? String(fm.excerpt).length : 0,
    excerpt_present: Boolean(fm.excerpt),
    description_present: Boolean(fm.metadata?.description || fm.excerpt),
    image_present: Boolean(fm.image),
    wordCount,
  });
}
process.stdout.write(JSON.stringify(out, null, 2));