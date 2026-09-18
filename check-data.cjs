// check-data.cjs — verify each data file is loadable
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => /^data-.*\.cjs$/.test(f));
for (const f of files) {
  const p = path.join(__dirname, f);
  try {
    const d = require(p);
    console.log('OK  ' + f + '  entries=' + d.length);
  } catch (e) {
    console.log('ERR ' + f + '  ' + e.message);
  }
}
