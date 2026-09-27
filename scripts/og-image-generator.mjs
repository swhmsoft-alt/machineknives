// scripts/og-image-generator.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Auto-generates 1200×630 PNG OG cards for every blog post in
// src/data/post/, writes them to public/images/og/<slug>.png, and wires
// them into each post's frontmatter `image:` field.
//
// Uses sharp's SVG → PNG pipeline (librsvg) with system sans-serif fonts
// (Arial / Segoe UI). Deterministic, brand-consistent template that
// scales across article / glossary / comparison types by varying the eyebrow
// label and category strip.
//
// Frontmatter hook: writes / updates the `image:` field on each post with
// the public-relative path. SinglePost's hero <Image> + any OpenGraph
// consumer picks the generated card up.
//
// Idempotency: skips posts whose image: already points at the right PNG
// and that PNG exists on disk. To force regenerate, pass --force.
//
// Usage:
//   node scripts/og-image-generator.mjs            # only missing
//   node scripts/og-image-generator.mjs --force   # regenerate all
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'src', 'data', 'post');
const OG_DIR = path.join(ROOT, 'public', 'images', 'og');
const FORCE = process.argv.includes('--force');

// Brand palette (kept in sync with src/components/CustomStyles.astro).
// Dark "industrial glassmorphism" theme: deep navy → indigo gradient
// background with two blurred accent orbs (cyan + brand orange) for
// visual depth. Foreground uses near-white + slate-400 + cyan accents
// for badges.
const COLOR_BG_START = '#0B1220'; // slate-950 (deep navy)
const COLOR_BG_END = '#1E1B4B'; // indigo-950
const COLOR_TEXT = '#F8FAFC'; // slate-50 (near white)
const COLOR_TEXT_MUTED = '#94A3B8'; // slate-400 (secondary text)
const COLOR_RULE = 'rgba(255,255,255,0.10)';
const COLOR_GRID = 'rgba(148,163,184,0.06)';
const COLOR_ACCENT_DOT = '#C9531F';
const FONT_STACK = 'Arial, Segoe UI, Helvetica, sans-serif';

const W = 1200;
const H = 630;
const PAD_X = 72;
const TITLE_FONT = 62;
const TITLE_LINE = 76;
const MAX_TITLE_LINES = 4;

// Per-type accent palette. Each type gets its own (cyan, accent) pair:
//   • article    — cyan / brand-orange  (engineering articles)
//   • glossary   — violet / amber      (reference encyclopedia)
//   • comparison — emerald / brand-orange (analytical tables)
const TYPE_ACCENT = {
  article:    { pill: '#38BDF8', orb: '#C9531F', label: 'Engineering Article' },
  glossary:   { pill: '#A78BFA', orb: '#F59E0B', label: 'Industry Glossary' },
  comparison: { pill: '#34D399', orb: '#C9531F', label: 'Comparison Table' },
};

const CATEGORY_LABEL = {
  'materials-encyclopedia': 'Materials Encyclopedia',
  'glossary': 'Industry Glossary',
  'case-studies': 'Field Case Study',
  'selection-guide': 'Selection Guide',
  'maintenance': 'Maintenance & Service',
  'troubleshooting': 'Troubleshooting',
  'material-comparison': 'Material Comparison',
  'coatings-comparison': 'Coatings Comparison',
  'blog': 'Engineering Article',
};

// ─── Frontmatter helpers (same shape as _v3-content-rewriter) ─────────
function parseFrontmatter(raw) {
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const lines = m[1].split(/\r?\n/);
  const out = {};
  let i = 0;
  const unquote = (s) => {
    s = s.trim();
    if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
      return s.slice(1, -1);
    }
    return s;
  };
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) { i++; continue; }
    const m1 = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m1) { i++; continue; }
    const key = m1[1];
    const rest = m1[2].trim();
    if (rest === '') {
      const child = {};
      const arr = [];
      i++;
      while (i < lines.length) {
        const cl = lines[i];
        if (!cl.trim()) { i++; continue; }
        if (!/^\s/.test(cl)) break;
        const cm = cl.match(/^\s+(?:-\s*)?([A-Za-z_][\w-]*):\s*(.*)$/);
        if (cm) child[cm[1]] = unquote(cm[2]);
        else {
          const am = cl.match(/^\s+-\s*(.*)$/);
          if (am) arr.push(unquote(am[1]));
        }
        i++;
      }
      out[key] = Object.keys(child).length ? child : arr;
    } else {
      out[key] = unquote(rest);
      i++;
    }
  }
  return out;
}

function findFrontmatterBounds(raw) {
  const hasBom = raw.charCodeAt(0) === 0xfeff;
  const cleaned = hasBom ? raw.slice(1) : raw;
  const m = cleaned.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  return {
    hasBom,
    header: (hasBom ? '\ufeff' : '') + '---\n',
    fmText: m[1],
    closing: '\n---',
    body: cleaned.slice(m[0].length),
    raw: cleaned,
  };
}

