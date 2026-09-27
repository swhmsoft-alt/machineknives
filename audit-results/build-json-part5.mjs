#!/usr/bin/env node
// Part 5: roadmap + open_questions + closing brace
import { appendFileSync } from 'node:fs';

const roadmap = {
  Q1: [
    { id: 'Q1-1', task: 'Decide canonical brand name (KAIPU vs Industrial Knives)', estimate: '0.5d', owner: 'business', blocking_for: ['Q1-2', 'Q1-5', 'Q1-6'] },
    { id: 'Q1-2', task: 'Full-repo brand string consolidation after decision', estimate: '0.5d', owner: 'engineering', depends_on: ['Q1-1'] },
    { id: 'Q1-3', task: 'Full-repo find/replace machine-knives.net → industrial-knives.net', estimate: '0.5d', owner: 'engineering' },
    { id: 'Q1-4', task: 'Fix Metadata.astro fallback defaults (line 99, 105) → false', estimate: '5min', owner: 'engineering' },
    { id: 'Q1-5', task: 'Clean up 24 (placeholder) alt strings across 14 files', estimate: '0.5d', owner: 'content+engineering', depends_on: ['Q1-1'] },
    { id: 'Q1-6', task: 'Encoding damage human review (batch 1: top 10 files)', estimate: '1-2d', owner: 'product/engineering+content', depends_on: ['Q1-1'] },
  ],
  Q2: [
    { id: 'Q2-1', task: 'Fix 40 glossary "undefined" title bug (regenerate or post-process)', estimate: '0.5d', owner: 'engineering' },
    { id: 'Q2-2', task: 'Round 2 deep audit + optimization on 10 sampled posts', estimate: '1w', owner: 'seo+content' },
    { id: 'Q2-3', task: 'Establish 12-month content refresh calendar', estimate: '0.5d', owner: 'content_ops' },
    { id: 'Q2-4', task: 'Migrate hero/case-study raw <img> to <Image /> component', estimate: '1w', owner: 'engineering' },
    { id: 'Q2-5', task: 'Build frontmatter CI lint (description length, image required)', estimate: '1d', owner: 'engineering' },
    { id: 'Q2-6', task: 'Backfill OG image for all 110 blog posts', estimate: '2w', owner: 'content+design' },
  ],
  Q3: [
    { id: 'Q3-1', task: 'Author 6 pillar articles (3000+ words) in selection-guide cluster', estimate: '4w', owner: 'seo+sme' },
    { id: 'Q3-2', task: 'Expand case-studies to 20+ posts (with testimonials, quantified outcomes)', estimate: 'continuous', owner: 'sales+content' },
    { id: 'Q3-3', task: 'Build /authors/[slug] route + 5 named engineer profiles', estimate: '1w', owner: 'engineering+content' },
    { id: 'Q3-4', task: 'Close content gaps (6 products × 6 industries × 5 long-tail = 60 keyword matrix)', estimate: 'continuous', owner: 'content' },
    { id: 'Q3-5', task: 'Cannibalization audit on dist build output', estimate: '1w', owner: 'seo' },
  ],
  Q4: [
    { id: 'Q4-1', task: 'Round 2 deep audit (100% blogs + all static pages)', estimate: '2w', owner: 'seo' },
    { id: 'Q4-2', task: 'Content ROI tracking (GSC per-URL dashboard)', estimate: 'continuous', owner: 'seo' },
    { id: 'Q4-3', task: 'Internal link health monitoring (broken, orphan, depth)', estimate: 'continuous', owner: 'seo' },
    { id: 'Q4-4', task: 'AI search optimization (LLMs.txt expansion, structured data completion)', estimate: 'continuous', owner: 'seo' },
  ],
};

const openQuestions = [
  'Canonical brand name: KAIPU Industrial Blades vs Industrial Knives?',
  'Domain strategy: keep industrial-knives.net or revert to machine-knives.net?',
  'OG image strategy: per-post images vs auto-generated from post title?',
  'Author identity: named engineers with LinkedIn vs anonymous "KAIPU Engineering"?',
  'Content production budget: 4-6 deep posts per month sustainable?',
];

const tail = {
  roadmap,
  open_questions_for_business: openQuestions,
  out_of_scope: [
    'Technical SEO (robots.txt, sitemap, crawlability, CWV, mobile)',
    'Indexability audit (requires Search Console)',
    'Content quality E-E-A-T assessment beyond frontmatter',
    'Backlink audit',
    'Keyword research (search volume, KD, intent classification)',
    'Production schema rendering verification',
    'Real image dimensions / file size analysis',
    'International SEO / hreflang (site is single-locale English)',
  ],
};

// Final close: write the tail object, ending with } for the outer report object.
// The previous part ended with ",\n  \"roadmap\":", so we write the roadmap object
// directly (not wrapped), then ", ..." for siblings, and close with "}".
appendFileSync('c:/Users/User/Desktop/machineknives/audit-results/on-page-seo-audit-v1.json', JSON.stringify(roadmap, null, 2).replace(/}$/, '},\n  "open_questions_for_business": ' + JSON.stringify(openQuestions) + ',\n  "out_of_scope": ' + JSON.stringify(tail.out_of_scope) + '\n}'), 'utf8');
console.log('wrote roadmap + closing');