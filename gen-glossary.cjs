// gen-glossary.cjs — generator for glossary / terminology entries
const fs = require('fs');
const path = require('path');

function esc(s) {
  return String(s).replace(/'/g, "\\'");
}

function buildEntry(e) {
  const lines = [];
  lines.push('---');
  lines.push("title: '" + esc(e.title) + " — Industry Glossary Entry'");
  lines.push("excerpt: '" + esc(e.excerpt) + "'");
  lines.push("publishDate: 2026-09-18");
  lines.push("category: 'glossary'");
  lines.push("type: 'glossary'");
  lines.push("entityType: 'term'");
  lines.push('tags:');
  lines.push("  - '" + esc(e.tag || e.slug) + "'");
  for (const t of (e.tags || [])) {
    lines.push("  - '" + esc(t) + "'");
  }
  lines.push("author: 'KAIPU Engineering'");
  lines.push('metadata:');
  lines.push("  description: '" + esc(e.excerpt) + "'");
  lines.push("  canonical: 'https://www.machine-knives.net/glossary/" + e.slug + "/'");
  lines.push('---');
  lines.push('');

  if (e.definition) {
    lines.push('**' + esc(e.title) + '** ' + e.definition);
    lines.push('');
  }

  for (const section of (e.sections || [])) {
    lines.push('## ' + section.heading);
    lines.push('');
    if (section.body) {
      lines.push(section.body);
      lines.push('');
    }
    if (section.table) {
      lines.push(section.table.header);
      for (const row of section.table.rows) {
        lines.push(row);
      }
      lines.push('');
    }
    if (section.list) {
      for (const item of section.list) {
        lines.push('- ' + item);
      }
      lines.push('');
    }
  }

  if (e.seeAlso) {
    lines.push('**See also:** ' + e.seeAlso);
    lines.push('');
  }

  return lines.join('\n');
}

function run(entries, outDir, opts) {
  const prefix = (opts && opts.prefix) || 'glossary-';
  let count = 0;
  for (const e of entries) {
    const target = path.join(outDir, prefix + e.slug + '.md');
    fs.writeFileSync(target, buildEntry(e), 'utf8');
    count++;
  }
  console.log('Wrote ' + count + ' glossary entries.');
  return count;
}

module.exports = { run, buildEntry };
