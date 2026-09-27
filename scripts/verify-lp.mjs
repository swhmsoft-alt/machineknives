import fs from 'node:fs';
import { readdirSync } from 'node:fs';

const html = fs.readFileSync('dist/lp/quote/index.html', 'utf8');

// Astro extracts scoped CSS into a sibling stylesheet. Pull its body in
// so assertions about compiled media queries can see the rule.
const cssFiles = readdirSync('dist/_astro').filter((f) => f.endsWith('.css'));
const css = cssFiles.map((f) => fs.readFileSync(`dist/_astro/${f}`, 'utf8')).join('\n');

const checks = {
  // ── SEO / routing ────────────────────────────────────────────
  noindexMeta: /<meta content="noindex, nofollow" name="robots">/i.test(html),

  // ── 1. HERO (recognition) ─────────────────────────────────────
  heroH1Problem: /Worn blade costing you/i.test(html),
  heroSub: /one business day/i.test(html),
  heroImage: html.includes('hero-factory.webp'),
  heroAnchors: /In-house heat treatment/.test(html),

  // ── 2. FAMILIES (qualification) ───────────────────────────────
  familyCards: (html.match(/lp-family-card/g) || []).length === 6,
  familyCapabilityEach:
    /Slitting knives for paper/.test(html) &&
    /Toothed blades for tear-strips/.test(html) &&
    /Rotor and stator knives/.test(html),

  // ── 3. SPECS (technical validation) ──────────────────────────
  specsTableRows: (html.match(/D2 \/ SKD11/g) || []).length >= 1,
  specsColumns: /<th[^>]*scope="col"[^>]*>Material<\/th>/.test(html) && /Hardness \(HRC\)/.test(html),

  // ── 4. RISK & QUALITY ─────────────────────────────────────────
  riskIso: /ISO 9001:2015/.test(html),
  riskCpk: /Cpk\u00a0\u2265\u00a01\.33/.test(html) || /Cpk.*1\.33/.test(html),
  riskReport: /Mill certificate/.test(html),
  casesCount: (html.match(/lp-case-tag/g) || []).length === 3,

  // ── 5. COMMERCIAL TERMS ──────────────────────────────────────
  commercialItems: (html.match(/lp-commercial-item/g) || []).length === 6,
  commercialMoq: /MOQ/.test(html),
  commercialNda: /NDA/.test(html),

  // ── 6. TESTIMONIAL ───────────────────────────────────────────
  testimonialBlock: html.includes('lp-quote-text') && html.includes('lp-quote-attrib'),

  // ── 7. FORM (decision action) ─────────────────────────────────
  formAction: html.includes('action="/api/inquiry"'),
  formId: html.includes('id="inquiry-form"'),
  inputFullName: html.includes('name="fullName"'),
  inputEmail: html.includes('type="email"') && html.includes('autocomplete="email"'),
  inputCompany: html.includes('name="company"') && html.includes('autocomplete="organization"'),
  inputPhone: html.includes('type="tel"') && html.includes('autocomplete="tel"'),
  inputProductType: html.includes('name="productType"'),
  textareaRequirements: html.includes('name="requirements"'),
  submitButton: html.includes('Send Quote Request'),

  // ── Placeholders explicit (B2B LP must show what's still missing) ──
  placeholdersPresent: html.includes('[PLACEHOLDER') || html.includes('PLACEHOLDER'),

  // ── Cross-cutting trust ──────────────────────────────────────
  headerPhone: html.includes('lp-header-phone'),
  footerContact: html.includes('lp-footer-contact'),
  footerEmail: html.includes('engineering@kaipu-industrial.com'),

  // ── Single CTA + nav isolation ────────────────────────────────
  rfqAnchors: (html.match(/href="#rfq"/g) || []).length >= 3,
  stickyCtaHiddenOnMd: /\.lp-sticky-cta[\s\S]*?@media\s*\(width>=768px\)[\s\S]*?display:\s*none/.test(css),
  noBlogLinksInMain: !/\/blog\//.test(html.split('<main>')[1]?.split('</main>')[0] || ''),
  noIndustriesLinksInMain: !/\/industries\//.test(html.split('<main>')[1]?.split('</main>')[0] || ''),

  // ── Background discipline ────────────────────────────────────
  bodyBgPage: /<body[^>]*class="[^"]*\bbg-page\b[^"]*"/i.test(html),
};

const passed = Object.entries(checks).filter(([, v]) => v).length;
const failed = Object.entries(checks).filter(([, v]) => !v);

console.log(`PASS ${passed}/${Object.keys(checks).length}`);
for (const [k, v] of Object.entries(checks)) {
  console.log(`  ${v ? '\u2713' : '\u2717'} ${k}`);
}
if (failed.length) {
  console.log('\nFAILED:');
  failed.forEach(([k]) => console.log(`  - ${k}`));
}

const sitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
const inSitemap = /lp\//.test(sitemap);
console.log(`\nSitemap: ${inSitemap ? '\u2717 lp/ is present (BAD)' : '\u2713 lp/ excluded'}`);

if (failed.length || inSitemap) process.exit(1);
