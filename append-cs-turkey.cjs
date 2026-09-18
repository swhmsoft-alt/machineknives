// append-cs-turkey.cjs — append first part
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/case-study-shear-stainless-turkey.md');
const content = `

---

## The trial: three changes, four knives, six weeks

We shipped four trial upper blades to the customer with a written protocol:

| Variable | Existing | Trial |
|---|---|---|
| Steel | Generic D2, HRC 58 surface | M2 HSS, Japanese mill, vacuum heat-treated, HRC 64 ± 1, 5-point file test passed |
| Chamfer | 0.05 mm | 0.12 mm on back face, polished |
| Coating | None | TiN PVD, 3 µm, deposited at < 350 °C |
| Blade gap | 0.45 mm centre, 0.50 mm right | 0.48 mm centre, 0.48 mm ± 0.02 mm across full length |

All other variables (line, operator, plate supplier, plate batch) were held constant. The customer ran each knife until chipping or until the burr exceeded 0.15 mm. Six weeks, four knives, four re-grinds.

---

## The results

| Knife | Steel | Chamfer | Coating | Service life | Notes |
|---|---|---|---|---|---|
| Baseline | D2, HRC 58 | 0.05 mm | None | 1,200 strokes | Chip on leading edge from day 2 |
| Trial A | D2, HRC 60 | 0.12 mm | None | 3,800 strokes | Chamfer fixed; D2 still too soft for 304 |
| Trial B | M2 HSS, HRC 64 | 0.05 mm | TiN | 6,200 strokes | Hardness fixed; chamfer still too small |
| Trial C (winner) | M2 HSS, HRC 64 | 0.12 mm | TiN | 18,000 strokes | All three variables fixed; gap also corrected |

Trial C was the right combination. The M2 HSS at HRC 64 resisted the work-hardening of 304, the 0.12 mm chamfer absorbed the impact, the TiN coating reduced galling at the cut, and the corrected blade gap removed the one-sided work-hardening. The knife ran 15× longer than the baseline, with no chipping.
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
