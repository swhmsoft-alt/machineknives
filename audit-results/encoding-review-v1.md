# F-007 编码损坏审查队列 — Industrial Knives

> **目的**：本文档列出 Round 1 审计发现的所有 126 处 GBK→UTF-8 编码损坏，
> 等待 **产品/工程团队** 提供准确的数字。**禁止 AI 猜测补全**（`.clinerules` §0.5.3）。

## 损坏模式

原文（GBK 损坏后）       原文意图（UTF-8）
`"40—00 gsm"`        →    `"40–200 gsm"`      (en-dash + 两位数字被吃)
`"12—00 µm"`         →    `"12–100 µm"`
`"6—0 µm"`           →    `"6–40 µm"`
`"HRC 58—2"`         →    `"HRC 58–62"`
`"5—5 µm"`           →    `"5–15 µm"`
`"4— weeks"`         →    `"4–6 weeks"`
`"200 × 40 × 20 mm"` →    `"200 × 40 × 20 mm"`（× 可能被译为 `脳`）

## 损坏分布（按文件）

| 文件 | 损坏数 |
|---|---|
| `src/pages/industries/index.astro` | 27 |
| `src/pages/industries/paper-tissue.astro` | 19 |
| `src/data/product/slitter-blade.md` | 15 |
| `src/pages/industries/printing-packaging.astro` | 12 |
| `src/pages/industries/metalworking.astro` | 10 |
| `src/pages/industries/food-processing.astro` | 8 |
| `src/pages/industries/plastics-recycling.astro` | 8 |
| `src/data/product/granulator-rotor-knife-200x40.md` | 6 |
| `src/pages/industries/converting.astro` | 6 |
| `src/data/product/shear-blade-guillotine-300x60.md` | 4 |
| `src/data/product/straight-blade-converting-300x80.md` | 3 |
| `src/data/product/serrated-blade-teeth-per-inch.md` | 2 |
| `src/pages/products/index.astro` | 2 |
| `src/pages/solutions.astro` | 2 |
| `src/data/product/circular-blade-slitting-250mm.md` | 1 |
| `src/pages/quality.astro` | 1 |

**总计**：126 处，跨 16 个文件。

