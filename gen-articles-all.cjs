// gen-articles-all.cjs — run all art-*.cjs files and generate the corresponding .md files
const fs = require('fs');
const path = require('path');

function esc(s) { return String(s).replace(/'/g, "\\'"); }

function buildArticle(e) {
  const tagYaml = (e.tags || []).map(t => "  - '" + esc(t) + "'").join('\n');
  const lines = [];
  lines.push('---');
  lines.push("title: '" + esc(e.title) + "'");
  lines.push("excerpt: '" + esc(e.excerpt) + "'");
  lines.push("publishDate: '2026-09-18'");
  lines.push("category: '" + e.category + "'");
  lines.push("type: 'article'");
  lines.push('tags:');
  lines.push(tagYaml);
  lines.push("author: 'KAIPU Engineering'");
  lines.push('metadata:');
  lines.push("  description: '" + esc(e.excerpt) + "'");
  lines.push("  canonical: 'https://www.machine-knives.net/" + e.slug + "/'");
  lines.push('---');
  lines.push('');
  lines.push(e.body);
  lines.push('');
  return lines.join('\n');
}

const outDir = './src/data/post';
const files = fs.readdirSync(__dirname).filter(f => /^art-.*\.cjs$/.test(f));
let count = 0;
for (const f of files) {
  const p = path.join(__dirname, f);
  const e = require(p);
  const target = path.join(outDir, e.slug + '.md');
  fs.writeFileSync(target, buildArticle(e), 'utf8');
  console.log('Wrote: ' + e.slug + '.md (' + Buffer.byteLength(buildArticle(e), 'utf8') + ' bytes)');
  count++;
}
console.log('Total: ' + count + ' articles written.');
