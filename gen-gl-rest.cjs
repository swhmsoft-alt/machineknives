// gen-gl-rest.cjs — run the rest of the glossary data files
const g = require('./gen-glossary.cjs');
const path = require('path');
const fs = require('fs');
const outDir = './src/data/post';
const here = __dirname;

const dataFiles = [
  'data-gl-proc-a.cjs', 'data-gl-proc-b.cjs',
];

let total = 0;
for (const f of dataFiles) {
  const p = path.join(here, f);
  if (!fs.existsSync(p)) { console.log('SKIP (missing): ' + f); continue; }
  const data = require(p);
  const n = g.run(data, outDir);
  total += n;
}
console.log('Total this run: ' + total);
