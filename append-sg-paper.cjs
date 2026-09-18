// append-sg-paper.cjs — append part 2
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/selection-guide-paper-converting.md');
const content = `

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
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
