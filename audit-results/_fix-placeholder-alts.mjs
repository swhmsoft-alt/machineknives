#!/usr/bin/env node
/**
 * _fix-placeholder-alts.mjs — one-shot post-processor for audit F-005.
 * Strips the literal "(placeholder)" substring from alt= attributes in
 * .astro files. Also rewrites the now-obsolete "KAIPU" brand mentions in
 * alt text to "Industrial Knives" (per Q1 brand decision).
 *
 * Regex preserves the rest of the alt string verbatim; only the trailing
 * " (placeholder)" (with optional surrounding whitespace) is removed.
 *
 * Idempotent: re-running after the fix is a no-op.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = 'c:/Users/User/Desktop/machineknives';
const SCAN_DIRS = ['src/pages'];
const FILE_EXT = new Set(['.astro']);

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (FILE_EXT.has('.' + e.name.split('.').pop())) out.push(p);
  }
  return out;
}

const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));
let totalAltFixed = 0;
const fileLog = [];

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  let next = text;
  let count = 0;

  // Strip the " (placeholder)" suffix inside alt="..." or alt='...'.
  // Captures:
  //   group 1: alt opening quote (' or ")
  //   group 2: the alt text body (no leading whitespace, no closing quote)
  //   group 3: closing quote
  next = next.replace(/alt=(["'])(.*?)\s*\(placeholder\)\s*(["'])/g, (_m, q1, body, q2) => {
    count++;
    return `alt=${q1}${body.trim()}${q2}`;
  });

  // Rewrite obsolete "KAIPU" brand mention in alt text to "Industrial Knives".
  // Apply only when KAIPU appears INSIDE an alt attribute value to avoid
  // touching other references (image filenames, links, etc.).
  next = next.replace(/alt=(["'])([^"']*?)KAIPU([^"']*?)\1/g, (_m, q, pre, post) => {
    return `alt=${q}${pre}Industrial Knives${post}${q}`;
  });

  if (next !== text) {
    writeFileSync(f, next, 'utf8');
    fileLog.push(`  ${count} alts  ${relative(ROOT, f).replace(/\\/g, '/')}`);
    totalAltFixed += count;
  }
}

console.log(`placeholder alt fix: ${totalAltFixed} alts across ${fileLog.length} files`);
console.log(fileLog.join('\n'));