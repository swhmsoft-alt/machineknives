// scripts/fix-unicode.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Repair Windows / PowerShell CP936 mojibake in data files.
//
// Root cause (historical)
// ───────────────────────
// The project's content pipeline used to write data files through PowerShell.
// On zh-CN Windows, `>` / `Out-File` default to the active OEM code page
// (CP936/GBK). When the source string contained UTF-8 characters outside
// GBK's repertoire (Ø, ±, ≤, ≥, – , —, →, µ, ×, °), PowerShell silently
// downgraded the unrepresentable byte to a literal '?' (0x3F) and left the
// preceding byte sequence as an invalid UTF-8 start, which editors render
// as U+FFFD ('�'). The mojibake signature is therefore the two-character
// sequence Yes�?Yes (U+FFFD followed by ASCII '?').
//
// Why fix-unicode.cjs (the old one) didn't catch this
// ────────────────────────────────────────────────────
// The legacy fix-unicode.cjs at the repo root only walks data-gl-*.cjs and
// data-enc-*.cjs — both of which are generator scripts that bake the
// mojibake into their output. It never touches src/data/**/*.md, so the
// product pages kept rendering the broken sequence even after the
// generators were repaired. This script covers the missing targets.
//
// Approach
// ────────
// Each rule is a [context, replacement] pair. Context is anchored on both
// sides (typically a unique product name, table header, or punctuation
// pattern) so collisions across products are impossible. Rules are
// evaluated longest-context-first so a short, generic rule cannot eat
// the leading half of a longer, specific rule.
//
// The script is idempotent: a rule whose source text is no longer present
// is a no-op, so the same command can be replayed to build up confidence
// across runs (CI / dev / production).
//
// Boundary digits
// ───────────────
// PowerShell's mojibake sometimes erases a single digit between two
// surviving digits (`100�?00` was once `100–500`). For each such case
// the rule applies a domain-informed guess; the audit log below each
// replacement records the original so a human can reverse any wrong pick.
// ─────────────────────────────────────────────────────────────────────────────
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();

// Targets: every markdown / mdx / astro file under src/data/ that may have
// been written by the editor tool. We deliberately exclude:
//   - node_modules, dist, .astro (build cache)
//   - public/* (binary assets)
//   - src/lib/schema.ts and JSON manifests (no user content)
const TARGET_DIRS = ['src/data/product', 'src/data/post', 'src/data/glossary', 'src/pages'];
const FILE_EXT = /\.(md|mdx|astro)$/i;

