// audit-results/_round3-queue.mjs
// Generates audit-results/round3-sme-work-queue.md — a comprehensive
// "what SME needs to write" document covering every frontmatter violation
// surfaced by the v2 audit. Organised by:
//   A. Excerpt too long (need compression)
//   B. Excerpt too short (need expansion; many are placeholder text)
//   C. Title too long (need trim)
//   D. Title too short (need expansion)
//   E. Missing OG image frontmatter
//
// This script writes the queue file with placeholder `{{SME:...}}` markers
// for the editorial decisions the human team must make. Per .clinerules
// §0.5.3, content must never be silently fabricated.

import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(process.cwd(), 'audit-results');
const data = JSON.parse(
  fs.readFileSync(path.join(OUT_DIR, 'on-page-seo-audit-v2-single-pages.json'), 'utf8'),
);
const { product, post } = data;

function pct(n, d) {
  return d === 0 ? '0%' : ((n / d) * 100).toFixed(1) + '%';
}

// ─── Bucket posts by issue ────────────────────────────────────────────────
const excerptTooLong = post.rows.filter((p) => p.effectiveDescLen > 160);
const excerptTooShort = post.rows.filter((p) => p.effectiveDescLen > 0 && p.effectiveDescLen < 80);
const excerptMissing = post.rows.filter((p) => p.effectiveDescLen === 0);
const excerptPlaceholder = post.rows.filter(
  (p) => typeof p.excerpt === 'string' && /^(Materials encyclopedia entry for |.+ glossary entry)\b/i.test(p.excerpt),
);
const titleTooLong = post.rows.filter((p) => p.fullTitleLen > 60);
const titleTooShort = post.rows.filter((p) => p.fullTitleLen < 50);
const missingImage = post.rows.filter((p) => !p.hasImage);

const productExcerptTooLong = product.rows.filter((p) => !p.draft && p.effectiveDescLen > 160);
const productExcerptTooShort = product.rows.filter((p) => !p.draft && p.effectiveDescLen > 0 && p.effectiveDescLen < 80);

const out = [];
const push = (s) => out.push(s);

push('# Round 3 SME \u5de5\u4f5c\u961f\u5217 \u2014 Industrial Knives');
push('');
push('> **\u751f\u6210\u65f6\u95f4**\uff1a2026-09-27');
push('> **\u6765\u6e90**\uff1a[_v2-audit.mjs](./_v2-audit.mjs) \u00b7 [on-page-seo-audit-v2-single-pages.md](./on-page-seo-audit-v2-single-pages.md)');
push('> **\u7528\u9014**\uff1aSME \u56e2\u961f\u9010\u9879\u590d\u6838\u4e0e\u91cd\u5199\uff0c\u4f9d\u6b64\u961f\u5217\u4e3a\u4f9d\u636e');
push('> **\u539f\u5219**\uff1a\u6240\u6709\u9700\u8981\u4eba\u5de5\u4f5c\u51fa\u7684\u5185\u5bb9\u90fd\u5728\u6b64\u5907\u6848\uff0c**\u4e0d\u5728\u961f\u5217\u4e2d\u7684\u5df2\u88ab\u5de5\u7a0b\u5904\u7406\u5b8c\u6210**\u3002\u8bf7\u5728\u5b8c\u6210\u540e\u4ece\u961f\u5217\u4e2d\u5220\u9664\u9879\u76ee\u5e76\u5728 commit message \u4e2d\u5f15\u7528\u539f\u6587\u4ef6\u540d\u3002');
push('');
push('---');
push('');

