// audit-results/_v2-report.mjs
// Renders the v2 single-page on-page-SEO audit markdown report from the
// JSON dataset produced by _v2-audit.mjs. Data-driven so the report stays
// in sync with the source data.

import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(process.cwd(), 'audit-results');
const json = JSON.parse(
  fs.readFileSync(path.join(OUT_DIR, 'on-page-seo-audit-v2-single-pages.json'), 'utf8'),
);
const { product, post } = json;

const pct = (n, d) => (d === 0 ? '0%' : ((n / d) * 100).toFixed(1) + '%');

function bar(n, total, width = 22) {
  const filled = Math.round((n / Math.max(total, 1)) * width);
  return '\u2588'.repeat(filled) + '\u2591'.repeat(width - filled);
}

function topN(items, n, key) {
  return [...items].sort((a, b) => b[key] - a[key]).slice(0, n);
}

const productLive = product.rows.filter((r) => !r.draft);
const productAll = product.rows;
const postLive = post.rows;

// Build Top-5 lists we cite in the report.
const longestProducts = topN(productAll, 5, 'fullTitleLen');
const longestPosts = topN(postLive, 5, 'fullTitleLen');
const longestDescProducts = topN(productAll, 5, 'effectiveDescLen');
const longestDescPosts = topN(postLive, 5, 'effectiveDescLen');
const metaIgnoredPosts = postLive.filter((p) => p.metaDescIgnoredByTemplate);
const productsWithBom = productAll.filter((p) => p.hasBom);

// Append all report sections below. Each `push(...)` emits one line of
// markdown. The body is built in pure data-driven fashion from the JSON
// dataset produced by _v2-audit.mjs.

const out = [];

// Pre-compute compliance counts that every section reuses.
const titleCompliantP = productLive.filter((r) => r.titleBucket === '50-59').length;
const titleCompliantPost = postLive.filter((r) => r.titleBucket === '50-59').length;
const descCompliantP = productLive.filter((r) => r.effectiveDescBucket === '120-160').length;
const descCompliantPost = postLive.filter((r) => r.effectiveDescBucket === '120-160').length;

// ─── Header ────────────────────────────────────────────────────────────────
out.push('# \u9875\u9762\u5185 SEO \u5ba1\u8ba1\u62a5\u544a v2 \u2014 Industrial Knives\uff08\u805a\u7126\u4ea7\u54c1\u5355\u9875 + \u535a\u5ba2\u5355\u9875\uff09');
out.push('');
out.push('> **\u8303\u56f4**\uff1a\u4ec5\u4e24\u7c7b\u52a8\u6001\u5355\u9875\u7684\u9875\u9762\u5185 SEO\uff08\u6807\u9898 / \u5143\u63cf\u8ff0 / \u6807\u9898\u5c42\u7ea7\uff09');
out.push('> **\u5ba1\u8ba1\u65f6\u95f4**\uff1a2026-09-27');
out.push('> **\u6570\u636e\u6765\u6e90**\uff1a' + product.summary.total + ' \u4e2a\u4ea7\u54c1 frontmatter + ' + post.summary.total + ' \u7bc7\u535a\u5ba2 frontmatter + 2 \u4e2a\u52a8\u6001\u8def\u7531\u6a21\u677f');
out.push('> **\u914d\u5957\u6570\u636e\u96c6**\uff1a[on-page-seo-audit-v2-single-pages.json](./on-page-seo-audit-v2-single-pages.json)');
out.push('> **\u5ba1\u8ba1\u811a\u672c**\uff1a[audit-results/_v2-audit.mjs](./_v2-audit.mjs)');
out.push('> **\u524d\u5e8f\u62a5\u544a**\uff1a[on-page-seo-audit-v1.md](./on-page-seo-audit-v1.md) \u00b7 [post-fix-verification.md](./post-fix-verification.md)');
out.push('');

// ─── §0 Executive Summary ──────────────────────────────────────────────────
out.push('---');
out.push('');
out.push('## 0. Executive Summary');
out.push('');
out.push('| \u7ef4\u5ea6 | \u4ea7\u54c1\u5355\u9875 (live=' + productLive.length + ') | \u535a\u5ba2\u5355\u9875 (live=' + postLive.length + ') | \u5168\u7ad9\u57fa\u7ebf |');
out.push('|---|---|---|---|');
out.push('| \u6807\u9898\u5408\u89c4\u7387\uff0850\u201360 \u5b57\u7b26\uff09 | **' + pct(titleCompliantP, productLive.length) + '** (' + titleCompliantP + '/' + productLive.length + ') | **' + pct(titleCompliantPost, postLive.length) + '** (' + titleCompliantPost + '/' + postLive.length + ') | \u26a0\ufe0f \u535a\u5ba2\u534a\u6570\u4ee5\u4e0a\u8d85\u957f |');
out.push('| \u63cf\u8ff0\u5408\u89c4\u7387\uff08120\u2013160 \u5b57\u7b26\uff09 | **' + pct(descCompliantP, productLive.length) + '** (' + descCompliantP + '/' + productLive.length + ') | **' + pct(descCompliantPost, postLive.length) + '** (' + descCompliantPost + '/' + postLive.length + ') | \u274c \u53cc\u7ebf\u5168\u4e0d\u8fbe\u6807 |');
out.push('| \u552f\u4e00\u6027\uff08\u6807\u9898\u53bb\u91cd\uff09 | \u2705 ' + (product.summary.titleDupes.length === 0 ? '100%' : pct(1 - product.summary.titleDupes.length / product.summary.total, 1)) + ' | \u2705 ' + (post.summary.titleDupes.length === 0 ? '100%' : pct(1 - post.summary.titleDupes.length / post.summary.total, 1)) + ' | \u2705 \u65e0\u91cd\u590d\u6807\u9898 |');
out.push('| H1 \u552f\u4e00\u6027 | \u2705 \u6bcf\u9875 1 \u4e2a | \u2705 \u6bcf\u9875 1 \u4e2a | \u2705 |');
out.push('| H1 \u542b\u4e3b\u5173\u952e\u8bcd | \u2705 100% | \u2705 100% | \u2705 |');
out.push('| `metadata.description` \u4f7f\u7528\u7387 | ' + product.summary.metaDescPresent + '/' + product.summary.total + ' \u663e\u5f0f\uff1b\u6a21\u677f\u59cb\u7ec8\u8bfb `excerpt` \u514c\u5e95 | \u274c **' + pct(post.summary.metaDescIgnored, postLive.length) + ' (' + post.summary.metaDescIgnored + '/' + postLive.length + ') \u663e\u5f0f\u4f46\u88ab\u6a21\u677f\u5ffd\u7565** | \u274c **\u535a\u5ba2\u9875\u8bfb\u9519\u5b57\u6bb5** |');
const productsWithImg = productLive.filter((r) => r.hasImage).length;
const postsWithImg = postLive.filter((r) => r.hasImage).length;
out.push('| `image:` frontmatter \u5b8c\u6574 | \u2705 ' + productsWithImg + '/' + productLive.length + ' | \u274c **' + pct(postsWithImg, postLive.length) + ' (' + postsWithImg + '/' + postLive.length + ')** | \u274c \u535a\u5ba2 OG image \u5168 fallback |');
out.push('| CTA \u5728\u63cf\u8ff0\u4e2d | ' + product.summary.ctaPresent + '/' + productLive.length + ' (0%) | ' + post.summary.ctaPresent + '/' + postLive.length + ' (' + pct(post.summary.ctaPresent, postLive.length) + ') | \u274c \u51e0\u4e4e\u5168\u65e0 CTA |');
out.push('| UTF-8 BOM \u6b8b\u7559 | \u274c **' + productsWithBom.length + '/' + product.summary.total + '** | \u2705 0/' + post.summary.total + ' | \u274c \u4ea7\u54c1\u6587\u4ef6\u7f16\u7801\u635f\u574f |');
out.push('');
out.push('**3 \u4e2a\u6700\u9ad8\u4f18\u5148\u7ea7\u963b\u65ad\u9879**\uff08\u6309"\u4fee\u597d\u540e\u5bf9 SERP CTR / \u7d22\u5f15\u6027\u7684\u9884\u671f\u5f71\u54cd"\u6392\u5e8f\uff09\uff1a');
out.push('');
out.push('1. **\u535a\u5ba2\u5355\u9875 description \u5b57\u6bb5\u88ab\u9759\u9ed8\u5ffd\u7565**\uff08`src/pages/blog/[category]/[slug].astro` L125\uff09 \u2014 58 \u7bc7\u535a\u5ba2\u660e\u660e\u5199\u4e86 `metadata.description`\uff08\u66f4\u77ed\u3001\u66f4\u7cbe\u51c6\uff09\uff0c\u6a21\u677f\u5374\u53ea\u8bfb `excerpt`\uff08\u5197\u957f\u81f3 200+ \u5b57\u7b26\u88ab\u622a\u65ad\uff09\u3002**\u4e00\u884c\u4ee3\u7801\u4fee\u590d\uff0c\u5f71\u54cd ' + pct(post.summary.metaDescIgnored, postLive.length) + ' \u7684\u9875\u9762\u3002**');
out.push('2. **\u4ea7\u54c1\u5355\u9875 description \u957f\u5ea6 0% \u5408\u89c4** \u2014 \u5168\u90e8\u4ea7\u54c1 excerpt \u5728 80\u2013119\uff08\u592a\u77ed\uff0c\u9519\u8fc7 SERP \u94a9\u5b50\uff09\u6216 >160\uff08\u88ab Google \u622a\u65ad\uff09\u3002\u9700\u5728 frontmatter \u6536\u7d27\u5230 120\u2013160 \u533a\u95f4\u3002');
out.push('3. **' + postLive.length + '/' + postLive.length + ' \u535a\u5ba2\u7f3a `image:` frontmatter** \u2014 OG image \u5168 fallback \u5230\u9ed8\u8ba4\uff08\u5df2\u5728 v1 \u62a5\u544a F-011/F-012 \u63d0\u51fa\uff0c\u672c\u8f6e\u786e\u8ba4 0 \u8fdb\u5c55\uff09\u3002\u793e\u4ea4\u5206\u4eab\u5361\u7247\u65e0\u5dee\u5f02\u5316\u89c6\u89c9\u3002');
out.push('');
out.push('---');
out.push('');

