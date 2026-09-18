// fix-fail-a.cjs — fix the syntax error in data-gl-fail-a.cjs:
// Replace `hone)']]},{heading:'Fixes'` (extra `]`) with `hone)']},{heading:'Fixes'`
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'data-gl-fail-a.cjs');
let s = fs.readFileSync(target, 'utf8');
const bad = "hone)']]},{heading:'Fixes'";
const good = "hone)']},{heading:'Fixes'";
if (s.indexOf(bad) >= 0) {
  s = s.replace(bad, good);
  fs.writeFileSync(target, s, 'utf8');
  console.log('Fixed: removed extra ]');
} else {
  console.log('Pattern not found, file may already be fixed');
}
