#!/usr/bin/env node
/** Compact summary of all sections for the audit report. */
import { readFileSync } from 'node:fs';
const raw = readFileSync('c:/Users/User/Desktop/machineknives/audit-results/_analysis.jsonl', 'utf8').trim().split('\n');
const map = {};
for (let i = 0; i < raw.length; i += 2) {
  const key = raw[i].match(/<<<SECTION:([A-Z_]+)>>>/)[1];
  map[key] = JSON.parse(raw[i + 1]);
}

// unique files per section
function uniqFiles(hits) { return [...new Set(hits.map((h) => h.file))].length; }
function topFiles(hits, n = 10) {
  const m = new Map();
  for (const h of hits) m.set(h.file, (m.get(h.file) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

console.log('=== BRAND (KAIPU) ===');
console.log('total occurrences:', map.BRAND.total);
console.log('unique files:', uniqFiles(map.BRAND.hits));
console.log('top files:', topFiles(map.BRAND.hits, 15));

console.log('\n=== DOMAIN_LEGACY (machine-knives.net) ===');
console.log('total occurrences:', map.DOMAIN_LEGACY.total);
console.log('unique files:', uniqFiles(map.DOMAIN_LEGACY.hits));
console.log('top files:', topFiles(map.DOMAIN_LEGACY.hits, 15));

console.log('\n=== DOMAIN_NEW (industrial-knives.net) ===');
console.log('total occurrences:', map.DOMAIN_NEW.total);
console.log('unique files:', uniqFiles(map.DOMAIN_NEW.hits));

console.log('\n=== ALT_PLACEHOLDER ===');
console.log('total:', map.ALT_PLACEHOLDER.total);
console.log('unique files:', uniqFiles(map.ALT_PLACEHOLDER.hits));
console.log('samples:', JSON.stringify(map.ALT_PLACEHOLDER.hits.slice(0, 10), null, 2));

console.log('\n=== RAW_IMG (<img src= in .astro) ===');
console.log('total:', map.RAW_IMG.total);
console.log('unique files:', uniqFiles(map.RAW_IMG.hits));
console.log('top files:', topFiles(map.RAW_IMG.hits, 15));

console.log('\n=== EAGER_LOAD ===');
console.log('total:', map.EAGER_LOAD.total);
console.log('unique files:', uniqFiles(map.EAGER_LOAD.hits));
console.log('top files:', topFiles(map.EAGER_LOAD.hits, 10));

console.log('\n=== ENCODING (em-dash near digits) ===');
console.log('total:', map.ENCODING.total);
console.log('unique files:', uniqFiles(map.ENCODING.hits));
console.log('top files:', topFiles(map.ENCODING.hits, 10));
console.log('samples:', JSON.stringify(map.ENCODING.hits.slice(0, 15), null, 2));

console.log('\n=== POSTS ===');
console.log('total posts:', map.POSTS.total);
console.log('byType:', JSON.stringify(map.POSTS.byType));
console.log('byCategory:', JSON.stringify(map.POSTS.byCategory));
console.log('descBuckets:', JSON.stringify(map.POSTS.descBuckets));
console.log('wcBuckets:', JSON.stringify(map.POSTS.wcBuckets));
console.log('duplicateTitles count:', map.POSTS.duplicateTitles.length);
console.log('duplicateTitles samples:', JSON.stringify(map.POSTS.duplicateTitles.slice(0, 10), null, 2));
console.log('staleCount (>365d, no updateDate):', map.POSTS.staleCount);
console.log('missingImage count:', map.POSTS.missingImage);
console.log('missingImage samples:', JSON.stringify(map.POSTS.missingImageSamples.slice(0, 5), null, 2));

console.log('\n=== LINK_GRAPH ===');
console.log('totalNodes:', map.LINK_GRAPH.totalNodes);
console.log('lowest inbound (potential orphans):', JSON.stringify(map.LINK_GRAPH.inboundSamples.slice(0, 10), null, 2));
console.log('highest outbound:', JSON.stringify(map.LINK_GRAPH.outboundTop, null, 2));