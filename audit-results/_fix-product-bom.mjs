// audit-results/_fix-product-bom.mjs
// Round 2 fix V2-P1c: strip UTF-8 BOM from product frontmatter files.
// Per .clinerules §0.5.1 — BOM is a Windows/PowerShell write artefact that
// must be removed. This script reads each file with BOM, strips it, and
// writes back with explicit 'utf8' encoding (no BOM).
//
// IMPORTANT: PowerShell redirection silently re-introduces BOM on zh-CN
// Windows. This script must be run via Node to ensure clean UTF-8 output.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PROD_DIR = 'src/data/product';
const files = readdirSync(PROD_DIR).filter((f) => f.endsWith('.md'));

let fixedCount = 0;
const report = [];

for (const f of files) {
  const full = join(PROD_DIR, f);
  const raw = readFileSync(full);
  if (!(raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf)) {
    report.push(`${f}: no BOM, skipped`);
    continue;
  }
  // Strip BOM.
  const clean = raw.slice(3);
  // Write back with explicit utf8 (no BOM added by Node fs.writeFileSync).
  writeFileSync(full, clean, 'utf8');
  // Verify.
  const recheck = readFileSync(full);
  if (recheck[0] === 0xef && recheck[1] === 0xbb && recheck[2] === 0xbf) {
    report.push(`${f}: ❌ BOM STILL PRESENT after write`);
  } else {
    report.push(`${f}: ✅ BOM removed (size ${raw.length} → ${recheck.length})`);
    fixedCount++;
  }
}

console.log(`files scanned: ${files.length}`);
console.log(`files fixed:   ${fixedCount}`);
console.log('');
for (const line of report) console.log(line);