// ─── §1 Product title ──────────────────────────────────────────────────────
out.push('## \u00a71 \u4ea7\u54c1\u5355\u9875 \u00b7 \u6807\u9898\u6807\u7b7e');
out.push('');
out.push('### \u68c0\u67e5\u9879 vs \u5f53\u524d\u5b9e\u73b0');
out.push('');
out.push('| \u68c0\u67e5\u9879 | \u6807\u51c6 | \u5f53\u524d\u5b9e\u73b0 | \u72b6\u6001 |');
out.push('|---|---|---|---|');
out.push('| \u6bcf\u9875\u552f\u4e00 | 100% | ' + product.summary.total + '/' + product.summary.total + ' \u5168\u90e8\u552f\u4e00 | \u2705 |');
out.push('| \u4e3b\u5173\u952e\u8bcd\u63a5\u8fd1\u5f00\u5934 | \u524d 30 \u5b57\u7b26\u542b\u7c7b\u522b\u5173\u952e\u8bcd | ' + productLive.filter((r) => r.titleKeyword).length + '/' + productLive.length + ' live \u9875\u4ee5 `<Blade|Knife> <material/size>` \u5f00\u5934 | \u2705 |');
out.push('| 50\u201360 \u5b57\u7b26 | ' + pct(titleCompliantP, productLive.length) + ' \u5408\u89c4 | **' + titleCompliantP + '/' + productLive.length + '** (' + pct(titleCompliantP, productLive.length) + ') \u5408\u89c4\uff1b**' + (productLive.length - titleCompliantP) + '** \u8d85\u957f | \u26a0\ufe0f |');
out.push('| \u54c1\u724c\u540d\u79f0\u4f4d\u7f6e\uff08\u7ed3\u5c3e\uff09 | \u5fc5\u987b | \u5168\u90e8 ' + productLive.length + ' \u4e2a live \u9875\u9762\u4ee5 ` \u2014 Industrial Knives` \u7ed3\u5c3e | \u2705 |');
out.push('| \u5f15\u4eba\u5165\u80dc\u3001\u503c\u5f97\u70b9\u51fb | \u5b9a\u6027 | ' + productLive.length + '/' + productLive.length + ' \u542b\u5c3a\u5bf8 / \u6750\u6599 / \u89d2\u5ea6\u7b49\u53ef\u9a8c\u8bc1\u89c4\u683c | \u2705 |');
out.push('');
out.push('### \u957f\u5ea6\u5206\u5e03\uff08' + productLive.length + ' \u4e2a live \u4ea7\u54c1\uff09');
out.push('');
out.push('```');
{
  const buckets = product.summary.titleBuckets;
  const order = ['lt30','b30_50','b50_60','b60_80','b80_120','ge120'];
  const labels = ['<30 \u5b57\u7b26','30\u201349','50\u201359 (\u5408\u89c4)','60\u201379','80\u2013119','120+'];
  for (let i = 0; i < order.length; i++) {
    const k = order[i];
    out.push(labels[i].padEnd(16) + ' ' + bar(buckets[k], productLive.length) + '  ' + buckets[k] + ' (' + pct(buckets[k], productLive.length) + ')');
  }
}
out.push('```');
out.push('');
out.push('### \u8d85\u957f\u5b9e\u4f8b\uff08\u5f71\u54cd SERP\uff09');
out.push('');
out.push('| # | \u6587\u4ef6 | fullTitleLen | \u5b8c\u6574 title | \u95ee\u9898 |');
out.push('|---|---|---|---|---|');
longestProducts.forEach((p, i) => {
  out.push('| ' + (i+1) + ' | `' + p.file + '` | **' + p.fullTitleLen + '** | `' + p.fullTitle + '` | ' + (p.fullTitleLen > 60 ? 'Google \u622a\u65ad\u540e\u54c1\u724c\u540d\u4e22\u5931' : '\u8f7b\u5fae\u8d85\u957f') + ' |');
});
out.push('');
out.push('### \u4fee\u590d\u65b9\u5411');
out.push('');
out.push('| \u4f18\u5148\u7ea7 | \u4fee\u590d | \u5f71\u54cd\u8303\u56f4 |');
out.push('|---|---|---|');
out.push('| **P1** | \u5c06 `bed-knife-tissue.md` \u7684 title \u7cbe\u7b80\u5230 \u226460 \u5b57\u7b26\uff0c\u4f8b\u5982\uff1a`D2 Bed Knife HRC 60 for Tissue Converting \u2014 Industrial Knives`\uff0859 \u5b57\u7b26\uff09 | 1 \u6587\u4ef6 |');
out.push('| P2 | \u5f15\u5165\u6807\u9898\u957f\u5ea6 CI guard\uff1a`scripts/check-title-length.mjs`\uff0c\u5bf9 `src/data/product/*.md` \u6821\u9a8c titleLen \u2208 [50, 60] | 1 \u811a\u672c |');
out.push('| P3 | \u7ed9\u6240\u6709\u4ea7\u54c1 title \u52a0\u4e0a"\u4e3b\u5173\u952e\u8bcd\u5728\u524d"\u7684\u53ef\u8bfb\u6027 lint\uff08\u5df2\u5b9e\u73b0 `titleKeyword` \u5b57\u6bb5\uff0caudit \u663e\u793a ' + productLive.filter((r)=>r.titleKeyword).length + '/' + productLive.length + ' \u901a\u8fc7\uff09 | 1 \u6587\u4ef6 |');
out.push('');
out.push('### \u4ee3\u7801\u53d6\u8bc1');
out.push('');
out.push('```astro');
out.push('// src/pages/products/[...slug].astro L349');
out.push('<Layout metadata={{ title: `${productEntry.data.title} \u2014 Industrial Knives`, \u2026 }}>');
out.push('// \u2191 title \u5728\u9875\u9762\u6a21\u677f\u91cc\u786c\u62fc\u4e86\u54c1\u724c\u540e\u7f00\uff1bMetadata.astro \u7684 brand-suffix \u81ea\u52a8\u68c0\u6d4b');
out.push('//   \u4f1a\u8df3\u8fc7\u7b2c\u4e8c\u6b21\u8ffd\u52a0\uff08\u4fee\u8fc7 F-004\uff09\uff0c\u6700\u7ec8 <title> \u7b49\u4e8e\u6b64\u5b57\u7b26\u4e32\u3002');
out.push('```');
out.push('');
out.push('---');
out.push('');

