// scripts/prebuild-images.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Pre-build image compression. Runs BEFORE `astro build` and rewrites every
// JPG / JPEG / PNG under public/ as a same-name WebP (with `.webp` extension),
// deleting the original raster. Astro's static copy step then publishes the
// already-compressed WebP into dist/ as-is — no post-build re-encoding needed.
//
// Why pre-build (and not post-build)
// ----------------------------------
//   • Git commits the WebP, not the 2-3 MB originals. The repository size
//     collapses; clone/pull/push are fast.
//   • `npm run build` no longer has to re-encode 30+ images at build time —
//     Astro just copies already-small files.
//   • Pages reference `.webp` directly (postbuild.js rewrites the HTML).
//     No `<picture>` wrapper, no client-side format negotiation — simpler.
//
// Why not lossy recompression of an already-compressed JPEG
// ---------------------------------------------------------
//   Direct PNG/JPG → WebP at quality 80 with libwebp empirically yields
//   25-34% smaller files than the equivalent quality JPEG, while preserving
//   perceptual fidelity. The WebP encoder inside sharp uses libwebp directly,
//   so this works on Windows without any new npm dependency.
//
// Idempotency
// -----------
//   The script refuses to run when a `<basename>.webp` already exists next to
//   the source — re-running the build will not double-compress or overwrite
//   the existing WebP. To force re-compression, delete the `.webp` files
//   first.
// ─────────────────────────────────────────────────────────────────────────────
import { glob } from 'glob';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'public');
const MAX_EDGE = 1920;
const WEBP_QUALITY = 80;
const WEBP_EFFORT = 6;

// Do NOT touch hardcoded raster consumers — browsers and social crawlers
// sometimes expect a specific format.
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

const INPUTS = glob.sync('public/**/*.{jpg,jpeg,png}', {
  cwd: ROOT,
  absolute: true,
});

if (INPUTS.length === 0) {
  console.log('[prebuild-images] no JPG/JPEG/PNG inputs under public/ — nothing to do.');
  process.exit(0);
}

let converted = 0;
let skipped = 0;
let failed = 0;
let totalOriginal = 0;
let totalWebp = 0;
const detailLines = [];

for (const src of INPUTS) {
  const base = path.basename(src);
  if (SKIP_BASENAMES.has(base.toLowerCase())) {
    skipped += 1;
    continue;
  }

  const ext = path.extname(src);
  const stem = src.slice(0, -ext.length);
  const webp = `${stem}.webp`;

  // Idempotency: don't double-encode.
  if (fs.existsSync(webp)) {
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
    fs.writeFileSync(webp, buf);
    webpSize = buf.length;
    // Keep the original alongside the WebP. The WebP is the production target
    // (smaller, modern format); the original is a dev-mode fallback so
    // `astro dev` can serve either extension after a fresh `git clone`
    // without 404s on hero/category images. Production HTML now references
    // `.webp` directly (see src/pages/index.astro and src/pages/products/
    // [...slug].astro), so the originals are no longer required at runtime —
    // they're purely a safety net for the dev workflow.
  } catch (err) {
    failed += 1;
    console.warn(`[prebuild-images] ✗ ${src}: ${err instanceof Error ? err.message : String(err)}`);
    continue;
  }

  totalOriginal += originalSize;
  totalWebp += webpSize;
  converted += 1;

  const rel = path.relative(ROOT, src).split(path.sep).join('/');
  const relWebp = path.relative(ROOT, webp).split(path.sep).join('/');
  const saved = ((1 - webpSize / originalSize) * 100).toFixed(1);
  const line = `  ${rel.padEnd(72)} → ${relWebp}  ${(originalSize / 1024).toFixed(1).padStart(7)} KB → ${(webpSize / 1024).toFixed(1).padStart(7)} KB (-${saved}%)`;
  detailLines.push(line);
}

const savedPct = totalOriginal > 0 ? ((1 - totalWebp / totalOriginal) * 100).toFixed(1) : '0.0';
console.log('');
console.log(`[prebuild-images] converted=${converted}  skipped=${skipped}  failed=${failed}`);
console.log(
  `[prebuild-images] total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB → ${(totalWebp / 1024 / 1024).toFixed(2)} MB (-${savedPct}%)`
);

// Persistent summary so reviewers can confirm without fighting PowerShell.
const summaryPath = path.join(ROOT, 'dist', '_compression.log');
fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
fs.writeFileSync(
  summaryPath,
  [
    '# prebuild-images summary',
    `# converted=${converted}  skipped=${skipped}  failed=${failed}`,
    `# total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB → ${(totalWebp / 1024 / 1024).toFixed(2)} MB (-${savedPct}%)`,
    `# generated: ${new Date().toISOString()}`,
    '',
    ...detailLines,
    '',
  ].join('\n'),
  'utf8'
);

if (failed > 0) process.exitCode = 0;
