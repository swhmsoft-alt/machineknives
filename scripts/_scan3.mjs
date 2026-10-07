import { readFileSync } from 'node:fs';
const f = 'src/pages/index.astro';
const s = readFileSync(f, 'utf8');
const lines = s.split('\n');
lines.forEach((line, i) => {
  if (/industrial-knives/i.test(line)) {
    console.log(`${i + 1}: ${line.trim()}`);
  }
});
