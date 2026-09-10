#!/usr/bin/env node
/**
 * scripts/audit-trinity.mjs
 *
 * Trinity audit: Buyer Decision Chain × Google EEAT × AI Citation.
 *
 * Page-type-aware (service / material / blog / capability / industry / part).
 * Scores each dimension 0-100 and emits actionable gaps.
 *
 * Usage: node scripts/audit-trinity.mjs <slug>
 *        node scripts/audit-trinity.mjs --all      # scan src/pages for *.astro
 */

import fs from 'fs';
import path from 'path';

const slug = process.argv[2];
const scanAll = process.argv[2] === '--all';

const results = [];

if (scanAll) {
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    if (d.name.endsWith('.astro')) return [p.replace(/^src\/pages\//, '').replace(/\.astro$/, '').replace(/\/index$/, '')];
    return [];
  });
  for (const s of walk('src/pages')) {
    if (s.startsWith('[') || s.startsWith('_') || s.includes('/_') || s === 'index' || s.endsWith('thank-you') || s.endsWith('404')) continue;
    if (['titanium-cnc-machining-services/3-5-axis-cnc-machining'].includes(s)) results.push(s);
  }
  if (slug && !slug.startsWith('--')) results.push(slug);
} else {
  if (!slug) { console.error('Usage: node scripts/audit-trinity.mjs <slug|--all>'); process.exit(1); }
  results.push(slug);
}