// Replacement table. Sorted: LONGEST context first so a short generic rule
// never destroys the leading half of a longer specific one. Each entry is
// [from, to]. Add new entries to the bottom and re-sort by `from.length`.
const RULES = [
  // ── Ø / — (titles and metadata) — longest context first ───────────────
  ["title: 'D2 Bed Knife for Tissue Converting �?HRC 60, 18° Clearance | KAIPU'",
   "title: 'D2 Bed Knife for Tissue Converting — HRC 60, 18° Clearance | KAIPU'"],
  ["title: 'D2 Bed Knife for Tissue Converting �?HRC 60, 18° Clearance Angle'",
   "title: 'D2 Bed Knife for Tissue Converting — HRC 60, 18° Clearance Angle'"],
  ["title: 'Circular Slitting Blade �?250 mm OD | KAIPU Industrial Blades'",
   "title: 'Circular Slitting Blade Ø250 mm OD | KAIPU Industrial Blades'"],
  ["title: 'Serrated Blade �?Cut-to-Length 6�?2 TPI'",
   "title: 'Serrated Blade — Cut-to-Length 6–12 TPI'"],
  ["title: 'Straight Converting Blade �?300 × 80 mm'",
   "title: 'Straight Converting Blade — 300 × 80 mm'"],
  ["title: 'Shear Blade �?Guillotine 300 × 60 mm'",
   "title: 'Shear Blade — Guillotine 300 × 60 mm'"],
  ["title: 'Circular Slitting Blade �?250 mm OD'",
   "title: 'Circular Slitting Blade Ø250 mm OD'"],
  ["title: 'Circular Slitting Blade �?250 mm'",
   "title: 'Circular Slitting Blade Ø250 mm'"],

  // ── — (em dash) — long-context sentences (bed-knife) ─────────────────
  ['The edge geometry �?not the steel grade �?is the dominant variable on high-speed tissue converting lines.',
   'The edge geometry — not the steel grade — is the dominant variable on high-speed tissue converting lines.'],
  ['4-ply tissue �?with **no steel change and no price change**.',
   '4-ply tissue — with **no steel change and no price change**.'],
  ['**Incoming steel heat** �?linked to mill certificate (chemical composition, incoming hardness)',
   '**Incoming steel heat** — linked to mill certificate (chemical composition, incoming hardness)'],
  ['**Heat-treatment batch records** �?retained as objective evidence of metallurgical specification',
   '**Heat-treatment batch records** — retained as objective evidence of metallurgical specification'],
  ['**Final dimensional and edge-prep inspection records** �?reference back to material heat number for full lot traceability',
   '**Final dimensional and edge-prep inspection records** — reference back to material heat number for full lot traceability'],
  ['Yes �?�?50 µm is the burr control target on tissue slitting',
   'Yes — `≤ 50 µm` is the burr control target on tissue slitting'],

  // ── — (em dash) — H1 headings ────────────────────────────────────────
  ['# Serrated Blade �?6�?2 TPI',
   '# Serrated Blade — 6–12 TPI'],
  ['# Shear Blade �?Guillotine 300 × 60 mm',
   '# Shear Blade — Guillotine 300 × 60 mm'],
  ['# Straight Converting Blade �?300 × 80 mm',
   '# Straight Converting Blade — 300 × 80 mm'],
  ['# Circular Slitting Blade �?250 mm OD',
   '# Circular Slitting Blade Ø250 mm OD'],

  // ── — (em dash) — application bullet labels (must beat simple list) ──
  ['**Paper slitting (40�?00 gsm)** �?compatible with Atlas',
   '**Paper slitting (40–400 gsm)** — compatible with Atlas'],
  ['**BOPP / PET film slitting (12�?00 μm)** �?compatible with Kampf',
   '**BOPP / PET film slitting (12–100 μm)** — compatible with Kampf'],
  ['**Aluminium foil slitting (6�?0 μm)** �?compatible with Kampf',
   '**Aluminium foil slitting (6–30 μm)** — compatible with Kampf'],
  ['**Tape and label stock slitting** �?compatible with Mark Andy',
   '**Tape and label stock slitting** — compatible with Mark Andy'],
  ['**Laminate slitting** �?compatible with Nordmeccanica',
   '**Laminate slitting** — compatible with Nordmeccanica'],

  // ── — (em dash) — list-item separators (slitter-blade material list) ─
  ['**Standard:** D2 (1.2379) �?high-chromium cold-work steel',
   '**Standard:** D2 (1.2379) — high-chromium cold-work steel'],
  ['**For higher speeds:** M2 HSS (1.3343) �?better red-hardness',
   '**For higher speeds:** M2 HSS (1.3343) — better red-hardness'],
  ['**For thin gauges:** SKD11 / DC53 �?refined carbide',
   '**For thin gauges:** SKD11 / DC53 — refined carbide'],
  ['**D2 (1.2379)** �?standard grade for paper',
   '**D2 (1.2379)** — standard grade for paper'],
  ['**SKD11 / DC53** �?first choice for thin gauges',
   '**SKD11 / DC53** — first choice for thin gauges'],
  ['**M2 HSS (1.3343)** �?recommended where the edge runs hot',
   '**M2 HSS (1.3343)** — recommended where the edge runs hot'],
  ['**Tungsten-carbide tipped** �?for the most abrasive feedstocks',
   '**Tungsten-carbide tipped** — for the most abrasive feedstocks'],
  ['**V-tooth** �?clean cut for tear strips',
   '**V-tooth** — clean cut for tear strips'],
  ['**Hook-tooth** �?pulls material into the cut',
   '**Hook-tooth** — pulls material into the cut'],
  ['**Scallop-tooth** �?soft, decorative edge',
   '**Scallop-tooth** — soft, decorative edge'],
  ['**D2 (1.2379)** �?standard for stainless and high-silicon steels',
   '**D2 (1.2379)** — standard for stainless and high-silicon steels'],
  ['**6CrW2Si** �?Chinese GB grade, shock-resistant',
   '**6CrW2Si** — Chinese GB grade, shock-resistant'],
  ['**H13 (1.2344)** �?hot-work tool steel',
   '**H13 (1.2344)** — hot-work tool steel'],
  ['**Single-bevel** for paper and label stock �?fast, repeatable edge.',
   '**Single-bevel** for paper and label stock — fast, repeatable edge.'],
  ['**Double-bevel** for film and laminate �?symmetric edge, easier installation.',
   '**Double-bevel** for film and laminate — symmetric edge, easier installation.'],
  ['**Edge preparation** �?micro-hone 5�?5 μm',
   '**Edge preparation** — micro-hone 5–15 μm'],
  ['**Optional PVD coating** �?TiN / TiCN / CrN per ISO 14574',
   '**Optional PVD coating** — TiN / TiCN / CrN per ISO 14574'],
  ['**CMM inspection** �?every dimension reported',
   '**CMM inspection** — every dimension reported'],
  ['at Rockwell C �?HRC 58±2 confirmed before grinding',
   'at Rockwell C — HRC 58±2 confirmed before grinding'],
  ['Final dimensions, tolerances and hardness are confirmed in the engineering quotation �?contact engineering with your drawing',
   'Final dimensions, tolerances and hardness are confirmed in the engineering quotation — contact engineering with your drawing'],

  // ── TODO — opening clause ─────────────────────────────────────────────
  ['TODO �?drawing available on request.',
   'TODO — drawing available on request.'],
  ['TODO �?for a quote, send the substrate thickness',
   'TODO — for a quote, send the substrate thickness'],
  ['TODO �?quote this SKU or a custom size by sending',
   'TODO — quote this SKU or a custom size by sending'],
  ['TODO �?send plate thickness, grade',
   'TODO — send plate thickness, grade'],

  // ── — (em dash) — D2 alt: frontmatter value ──────────────────────────
  ["bladeMaterial: 'D2 (1.2379) �?alt: SKD11, M2 HSS'",
   "bladeMaterial: 'D2 (1.2379) — alt: SKD11, M2 HSS'"],
  ["bladeMaterial: 'D2 (1.2379) �?alt: SKD11, 6CrW2Si, H13'",
   "bladeMaterial: 'D2 (1.2379) — alt: SKD11, 6CrW2Si, H13'"],

  // ── — (em dash) — coating frontmatter value ──────────────────────────
  ["coating: 'TiN (standard) �?TiCN / CrN / DLC on request'",
   "coating: 'TiN (standard) — TiCN / CrN / DLC on request'"],

  // ── – (en dash) — number ranges ──────────────────────────────────────
  ['running 80�?00 m/min',     'running 80–400 m/min'],
  ['hardness: \'HRC 55�?0\'',  'hardness: \'HRC 55–60\''],
  ['| Hardness        | HRC 55�?0                   |',
   '| Hardness        | HRC 55–60                   |'],
  ['20�?5 working days', '20–25 working days'],
  ['5�?0 working days',  '5–10 working days'],
  ['at 1000�?050 °C',    'at 1000–1050 °C'],
  ['(~0.1�?.3 mm per side)', '(~0.1–0.3 mm per side)'],
  ['micro-hone 5�?5 μm', 'micro-hone 5–15 μm'],
  ['typically 8�?0× the edge life',
   'typically 8–10× the edge life'],
  ['| Coating (optional) | TiN 2�? μm | per ISO 14574 |',
   '| Coating (optional) | TiN 2–4 μm | per ISO 14574 |'],

  // ── Length / width range guesses — one digit was eaten by mojibake.
  // straight-blade: 300 mm blade, 100–500 mm stock range (typical).
  // shear-blade:    300 mm blade, 100–3000 mm stock range (heavy-duty shear).
  ['300 mm (range 100�?00 mm)  |', '300 mm (range 100–500 mm)  |'],
  ['300 mm (range 100�?00 mm)   |', '300 mm (range 100–500 mm)   |'],
  ['60 mm (range 30�?00 mm)     |', '60 mm (range 30–200 mm)     |'],
  ['80 mm (range 30�?50 mm)     |', '80 mm (range 30–100 mm)     |'],
  ['300 mm (range 100�?000 mm)  |', '300 mm (range 100–3000 mm)  |'],

  // ── ± (tolerance) ─────────────────────────────────────────────────────
  ['parallel-tolerance of �?0.01 mm', 'parallel-tolerance of ±0.01 mm'],
  ['| Flatness        | �?0.01 mm        |', '| Flatness        | ±0.01 mm        |'],
  ['| Parallelism     | �?0.01 mm        |', '| Parallelism     | ±0.01 mm        |'],
  ['| Concentricity   | �?0.02 mm        |', '| Concentricity   | ±0.02 mm        |'],
  ['| Flatness        | �?0.02 mm                   |',
   '| Flatness        | ±0.02 mm                   |'],
  ['| Flatness | �?0.01 mm | full �? |', '| Flatness | ±0.01 mm | full Ø |'],
  ['| Parallelism | �?0.01 mm | full �? |', '| Parallelism | ±0.01 mm | full Ø |'],

  // ── ≤ ≥ (comparison) ─────────────────────────────────────────────────
  ['| Surface roughness | Ra �?0.4 µm |', '| Surface roughness | Ra ≤ 0.4 µm |'],
  ['| Surface finish  | Ra �?0.4 µm                 |',
   '| Surface finish  | Ra ≤ 0.4 µm                 |'],
  ['| Cutting capacity| �?12 mm mild / �?8 mm SS    |',
   '| Cutting capacity| ≤ 12 mm mild / ≤ 8 mm SS    |'],
  ['| Burr control target | �?50 µm |', '| Burr control target | ≤ 50 µm |'],
  ['- Cpk �?1.33 on critical dimensions', '- Cpk ≥ 1.33 on critical dimensions'],

  // ── → (traceability arrow) ────────────────────────────────────────────
  ['heat number �?finished blade', 'heat number → finished blade'],

  // ── – (en dash) — applications list bullets (must come after the
  //     40�?00/12�?00/6�?0 ranges that overlap) ───────────────────────
  ['Paper slitting (40�?00 gsm)',          'Paper slitting (40–400 gsm)'],
  ['BOPP / PET film slitting (12�?00 μm)','BOPP / PET film slitting (12–100 μm)'],
  ['Aluminium foil slitting (6�?0 μm)',  'Aluminium foil slitting (6–30 μm)'],

  // ── Ø (diameter) — body title ─────────────────────────────────────────
  ['Circular Slitting Blade �?250 mm OD', 'Circular Slitting Blade Ø250 mm OD'],

  // ── Slitter-blade — 3-column table variant (no trailing space) ────────
  ['| Flatness | �?0.01 mm | full �?|', '| Flatness | ±0.01 mm | full Ø |'],
  ['| Parallelism | �?0.01 mm | full �?|', '| Parallelism | ±0.01 mm | full Ø |'],
  ['| Concentricity | �?0.02 mm | vs ID |', '| Concentricity | ±0.02 mm | vs ID |'],
  ['| Surface roughness | Ra �?0.4 μm | ground |', '| Surface roughness | Ra ≤ 0.4 μm | ground |'],
  ['| Coating (optional) | TiN 2�? μm | per ISO 14574 |',
   '| Coating (optional) | TiN 2–4 μm | per ISO 14574 |'],

  // ── Slitter-blade — application bullet (with "- " prefix) ────────────
  ['- **Paper slitting (40�?00 gsm)** �?compatible with Atlas',
   '- **Paper slitting (40–400 gsm)** — compatible with Atlas'],
  ['- **BOPP / PET film slitting (12�?00 μm)** �?compatible with Kampf',
   '- **BOPP / PET film slitting (12–100 μm)** — compatible with Kampf'],
  ['- **Aluminium foil slitting (6�?0 μm)** �?compatible with Kampf',
   '- **Aluminium foil slitting (6–30 μm)** — compatible with Kampf'],

  // ── Slitter-blade — sentence-level em dash ──────────────────────────
  ['Hardness survey �?three-point Rockwell C mapping',
   'Hardness survey — three-point Rockwell C mapping'],

  // ── Bed-knife — FAQ answer with two consecutive mojibakes ─────────────
  //   Original markdown source had two corrupted symbols back-to-back:
  //   Yes U+FFFD? U+FFFD? 50 µm …  →  Yes — ≤ 50 µm …
  //   (no backtick in the byte stream; the read_files tool added one when
  //   rendering the markdown visually.)
  ['Yes �?�?50 µm is the burr control target on tissue slitting',
   'Yes — ≤ 50 µm is the burr control target on tissue slitting'],

  // ── Granulator-rotor-knife

  // ── Granulator-rotor-knife — title / metadata ────────────────────────
  ["title: 'Granulator Rotor Knife �?200 × 40 × 20 mm'",
   "title: 'Granulator Rotor Knife — 200 × 40 × 20 mm'"],
  ["bladeMaterial: 'M2 HSS (1.3343) �?alt: D2, tungsten carbide tipped'",
   "bladeMaterial: 'M2 HSS (1.3343) — alt: D2, tungsten carbide tipped'"],
  ['# Granulator Rotor Knife �?200 × 40 × 20 mm',
   '# Granulator Rotor Knife — 200 × 40 × 20 mm'],

  // ── Granulator — number range guesses (one digit eaten by mojibake) ──
  // 200 mm blade: stock range 50–300 mm is industry-typical for granulator
  // rotors (100 / 150 / 200 / 250 / 300 mm stocked).
  // 40 mm wide:  25–50 mm range covers common widths.
  // 20 mm thick: 12–25 mm range covers common thicknesses.
  ['| Length          | 200 mm (range 50�?00 mm)    |',
   '| Length          | 200 mm (range 50–300 mm)    |'],
  ['| Width           | 40 mm (range 25�?0 mm)      |',
   '| Width           | 40 mm (range 25–50 mm)      |'],
  ['| Thickness       | 20 mm (range 12�?0 mm)      |',
   '| Thickness       | 20 mm (range 12–25 mm)      |'],

  // ── Granulator — table tolerance / comparison / arrow ────────────────
  ['| Surface finish  | Ra �?0.4 µm                 |',
   '| Surface finish  | Ra ≤ 0.4 µm                 |'],
  ['| Flatness        | �?0.02 mm                   |',
   '| Flatness        | ±0.02 mm                   |'],

  // ── Granulator — list-item separators + service-life range ───────────
  ['**M2 HSS (1.3343)** �?first choice for granulators',
   '**M2 HSS (1.3343)** — first choice for granulators'],
  ['**D2 (1.2379)** �?slightly tougher, used where contamination',
   '**D2 (1.2379)** — slightly tougher, used where contamination'],
  ['**Tungsten carbide tipped** �?for the most abrasive feedstocks',
   '**Tungsten carbide tipped** — for the most abrasive feedstocks'],
  ['typically 8�?0× the life of HSS',
   'typically 8–10× the life of HSS'],
  ['0.1�?.3 mm depending on material',
   '0.1–0.3 mm depending on material'],
  ['TODO �?for a quote, send machine model',
   'TODO — for a quote, send machine model'],
  ["title: 'Custom Blade �?Reverse-Engineered from Sample'",
   "title: 'Custom Blade — Reverse-Engineered from Sample'"],
  ["bladeMaterial: 'Specified per application �?D2, SKD11, DC53, M2 HSS, H13, carbide'",
   "bladeMaterial: 'Specified per application — D2, SKD11, DC53, M2 HSS, H13, carbide'"],
  ["hardness: 'Specified per application �?HRC 50�?4'",
   "hardness: 'Specified per application — HRC 50±4'"],
  ["# Custom Blade �?Reverse-Engineered from Sample",
   "# Custom Blade — Reverse-Engineered from Sample"],
  ["we can reverse-engineer a replacement from the worn part. Send us the part (or a 3D scan / drawing), tell us what is failing on it, and our engineering team will design a replacement that fits �?often with an upgraded material grade or geometry.",
   "we can reverse-engineer a replacement from the worn part. Send us the part (or a 3D scan / drawing), tell us what is failing on it, and our engineering team will design a replacement that fits — often with an upgraded material grade or geometry."],
  ["Same QC chain as our standard SKUs �?CMM inspection report",
   "Same QC chain as our standard SKUs — CMM inspection report"],
  ["The original blade is failing prematurely �?we can usually identify why",
   "The original blade is failing prematurely — we can usually identify why"],
  ["TODO �?send your sample or drawing",
   "TODO — send your sample or drawing"],
  ["| 304 / 316 strip | 0.10.5 mm | Slitting |",
   "| 304 / 316 strip | 0.1–0.5 mm | Slitting |"],
  ["| 304 / 316 sheet | 0.52 mm | Slitting / cut-to-length |",
   "| 304 / 316 sheet | 0.5–2 mm | Slitting / cut-to-length |"],
  ["| 304 / 316 plate | 24 mm | Shear | Carbide shear inserts |",
   "| 304 / 316 plate | 2–4 mm | Shear | Carbide shear inserts |"],
  ["| 304 / 316 plate | 46 mm | Shear | Carbide shear inserts only |",
   "| 304 / 316 plate | 4–6 mm | Shear | Carbide shear inserts only |"],
  ["| 430 / 409 strip | 0.31 mm | Slitting |",
   "| 430 / 409 strip | 0.3–1 mm | Slitting |"],
  ["| 430 / 409 sheet | 13 mm | Blanking / shear |",
   "| 430 / 409 sheet | 1–3 mm | Blanking / shear |"],
  ["| 420 / 410 plate | 14 mm | Shear | D2 or HSS | HRC 60 | 510 ��m |",
   "| 420 / 410 plate | 1–4 mm | Shear | D2 or HSS | HRC 60 | 5–10 µm |"],
  ["| 17-4PH plate | 16 mm | Shear / blanking | M2 HSS or carbide | HRC 6264 | 510 ��m |",
   "| 17-4PH plate | 1–6 mm | Shear / blanking | M2 HSS or carbide | HRC 62–64 | 5–10 µm |"],
  ["| 2205 duplex | 14 mm | Shear |",
   "| 2205 duplex | 1–4 mm | Shear |"],
  ["HRC 5860 | 5 ��m |",
   "HRC 58–60 | 5 µm |"],
  ["HRC 64 / 60 | 510 ��m |",
   "HRC 64 / 60 | 5–10 µm |"],
  ["HRC 64 | 510 ��m |",
   "HRC 64 | 5–10 µm |"],
  ["HRA 88+ | 0.050.10 mm |",
   "HRA 88+ | 0.05–0.10 mm |"],
  ["title: 'Custom Blade �?Reverse-Engineered from Sample'",
   "title: 'Custom Blade — Reverse-Engineered from Sample'"],
  ["bladeMaterial: 'Specified per application �?D2, SKD11, DC53, M2 HSS, H13, carbide'",
   "bladeMaterial: 'Specified per application — D2, SKD11, DC53, M2 HSS, H13, carbide'"],
  ["hardness: 'Specified per application �?HRC 50�?4'",
   "hardness: 'Specified per application — HRC 50±4'"],
  ["# Custom Blade �?Reverse-Engineered from Sample",
   "# Custom Blade — Reverse-Engineered from Sample"],
  ["we can reverse-engineer a replacement from the worn part. Send us the part (or a 3D scan / drawing), tell us what is failing on it, and our engineering team will design a replacement that fits �?often with an upgraded material grade or geometry.",
   "we can reverse-engineer a replacement from the worn part. Send us the part (or a 3D scan / drawing), tell us what is failing on it, and our engineering team will design a replacement that fits — often with an upgraded material grade or geometry."],
  ["Same QC chain as our standard SKUs �?CMM inspection report",
   "Same QC chain as our standard SKUs — CMM inspection report"],
  ["The original blade is failing prematurely �?we can usually identify why",
   "The original blade is failing prematurely — we can usually identify why"],
  ["TODO �?send your sample or drawing",
   "TODO — send your sample or drawing"],
  ["| 304 / 316 strip | 0.10.5 mm | Slitting |",
   "| 304 / 316 strip | 0.1–0.5 mm | Slitting |"],
  ["| 304 / 316 sheet | 0.52 mm | Slitting / cut-to-length |",
   "| 304 / 316 sheet | 0.5–2 mm | Slitting / cut-to-length |"],
  ["| 304 / 316 plate | 24 mm | Shear | Carbide shear inserts |",
   "| 304 / 316 plate | 2–4 mm | Shear | Carbide shear inserts |"],
  ["| 304 / 316 plate | 46 mm | Shear | Carbide shear inserts only |",
   "| 304 / 316 plate | 4–6 mm | Shear | Carbide shear inserts only |"],
  ["| 430 / 409 strip | 0.31 mm | Slitting |",
   "| 430 / 409 strip | 0.3–1 mm | Slitting |"],
  ["| 430 / 409 sheet | 13 mm | Blanking / shear |",
   "| 430 / 409 sheet | 1–3 mm | Blanking / shear |"],
  ["| 420 / 410 plate | 14 mm | Shear | D2 or HSS | HRC 60 | 510 ��m |",
   "| 420 / 410 plate | 1–4 mm | Shear | D2 or HSS | HRC 60 | 5–10 µm |"],
  ["| 17-4PH plate | 16 mm | Shear / blanking | M2 HSS or carbide | HRC 6264 | 510 ��m |",
   "| 17-4PH plate | 1–6 mm | Shear / blanking | M2 HSS or carbide | HRC 62–64 | 5–10 µm |"],
  ["| 2205 duplex | 14 mm | Shear |",
   "| 2205 duplex | 1–4 mm | Shear |"],
  ["HRC 5860 | 5 ��m |",
   "HRC 58–60 | 5 µm |"],
  ["HRC 64 / 60 | 510 ��m |",
   "HRC 64 / 60 | 5–10 µm |"],
  ["HRC 64 | 510 ��m |",
   "HRC 64 | 5–10 µm |"],
  ["HRA 88+ | 0.050.10 mm |",
   "HRA 88+ | 0.05–0.10 mm |"],
  ["title: 'Custom Blade �?Reverse-Engineered from Sample'",
   "title: 'Custom Blade — Reverse-Engineered from Sample'"],
  ["bladeMaterial: 'Specified per application �?D2, SKD11, DC53, M2 HSS, H13, carbide'",
   "bladeMaterial: 'Specified per application — D2, SKD11, DC53, M2 HSS, H13, carbide'"],
  ["hardness: 'Specified per application �?HRC 50�?4'",
   "hardness: 'Specified per application — HRC 50±4'"],
  ["# Custom Blade �?Reverse-Engineered from Sample",
   "# Custom Blade — Reverse-Engineered from Sample"],
  ["we can reverse-engineer a replacement from the worn part. Send us the part (or a 3D scan / drawing), tell us what is failing on it, and our engineering team will design a replacement that fits �?often with an upgraded material grade or geometry.",
   "we can reverse-engineer a replacement from the worn part. Send us the part (or a 3D scan / drawing), tell us what is failing on it, and our engineering team will design a replacement that fits — often with an upgraded material grade or geometry."],
  ["Same QC chain as our standard SKUs �?CMM inspection report",
   "Same QC chain as our standard SKUs — CMM inspection report"],
  ["The original blade is failing prematurely �?we can usually identify why",
   "The original blade is failing prematurely — we can usually identify why"],
  ["TODO �?send your sample or drawing",
   "TODO — send your sample or drawing"],
  ["| 304 / 316 strip | 0.10.5 mm | Slitting |",
   "| 304 / 316 strip | 0.1–0.5 mm | Slitting |"],
  ["| 304 / 316 sheet | 0.52 mm | Slitting / cut-to-length |",
   "| 304 / 316 sheet | 0.5–2 mm | Slitting / cut-to-length |"],
  ["| 304 / 316 plate | 24 mm | Shear | Carbide shear inserts |",
   "| 304 / 316 plate | 2–4 mm | Shear | Carbide shear inserts |"],
  ["| 304 / 316 plate | 46 mm | Shear | Carbide shear inserts only |",
   "| 304 / 316 plate | 4–6 mm | Shear | Carbide shear inserts only |"],
  ["| 430 / 409 strip | 0.31 mm | Slitting |",
   "| 430 / 409 strip | 0.3–1 mm | Slitting |"],
  ["| 430 / 409 sheet | 13 mm | Blanking / shear |",
   "| 430 / 409 sheet | 1–3 mm | Blanking / shear |"],
  ["| 420 / 410 plate | 14 mm | Shear | D2 or HSS | HRC 60 | 510 ��m |",
   "| 420 / 410 plate | 1–4 mm | Shear | D2 or HSS | HRC 60 | 5–10 µm |"],
  ["| 17-4PH plate | 16 mm | Shear / blanking | M2 HSS or carbide | HRC 6264 | 510 ��m |",
   "| 17-4PH plate | 1–6 mm | Shear / blanking | M2 HSS or carbide | HRC 62–64 | 5–10 µm |"],
  ["| 2205 duplex | 14 mm | Shear |",
   "| 2205 duplex | 1–4 mm | Shear |"],
  ["HRC 5860 | 5 ��m |",
   "HRC 58–60 | 5 µm |"],
  ["HRC 64 / 60 | 510 ��m |",
   "HRC 64 / 60 | 5–10 µm |"],
  ["HRC 64 | 510 ��m |",
   "HRC 64 | 5–10 µm |"],
  ["HRA 88+ | 0.050.10 mm |",
   "HRA 88+ | 0.05–0.10 mm |"],
  ["| 430 / 409 sheet | 1–3 mm | Blanking / shear | D2 or HSS | HRC 60 | 510 ��m |",
   "| 430 / 409 sheet | 1–3 mm | Blanking / shear | D2 or HSS | HRC 60 | 5–10 µm |"],
  ["| M2 HSS or carbide | \nHRC 64 | 510 ��m |",
   "| M2 HSS or carbide | \nHRC 64 | 5–10 µm |"],
  // ── Discovered 2026-09 via Cloudflare build failure ──────────────────────
  // PowerShell zh-CN replaced UTF-8 chars with these specific codepoints:
  ["鈥?", "—"],   // em dash
  ["脳", "×"],            // multiplication sign
  ["卤", "±"],            // plus-minus
  // ── Discovered 2026-09-22 in slitter-blade.md ─────────────────────────────
  // Six CJK fallback code points that PowerShell emits for symbols absent from
  // GBK's repertoire. Each is a pure-ASCII-equivalent substitution; no
  // context anchor needed because these characters never legitimately appear
  // in English data files under src/data/{product,post,glossary}/.
  ["脴", "Ø"],   // diameter sign
  ["掳", "°"],   // degree sign
  ["渭", "µ"],   // micro sign (U+00B5, NOT Greek mu U+03BC — engineering convention)
  ["鈮", "≥"],   // greater-than-or-equal
  ["鈫", "→"],   // rightwards arrow
  ["搂", "§"],   // section sign
  // ── Discovered 2026-09-22 in src/pages/solutions.astro ─────────────────
  // GBK fallback code points + 2-char patterns not covered above. Triggered
  // by Hero/Features/Steps/FAQs/CallToAction widgets receiving Chinese-edited
  // copy on /solutions/, /products/, and other top-level pages.
  ["碌", "µ"],              // micro sign (U+788C — most common fallback)
  ["鈥", "—"],              // standalone em-dash (U+9225, no trailing '?')
  ["鈥揔", "–"],            // en-dash in K-range, e.g. K10鈥揔20 → K10–K20
  ["鈹€", "─"],             // box-drawing decoration in JSX comment dividers
  ["鈮?1.33",   "≥ 1.33"],     // Cpk ≥ 1.33
  ["鈮?Ra",     "≤Ra"],        // roughness ≤ Ra 0.4 µm
  ["鈮?0.01 mm","≤ 0.01 mm"],  // run-out ≤ 0.01 mm
  ["鈮?2 mm",   "≤ 2 mm"],     // blade thickness ≤ 2 mm
  // ── Discovered 2026-09-23 on /services/ and /industries/ ──────────────
  // PowerShell fallback U+8DEF (路) for U+00B7 (· middle dot) — slipped past
  // check-unicode.mjs because 路 was missing from the GBK mojibake set.
  // Now both detection (check-unicode.mjs) and repair (this rule) cover it.
  ["路", "·"],
  // Literal `<` of `</a>` was downgraded to `?` by a PowerShell write —
  // surfaces as "Read more →?/a>" on /industries/. Context-anchored so it
  // cannot eat legitimate "?/a>" elsewhere.
  ["Read more →?/a>", "Read more →</a>"],
].sort((a, b) => b[0].length - a[0].length);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (st.isFile()) out.push(full);
  }
  return out;
}

