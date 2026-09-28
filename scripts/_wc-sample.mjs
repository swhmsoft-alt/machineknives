#!/usr/bin/env node
/**
 * _wc-sample.mjs — print word count for 6 representative files
 * touched by the thin-content expansion. Compares before/after by
 * sampling a fixed set.
 */
import { readFileSync } from 'node:fs';
const SAMPLES = ['a2.md', 'h13.md', '440a.md', '17-4ph.md', 'm42.md', 'yg6.md', 'd3.md', 'd7.md', 'o1.md', 't15.md'];
for (const f of SAMPLES) {
  const txt = readFileSync('src/data/post/' + f, 'utf8');
  const wc = txt.split(/[ \t\n]+/).filter(Boolean).length;
  console.log(f.padEnd(10) + ' wc=' + wc);
}