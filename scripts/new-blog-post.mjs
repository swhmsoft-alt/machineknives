// scripts/new-blog-post.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Scaffold a new blog post from the CLI. Validates inputs, creates the
// markdown file from a built-in template, and triggers the OG image
// generator for that single post. Designed so authors cannot accidentally
// skip frontmatter fields or produce non-compliant lengths.
//
// Usage:
//   node scripts/new-blog-post.mjs \
//     --title "How to Choose a Granulator Knife" \
//     --category "selection-guide" \
//     [--type article] \
//     [--excerpt "Plain 120–160 char summary..."] \
//     [--slug "how-to-choose-granulator-knife"] \
//     [--author "Jane Engineer"] \
//     [--tags "blade,selection,material-grade"] \
//     [--draft]
//
// After scaffolding, edit the new file's body. The OG image is generated
// with a type-aware palette (cyan/violet/emerald) and the canonical 1200×630
// glassmorphism template.
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'src', 'data', 'post');
const OG_GENERATOR = path.join(ROOT, 'scripts', 'og-image-generator.mjs');

const BRAND_SUFFIX = ' \u2014 Industrial Knives';
const BRAND_SUFFIX_LEN = 20;
const TITLE_MIN_FULL = 50;
const TITLE_MAX_FULL = 60;
const EXCERPT_MIN = 120;
const EXCERPT_MAX = 160;

const VALID_CATEGORIES = new Set([
  'materials-encyclopedia', 'glossary', 'case-studies', 'selection-guide',
  'maintenance', 'troubleshooting', 'material-comparison', 'coatings-comparison', 'blog',
]);
const VALID_TYPES = new Set(['article', 'glossary', 'comparison']);

function parseArgs() {
  const argv = process.argv.slice(2);
  const opts = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = argv[i + 1];
      opts[key] = val === undefined ? true : val;
      i++;
    } else if (!a.startsWith('-')) {
      positional.push(a);
    }
  }
  // First positional arg is the title (lowest-friction invocation).
  if (positional.length > 0 && !opts.title) opts.title = positional[0];
  return opts;
}

function usage() {
  console.error(`Usage:
  node scripts/new-blog-post.mjs                                 # interactive wizard
  node scripts/new-blog-post.mjs "<title>"                     # positional title (shortest)
  node scripts/new-blog-post.mjs --title "..." --category "..." # full CLI mode

Interactive wizard prompts: title → category → type → excerpt (with live char count) → tags → draft.

Required flags (CLI mode only — interactive wizard handles them):
  --title     "<30–40 chars raw>"   post headline; brand suffix is appended
  --category  "<slug>"               one of: ${[...VALID_CATEGORIES].join(', ')}

Optional flags:
  --type     "<article|glossary|comparison>"  default: article (auto-guessed from title)
  --excerpt  "<120–160 chars>"               if omitted, file is created with a TODO marker
  --slug     "<kebab-case>"                   default: derived from title
  --author   "<name>"                          default: "Industrial Knives Engineering"
  --tags     "<comma,separated,tags>"          default: empty
  --draft                                    mark as draft (noindex)
  --skip-og                                  don't auto-trigger OG generator
  --help                                     show this message
`);
}

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

function fail(msg) { console.error(`\u2717 ${msg}`); process.exit(1); }

function validateTitle(raw) {
  if (!raw || typeof raw !== 'string') fail('--title is required');
  const full = raw.length + BRAND_SUFFIX_LEN;
  if (full > TITLE_MAX_FULL) {
    fail(`--title too long: raw ${raw.length} + brand suffix ${BRAND_SUFFIX_LEN} = ${full} chars (max ${TITLE_MAX_FULL}). Trim to <= ${TITLE_MAX_FULL - BRAND_SUFFIX_LEN} chars.`);
  }
  if (full < TITLE_MIN_FULL) {
    fail(`--title too short: raw ${raw.length} + brand suffix ${BRAND_SUFFIX_LEN} = ${full} chars (min ${TITLE_MIN_FULL}). Add context like material/feature.`);
  }
  if (raw.includes('\ufffd')) fail('--title contains replacement character (mojibake)');
  return raw;
}

