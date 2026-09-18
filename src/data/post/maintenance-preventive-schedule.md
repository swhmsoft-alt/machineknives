---
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


### Weekly (maintenance technician, 30 minutes)

- **Edge geometry measurement.** Hone radius with a measuring microscope or a comparator gauge. Within ± 2 µm of spec?
- **Knife dimensional check.** OD, ID, thickness, runout. Within 0.02 mm of drawing?
- **Hardness file test.** 5 points on the knife. All within ± 1 HRC of the target?
- **Coolant analysis.** Concentration, pH, contamination. Within spec?
- **Burr measurement.** Quantitative, with a microscope or comparator, on a sample piece. Trending up vs last week?
- **Re-grind decision.** If hone is +2 µm above spec, or burr has trended +20 % over 2 weeks, schedule a re-grind.

### Monthly (line engineer, 2 hours)

- **Re-grind cycle analysis.** Knife life vs target. Reject rate. Re-grind cost per metre cut. Trend over the last 3 months.
- **Knife inventory audit.** Count of new vs re-ground vs retired knives. Projected re-grind spend for the next 3 months.
- **Line-side conditions.** Tension, alignment, web temperature, draw. Within OEM spec?
- **Coolant system.** Filter change, tank clean, concentration adjustment, top-up.
- **Knife storage audit.** Knives stored in foam-lined cases, oil applied, slot dividers in place?
- **Audit findings.** Write up. Open work orders for the next month.

### Quarterly (engineering manager, half-day)

- **Hardness audit.** 1 random knife from the re-grind rotation. Full metallurgical check — 5-point hardness, surface hardness, microstructure, decarburisation check.
- **Heat-treat supplier audit.** Mill certificate review, tempering chart review, re-audit if the reject rate has trended up.
- **Re-grind supplier audit.** Re-grind cost, reject rate, on-time delivery. Site visit if the supplier is the long-term partner.
- **Knife grade review.** Has the substrate mix changed? Has a re-grind cycle shortened, suggesting a substrate drift? Should the grade be re-evaluated?
- **Cost review.** Re-grind cost per metre cut, line availability, scrap rate. Set the next quarter's targets.
- **Audit findings.** Write up. Long-term improvement plan for the next quarter.

---

## The inspection form (template)

The form should live at the machine, in a plastic sleeve, with a pencil. Every shift the operator fills in:

```
[Knife ID]  [Date]  [Shift]  [Operator initials]
1. Edge visual:  OK / chip / roll / gall / BUE
2. Burr (µm):  ____  (target: ____)
3. Cut surface:  OK / tear / wrinkle / roughness
4. Coolant:  OK / low / no flow
5. Action:  None / re-grind / replace
[Supervisor signature]
```

The weekly form is more detailed, the monthly more so, the quarterly includes the metallurgical data. The forms are also entered into a spreadsheet or CMMS for trending. The operator's form is the trigger for the weekly and monthly reviews.

---

## The knife tracking sheet (template)

Each knife has a tracking sheet, kept with the knife in its storage case:

```
[Knife ID]  [Drawing]  [Initial OD]  [Initial thickness]
Re-grind | Date | OD after | Thickness after | Hardness | Hone | Operator
1        |      |          |                |          |      |
2        |      |          |                |          |      |
...
[Retire at OD < ____ or thickness < ____]
```

A retired knife is segregated, marked with a red tag, and either re-purposed (scrap chopper, anvil backup) or scrapped. A retired knife is never sent back to the line by accident.

---

## Line-side conditions that must be held

These are the conditions on the line itself that drive knife life. The PM schedule must measure and hold them:

- **Web tension.** 30–80 N/m for paper, 50–150 N/m for film. A 20 % deviation changes knife life by 20–30 %.
- **Knife-to-anvil parallel.** 0.01 mm. A 0.05 mm deviation causes one-side wear.
- **Knife runout.** 0.02 mm. A 0.05 mm deviation causes vibration and chipping.
- **Coolant pressure at nozzle.** 5–10 bar. A drop to 2 bar = no cooling.
- **Coolant concentration.** 5–8 % emulsion. A drop to 2 % = no lubrication.
- **Line speed.** Within the knife's rated window. A 20 % overspeed = thermal damage.
- **Substrate batch.** Logged at every change. A new batch that is +5 % in caliper or surface roughness will halve knife life.

A PM schedule that ignores these and only checks the knife is half a schedule. The line is the second variable in the maintenance story.


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
