// append-mt-resharp-b.cjs — final closing sections
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/maintenance-resharpening-service.md');
const content = `

---

## The cost of a bad re-grind

A bad re-grind on a 250 mm D2 slitter is ~ €100 in re-grind cost + €300 in knife scrap + 90 minutes of lost production (~ €1,500 in lost margin on a 600 m/min line) = ~ €1,900 per bad re-grind. If your re-grind shop has a 10 % reject rate (5 % above the SLA), and you re-grind 200 knives per year, you are losing €19,000/year to bad re-grinds. That is a real number.

A good re-grind shop has a 0–2 % reject rate. The cost of finding one is the audit protocol above. The cost of not finding one is €19,000/year.

---

## Field cases

**Case 1: Tissue converter, 320 mm slitter, 4 knives per month.** Customer was outsourcing to a local shop at €85/knife, 7-day turnaround, 8 % reject rate. We set up a 5-knife audit, found the reject rate was 18 % (not 8 %, the shop was not reporting). Switched to a partner shop at €110/knife, 5-day turnaround, 1 % reject rate. Annual cost: +€1,200 (higher unit cost) − €13,000 (rejects). Net savings: €11,800/year.

**Case 2: Paper converter, 250 mm slitter, 12 knives per month.** Customer brought re-grinding in-house after 3 years of outsourcing. Investment: €95,000. Annual re-grind cost dropped from €14,400 to €2,800 (consumables + labour). Payback: 8 months.

---

## The spec to write

For a re-sharpening service:

> "Re-sharpening service for industrial slitter knives. Scope: re-grind to drawing dimensions, restore edge geometry ([hone] µm radius, [chamfer] mm, [clearance]°), surface finish Ra ≤ [0.4] µm, 5-point hardness file test on every knife. Deliverables: re-ground knife + re-grind report (before/after dimensions, hardness, surface finish, hone, re-grind count stamped on knife). Turnaround: [5–10] working days. Quality: ≤ [2] % reject rate. SLA: refund or free re-grind on rejects. ISO 9001 certification required. Audit on first 5 knives."

For the broader maintenance framework, see [Maintenance: how to extend slitter life](/maintenance-slitting-blade-life/). For a runnable coating comparison, see [Coating Comparison Table](/coatings-comparison/).

For a written re-sharpening specification for your line, send the knife drawing, the current service life, the current re-grind cost and the current reject rate to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Specification, partner-shop recommendation and indicative cost within one business day.

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified. Runs an in-house re-grind cell as a value-added service for the European market, with 5-day standard turnaround and 1 % measured reject rate.*
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
