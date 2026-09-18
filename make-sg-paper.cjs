// make-sg-paper.cjs — How to Choose a Slitting Blade for Paper Converting Lines
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/selection-guide-paper-converting.md');
const content = `---
title: 'How to Choose a Slitting Blade for a Paper Converting Line'
excerpt: 'Paper slitting looks simple until you account for the substrate GSM, the caliper variation, the trim, the lay-flat tension and the line speed. This guide walks through the substrate map, the steel grade decision, the edge-prep and clearance targets, and the line-side conditions that determine whether your slitter lasts 7 days or 70 days.'
publishDate: 2026-09-18
category: 'selection-guide'
type: 'article'
tags:
  - paper slitting
  - paper converting
  - slitter blade
  - D2
  - 'SKD11'
  - M2 HSS
author: 'KAIPU Engineering'
metadata:
  description: 'How to choose a slitting blade for a paper converting line. Substrate GSM and caliper, steel grade by rewind quality, edge prep, clearance and line-side conditions.'
  canonical: 'https://www.machine-knives.net/selection-guide-paper-converting/'
---

Paper slitting is the highest-volume industrial knife application in the world, and it is also the application where the wrong steel grade is most often mis-specified. The decision is not "D2 or M2" — it is a four-axis question: substrate GSM and caliper, line speed, burr target, and re-grind cycle. Get those four right and the steel grade follows.

> **One-line summary:** *For tissue and fine paper at < 500 m/min, D2 or SKD11 at HRC 60 with a 5–10 µm hone. For kraft and high-speed lines > 500 m/min, M2 HSS at HRC 64 with a 10–15 µm hone. For abrasive recycled or coated paper, M2 HSS + TiCN coating.*

---

## The four-axis selection

### Axis 1: substrate GSM and caliper

| Substrate family | GSM | Caliper (µm) | Abrasive load | Recommended grade |
|---|---|---|---|---|
| Tissue | 12–35 | 40–120 | Very low | D2 or SKD11, HRC 60 |
| Lightweight paper (newsprint, copy) | 40–80 | 50–100 | Low | D2 or SKD11, HRC 60 |
| Fine paper (office, label) | 70–150 | 80–180 | Low–medium | D2 / SKD11, HRC 60 |
| Kraft (uncoated) | 80–300 | 100–400 | Medium | D2 or M2 HSS, HRC 60–62 |
| Coated paper (gloss, matte) | 90–250 | 80–200 | Medium–high (mineral coat) | M2 HSS, HRC 64 |
| Recycled / de-inked | 70–200 | 90–250 | High (residual ink, fillers) | M2 HSS or M4 HSS, HRC 64 |
| Laminated paper / board | 200–600 | 250–800 | High (mineral + adhesive) | M2 HSS + TiCN coating |

The bigger and the more abrasive, the higher the HSS content and the harder the substrate needs to be cut. Caliper matters because a 400 µm kraft sheet is a different cut than a 100 µm fine paper, even at the same GSM.

### Axis 2: line speed

- **< 200 m/min:** D2 or SKD11, HRC 58–60. The edge temperature stays below 200 °C, and a cold-work tool steel holds its geometry.
- **200–600 m/min:** M2 HSS, HRC 64. Edge temperature climbs to 300–400 °C; D2 will soften.
- **> 600 m/min:** M2 HSS with a TiAlN or AlCrN PVD coating, or M4 HSS uncoated. The coating holds edge hardness at 600+ °C; M4's V-rich matrix buys 20–30 % more life.
- **> 1,000 m/min (tissue):** M2 HSS with TiAlN coating, 15 µm hone, active cooling. M2 alone may fail by thermal fatigue micro-cracking inside 2 weeks.

### Axis 3: burr target

- **Tissue and hygiene:** ≤ 30 µm. Hone 5–10 µm, clearance 25–30°.
- **Printing and label:** ≤ 20 µm. Hone 5 µm, clearance 20–22°, parallel ± 0.005 mm.
- **Packaging (kraft, recycled):** ≤ 50 µm. Hone 10 µm, clearance 18–22°.
- **Abrasive non-woven:** ≤ 80 µm. Hone 10–15 µm, clearance 18–22°.

### Axis 4: re-grind cycle

- **Daily re-grind:** M2 HSS at HRC 64. The hard steel survives aggressive re-grinding.
- **Weekly re-grind:** D2 or M2 HSS. The re-grind interval is long enough that either grade is fine.
- **Monthly re-grind:** M2 HSS or M4 HSS. D2 wears too fast on abrasive substrates for a monthly cycle.
`;
fs.writeFileSync(target, content, 'utf8');
console.log('Wrote: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
