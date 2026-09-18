// gen-gl-coat.cjs — run the coating glossary files
const g = require('./gen-glossary.cjs');
const path = require('path');
const fs = require('fs');
const outDir = './src/data/post';
const here = __dirname;
let total = 0;
for (const f of ['data-gl-coat-a.cjs', 'data-gl-coat-b.cjs']) {
  const p = path.join(here, f);
  if (!fs.existsSync(p)) continue;
  const data = require(p);
  total += g.run(data, outDir);
}
console.log('Coating entries: ' + total);