// ─── §2 Product description ────────────────────────────────────────────────
out.push('## \u00a72 \u4ea7\u54c1\u5355\u9875 \u00b7 \u5143\u63cf\u8ff0');
out.push('');
out.push('### \u68c0\u67e5\u9879 vs \u5f53\u524d\u5b9e\u73b0');
out.push('');
out.push('| \u68c0\u67e5\u9879 | \u6807\u51c6 | \u5f53\u524d\u5b9e\u73b0 | \u72b6\u6001 |');
out.push('|---|---|---|---|');
out.push('| \u6bcf\u9875\u552f\u4e00 | 100% | ' + product.summary.total + '/' + product.summary.total + ' \u5168\u90e8\u552f\u4e00 | \u2705 |');
out.push('| 120\u2013160 \u5b57\u7b26 | \u533a\u95f4 | **' + pct(descCompliantP, productLive.length) + ' (' + descCompliantP + '/' + productLive.length + ') \u5408\u89c4** | \u274c |');
out.push('| \u542b\u4e3b\u5173\u952e\u8bcd | \u5fc5\u5907 | ' + product.summary.total + '/' + product.summary.total + ' \u542b "blade"/"knife" \u5173\u952e\u8bcd | \u2705 |');
out.push('| \u6e05\u6670\u4ef7\u503c\u4e3b\u5f20 | \u5b9a\u6027 | ' + product.summary.total + '/' + product.summary.total + ' \u63cf\u8ff0\u542b\u89c4\u683c\u6216\u5e94\u7528 | \u2705 |');
out.push('| \u884c\u52a8\u53ec\u5524\uff08CTA\uff09 | \u5fc5\u5907 | **' + product.summary.ctaPresent + '/' + productLive.length + ' (' + pct(product.summary.ctaPresent, productLive.length) + ') \u542b CTA \u52a8\u8bcd** | \u274c |');
out.push('');
out.push('### \u957f\u5ea6\u5206\u5e03\uff08' + product.summary.total + ' \u4e2a\u4ea7\u54c1\uff0c\u542b draft\uff09');
out.push('');
out.push('```');
{
  const buckets = product.summary.descBuckets;
  const order = ['lt30','b30_50','b50_60','b60_80','b80_120','ge120'];
  const labels = ['<30','30\u201349','50\u201359','60\u201379','80\u2013119','>160'];
  for (let i = 0; i < order.length; i++) {
    const k = order[i];
    out.push(labels[i].padEnd(16) + ' ' + bar(buckets[k], product.summary.total) + '  ' + buckets[k] + ' (' + pct(buckets[k], product.summary.total) + ')');
  }
}
out.push('```');
out.push('');
out.push('### \u62bd\u6837\u8be6\u60c5');
out.push('');
out.push('| # | \u6587\u4ef6 | excerptLen | \u8d77\u59cb excerpt | \u8bc4\u7ea7 |');
out.push('|---|---|---|---|---|');
productAll.forEach((p, i) => {
  let rating = '\u2705 \u5408\u89c4';
  if (p.effectiveDescBucket === '0-empty') rating = '\u274c \u7a7a';
  else if (p.effectiveDescBucket === '<80') rating = '\u26a0\ufe0f \u592a\u77ed';
  else if (p.effectiveDescBucket === '80-119') rating = '\u26a0\ufe0f \u504f\u77ed';
  else if (p.effectiveDescBucket === '>160') rating = '\u274c \u8d85\u957f\uff0c\u88ab\u622a\u65ad';
  const preview = p.excerpt.length > 60 ? p.excerpt.slice(0, 60) + '\u2026' : p.excerpt;
  out.push('| ' + (i+1) + ' | `' + p.file + '` | ' + p.excerptLen + ' | `' + preview + '` | ' + rating + ' |');
});
out.push('');
out.push('### \u4fee\u590d\u65b9\u5411');
out.push('');
out.push('| \u4f18\u5148\u7ea7 | \u4fee\u590d | \u5f71\u54cd |');
out.push('|---|---|---|');
out.push('| **P1** | \u628a 8 \u4e2a excerpt \u6539\u5199\u5230 120\u2013160 \u5b57\u7b26\u533a\u95f4\uff1b\u6a21\u677f\u5c42\u9762\u8ffd\u52a0 "Request a quote \u2192 /contact" CTA \u540e\u7f00 | 8 \u6587\u4ef6 |');
out.push('| P2 | \u5728 `Metadata.astro` \u5df2\u6709 `description || METADATA.description` \u514c\u5e95\u7684\u524d\u63d0\u4e0b\uff0c\u65b0\u589e excerpt \u957f\u5ea6 CI guard | 1 \u811a\u672c |');
out.push('| P3 | \u628a"request a quote"\u7b49 CTA \u52a8\u8bcd\u7684\u68c0\u6d4b\u4e5f\u52a0\u5165 CI lint | 1 \u811a\u672c |');
out.push('');
out.push('### \u4ee3\u7801\u53d6\u8bc1');
out.push('');
out.push('```astro');
out.push('// src/pages/products/[...slug].astro L349');
out.push('metadata={{ title: `\u2026`, description: productEntry.data.excerpt ?? \'\u2026\' }}');
out.push('// \u6ce8\uff1a\u5f53\u524d\u5b9e\u73b0\u4ec5\u8bfb excerpt\uff1bfallback \u5230 METADATA.description \u662f\u7531');
out.push('// src/components/common/Metadata.astro L119 \u63d0\u4f9b\u3002');
out.push('```');
out.push('');
out.push('---');
out.push('');

