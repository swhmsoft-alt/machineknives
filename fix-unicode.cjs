// fix-unicode.cjs — replace characters that got mangled to GBK mojibake
// when the editor tool wrote data files through PowerShell.
const fs = require('fs');
const path = require('path');

const fixes = [
  // en-dash mojibake (GBK 鈥?) -> proper en-dash
  [/鈥\?/g, '–'],
  // micro sign mojibake (GBK 碌) -> proper mu
  [/碌/g, 'µ'],
  // multiplication sign mojibake (GBK 脳) -> proper ×
  [/脳/g, '×'],
  // another common mojibake
  [/鈥/g, '—'],
];

const dir = path.join(__dirname, 'data-gl-*.cjs');
const files = fs.readdirSync(__dirname).filter(f => /^data-gl-.*\.cjs$/.test(f) || /^data-enc-.*\.cjs$/.test(f));
let count = 0;
for (const f of files) {
  const p = path.join(__dirname, f);
  const orig = fs.readFileSync(p, 'utf8');
  let s = orig;
  for (const [re, rep] of fixes) s = s.replace(re, rep);
  if (s !== orig) {
    fs.writeFileSync(p, s, 'utf8');
    count++;
    console.log('Fixed: ' + f);
  }
}
console.log('Total fixed: ' + count);
