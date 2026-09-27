#!/usr/bin/env node
/**
 * _migrate-hero-images.mjs — one-shot migration for audit F-008.
 *
 * For every src/pages/<recursive>.astro that defines:
 *   const <var>ImageHtml = '<img src="..." alt="..." ... />';
 *   ...
 *   <Hero ... image={<var>ImageHtml} ... />
 *
 * rewrites to:
 *   const <var>Image = { src: '...', alt: '...' };
 *   ...
 *   <Hero ... image={<var>Image} ... />
 *
 * The Hero widget already handles object-shaped image props by delegating to
 * the common Image wrapper (with widths, sizes, loading='eager', etc.).
 * String-form image={...ImageHtml} is left alone in case the page uses a
 * truly custom markup, but the audit-flagged pattern is replaced.
 *
 * Idempotent: re-running is a no-op.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = 'c:/Users/User/Desktop/machineknives';
const SCAN_DIR = 'src/pages';

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith('.astro')) out.push(p);
  }
  return out;
}

const files = walk(join(ROOT, SCAN_DIR));
let totalVarsFixed = 0;
const fileLog = [];

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  let next = text;
  let count = 0;

  // Match a JS-side `const NAMEImageHtml = '<img src="..." alt="..." ... />';`
  // and turn it into `const NAMEImage = { src: '...', alt: '...' };`.
  const declRe = /const\s+(\w+ImageHtml)\s*=\s*'<\s*img\s+([^>]*?)\s*\/?>';/g;
  next = next.replace(declRe, (_m, varName, attrs) => {
    const srcMatch = /\bsrc=(["'])(.*?)\1/.exec(attrs);
    const altMatch = /\balt=(["'])(.*?)\1/.exec(attrs);
    if (!srcMatch || !altMatch) return _m; // not parseable — leave alone
    const src = srcMatch[2];
    const alt = altMatch[2];
    count++;
    const newVar = varName.replace(/ImageHtml$/, 'Image');
    return `const ${newVar} = { src: ${JSON.stringify(src)}, alt: ${JSON.stringify(alt)} };`;
  });

  // Update references image={XxxImageHtml} -> image={XxxImage}.
  next = next.replace(/image=\{(\w+ImageHtml)\}/g, (_m, varName) => {
    const newVar = varName.replace(/ImageHtml$/, 'Image');
    return `image={${newVar}}`;
  });

  if (next !== text) {
    writeFileSync(f, next, 'utf8');
    fileLog.push(`  ${count} vars  ${relative(ROOT, f).replace(/\\/g, '/')}`);
    totalVarsFixed += count;
  }
}

console.log(`hero image migration: ${totalVarsFixed} vars across ${fileLog.length} files`);
console.log(fileLog.join('\n'));