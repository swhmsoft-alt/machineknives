#!/usr/bin/env node
// build-json-all.mjs — orchestrator. Run all 5 parts in order.
// Idempotent: clears the output file before re-running.
import { execFileSync } from 'node:child_process';
import { unlinkSync, existsSync } from 'node:fs';

const out = 'c:/Users/User/Desktop/machineknives/audit-results/on-page-seo-audit-v1.json';
if (existsSync(out)) unlinkSync(out);

const parts = [
  'build-json.mjs',
  'build-json-part2.mjs',
  'build-json-part3.mjs',
  'build-json-part4.mjs',
  'build-json-part5.mjs',
];

for (const p of parts) {
  console.log(`Running ${p}...`);
  execFileSync(process.execPath, [`c:/Users/User/Desktop/machineknives/audit-results/${p}`], { stdio: 'inherit' });
}
console.log('Done. Output:', out);