function escapeYaml(s) {
  return s.replace(/'/g, "''");
}

function replaceFieldLine(raw, fieldName, newValue) {
  const b = findFrontmatterBounds(raw);
  if (!b) return raw;
  const lines = b.fmText.split(/\r?\n/);
  const re = new RegExp(`^${fieldName}\\s*:`);
  let replaced = false;
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) {
      lines[i] = `${fieldName}: '${escapeYaml(newValue)}'`;
      replaced = true;
      break;
    }
  }
  if (!replaced) {
    // Field doesn't exist — append at end of frontmatter block (before
    // the closing `---` which lives outside `fmText`). Inserting at the
    // last line keeps related fields grouped.
    lines.push(`${fieldName}: '${escapeYaml(newValue)}'`);
  }
  return b.header + lines.join('\n') + b.closing + b.body;
}

// ─── Title wrapping ──────────────────────────────────────────────────────
const AVG_CHAR_WIDTH = 0.58;
function wrapTitle(title, maxCharsPerLine) {
  const words = title.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur.length) {
      cur = w;
    } else if ((cur + ' ' + w).length <= maxCharsPerLine) {
      cur += ' ' + w;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, MAX_TITLE_LINES);
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSvg(post) {
  // Per-type accent palette
  const accent = TYPE_ACCENT[post.type] || TYPE_ACCENT.article;
  const eyebrowTop = accent.label.toUpperCase();
  const category = CATEGORY_LABEL[post.category] || (post.category || 'engineering').replace(/-/g, '');

  // Wrap title. Slightly tighter margins now that PAD_X = 72.
  const maxChars = Math.floor((W - PAD_X * 2 - 40) / (TITLE_FONT * AVG_CHAR_WIDTH));
  const titleLines = wrapTitle(post.title, maxChars);
  const tspanLines = titleLines
    .map((line, idx) =>
      `<tspan x="${PAD_X}" dy="${idx === 0 ? 0 : TITLE_LINE}">${escapeXml(line)}</tspan>`
    )
    .join('');

  // Vertical layout anchors
  const eyebrowY = 116;          // pill badge baseline
  const subY = 168;              // category subhead
  const titleStartY = 256;       // first tspan y
  const bottomY = H - 56;        // brand baseline
  const bottomRuleY = bottomY - 32;

  // Build decorative SVG fragments
  const gridLines = (() => {
    // Vertical hairlines at 1/4, 1/2, 3/4 widths.
    const xs = [W * 0.25, W * 0.5, W * 0.75];
    return xs
      .map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${COLOR_GRID}" stroke-width="1"/>`)
      .join('');
  })();

  // Circular blade silhouette (top-down view) anchored to bottom-right.
  // Partially clipped by the canvas to add depth without competing with text.
  const bladeCx = W - 60;
  const bladeCy = H + 60;
  const teeth = (() => {
    const N = 12;
    const rOuter = 280;
    const rInner = 258;
    const out = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      const x1 = bladeCx + Math.cos(a) * rOuter;
      const y1 = bladeCy + Math.sin(a) * rOuter;
      const x2 = bladeCx + Math.cos(a) * rInner;
      const y2 = bladeCy + Math.sin(a) * rInner;
      out.push(
        `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${accent.pill}" stroke-width="1.5" stroke-opacity="0.55"/>`,
      );
    }
    return out.join('');
  })();
  const radialSpokes = (() => {
    const N = 6;
    const out = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const x1 = bladeCx + Math.cos(a) * 60;
      const y1 = bladeCy + Math.sin(a) * 60;
      const x2 = bladeCx + Math.cos(a) * 240;
      const y2 = bladeCy + Math.sin(a) * 240;
      out.push(
        `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${accent.pill}" stroke-width="1" stroke-opacity="0.18"/>`,
      );
    }
    return out.join('');
  })();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLOR_BG_START}"/>
      <stop offset="100%" stop-color="${COLOR_BG_END}"/>
    </linearGradient>
    <radialGradient id="orbPill" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accent.pill}" stop-opacity="0.50"/>
      <stop offset="60%" stop-color="${accent.pill}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${accent.pill}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orbBrand" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accent.orb}" stop-opacity="0.45"/>
      <stop offset="60%" stop-color="${accent.orb}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${accent.orb}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="80"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)"/>

  <g filter="url(#blur)">
    <circle cx="120" cy="120" r="320" fill="url(#orbPill)"/>
    <circle cx="1080" cy="540" r="380" fill="url(#orbBrand)"/>
  </g>

  <g>${gridLines}</g>

  <g opacity="0.55">
    <circle cx="${bladeCx}" cy="${bladeCy}" r="280" fill="none" stroke="${accent.pill}" stroke-width="1.5" stroke-opacity="0.20"/>
    <circle cx="${bladeCx}" cy="${bladeCy}" r="220" fill="none" stroke="${accent.pill}" stroke-width="1" stroke-opacity="0.14"/>
    <circle cx="${bladeCx}" cy="${bladeCy}" r="160" fill="none" stroke="${accent.pill}" stroke-width="1" stroke-opacity="0.10"/>
    <circle cx="${bladeCx}" cy="${bladeCy}" r="80" fill="none" stroke="${accent.pill}" stroke-width="1" stroke-opacity="0.30"/>
    <circle cx="${bladeCx}" cy="${bladeCy}" r="22" fill="none" stroke="${accent.pill}" stroke-width="1.5" stroke-opacity="0.55"/>
    ${radialSpokes}
    ${teeth}
  </g>

  <rect x="0" y="0" width="6" height="${H}" fill="${COLOR_ACCENT_DOT}"/>

  <g>
    <rect x="${PAD_X}" y="${eyebrowY - 22}" width="${eyebrowTop.length * 11 + 28}" height="34" rx="17"
          fill="${accent.pill}" fill-opacity="0.14"
          stroke="${accent.pill}" stroke-opacity="0.32" stroke-width="1"/>
    <text x="${PAD_X + 14}" y="${eyebrowY}" font-family="${FONT_STACK}" font-size="16" font-weight="700"
          fill="${accent.pill}" letter-spacing="2">${escapeXml(eyebrowTop)}</text>
  </g>
  <text x="${PAD_X}" y="${subY}" font-family="${FONT_STACK}" font-size="20" font-weight="500"
        fill="${COLOR_TEXT_MUTED}" letter-spacing="3">${escapeXml(category.toUpperCase())}</text>

  <text x="${PAD_X}" y="${titleStartY}" font-family="${FONT_STACK}" font-size="${TITLE_FONT}"
        font-weight="900" fill="${COLOR_TEXT}" letter-spacing="-1">${tspanLines}</text>

  <line x1="${PAD_X}" y1="${bottomRuleY}" x2="${W - PAD_X}" y2="${bottomRuleY}" stroke="${COLOR_RULE}" stroke-width="1"/>
  <text x="${PAD_X}" y="${bottomY}" font-family="${FONT_STACK}" font-size="20" font-weight="700"
        fill="${COLOR_TEXT}" letter-spacing="3">INDUSTRIAL KNIVES</text>
  <text x="${W - PAD_X}" y="${bottomY}" font-family="${FONT_STACK}" font-size="18" font-weight="500"
        fill="${COLOR_TEXT_MUTED}" text-anchor="end">industrial-knives.net</text>
