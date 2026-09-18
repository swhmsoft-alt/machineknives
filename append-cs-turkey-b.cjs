// append-cs-turkey-b.cjs — final
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/case-study-shear-stainless-turkey.md');
const content = `

---

## The economic case

| Item | Baseline | After change-out |
|---|---|---|
| Upper blades consumed per year | 60 | 4 |
| Lower blades consumed per year | 80 | 5 |
| Knife cost (USD 220 each) | USD 30,800 | USD 1,980 |
| Re-grind cost (USD 60 × 140) | USD 8,400 | USD 540 |
| Blade change downtime (25 min × 140) | 58.3 h | 4.2 h |
| Lost production (USD 1,200/h gross margin) | USD 70,000 | USD 5,000 |
| **Annual savings** | — | **USD 101,680** |
| Project cost (audit + trial + change-out) | — | USD 6,800 |
| Coating premium (USD 60/knife × 9) | — | USD 540/year |
| **Net annual savings** | — | **USD 94,340** |
| **Payback** | — | **28 days** |

The audit-and-trial cost paid back in the first month. The coating premium is recurring, but the labour and downtime savings are recurring. The line is now running the Trial C specification as standard across all four shear lines at the service centre.

---

## What the customer changed in the SOP

Three SOPs were updated as a result of the audit:

1. **Knife spec.** "Upper shear, 600 × 60 × 25 mm, AISI M2 HSS (or equivalent), vacuum heat-treated to HRC 64 ± 1, 5-point file test, 0.12 mm chamfer on back face, polished, TiN PVD coating 3 µm. Mill certificate required."
2. **Re-grind spec.** "Re-grind SOP: aluminium-oxide wheel, 25 m/s, 0.002 mm infeed, flood coolant, 0.12 mm chamfer restored. No 'sharp edge' for 304 stainless shearing."
3. **Blade gap SOP.** "Blade gap set with feeler gauge at three points across the blade length. Total gap 0.48 mm ± 0.02 mm. Checked at every knife change, logged in the gap register."

The new SOPs are now applied to all four shear lines at the service centre, including the 3 mm and 4 mm plate shears. For 3 mm plate, the gap drops to 0.24 mm; for 4 mm, to 0.32 mm.

---

## Lessons learned

1. **The chamfer is more important than the steel grade.** A 0.05 mm chamfer on a 6 mm plate will chip, regardless of the steel. A 0.12 mm chamfer on a generic D2 will out-cut a 0.05 mm chamfer on premium M2 HSS.
2. **The heat-treat quality is the second variable.** A decarburised surface on a D2 knife is a guaranteed failure mode for stainless. The 5-point file test on receipt takes 5 minutes.
3. **The blade gap is the third variable.** A 0.05 mm gap variation across the blade length will one-side wear and chip. The feeler gauge check at every change takes 2 minutes.
4. **The plate hardness is the fourth variable.** A 304 plate at the high end of the ASTM A240 spec will chip a tight-chamfer knife. The chamfer has to absorb the worst-case plate, not the average plate.
5. **The TiN coating is the fifth variable — a 30 % life gain on top of the other four.** Without the other four, the coating alone is a 1.5× gain, not 15×.

---

## What this means for similar service centres

The same pattern reproduces on most 304 / 316 plate shear lines:

- 3 mm 304 plate: M2 HSS, HRC 62, 0.08 mm chamfer, 0.24 mm gap, no coating (or TiN for 2× life)
- 4 mm 304 plate: M2 HSS, HRC 62, 0.10 mm chamfer, 0.32 mm gap, no coating
- 6 mm 304 plate: M2 HSS, HRC 64, 0.12 mm chamfer, 0.48 mm gap, TiN coating
- 8 mm 304 plate: M2 HSS, HRC 64, 0.15 mm chamfer, 0.64 mm gap, TiN coating
- 10 mm 304 plate: M2 HSS, HRC 64, 0.18 mm chamfer, 0.80 mm gap, TiAlN coating (higher temp)
- 12 mm 304 plate: consider carbide shear insert (YG8), 0.20 mm chamfer, 1.0 mm gap

If your line is chipping shear blades on stainless plate, the chamfer is almost certainly too small, the steel is almost certainly too soft, or the gap is inconsistent. The fix is rarely a "harder knife."

---

## Want us to audit your line?

For a written field audit on a plate shear line, send the substrate, the plate thickness, the current knife spec and the current service life to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). A typical audit takes 1 day on site, returns a written diagnosis and a trial protocol, and ships the trial knives within 3 weeks. ROI is typically inside 6 months on lines with > USD 30k/year knife spend.

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified. The team ships to converters, recyclers and OEMs across four continents, with active distribution in Turkey, Poland, Germany, Italy, India, Vietnam and Brazil.*
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