## `src/pages/industries/index.astro`（27 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 1 | 14 | `'KAIPU Industrial Blades has supplied precision machine knives to six core industries sinc…` | _[TODO: SME]_ |
| 2 | 64 | `{ amount: '5— wk', title: 'Standard Lead Time', icon: 'tabler:clock' },` | _[TODO: SME]_ |
| 3 | 81 | `'<strong>Best for:</strong> long-life bed knives and top blades for tissue converting line…` | _[TODO: SME]_ |
| 4 | 95 | `'<strong>Best for:</strong> granulator and shredder rotor / stator knives cutting through …` | _[TODO: SME]_ |
| 5 | 109 | `'<strong>Best for:</strong> guillotine and swing-beam shears cutting mild steel, stainless…` | _[TODO: SME]_ |
| 6 | 109 | `'<strong>Best for:</strong> guillotine and swing-beam shears cutting mild steel, stainless…` | _[TODO: SME]_ |
| 7 | 115 | `{ industry: 'Printing & Packaging', substrate: 'Paper, film, foil, laminate', grade: 'D2 /…` | _[TODO: SME]_ |
| 8 | 115 | `{ industry: 'Printing & Packaging', substrate: 'Paper, film, foil, laminate', grade: 'D2 /…` | _[TODO: SME]_ |
| 9 | 116 | `{ industry: 'Paper & Tissue', substrate: 'Tissue, towel, napkin', grade: 'D2 / 1.2379', ha…` | _[TODO: SME]_ |
| 10 | 116 | `{ industry: 'Paper & Tissue', substrate: 'Tissue, towel, napkin', grade: 'D2 / 1.2379', ha…` | _[TODO: SME]_ |
| 11 | 116 | `{ industry: 'Paper & Tissue', substrate: 'Tissue, towel, napkin', grade: 'D2 / 1.2379', ha…` | _[TODO: SME]_ |
| 12 | 117 | `{ industry: 'Food Processing', substrate: 'Bread, cheese, meat, vegetable', grade: '440C /…` | _[TODO: SME]_ |
| 13 | 117 | `{ industry: 'Food Processing', substrate: 'Bread, cheese, meat, vegetable', grade: '440C /…` | _[TODO: SME]_ |
| 14 | 118 | `{ industry: 'Plastics Recycling', substrate: 'PE, PP, PET, glass-filled', grade: 'D2 + TiN…` | _[TODO: SME]_ |
| 15 | 118 | `{ industry: 'Plastics Recycling', substrate: 'PE, PP, PET, glass-filled', grade: 'D2 + TiN…` | _[TODO: SME]_ |
| 16 | 119 | `{ industry: 'Converting', substrate: 'Pouch, label, adhesive tape', grade: 'M2 / SKH51', h…` | _[TODO: SME]_ |
| 17 | 119 | `{ industry: 'Converting', substrate: 'Pouch, label, adhesive tape', grade: 'M2 / SKH51', h…` | _[TODO: SME]_ |
| 18 | 120 | `{ industry: 'Metalworking', substrate: 'Mild / stainless / aluminium plate', grade: 'D2 / …` | _[TODO: SME]_ |
| 19 | 120 | `{ industry: 'Metalworking', substrate: 'Mild / stainless / aluminium plate', grade: 'D2 / …` | _[TODO: SME]_ |
| 20 | 139 | `'A prototype is shipped for a 2— week field trial on your line. Yield, defect rate and edg…` | _[TODO: SME]_ |
| 21 | 143 | `title: 'Step 4: Production with 5— weeks lead time',` | _[TODO: SME]_ |
| 22 | 176 | `'Standard geometries ship in 5— weeks. Custom builds against a new drawing typically ship …` | _[TODO: SME]_ |
| 23 | 176 | `'Standard geometries ship in 5— weeks. Custom builds against a new drawing typically ship …` | _[TODO: SME]_ |
| 24 | 198 | `'Every KAIPU blade is qualified against a proprietary 5-Factor framework before it leaves …` | _[TODO: SME]_ |
| 25 | 226 | `{ "@type": "HowToStep", "position": 3, "name": "Sample and field trial", "text": "Prototyp…` | _[TODO: SME]_ |
| 26 | 227 | `{ "@type": "HowToStep", "position": 4, "name": "Production", "text": "5— weeks lead time o…` | _[TODO: SME]_ |
| 27 | 237 | `subtitle="Each industry carries its own cutting mechanics —web tension, abrasive wear, hyg…` | _[TODO: SME]_ |

## `src/pages/industries/paper-tissue.astro`（19 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 28 | 11 | `'Long-life bed knives and top blades for tissue converting lines at 600—,400 m/min. D2 / M…` | _[TODO: SME]_ |
| 29 | 24 | `'Validated on 1-ply, 2-ply and 3-ply tissue at 13—0 gsm per ply, including through-air-dri…` | _[TODO: SME]_ |
| 30 | 30 | `'Production-validated on tissue lines running 600 —2,400 m/min. Higher speeds require tigh…` | _[TODO: SME]_ |
| 31 | 36 | `'Bed-knife shear angle and top-blade clearance optimised per OEM (typically 20°—4° shear, …` | _[TODO: SME]_ |
| 32 | 36 | `'Bed-knife shear angle and top-blade clearance optimised per OEM (typically 20°—4° shear, …` | _[TODO: SME]_ |
| 33 | 42 | `'D2 (1.2379) and SKD11 for bed knives; M2 high-speed steel (1.3343) for top blades where i…` | _[TODO: SME]_ |
| 34 | 42 | `'D2 (1.2379) and SKD11 for bed knives; M2 high-speed steel (1.3343) for top blades where i…` | _[TODO: SME]_ |
| 35 | 48 | `'Bed-knife flatness ≥?0.02 mm across the full cutting length (typically 2,000 —4,200 mm). …` | _[TODO: SME]_ |
| 36 | 54 | `'Common service interval on premium uncoated D2 bed knives is 8—4 weeks on 2-ply tissue. P…` | _[TODO: SME]_ |
| 37 | 54 | `'Common service interval on premium uncoated D2 bed knives is 8—4 weeks on 2-ply tissue. P…` | _[TODO: SME]_ |
| 38 | 64 | `subtitle="Long-life tooling for tissue converting lines running 600—,400 m/min. Optimised …` | _[TODO: SME]_ |
| 39 | 64 | `subtitle="Long-life tooling for tissue converting lines running 600—,400 m/min. Optimised …` | _[TODO: SME]_ |
| 40 | 64 | `subtitle="Long-life tooling for tissue converting lines running 600—,400 m/min. Optimised …` | _[TODO: SME]_ |
| 41 | 82 | `The two failure modes we see most often —dust generation and ply separation —both trace ba…` | _[TODO: SME]_ |
| 42 | 88 | `description: 'Bed-knife shear angle 20°—4°, top-blade clearance 0.5°—.5° per OEM. Correct …` | _[TODO: SME]_ |
| 43 | 88 | `description: 'Bed-knife shear angle 20°—4°, top-blade clearance 0.5°—.5° per OEM. Correct …` | _[TODO: SME]_ |
| 44 | 93 | `description: 'Bed-knife flatness ≥?0.02 mm across the full cutting length (typically 2,000…` | _[TODO: SME]_ |
| 45 | 98 | `description: 'D2 / SKD11 bed knives at HRC 58—2; M2 HSS top blades at HRC 60—4 where impac…` | _[TODO: SME]_ |
| 46 | 98 | `description: 'D2 / SKD11 bed knives at HRC 58—2; M2 HSS top blades at HRC 60—4 where impac…` | _[TODO: SME]_ |