</svg>`;
}

// ─── Main loop ───────────────────────────────────────────────────────────
fs.mkdirSync(OG_DIR, { recursive: true });

const postFiles = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
const log = { generated: 0, skipped: 0, errors: 0, filesChanged: [] };

for (const f of postFiles) {
  const fullPath = path.join(POSTS_DIR, f);
  const slug = f.replace(/\.(md|mdx)$/, '');
  const outPath = path.join(OG_DIR, `${slug}.png`);
  const relativeImagePath = `/images/og/${slug}.png`;

  let raw;
  try {
    raw = fs.readFileSync(fullPath, 'utf8');
  } catch (e) {
    log.errors++;
    console.warn(`[og] \u2717 read failed: ${f}: ${e.message}`);
    continue;
  }
  const fm = parseFrontmatter(raw);
  if (!fm || !fm.title) {
    log.skipped++;
    continue;
  }

  // Idempotency: skip if PNG exists AND frontmatter already points at it.
  if (!FORCE && fs.existsSync(outPath) && fs.statSync(outPath).size > 0) {
    if (fm.image === relativeImagePath) {
      log.skipped++;
      continue;
    }
  }

  const svg = buildSvg({
    title: fm.title,
    type: fm.type || 'article',
    category: fm.category || '',
  });

  try {
    const buf = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
    fs.writeFileSync(outPath, buf);

    if (fm.image !== relativeImagePath) {
      const updated = replaceFieldLine(raw, 'image', relativeImagePath);
      const fmCheck = parseFrontmatter(updated);
      if (fmCheck && fmCheck.image === relativeImagePath) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        log.filesChanged.push({ file: f, image: relativeImagePath });
      }
    }

    log.generated++;
    if (log.generated % 25 === 0) {
      console.log(`[og] progress: ${log.generated} / ${postFiles.length}`);
    }
  } catch (err) {
    log.errors++;
    console.warn(`[og] \u2717 ${f}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

console.log('');
console.log(`[og-image-generator] generated=${log.generated}  skipped=${log.skipped}  errors=${log.errors}  files_changed=${log.filesChanged.length}`);
console.log(`[og-image-generator] output dir: public/images/og/`);
console.log(`[og-image-generator] note: run scripts/prebuild-images.mjs next to optimize PNGs (or wait for build pipeline).`);

// Manifest for downstream CI / audit consumers.
const manifestPath = path.join(ROOT, 'audit-results', 'og-image-generation-manifest.json');
try {
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        summary: log,
        outputDir: 'public/images/og/',
        format: '1200x630 PNG',
      },
      null,
      2,
    ),
    'utf8',
  );
} catch (e) {
  // best-effort
}