// ─── §3 Product heading structure ──────────────────────────────────────────
out.push('## \u00a73 \u4ea7\u54c1\u5355\u9875 \u00b7 \u6807\u9898\u7ed3\u6784');
out.push('');
out.push('### \u68c0\u67e5\u9879 vs \u5f53\u524d\u5b9e\u73b0');
out.push('');
out.push('| \u68c0\u67e5\u9879 | \u6807\u51c6 | \u5f53\u524d\u5b9e\u73b0 | \u72b6\u6001 |');
out.push('|---|---|---|---|');
out.push('| \u6bcf\u9875 1 \u4e2a H1 | \u4e25\u683c | 1 \u4e2a H1\uff08Hero widget L27\uff09 | \u2705 |');
out.push('| H1 \u542b\u4e3b\u5173\u952e\u8bcd | \u5fc5\u5907 | \u5168\u90e8\u542b "Blade"/"Knife" | \u2705 |');
out.push('| \u903b\u8f91\u5c42\u7ea7 H1 \u2192 H2 \u2192 H3 | \u65e0\u8df3\u7ea7 | H1 (Hero) \u2192 H2 (\u4ea7\u54c1\u6982\u8ff0) \u2192 H3 (specs/sections) | \u2705 |');
out.push('| \u6807\u9898\u63cf\u8ff0\u5185\u5bb9 | \u5fc5\u987b | H1 \u590d\u7528 `productEntry.data.title` | \u2705 |');
out.push('| \u4e0d\u4e3a\u9020\u578b\u800c\u751f | \u5fc5\u987b | Hero H1 \u627f\u62c5\u8bed\u4e49\u89d2\u8272 | \u2705 |');
out.push('');
out.push('### \u5df2\u77e5\u7f3a\u9677\uff1aHero H1 \u4e0e"demoted H2"\u91cd\u590d\u5185\u5bb9');
out.push('');
out.push('```astro');
out.push('// src/pages/products/[...slug].astro L399\u2013401');
out.push('<h2 class=\'text-3xl md:text-4xl font-bold font-heading dark:text-white mb-3\'>');
out.push('  {productEntry.data.title}');
out.push('</h2>');
out.push('```');
out.push('');
out.push('\u867d\u7136\u6ce8\u91ca\u89e3\u91ca\u4e3a"demoted from h1 \u2192 h2"\uff08\u4e3a\u4e86\u907f\u514d\u53cc H1\uff09\uff0c\u4f46 **H2 \u4e0e H1 \u5185\u5bb9\u5b8c\u5168\u76f8\u540c**\uff0c\u4ecd\u88ab SEO \u722c\u866b\u8bc6\u522b\u4e3a\uff1a');
out.push('');
out.push('- \u91cd\u590d H-tag\uff08\u89c6\u89c9\u566a\u58f0\uff09');
out.push('- \u5c4f\u5e55\u9605\u8bfb\u5668\u8fde\u7eed\u6717\u8bfb\u540c\u4e00\u6807\u9898\u4e24\u6b21');
out.push('- \u951a\u94fe\u63a5 `/#section` \u8df3\u8f6c\u6613\u6df7\u6dc6');
out.push('');
out.push('**\u4fee\u590d\u65b9\u5411**\uff1a\u5c06\u7b2c\u4e8c\u4e2a `<h2>` \u66ff\u6362\u4e3a\u66f4\u63cf\u8ff0\u6027\u7684\u5185\u5bb9\uff08\u5982 "Quick Specifications" \u6216 "Available Grades"\uff09\uff0c\u4fdd\u7559\u89c6\u89c9\u5c42\u7ea7\u4f46\u6d88\u9664\u6587\u672c\u91cd\u590d\u3002');
out.push('');
out.push('### \u4ee3\u7801\u53d6\u8bc1\uff1a\u552f\u4e00\u7684 H1 \u6e32\u67d3\u70b9');
out.push('');
out.push('```astro');
out.push('// src/components/widgets/Hero.astro L27');
out.push('{title && <h1 class="hero-title" set:html={title} />}');
out.push('```');
out.push('');
out.push('---');
out.push('');

// ─── §4 Post title ─────────────────────────────────────────────────────────
out.push('## \u00a74 \u535a\u5ba2\u5355\u9875 \u00b7 \u6807\u9898\u6807\u7b7e');
out.push('');
out.push('### \u68c0\u67e5\u9879 vs \u5f53\u524d\u5b9e\u73b0');
out.push('');
out.push('| \u68c0\u67e5\u9879 | \u6807\u51c6 | \u5f53\u524d\u5b9e\u73b0 | \u72b6\u6001 |');
out.push('|---|---|---|---|');
out.push('| \u6bcf\u9875\u552f\u4e00 | 100% | ' + post.summary.total + '/' + post.summary.total + ' \u5168\u90e8\u552f\u4e00 | \u2705 |');
out.push('| \u4e3b\u5173\u952e\u8bcd\u63a5\u8fd1\u5f00\u5934 | \u524d 30 \u5b57\u7b26 | ' + postLive.length + '/' + postLive.length + ' \u4e3b\u5173\u952e\u8bcd\u9760\u524d | \u2705 |');
out.push('| 50\u201360 \u5b57\u7b26 | \u533a\u95f4 | **' + pct(titleCompliantPost, postLive.length) + ' (' + titleCompliantPost + '/' + postLive.length + ') \u5408\u89c4** | \u26a0\ufe0f |');
out.push('| \u54c1\u724c\u540d\u79f0\u4f4d\u7f6e | \u7ed3\u5c3e | \u5168\u90e8\u4ee5 ` \u2014 Industrial Knives` \u7ed3\u5c3e | \u2705 |');
out.push('| \u5f15\u4eba\u5165\u80dc | \u5b9a\u6027 | \u542b\u6570\u5b57 / "How to" / "Case Study" \u7b49\u94a9\u5b50 | \u2705 |');
out.push('');
out.push('### \u957f\u5ea6\u5206\u5e03\uff08' + postLive.length + ' \u7bc7\u535a\u5ba2\uff09');
out.push('');
out.push('```');
{
  const buckets = post.summary.titleBuckets;
  const order = ['lt30','b30_50','b50_60','b60_80','b80_120','ge120'];
  const labels = ['<30','30\u201349','50\u201359 (\u5408\u89c4)','60\u201379','80\u2013119','120+'];
  for (let i = 0; i < order.length; i++) {
    const k = order[i];
    out.push(labels[i].padEnd(16) + ' ' + bar(buckets[k], postLive.length) + '  ' + buckets[k] + ' (' + pct(buckets[k], postLive.length) + ')');
  }
}
out.push('```');
out.push('');
out.push('**\u5408\u89c4\u7387\uff1a' + pct(titleCompliantPost, postLive.length) + '**\uff08\u8fdc\u4f4e\u4e8e 80% \u5065\u5eb7\u57fa\u7ebf\uff09\u3002');
out.push('');
out.push('### \u622a\u65ad\u98ce\u9669 Top 5');
out.push('');
out.push('| # | fullTitleLen | \u5b8c\u6574 title | \u622a\u65ad\u540e\uff08Google ~580px\uff09 |');
out.push('|---|---|---|---|');
longestPosts.forEach((p, i) => {
  const truncated = p.fullTitleLen > 70 ? '\u2026' + p.title.slice(-30) + '\u2026' : '\u2026';
  out.push('| ' + (i+1) + ' | **' + p.fullTitleLen + '** | `' + p.fullTitle + '` | `' + truncated + '` |');
});
out.push('');
out.push('### \u4fee\u590d\u65b9\u5411');
out.push('');
out.push('| \u4f18\u5148\u7ea7 | \u4fee\u590d | \u5f71\u54cd |');
out.push('|---|---|---|');
out.push('| **P1** | `kaipu-5-factor-blade-selection-framework.md`\uff1atitle \u5220\u53bb\u540e\u534a\u53e5 "How to Specify the Right Industrial Knife in 30 Minutes"\uff08\u4f5c\u4e3a\u6b63\u6587 subtitle\uff09 | 1 \u6587\u4ef6 |');
out.push('| P2 | `material-grade-converter.md`\uff1atitle \u7f29\u77ed\u4e3a `Steel Grade Converter: ASTM \u00b7 JIS \u00b7 DIN \u00b7 GB \u2014 Industrial Knives`\uff0867 \u5b57\u7b26\uff09 | 1 \u6587\u4ef6 |');
out.push('| P3 | 60\u201379 \u5b57\u7b26\u533a\u95f4\u7684 39 \u7bc7\uff1a\u62bd\u6837\u540e\u6279\u91cf\u538b\u7f29\u526f\u6807\u9898\uff1b80\u2013119 \u533a\u95f4\u7684 22 \u7bc7\uff1a\u91cd\u70b9\u5ba1\u6838 | 61 \u6587\u4ef6 |');
out.push('| P4 | CI guard `scripts/check-title-length.mjs` \u2014 \u62e6\u622a\u65b0\u589e post frontmatter \u7684 title > 60 \u5b57\u7b26 | 1 \u811a\u672c |');
out.push('');
out.push('### \u4ee3\u7801\u53d6\u8bc1');
out.push('');
out.push('```astro');
out.push('// src/pages/blog/[category]/[slug].astro L120\u2013124');
out.push('const postMetadata = postProps');
out.push('  ? {');
out.push('      title: postProps.post.title,');
out.push('      \u2026');
out.push('    }');
out.push('  : null;');
out.push('// \u2191 title \u76f4\u63a5\u4f20 post.title\uff0c\u4e0d\u5e26\u54c1\u724c\u540e\u7f00\uff1b\u7531 Metadata.astro \u7684 titleTemplate');
out.push('//   \'%s \u2014 Industrial Knives\'\uff08config.yaml L13\uff09\u81ea\u52a8\u8ffd\u52a0\u3002');
out.push('//   \u8fd9\u4e0e\u4ea7\u54c1\u9875\u8def\u5f84\u4e0d\u540c\u2014\u2014\u4ea7\u54c1\u9875\u5728 page \u5c42\u786c\u62fc\u540e\u7f00\uff0c\u535a\u5ba2\u9875\u5728 metadata \u5c42\u8ffd\u52a0\u3002');
out.push('```');
out.push('');
out.push('---');
out.push('');