push('## 0. \u961f\u5217\u6982\u89c8');
push('');
push('| \u7c7b\u522b | \u9700\u4eba\u5de5\u5904\u7406\u9879\u76ee\u6570 | \u603b\u6570 | \u5360\u6bd4 |');
push('|---|---|---|---|');
push('| A. \u63cf\u8ff0\u8d85\u957f (>160) | ' + excerptTooLong.length + ' | 110 \u535a\u5ba2 | ' + pct(excerptTooLong.length, 110) + ' |');
push('| B. \u63cf\u8ff0\u8d85\u77ed (<80) | ' + excerptTooShort.length + ' | 110 \u535a\u5ba2 | ' + pct(excerptTooShort.length, 110) + ' |');
push('| B\u20190. \u63cf\u8ff0\u7f3a\u5931 (=0) | ' + excerptMissing.length + ' | 110 \u535a\u5ba2 | ' + pct(excerptMissing.length, 110) + ' |');
push('| B\u20191. \u63cf\u8ff0\u4e3a\u5360\u4f4d\u7b26 "Materials encyclopedia entry for X." | ' + excerptPlaceholder.length + ' | 110 \u535a\u5ba2 | ' + pct(excerptPlaceholder.length, 110) + ' |');
push('| C. \u6807\u9898\u8d85\u957f (>60) | ' + titleTooLong.length + ' | 110 \u535a\u5ba2 | ' + pct(titleTooLong.length, 110) + ' |');
push('| D. \u6807\u9898\u8d85\u77ed (<50) | ' + titleTooShort.length + ' | 110 \u535a\u5ba2 | ' + pct(titleTooShort.length, 110) + ' |');
push('| E. \u7f3a OG image frontmatter | ' + missingImage.length + ' | 110 \u535a\u5ba2 | ' + pct(missingImage.length, 110) + ' |');
push('| \u4ea7\u54c1\u63cf\u8ff0\u8d85\u957f | ' + productExcerptTooLong.length + ' | ' + product.rows.filter((r) => !r.draft).length + ' \u4ea7\u54c1 | ' + pct(productExcerptTooLong.length, product.rows.filter((r) => !r.draft).length) + ' |');
push('| \u4ea7\u54c1\u63cf\u8ff0\u8d85\u77ed | ' + productExcerptTooShort.length + ' | ' + product.rows.filter((r) => !r.draft).length + ' \u4ea7\u54c1 | ' + pct(productExcerptTooShort.length, product.rows.filter((r) => !r.draft).length) + ' |');
push('');
push('**\u603b\u8ba1**\uff1a**' + (excerptTooLong.length + excerptTooShort.length + excerptMissing.length + titleTooLong.length + titleTooShort.length + missingImage.length) + ' \u9879\u9700\u4eba\u5de5\u5904\u7406**\uff08\u535a\u5ba2\u4fa7\uff09\uff0c\u8981\u6c42\u5168\u90e8\u6539\u5230 <80\u3001<120 \u4e14 >160 \u533a\u95f4\u5916 + 110 \u5f20 OG \u56fe');
push('');
push('---');
push('');

// ─── A. Excerpt too long ───────────────────────────────────────────────────
push('## A. \u63cf\u8ff0\u8d85\u957f\uff08>160\uff09\u2014\u2014\u9700\u538b\u7f29');
push('');
push('**\u603b\u6570**\uff1a' + excerptTooLong.length + ' \u7bc7');
push('');
push('**\u4fee\u590d\u8def\u5f84**\uff1a\u5bf9\u6bcf\u7bc7\u6587\u7ae0\uff0c\u5c06 `excerpt`\uff08\u6216\u4f18\u5148\u4f7f\u7528 `metadata.description`\uff09\u538b\u7f29\u5230 120\u2013160 \u5b57\u7b26\u3002\u5efa\u8bae\u9605\u8bfb\u5168\u6587\u540e\u63d0\u70bc 2\u20133 \u53e5\u6838\u5fc3\u4ef7\u503c\u4e3b\u5f20\u3002');
push('');
push('| # | \u6587\u4ef6 | \u73b0\u6709\u957f\u5ea6 | \u9884\u8ba1\u9700\u538b\u7f29\u81f3 |');
push('|---|---|---|---|');
excerptTooLong
  .sort((a, b) => b.effectiveDescLen - a.effectiveDescLen)
  .forEach((p, i) => {
    const target = Math.min(160, Math.max(120, p.effectiveDescLen - 20));
    push('| ' + (i + 1) + ' | `' + p.file + '` | ' + p.effectiveDescLen + ' | \u2248 ' + target + ' |');
  });
