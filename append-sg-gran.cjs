// append-sg-gran.cjs — append part 2
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/selection-guide-granulator-knife.md');
const content = `

---

## Substrate-by-substrate grade map

| Polymer family | Bed knife grade | Rotor knife grade | Notes |
|---|---|---|---|
| PE film (LDPE, LLDPE, HDPE) | D2 or DC53, HRC 58 | M2 HSS, HRC 58 | 4-edge reversible rotor |
| PP film / woven | D2, HRC 58 | M2 HSS, HRC 58 | Abrasive if calcium-filled |
| PET bottle / flake | D2 or DC53, HRC 58 | M2 HSS, HRC 58 | Impact on thick walls |
| PVC rigid | DC53, HRC 58 | M2 HSS, HRC 60 | CaCO₃ abrasive |
| ABS, PC, PMMA | D2, HRC 58 | M2 HSS, HRC 58 | Low abrasive |
| PA6, PA66 (neat) | D2, HRC 58 | M2 HSS, HRC 58 | Tough, gummy |
| PA6, PA66 (glass-filled 30 %) | YG8 bed, HRA 89 | M2 HSS, HRC 60 | Highly abrasive |
| PC + glass fibre | YG8 bed, HRA 89 | M2 HSS, HRC 60 | Highly abrasive |
| Regrind from production waste | D2 or DC53, HRC 58 | M2 HSS, HRC 58 | Variable contamination |
| Post-consumer recycle | YG8 bed, HRA 89 | M2 HSS, HRC 60 | High contamination |
| Automotive shredder residue | YG10X / YG15 rotor | YG8 bed | Heavy metal contamination |

The general rule: **abrasive filler + impact = carbide bed; abrasive filler + light impact = HSS rotor; metal contamination = carbide rotor.** Match the harder component to the rotor if contamination is the dominant variable.

---

## Rotor knife geometry

The rotor knife is the more-impacted component. The geometry:

- **Cross-section.** Trapezoidal or rectangular. The trapezoidal section gets 4 re-grinds before the geometry is unrecoverable; rectangular gets 8–10 but is more prone to chipping.
- **Edge chamfer.** 0.20–0.30 mm. Larger than a slitter or shear because the cut is more aggressive.
- **Clearance angle.** 5–10° on the back face.
- **Number of edges.** 2-edge (rotor index 180°) or 4-edge (rotor index 90°). 4-edge rotors are more common; the knife is rotated when one edge is worn.
- **Hardness.** HRC 58–60 for the rotor. Higher hardness chips; lower wears too fast.
- **Bolt torque.** Critical. Under-torqued = knife shifts, rubs, chips. Over-torqued = bolt stretches, knife cracks. Use a torque wrench, set to OEM spec.

---

## Bed knife geometry

The bed knife is set at a fixed angle to the rotor. The geometry:

- **Cross-section.** Rectangular, typically 20–40 mm thick.
- **Edge chamfer.** 0.10–0.20 mm. Smaller than rotor.
- **Clearance angle.** 0–5° depending on bed design.
- **Number of edges.** Usually 2-edge (rotate 180° to expose fresh edge).
- **Hardness.** HRC 58–60 for the bed. The bed sees less impact than the rotor, so the higher hardness is safe.
- **Bed-to-rotor gap.** 0.10–0.30 mm. A larger gap = larger output particle, lower power. A smaller gap = finer output, higher power, faster knife wear.
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