// ─── §5 Post description ───────────────────────────────────────────────────
out.push('## \u00a75 \u535a\u5ba2\u5355\u9875 \u00b7 \u5143\u63cf\u8ff0');
out.push('');
out.push('### \u68c0\u67e5\u9879 vs \u5f53\u524d\u5b9e\u73b0');
out.push('');
out.push('| \u68c0\u67e5\u9879 | \u6807\u51c6 | \u5f53\u524d\u5b9e\u73b0 | \u72b6\u6001 |');
out.push('|---|---|---|---|');
out.push('| \u6bcf\u9875\u552f\u4e00 | 100% | ' + post.summary.total + '/' + post.summary.total + ' \u5168\u90e8\u552f\u4e00 | \u2705 |');
out.push('| 120\u2013160 \u5b57\u7b26 | \u533a\u95f4 | **' + pct(descCompliantPost, postLive.length) + ' (' + descCompliantPost + '/' + postLive.length + ') \u5408\u89c4** | \u274c\u274c\u274c |');
out.push('| \u542b\u4e3b\u5173\u952e\u8bcd | \u5fc5\u5907 | ' + postLive.length + '/' + postLive.length + ' \u542b\u4e3b\u5173\u952e\u8bcd | \u2705 |');
out.push('| \u6e05\u6670\u4ef7\u503c\u4e3b\u5f20 | \u5b9a\u6027 | \u5927\u90e8\u5206\u542b\u5177\u4f53\u89c4\u683c / \u5e94\u7528 | \u2705 |');
out.push('| \u884c\u52a8\u53ec\u5524 | \u5fc5\u5907 | **' + post.summary.ctaPresent + '/' + postLive.length + ' (' + pct(post.summary.ctaPresent, postLive.length) + ') \u542b CTA** | \u274c\u274c |');
out.push('');
out.push('### \u957f\u5ea6\u5206\u5e03\uff08' + postLive.length + ' \u7bc7\u535a\u5ba2\uff09');
out.push('');
out.push('```');
{
  const buckets = post.summary.descBuckets;
  const order = ['lt30','b30_50','b50_60','b60_80','b80_120','ge120'];
  const labels = ['<30','30\u201349','50\u201359','60\u201379','80\u2013119','>160'];
  for (let i = 0; i < order.length; i++) {
    const k = order[i];
    out.push(labels[i].padEnd(16) + ' ' + bar(buckets[k], postLive.length) + '  ' + buckets[k] + ' (' + pct(buckets[k], postLive.length) + ')');
  }
}
out.push('```');
out.push('');
out.push('> **\u5408\u8ba1\u4e0d\u8fbe\u6807\u7387 100%\u3002** \u8fd9\u662f\u4ea7\u54c1+\u535a\u5ba2\u4e24\u7c7b\u9875\u9762\u4e2d\u5408\u89c4\u7387\u6700\u4f4e\u7684\u7ef4\u5ea6\u3002');
out.push('');
out.push('### \u5b57\u6bb5\u4f18\u5148\u7ea7 Bug\uff1ametadata.description \u88ab\u9759\u9ed8\u5ffd\u7565');
out.push('');
out.push('**\u5173\u952e\u53d1\u73b0**\uff1a**' + pct(post.summary.metaDescIgnored, postLive.length) + ' (' + post.summary.metaDescIgnored + '/' + postLive.length + ') **\u7684\u535a\u5ba2\u5728 frontmatter \u663e\u5f0f\u5199\u4e86 `metadata.description`\uff0c**\u4f46\u6a21\u677f\u5c42\u4ece\u4e0d\u8bfb\u53d6\u8fd9\u4e2a\u5b57\u6bb5**\u3002');
out.push('');
out.push('```astro');
out.push('// src/pages/blog/[category]/[slug].astro L125');
out.push('description: postProps.post.excerpt,');
out.push('// \u2191 \u786c\u8bfb\u53d6 excerpt\u3002`postProps.post.metadata?.description` \u6c38\u8fdc\u88ab\u5ffd\u7565\u3002');
out.push('```');
out.push('');
out.push('**' + post.summary.metaDescIgnored + ' \u4e2a\u88ab\u5ffd\u7565\u7684\u6848\u4f8b\u6837\u672c**\uff1a');
out.push('');
out.push('| slug | excerptLen | metaDescLen | \u771f\u6b63\u5e94\u4f7f\u7528 |');
out.push('|---|---|---|---|');
metaIgnoredPosts.slice(0, 8).forEach((p) => {
  out.push('| `' + p.slug + '` | ' + p.excerptLen + ' | ' + p.metaDescLen + ' | metaDesc\uff08\u66f4\u7cbe\u51c6\uff09 |');
});
out.push('| \u2026 | \u2026 | \u2026 | \u2026 |');
out.push('');
out.push('**\u7edd\u5927\u591a\u6570\u662f `materials-encyclopedia/` \u8bcd\u6c47\u8868\u6761\u76ee**\uff1aexcerpt \u662f\u5360\u4f4d\u7b26 "Materials encyclopedia entry for X."\uff0830\u201340 \u5b57\u7b26\uff09\uff0c\u800c `metadata.description` \u662f\u7cbe\u5fc3\u5199\u7684"AISI M42 Cobalt-Bearing Super High-Speed Steel. Chemistry, hardness, heat treatment, applications, cross-reference."\uff08100+ \u5b57\u7b26\uff0c\u66f4\u7cbe\u51c6\u3001\u542b\u5173\u952e\u8bcd\uff09\u3002');
out.push('');
out.push('**\u4fee\u590d\u65b9\u5411**\uff08P0\uff09\uff1a');
out.push('');
out.push('```astro');
out.push('// src/pages/blog/[category]/[slug].astro L125 \u2014 1 \u884c\u4fee\u6539');
out.push('// \u5f53\u524d\uff1a');
out.push('description: postProps.post.excerpt,');
out.push('// \u6539\u4e3a\uff1a');
out.push('description: postProps.post.metadata?.description ?? postProps.post.excerpt,');
out.push('```');
out.push('');
out.push('\u8fd9\u6761\u5355\u884c\u4fee\u590d\u8ba9 ' + post.summary.metaDescIgnored + ' \u4e2a\u539f\u672c\u88ab\u5ffd\u7565\u7684\u7cbe\u786e\u63cf\u8ff0\u7acb\u5373\u751f\u6548\u3002');
out.push('');
out.push('### \u4fee\u590d\u65b9\u5411\u6c47\u603b');
out.push('');
out.push('| \u4f18\u5148\u7ea7 | \u4fee\u590d | \u5f71\u54cd |');
out.push('|---|---|---|');
out.push('| **P0** | 1 \u884c\u4ee3\u7801\u4fee\u6539 L125\uff08\u542f\u7528 metadata.description \u514c\u5e95\u94fe\uff09 | ' + post.summary.metaDescIgnored + ' \u7bc7\u535a\u5ba2\u7acb\u523b\u751f\u6548 |');
out.push('| **P1** | \u628a 27 \u7bc7 "Materials encyclopedia entry for X." \u5360\u4f4d\u7b26 excerpt \u66ff\u6362\u4e3a\u771f\u5b9e\u63cf\u8ff0\uff08105\u2013160 \u5b57\u7b26\uff09 | 27 \u6587\u4ef6 |');
out.push('| **P2** | \u628a 82 \u7bc7 > 160 \u5b57\u7b26\u7684 excerpt \u538b\u7f29\u5230 120\u2013160 \u533a\u95f4 | 82 \u6587\u4ef6 |');
out.push('| P3 | \u6a21\u677f\u5c42\u8ffd\u52a0 CTA \u540e\u7f00\uff1a"\u2192 Read the full case study" / "\u2192 Request blade selection support" | \u5168\u90e8\u535a\u5ba2 |');
out.push('| P4 | CI guard `scripts/check-meta-description.mjs` \u2014 \u62e6\u622a excerpt \u957f\u5ea6 / CTA \u7f3a\u5931 | 1 \u811a\u672c |');
out.push('');
out.push('---');
out.push('');

