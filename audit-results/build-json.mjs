#!/usr/bin/env node
// build-json.mjs — produces on-page-seo-audit-v1.json in chunks.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';

const raw = readFileSync('c:/Users/User/Desktop/machineknives/audit-results/_analysis.jsonl', 'utf8').trim().split('\n');
const map = {};
for (let i = 0; i < raw.length; i += 2) {
  const key = raw[i].match(/<<<SECTION:([A-Z_]+)>>>/)[1];
  map[key] = JSON.parse(raw[i + 1]);
}
function uniqFiles(h) { return [...new Set((h || []).map((x) => x.file))]; }
function topFiles(h, n = 10) {
  const m = new Map();
  for (const x of (h || [])) m.set(x.file, (m.get(x.file) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

const meta = {
  audit_meta: {
    version: '1.0',
    round: 1,
    scope: 'on-page-seo',
    audited_at: '2026-09-27',
    pages_total_scanned: 50,
    blog_sample_size: 10,
    findings_total: 13,
    method: 'static-code-analysis',
    method_notes: 'No npm run build executed. No production URL fetched. Search Console data not available.',
    data_sources: ['src/data/post/*.md (110 files)', 'src/pages/**/*.astro (24 files)', 'src/components/**/*.astro', 'src/lib/schema.ts', 'src/navigation.ts', 'src/config.yaml', 'src/content.config.ts'],
  },
};
writeFileSync('c:/Users/User/Desktop/machineknives/audit-results/on-page-seo-audit-v1.json', JSON.stringify(meta, null, 2).replace(/}$/, ',\n  "findings":'), 'utf8');
console.log('wrote header');