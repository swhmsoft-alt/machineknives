import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = process.cwd();
const FROM = 'https://www.custommachineknives.com';
const TO = 'https://custommachineknives.com';

const SCAN_DIRS = ['src', 'public'];
const SCAN_FILES = ['scripts/build-okf.mjs'];
const SCAN_EXTS = new Set(['.astro', '.ts', '.md', '.mdx', '.yaml', '.txt', '.html']);
const SKIP_DIRS = new Set(['node_modules', '.astro', 'dist']);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(full);
    } else if (entry.isFile() && SCAN_EXTS.has(extname(entry.name).toLowerCase())) {
      yield full;
    }
  }
}

let changedFiles = 0;
let totalReplacements = 0;
let skipped = 0;
let errors = 0;
const touched = [];

const candidates = [];
for (const dir of SCAN_DIRS) {
  try {
    statSync(join(ROOT, dir));
    candidates.push(...walk(join(ROOT, dir)));
  } catch {
    // skip
  }
}
for (const rel of SCAN_FILES) {
  try {
    statSync(join(ROOT, rel));
    candidates.push(join(ROOT, rel));
  } catch {
    console.warn('[strip-www] warning: ' + rel + ' not found, skipping');
  }
}

for (const fullPath of candidates) {
  let raw;
  try {
    raw = readFileSync(fullPath, 'utf8');
  } catch (e) {
    errors++;
    console.error('[strip-www] read failed: ' + fullPath + ': ' + e.message);
    continue;
  }
  if (!raw.includes(FROM)) {
    skipped++;
    continue;
  }
  let count = 0;
  const newRaw = raw.replaceAll(FROM, () => {
    count++;
    return TO;
  });
  try {
    writeFileSync(fullPath, newRaw, 'utf8');
    changedFiles++;
    totalReplacements += count;
    touched.push({ path: relative(ROOT, fullPath), count });
  } catch (e) {
    errors++;
    console.error('[strip-www] write failed: ' + fullPath + ': ' + e.message);
  }
}

console.log('[strip-www] changed_files=' + changedFiles + '  total_replacements=' + totalReplacements + '  skipped=' + skipped + '  errors=' + errors);
if (touched.length > 0) {
  const byDir = new Map();
  for (const t of touched) {
    const top = t.path.split(/[\\/]/)[0];
    byDir.set(top, (byDir.get(top) || 0) + t.count);
  }
  for (const [dir, n] of byDir) console.log('  ' + dir + '/  ' + n + ' replacement(s)');
  if (touched.length <= 5) {
    for (const t of touched) console.log('  - ' + t.path + '  (' + t.count + ')');
  } else {
    console.log('  (first 5 of ' + touched.length + '):');
    for (const t of touched.slice(0, 5)) console.log('  - ' + t.path + '  (' + t.count + ')');
  }
}