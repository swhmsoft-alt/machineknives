// Standalone test harness — verifies scripts/postbuild.js regex against a
// battery of edge cases. Not part of the production build pipeline.
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';

const CASES = [
  ['/about',           '/about/'],          // bare path -> trailing slash
  ['/about/',           '/about/'],          // already slashed -> unchanged (idempotent)
  ['/blog/post',        '/blog/post/'],      // multi-level
  ['/blog/post/',       '/blog/post/'],      // already slashed multi-level
  ['/blog/post#a',      '/blog/post#a'],     // fragment, NO trailing slash before #
  ['/blog/post?q=1',    '/blog/post?q=1'],   // query, untouched
  ['/blog/post/#a',     '/blog/post/#a'],    // fragment + trailing slash
  ['/blog/post/?q=1',   '/blog/post/?q=1'],  // query + trailing slash
  ['/img.png',          '/img.png'],         // asset extension, untouched
  ['https://ext.com',   'https://ext.com'],  // external, untouched (no match)
  ['mailto:[email protected]', 'mailto:[email protected]'],   // protocol, untouched
  ['#anchor',           '#anchor'],          // anchor only, untouched
  ['/',                 '/'],                // root, already single slash
];

// Replicate the postbuild regex exactly
const LINK_RE = /href="(\/[^".#?]+?)\/?"/g;

let pass = 0;
let fail = 0;
for (const [inputPath, expected] of CASES) {
  const html = `<a href="${inputPath}">x</a>`;
  const out = html.replace(LINK_RE, (_m, p) => `href="${p}/"`);
  // We need to find the resulting href
  const m = out.match(/href="([^"]+)"/);
  const actual = m ? m[1] : null;
  const ok = actual === expected;
  console.log(`${ok ? 'PASS' : 'FAIL'}  in=${JSON.stringify(inputPath).padEnd(34)}  out=${JSON.stringify(actual).padEnd(36)}  expected=${JSON.stringify(expected)}`);
  if (ok) pass++;
  else fail++;
}

// Also verify: no double slash anywhere in any rendered HTML
const distFiles = execSync(process.platform === 'win32' ? 'dir /b /s dist\\*.html' : 'find dist -name "*.html"', { encoding: 'utf-8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((p) => p.replace(/^.*?dist[\\/]/, 'dist/').trim());

let dblSlash = 0;
for (const f of distFiles) {
  try {
    const txt = readFileSync(f, 'utf-8');
    const matches = txt.match(/href="[^"]*\/\/[^"]*"/g) || [];
    for (const m of matches) {
      // Allow https://, mailto://, etc. — exclude if preceded by protocol chars
      if (!/^\s*href="[a-z]+:\/\//.test(m)) {
        console.log(`DOUBLE-SLASH in ${f}: ${m}`);
        dblSlash++;
      }
    }
  } catch {}
}

console.log(`\n${pass} passed, ${fail} failed.  double-slash violations: ${dblSlash}`);
process.exit(fail === 0 && dblSlash === 0 ? 0 : 1);