// ─── audit one page ──────────────────────────────────────────────
function auditOne(slug) {
  const candidates = [
    `src/pages/${slug}.astro`,
    `src/pages/${slug}/index.astro`,
  ];
  let pageFile = null;
  for (const c of candidates) if (fs.existsSync(c)) { pageFile = c; break; }
  if (!pageFile) return null;
  const content = fs.readFileSync(pageFile, 'utf8');

  // also read imported service components so FAQPage schema in FaqSection.astro counts
  const pageDir = path.dirname(pageFile).replace(/\\/g, '/');
  const importedComponents = [...content.matchAll(/import\s+([A-Z][A-Za-z]+)\s+from\s+['"]([^'"]+)['"]/g)].map(m => {
    const comp = m[1];
    const rawPath = m[2];
    let resolved;
    if (rawPath.startsWith('.')) {
      resolved = path.resolve(pageDir, rawPath).replace(/\\/g, '/');
    } else {
      resolved = 'src/' + rawPath;
    }
    const fullPath = resolved.endsWith('.astro') ? resolved : resolved + '.astro';
    if (fs.existsSync(fullPath)) {
      try { return { comp, content: fs.readFileSync(fullPath, 'utf8') }; } catch { return null; }
    }
    return null;
  }).filter(Boolean);
  const allContent = content + '\n' + importedComponents.map(c => c.content).join('\n');

  // ─── page type detection ─────────────────────────────────────────
  let pageType = 'unknown';
  if (content.includes('AudienceHub industry=')) pageType = 'service';
  else if (/IndustryHub|industries-served/.test(content)) pageType = 'industry';
  else if (/blog|post|article|insight|guide/i.test(slug) && !slug.includes('blog')) pageType = 'blog';
  else if (/material|alloy|grade/i.test(slug)) pageType = 'material';
  else if (/equipment|cnc-mill|turn-mill|wire-edm|surface-treatment|additive|forming|fabrication/i.test(slug)) pageType = 'capability';
  else if (/titanium-(machining|cnc|cnc-machining|grinding)/i.test(slug) || slug === 'services') pageType = 'service';
  else if (slug.startsWith('part')) pageType = 'part';

  // ═════════════════════════════════════════════════════════════════
  // 1. BUYER DECISION CHAIN (12 stages)
  // ═════════════════════════════════════════════════════════════════
  const buyerChecks = {
    awareness:        /\bneed to\b|\bi need\b|require[ds]?|looking for|titanium parts?/i.test(content.slice(0, 5000)),
    painIdentification: /pain|challeng|difficult|hard|issue|problem/i.test(content),
    solutionExplore:  /solution|approach|method|capability|axis|process/i.test(content),
    capabilityValid:  /part|component|Blisk|implant|bracket|assembly|we (machin|provid|deliver)/i.test(content),
    costAssessment:   /cost|price|pricing|\$\d|\d+\s*×\s*baseline|MOQ|minimum order/i.test(content),
    timeDecision:     /lead time|weeks?|delivery|turnaround|rush|expedit/i.test(content),
    fileProcess:      /\bSTEP\b|\bIGES\b|\bDWG\b|\bDXF\b|\bSolidWorks\b|\bCATIA\b|\bNX\b|CAD|file format|upload drawing|send drawing/i.test(content),
    riskMitigation:   /Cpk|capability|yield|defect rate|scrap/i.test(content),
    decisionRfq:      /RFQ|quote|submit|request|call to action|CTA/i.test(content),
    comparison:       /\bvs\.\b|\bvs\s+(Typical|Job|CNC|Shop|Overseas)|compared|alternative|competitor|different from/i.test(content),
    capacityLock:     /capacity|monthly|backup machine|redundancy|production volume/i.test(content),
    faqResolution:    /FAQ|frequently asked|question/i.test(content),
  };
  const buyerScore = Math.round(Object.values(buyerChecks).filter(Boolean).length / Object.keys(buyerChecks).length * 100);

  // ═════════════════════════════════════════════════════════════════
  // 2. GOOGLE EEAT + INFORMATION GAIN
  // ═════════════════════════════════════════════════════════════════
  const eeatChecks = {
    experienceSignal: /case stud|client|customer|yield|reduction|delivery|prototype|production run/i.test(content),
    yearsInBusiness:   /\bsince\s*20\d{2}|founded in 20\d{2}/i.test(allContent),
    specificMetrics:  (allContent.match(/\d+(\.\d+)?\s*(mm|µm|Ra|W\/m·?K|°C|bar|kg|ksi|MPa|years?|months?|weeks?|parts?|units?|Hz|rpm|%|in)/gi) || []).length,
    specificExamples: /Blisk|impeller|turbine|hip|knee|prosthet|dental|bracket/i.test(allContent),
    standardCitation: /AMS\s?\d{4}|AS9100|ISO\s?\d+|ASTM\s?[A-Z]\d+|NADCAP|EN\s?\d{4}/.test(allContent),
    certification:    /AS9100D|ISO\s?13485|ISO\s?9001|NADCAP|certified/i.test(allContent),
    externalLinks:    (content.match(/href="https?:\/\/(?!bozemetal\.com|.*\.bozemetal\.com)/g) || []).length,
    teamAuthority:     /engineering team|senior engineer|Ph\.D|Mastercam|hyperMILL/i.test(allContent),
    quantified:       /\d+\s*mm|\d+\s*µm|\d+\s*Ra|\d+%/.test(allContent),
    sourceDisclosure: /HEXAGON|MTC|EN 10204|AS9102|FAIR|CMM/i.test(allContent),
    freshnessDate:    /\b20\d{2}\b|datetime|dateModified|datePublished|Last updated/i.test(content),
    uniqueDataPoint:  /72%|94%|98%|2,500|10,000|HEXAGON Global S|±0\.0019|Cpk\s*[≥>=]\s*1\.\d+/i.test(allContent),
    proprietaryFrame: /12-stage|12-point|5-dimension|five-dimension|Cpk/i.test(content),
  };
  const eeatScore = Math.round(
    (Object.values(eeatChecks).filter((v, i) => {
      const k = Object.keys(eeatChecks)[i];
      if (k === 'specificMetrics') return v >= 5;
      if (k === 'specificExamples' || k === 'externalLinks') return v >= 1;
      if (k === 'uniqueDataPoint') return v >= 1;
      return v === true;
    }).length / Object.keys(eeatChecks).length) * 100
  );

  // ═════════════════════════════════════════════════════════════════
  // 3. GENERATIVE AI CITATION
  // ═════════════════════════════════════════════════════════════════
  const aiChecks = {
    schemaOrg:        /<script\s+type="application\/ld\+json"/.test(allContent),
    faqSchema:        /FAQPage/.test(allContent),
    breadcrumbSchema: /itemListElement|BreadcrumbList/.test(allContent),
    productSchema:    /"@type":\s*"(Product|Service)"|@type:\s*['"]Service['"]|@type:\s*['"]Product['"]/i.test(allContent),
    articleSchema:    /"@type":\s*"(Article|BlogPosting|NewsArticle)"/.test(allContent),
    howToSchema:      /HowTo/.test(allContent),
    faqHtmlPattern:   /<details>|"@type":\s*"Question"/i.test(allContent),
    realTableElement: /<table[^>]*>/.test(allContent),
    bestForPattern:   /Best for[:\s]|Not for[:\s]|Ideal for|Not suitable for/i.test(allContent),
    headingNumbered:   /Step\s+\d+:|^##\s+\d+\.|^###\s+\d+\./m.test(content),
    bulletOrStepList: /<ol[^>]*>|<ul[^>]*>/i.test(content),
    quotedSpec:       /"[^"]{20,200}"/.test(allContent),
  };
  const aiScore = Math.round(
    (Object.values(aiChecks).filter((v, i) => {
      const k = Object.keys(aiChecks)[i];
      if (k === 'realTableElement' || k === 'bulletOrStepList' || k === 'quotedSpec') return v === true;
      return v === true;
    }).length / Object.keys(aiChecks).length) * 100
  );

  const total = Math.round((buyerScore + eeatScore + aiScore) / 3);

  return { slug, pageFile, pageType, buyerScore, eeatScore, aiScore, total,
    buyer: buyerChecks, eeat: eeatChecks, ai: aiChecks };
}

// ─── run ──────────────────────────────────────────────────────────
const audits = results.map(auditOne).filter(Boolean);

console.log(`\n${'='.repeat(80)}`);
console.log(`TRINITY AUDIT — ${audits.length} page(s)`);
console.log('='.repeat(80));
for (const a of audits) {
  console.log(`\n${a.slug} (${a.pageType})`);
  console.log(`  Buyer Decision Chain : ${a.buyerScore}/100`);
  console.log(`  EEAT + Info Gain     : ${a.eeatScore}/100`);
  console.log(`  GenAI Citation       : ${a.aiScore}/100`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  TOTAL                 : ${a.total}/100`);
}

// ─── save full reports ─────────────────────────────────────────────
fs.mkdirSync('audit-results', { recursive: true });
for (const a of audits) {
  const reportPath = `audit-results/${a.slug}.md`;
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  const lines = [
    `# Trinity Audit: ${a.slug}`,
    ``, `**Type**: ${a.pageType}`,
    `**File**: ${a.pageFile}`,
    `**Score**: ${a.total}/100  (Buyer ${a.buyerScore} | EEAT ${a.eeatScore} | AI ${a.aiScore})`,
    ``,
    `## 1. Buyer Decision Chain (${a.buyerScore}/100)`,
    ``,
    '| Stage | Status |',
    '|---|---|',
    ...Object.entries(a.buyer).map(([k, v]) => `| ${k} | ${v ? '✅' : '❌'}`),
    ``,
    `## 2. Google EEAT + Information Gain (${a.eeatScore}/100)`,
    ``,
    '| Signal | Status |',
    '|---|---|',
    ...Object.entries(a.eeat).map(([k, v]) => {
      const isNum = typeof v === 'number';
      const status = isNum ? (k === 'specificMetrics' ? (v >= 5 ? `✅ ${v}` : `⚠️ ${v} < 5`) : `✅ ${v}`) : (v ? '✅' : '❌');
      return `| ${k} | ${status} |`;
    }),
    ``,
    `## 3. Generative AI Citation (${a.aiScore}/100)`,
    ``,
    '| Signal | Status |',
    '|---|---|',
    ...Object.entries(a.ai).map(([k, v]) => `| ${k} | ${v ? '✅' : '❌'}`),
    ``,
    `## P0 Fix List`,
    ``,
    ...Object.entries(a.buyer).flatMap(([k, v]) => (v ? [] : [`- Buyer: add stage "${k}"`])),
    ...Object.entries(a.eeat).flatMap(([k, v]) => (v ? [] : [`- EEAT/IG: add signal "${k}"`])),
    ...Object.entries(a.ai).flatMap(([k, v]) => (v ? [] : [`- AI: add signal "${k}"`])),
  ];
  fs.writeFileSync(reportPath, lines.join('\n') + '\n');
}

console.log(`\nFull reports saved to audit-results/\n`);