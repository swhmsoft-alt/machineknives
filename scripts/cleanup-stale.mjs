// One-shot cleanup: stale lockfile + previous build artifacts. Idempotent.
import fs from 'node:fs';

const targets = ['pnpm-lock.yaml', 'node_modules', 'dist', '.astro'];
let removed = 0;
for (const t of targets) {
  try {
    const stat = fs.statSync(t);
    if (stat.isDirectory()) {
      fs.rmSync(t, { recursive: true, force: true });
    } else {
      fs.unlinkSync(t);
    }
    removed += 1;
    console.log(`[cleanup] removed ${t}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log(`[cleanup] ${t} not present, skipping`);
    } else {
      throw e;
    }
  }
}
console.log(`[cleanup] done. ${removed} item(s) removed.`);
