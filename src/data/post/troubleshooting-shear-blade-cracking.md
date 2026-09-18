---
title: 'Why Your Shear Blade Keeps Cracking at the Edge'
excerpt: 'A plate shear blade that cracks at the edge is almost always one of four things: chamfer too small, hardness too high, blade gap wrong, or plate out of spec. This article walks through the diagnostic and the fix for each, with a field case for stainless, mild and AR plate.'
publishDate: 2026-09-18
category: 'troubleshooting'
type: 'article'
tags:
  - shear blade cracking
  - plate shear
  - swing beam shear
  - guillotine
  - chamfer
  - blade gap
author: 'KAIPU Engineering'
metadata:
  description: 'Why a plate shear blade keeps cracking at the edge. Four root causes, the diagnostic flow, the fix for each, and field cases for stainless, mild steel and AR plate shearing.'
  canonical: 'https://www.machine-knives.net/troubleshooting-shear-blade-cracking/'
---

A plate shear blade that cracks at the edge is one of the most expensive failures in industrial cutting — a single crack can scrap a 600 mm blade worth €800–2,000, and the shear is out of service for the changeover. The four root causes are predictable, and each has a different fix. This article walks through the diagnostic and the field guidance for each.

> **One-line summary:** *Chamfer too small = crack from the back face. Hardness too high = crack from the edge. Blade gap wrong = crack on one side. Plate out of spec = crack from impact. Match the chamfer, hardness, gap and substrate to the plate thickness.*

---

## The four root causes

### 1. Chamfer too small (35 % of cases)

The chamfer is the flat behind the edge, on the back face. It absorbs the impact load on first contact with the plate. A chamfer that is too small for the plate thickness will crack on every stroke.

| Plate thickness | Minimum chamfer | Recommended chamfer |
|---|---|---|
| ≤ 2 mm | 0.05 mm | 0.05–0.10 mm |
| 2–6 mm | 0.08 mm | 0.10–0.15 mm |
| 6–12 mm | 0.15 mm | 0.20–0.25 mm |
| 12–25 mm | 0.20 mm | 0.25–0.30 mm |

**Diagnostic.** Look at the crack under a 10× loupe. If the crack originates from the back face, 0.5–2 mm behind the edge, the chamfer is too small. Measure the chamfer with a calibrated microscope. If it is below the recommended range for the plate thickness, the diagnosis is confirmed.

**Fix.** Re-grind the chamfer to the recommended size. Check that the re-grind SOP specifies the chamfer by plate thickness, not by feel.

### 2. Hardness too high (25 % of cases)

A shear blade that is too hard for the plate thickness is brittle. The plate impact cracks the edge. The crack originates at the very tip of the edge, not from the back face.

| Plate thickness | Maximum hardness |
|---|---|
| ≤ 6 mm | HRC 64 (M2 HSS) |
| 6–12 mm | HRC 60 (M2 HSS, drop 2 points) |
| 12–25 mm | HRC 58 (H13, drop further) |

**Diagnostic.** Look at the crack. If it originates at the very edge, the hardness is too high. 5-point hardness file test confirms.

**Fix.** Drop the next knife to the substrate-appropriate hardness. For thick plate, move to a tougher grade (DC53, H13) rather than dropping the hardness of M2.

### 3. Blade gap wrong (25 % of cases)

A too-small blade gap work-hardens the cut surface, and the work-hardened band cracks the edge. A too-large gap causes the plate to bend, the cut is rough, and the plate drops with a bang.

| Plate thickness | Gap per side | Total gap |
|---|---|---|
| 2 mm | 0.10–0.14 mm | 0.20–0.28 mm |
| 4 mm | 0.20–0.32 mm | 0.40–0.64 mm |
| 6 mm | 0.30–0.54 mm | 0.60–1.08 mm |
| 12 mm | 0.84–1.20 mm | 1.68–2.40 mm |

**Diagnostic.** Measure the blade gap with a feeler gauge, both blades in the closed position, at the centre and at both ends. If the gap is below or above the recommended range, the diagnosis is confirmed.

**Fix.** Re-set the gap. Re-grind the blades if the gap is consistently off (the blades may have worn unevenly).

### 4. Plate out of spec (15 % of cases)

A plate that is harder, thicker, or has higher tensile strength than the knife was specced for will crack the edge. The plate supplier may have quietly changed the grade.