function validateExcerpt(raw) {
  if (!raw) return null;
  if (typeof raw !== 'string') fail('--excerpt must be a string');
  if (raw.length < EXCERPT_MIN) {
    fail(`--excerpt too short: ${raw.length} chars (min ${EXCERPT_MIN}). Expand with concrete value proposition.`);
  }
  if (raw.length > EXCERPT_MAX) {
    fail(`--excerpt too long: ${raw.length} chars (max ${EXCERPT_MAX}). Tighten to fit Google SERP.`);
  }
  return raw;
}

function validateCategory(cat) {
  if (!cat) fail('--category is required');
  if (!VALID_CATEGORIES.has(cat)) {
    fail(`--category "${cat}" is not a known slug. Allowed:\n  ${[...VALID_CATEGORIES].join(', ')}`);
  }
  return cat;
}

function validateType(type) {
  if (!type) return 'article';
  if (!VALID_TYPES.has(type)) {
    fail(`--type "${type}" is not one of: ${[...VALID_TYPES].join(', ')}`);
  }
  return type;
}

function escapeYaml(s) {
  return String(s).replace(/'/g, "''");
}

function toYamlFrontmatter(fm) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fm)) {
    if (value === undefined || value === null) continue;
    if (key === 'metadata') {
      lines.push('metadata:');
      for (const [k, v] of Object.entries(value)) {
        lines.push(`  ${k}: '${escapeYaml(v)}'`);
      }
    } else if (key === 'tags') {
      if (!Array.isArray(value) || value.length === 0) {
        lines.push('tags: []');
      } else {
        lines.push('tags:');
        for (const t of value) lines.push(`  - '${escapeYaml(t)}'`);
      }
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'string') {
      lines.push(`${key}: '${escapeYaml(value)}'`);
    } else if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map((v) => `'${escapeYaml(String(v))}'`).join(', ')}]`);
    } else {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

function buildFileBody({ fm, title }) {
  const yaml = toYamlFrontmatter(fm);
  const markdown = [
    '',
    `# ${title}`,
    '',
    '> Replace this body with the article. Use semantic Markdown — H2 for major sections, H3 for sub-sections, lists for enumerations, fenced code blocks for tabular specs. Keep paragraphs short (3–5 sentences). Reference real specs where possible.',
    '',
    '## First major section',
    '',
    'Body content here.',
    '',
    '## Second major section',
    '',
    'More body content.',
    '',
    '## Closing',
    '',
    'Wrap up with a clear takeaway. If relevant, link to a related post or category landing page.',
    '',
  ].join('\n');
  return yaml + markdown;
}

function createPostFile({ slug, fm, title }) {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (fs.existsSync(file)) {
    fail(`File already exists: ${file}\n  Refusing to overwrite. Use --slug to choose a different slug.`);
  }
  const body = buildFileBody({ fm, title });
  fs.writeFileSync(file, body, 'utf8');
  return file;
}

