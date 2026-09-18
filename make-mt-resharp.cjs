// make-mt-resharp.cjs — part 1
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/maintenance-resharpening-service.md');
const content = `---
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
`;
fs.writeFileSync(target, content, 'utf8');
console.log('Wrote part 1: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
