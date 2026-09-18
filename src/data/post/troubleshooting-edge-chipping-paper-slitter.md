---
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


---

## The four root causes, ranked by frequency

### 1. Hone too sharp (40 % of cases)

A hone that is too small for the substrate is the single most common cause of edge chipping. A 0–2 µm hone on a 600 m/min paper line fails by micro-chipping within hours.

**Fix.** Specify the hone by substrate, not by feel. 5–10 µm for paper, 10–15 µm for tissue and non-woven, 5–10 µm for film. Bake the hone into the re-grind SOP.

### 2. Hardness too high (25 % of cases)

HRC 64 on a knife that the substrate allows HRC 60 will chip. Hardness is a wear-vs-toughness trade; a 2-point drop buys 20–30 % more chip resistance.

**Fix.** Drop the next knife to the substrate-appropriate hardness. 58–60 for most paper, 60–62 for tough substrates, 62–64 only for thin knives on clean substrates.

### 3. Heat-treat quality (20 % of cases)

A decarburised surface is soft. The substrate cracks the soft skin on impact. A 5-point hardness file test catches it. A metallographic check (cross-section, etch) confirms.

**Fix.** Replace the knife, audit the heat-treat supplier. The 5-point file test on receipt is mandatory for any critical knife.

### 4. Substrate contamination (10 % of cases)

A hard particle in the substrate (sand, metal fragment, agglomerate) hits the edge at line speed and chips it. The chips are on the front face, often clustered in one area where the contamination was concentrated.

**Fix.** Audit incoming substrate. The defect rate should be < 0.1 %; if higher, work with the supplier.

### 5. Line-side (5 % of cases)

Tension spike, parallel off, runout off, coolant drop, overspeed. These are the line-side variables that the PM schedule should catch before they cause chipping.

**Fix.** Follow the PM schedule. Most line-side issues are visible days before the chip.

---

## Field cases

**Case 1: Tissue slitter, 320 mm, 1,200 m/min, 18 gsm.** Customer was chipping a D2 knife within 4 days of re-grind. Hone was 0–2 µm. Spec called for 15 µm. We supplied a knife with the correct hone, and added a re-grind SOP that specified 15 µm. Service life went from 4 days to 32 days.

**Case 2: Paper slitter, 250 mm, 400 m/min, 80 gsm.** Customer was chipping a D2 knife within 14 days. 5-point hardness test showed edge at HRC 56, centre at HRC 60. Decarburisation. Replaced the knife, audited the heat-treat supplier, found an open-air furnace. Switched supplier, no more chipping from decarb.

**Case 3: Film slitter, 200 mm, 600 m/min.** Customer was chipping an M2 HSS knife within 7 days. Visual showed chips on the front face, clustered in one area. Audited the substrate: 0.8 % defect rate, hard particles. Worked with the film supplier to drop to 0.1 %. No more chipping.

---

## When the diagnostic does not land on a root cause

If the visual, dimensional, hardness, line-side and re-grind checks all pass, and the knife is still chipping, the answer is one of:

- **Substrate that does not match the assumed substrate.** A change in incoming material that was not logged. Send a sample to the lab.
- **Heat-treat that passed the file test but failed in service.** Request a metallographic check from the heat-treat supplier.
- **Knife design.** A knife that is too thin for the substrate, or has too aggressive a rake angle, will chip. Send the drawing to the supplier for review.

For a written chip diagnosis on a specific knife, send the chipped knife, the line log and the substrate batch records to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Diagnosis within 24 hours.

For the broader troubleshooting framework, see [Why is my blade wearing out too fast?](/troubleshooting-premature-wear/) and [Chipping (glossary entry)](/glossary/chipping/).

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified. Ships to converters, recyclers and OEMs across four continents.*
