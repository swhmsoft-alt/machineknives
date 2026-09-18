// make-tb-chip.cjs — Edge Chipping Diagnosis on Paper Slitter
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/troubleshooting-edge-chipping-paper-slitter.md');
const content = `---
title: 'Edge Chipping Diagnosis on a Paper Slitter: A Field Flowchart'
excerpt: 'Edge chipping on a paper slitter has four root causes, and each has a different fix. This article walks through the 10-minute diagnostic — visual, dimensional, hardness, line-side — and the corrective action that actually works.'
publishDate: 2026-09-18
category: 'troubleshooting'
type: 'article'
tags:
  - edge chipping
  - paper slitter
  - blade failure
  - diagnosis
  - troubleshooting
author: 'KAIPU Engineering'
metadata:
  description: 'Edge chipping on a paper slitter: 10-minute field diagnostic flowchart. Visual inspection, dimensional check, hardness test, line-side audit, corrective action by root cause.'
  canonical: 'https://www.machine-knives.net/troubleshooting-edge-chipping-paper-slitter/'
---

Edge chipping is the single most-asked-about failure mode on a paper slitter. The question is always "my knife is chipping, what should I do?" The honest answer is "look at the chip, then look at the line" — the visual tells and the line conditions together land on the right root cause in under 10 minutes. This post is the diagnostic flow we ship to customers who call with a chipping knife.

> **One-line summary:** *Chip on the back face = hone too sharp or hardness too high. Chip on the front face = substrate contamination. Chip at the corner = knife-to-anvil parallel off. Multiple chips around the edge = decarburisation or heat-treat drift.*

---

## The 10-minute diagnostic

### Step 1: visual (2 minutes)

Look at the chip under a 10× loupe. Where is it, what is its shape, are there more than one?

- **Single chip, back face, 0.1–1 mm.** Hone too sharp, or hardness too high for the substrate. Fix: increase hone to substrate-appropriate radius, or drop hardness by 2 HRC.
- **Multiple chips, even distribution, front face.** Substrate contamination. Fix: audit incoming substrate for hard particles, check extraction, check unwind / wind tensions.
- **Chip at one corner only, repeating every shift.** Mechanical alignment. Fix: check knife-to-anvil parallel, runout, knife clamp.
- **Multiple chips, irregular pattern, all over the edge.** Heat-treat drift. Fix: 5-point hardness file test; if any point is below HRC 56, the knife is bad.

### Step 2: dimensional (2 minutes)

Measure the knife with a calibrated micrometer and a dial indicator. Compare to the last good knife.

- **OD, ID, thickness, runout.** Any point out of spec by > 0.02 mm is suspect. A knife that has lost 0.10 mm of thickness is past its useful life.
- **Edge profile under a microscope.** A rounded edge (no hone visible) means the knife has been over-re-ground. A sharp edge (no hone at all) means the re-grind shop removed the hone.
- **Surface finish.** A 10× loupe check is enough. Mirror finish on a paper slitter is wrong; you want a fine satin finish from the re-grind wheel.

### Step 3: hardness (2 minutes)

Run a 5-point hardness file test on the knife. The 5 points: centre, two mid-radius, two edge points.

- **All 5 within ± 1 HRC of the target.** Heat-treat is OK. Look elsewhere for the cause.
- **Edge points 2+ HRC softer than centre.** Decarburisation. The knife was heat-treated in open air, and the surface is soft. The substrate cracks the soft surface. Replace the knife.
- **All 5 below the target band.** The knife is over-tempered, or the heat-treat was wrong. Replace the knife, audit the heat-treat supplier.
- **All 5 above the target band.** The knife is over-hardened. The brittleness is chipping the edge. Drop the next knife to the target band.

### Step 4: line-side (2 minutes)

Audit the line itself, looking for the variables that cause chipping:

- **Web tension.** 30–80 N/m for paper, 50–150 N/m for film. A tension spike > 20 % above setpoint will chip a tight-honed knife.
- **Knife-to-anvil parallel.** 0.01 mm. A 0.05 mm deviation = chip on one side.
- **Knife runout.** 0.02 mm. A 0.05 mm deviation = chip on the high side.
- **Coolant flow.** 5+ bar at the nozzle. A drop to 2 bar = no cooling = thermal damage = chipping.
- **Line speed.** Within the knife's rated window. A 20 % overspeed = thermal chipping.
- **Substrate batch.** Has the SKU changed? A harder or thicker batch will chip a tight-honed knife.

### Step 5: re-grind history (2 minutes)

Check the knife tracking sheet. How many re-grinds has this knife seen? Is the re-grind SOP being followed?

- **Knife is past 25 re-grinds.** The decarb layer has crept in, the chamfer is worn, the geometry is off. Retire the knife.
- **Re-grind amount > 0.10 mm per side.** The re-grind shop is over-grinding. Audit the shop.
- **Re-grind surface finish is too smooth.** A paper slitter wants Ra 0.4–0.6 µm. A mirror finish (< 0.1 µm) does not wipe cleanly and promotes built-up edge.
- **Hone is not restored to substrate-appropriate radius.** The most-common re-grind error.
`;
fs.writeFileSync(target, content, 'utf8');
console.log('Wrote: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
