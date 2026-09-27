#!/usr/bin/env node
// Part 2: write findings array, then close it.
import { appendFileSync } from 'node:fs';

const findings = [
  { id: 'F-001', category: 'brand-consistency', severity: 'high', title: 'Brand name conflict: KAIPU vs Industrial Knives', summary: 'config.yaml site.name = "Industrial Knives" but KAIPU appears 401 times across 143 files.', blocking: true, requires_decision: true },
  { id: 'F-002', category: 'domain-consistency', severity: 'high', title: 'Domain inconsistency: machine-knives.net vs industrial-knives.net', summary: 'machine-knives.net (legacy) appears 132 times across 128 files; industrial-knives.net (configured) appears only 2 times.', blocking: true, requires_decision: false },
  { id: 'F-003', category: 'metadata-component', severity: 'high', title: 'Unsafe noindex/nofollow default in Metadata.astro', summary: 'noindex/nofollow fallbacks default to true. Site relies on config.yaml metadata.robots.index:true.', location: 'src/components/common/Metadata.astro lines 94-105', blocking: true, requires_decision: false },
  { id: 'F-004', category: 'title-template', severity: 'medium', title: 'Title template doubles up brand suffix', summary: 'Pages with title already containing brand suffix produce doubled titles.', blocking: false, requires_decision: false },
  { id: 'F-005', category: 'image-optimization', severity: 'medium', title: 'Placeholder alt text in production HTML', summary: '24 alt strings contain "(placeholder)" across 14 files.', blocking: false, requires_decision: false },
  { id: 'F-006', category: 'content-quality', severity: 'high', title: 'Glossary "undefined — Industry Glossary Entry" title', summary: '40 of 77 glossary entries share the malformed title from generation script bug.', metrics: { affected_files: 40, type: 'glossary' }, blocking: false, requires_decision: false },
  { id: 'F-007', category: 'encoding-damage', severity: 'high', title: 'GBK-to-UTF8 encoding damage: em-dash + digit-gap', summary: '126 occurrences across 16 files. Pattern suggests en-dash ranges with eaten digits.', blocking: false, requires_decision: true, requires_human_input: true },
  { id: 'F-008', category: 'image-optimization', severity: 'medium', title: 'Raw <img> bypasses Astro <Image />', summary: '29 raw <img src=...> across 15 .astro files. Skips asset pipeline.', blocking: false, requires_decision: false },
  { id: 'F-009', category: 'performance', severity: 'low', title: 'loading="eager" beyond first-fold', summary: '20 occurrences across 19 files. Most legitimate.', blocking: false, requires_decision: false },
  { id: 'F-010', category: 'accessibility', severity: 'medium', title: '404 page has no <h1>', summary: 'src/pages/404.astro uses <h2> for "404".', location: 'src/pages/404.astro lines 12-15', blocking: false, requires_decision: false },
  { id: 'F-011', category: 'content-depth', severity: 'high', title: '65% of blog posts are thin content (<300 words)', summary: '72/110 <300 words; 0 >3000 words. Mostly materials-encyclopedia + glossary.', blocking: false, requires_decision: false },
  { id: 'F-012', category: 'og-image', severity: 'high', title: '100% of blog posts lack image: frontmatter field', summary: 'All 110 blog posts have no image: field. OG cards fall back to global default.', blocking: false, requires_decision: true },
  { id: 'F-013', category: 'description-length', severity: 'medium', title: 'Meta description length distribution suboptimal', summary: 'Only 11.8% in 80-160 char range. 24.5% too short, 59.1% too long.', blocking: false, requires_decision: false },
];

appendFileSync('c:/Users/User/Desktop/machineknives/audit-results/on-page-seo-audit-v1.json', JSON.stringify(findings, null, 2).replace(/]$/, '],\n  "content_strategy":'), 'utf8');
console.log('wrote findings (' + findings.length + ')');