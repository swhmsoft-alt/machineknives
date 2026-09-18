// Quick check: dump line 3 as bytes to see what the actual chars are
const fs = require('fs');
const code = fs.readFileSync('./data-gl-fail-a.cjs', 'utf8');
const lines = code.split('\n');
const l3 = lines[2];

// Find all '[' and ']' that are NOT inside a string by tracking quote state
let inString = false;
let quote = '';
let depth = { brace: 0, bracket: 0 };
let result = [];

for (let i = 0; i < l3.length; i++) {
  const c = l3[i];
  if (inString) {
    if (c === quote && l3[i-1] !== '\\') {
      inString = false;
      quote = '';
    }
    continue;
  }
  if (c === "'" || c === '"') {
    inString = true;
    quote = c;
    continue;
  }
  if (c === '[') depth.bracket++;
  if (c === ']') {
    depth.bracket--;
    result.push({ pos: i, depth: depth.bracket, context: l3.substring(Math.max(0,i-20), i+1) });
  }
}

console.log('Bracket state at end:', depth);
result.forEach(r => console.log('] at', r.pos, 'depth=' + r.depth, ':', JSON.stringify(r.context)));
