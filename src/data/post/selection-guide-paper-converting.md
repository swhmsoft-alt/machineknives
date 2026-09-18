---
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


---

## Edge prep: the single biggest lever on a paper slitter

A paper slitter is the clearest case in industrial cutting for the "hone vs substrate" trade-off. The hone radius is the dominant variable; the steel grade is the second. Get the hone wrong and no steel grade will fix it.

| Substrate | Hone radius | Clearance angle | Burr target |
|---|---|---|---|
| Tissue, hygiene | 10–15 µm | 25–30° | ≤ 30 µm |
| Fine paper | 5–10 µm | 20–22° | ≤ 20 µm |
| Kraft | 10 µm | 18–22° | ≤ 50 µm |
| Coated paper | 10 µm | 20–22° | ≤ 30 µm |
| Recycled | 10–15 µm | 20–22° | ≤ 50 µm |
| Laminated board | 15 µm | 18–20° | ≤ 80 µm |

The general rule: **larger hone for softer or thicker paper, smaller hone for harder or thinner paper.** A "razor edge" (0–2 µm) on tissue is a guaranteed 2-week failure; a 5 µm hone on the same line is 30+ days. A 15 µm hone on 80 gsm fine paper is 50 µm burr.

---

## Re-grind practice

The four parameters that separate a 14-day knife from a 60-day knife on the same paper line:

1. **Wheel.** Aluminium-oxide 60–80 grit, soft-to-medium bond. CBN for production runs (3× faster, but more expensive).
2. **Wheel speed.** 25–30 m/s surface speed. Above 35 m/s = thermal damage.
3. **Infeed per pass.** 0.002–0.005 mm. Above 0.01 mm = grinding cracks.
4. **Coolant.** Flood, 5–8 % emulsion. No exceptions.

A 5-minute re-grind is a sign the SOP is wrong. A proper re-grind of a 250 mm OD × 25 mm × 3 mm slitter takes 18–25 minutes.

---

## Coatings: when they pay off

A PVD coating on a paper slitter is the right answer in three cases:

- **Coated or recycled paper.** TiN or TiCN extends life 20–30 %. The coating reduces friction at the cut.
- **High-speed tissue (> 1,000 m/min).** TiAlN holds the edge below 600 °C and prevents thermal fatigue. ROI typically inside 6 months.
- **Abrasive non-woven or coated paper.** TiCN or CrAlN for wear-dominated failures.

For uncoated kraft or fine paper at < 500 m/min, a coating is rarely worth the 8–15 % cost premium. Hone and re-grind practice are cheaper.

For the runnable coating comparison, see [Coating Comparison Table](/coatings-comparison/).

---

## Field cases from the KAIPU shop

**Case 1: Tissue slitter, 320 mm, 1,200 m/min, 18 gsm.** Customer was getting 11 days from a D2 slitter. Failure mode: thermal fatigue micro-cracking at the edge from day 3. We quoted M2 HSS, HRC 64, 15 µm hone, TiAlN coating. Service life: 31 days. The M2's hot hardness + the TiAlN coating dropped the edge temperature by ~ 80 °C.

**Case 2: Kraft slitter, 250 mm, 400 m/min, 150 gsm.** Customer was getting 28 days from a D2 slitter with a "razor edge". We quoted the same D2, HRC 60, 10 µm hone, no coating. Service life: 65 days. The hone absorbed the abrasive load; the steel grade was never the problem.

**Case 3: Coated paper slitter, 200 mm, 600 m/min.** Customer was getting 18 days from a D2 slitter. We quoted M2 HSS, HRC 64, 10 µm hone, TiCN coating. Service life: 42 days. The TiCN coating on the abrasive mineral coat paid for itself in 4 months.

---

## The spec to write

For a paper slitting blade on a paper converting line:

> "Slitter, [OD] × [ID] × [thickness] mm, AISI D2 or SKD11 (or AISI M2 HSS at > 500 m/min), vacuum heat-treated to HRC 60–64 ± 1, 5-point file test, parallel ≤ 0.005 mm, surface finish Ra ≤ 0.4 µm, edge hone [5–15] µm radius, clearance angle [18–30]° per substrate. Substrate: [paper family / GSM / caliper]. Line speed: [X] m/min. Re-grind SOP: aluminium-oxide or CBN, 25 m/s, 0.002 mm infeed, flood coolant. Mill certificate with ladle chemistry required."

For the broader five-factor selection framework, see [The KAIPU 5-Factor Blade Selection Framework](/kaipu-5-factor-blade-selection-framework/). For a runnable steel grade cross-reference, see [Material Grade Converter](/material-grade-converter/). For a head-to-head on HSS, see [M2 vs M4 HSS](/m2-vs-m4-hss/).

For a written paper-converting specification, send the part drawing, the substrate, the line speed and the current service life to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Specification, FOB quote and lead time within one business day.

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified. Ships to converters, recyclers and OEMs across four continents.*
