#!/usr/bin/env node
// Part 4: sampled_blog roster
import { appendFileSync } from 'node:fs';

const sampledBlog = [
  { slot: 'article/case-studies', file: 'case-study-granulator-rotor-automotive.md', type: 'article', category: 'case-studies', sampling_reason: 'largest article in case-studies cluster (wc=1870)', round: 1 },
  { slot: 'article/selection-guide', file: 'selection-guide-shear-blade-plate-steel.md', type: 'article', category: 'selection-guide', sampling_reason: 'largest article in selection-guide cluster (wc=1675)', round: 1 },
  { slot: 'article/maintenance', file: 'maintenance-slitting-blade-life.md', type: 'article', category: 'maintenance', sampling_reason: 'largest article in maintenance cluster (wc=1797)', round: 1 },
  { slot: 'article/troubleshooting', file: 'troubleshooting-premature-wear.md', type: 'article', category: 'troubleshooting', sampling_reason: 'largest article in troubleshooting cluster (wc=1907, also longest overall)', round: 1, known_issues: ['canonical uses legacy domain', 'description_len 288 overlong'] },
  { slot: 'glossary/material', file: 'materials-encyclopedia-440c.md', type: 'glossary', category: 'materials-encyclopedia', entityType: 'material', sampling_reason: 'representative material entityType (wc=212, thin)', round: 1 },
  { slot: 'glossary/wear-mode', file: 'glossary-chipping.md', type: 'glossary', category: 'glossary', entityType: 'term', sampling_reason: 'representative wear-mode term (wc=358)', round: 1 },
  { slot: 'glossary/coating', file: 'glossary-pvd-coating.md', type: 'glossary', category: 'glossary', entityType: 'term', sampling_reason: 'representative coating term (wc=172, also flagged for undefined-title bug)', round: 1, known_issues: ['undefined title bug', 'thin content wc=172'] },
  { slot: 'comparison/material-grade', file: 'material-grade-converter.md', type: 'comparison', category: 'material-grade-converter', sampling_reason: 'pillar comparison content (wc=2717)', round: 1 },
  { slot: 'comparison/coating', file: 'coatings-comparison.md', type: 'comparison', category: 'coatings-comparison', sampling_reason: 'coatings comparison (paired with material-grade-converter)', round: 1 },
  { slot: 'flagship-article', file: 'kaipu-5-factor-blade-selection-framework.md', type: 'article', category: null, sampling_reason: 'flagship internal-link target — most-cited across quality, solutions, industries/index pages', round: 1, sampling_status: 'metadata_only_in_round1_round2_for_deep_audit' },
];

appendFileSync('c:/Users/User/Desktop/machineknives/audit-results/on-page-seo-audit-v1.json', JSON.stringify(sampledBlog, null, 2).replace(/]$/, '],\n  "roadmap":'), 'utf8');
console.log('wrote sampled_blog (' + sampledBlog.length + ')');