function triggerOGGeneration(slug) {
  const result = spawnSync('node', [OG_GENERATOR, '--slug', slug], {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    fail(`OG image generator exited with code ${result.status}. Run \`node ${OG_GENERATOR} --slug ${slug}\` manually for details.`);
  }
  const ogPath = path.join(ROOT, 'public', 'images', 'og', `${slug}.webp`);
  if (!fs.existsSync(ogPath)) fail(`OG image not found at ${ogPath}`);
  return ogPath;
}

// ─── Interactive mode (readline prompts) ─────────────────────────────────
import readline from 'node:readline';

const CATEGORY_CHOICES = [
  { value: 'selection-guide',     label: 'selection-guide     — Selection guides' },
  { value: 'materials-encyclopedia', label: 'materials-encyclopedia — Material reference (D2, HSS, ...)' },
  { value: 'glossary',            label: 'glossary            — Industry terminology' },
  { value: 'case-studies',        label: 'case-studies        — Field case studies' },
  { value: 'maintenance',         label: 'maintenance         — Service & re-sharpening' },
  { value: 'troubleshooting',      label: 'troubleshooting      — Failure diagnosis' },
  { value: 'material-comparison', label: 'material-comparison — Steel grade comparisons' },
  { value: 'coatings-comparison', label: 'coatings-comparison — Coating comparisons' },
  { value: 'blog',                label: 'blog                — General engineering article' },
];

const TYPE_CHOICES = [
  { value: 'article',    label: 'article    — Standard blog post' },
  { value: 'glossary',   label: 'glossary   — Short reference entry' },
  { value: 'comparison', label: 'comparison — Single-page table / matrix' },
];

// Single readline interface reused across the whole wizard. Each rl() closes
// the *question* (returns the answer) but not the underlying stream — so
// subsequent prompts can still read from stdin.
let _rlIface = null;
function rlIface() {
  if (!_rlIface) {
    _rlIface = readline.createInterface({ input: process.stdin, output: process.stdout });
  }
  return _rlIface;
}

function rl(prompt) {
  return new Promise((resolve) => {
    rlIface().question(prompt, (answer) => resolve(answer));
  });
}

function rlChoose(prompt, choices, defaultValue) {
  console.log(prompt);
  const idxOf = (v) => choices.findIndex((c) => c.value === v);
  const defaultIdx = defaultValue ? idxOf(defaultValue) : 0;
  choices.forEach((c, i) => {
    const marker = i === defaultIdx ? '\u25c0 ' : '  ';
    console.log(`  ${marker}${String(i + 1).padStart(2, ' ')}) ${c.label}`);
  });
  return rl(`  number or value [${defaultIdx + 1}]: `).then(async (raw) => {
    const v = raw.trim();
    if (!v) return choices[defaultIdx].value;
    const n = parseInt(v, 10);
    if (Number.isFinite(n) && n >= 1 && n <= choices.length) return choices[n - 1].value;
    if (choices.some((c) => c.value === v)) return v;
    console.error(`  ! invalid choice: ${v}`);
    return rlChoose('', choices, defaultValue);
  });
}

async function runInteractive(opts) {
  console.log('');
  console.log('╭─────────────────────────────────────────────╮');
  console.log('│  New blog post — interactive wizard            │');
  console.log('╰─────────────────────────────────────────────╯');
  console.log('');
  console.log('Press Enter to accept the default shown in [brackets].');
  console.log('');

  // 1. Title — skip if already set (positional arg or --title flag)
  if (!opts.title) {
    const titleRaw = (await rl('? Article title (raw text, brand suffix added later): ')).trim();
    if (!titleRaw) fail('Title is required.');
    opts.title = titleRaw;
  }
  console.log(`  Title:    ${opts.title}`);
  validateTitle(opts.title); // may throw -> exit 1

  // 2. Category — skip if already set
  if (!opts.category) {
    console.log('');
    opts.category = await rlChoose('? Category:', CATEGORY_CHOICES, 'blog');
  }
  console.log(`  Category: ${opts.category}`);

  // 3. Type — skip if already set (default to article if empty)
  if (!opts.type) {
    console.log('');
    const typeGuess = opts.title.toLowerCase().match(/vs|comparison|table|matrix/) ? 'comparison'
      : opts.title.toLowerCase().match(/glossary|terminology|definition/) ? 'glossary'
      : 'article';
    opts.type = await rlChoose('? Type:', TYPE_CHOICES, typeGuess);
  }
  console.log(`  Type:     ${opts.type}`);

  // 4. Excerpt — skip if already set (user provided via --excerpt flag)
  if (!opts.excerpt) {
    console.log('');
    console.log('? Excerpt (120-160 chars; aim for 150):');
    while (true) {
      const raw = (await rl('  > ')).trim();
      if (!raw) {
        console.log('  ! Empty. Try again or Ctrl-C to abort.');
        continue;
      }
      if (raw.length < 120) {
        console.log(`  ! too short (${raw.length}/120). Add ${120 - raw.length} more chars.`);
        continue;
      }
      if (raw.length > 160) {
        console.log(`  ! too long (${raw.length}/160). Trim ${raw.length - 160} chars.`);
        continue;
      }
      opts.excerpt = raw;
      console.log(`  ✓ length ${raw.length} chars (target 120-160)`);
      break;
    }
  }
  console.log(`  Excerpt:  ${opts.excerpt.length} chars`);

  // 5. Author — skip if already set
  if (!opts.author) {
    const author = (await rl('? Author [Industrial Knives Engineering]: ')).trim();
    opts.author = author || 'Industrial Knives Engineering';
  }
  console.log(`  Author:   ${opts.author}`);

  // 6. Tags — skip if already set
  if (opts.tags === undefined) {
    const tagsRaw = (await rl('? Tags (comma-separated, optional): ')).trim();
    opts.tags = tagsRaw || '';
  }
  console.log(`  Tags:     ${opts.tags || '(none)'}`);

  // 7. Draft — skip if already set
  if (opts.draft === undefined) {
    const draft = (await rl('? Mark as draft? (y/N): ')).trim().toLowerCase() === 'y';
    opts.draft = draft;
  }
  console.log(`  Draft:    ${opts.draft ? 'yes' : 'no'}`);

  console.log('');
  return runNonInteractive(opts);
}

function runNonInteractive(opts) {
  const title = validateTitle(opts.title);
  const category = validateCategory(opts.category);
  const type = validateType(opts.type);
  const excerpt = validateExcerpt(opts.excerpt);
  const slug = opts.slug ? slugify(opts.slug) : slugify(title);
  if (!slug) fail('Could not derive slug from title. Pass --slug "<kebab-case>".');
  const author = opts.author || 'Industrial Knives Engineering';
  const tags = opts.tags
    ? String(opts.tags).split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const isDraft = Boolean(opts.draft);

  const canonicalPath = `${category}/${slug}/`.replace(/\/+/g, '/');
  const fm = {
    title,
    excerpt: excerpt || '{{TODO: write 120\u2013160 char summary; current is empty}}',
    publishDate: new Date().toISOString().slice(0, 10),
    category,
    type,
    tags,
    author,
    image: `/images/og/${slug}.webp`,
    metadata: {
      description: excerpt || '{{TODO: see excerpt}}',
      canonical: `https://www.industrial-knives.net/${canonicalPath}`,
    },
  };
  if (isDraft) fm.draft = true;

  const file = createPostFile({ slug, fm, title });
  console.log(`\u2713 Created ${path.relative(ROOT, file)}`);

  if (opts['skip-og']) {
    console.log('\u26a0  Skipped OG image generation. Run later:');
    console.log(`    node scripts/og-image-generator.mjs --slug ${slug}`);
  } else {
    console.log(`\u2192 Generating OG image (1200\u00d7630 WebP) ...`);
    const ogPath = triggerOGGeneration(slug);
    console.log(`\u2713 OG image at ${path.relative(ROOT, ogPath)}`);
  }

  console.log('');
  console.log('Next steps:');
  console.log(`  1. Edit ${path.relative(ROOT, file)}`);
  console.log('  2. Replace the body placeholder with the article content');
  console.log(`  3. Replace any {{TODO}} markers (excerpt if you did not pass --excerpt)`);
  console.log('  4. Verify:');
  console.log(`     node scripts/check-frontmatter-lint.mjs`);
  console.log(`     node audit-results/_v2-audit.mjs`);
}

async function main() {
  const opts = parseArgs();
  if (opts.help) { usage(); process.exit(0); }

  // Dispatch:
  //   • If any required field is missing (positional title only, or flag-passed
  //     but incomplete) → run the interactive wizard (which skips any already-set
  //     field, so positional-title + interactive-fill works as a single step).
  //   • If all required fields are provided via flags → run non-interactive.
  const missingRequired = !opts.title || !opts.category || !opts.excerpt;

  if (missingRequired) {
    return runInteractive(opts);
  }
  return runNonInteractive(opts);
}

main();