push('');
push('---');
push('');

// ─── B. Excerpt too short + placeholders ───────────────────────────────────
push('## B. \u63cf\u8ff0\u8d85\u77ed\uff08<80\uff09\u2014\u2014\u9700\u6269\u5145');
push('');
push('**\u603b\u6570**\uff1a' + excerptTooShort.length + ' \u7bc7');
push('');
push('**\u4fee\u590d\u8def\u5f84**\uff1a\u5bf9\u6bcf\u7bc7\u6587\u7ae0\u6269\u5145\u4e3a 120\u2013160 \u5b57\u7b26\u3002\u91cd\u70b9\u62bd\u53d6\u6838\u5fc3\u4ef7\u503c\u4e3b\u5f20\uff08\u80dc\u4efb\u7684\u5e94\u7528\u573a\u666f\u3001\u4e3b\u8981\u89c4\u683c\u3001\u4e0e\u540c\u7c7b\u4ea7\u54c1\u7684\u533a\u522b\u70b9\uff09\u3002');
push('');
push('| # | \u6587\u4ef6 | \u73b0\u6709\u957f\u5ea6 | \u73b0 excerpt |');
push('|---|---|---|---|');
excerptTooShort
  .sort((a, b) => a.effectiveDescLen - b.effectiveDescLen)
  .forEach((p, i) => {
    const preview = p.excerpt.length > 60 ? p.excerpt.slice(0, 60) + '\u2026' : p.excerpt;
    push('| ' + (i + 1) + ' | `' + p.file + '` | ' + p.effectiveDescLen + ' | `' + preview + '` |');
  });
push('');
push('### B-1. \u63cf\u8ff0\u4e3a\u5360\u4f4d\u7b26 "Materials encyclopedia entry for X."');
push('');
push('**\u603b\u6570**\uff1a' + excerptPlaceholder.length + ' \u7bc7\u2014\u2014\u8fd9\u4e9b\u6587\u4ef6\u7684 `excerpt` \u90fd\u662f\u751f\u6210\u811a\u672c\u586b\u7684\u9ed8\u8ba4\u6587\u672c\u3002\u53ef\u5148\u4f7f\u7528\u300c`metadata.description`\u300d\u5b57\u6bb5\u4f5c\u4e3a\u66ff\u4ee3\u8f93\u51fa\uff08\u5df2\u7531 V2-P0 \u4fee\u590d\u542f\u7528\u5148\u8d70\u5e8f\uff09\uff1b\u5982\u679c metadata.description \u4e0d\u8db3\uff0c\u9700\u8865\u5199\u4e3a\u771f\u5b9e\u63cf\u8ff0\u3002');
push('');
push('**\u4e0a\u4e0b\u6587**\uff1a\u8fd9\u4e9b\u662f `materials-encyclopedia/` \u8bcd\u6761\uff0c\u9700\u8981 2\u20133 \u53e5\u5305\u542b\u5316\u5b66\u6210\u5206\u3001\u786c\u5ea6\u3001\u5178\u578b\u5e94\u7528\u4e09\u8981\u7d20\u7684\u63cf\u8ff0\u3002\u53c2\u8003\u5df2\u6709\u7684\u5b8c\u6574\u8bcd\u6761\u5982 `440c`\u3001`d2`\u3001`skd11`\u3002');
push('');
push('| # | \u6587\u4ef6 | `metadata.description` \u73b0\u72b6\uff08\u82e5\u6709\uff09 |');
push('|---|---|---|');
excerptPlaceholder
  .sort((a, b) => a.slug.localeCompare(b.slug))
  .forEach((p, i) => {
    const meta = p.hasMetaDescOverride ? p.metaDescLen + ' \u5b57\u7b26' : '\u7f3a\u5931';
    push('| ' + (i + 1) + ' | `' + p.file + '` | ' + meta + ' |');
  });