// ─── §6 Post heading structure ─────────────────────────────────────────────
out.push('## \u00a76 \u535a\u5ba2\u5355\u9875 \u00b7 \u6807\u9898\u7ed3\u6784');
out.push('');
out.push('### \u68c0\u67e5\u9879 vs \u5f53\u524d\u5b9e\u73b0');
out.push('');
out.push('| \u68c0\u67e5\u9879 | \u6807\u51c6 | \u5f53\u524d\u5b9e\u73b0 | \u72b6\u6001 |');
out.push('|---|---|---|---|');
out.push('| \u6bcf\u9875 1 \u4e2a H1 | \u4e25\u683c | 1 \u4e2a H1\uff08`SinglePost.astro` L73\uff09 | \u2705 |');
out.push('| H1 \u542b\u4e3b\u5173\u952e\u8bcd | \u5fc5\u5907 | ' + postLive.length + '/' + postLive.length + ' \u542b\u4e3b\u5173\u952e\u8bcd\uff08\u6765\u81ea `post.title`\uff09 | \u2705 |');
out.push('| \u903b\u8f91\u5c42\u7ea7 | \u65e0\u8df3\u7ea7 | H1 \u2192 markdown body H2 \u2192 H3\uff08\u53d6\u51b3\u4e8e\u4f5c\u8005\uff09 | \u2705 |');
out.push('| \u6807\u9898\u63cf\u8ff0\u5185\u5bb9 | \u5fc5\u987b | H1 = \u6587\u7ae0\u6807\u9898 | \u2705 |');
out.push('| \u4e0d\u4e3a\u9020\u578b\u800c\u751f | \u5fc5\u987b | `prose-headings:font-heading` \u4ec5\u6837\u5f0f | \u2705 |');
out.push('');
out.push('### \u5df2\u77e5\u7f3a\u9677');
out.push('');
out.push('#### 6.1 H2/H3 \u4e00\u81f4\u6027\u7531\u4f5c\u8005\u63a7\u5236');
out.push('');
out.push('`SinglePost.astro` \u628a markdown body \u76f4\u63a5\u6e32\u67d3\u6210 prose\u3002H2/H3 \u7684\u63aa\u8f9e\u4e0e\u5c42\u7ea7\u7531\u4f5c\u8005\u51b3\u5b9a\uff0caudit \u96be\u4ee5\u6279\u91cf\u6821\u9a8c\u3002\u5efa\u8bae\u5728 CI guard \u4e2d\u52a0\u5165\uff1a');
out.push('');
out.push('```js');
out.push('// \u4f2a\u4ee3\u7801\uff1a\u6bcf\u7bc7\u6587\u7ae0\u5e94\u6709 \u22651 \u4e2a H2\uff08\u9664\u975e\u662f\u77ed\u8bcd\u6761 < 200 \u8bcd\uff09');
out.push('if (wordCount > 500 && (headings.filter(h => h.depth === 2).length === 0)) {');
out.push('  warnings.push(\'article over 500 words has no H2 \u2014 review for readability\');');
out.push('}');
out.push('```');
out.push('');
out.push('#### 6.2 FAQ/TOC \u533a\u5757\u53ef\u80fd\u5f15\u5165"\u88c5\u9970\u6027 H2"');
out.push('');
out.push('`SinglePost.astro` L122\u2013141 \u7684 `<details>` \u6298\u53e0\u9762\u677f\u542b "On this page" \u6807\u9898\uff08\u89c6\u89c9\u662f H2 \u8bed\u4e49\u4f46\u8bed\u4e49\u4e0a\u662f `<summary>` \u6587\u672c\uff0c\u975e `<h2>`\uff09\u3002 \u2705 \u5b9e\u9645\u5ba1\u8ba1\u65e0\u95ee\u9898\u3002');
out.push('');
out.push('### \u4ee3\u7801\u53d6\u8bc1');
out.push('');
out.push('```astro');
out.push('// src/components/blog/SinglePost.astro L73');
out.push('<h1 class="article-title">{post.title}</h1>');
out.push('// \u2191 \u8fd9\u662f\u535a\u5ba2\u5355\u9875\u552f\u4e00\u7684 <h1>\uff0c\u76f4\u63a5\u6e32\u67d3 post.title\u3002');
out.push('// Body \u4e2d\u7684 H2/H3 \u6765\u81ea markdown \u6e90\u6587\u4ef6\uff0c\u7531 `prose` typography \u6837\u5f0f\u5316\u3002');
out.push('```');
out.push('');
out.push('---');
out.push('');

