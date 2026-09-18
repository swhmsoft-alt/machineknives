---
title: 'Re-sharpening Frequency: When to Re-grind vs When to Replace'
excerpt: 'The right re-grinding frequency balances knife life, scrap rate, and re-grind cost. Re-grind too often wastes stock; re-grind too late produces scrap. This article gives the frequency rules per knife family and the cost model to pick the right interval.'
publishDate: 2026-09-18
category: 'maintenance'
type: 'article'
tags:
  - 're-grinding frequency'
  - 're-grind interval'
  - 're-grind cost'
  - 'blade economics'
  - 'preventive maintenance'
author: 'KAIPU Engineering'
metadata:
  description: 'The right re-grinding frequency balances knife life, scrap rate, and re-grind cost. Re-grind too often wastes stock; re-grind too late produces scrap. This article gives the frequency rules per knife family and the cost model to pick the right interval.'
  canonical: 'https://www.machine-knives.net/maintenance-sharpening-frequency/'
---

The right re-grinding frequency balances knife life, scrap rate, and re-grind cost. Re-grind too often and you waste stock (each re-grind removes 0.05–0.10 mm); re-grind too late and you produce scrap.

> **One-line summary:** *Re-grind when the hone has grown 2 µm above spec, when burr has trended 20 % above baseline over 2 weeks, or when the operator reports visible wear — whichever comes first.*

---

## The three re-grind triggers

1. **Hone growth.** Measured weekly. When the hone has grown 2 µm above the spec value, schedule a re-grind.
2. **Burr trend.** Measured quantitatively on a sample cut. When burr has trended 20 % above the running baseline over 2 weeks, schedule a re-grind.
3. **Operator visual.** Chips, roll-over, galling, or built-up edge visible. Schedule a re-grind that shift.

The most reliable signal is hone growth. Burr trends are a useful early warning. Operator visual is the most lagging signal but the most cost-effective.

---

## Typical re-grind frequency, by knife family

| Knife family | Substrate | Re-grind interval | Re-grinds per year |
|---|---|---|---|
| Paper slitter, D2 | 80 gsm paper | 14 days | 26 |
| Paper slitter, M2 HSS | Tissue 1,200 m/min | 7 days | 52 |
| Film slitter, M2 HSS + TiN | 25 µm BOPP | 21 days | 17 |
| Tissue slitter, M4 HSS | Tissue 1,200 m/min | 30 days | 12 |
| Stainless slitter, M2 HSS + DLC | 304 strip | 18 days | 20 |
| Plate shear, M2 HSS | 6 mm mild steel | 18,000 strokes | 4–6 per year |
| Plate shear, carbide | 6 mm 304 stainless | 22,000 strokes | 3 per year |
| Granulator rotor, M2 HSS | PE film | 14 days | 26 |
| Granulator rotor, YG15 | ASR | 22 days | 16 |
| Crusher blade, YG15 | Concrete rubble | 28 days | 12 |

These are typical numbers; actual frequency depends on substrate variation, line conditions, and knife grade. Use as starting points, then tune.

---

## The cost model

Total cost = (knives × knife cost) + (re-grinds × re-grind cost) + (line downtime × hourly cost) + (scrap from worn knife × scrap value)

Re-grind too often: wastes re-grind capacity, removes material unnecessarily. Re-grind too late: produces scrap, increases edge chipping risk.

The optimum is where the marginal cost of one more re-grind equals the marginal benefit from less scrap. The math is line-specific.

---

## Worked example: paper slitter

D2 slitter on 80 gsm paper, 14-day re-grind, knife €200, re-grind €60, downtime 90 min, hourly margin €1,500, scrap 0.5 % of cut in last 24 h.

At 14-day: 26 × €200 + 26 × €60 + 26 × 1.5 h × €1,500 + scrap ≈ **€70,860/year**.

At 21-day: 17 × €200 + 17 × €60 + 17 × 1.5 h × €1,500 + scrap ≈ **€50,870/year** (more scrap).

At 10-day: 36 × €200 + 36 × €60 + 36 × 1.5 h × €1,500 + negligible scrap ≈ **€90,360/year** (waste).

The optimum is around 14 days. Faster wastes re-grind cost; slower wastes scrap.

---

## How to tune the frequency

1. **Run a 12-week study.** Keep the existing interval, log hone, burr, and scrap at every re-grind.
2. **Plot the curves.** Hone grows linearly; burr trends up exponentially toward end of cycle.
3. **Find the "knee".** Where scrap starts to climb is the earliest practical point. Where hone growth slows is the latest. Pick the middle.
4. **Implement the new interval.** Move in steps of 10–20 % per month.
5. **Re-tune quarterly.** Substrate and line conditions drift.

The 12-week study pays for itself in the first year. Most lines find their re-grind interval is 20–30 % longer than the operator's gut feeling.

---

## The four common frequency mistakes

1. **Fixed calendar interval, ignoring wear.** A knife that wears faster is over-extended.
2. **Operator visual only, ignoring hone growth.** Visual misses the early signal.
3. **"To be safe" re-grind every shift.** Wastes material; knife reaches retirement in 8–10 re-grinds instead of 20–30.
4. **Re-grind "to be efficient", only on knife swap.** Conflates two cycles.

---

## Field cases

**Case 1: paper slitter, 600 m/min.** Re-grinding every 7 days on operator visual. 12-week hone-growth study, optimal at 11 days. Annual savings: €18,000.

**Case 2: stainless plate shear.** Re-grinding every 8,000 strokes on calendar. Burr-trend study, optimal at 14,000 strokes. Annual savings: €12,000.

**Case 3: film slitter.** Running to retirement (18 days) with high scrap. Study, optimal at 14 days with scrap reduction. Annual net: +€8,000.

---

## The decision rule

Re-grind when **any one** is true:

- Hone has grown 2 µm above spec
- Burr has trended 20 % above baseline over 2 weeks
- Operator reports visible wear (chip, roll, gall, BUE)
- Re-grind count has reached the design limit (typically 20–30)

If none is true, do not re-grind. Wait for the next weekly check.

For the broader re-grind framework, see [Maintenance: how to extend slitter life](/maintenance-slitting-blade-life/) and [Preventive maintenance schedule](/maintenance-preventive-schedule/).

For a written re-grind frequency study for your line, send the line layout, current re-grind interval, current scrap rate and current re-grind cost to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Frequency study, decision rules, and tracking sheet within one business day.

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified.*
