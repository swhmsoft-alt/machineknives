#!/usr/bin/env node
// Part 3: content_strategy + sampled_blog + roadmap + closing
import { readFileSync, appendFileSync, readdirSync } from 'node:fs';

const analysis = readFileSync('c:/Users/User/Desktop/machineknives/audit-results/_analysis.jsonl', 'utf8').trim().split('\n');
const map = {};
for (let i = 0; i < analysis.length; i += 2) {
  const key = analysis[i].match(/<<<SECTION:([A-Z_]+)>>>/)[1];
  map[key] = JSON.parse(analysis[i + 1]);
}

const strategicRoles = {
  'materials-encyclopedia': 'pillar', 'glossary': 'supporting',
  'selection-guide': 'conversion', 'case-studies': 'trust',
  'maintenance': 'retention', 'material-comparison': 'comparison',
  'troubleshooting': 'support', 'coatings-comparison': 'comparison',
  'Engineering': 'orphan-or-misclassified', 'material-grade-converter': 'tool',
};

const contentStrategy = {
  topic_clusters: Object.entries(map.POSTS.byCategory)
    .map(([slug, count]) => ({ slug, post_count: count, share_pct: +(count / 110 * 100).toFixed(1), strategic_role: strategicRoles[slug] || 'other' }))
    .sort((a, b) => b.post_count - a.post_count),
  word_count_distribution: map.POSTS.wcBuckets,
  description_length_distribution: map.POSTS.descBuckets,
  stale_post_count: map.POSTS.staleCount,
  missing_image_count: map.POSTS.missingImage,
  duplicate_titles_count: map.POSTS.duplicateTitles.length,
  duplicate_title_patterns: map.POSTS.duplicateTitles,
  eeat_signals: {
    author_strategy: 'single Organization-level author (KAIPU Engineering) — no individual author pages',
    source_citations: 'limited — only selection-guide posts cite ASTM/JIS/DIN standard numbers',
    case_studies_count: 6,
    case_studies_target: 20,
  },
  cannibalization_groups: [
    { pattern: 'materials-encyclopedia-*', count: 25, slug_set: ['17-4ph.md', '420.md', '440a.md', 'd2.md', 'h11.md', 'm1.md', 'o1.md', 't1.md', 'yg6.md', 'asp2060.md'] },
    { pattern: 'glossary-*', count: 45, slug_set: ['glossary-chipping.md', 'glossary-burr.md', 'glossary-hone.md', 'glossary-kerf.md'] },
    { pattern: 'selection-guide-*', count: 8, slug_set: ['selection-guide-paper-converting.md', 'selection-guide-doctor-blade-printing.md'] },
  ],
};

appendFileSync('c:/Users/User/Desktop/machineknives/audit-results/on-page-seo-audit-v1.json', JSON.stringify(contentStrategy, null, 2).replace(/}$/, '},\n  "sampled_blog":'), 'utf8');
console.log('wrote content_strategy');