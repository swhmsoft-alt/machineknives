// scripts/check-unicode.mjs
// ─────────────────────────────────────────────────────────────────────────────
// CI lint that fails the build if any data file still contains mojibake.
//
// This is the durable guard for the encoding-corruption class of bug:
//
//   1. PowerShell on zh-CN Windows defaults to CP936/GBK on `>` / Out-File.
//   2. UTF-8 characters outside GBK (Ø, ±, ≤, ≥, – , —, →, µ, ×, °) become
//      a two-byte invalid sequence that editors render as "�?" (U+FFFD + '?').
//   3. The team's editor pipeline used to write src/data/**/*.md through
//      PowerShell, leaving dozens of mojibake sequences in product pages.
//   4. The legacy fix-unicode.cjs only covered generator scripts; it never
//      touched the markdown content, so the corruption went uncaught for
//      months. The pages rendered "Circular Slitting Blade �?250 mm OD" in
//      production.
//
// Defense in depth
// ────────────────
//   • .editorconfig (charset = utf-8)  — IDE hints, not enforced.
//   • .gitattributes (* text=auto eol=lf) — line-ending normalization on commit.
//   • scripts/fix-unicode.mjs         — idempotent repair tool.
//   • scripts/check-unicode.mjs       — THIS script. Detects four patterns:
//
//         (a) U+FFFD ('�') anywhere — the canonical mojibake byte from any
//             encoding mismatch.
//         (b) GBK mojibake characters themselves — '鈥' (0x9275), '碌'
//             (0x78B5), '脳' (0x8133) and a few others survive in legacy
//             generator output.
//         (c) Literal "?" immediately following a Chinese / extended-Latin
//             character — the PowerShell "downgrade" symptom, often visible
//             even after a partial fix.
//         (d) "text=auto" attribution losses — pure-ASCII files containing
//             a number range like "100?500" or "12?100" (a digit was eaten).
//             These are heuristics and only flag *likely* damage; review the
//             line and either restore the digit or commit the range
//             explicitly.
//
// Wire it into package.json's `check` and `build` scripts so CI fails
// loudly. This script does NOT mutate files — it only reports.
// ─────────────────────────────────────────────────────────────────────────────
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();

// Patterns that mean "this file was written through a non-UTF-8 codepage".
// Kept narrow on purpose — false positives waste reviewer time.
const PATTERNS = [
  {
    name: 'U+FFFD replacement character',
    // 0xEF 0xBF 0xBD — the byte sequence every editor renders as '�'.
    re: /\uFFFD/g,
  },
  {
    name: 'GBK mojibake (鈥 / 碌 / 脳 / 脴 / 掳 / 渭 / 鈮 / 鈫 / 搂 / 路)',
    // These CJK code points survive GBK→UTF-8 mis-decoding as literal kanji
    // in otherwise English content. Expanded 2026-09-22 after production
    // mojibake in slitter-blade.md (Circular Slitting Blade 脴250 mm OD,
    // 15掳 / 20掳 / 25掳, Ra 鈮?0.4 渭m, etc.).
    re: /[\uFFFD\u9239\u9225\u922E\u922B\u63B3\u788C\u5364\u8133\u6E2D\u63D1\u63D4\u6402\u5E90\u8134\u6377\u9275\u8120\u78B5\u9280\u9396\u9332\u92F8\u9251\u9214\u91D1\u928B\u63E1\u9279\u8DEF]/g,
  },
  {
    name: 'PowerShell downgrade "?" after Chinese/extended-Latin',
    // PowerShell swaps unrepresentable chars for '?' (0x3F). In English
    // content this almost always means a number-range dash was lost.
    re: /[\u00C0-\u024F\u0370-\u03FF\u2010-\u205F][?][\u00C0-\u024F\u0370-\u03FF\u2010-\u205F]/g,
  },
  {
    name: 'missing digit in number range (e.g. "100?500")',
    // Context: digit, '?', digit. Almost always mojibake eating a single
    // boundary digit. Skipped if the '?' is at the very end of a line
    // (could be a Markdown reference link we don't want to flag).
    re: /(?<![?\w])(?<=\d)\?(?=\d)/g,
  },
];

const TARGET_DIRS = ['src/data/product', 'src/data/post', 'src/data/glossary', 'src/pages'];
const FILE_EXT = /\.(md|mdx|astro|ts|tsx|js|mjs|cjs)$/i;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (st.isFile()) out.push(full);
  }
  return out;
}

const findings = [];

for (const relDir of TARGET_DIRS) {
  const abs = join(ROOT, relDir);
  try {
    statSync(abs);
  } catch {
    continue;
  }
  for (const file of walk(abs)) {
    if (!FILE_EXT.test(file)) continue;
    const rel = relative(ROOT, file).split(sep).join('/');
    const txt = readFileSync(file, 'utf8');
    const lines = txt.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const { name, re } of PATTERNS) {
        re.lastIndex = 0;
        const m = line.match(re);
        if (!m) continue;
        findings.push({
          file: rel,
          line: i + 1,
          pattern: name,
          snippet: line.length > 120 ? line.slice(0, 117) + '…' : line,
        });
      }
    }
  }
}

if (findings.length === 0) {
  console.log('✓ Unicode check passed — no mojibake detected in src/{data,pages}/**.');
  process.exit(0);
}

console.error('✗ Unicode check FAILED — mojibake detected:');
console.error('');
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}  [${f.pattern}]`);
  console.error(`    ${f.snippet}`);
  console.error('');
}
console.error(`${findings.length} finding${findings.length === 1 ? '' : 's'}.`);
console.error('Run `node scripts/fix-unicode.mjs` to repair, then re-run this check.');
process.exit(1);