// append-mt-prev-b.cjs — final closing
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/maintenance-preventive-schedule.md');
const content = `

---

## The 4-quadrant failure-vs-detection matrix

| Failure mode | Detectable how? | When? | Cost to fix in advance |
|---|---|---|---|
| Hone growing (worn edge) | Weekly measurement | Weeks before failure | €100 re-grind |
| Knife dimension drift (OD, ID, T) | Weekly measurement | Days before failure | €100 re-grind |
| Hardness drop (decarb, over-temp) | Monthly hardness file | Days before failure | Replace knife |
| Edge chip (impact event) | Daily visual | Hours before failure | Re-grind or replace |
| Built-up edge (galling) | Daily visual + cut sample | Same shift | Re-grind |
| Thermal damage (blueing) | Daily visual | Same shift | Re-grind, fix coolant |
| Coolant drop | Daily check | Same shift | Fix nozzle |
| Tension drift | Weekly check | Days before failure | Adjust tension |
| Misalignment | Quarterly check | Days before failure | Re-align |

The 80 % of failures are in the top 5 rows. A PM schedule that catches the top 5 saves the line.

---

## Common PM schedule failures

1. **Form not at the machine.** If the form lives in an office binder, the operator does not fill it in. The PM schedule becomes "we'll check next month" and never catches anything.
2. **Daily check skipped on quiet shifts.** The first failure on a quiet shift is always the worst, because no one was watching.
3. **Weekly check done by a different person each week.** Inconsistent measurement. Pin the weekly check to one technician.
4. **Quarterly audit deferred.** The metallurgical data is the only objective check on the heat-treat supplier. Defer it once and the data trends blind.
5. **Re-grind decision deferred.** "We'll re-grind next week" becomes "we re-ground last week after the line tripped" and the knife has produced 50 m of bad cut in between.
6. **No closed loop on findings.** A finding that does not generate a work order is not a finding. It is a complaint.

---

## Field cases

**Case 1: Tissue converter, 4 slitting lines.** Customer was running "wait for failure" PM. Average downtime per line: 6 h/month. After implementing the 4-cadence PM schedule: downtime dropped to 1.5 h/month. Annual savings: €162,000 across 4 lines.

**Case 2: Paper converter, 8 slitting lines.** Customer had a PM schedule but the daily form was missing. After installing the form: chip failures caught on Day 1 vs Day 7. Scrap dropped 35 %. Annual savings: €48,000.

**Case 3: Service centre, 4 shear lines.** Customer had a quarterly audit but no metallurgical data. After adding the hardness audit: caught a heat-treat drift on a 6-month-old knife. Switched supplier, scrap rate halved.

---

## The spec to write

For a preventive maintenance SOP:

> "Preventive maintenance schedule for [slitter / shear / granulator] knives. Cadences: daily (5 min/operator), weekly (30 min/technician), monthly (2 h/engineer), quarterly (half-day/manager). Forms: at-machine, in plastic sleeve, pencil. Findings: written, action-tracked, closed in [1 week / 1 month / 1 quarter] depending on severity. Knife tracking: per-knife sheet in storage case. Re-grind decision: weekly. Audit cycle: annual metallurgical check on 1 random knife. Cost target: re-grind cost per metre cut, line availability, scrap rate."

For the broader re-grind SOP, see [Maintenance: how to extend slitter life](/maintenance-slitting-blade-life/). For the re-sharpening service article, see [Re-sharpening service: how to outsource](/maintenance-resharpening-service/).

For a written PM schedule for your line, send the line layout, the current knife consumption, the current downtime and the current scrap rate to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Specification, template forms, and a quarterly audit protocol within one business day.

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified. Provides PM schedule templates as a value-added service for customers who buy a 12-knife annual volume.*
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