## `src/data/product/slitter-blade.md`（15 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 47 | 3 | `excerpt: 'D2 tool steel circular knife for paper and film slitting, 250 mm OD, hardened HR…` | _[TODO: SME]_ |
| 48 | 10 | `- Paper slitting (40—00 gsm)` | _[TODO: SME]_ |
| 49 | 11 | `- BOPP / PET film slitting (12—00 μm)` | _[TODO: SME]_ |
| 50 | 12 | `- Aluminium foil slitting (6—0 μm)` | _[TODO: SME]_ |
| 51 | 38 | `\| Coating (optional) \| TiN 2— μm \| per ISO 14574 \|` | _[TODO: SME]_ |
| 52 | 44 | `- **Paper slitting (40—00 gsm)** —compatible with Atlas, Kampf, Goebel, Bielomatik, Pasaba…` | _[TODO: SME]_ |
| 53 | 45 | `- **BOPP / PET film slitting (12—00 μm)** —compatible with Kampf, Atlas Titan, Aesus, Kloc…` | _[TODO: SME]_ |
| 54 | 46 | `- **Aluminium foil slitting (6—0 μm)** —compatible with Kampf, Rotomec, Deurotech and Henk…` | _[TODO: SME]_ |
| 55 | 55 | `- **Tungsten-carbide tipped** —for the most abrasive feedstocks, typically 8—0× the edge l…` | _[TODO: SME]_ |
| 56 | 59 | `1. **Austenitization** at 1000—050 °C in vacuum furnace, followed by nitrogen / oil quench` | _[TODO: SME]_ |
| 57 | 62 | `4. **Precision grinding** with distortion allowance (~0.1—.3 mm per side) reserved in stoc…` | _[TODO: SME]_ |
| 58 | 63 | `5. **Edge preparation** —micro-hone 5—5 μm specified per application` | _[TODO: SME]_ |
| 59 | 77 | `- Standard stocked OD sizes ship in 5—0 working days` | _[TODO: SME]_ |
| 60 | 78 | `- Custom non-stock OD sizes follow the 8-step process and ship in 20—5 working days from d…` | _[TODO: SME]_ |
| 61 | 79 | `- Reverse-engineered parts add 5—0 working days for CMM measurement and drawing-approval s…` | _[TODO: SME]_ |