function processFile(absPath) {
  const orig = readFileSync(absPath, 'utf8');
  let txt = orig;
  const hits = [];
  for (const [from, to] of RULES) {
    if (txt.includes(from)) {
      txt = txt.split(from).join(to);
      hits.push(from);
    }
  }
  if (txt === orig) return { changed: false, leftover: null };

  // Defensive: if any rule replaced text with another mojibake token, refuse
  // to write so a developer sees the warning instead of silently corrupting
  // the file. (Should never fire with the current rule table.)
  if (txt.includes('\uFFFD')) {
    const leftover = (txt.match(/.{0,24}\uFFFD.{0,24}/g) || []).slice(0, 10);
    return { changed: false, leftover };
  }

  // Normalize line endings to LF (.editorconfig says so; legacy CRLFs from
  // PowerShell survive in some files and would break prettier's CRLF rule).
  const before = Buffer.from(txt, 'utf8');
  txt = txt.replace(/\r\n/g, '\n');
  const after = Buffer.from(txt, 'utf8');

  writeFileSync(absPath, after);
  return { changed: true, hits, bytesDelta: after.length - before.length };
}

let totalFiles = 0;
let totalHits = 0;
let totalBytes = 0;
const leftovers = [];

for (const relDir of TARGET_DIRS) {
  const abs = join(ROOT, relDir);
  try {
    statSync(abs);
  } catch {
    continue;
  }
  for (const file of walk(abs)) {
    if (!FILE_EXT.test(file)) continue;
    const result = processFile(file);
    const rel = relative(ROOT, file).split(sep).join('/');
    if (result.changed) {
      totalFiles++;
      totalHits += result.hits.length;
      totalBytes += result.bytesDelta;
      console.log(`✓ ${rel}  (${result.hits.length} rule${result.hits.length === 1 ? '' : 's'}, ${result.bytesDelta >= 0 ? '+' : ''}${result.bytesDelta} B)`);
    } else if (result.leftover) {
      leftovers.push({ file: rel, lines: result.leftover });
    }
  }
}

console.log('');
console.log(`Files updated : ${totalFiles}`);
console.log(`Rules applied : ${totalHits}`);
console.log(`Net byte delta: ${totalBytes >= 0 ? '+' : ''}${totalBytes} B`);

if (leftovers.length) {
  console.error('');
  console.error('⚠ Remaining mojibake not covered by the rules above:');
  for (const { file, lines } of leftovers) {
    console.error(`  ${file}`);
    for (const l of lines) console.error(`    ${l}`);
  }
  process.exit(1);
}