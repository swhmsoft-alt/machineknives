// gen-from-data.cjs — generic encyclopedia / glossary entry generator.
// Builds frontmatter + body from a JSON array of entry objects.
const fs = require('fs');
const path = require('path');

function esc(s) {
  return String(s).replace(/'/g, "\\'");
}

function buildEntry(e, opts) {
  const o = opts || {};
  const category = o.category || 'materials-encyclopedia';
  const type = o.type || 'glossary';
  const entityType = o.entityType || 'material';
  const canonical = o.canonicalBase || 'https://www.machine-knives.net/materials-encyclopedia/';
  const seeAlso = o.seeAlso || 'See also: [D2 vs SKD11 comparison](/d2-vs-skd11/), [Material Grade Converter](/material-grade-converter/), [The KAIPU 5-Factor Blade Selection Framework](/kaipu-5-factor-blade-selection-framework/).';
  const tags = o.tags || ['cold work tool steel', 'tool steel', 'industrial knife'];
  const tagYaml = tags.map(t => "  - '" + esc(t) + "'").join('\n');

  const excerpt = e.excerpt || 'Materials encyclopedia entry for ' + esc(e.tag) + '.';
  const title = esc(e.title);
  const description = esc(e.title + '. Chemistry, hardness, heat treatment, applications, cross-reference.');

  const lines = [];
  lines.push('---');
  lines.push("title: '" + title + "'");
  lines.push("excerpt: '" + excerpt + "'");
  lines.push("publishDate: 2026-09-18");
  lines.push("category: '" + category + "'");
  lines.push("type: '" + type + "'");
  lines.push("entityType: '" + entityType + "'");
  lines.push('tags:');
  lines.push("  - '" + esc(e.tag) + "'");
  lines.push(tagYaml);
  lines.push("author: 'KAIPU Engineering'");
  lines.push('metadata:');
  lines.push("  description: '" + description + "'");
  lines.push("  canonical: '" + canonical + e.slug + "/'");
  lines.push('---');
  lines.push('');
  lines.push(e.title + ' is a reference entry for industrial cutting tools and blades. The composition, hardness, heat treatment and application guidance are summarised below for engineering reference.');
  lines.push('');
  lines.push('**Standard composition:** ' + e.chem);
  lines.push('');
  lines.push('**Hardness:** ' + e.hardness);
  lines.push('');
  lines.push('**Heat treatment:** ' + e.heat);
  lines.push('');
  lines.push('**Properties:** ' + e.props);
  lines.push('');
  lines.push('**Applications:** ' + e.apps);
  lines.push('');
  if (e.xref) {
    lines.push('**Cross-reference:** ' + e.xref + '.');
    lines.push('');
  }
  lines.push('**' + seeAlso + '**');
  lines.push('');
  return lines.join('\n');
}

function run(entries, outDir, opts) {
  let count = 0;
  for (const e of entries) {
    const fname = (opts && opts.prefix ? opts.prefix : '') + e.slug + '.md';
    const target = path.join(outDir, fname);
    fs.writeFileSync(target, buildEntry(e, opts), 'utf8');
    count++;
  }
  console.log('Wrote ' + count + ' entries to ' + outDir);
  return count;
}

module.exports = { run, buildEntry };