## `src/pages/industries/printing-packaging.astro`（12 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 62 | 11 | `'Precision slitting, sheeting and rewinding blades for printing and packaging lines. Paper…` | _[TODO: SME]_ |
| 63 | 11 | `'Precision slitting, sheeting and rewinding blades for printing and packaging lines. Paper…` | _[TODO: SME]_ |
| 64 | 11 | `'Precision slitting, sheeting and rewinding blades for printing and packaging lines. Paper…` | _[TODO: SME]_ |
| 65 | 24 | `'Paper 40—00 gsm, BOPP / PET / PE film 12—00 µm, alu-foil 6—0 µm, and common laminate stru…` | _[TODO: SME]_ |
| 66 | 24 | `'Paper 40—00 gsm, BOPP / PET / PE film 12—00 µm, alu-foil 6—0 µm, and common laminate stru…` | _[TODO: SME]_ |
| 67 | 24 | `'Paper 40—00 gsm, BOPP / PET / PE film 12—00 µm, alu-foil 6—0 µm, and common laminate stru…` | _[TODO: SME]_ |
| 68 | 30 | `'Sharp edge < 5 µm for film and printed surfaces, light hone 5—5 µm for substrate edges, m…` | _[TODO: SME]_ |
| 69 | 30 | `'Sharp edge < 5 µm for film and printed surfaces, light hone 5—5 µm for substrate edges, m…` | _[TODO: SME]_ |
| 70 | 36 | `'D2 (DIN 1.2379) per ASTM A681 and JIS SKD11 (G4404). Hardness HRC 58—2 for general slitti…` | _[TODO: SME]_ |
| 71 | 64 | `subtitle="Tight burr control protects printed surfaces and clean edges on slitter-rewinder…` | _[TODO: SME]_ |
| 72 | 88 | `description: 'Sharp < 5 µm for film and printed surfaces; light hone 5—5 µm for paper edge…` | _[TODO: SME]_ |
| 73 | 88 | `description: 'Sharp < 5 µm for film and printed surfaces; light hone 5—5 µm for paper edge…` | _[TODO: SME]_ |

## `src/pages/industries/metalworking.astro`（10 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 74 | 11 | `'Shear blades for guillotine and swing-beam cutting of mild steel, stainless and aluminium…` | _[TODO: SME]_ |
| 75 | 30 | `'Production-validated on mild steel up to 12 mm, stainless steel up to 8 mm, aluminium up …` | _[TODO: SME]_ |
| 76 | 36 | `'Cold-work tool steel D2 (DIN 1.2379, JIS SKD11), 1.2379 modified grades, and high-chromiu…` | _[TODO: SME]_ |
| 77 | 42 | `'Single-bevel and four-edge indexable designs. Bevel angle 1°—° on lower blade, 1°—° on up…` | _[TODO: SME]_ |
| 78 | 54 | `'Four-edge indexable blades supplied with up to 4 regrinds before geometry falls below OEM…` | _[TODO: SME]_ |
| 79 | 64 | `subtitle="Mild steel, stainless and aluminium plate up to 12 mm. HRC 58—2 working hardness…` | _[TODO: SME]_ |
| 80 | 88 | `description: 'Clearance per OEM recommendation, typically 5—0 % of plate thickness. Tight …` | _[TODO: SME]_ |
| 81 | 88 | `description: 'Clearance per OEM recommendation, typically 5—0 % of plate thickness. Tight …` | _[TODO: SME]_ |
| 82 | 88 | `description: 'Clearance per OEM recommendation, typically 5—0 % of plate thickness. Tight …` | _[TODO: SME]_ |
| 83 | 98 | `description: 'Cutting edge flatness ≥?0.02 mm across the blade length. Edge radius 0.05—.2…` | _[TODO: SME]_ |

## `src/pages/industries/food-processing.astro`（8 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 84 | 24 | `'Martensitic stainless 1.4116 (AISI 440B) and 1.4034 (AISI 420) for direct food-contact ap…` | _[TODO: SME]_ |
| 85 | 24 | `'Martensitic stainless 1.4116 (AISI 440B) and 1.4034 (AISI 420) for direct food-contact ap…` | _[TODO: SME]_ |
| 86 | 48 | `'Honed edge 10—5 µm for clean slicing, scalloped / serrated for crusty product, micro-hone…` | _[TODO: SME]_ |
| 87 | 48 | `'Honed edge 10—5 µm for clean slicing, scalloped / serrated for crusty product, micro-hone…` | _[TODO: SME]_ |
| 88 | 48 | `'Honed edge 10—5 µm for clean slicing, scalloped / serrated for crusty product, micro-hone…` | _[TODO: SME]_ |
| 89 | 48 | `'Honed edge 10—5 µm for clean slicing, scalloped / serrated for crusty product, micro-hone…` | _[TODO: SME]_ |
| 90 | 79 | `Food lines are washed down 2— times per shift with chlorinated sanitiser at 60—0 °C. A bla…` | _[TODO: SME]_ |
| 91 | 79 | `Food lines are washed down 2— times per shift with chlorinated sanitiser at 60—0 °C. A bla…` | _[TODO: SME]_ |

