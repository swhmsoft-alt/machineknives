// append-sg-shear-b.cjs — append part 3 (final)
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/selection-guide-shear-blade-plate-steel.md');
const content = `

---

## Re-grinding a plate shear blade

A plate shear re-grind is a larger operation than a slitter re-grind. The blade is 600–1,500 mm long, and the entire cutting edge must be re-ground to the same profile. The variables:

- **Wheel.** Aluminium-oxide 36–60 grit (coarse, for stock removal) followed by 80–120 grit (finishing). CBN for production runs.
- **Wheel speed.** 25–30 m/s.
- **Infeed.** 0.005–0.010 mm per pass for roughing, 0.002 mm for finishing.
- **Coolant.** Flood.
- **Spark-out.** 4–6 passes.
- **Re-grind amount.** 0.20–0.30 mm per side. A 25 mm thick blade can survive 30–40 re-grinds before retirement.

For long blades, use a magnetic chuck or a hydraulic clamp to hold straightness within 0.02 mm across the full length. A bent blade will leave a step in every cut.

---

## Carbide shear inserts: when and how

Carbide shear inserts (typically YG8 / K20–K30 grade, 0.10–0.15 mm chamfer) outlast HSS shear blades by 5–10× on:

- Stainless plate above 4 mm
- High-strength steel above 6 mm
- AR400 / Hardox plate at any thickness
- Any application where the HSS blade is chipping inside 2,000 cycles

The trade-off is cost (5–8× per knife) and grindability (diamond wheels only, 2–3× the cycle time). For a high-volume service centre cutting 200+ plates per shift, the carbide insert pays back in 3–6 months.

For the runnable carbide grade cross-reference, see [YG6X vs YG8](/yg6x-vs-yg8-carbide/).

---

## Common mistakes

1. **Chamfer too small.** A 0.05 mm chamfer on a 12 mm plate is a guaranteed chip. Match chamfer to thickness.
2. **Hardness too high.** A HRC 64 blade on a 12 mm plate will chip on every stroke. Drop to HRC 60.
3. **Gap too small.** Work-hardens the cut edge. The next operation (bending, welding) sees a brittle cut surface.
4. **Gap too large.** Plate bends instead of shears. Cut quality is unacceptable.
5. **Re-grind in-house without straightening.** A re-grind on a worn blade with built-in curvature will leave a bent blade. Straighten first, then grind.
6. **No coating on stainless.** TiN or CrN on the HSS shear blade for 304/316 plate reduces galling and doubles life. ROI inside 4 months.

---

## Field cases

**Case 1: Mild steel shear, 8 mm, swing-beam, 40 strokes/min.** Customer was getting 4,000 cycles from a D2 shear blade at HRC 60. We quoted M2 HSS at HRC 60, 0.20 mm chamfer, 9 % gap. Service life: 22,000 cycles. The M2's toughness absorbed the impact; the chamfer absorbed the first-contact shock.

**Case 2: 316 stainless shear, 5 mm, hydraulic guillotine.** Customer was chipping a D2 blade every 800 cycles. We quoted M2 HSS at HRC 64, 0.10 mm chamfer, TiN coating, 8 % gap. 18,000 cycles. The M2 + TiN + chamfer combination survived the work-hardening of 316.

**Case 3: Hardox 450 plate shear, 6 mm.** Customer had tried M2 HSS, chipped at 1,500 cycles. Carbide shear insert (YG8) with 0.15 mm chamfer, 10 % gap. 22,000 cycles. The carbide is the only answer for AR plate.

---

## The spec to write

For a plate shear blade:

> "Shear blade, [L] × [W] × [T] mm, AISI M2 HSS (or carbide insert YG8 for AR / stainless ≥ 4 mm), vacuum heat-treated to HRC [60–64] ± 1, 5-point file test, surface finish Ra ≤ 0.4 µm, parallelism ≤ 0.005 mm across length, edge chamfer [0.05–0.30] mm on back face, clearance angle [0.5–2]°, rake angle 0–3°. Substrate: [grade / thickness]. Blade gap: [X] % of plate thickness per side. Mill certificate required."

For the broader five-factor selection framework, see [The KAIPU 5-Factor Blade Selection Framework](/kaipu-5-factor-blade-selection-framework/). For the M2 vs M4 HSS head-to-head, see [M2 vs M4 HSS](/m2-vs-m4-hss/). For the carbide grade comparison, see [YG6X vs YG8](/yg6x-vs-yg8-carbide/).

For a written shear-blade specification, send the part drawing, the substrate, the plate thickness and the current service life to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Specification, FOB quote and lead time within one business day.

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified. Ships to converters, recyclers and OEMs across four continents.*
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