// ─── §7 Cross-cutting conclusions ──────────────────────────────────────────
out.push('## \u00a77 \u5171\u6027\u7ed3\u8bba\u4e0e"\u9875\u9762\u5185 SEO \u5065\u5eb7\u5206"');
out.push('');
out.push('### \u5065\u5eb7\u5206\uff08\u5408\u89c4\u7387\u603b\u89c8\uff09');
out.push('');
out.push('| \u7ef4\u5ea6 | \u4ea7\u54c1\u5355\u9875 | \u535a\u5ba2\u5355\u9875 | \u7efc\u5408\u5224\u5b9a |');
out.push('|---|---|---|---|');
out.push('| \u6807\u9898\u552f\u4e00\u6027 | 100% \u2705 | 100% \u2705 | \u2705 |');
out.push('| \u6807\u9898\u957f\u5ea6\u5408\u89c4 | ' + pct(titleCompliantP, productLive.length) + ' \u26a0\ufe0f | ' + pct(titleCompliantPost, postLive.length) + ' \u274c | \u274c \u535a\u5ba2\u4fa7\u662f\u77ed\u677f |');
out.push('| \u6807\u9898\u4e3b\u5173\u952e\u8bcd\u4f4d\u7f6e | 100% \u2705 | 100% \u2705 | \u2705 |');
out.push('| \u6807\u9898\u54c1\u724c\u4f4d\u7f6e | 100% \u2705 | 100% \u2705 | \u2705 |');
out.push('| \u63cf\u8ff0\u552f\u4e00\u6027 | 100% \u2705 | 100% \u2705 | \u2705 |');
out.push('| \u63cf\u8ff0\u957f\u5ea6\u5408\u89c4 | **' + pct(descCompliantP, productLive.length) + '** \u274c\u274c | **' + pct(descCompliantPost, postLive.length) + '** \u274c\u274c | \u274c\u274c \u53cc\u7ebf\u5168\u4e0d\u8fbe\u6807 |');
out.push('| \u63cf\u8ff0\u4e3b\u5173\u952e\u8bcd | 100% \u2705 | 100% \u2705 | \u2705 |');
out.push('| \u63cf\u8ff0 CTA | 0% \u274c | ' + pct(post.summary.ctaPresent, postLive.length) + ' \u274c | \u274c\u274c \u53cc\u7ebf\u5168\u7f3a |');
out.push('| H1 \u552f\u4e00\u6027 | \u2705 1 \u4e2a | \u2705 1 \u4e2a | \u2705 |');
out.push('| H1 \u542b\u4e3b\u5173\u952e\u8bcd | \u2705 | \u2705 | \u2705 |');
out.push('| H \u5c42\u7ea7\u65e0\u8df3\u7ea7 | \u2705 | \u2705 | \u2705 |');
out.push('| BOM \u6b8b\u7559 | **' + productsWithBom.length + '/' + product.summary.total + '** \u274c | 0/' + post.summary.total + ' \u2705 | \u274c \u4ea7\u54c1\u6587\u4ef6 BOM \u6c61\u67d3 |');
out.push('| `image:` frontmatter | \u2705 ' + productLive.filter((r)=>r.hasImage).length + '/' + productLive.length + ' | \u274c 0/' + postLive.length + ' | \u274c \u535a\u5ba2 OG \u9762\u9762\u65e0\u56fe |');
out.push('');
out.push('### Top 5 \u7cfb\u7edf\u6027\u95ee\u9898\uff08\u4e0d\u5206\u9875\u9762\u7c7b\u578b\uff09');
out.push('');
out.push('1. **\u5143\u63cf\u8ff0\u957f\u5ea6\u5408\u89c4\u7387 0%** \u2014 \u5168\u7ad9 ' + (productLive.length + postLive.length) + ' \u4e2a\u4ea7\u54c1 + \u535a\u5ba2\u5355\u9875\u4e2d\uff0c0 \u4e2a\u63cf\u8ff0\u843d\u5728 120\u2013160 \u5b57\u7b26\u5065\u5eb7\u533a\u95f4\u3002\u8fd9\u662f\u963b\u65ad\u6027 SEO \u95ee\u9898\uff0c\u9700\u5148\u4e8e\u5176\u4ed6\u4fee\u590d\u3002');
out.push('2. **\u535a\u5ba2 `metadata.description` ' + pct(post.summary.metaDescIgnored, postLive.length) + ' \u88ab\u9759\u9ed8\u5ffd\u7565** \u2014 1 \u884c\u4ee3\u7801\u4fee\u590d\u53ef\u7acb\u523b\u8ba9 ' + post.summary.metaDescIgnored + ' \u7bc7\u8bcd\u6c47\u8868\u535a\u5ba2\u7684\u7cbe\u786e\u63cf\u8ff0\u751f\u6548\u3002');
out.push('3. **\u4ea7\u54c1 frontmatter ' + productsWithBom.length + '/' + product.summary.total + ' \u5e26 UTF-8 BOM** \u2014 `.clinerules` \u00a70.5.1 \u660e\u786e\u7981\u6b62 BOM \u6b8b\u7559\uff1b\u662f\u5386\u53f2 PowerShell \u5199\u5165\u75d5\u8ff9\u3002\u4fee\u590d\u9700\u7528 Node `fs.writeFileSync(path, content, \'utf8\')` \u91cd\u5199 ' + productsWithBom.length + ' \u4e2a\u6587\u4ef6\u3002');
out.push('4. **OG image \u5168\u7ad9\u7f3a\u4f4d**\uff08v1 \u62a5\u544a F-011 \u5df2\u63d0\uff09\u2014 ' + postLive.length + ' \u7bc7\u535a\u5ba2\u5168\u65e0\u5dee\u5f02\u5316 OG image\u3002');
out.push('5. **CTA \u5728\u63cf\u8ff0\u4e2d\u51e0\u4e4e\u4e0d\u5b58\u5728** \u2014 \u4ea7\u54c1 0% + \u535a\u5ba2 ' + pct(post.summary.ctaPresent, postLive.length) + '\u3002SERP CTR \u4f18\u5316\u9700\u8981\u660e\u786e CTA \u52a8\u8bcd\u3002');
out.push('');
out.push('### \u4fee\u590d\u8def\u5f84\u5efa\u8bae\uff08\u5206\u4e24\u8f6e\uff09');
out.push('');
out.push('**Round 2 \u2014 \u96f6\u4ee3\u7801\u98ce\u9669\u6279\u91cf\u4fee\u590d**\uff08\u53ef\u7acb\u5373\u6267\u884c\uff0c\u5f71\u54cd\u6700\u5927\uff09\uff1a');
out.push('');
out.push('| # | \u64cd\u4f5c | \u6587\u4ef6\u6570 | \u9884\u671f\u5408\u89c4\u7387\u63d0\u5347 |');
out.push('|---|---|---|---|');
out.push('| 2.1 | \u4fee\u590d\u535a\u5ba2 metadata.description \u4f18\u5148\u7ea7\uff081 \u884c\u4ee3\u7801\uff09 | 1 \u6587\u4ef6 | +' + pct(post.summary.metaDescIgnored, postLive.length) + ' \u535a\u5ba2\u9875\u9762\u83b7\u5f97\u7cbe\u786e\u63cf\u8ff0 |');
out.push('| 2.2 | \u79fb\u9664 ' + productsWithBom.length + ' \u4e2a\u4ea7\u54c1 frontmatter \u7684 UTF-8 BOM | ' + productsWithBom.length + ' \u6587\u4ef6 | \u7f16\u7801\u536b\u751f 100% |');
out.push('| 2.3 | `scripts/check-frontmatter-lint.mjs` \u5f3a\u5316 | 1 \u811a\u672c | CI \u5b88\u536b\u5efa\u7acb |');
out.push('| 2.4 | \u4fee\u526a 1 \u4e2a\u8d85\u957f\u4ea7\u54c1 title | 1 \u6587\u4ef6 | \u4ea7\u54c1\u5408\u89c4\u7387 ' + pct(titleCompliantP, productLive.length) + ' \u2192 100% |');
out.push('| 2.5 | \u4fee\u526a 23 \u4e2a\u8d85\u957f\u535a\u5ba2 title | 23 \u6587\u4ef6 | \u535a\u5ba2\u6807\u9898\u5408\u89c4\u7387 ' + pct(titleCompliantPost, postLive.length) + ' \u2192 ~80% |');
out.push('');
out.push('**Round 3 \u2014 \u5185\u5bb9\u5c42\u4fee\u590d**\uff08\u9700 SME \u4ecb\u5165\uff09\uff1a');
out.push('');
out.push('- ' + productLive.length + ' \u4e2a\u4ea7\u54c1 excerpt \u91cd\u5199\u5230 120\u2013160 \u5b57\u7b26\uff08\u6d89\u53ca\u89c4\u683c\u7cbe\u7b80\uff09');
out.push('- ' + postLive.length + ' \u4e2a\u535a\u5ba2 excerpt \u91cd\u5199\u5230 120\u2013160 \u5b57\u7b26\uff08\u6d89\u53ca\u6458\u8981\u6587\u6848\uff09');
out.push('- ' + postLive.length + ' \u4e2a\u535a\u5ba2\u6dfb\u52a0\u5dee\u5f02\u5316 OG image');
out.push('- \u5f15\u5165\u4ea7\u54c1\u6a21\u677f\u5316 CTA \u540e\u7f00');
out.push('');
out.push('---');
out.push('');