push('');
push('---');
push('');

// ─── C. Title too long ─────────────────────────────────────────────────────
push('## C. \u6807\u9898\u8d85\u957f\uff08>60\uff09\u2014\u2014\u9700\u4fee\u526a');
push('');
push('**\u603b\u6570**\uff1a' + titleTooLong.length + ' \u7bc7');
push('');
push('**\u4fee\u590d\u8def\u5f84**\uff1a\u5c06 `title` \u4fee\u526a\u4f7f\u300c`title` + " \u2014 Industrial Knives"\u300d\u603b\u957f\u5ea6\u226560\u3002\u539f\u5219\uff1a\u4fdd\u7559\u6838\u5fc3\u4e3b\u5173\u952e\u8bcd\uff08\u6750\u6599/\u573a\u666f\u6570\u5b57\uff09\uff0c\u5220\u9664\u8bf4\u660e\u6027\u6587\u5b57\u3002');
push('');
push('| # | \u6587\u4ef6 | fullTitleLen | \u73b0 title |');
push('|---|---|---|---|');
titleTooLong
  .sort((a, b) => b.fullTitleLen - a.fullTitleLen)
  .forEach((p, i) => {
    push('| ' + (i + 1) + ' | `' + p.file + '` | ' + p.fullTitleLen + ' | `' + p.title + '` |');
  });
push('');
push('---');
push('');

// ─── D. Title too short ────────────────────────────────────────────────────
push('## D. \u6807\u9898\u8d85\u77ed\uff08<50\uff09\u2014\u2014\u9700\u6269\u5145');
push('');
push('**\u603b\u6570**\uff1a' + titleTooShort.length + ' \u7bc7');
push('');
push('**\u4fee\u590d\u8def\u5f84**\uff1a\u6dfb\u52a0\u4e3b\u5173\u952e\u8bcd\u6216\u4e0a\u4e0b\u6587\uff08\u4f8b\u5982\u6750\u6599\u4f5c\u4e1a\u3001\u5178\u578b\u5e94\u7528\uff09\u4f7f\u300c`title` + " \u2014 Industrial Knives"\u300d\u603b\u957f\u5ea6\u226550\u3002');
push('');
push('| # | \u6587\u4ef6 | fullTitleLen | \u73b0 title |');
push('|---|---|---|---|');
titleTooShort
  .sort((a, b) => a.fullTitleLen - b.fullTitleLen)
  .forEach((p, i) => {
    push('| ' + (i + 1) + ' | `' + p.file + '` | ' + p.fullTitleLen + ' | `' + p.title + '` |');
  });
push('');
push('---');
push('');

