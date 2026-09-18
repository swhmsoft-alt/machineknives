---
title: 'Re-sharpening Service: How to Outsource Industrial Blade Re-grinding'
excerpt: 'Outsourcing the re-grind is the right call for most converting and fabrication operations. This article walks through how to specify a re-sharpening service, what the supplier should send back, what the SLA should be, and the four questions that separate a good re-grind from a knife-destroying one.'
publishDate: 2026-09-18
category: 'maintenance'
type: 'article'
tags:
  - re-sharpening
  - re-grinding
  - knife service
  - blade service
  - outsource re-grind
  - CBN grinding
author: 'KAIPU Engineering'
metadata:
  description: 'How to outsource industrial blade re-sharpening: specification, deliverables, SLA, the four questions to ask a re-grind shop before you ship your first knife.'
  canonical: 'https://www.machine-knives.net/maintenance-resharpening-service/'
---

Re-sharpening an industrial blade in-house requires a CNC grinder, a skilled operator, a controlled SOP, and a metrology station. For most converting and fabrication operations, the volume does not justify the overhead. Outsourcing to a specialised re-grind shop is the right answer — but only if you specify the deliverable correctly and audit the supplier on the first five knives.

This post walks through how to write a re-sharpening specification, what the supplier should return with each knife, what the SLA should look like, and the four questions that catch 90 % of bad re-grind shops.

> **One-line summary:** *Outsource the re-grind. Specify: measurement, grind stock removed, edge geometry, surface finish, hardness test, packaging. Audit on the first 5 knives. Reject any knife that has lost more than 0.05 mm of thickness, has chips at the edge, or comes back with a different hone than you sent.*

---

## When to outsource vs in-house

| Knives per year | Re-grind cost / knife | Recommendation |
|---|---|---|
| < 50 | Any | Outsource — in-house grinder is not justified |
| 50–300 | < €100 | Outsource — partner shop |
| 50–300 | > €100 | In-house — payback inside 12 months |
| 300–1,000 | Any | In-house — 1 grinder + 1 operator |
| > 1,000 | Any | In-house — 2 grinders + automated measurement |

The crossover is at ~ €30,000/year of re-grind spend, or ~ 200 knives/year at €150 each.

---

## The four questions to ask before signing a re-grind shop

1. **"What is your typical turnaround time, and what happens if you miss it?"** A good shop commits to 5 working days for a standard 250 mm slitter, with a refund or discount on missed SLAs.
2. **"Show me your wheel inventory and SOP."** A good shop runs aluminium-oxide or CBN wheels, soft-to-medium bond, 60–120 grit. A bad shop runs hard-bonded wheels at 40 m/s with no coolant.
3. **"What measurement equipment do you run on every knife?"** A good shop has a calibrated micrometer, a surface-roughness tester, and a hardness file. A bad shop has a tape measure.
4. **"Can you show me a hardness file test result for the last 10 knives you re-ground?"** A good shop can. A bad shop has never heard of the test.

If the shop answers 1–4 well, send a single knife as a trial. If the trial comes back in spec, send 5. If the 5 come back in spec, send the rest of the year.


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
