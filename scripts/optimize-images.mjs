// scripts/optimize-images.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Build-time WebP generation. Runs after `astro build` and emits a same-name
// `.webp` next to every JPG / JPEG / PNG under dist/, while leaving the
// original raster in place as a fallback. scripts/postbuild.js then upgrades
// every matching `<img>` in the emitted HTML to a `<picture>` so modern
// browsers pick the smaller WebP and legacy clients fall back to the
// original codec — zero template changes, zero content authoring changes.
//
// Why WebP: 25-34% smaller than JPEG at the same perceptual fidelity, and
// already supported by every shipping browser. libwebp ships inside sharp's
// prebuilt binaries — no new npm package needed.
//
// What it does
// ────────────
//   • Globs `dist/**/*.{jpg,jpeg,png}` excluding `_astro/**` (Astro's <Image
//     /> already emits multi-format siblings) and hardcoded raster consumers
//     (favicons, apple-touch-icon, mstile, safari-pinned-tab).
//   • For each file: honour EXIF orientation, cap the long edge at 1920 px,
//     encode as WebP at quality 80 / effort 6 next to the source.
//   • Reports per-file savings to dist/_compression.log.
// ─────────────────────────────────────────────────────────────────────────────
import { glob } from 'glob';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const MAX_EDGE = 1920;
const WEBP_QUALITY = 80;
const WEBP_EFFORT = 6;

const SKIP_BASENAMES = new Set([
  'favicon.ico',
  'favicon.png',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'apple-touch-icon-precomposed.png',
  'mstile-150x150.png',
  'safari-pinned-tab.svg',
]);

const INPUTS = glob.sync('dist/**/*.{jpg,jpeg,png}', {
  cwd: ROOT,
  ignore: ['dist/_astro/**'],
  absolute: true,
});

if (INPUTS.length === 0) {
  console.log('[optimize-images] no JPG/JPEG/PNG inputs under dist/ — nothing to do.');
  process.exit(0);
}

let converted = 0;
let skipped = 0;
let failed = 0;
let totalOriginal = 0;
let totalWebp = 0;
const detailLines = [];

for (const src of INPUTS) {
  if (SKIP_BASENAMES.has(path.basename(src).toLowerCase())) {
    skipped += 1;
    continue;
  }

  const ext = path.extname(src);
  const base = path.basename(src, ext);
  const dst = path.join(path.dirname(src), `${base}.webp`);

  if (fs.existsSync(dst)) {
    skipped += 1;
    continue;
  }

  let originalSize = 0;
  let webpSize = 0;
  try {
    originalSize = fs.statSync(src).size;
    const input = fs.readFileSync(src);
    const buf = await sharp(input)
      .rotate()
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
      .toBuffer();
    fs.writeFileSync(dst, buf);
    webpSize = buf.length;
  } catch (err) {
    failed += 1;
    console.warn(`[optimize-images] ✗ ${src}: ${err instanceof Error ? err.message : String(err)}`);
    continue;
  }

  totalOriginal += originalSize;
  totalWebp += webpSize;
  converted += 1;

  const rel = path.relative(ROOT, src).split(path.sep).join('/');
  const saved = ((1 - webpSize / originalSize) * 100).toFixed(1);
  const line = `  ${rel.padEnd(72)} ${(originalSize / 1024).toFixed(1).padStart(7)} KB → ${(webpSize / 1024).toFixed(1).padStart(7)} KB (-${saved}%)`;
  detailLines.push(line);
}

const savedPct = totalOriginal > 0 ? ((1 - totalWebp / totalOriginal) * 100).toFixed(1) : '0.0';
console.log('');
console.log(`[optimize-images] converted=${converted}  skipped=${skipped}  failed=${failed}`);
console.log(
  `[optimize-images] total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB → ${(totalWebp / 1024 / 1024).toFixed(2)} MB (-${savedPct}%)`
);

// Persistent summary — `cat dist/_compression.log` after a build to see what
// changed. PowerShell on zh-CN Windows truncates streamed stdout, so writing
// the report to a file is the only reliable way to inspect results.
const summaryPath = path.join(DIST, '_compression.log');
const summary = [
  '# optimize-images summary',
  `# converted=${converted}  skipped=${skipped}  failed=${failed}`,
  `# total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB → ${(totalWebp / 1024 / 1024).toFixed(2)} MB (-${savedPct}%)`,
  `# generated: ${new Date().toISOString()}`,
  '',
  ...detailLines,
  '',
].join('\n');
fs.writeFileSync(summaryPath, summary, 'utf8');

if (failed > 0) process.exitCode = 0;