## `src/pages/industries/plastics-recycling.astro`（8 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 92 | 11 | `'Granulator and shredder rotor / stator knives for plastics recycling. D2, SKD11 and M2 HS…` | _[TODO: SME]_ |
| 93 | 40 | `'D2 (1.2379 / SKD11) for general-purpose cutting, M2 high-speed steel (1.3343) for impact-…` | _[TODO: SME]_ |
| 94 | 40 | `'D2 (1.2379 / SKD11) for general-purpose cutting, M2 high-speed steel (1.3343) for impact-…` | _[TODO: SME]_ |
| 95 | 46 | `'TiN, TiCN and CrN coatings per ISO 14574 extend service interval 2—× on glass-fibre and m…` | _[TODO: SME]_ |
| 96 | 46 | `'TiN, TiCN and CrN coatings per ISO 14574 extend service interval 2—× on glass-fibre and m…` | _[TODO: SME]_ |
| 97 | 52 | `'Hook angle 8°—5° for general-purpose, 18°—2° for high-throughput reclaim. Clearance angle…` | _[TODO: SME]_ |
| 98 | 52 | `'Hook angle 8°—5° for general-purpose, 18°—2° for high-throughput reclaim. Clearance angle…` | _[TODO: SME]_ |
| 99 | 68 | `subtitle="Engineered to cut through contamination, glass fibre and reinforced polymers. D2…` | _[TODO: SME]_ |

## `src/data/product/granulator-rotor-knife-200x40.md`（6 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 100 | 2 | `title: 'Granulator Rotor Knife —200 × 40 × 20 mm'` | _[TODO: SME]_ |
| 101 | 22 | `\| Length          \| 200 mm (range 50—[MISSING SPEC: length max in mm] mm)    \|` | _[TODO: SME]_ |
| 102 | 23 | `\| Width           \| 40 mm (range 25—[MISSING SPEC: width max in mm] mm)      \|` | _[TODO: SME]_ |
| 103 | 24 | `\| Thickness       \| 20 mm (range 12—[MISSING SPEC: thickness max in mm] mm)      \|` | _[TODO: SME]_ |
| 104 | 34 | `- **Tungsten carbide tipped** —for the most abrasive feedstocks, typically 8—[MISSING SPEC…` | _[TODO: SME]_ |
| 105 | 38 | `The rotor knife works in shear against a stator (bed knife). We supply matched sets; rotor…` | _[TODO: SME]_ |

## `src/pages/industries/converting.astro`（6 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 106 | 30 | `'Score depth 0.05 —0.50 mm controlled to ± 0.01 mm, score angle 30°—0°, score width 0.2 —1…` | _[TODO: SME]_ |
| 107 | 30 | `'Score depth 0.05 —0.50 mm controlled to ± 0.01 mm, score angle 30°—0°, score width 0.2 —1…` | _[TODO: SME]_ |
| 108 | 30 | `'Score depth 0.05 —0.50 mm controlled to ± 0.01 mm, score angle 30°—0°, score width 0.2 —1…` | _[TODO: SME]_ |
| 109 | 30 | `'Score depth 0.05 —0.50 mm controlled to ± 0.01 mm, score angle 30°—0°, score width 0.2 —1…` | _[TODO: SME]_ |
| 110 | 88 | `description: 'Edge radius selected per substrate: sharp < 5 µm for film, light hone 5—5 µm…` | _[TODO: SME]_ |
| 111 | 88 | `description: 'Edge radius selected per substrate: sharp < 5 µm for film, light hone 5—5 µm…` | _[TODO: SME]_ |

