// make-sg-shear.cjs — How to Choose a Shear Blade for Plate Steel (part 1)
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/selection-guide-shear-blade-plate-steel.md');
const content = `---
title: 'How to Choose a Shear Blade for Plate Steel (Hot Rolling Mill)'
excerpt: 'Plate shear blades see impact, work-hardening substrate and variable stock thickness. The grade, hardness and chamfer choice drive a 10× difference in service life between a mill-spec blade and a generic one. This guide covers carbon steel, stainless, high-strength and abrasion-resistant plate.'
publishDate: 2026-09-18
category: 'selection-guide'
type: 'article'
tags:
  - shear blade
  - plate steel
  - swing beam shear
  - guillotine shear
  - D2
  - M2 HSS
  - carbide shear
author: 'KAIPU Engineering'
metadata:
  description: 'How to choose a shear blade for plate steel in hot rolling mill and service centre applications. Substrate by family, grade and chamfer selection, blade gap, field cases.'
  canonical: 'https://www.machine-knives.net/selection-guide-shear-blade-plate-steel/'
---

Plate shear blades are the highest-impact industrial cutting tool in routine use. They see a single, hard cut per stroke on a plate that can be 6–25 mm thick, often work-hardened from prior rolling, often with a hard scale on the surface. Get the grade, the chamfer, the clearance or the gap wrong, and the blade chips inside 1,000 cycles. Get them right, and a blade survives 30,000+ cycles.

> **One-line summary:** *For ≤ 6 mm carbon steel, M2 HSS at HRC 62 with a 0.10–0.15 mm chamfer. For ≤ 4 mm stainless or 17-4PH, M2 HSS at HRC 64 with a TiN coating, or a carbide shear insert. For ≥ 6 mm, drop the hardness and increase the chamfer. For AR400 / Hardox, a carbide insert is the only answer.*

---

## The shear geometry, in one diagram

A plate shear is a matched upper and lower blade, with a defined blade gap, a clearance angle, a chamfer on the back face, and a rake angle on the front face. The cut happens because the upper and lower blades pass each other with the plate in the middle, and the plate fails in shear. The blade geometry controls the burr, the cut angle, the noise, the power draw, and the blade life.

The five numbers that matter:

- **Chamfer on the back face.** The flat behind the edge, 0.05–0.30 mm depending on grade and plate thickness.
- **Rake angle (front face).** Usually 0° to 3° for plate shears. Positive rake reduces cutting force; negative rake increases blade life.
- **Clearance angle (back face).** 0.5–2° from the cut face. Too small = drag, too large = bending instead of shearing.
- **Blade gap.** 5–12 % of plate thickness, set with a feeler gauge. Too small = work-hardening, too large = rollover.
- **Hardness.** HRC 56–64 depending on grade and impact.
`;
fs.writeFileSync(target, content, 'utf8');
console.log('Wrote part 1: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
