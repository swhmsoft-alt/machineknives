#!/usr/bin/env node
/** Stratified sampling of 10 blog posts for round-1 audit. */
import { readFileSync } from 'node:fs';
const raw = readFileSync('c:/Users/User/Desktop/machineknives/audit-results/_analysis.jsonl', 'utf8').trim().split('\n');
const map = {};
for (let i = 0; i < raw.length; i += 2) {
  const key = raw[i].match(/<<<SECTION:([A-Z_]+)>>>/)[1];
  map[key] = JSON.parse(raw[i + 1]);
}
const posts = map.POSTS.posts;

// Stratified sampling:
//  - 4 article: cover case-studies, selection-guide, maintenance, troubleshooting
//  - 3 glossary: cover different entityType/material sub-types
//  - 2 comparison: both
//  - 1 long-form for depth check
function pickOne(filter, label) {
  const cands = posts.filter(filter);
  // Prefer published in different months for variety, and prefer larger wordCount
  cands.sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0));
  const pick = cands[0];
  console.log(`[${label}] ${pick.file}`);
  console.log(`  title: ${pick.title}`);
  console.log(`  type=${pick.type} category=${pick.category} author=${pick.author} wc=${pick.wordCount} descLen=${pick.description_len}`);
  console.log(`  publishDate=${pick.publishDate} image_present=${pick.image_present}`);
  return pick;
}

console.log('--- 4 articles ---');
pickOne((p) => p.type === 'article' && p.category === 'case-studies', 'article/case-studies');
pickOne((p) => p.type === 'article' && p.category === 'selection-guide', 'article/selection-guide');
pickOne((p) => p.type === 'article' && p.category === 'maintenance', 'article/maintenance');
pickOne((p) => p.type === 'article' && p.category === 'troubleshooting', 'article/troubleshooting');

console.log('\n--- 3 glossary ---');
pickOne((p) => p.type === 'glossary' && p.entityType === 'material', 'glossary/material');
pickOne((p) => p.type === 'glossary' && p.tags.includes('coating'), 'glossary/coating');
pickOne((p) => p.type === 'glossary' && !p.entityType && p.tags.includes('geometry'), 'glossary/geometry');

console.log('\n--- 2 comparison ---');
pickOne((p) => p.type === 'comparison' && p.comparisonType === 'coating', 'comparison/coating');
pickOne((p) => p.type === 'comparison' && p.comparisonType === 'material-grade', 'comparison/material-grade');

console.log('\n--- 1 extra: longest article ---');
const longArticle = posts.filter((p) => p.type === 'article').sort((a, b) => b.wordCount - a.wordCount)[0];
console.log(`[longest-article] ${longArticle.file}`);
console.log(`  title: ${longArticle.title}, wc=${longArticle.wordCount}, descLen=${longArticle.description_len}`);

// Duplicate title investigation
console.log('\n--- Duplicate title investigation ---');
const titleMap = new Map();
for (const p of posts) if (p.title) titleMap.set(p.title, (titleMap.get(p.title) || 0) + 1);
const dupTitles = [...titleMap.entries()].filter(([, n]) => n > 1).map(([t, n]) => ({ title: t, count: n }));
for (const d of dupTitles) {
  const affected = posts.filter((p) => p.title === d.title).slice(0, 10);
  console.log(`\n"${d.title}" appears ${d.count} times. Sample files:`);
  for (const p of affected) console.log(`  - ${p.file} (category=${p.category}, type=${p.type})`);
}

// Stale/missing image investigation
console.log('\n--- Image field investigation ---');
const noImg = posts.filter((p) => !p.image_present);
console.log(`Total posts without image field in frontmatter: ${noImg.length} / ${posts.length}`);
console.log('Sample (first 10):');
for (const p of noImg.slice(0, 10)) console.log(`  - ${p.file} (${p.type}, ${p.category})`);

// Tag count distribution
console.log('\n--- Tag count distribution ---');
const tagCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, '5+': 0 };
for (const p of posts) {
  const n = p.tags.length;
  if (n === 0) tagCounts[0]++;
  else if (n === 1) tagCounts[1]++;
  else if (n === 2) tagCounts[2]++;
  else if (n === 3) tagCounts[3]++;
  else if (n === 4) tagCounts[4]++;
  else tagCounts['5+']++;
}
console.log(JSON.stringify(tagCounts));