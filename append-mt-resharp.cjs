// append-mt-resharp.cjs — append final
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/maintenance-resharpening-service.md');
const content = `

---

## The re-sharpening specification

The specification you send to a re-grind shop should include:

- **Knife drawing or photo** with current dimensions (OD, ID, thickness).
- **Substrate family and current service life** so the shop understands the application.
- **Steel grade and target hardness** (HRC 60 ± 1, for example).
- **Edge geometry** — hone radius, chamfer, clearance angle, measured at receipt.
- **Re-grind amount** — minimum and maximum stock to be removed. Typically 0.05–0.10 mm per side for a routine re-grind; 0.20+ mm for a re-grind after a damage event.
- **Surface finish target** — Ra ≤ 0.4 µm is standard for slitter and shear blades.
- **Hardness test points** — 5-point file test on every re-grind, with the points stamped on the knife.
- **Inspection report** — before / after OD, ID, thickness, runout, hardness, surface finish, hone radius.

The shop should return the knife with a re-grind report. If the shop does not provide a report, the audit is failing.

---

## What the supplier should send back

A good re-grind shop returns each knife with:

1. **The knife** in foam-lined packaging, edge-up, with rust-preventive oil applied.
2. **A re-grind report** (paper or PDF) with: before / after dimensions, stock removed, hardness test results, surface finish, hone radius confirmation.
3. **A re-grind count stamp** on the knife hub, so you can track how many times the knife has been re-ground.
4. **A defect flag** if the knife is below minimum spec, has damage that cannot be re-ground, or has hardness outside the target band.
5. **A return date** with 1–2 working days of buffer for QA.

If any of these are missing, the supplier is not at audit-grade. Find another supplier.

---

## Service level agreement (SLA)

A standard re-grind SLA:

- **Turnaround.** 5 working days for a 250 mm OD slitter. 10 working days for a 1,000 mm shear blade. Express 48 h at +50 % cost.
- **Quality.** ≤ 5 % reject rate on re-grinds. Refund for rejected knives + free re-grind.
- **Measurement.** Calibrated equipment, ISO 9001 traceable, certificates on request.
- **Communication.** Re-grind report within 24 h of shipment. Defect flag within 4 h of inspection.
- **Packaging.** Foam-lined case, edge-up, oil applied. Re-grind count stamped.

If a re-grind shop cannot commit to these SLAs, find another shop.

---

## The first 5 knives: an audit protocol

When you start with a new re-grind shop, run a 5-knife audit:

1. **Knife 1.** Send a fresh knife with the spec. Receive the re-grind. Measure: dimensions, hardness, surface finish, hone. Compare to spec. Pass / fail.
2. **Knife 2.** Same as 1, but request a slightly different hone to test the shop's flexibility. Pass / fail.
3. **Knife 3.** Send a worn knife (typical for your operation) and request a re-grind. Pass / fail.
4. **Knife 4.** Send a damaged knife (chipped edge) and request a re-grind that includes a re-profile. Pass / fail.
5. **Knife 5.** Send 3 knives in one batch, with a tight turnaround request. Test the shop's throughput and communication.

If all 5 pass, send the rest of the year. If any fail, walk away.

---

## Common re-grind shop failures

1. **Grinding off the chamfer.** The shop re-grinds both faces equally, which removes the chamfer and leaves a sharp edge. The knife chips on first use.
2. **Over-grinding.** The shop removes 0.30 mm per side when 0.05 mm was specified. The knife has lost 5 re-grinds of life.
3. **Hard surface removed, soft left.** The shop grinds the decarburised surface off the first re-grind, which is correct, but does not test the hardness of the new surface. The knife has a 0.05 mm soft skin.
4. **Wrong wheel.** The shop uses a contaminated wheel from mild steel on a stainless knife, embedding carbon particles that pit the surface.
5. **No measurement.** The shop re-grinds by eye, returns the knife to drawing dimensions, but the actual edge profile is wrong.

---

## When to bring re-grinding in-house

Bring re-grinding in-house when:

- Annual re-grind spend > €30,000.
- Turnaround time from a supplier is unacceptable.
- The supplier cannot meet your quality spec consistently.
- The application demands a re-grind SOP that the supplier cannot follow.

A small in-house regrind cell is a CNC grinder (~ €80,000), a metrology station (~ €15,000), a wet bench (~ €10,000), and a trained operator (~ €40,000/year). The payback at 200 knives/year is typically 18–24 months.

For a more detailed re-grind SOP, see [Maintenance: how to extend slitter life](/maintenance-slitting-blade-life/).
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