**Diagnostic.** Measure the plate thickness with a calibrated micrometer. Run a hardness file test on the plate (Poldi hammer, portable hardness tester, or a sample sent to the lab). If the plate is harder or thicker than the spec, the diagnosis is confirmed.

**Fix.** Work with the plate supplier to confirm the grade. If the plate is regularly out of spec, upgrade the knife to a tougher grade or a wider chamfer.

---

## The 10-minute diagnostic

1. **Visual.** Where does the crack originate? Back face = chamfer. Tip of edge = hardness. One side only = gap or alignment. Random = plate or knife quality.
2. **Chamfer measurement.** Calibrated microscope. Below the recommended range? → chamfer too small.
3. **Hardness test.** 5-point file test. Above the recommended range? → too hard.
4. **Blade gap measurement.** Feeler gauge, both ends + centre. Outside the recommended range? → gap wrong.
5. **Plate check.** Thickness, hardness, surface. Out of spec? → plate out of spec.

Five checks, 10 minutes, one of the four root causes lands.


---

## Field cases

**Case 1: 316 stainless plate shear, 5 mm, hydraulic guillotine, 30 strokes/min.** Customer was cracking an M2 HSS shear blade every 800 strokes. Visual: crack from the back face, 1 mm behind the edge. Chamfer was 0.05 mm, recommended for the substrate was 0.10 mm. Re-ground the chamfer to 0.10 mm, added a TiN coating. Service life: 18,000 strokes.

**Case 2: Mild steel plate shear, 12 mm, swing-beam, 20 strokes/min.** Customer was cracking an M2 HSS blade every 200 strokes. Visual: crack from the very tip. Hardness test: HRC 64, recommended for 12 mm is HRC 60. Dropped to HRC 60, kept M2. Service life: 22,000 strokes.

**Case 3: Hardox 450 plate shear, 8 mm.** Customer was cracking a D2 shear blade every 50 strokes. Visual: crack from impact, irregular. Plate was out of spec — actual hardness was HB 480, not the HB 450 of the spec. Worked with the plate supplier, switched to a carbide shear insert. Service life: 22,000 strokes.

**Case 4: Mild steel plate shear, 6 mm, 25 strokes/min.** Customer was cracking on one side only. Visual: crack on the right side of the upper blade, the side that hits the plate first. Blade gap was 0.10 mm on the left, 0.40 mm on the right (the right side was worn). Re-ground the upper blade to restore the parallel gap. Crack eliminated.

---

## Common false diagnoses

A few patterns show up over and over, and they are almost always wrong:

1. **"The steel is wrong."** Almost always the chamfer, the hardness, or the gap. Change one variable at a time.
2. **"The plate is harder than spec."** Sometimes, but check the chamfer first. A 0.05 mm chamfer on a 12 mm plate is the most common cause of cracking on plate shears.
3. **"We need a harder knife."** A harder knife on a 12 mm plate will crack faster, not slower. Drop the hardness, increase the chamfer.
4. **"The re-grind shop over-ground."** Possible, but the original chamfer may have been too small. The shop followed the drawing; the drawing was wrong.
5. **"The blade gap is set correctly."** Measure it. A 0.1 mm gap difference across the blade length is invisible to the eye.

---

## When the diagnostic does not land

If visual, chamfer, hardness, gap and plate checks all pass, and the knife is still cracking, the answer is one of:

- **Knife material defect.** An inclusion, a forging lap, a quench crack. Send the knife to a metallurgical lab.
- **Plate has inclusions or hard spots.** The plate itself has metallurgical defects. Send a plate sample to the lab.
- **Knife has been damaged in storage.** Drop, dent, or impact in the tool crib. Inspect every knife on receipt.
- **Shear frame is misaligned.** The upper or lower blade rail is bent. Check with a dial indicator across the full frame.

For a written diagnosis on a cracked shear blade, send the cracked blade, the line log, the plate batch records and the blade gap measurement to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Diagnosis within 24 hours, replacement blade within 3 weeks.

For the broader shear blade selection guidance, see [How to choose a shear blade for plate steel](/selection-guide-shear-blade-plate-steel/) and [Troubleshooting: why is my blade wearing out too fast?](/troubleshooting-premature-wear/).

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified. Ships to converters, recyclers and OEMs across four continents, with a dedicated shear-blade cell for hot-rolling-mill and service-centre customers.*
