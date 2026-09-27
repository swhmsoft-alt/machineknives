#!/usr/bin/env node
/** Sample remaining 6 posts with looser filters. */
import { readFileSync } from 'node:fs';
const raw = readFileSync('c:/Users/User/Desktop/machineknives/audit-results/_analysis.jsonl', 'utf8').trim().split('\n');
const map = {};
for (let i = 0; i < raw.length; i += 2) {
  const key = raw[i].match(/<<<SECTION:([A-Z_]+)>>>/)[1];
  map[key] = JSON.parse(raw[i + 1]);
}
const posts = map.POSTS.posts;

function pickOne(filter, label) {
  const cands = posts.filter(filter);
  cands.sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0));
  const pick = cands[0];
  if (!pick) {
    console.log(`[${label}] NO MATCH (filter too strict)`);
    return null;
  }
  console.log(`[${label}] ${pick.file}`);
  console.log(`  title: ${pick.title}`);
  console.log(`  type=${pick.type} category=${pick.category} entityType=${pick.entityType} author=${pick.author} wc=${pick.wordCount} descLen=${pick.description_len}`);
  console.log(`  tags=${JSON.stringify(pick.tags)}`);
  return pick;
}

// 3 glossary: cover material vs geometry vs wear-mode topics
console.log('--- glossary/material (large) ---');
pickOne((p) => p.type === 'glossary' && p.category === 'materials-encyclopedia' && p.wordCount > 200, 'glossary/material');

console.log('\n--- glossary/wear-mode ---');
// wear-mode tags include 'wear', 'chipping', 'fracture' etc.
pickOne((p) => p.type === 'glossary' && p.tags.some((t) => /chipping|wear|fracture|fatigue|burr/.test(t)), 'glossary/wear-mode');

console.log('\n--- glossary/coating ---');
pickOne((p) => p.type === 'glossary' && (p.entityType === 'coating' || p.tags.some((t) => /TiN|TiCN|CrN|DLC|PVD|Ta-C/.test(t))), 'glossary/coating');

console.log('\n--- 2 comparisons ---');
pickOne((p) => p.type === 'comparison', 'comparison/all-1');
pickOne((p) => p.type === 'comparison' && p.file !== 'coatings-comparison.md', 'comparison/all-2');

console.log('\n--- 1 long-form article for depth ---');
const longArticle = posts.filter((p) => p.type === 'article').sort((a, b) => b.wordCount - a.wordCount)[0];
console.log(`[longest-article] ${longArticle.file}`);
console.log(`  title: ${longArticle.title}, wc=${longArticle.wordCount}, descLen=${longArticle.description_len}`);

// also: pick the "undefined title" duplicate to inspect template bug
console.log('\n--- duplicate-title samples (3) ---');
const dups = posts.filter((p) => p.title && p.title.startsWith('undefined')).slice(0, 3);
for (const p of dups) {
  console.log(`[undef-title] ${p.file}`);
  console.log(`  type=${p.type} category=${p.category} wc=${p.wordCount}`);
}

// also: shortest articles (for thin content analysis)
console.log('\n--- thinnest articles (wc<400) ---');
const thin = posts.filter((p) => p.type === 'article' && p.wordCount < 400).slice(0, 5);
for (const p of thin) {
  console.log(`[thin-article] ${p.file} wc=${p.wordCount} descLen=${p.description_len}`);
}