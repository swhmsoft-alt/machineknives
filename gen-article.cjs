// gen-article.cjs — generator for long-form blog article entries.
// Each entry has title, excerpt, tags, body (string). The body is the full
// markdown content of the article.
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

function run(entries, outDir) {
  let count = 0;
  for (const e of entries) {
    const target = path.join(outDir, e.slug + '.md');
    fs.writeFileSync(target, buildArticle(e), 'utf8');
    count++;
  }
  console.log('Wrote ' + count + ' article entries.');
  return count;
}

module.exports = { run, buildArticle };