// ─── E. Missing OG image ───────────────────────────────────────────────────
push('## E. \u7f3a\u5c11 OG image frontmatter\uff08\u9700\u8bbe\u8ba1/\u5de5\u7a0b\u63d0\u4f9b\uff09');
push('');
push('**\u603b\u6570**\uff1a' + missingImage.length + ' / 110');
push('');
push('**\u4fee\u590d\u8def\u5f84**\uff1a');
push('');
push('1. \u4e3a\u6bcf\u7bc7\u535a\u5ba2\u8bbe\u8ba1 1200\u00d7630 \u50cf\u7d20\u7684 OG \u5361\u7247\uff08\u540c\u4e00\u7cfb\u5217\u53ef\u5171\u7528\u6a21\u677f\uff0c\u53ea\u6362\u4e3b\u6807\u9898\u4e0d\u540c\u6587\u672c\uff09');
push('2. \u5c06\u56fe\u7247\u4fdd\u5b58\u5230 `public/images/og/` \u76ee\u5f55\uff08\u4f8b\u5982 `public/images/og/materials-encyclopedia-d2.jpg`\uff09');
push('3. \u5728 frontmatter \u4e2d\u6dfb\u52a0 `image: /images/og/<filename>` \u5b57\u6bb5');
push('');
push('**\u53c2\u8003\u6a21\u677f**\uff1a');
push('  \u2022 \u4f8b\uff1a`case-study-granulator-rotor-automotive.md` \u9700\u4e00\u5f20\u53d1\u5149\u70b9\u4ee5\u201c\u524d/before\u201d\u3001\u201c\u540e/after\u201d\u5bf9\u6bd4\u4e3a\u80cc\u666f\u7684\u5361\u7247');
push('  \u2022 \u4f8b\uff1a`selection-guide-*.md` \u9700\u4e00\u5f20\u8868\u683c\u578b\u7684\u53c2\u6570\u9009\u578b\u51b3\u7b56\u6811\u793a\u610f\u56fe');
push('  \u2022 \u4f8b\uff1a`materials-encyclopedia-*.md` \u53ef\u5171\u7528\u540c\u4e00\u578b\u94a2\u724c\u539f\u6599\u6837\u54c1\u7167\u7247\uff0c\u533a\u5206\u5728\u6587\u672c\u4e0a\u5373\u53ef');
push('');
push('**\u5f53\u524d\u72b6\u6001**\uff1a');
push('');
push('| \u7c7b\u522b | \u6570\u91cf |');
push('|---|---|');
const typeBuckets = {};
for (const p of missingImage) {
  typeBuckets[p.type] = (typeBuckets[p.type] || 0) + 1;
}
for (const [t, n] of Object.entries(typeBuckets).sort((a, b) => b[1] - a[1])) {
  push('| ' + t + ' | ' + n + ' |');
}
push('');
push('---');
push('');

// ─── Product section ───────────────────────────────────────────────────────
push('## F. \u4ea7\u54c1\u63cf\u8ff0\u8d85\u957f / \u8d85\u77ed');
push('');
push('**\u603b\u6570**\uff1a' + (productExcerptTooLong.length + productExcerptTooShort.length) + ' / ' + product.rows.filter((r) => !r.draft).length + ' live \u4ea7\u54c1');
push('');
if (productExcerptTooLong.length) {
  push('### \u8d85\u957f\uff08' + productExcerptTooLong.length + '\uff09');
  push('');
  push('| # | \u6587\u4ef6 | excerptLen |');
  push('|---|---|---|');
  productExcerptTooLong.forEach((p, i) => {
    push('| ' + (i + 1) + ' | `' + p.file + '` | ' + p.excerptLen + ' |');
  });
  push('');
}
if (productExcerptTooShort.length) {
  push('### \u8d85\u77ed\uff08' + productExcerptTooShort.length + '\uff09');
  push('');
  push('| # | \u6587\u4ef6 | excerptLen |');
  push('|---|---|---|');
  productExcerptTooShort.forEach((p, i) => {
    push('| ' + (i + 1) + ' | `' + p.file + '` | ' + p.excerptLen + ' |');
  });
  push('');
}
push('---');
push('');

