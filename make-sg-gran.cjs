// make-sg-gran.cjs — How to Choose a Granulator Knife (part 1)
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/selection-guide-granulator-knife.md');
const content = `---
title: 'How to Choose a Granulator Knife for Plastics Recycling'
excerpt: 'Granulator rotor and bed knives see impact, contamination and abrasive fillers. The right grade, geometry and edge prep separates a 2-week knife from a 6-month one. This guide covers rotor, bed, screen and wear-strip selection for film, rigid, fibre and filled polymer recycling.'
publishDate: 2026-09-18
category: 'selection-guide'
type: 'article'
tags:
  - granulator knife
  - rotor knife
  - bed knife
  - plastics recycling
  - D2
  - DC53
  - M2 HSS
  - tungsten carbide
author: 'KAIPU Engineering'
metadata:
  description: 'How to choose a granulator knife for plastics recycling: rotor / bed / screen / wear-strip. Substrate by polymer family, grade, geometry, edge prep and field guidance.'
  canonical: 'https://www.machine-knives.net/selection-guide-granulator-knife/'
---

Granulator knives are the most-impact-loaded industrial blades in routine use. They see contamination (metal, sand, foreign polymer), abrasive fillers (glass fibre, mineral, carbon black), and rotor speeds of 400–800 rpm. Get the grade, the geometry or the gap wrong, and the knife chips in days. Get them right, and the same knife runs 3–6 months.

> **One-line summary:** *Bed knives for film and rigid: D2 or DC53 at HRC 58–60, 0.10–0.20 mm chamfer. Rotor knives: M2 HSS at HRC 58–60 with two or four cutting edges, 0.20–0.30 mm chamfer. Glass-filled or mineral-filled: carbide (YG8 / YG10X) on the bed, HSS on the rotor. Heavy contamination: YG15 rotor.*

---

## The granulator system, in one paragraph

A granulator has a rotor (rotating knife block) with 2–5 blades, a bed knife (stationary, mounted on the lower frame), a screen (perforated plate that sizes the output), and wear strips (replaceable inserts in the cutting chamber). Material enters the cutting chamber, is sheared between rotor and bed knives, passes through the screen, and is discharged. The rotor knife does 70 % of the work; the bed knife does 30 %; the screen and wear strips are consumable but not "knives" in the traditional sense.
`;
fs.writeFileSync(target, content, 'utf8');
console.log('Wrote part 1: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
