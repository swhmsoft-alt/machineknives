// gen-gl-all.cjs — run all glossary data files in order
const g = require('./gen-glossary.cjs');
const path = require('path');
const fs = require('fs');

const outDir = './src/data/post';
const here = __dirname;

const dataFiles = [
  'data-gl-geom-a.cjs', 'data-gl-geom-b.cjs', 'data-gl-geom-c.cjs', 'data-gl-geom-d.cjs',
  'data-gl-fail-a.cjs', 'data-gl-fail-b.cjs', 'data-gl-fail-c.cjs',
];

let total = 0;
for (const f of dataFiles) {
  const p = path.join(here, f);
  if (!fs.existsSync(p)) {
    console.log('SKIP (missing): ' + f);
    continue;
  }
  const data = require(p);
  const n = g.run(data, outDir);
  total += n;
}
console.log('Total: ' + total + ' glossary entries written.');
