// Direct fix: remove broken sharp + its @img platform binary, then reinstall
// with --include=optional so the win32-x64 native binding is properly extracted.
// Root cause: @img/sharp-win32-x64 exists without a package.json, which breaks
// sharp's runtime resolution path. A clean reinstall of sharp forces npm to
// re-run sharp's install hook (which is what copies/links the native binding).
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const targets = [
  'node_modules/@img/sharp-win32-x64',
  'node_modules/@img/sharp-libvips-win32-x64',
  'node_modules/sharp',
];

for (const t of targets) {
  try {
    fs.rmSync(t, { recursive: true, force: true });
    console.log(`[fix-sharp] removed ${t}`);
  } catch (e) {
    if (e.code === 'ENOENT') console.log(`[fix-sharp] ${t} not present`);
    else throw e;
  }
}

console.log('[fix-sharp] reinstalling sharp with optional deps...');
execSync('npm install --include=optional sharp --no-audit --no-fund', {
  stdio: 'inherit',
});

console.log('[fix-sharp] done');