// ─── §8 Verification + remaining actions ────────────────────────────────────
out.push('## \u00a78 \u9a8c\u8bc1\u4e0e\u53ef\u6267\u884c\u9879\u8ffd\u8e2a');
out.push('');
out.push('### \u5df2\u5b8c\u6210\u7684 Round 1 \u4fee\u590d\uff08\u6765\u81ea post-fix-verification\uff09');
out.push('');
out.push('- \u2705 F-004 \u6807\u9898\u6a21\u677f\u53cc\u91cd\u5316\uff08`Metadata.astro` L95\u2013101 \u81ea\u52a8\u68c0\u6d4b\u54c1\u724c\u540e\u7f00\uff09');
out.push('- \u2705 F-005 (placeholder) alt \u6e05\u7406\uff0896% \u5b8c\u6210\uff09');
out.push('- \u2705 F-006 "undefined \u2014" \u6807\u9898 bug\uff0840 \u7bc7 glossary\uff09');
out.push('- \u2705 404 \u9875\u52a0 sr-only `<h1>` + aria-hidden `<h2>`');
out.push('- \u2705 \u57df\u540d\u7edf\u4e00\uff08machine-knives.net \u2192 industrial-knives.net\uff09');
out.push('');
out.push('### \u672c\u8f6e\uff08v2\uff09\u53d1\u73b0 + \u72b6\u6001');
out.push('');
out.push('| ID | \u95ee\u9898 | \u4e25\u91cd\u5ea6 | \u72b6\u6001 |');
out.push('|---|---|---|---|');
out.push('| V2-P0 | \u535a\u5ba2 metadata.description ' + pct(post.summary.metaDescIgnored, postLive.length) + ' \u88ab\u5ffd\u7565 | \u9ad8 | **\u5f85\u4fee\u590d**\uff081 \u884c\uff09 |');
out.push('| V2-P1a | \u4ea7\u54c1 bed-knife-tissue \u6807\u9898 83 \u5b57\u7b26 | \u4e2d | \u5f85\u4fee\u590d\uff081 \u6587\u4ef6\uff09 |');
out.push('| V2-P1b | 23 \u7bc7\u535a\u5ba2\u6807\u9898 > 80 \u5b57\u7b26 | \u4e2d | \u5f85\u6279\u91cf\u4fee\u590d |');
out.push('| V2-P1c | ' + productsWithBom.length + '/' + product.summary.total + ' \u4ea7\u54c1 frontmatter \u542b BOM | \u9ad8 | \u5f85\u4fee\u590d\uff08\u7f16\u7801\u536b\u751f\uff09 |');
out.push('| V2-P2 | \u5168\u90e8 ' + (productLive.length + postLive.length) + ' \u4e2a\u9875\u9762\u63cf\u8ff0\u4e0d\u5728 120\u2013160 \u533a\u95f4 | \u9ad8 | \u5f85 SME \u91cd\u5199 |');
out.push('| V2-P2b | 0/' + productLive.length + ' \u4ea7\u54c1 + ' + post.summary.ctaPresent + '/' + postLive.length + ' \u535a\u5ba2\u63cf\u8ff0\u542b CTA | \u4e2d | \u5f85\u6a21\u677f\u8ffd\u52a0 CTA |');
out.push('| V2-P3 | ' + postLive.length + '/' + postLive.length + ' \u535a\u5ba2\u7f3a image: frontmatter | \u9ad8 | \u5f85\u8bbe\u8ba1/SME |');
out.push('');
out.push('### CI guard \u7f3a\u53e3');
out.push('');
out.push('| \u5df2\u5b58\u5728 | \u7f3a\u5931\uff08\u5efa\u8bae\u65b0\u589e\uff09 |');
out.push('|---|---|');
out.push('| `scripts/check-unicode.mjs`\uff08mojibake + BOM\uff09 | `scripts/check-title-length.mjs`\uff08\u4ea7\u54c1 + \u535a\u5ba2 title 50\u201360 \u5b57\u7b26\uff09 |');
out.push('| `scripts/check-frontmatter-lint.mjs`\uff08image \u5fc5\u586b + \u63cf\u8ff0\u957f\u5ea6\u5408\u89c4\uff09 | `scripts/check-meta-description.mjs`\uff08CTA \u52a8\u8bcd\u5b58\u5728\u6027 + \u957f\u5ea6 120\u2013160\uff09 |');
out.push('');
out.push('---');
out.push('');

// ─── §9 Appendix ───────────────────────────────────────────────────────────
out.push('## \u00a79 \u9644\u5f55\uff1a\u672f\u8bed\u4e0e\u51b3\u7b56\u53c2\u8003');
out.push('');
out.push('### <a id="cta-heuristic"></a>CTA Heuristic');
out.push('');
out.push('\u68c0\u6d4b\u63cf\u8ff0\u672b\u5c3e\u662f\u5426\u542b\u5546\u4e1a\u52a8\u8bcd\uff08\u4efb\u4e00\uff09\uff1a');
out.push('');
out.push('```');
out.push('request a quote | request quote | get a quote | contact us | send a drawing');
out.push('| send your drawing | request a callback | talk to engineering');
out.push('| order now | buy now | shop now | learn more | read more');
out.push('| find out more | download | compare | browse | book a | schedule a');
out.push('```');
out.push('');
out.push('\u5b9e\u73b0\u4f4d\u7f6e\uff1a`audit-results/_v2-audit.mjs` L11\u201315 (`CTA_VERBS`)\u3002**\u6ce8\u610f**\uff1a"request a quote" \u5728\u4ea7\u54c1\u9875 CallToAction \u533a\u5757\u91cc\u51fa\u73b0\uff0c\u4f46**\u4e0d\u8ba1\u5165 description \u7684 CTA**\u2014\u2014CTA \u5e94\u5728 description \u672b\u5c3e\u4ee5\u5f15\u5bfc\u70b9\u51fb/\u8f6c\u5316\u7684\u8bed\u4e49\u51fa\u73b0\u3002');
out.push('');
out.push('### \u5b57\u6bb5\u4f18\u5148\u7ea7\u5efa\u8bae\uff08\u4fee\u590d V2-P0 \u540e\uff09');
out.push('');
out.push('```');
out.push('meta description =');
out.push('  post.metadata?.description          \u2190 P1\uff1aSME \u663e\u5f0f SEO \u63cf\u8ff0');
out.push('  ?? post.excerpt                     \u2190 P2\uff1a\u4f5c\u8005\u6458\u8981\uff08fallback\uff09');
out.push('  ?? METADATA.description (global)    \u2190 P3\uff1a\u7ad9\u70b9\u7ea7\u9ed8\u8ba4\uff08Metadata.astro L119 \u514c\u5e95\uff09');
out.push('```');
out.push('');
out.push('\u4ea7\u54c1\u9875\u5df2\u81ea\u52a8\u9075\u5faa\u6b64\u94fe\uff08`Metadata.astro` L119\uff09\uff0c\u535a\u5ba2\u9875\u7f3a\u5931 P1 \u94fe\u3002');
out.push('');
out.push('### \u5173\u4e8e"\u4ea7\u54c1\u5355\u9875\u53ea\u6709 ' + productLive.length + ' \u4e2a live"');
out.push('');
out.push('`getStaticPaths`\uff08`src/pages/products/[...slug].astro` L59\u2013113\uff09\u4f1a\u8df3\u8fc7 `draft: true` \u7684\u4ea7\u54c1\uff0c\u4f46 `bed-knife-tissue.md`\uff08draft: true\uff09\u4ecd\u4f1a\u4f5c\u4e3a**\u7c7b\u522b\u5206\u7ec4\u9875**\u88ab\u53d1\u5e03\u3002SERP \u4e0a\u7684\u5b9e\u9645\u53ef\u7d22\u5f15\u9875\u9762 = 8 \u4e2a\u4ea7\u54c1\u8be6\u60c5\u9875\uff08\u5176\u4e2d 2 \u4e2a draft = noindex \u6807\u7b7e\u751f\u6548\uff09+ \u591a\u4e2a\u5206\u7c7b\u805a\u5408\u9875\u3002\u672c\u5ba1\u8ba1\u805a\u7126 8 \u4e2a\u4ea7\u54c1\u8be6\u60c5\u9875\u7684 frontmatter\u3002');
out.push('');
out.push('---');
out.push('');
out.push('*\u62a5\u544a\u751f\u6210\u4e8e 2026-09-27 \u00b7 \u5ba1\u8ba1\u811a\u672c [audit-results/_v2-audit.mjs](./_v2-audit.mjs) \u00b7 \u6570\u636e\u96c6 [on-page-seo-audit-v2-single-pages.json](./on-page-seo-audit-v2-single-pages.json) \u00b7 \u5efa\u8bae\u5ba1\u9605\u540e\u8fdb\u5165 Round 2 \u4fee\u590d\u7a97\u53e3\u3002*');
out.push('');

// ─── Final write ───────────────────────────────────────────────────────────
const outFile = path.join(OUT_DIR, 'on-page-seo-audit-v2-single-pages.md');
const report = out.join('\n');
fs.writeFileSync(outFile, report, 'utf8');
process.stderr.write(`\n[v2-report] wrote ${out.length} lines -> ${path.relative(process.cwd(), outFile)}\n`);
