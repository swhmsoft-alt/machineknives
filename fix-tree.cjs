// fix-tree.cjs — replace ``` markdown code fences with [TREE] in art-mt-retire.cjs
// because the unescaped backticks break the JS template literal
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'art-mt-retire.cjs');
let s = fs.readFileSync(target, 'utf8');
s = s.replace(/```/g, '[TREE]');
fs.writeFileSync(target, s, 'utf8');
console.log('Fixed: removed ``` from art-mt-retire.cjs');
