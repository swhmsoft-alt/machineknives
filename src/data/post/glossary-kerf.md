---
title: 'Kerf — Industry Glossary Entry'
excerpt: 'Definition of kerf in industrial cutting: the width of material removed by the cut, how it is measured, the substrate-by-substrate range, and how it relates to slitter-set-up and material yield.'
publishDate: 2026-09-18
category: 'glossary'
type: 'glossary'
entityType: 'term'
tags:
  - kerf
  - cut width
  - slitter set-up
  - material yield
author: 'KAIPU Engineering'
metadata:
  description: 'Industrial cutting kerf — definition, how it is measured, the substrate-by-substrate range, and the relationship to slitter knife thickness and material yield.'
  canonical: 'https://www.machine-knives.net/glossary/kerf/'
---

**Kerf** is the width of material removed by a single cut, equal to the thickness of the knife at the cut plus any lateral spread of the cut into the substrate. Kerf is a critical parameter on slitting and cut-to-length lines because it directly determines material yield — every millimetre of kerf is a millimetre of substrate that becomes scrap instead of sellable product.

**Units:** millimetres (mm) on industrial blades, micrometres (µm) on thin-film / foil slitting.

**How it is calculated:**

- **Slitting (top + bottom knife):** kerf = knife thickness at cut + lateral spread. For a 1.5 mm top knife on a 0.1 mm film, the knife thickness dominates and the kerf is 1.5 mm.
- **Shearing (single cut):** kerf = clearance between upper and lower blades + lateral spread. For a 6 % gap on 1 mm sheet, the kerf is roughly 0.06 mm.
- **Blanking (die cut):** kerf = die clearance (typically 5–12 % of material thickness) + die wear.

**Typical kerf by cut type:**

| Cut type | Kerf | Yield impact |
|---|---|---|
| Industrial circular slitting (1–3 mm knives) | 1.0–3.0 mm | Low — the kerf is amortised over a wide web |
| Precision slitting (0.5–1.5 mm knives) | 0.5–1.5 mm | Moderate — multiple slits on a single web |
| Thin-film slitting (50–200 µm knives) | 0.05–0.20 mm | High — every 50 µm of kerf is yield lost |
| Plate shearing | 0.05–0.50 mm | Low — single cut on wide stock |
| Laser / waterjet cutting | 0.1–0.5 mm | Variable — depends on assist gas / nozzle |

**Kerf and material yield on a slitting line:** for a web of width W slit into N strips, the total kerf is (N-1) × kerf. The percentage of material lost to kerf is (N-1) × kerf / W. A 0.1 mm increase in kerf on a 1,000 mm wide web slit into 50 strips costs 0.5 % of yield. Over a year, that adds up.

**How to minimise kerf:**

- Use the thinnest knife that maintains the required strength and stiffness.
- For a given knife thickness, minimise the hone radius — a 5 µm hone cuts cleaner than a 15 µm hone.
- Ensure knife-to-anvil parallel within 0.01 mm to prevent the knife from tilting and widening the cut.
- Use the lowest knife grade that will survive the substrate (D2 instead of M2 if the wear life is acceptable — D2 is usually available in thinner stock).

**See also:** [Hone (micro-hone)](/glossary/hone/), [Clearance angle](/glossary/clearance-angle/), [The KAIPU 5-Factor Blade Selection Framework](/kaipu-5-factor-blade-selection-framework/).
