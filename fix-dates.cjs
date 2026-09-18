// fix-dates.cjs — change publishDate from '2026-09-18' (string) to 2026-09-18 (date) in all generated .md files
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src/data/post');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
let count = 0;
for (const f of files) {
  const p = path.join(dir, f);
  const s = fs.readFileSync(p, 'utf8');
  if (s.indexOf("publishDate: '2026-09-18'") >= 0) {
    const newS = s.replace(/publishDate: '(\d{4}-\d{2}-\d{2})'/g, 'publishDate: $1');
    fs.writeFileSync(p, newS, 'utf8');
    count++;
  }
}
console.log('Fixed publishDate in ' + count + ' files');