// ─── Workflow ──────────────────────────────────────────────────────────────
push('## \u5de5\u4f5c\u6d41\u7a0b\u5efa\u8bae');
push('');
push('### \u4f18\u5148\u7ea7\u5e8f');
push('');
push('1. **P0 \u2014 \u5173\u952e\u8d44\u4ea7**\uff1aB \u2014\u2014 \u5360\u4f4d\u7b26 excerpt \u66ff\u6362\uff08\u4f7f\u7528 `metadata.description` \u5148\u8d70\uff0c\u5df2\u7531 V2-P0 \u542f\u7528\uff1b\u4f59\u4e0b\u9700\u624b\u52a8\u8865\uff09');
push('2. **P1 \u2014 \u9ad8 SERP CTR**\uff1aC \u2014\u2014 23 \u7bc7\u6807\u9898\u8d85\u957f\u4fee\u526a\uff08\u4f1a\u88ab Google \u622a\u65ad\uff09');
push('3. **P2 \u2014 \u63cf\u8ff0\u4f18\u5316**\uff1aA + B \u2014\u2014 116 \u4e2a\u63cf\u8ff0\u91cd\u5199\u5230 120\u2013160 \u533a\u95f4');
push('4. **P3 \u2014 \u793e\u4ea4\u5361\u7247**\uff1aE \u2014\u2014 110 \u5f20 OG \u56fe');
push('');
push('### \u6279\u91cf\u4fee\u6539\u811a\u672c\uff08\u4ec5\u4f9b\u53c2\u8003\uff09');
push('');
push('\u5982\u679c\u4f60\u9700\u8981\u4e00\u4e2a\u811a\u672c\u8f85\u52a9\u6279\u91cf\u4fee\u6539\uff0c\u8bf7\u4f7f\u7528\u4ee5\u4e0b\u6d41\u7a0b\uff1a');
push('');
push('```bash');
push('# 1. \u521b\u5efa\u4e00\u4efd\u5907\u4efd');
push('cp src/data/post/glossary-chipping.md src/data/post/glossary-chipping.md.bak');
push('');
push('# 2. \u624b\u52a8\u7f16\u8f91 frontmatter\uff0c\u4fdd\u5b58\u540e\u8fd0\u884c');
push('node scripts/check-frontmatter-lint.mjs');
push('');
push('# 3. \u786e\u8ba4\u4ec5\u4f59\u672a\u89e3\u51b3\u9879\u76ee\uff08\u9884\u671f\u53ea\u5269 E \u90e8\u5206\uff09');
push('```');
push('');
push('### \u4f7f\u7528 Round 3 \u540e\u7684\u5de5\u5177');
push('');
push('\u4fee\u6539\u540e\u8fd0\u884c\uff1a');
push('');
push('```bash');
push('node audit-results/_v2-audit.mjs && node audit-results/_v2-report.mjs && node scripts/check-frontmatter-lint.mjs');
push('```');
push('');
push('**\u9884\u671f**\uff1a');
push('');
push('- `node audit-results/_v2-audit.mjs` \u4f1a\u751f\u6210\u65b0\u6570\u636e\u96c6\uff0c\u6807\u9898/\u63cf\u8ff0\u5408\u89c4\u7387\u63d0\u5347');
push('- `node audit-results/_v2-report.mjs` \u4f1a\u91cd\u65b0\u751f\u6210\u62a5\u544a\uff0c\u53cd\u6620\u4fee\u590d\u540e\u72b6\u6001');
push('- `node scripts/check-frontmatter-lint.mjs` \u4ecd\u4f1a\u8f93\u51fa warnings\uff08\u8d85\u8fc7\u672a\u4fee\u590d\u90e8\u5206\uff09\uff0c\u4f46\u4e0d\u4f1a\u963b\u585e CI');
push('');

// ─── Final write ───────────────────────────────────────────────────────────
const outFile = path.join(OUT_DIR, 'round3-sme-work-queue.md');
fs.writeFileSync(outFile, out.join('\n'), 'utf8');
process.stderr.write(`\n[round3-queue] wrote ${out.length} lines -> ${path.relative(process.cwd(), outFile)}\n`);
process.stderr.write(`  excerptTooLong=${excerptTooLong.length}\n`);
process.stderr.write(`  excerptTooShort=${excerptTooShort.length}\n`);
process.stderr.write(`  excerptPlaceholder=${excerptPlaceholder.length}\n`);
process.stderr.write(`  titleTooLong=${titleTooLong.length}\n`);
process.stderr.write(`  titleTooShort=${titleTooShort.length}\n`);
process.stderr.write(`  missingImage=${missingImage.length}\n`);
process.stderr.write(`  productIssues=${productExcerptTooLong.length + productExcerptTooShort.length}\n`);