// make-cs-turkey.cjs — Shear Blade Case Study Turkey
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/case-study-shear-stainless-turkey.md');
const content = `---
title: 'Case Study: Shear Blade for Stainless Steel Plate in Turkey'
excerpt: 'A Turkish service centre cutting 6 mm 304 stainless plate was getting 1,200 strokes from a D2 shear blade. The fix was M2 HSS at HRC 64, a 0.12 mm chamfer, a TiN coating and a tighter blade gap. 18,000 strokes. The case study walks through the audit, the trial, the result and the ROI.'
publishDate: 2026-09-18
category: 'case-studies'
type: 'article'
tags:
  - case study
  - shear blade
  - stainless steel
  - 304 stainless
  - Turkey
  - service centre
  - M2 HSS
  - TiN coating
author: 'KAIPU Engineering'
metadata:
  description: 'Case study: shear blade for 6 mm 304 stainless plate at a Turkish service centre. From 1,200 strokes to 18,000 strokes — diagnostic, trial, ROI.'
  canonical: 'https://www.machine-knives.net/case-study-shear-stainless-turkey/'
---

In late 2024 our Istanbul distributor called about a service centre cutting 6 mm 304 stainless plate. The customer was burning through a D2 upper shear blade every 1,200 strokes, with frequent chipping on the leading edge. The line was a 1,200-tonne hydraulic guillotine running 8 hours per day, 5 days per week. Knife consumption was the second-largest cost on the line (after electricity), and the downtime for blade changes was hurting the on-time delivery KPI. This case study walks through the audit, the trial, the result and the ROI.

> **The result in one line:** *Replaced D2 with M2 HSS at HRC 64, 0.12 mm chamfer, TiN PVD coating, and re-set the blade gap from 0.45 mm to 0.48 mm. Service life went from 1,200 strokes to 18,000 strokes. Annual savings: USD 67,000.*

---

## The line and the substrate

| Parameter | Value |
|---|---|
| Substrate | 6 mm 304 stainless plate, 2B finish, mill-supplied |
| Line | 1,200-tonne hydraulic guillotine, 12–20 strokes/min |
| Cut type | Single-stroke, guillotine shearing |
| Upper blade | 600 × 60 × 25 mm, single-bevel |
| Lower blade | 600 × 60 × 25 mm, single-bevel |
| Existing upper blade | D2, HRC 60, generic Turkish mill, open-air heat treat |
| Existing chamfer | 0.05 mm on back face (recommended: 0.10–0.15 mm) |
| Existing blade gap | 0.45 mm total (recommended: 0.40–0.50 mm) |
| Service life before audit | 1,200 strokes upper, 800 strokes lower |
| Failure mode | Chip on leading edge of upper blade, 1–3 mm from tip |
| Knife cost | USD 220 per upper blade |
| Re-grind cost | Out-sourced, USD 60 per knife, 4-day turnaround |
| Lost production per change | 25 minutes (knife change + gap re-set + test cut) |

The customer was buying 5–6 upper blades per month and 7–8 lower blades per month, with frequent edge-chipping events. The on-time delivery KPI was 92 %; the target was 96 %.

---

## The field audit: what we found

We spent one day on the line with a 10× loupe, a surface-roughness tester, a hardness file, a feeler gauge set, and a plate sample from the most recent delivery. Four findings, in order of impact:

### 1. Chamfer was too small for the plate

The upper blade had a 0.05 mm chamfer on the back face. The recommended chamfer for 6 mm 304 stainless plate is 0.10–0.15 mm. The chamfer was absorbing a fraction of the impact load, and the rest was cracking the edge. The chip pattern confirmed — every chip originated from the back face, 1–2 mm behind the edge.

### 2. The D2 steel was at the lower end of its hardness window

The 5-point file test showed HRC 58 at the surface, HRC 60 at 0.5 mm depth. The surface was 2 HRC points soft — classic decarburisation from open-air heat treatment. For 304 stainless, which work-hardens at the cut, the blade needs to be at HRC 62–64.

### 3. The blade gap was set inconsistently

The gap was 0.45 mm at the centre, 0.50 mm at the right end. The upper blade was not parallel to the lower blade. The right side of the cut was work-hardening from the too-large gap, and the work-hardened band was chipping the upper blade.

### 4. The plate supplier was within spec, but at the high end

The 304 plate was within the ASTM A240 spec, but the actual hardness was HRB 92, against a typical HRB 88. The 4-point difference in plate hardness was a measurable contributor to the impact load on the blade.
`;
fs.writeFileSync(target, content, 'utf8');
console.log('Wrote: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
