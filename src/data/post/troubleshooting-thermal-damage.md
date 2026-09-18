---
title: 'Thermal Damage Diagnosis: When Your Slitter Knife Turns Blue'
excerpt: 'A slitter knife that turns blue, straw or purple is being annealed in service. The edge temperature has exceeded the tempering temperature. The fix is usually cooling, then grade upgrade, then coating.'
publishDate: 2026-09-18
category: 'troubleshooting'
type: 'article'
tags:
  - 'thermal damage'
  - 'blueing'
  - 'edge overheating'
  - 'tissue slitter'
  - 'high-speed cutting'
  - 'cooling'
author: 'KAIPU Engineering'
metadata:
  description: 'A slitter knife that turns blue, straw or purple is being annealed in service. The edge temperature has exceeded the tempering temperature. The fix is usually cooling, then grade upgrade, then coating.'
  canonical: 'https://www.machine-knives.net/troubleshooting-thermal-damage/'
---

A slitter knife that turns blue, straw or purple is being annealed in service. The edge temperature has exceeded the tempering temperature of the steel. The fix is usually cooling first, then grade upgrade, then coating.

> **One-line summary:** *Blue / straw / purple = edge temperature above tempering. Add active cooling first; if not enough, move to a hot-hardness steel (M2 HSS, M42) or apply a hot-hardness coating (TiAlN, AlCrN).*

---

## What the colours mean

| Colour | Temperature (°C) | What happened |
|---|---|---|
| Bright | < 200 | Normal |
| Straw | 200–250 | Temper-back begins; hardness drops 1–2 HRC |
| Bronze | 250–300 | Temper-back; hardness drops 2–4 HRC |
| Purple | 300–350 | Major temper-back; wear life halved |
| Blue | 350–450 | Severe temper-back; wear life quartered |
| Grey / black | > 450 | Edge has lost secondary hardness; knife is scrap |

A D2 knife tempered at 510–530 °C starts to lose hardness at 350 °C in service. M2 HSS holds until 550 °C. M42 HSS (8 % Co) holds until 600 °C. The colour is your in-process thermometer.

---

## The four root causes

### 1. Insufficient or no cooling (40 %)

A line that runs dry, or with a coolant nozzle pointed at the wrong angle, will see edge temperatures 100–200 °C above a properly cooled line. The cheapest insurance on the line.

**Fix:** Move the nozzle to within 100 mm of the cut, raise pressure to 5+ bar, aim at the cut. Add a second nozzle on the opposite side for symmetric cooling.

### 2. Line speed above the knife's rated window (25 %)

A 20 % overspeed does not just give 20 % more friction — it can give 2–3× more heat, because the cooling time per unit length is reduced.

**Fix:** Derate the line speed to within the knife's rated window. If the line must run faster, the knife must be M2 HSS or M42 HSS with a hot-hardness coating.

### 3. Hone too small for the substrate at the line speed (20 %)

A 0–2 µm hone on a high-speed line concentrates cutting energy at the edge. The edge overheats.

**Fix:** Increase hone to 10–15 µm for a high-speed tissue or film line.

### 4. Steel grade with insufficient hot hardness (15 %)

A D2 knife at 1,200 m/min on tissue will blue. D2 is not a hot-hardness steel.

**Fix:** Move to M2 HSS, M35 HSS, or M42 HSS. Pair with a TiAlN or AlCrN PVD coating for further hot-hardness margin.

---

## The 5-minute visual diagnostic

1. **Look at the colour.** All around the edge, or only at the centre? Only at the centre = web tension issue; all around = general thermal damage.
2. **Measure hardness at the discoloured area.** 5-point file test. If hardness is below target, the steel has been over-tempered.
3. **Measure hardness at a non-discoloured area.** Compare.
4. **Inspect the cut surface.** Over-tempered knives produce a rougher cut and more dust.
5. **Check the coolant.** Is the nozzle aimed at the cut? Is the pressure > 5 bar? Is the concentration > 5 %?

---

## The corrective action, in order

1. **Add active cooling.** Aim at the cut, 5+ bar, flood not mist.
2. **Increase the hone.** Move to 10–15 µm if you are below.
3. **Derate the line speed.** 10–20 % reduction.
4. **Move to a hot-hardness steel.** M2 HSS, M35 HSS, M42 HSS, or carbide.
5. **Apply a hot-hardness coating.** TiAlN, AlCrN, CrAlN.

The cheapest fix is the first one. Most thermal-damage events are fixed by step 1.

---

## Field cases

**Case 1: tissue slitter, 1,200 m/min.** Blue edges on D2 slitters within 3 days. Coolant was a single mist nozzle 600 mm from the cut at 2 bar. We added a second flood nozzle at 80 mm, raised pressure to 7 bar, switched to 7 % emulsion. Blueing gone. Knife life went from 4 days to 19 days.

**Case 2: film slitter, 800 m/min, PET.** Purple edges on M2 HSS slitters within 5 days. Line speed was 800 m/min on a knife rated for 600 m/min. We derated to 650 m/min, applied TiAlN coating. Purple gone. Life went from 5 days to 21 days.

**Case 3: foil slitter, 50 µm aluminium, 200 m/min, dry cut.** Grey edges on D2 slitters within 1 shift. Switched to M2 HSS at HRC 64 with TiAlN coating. Grey gone. Life went from 1 shift to 14 shifts.

---

## The spec to write

> "Slitter, [OD] × [ID] × [thickness] mm, AISI M2 HSS (or M42, or carbide), vacuum heat-treated to HRC [62–64] ± 1, 5-point file test, [PVD coating: TiAlN / AlCrN / CrAlN] for hot-hardness, [10–15] µm hone, [active cooling: flood, 5+ bar, 5–8 % emulsion]. Line speed: [X] m/min. Substrate: [tissue / film / foil / etc.]. Mill certificate with ladle chemistry and coating report required."

For the broader troubleshooting framework, see [Why is my blade wearing out too fast?](/troubleshooting-premature-wear/) and [Chipping (glossary entry)](/glossary/chipping/).

For a written thermal damage diagnosis, send the discoloured knife, the line log, the substrate spec and the current cooling configuration to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Diagnosis within 24 hours.

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified.*
