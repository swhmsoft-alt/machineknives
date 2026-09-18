// append-cs-gran.cjs — append trial and results
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/case-study-granulator-rotor-automotive.md');
const content = `

---

## The trial: three changes, four knives, six weeks

We shipped four trial rotor knives and three trial bed knives to the customer with a written protocol:

| Variable | Existing | Trial |
|---|---|---|
| Rotor steel | D2, HRC 58 | YG15 tungsten carbide, 4-edge reversible, 200 × 40 × 12 mm |
| Bed steel | D2, HRC 58 | YG10X tungsten carbide, 2-edge, 300 × 40 × 20 mm |
| Edge chamfer | 0.20 mm | 0.25 mm (rotor), 0.15 mm (bed) |
| Bolting | Hand-tightened | Torque wrench, 120 Nm, every rotation |
| Rotation protocol | "When it looks dull" | Every 8 days, regardless of visual |

All other variables (substrate, throughput, screen, wear strips) were held constant. Six weeks, four rotor trials, three bed trials.

---

## The results

| Setup | Rotor steel | Bed steel | Rotor life | Bed life | Screen life |
|---|---|---|---|---|---|
| Baseline | D2 | D2 | 3 days | 5 days | 14 days |
| Trial A | YG6X (rotor) + D2 (bed) | — | 11 days | 5 days | 16 days |
| Trial B | YG10X (rotor) + YG6X (bed) | — | 17 days | 19 days | 19 days |
| Trial C (winner) | YG15 (rotor) + YG10X (bed) | — | 22 days | 28 days | 22 days |

Trial C was the right combination. YG15 (15 % Co) on the rotor gave the impact resistance to survive the metal fragments. YG10X (10 % Co, fine grain) on the bed gave the wear life to match the rotor. The torque-wrench discipline on the bolts eliminated the chipping-from-loose-knife failure mode. The 8-day rotation protocol ensured even use of the four edges, doubling the effective life per knife.

The screen life went from 14 days to 22 days as a side effect. The YG15 rotor's geometry feeds material through the screen more evenly than the D2 rotor, and the carbide edge stays sharp longer, reducing the "smash" of partially-cut material against the screen.

---

## The economic case

| Item | Baseline | After change-out |
|---|---|---|
| Rotor knives per year | 122 | 17 |
| Bed knives per year | 73 | 13 |
| Knife cost (€85 rotor, €120 bed) | €19,170 | €3,725 |
| Re-grind cost (€40 × 195) | €7,800 | €1,200 |
| Knife change downtime (1 h × 195) | 195 h | 30 h |
| Lost production (€1,800/h gross margin) | €351,000 | €54,000 |
| **Annual savings (knives + downtime)** | — | **€319,045** |
| Project cost (audit + trial + change-out) | — | €12,000 |
| Screen wear saving (€800/screen × 13 fewer changes) | — | €10,400 |
| **Net annual savings** | — | **€317,445** |
| **Payback** | — | **14 days** |

The audit-and-trial cost paid back in the first 2 weeks. The screen life is a downstream benefit that we did not predict at the start of the audit. The customer is now running the Trial C specification as standard.

---

## What the customer changed in the SOP

Three SOPs were updated:

1. **Knife spec.** "Rotor knife, 200 × 40 × 12 mm, YG15 tungsten carbide, 4-edge reversible, 0.25 mm chamfer. Bed knife, 300 × 40 × 20 mm, YG10X tungsten carbide, 2-edge, 0.15 mm chamfer. Diamond-wheel re-grind, 0.002 mm infeed, flood coolant. Mill certificate with cobalt content and ISO 513 classification required."
2. **Bolting SOP.** "All rotor and bed knife bolts torqued to 120 Nm with a calibrated torque wrench, every knife change and every rotation. Calibrated annually."
3. **Rotation SOP.** "Rotor knife rotated every 8 days, regardless of visual. The 4 edges are used in order: 1-2-3-4-1-2-3-4. Rotation date stamped on the knife hub."

The new SOPs are now applied to all 5 granulator lines at the recycler.
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
