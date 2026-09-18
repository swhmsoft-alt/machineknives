// append-sg-shear.cjs — append part 2
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/selection-guide-shear-blade-plate-steel.md');
const content = `

---

## Substrate-by-substrate grade map

| Substrate | Thickness | Recommended grade | Hardness | Chamfer | Blade gap |
|---|---|---|---|---|---|
| Mild steel (A36, S235) | ≤ 6 mm | AISI M2 HSS | HRC 62 | 0.10 mm | 5–7 % |
| Mild steel (A36, S235) | 6–12 mm | AISI M2 HSS | HRC 60 | 0.15 mm | 7–9 % |
| Mild steel (A36, S235) | 12–25 mm | AISI H13 or DC53 | HRC 56–58 | 0.20 mm | 8–10 % |
| High-strength steel (S690, S960) | ≤ 6 mm | AISI M2 HSS | HRC 64 | 0.10 mm | 6–8 % |
| High-strength steel (S690, S960) | 6–12 mm | AISI M2 HSS + TiAlN | HRC 64 | 0.15 mm | 8–10 % |
| Stainless 304 / 316 | ≤ 4 mm | AISI M2 HSS + TiN or CrN | HRC 64 | 0.10 mm | 7–9 % |
| Stainless 304 / 316 | 4–6 mm | Carbide shear insert (YG8) | HRA 89 | 0.10 mm | 8–10 % |
| 17-4PH, 15-5PH | ≤ 4 mm | AISI M2 HSS | HRC 64 | 0.10 mm | 7–9 % |
| 17-4PH, 15-5PH | 4–6 mm | Carbide shear insert | HRA 89 | 0.10 mm | 8–10 % |
| AR400 / Hardox 400 | ≤ 6 mm | Carbide shear insert | HRA 89 | 0.10–0.15 mm | 8–10 % |
| AR500 / Hardox 500 | ≤ 6 mm | Carbide shear insert | HRA 90 | 0.15 mm | 9–11 % |
| Aluminium (5052, 6061) | ≤ 6 mm | AISI D2 | HRC 60 | 0.10 mm | 6–8 % |
| Copper / brass | ≤ 4 mm | AISI D2 | HRC 58 | 0.05–0.10 mm | 5–7 % |

The general rule: **plate thickness up, hardness down, chamfer up, gap up.** A 25 mm mild steel plate wants a softer, thicker-chamfered blade than a 3 mm sheet.

---

## The chamfer is more important than the steel grade

A wrong chamfer on the right steel will chip in 1,000 cycles. The right chamfer on a generic steel will survive 10,000+ cycles. The chamfer is the second-strongest variable on a plate shear — after the steel grade.

The chamfer absorbs the impact load on first contact. A 0.05 mm chamfer on a 12 mm plate is a chip in 100 cycles. A 0.20 mm chamfer on the same plate is 30,000+ cycles.

| Plate thickness | Minimum chamfer | Recommended chamfer |
|---|---|---|
| ≤ 2 mm | 0.05 mm | 0.05–0.10 mm |
| 2–6 mm | 0.08 mm | 0.10–0.15 mm |
| 6–12 mm | 0.15 mm | 0.20–0.25 mm |
| 12–25 mm | 0.20 mm | 0.25–0.30 mm |

The chamfer should be on the **back face** (the trailing side as the blade moves through the plate). A leading-edge chamfer (front face) will dig in and chip.

---

## Blade gap and cut quality

Blade gap is set with a feeler gauge, with both blades in the closed position, measured at the centre of the blade and at both ends. A 0.5 mm gap variation across the blade length will leave a step in the cut.

| Plate thickness | Gap (per side) | Total gap | Cut result |
|---|---|---|---|
| 2 mm | 0.10–0.14 mm | 0.20–0.28 mm | Clean, low burr |
| 4 mm | 0.20–0.32 mm | 0.40–0.64 mm | Clean, low burr |
| 6 mm | 0.30–0.54 mm | 0.60–1.08 mm | Acceptable |
| 12 mm | 0.84–1.20 mm | 1.68–2.40 mm | Acceptable, with rollover |
| 25 mm | 2.0–2.5 mm | 4.0–5.0 mm | Heavy rollover, requires post-cut edge dressing |

A too-small gap work-hardens the cut surface (visible as a hardened band on the cut edge). A too-large gap causes the plate to bend rather than shear, and the cut is rough and the plate drops with a bang.
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
