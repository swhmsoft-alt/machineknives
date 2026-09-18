// make-mt-prev.cjs — part 1
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/maintenance-preventive-schedule.md');
const content = `---
title: 'Preventive Maintenance Schedule for Industrial Blades: A Practical SOP'
excerpt: 'A preventive maintenance schedule catches the 80 % of premature blade failures that show up as predictable symptoms. This SOP covers daily / weekly / monthly / quarterly checks for slitter, shear and granulator blades, the inspection form, the parts replacement plan, and the line-side conditions that must be measured and held.'
publishDate: 2026-09-18
category: 'maintenance'
type: 'article'
tags:
  - preventive maintenance
  - blade SOP
  - inspection form
  - line audit
  - knife life
author: 'KAIPU Engineering'
metadata:
  description: 'Preventive maintenance schedule for industrial blades: daily / weekly / monthly / quarterly checks, inspection form, parts replacement plan, line-side measurements that drive knife life.'
  canonical: 'https://www.machine-knives.net/maintenance-preventive-schedule/'
---

A preventive maintenance schedule for industrial blades is not about replacing knives on a fixed interval — it is about catching the symptoms that predict a failure before the line trips. The 80 % of premature blade failures we see in the field show up as a measurable symptom days or weeks before the line stops. A good PM schedule catches the symptom and acts on it; a bad PM schedule waits for the failure and then reacts.

This post is the SOP we ship to converting and fabrication customers who ask for a maintenance framework. It is built around the four cadences — daily, weekly, monthly, quarterly — and the inspection form that should live at every slitter / shear / granulator station.

> **One-line summary:** *Daily: visual + burr. Weekly: edge geometry + coolant. Monthly: re-grind decision + dimensional check. Quarterly: hardness audit + line-side audit. The forms live at the machine, not in a binder.*

---

## Why a schedule beats "wait for failure"

A line that runs to failure loses an average of 4 hours of production per failure event: 30 minutes to recognise the failure, 90 minutes for the re-grind or change, 30 minutes to recover. At a 600 m/min line with €1,500/h gross margin, that is €6,000 per failure. A PM schedule that catches 80 % of failures in advance costs €2,000/year in operator time. The ROI on a PM schedule is typically 10–20× in the first year.

The other reason: a blade that fails in service produces scrap. The first 50–200 m of cut after a chipped or rolled edge is sub-spec. Catching the symptom before failure means the next knife is on the machine before the cut goes bad.

---

## The four cadences

### Daily (operator, 5 minutes per shift)

- **Visual edge inspection.** Look at the edge under the work light. Chip, roll-over, galling, or built-up edge visible?
- **Burr check.** Run a sample piece through the cut. Burr within spec?
- **Cut quality.** Tear, wrinkle, or roughness on the cut surface?
- **Coolant flow.** Coolant reaching the cut zone? Pressure in spec?
- **Knife condition log.** Stamp the day on the knife tracking sheet.

If any of the five are red, flag the operator-in-charge. The knife is re-ground or replaced that shift, not the next.
`;
fs.writeFileSync(target, content, 'utf8');
console.log('Wrote part 1: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