## `src/data/product/shear-blade-guillotine-300x60.md`（4 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 112 | 6 | `hardness: 'HRC 55—0'` | _[TODO: SME]_ |
| 113 | 22 | `\| Length          \| 300 mm (range 100—000 mm)  \|` | _[TODO: SME]_ |
| 114 | 23 | `\| Width           \| 60 mm (range 30—00 mm)     \|` | _[TODO: SME]_ |
| 115 | 28 | `\| Hardness        \| HRC 55—0                   \|` | _[TODO: SME]_ |

## `src/data/product/straight-blade-converting-300x80.md`（3 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 116 | 2 | `title: 'Straight Converting Blade —300 × 80 mm'` | _[TODO: SME]_ |
| 117 | 22 | `\| Length          \| 300 mm (range 100—00 mm)   \|` | _[TODO: SME]_ |
| 118 | 23 | `\| Width           \| 80 mm (range 30—00 mm)     \|` | _[TODO: SME]_ |

## `src/data/product/serrated-blade-teeth-per-inch.md`（2 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 119 | 2 | `title: 'Serrated Blade —Cut-to-Length 6—2 TPI'` | _[TODO: SME]_ |
| 120 | 39 | `> TODO —for a quote, send the substrate thickness, the desired tooth profile and pitch (TP…` | _[TODO: SME]_ |

## `src/pages/products/index.astro`（2 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 121 | 422 | `'Recurring customers run on a quarterly cadence (e.g. 20—0 pieces / quarter). Capacity is …` | _[TODO: SME]_ |
| 122 | 432 | `'Export crating, FOB / CIF / DAP terms arranged by our shipping team. Typical European lea…` | _[TODO: SME]_ |

## `src/pages/solutions.astro`（2 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 123 | 498 | `'Standard custom blades: 15–25 business days from drawing confirmation. Express 7–10 busin…` | _[TODO: SME]_ |
| 124 | 508 | `'Yes. Send the worn blade and we will return it sharpened, recoated if requested, and insp…` | _[TODO: SME]_ |

## `src/data/product/circular-blade-slitting-250mm.md`（1 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 125 | 40 | `> TODO —drawing available on request. Lead time for stocked OD sizes is 10 working days; c…` | _[TODO: SME]_ |

## `src/pages/quality.astro`（1 处）

| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |
|---|---|---|---|
| 126 | 170 | `{ kpi: 'Document retention', kaipu: '10 yr per ISO 9001 §7.5', typical: '1— yr' },` | _[TODO: SME]_ |

---

## SME 工作流

1. 按 `#` 顺序逐行审查（每个文件单独一批，提高效率）
2. 在"期望值"列填写准确数字，例如 `40–200 gsm`、`58–62 HRC`、`5–15 µm`
3. 若规格**不存在**或**不可公开**，保留 `[MISSING SPEC: ...]` 占位符
4. 完成后，由工程团队使用编辑工具或 `fix-unicode.mjs`（项目自带）执行批量替换
5. 替换后执行 `node scripts/check-unicode.mjs` 验证

## 建议优先级

| 优先级 | 文件 | 业务影响 |
|---|---|---|
| P0 | `src/pages/industries/printing-packaging.astro` | 客户最常搜索的规格参数 |
| P0 | `src/pages/industries/paper-tissue.astro` | 19 处损坏，最严重 |
| P0 | `src/data/product/slitter-blade.md` | 高价值产品页 |
| P1 | `src/pages/industries/metalworking.astro` | 10 处 |
| P1 | `src/pages/industries/food-processing.astro` | 8 处 |
| P1 | `src/pages/industries/plastics-recycling.astro` | 8 处 |
| P2 | `src/data/product/granulator-rotor-knife-200x40.md` | 6 处 |
| P2 | `src/pages/industries/converting.astro` | 6 处 |
| P3 | 其他 8 个文件 | 共 24 处 |

---

## 不在本报告中的内容

- 已通过 `fix-unicode.mjs` 修复但保留 `[MISSING SPEC: ...]` 占位符的位置（需 SME 走专门队列）
- 图像文件名、URL slug 等结构化资产中的乱码（独立审计项）

---

*报告生成于 2026-09-27，由 audit-results/build-encoding-review.mjs 自动产出。*
*对应 Round 1 审计 F-007（severity: high，requires_human_input: true）。*