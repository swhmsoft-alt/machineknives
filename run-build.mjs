import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';

const require = createRequire(import.meta.url);
const ROOT = 'C:/Users/User/Desktop/machineknives';

// Resolve astro CLI via local node_modules (avoids needing npx shell on Windows).
const astroCli = 'C:/Users/User/Desktop/machineknives/node_modules/astro/bin/astro.mjs';
const nodeExec = process.execPath;

const steps = [
  ['prebuild-images', [nodeExec, ['scripts/prebuild-images.mjs']]],
  ['astro-build', [nodeExec, [astroCli, 'build']]],
  ['postbuild', [nodeExec, ['scripts/postbuild.js']]],
  ['audit-schema', [nodeExec, ['scripts/audit-schema-strict.mjs']]],
  ['check-unicode', [nodeExec, ['scripts/check-unicode.mjs']]],
];

let overallExit = 0;
for (const [name, [cmd, args]] of steps) {
  console.log(`\n========== ${name} ==========`);
  const exit = await new Promise((resolve) => {
    const proc = spawn(cmd, args, {
      cwd: ROOT,
      stdio: 'inherit',
    });
    proc.on('exit', (code) => resolve(code ?? 0));
    proc.on('error', (err) => { console.error('spawn error:', err); resolve(1); });
  });
  console.log(`[${name}] exit=${exit}`);
  if (exit !== 0) {
    overallExit = exit;
    console.log(`FAILED at ${name}, aborting.`);
    break;
  }
}
process.exit(overallExit);