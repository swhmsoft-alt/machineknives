// Idempotent CRLF -> LF normalizer for a single file
import { readFileSync, writeFileSync } from 'node:fs';
const target = process.argv[2];
if (!target) {
  console.error('Usage: node _normalize-lf.mjs <file>');
  process.exit(1);
}
const before = readFileSync(target);
const crlfCount = (before.toString('binary').match(/\r\n/g) || []).length;
const text = before.toString('utf8').replace(/\r\n/g, '\n');
const after = Buffer.from(text, 'utf8');
writeFileSync(target, after);
const verify = readFileSync(target);
const verifyCrlf = (verify.toString('binary').match(/\r\n/g) || []).length;
const verifyLf = (verify.toString('binary').match(/\n/g) || []).length;
console.log(`File: ${target}`);
console.log(`Before: ${crlfCount} CRLF, ${before.length} bytes`);
console.log(`After : ${verifyCrlf} CRLF, ${verifyLf} LF, ${verify.length} bytes`);
console.log(`Delta : ${after.length - before.length} bytes`);
