---
title: 'D2 vs SKD11: Are They Really the Same Steel?'
excerpt: 'AISI D2 and JIS SKD11 are the most-quoted cold-work tool steels in industrial blade manufacturing. They share a spec sheet — but the heat treatment, dimensional consistency and field performance are not identical. Here is the engineering comparison.'
publishDate: 2026-09-18
category: 'material-comparison'
type: 'article'
tags:
  - D2 tool steel
  - SKD11
  - DC53
  - '1.2379'
  - Cr12Mo1V1
  - cold work tool steel
  - industrial knives
author: 'KAIPU Engineering'
metadata:
  description: 'D2 vs SKD11 for industrial machine knives. Chemistry, hardenability, dimensional stability, edge retention and sourcing. The honest answer to whether they are interchangeable.'
  canonical: 'https://www.machine-knives.net/d2-vs-skd11/'
---

Sales engineers have a running joke: when a customer asks for "D2 or equivalent", nine times out of ten they mean SKD11, and when they ask for "SKD11 or equivalent" they actually want D2. The reason is that the two grades share a chemistry, a hardness range and an application window — and the international blade market treats them as interchangeable. The honest engineering answer is that they are *almost* the same steel, but the sourcing, heat-treatment behaviour and dimensional consistency differ in ways that matter on a precision blade.

> **TL;DR:** *D2 and SKD11 are chemically equivalent (AISI D2 ≈ JIS SKD11 ≈ DIN 1.2379 ≈ GB Cr12Mo1V1). In practice, JIS SKD11 has tighter dimensional stock tolerances and more consistent vacuum-heat-treat response. AISI D2 has wider global availability. For industrial blades, both are fine — but specify the standard, not the trade name.*

---

## Chemistry, side by side

Both grades are high-carbon, high-chromium cold-work tool steels, hardened by M₇C₃ carbides in a tempered martensite matrix. Standard target composition:

| Element | AISI D2 (UNS T30402) | JIS SKD11 | DIN 1.2379 | GB Cr12Mo1V1 |
|---|---|---|---|---|
| C | 1.40–1.60 % | 1.40–1.60 % | 1.45–1.60 % | 1.40–1.60 % |
| Cr | 11.0–13.0 % | 11.0–13.0 % | 11.0–13.0 % | 11.0–13.0 % |
| Mo | 0.70–1.20 % | 0.80–1.20 % | 0.70–1.00 % | 0.70–1.20 % |
| V | 0.50–1.10 % | 0.20–0.50 % | 0.70–1.00 % | 0.50–1.10 % |
| Mn, Si, Ni, Co | within overlap ranges; see mill cert | | | |

The single most-asked question we get is about the **vanadium** range — D2 allows up to 1.10 %, SKD11 caps at 0.50 %. Vanadium forms very hard MC carbides that resist wear but also make the steel harder to grind. A 1 % V D2 is noticeably more wear-resistant than a 0.3 % V SKD11, but it takes 25–35 % longer to grind to a finished edge.

---

## The two practical differences that actually matter

**1. Dimensional consistency of the as-rolled stock.** JIS SKD11 is typically produced to tighter dimensional tolerances than generic AISI D2. For a precision blade — say a 250 mm OD circular slitter ground to ± 0.01 mm — that translates to less material removal to reach finish, less risk of decarburisation at the surface, and tighter final dimensions after heat treatment. In our shop the as-rolled diameter tolerance of Japanese-mill SKD11 is roughly half the spread of generic D2.

**2. Heat-treat response.** Both are air-hardening, but the hardenability window is wider for SKD11. Standard cycle: 1,020 °C austenitise, 30 min hold, air cool, triple-temper at 530 °C to HRC 60–61 with sub-0.1 % retained austenite. Generic D2 from a smaller mill needs tighter control to hit the same result. A 1 % V D2 also responds to a higher austenitising temperature (~ 1,050 °C) with more vanadium carbide dissolution, which boosts wear resistance but raises distortion risk.

---

## Hardness, wear and grindability

| Property | D2 (typical) | SKD11 (typical) |
|---|---|---|
| As-delivered (annealed) | HB 220–255 | HB 220–255 |
| Hardened | HRC 58–62 | HRC 58–62 |
| Maximum practical | HRC 64 (with care) | HRC 62 |
| Wear resistance (relative) | 1.0 | 0.85–0.95 |
| Grindability (relative) | 0.75 | 1.0 (easier) |
| Dimensional change on hardening | +0.05 % to +0.20 % | +0.05 % to +0.15 % |
| Charpy C-notch toughness | 18–28 J | 20–30 J |

For an industrial machine knife the practical working hardness is **HRC 58–62**. Going above 62 reduces chipping resistance on thin blades and is rarely justified.

---

## Where each grade earns its specification

**Specify D2 when:** the blade is large or thick (> 25 mm) and toughness dominates; the line includes high-impact events (granulator rotors, shear blades on misaligned stock); you have a written AISI / UNS spec; the substrate is paper, tissue, film or light packaging where D2's wear resistance is more than enough; you need a known global supply chain.

**Specify SKD11 when:** the blade is a precision slitter, shear or doctor blade with tight dimensional tolerance; the blade is thin (< 5 mm) and chipping is a real risk — SKD11's lower V content makes it tougher; your customer is in Japan, Korea, Taiwan or China; you heat-treat in-house and want a wider hardenability window.

**Specify DC53 (Daido) or 1.2379+ when:** you want a step up in toughness at the same hardness. DC53 is a refinement of SKD11 with finer carbides and ~ 1.5–2× the toughness. Cost is ~ 30 % higher; only worth it for the most demanding applications.

---

## Heat treatment: where the field failures start

Nine out of ten premature D2 or SKD11 blade failures we investigate are heat-treatment problems, not steel-grade problems. The recurring patterns:

1. **Under-tempering.** Triple-temper at 530 °C for 2 hours each. Single-temper leaves retained austenite that transforms during service and shifts dimensions.
2. **Over-austinising.** Above 1,060 °C dissolves too much carbide, coarsens the grain and reduces toughness. Stay at 1,020–1,050 °C.
3. **Inadequate surface protection.** Both grades decarburise in open-air furnace. Vacuum or salt-bath heat treatment, or stainless foil wrap, is mandatory for a finished blade.
4. **Straightening after quench.** Forced straightening introduces residual stress that will move during grinding. Cool slowly, machine after temper.

If your heat-treat supplier cannot show you a tempering chart with a hardness reading per temper, change supplier.

---

## Field cases from the KAIPU shop

**Case 1: Tissue slitter, 320 × 25 × 4 mm.** Customer was getting 11 days of life from generic D2 bed knives. We quoted the same geometry in Japanese-mill SKD11 with vacuum heat treatment to HRC 60–61. Service life went to 34 days at the same line speed. The steel chemistry was within 0.1 % of the original D2 spec — the win came from cleaner stock and a more consistent heat-treat.

**Case 2: Crusher blade, 600 × 200 × 30 mm.** Customer quoted in D2; we recommended DC53 instead. The cost difference (≈ 30 %) paid back in 4 months because the DC53 blade survived a metal contamination event that had cracked every previous D2 blade.

**Case 3: Paper shear, 600 × 60 × 20 mm.** Customer specified D2 in the drawing. We supplied JIS SKD11 as the equivalent and stamped the part with the original AISI reference. Now standard stock in three paper mills in Southeast Asia.

---

## Sourcing checklist for a precision blade

Ask the mill for: mill certificate with the actual ladle chemistry (not just the grade name); ultrasonic test report for bar stock above 50 mm thickness; inclusion rating (ASTM E45 method A, worst-field) — should be ≤ 1.0 thin, ≤ 0.5 heavy; decarburisation depth — for a finished blade, ≤ 0.1 mm per side.

If the mill certificate shows a chemistry that meets multiple standards, you can stamp the blade as D2, SKD11, 1.2379 or Cr12Mo1V1 to suit the destination market.

---

## When D2 / SKD11 are the wrong answer

Not the right steel for: high-temperature cutting above ~ 400 °C at the edge (M2 HSS or M4 HSS); stainless plate shearing beyond 4 mm thickness (carbide shear inserts outlast D2 by 5–10×); food-contact cutting with strict regulatory limits on chromium or nickel migration (specify 440C or a martensitic stainless); sub-zero cutting of frozen food or cryogenic applications (AISI D2 loses toughness below −40 °C).

---

## The engineering recommendation

For an industrial machine knife at HRC 58–62, the choice between D2 and SKD11 is less important than the choice of mill, the heat treatment and the edge preparation. If the steel is from a reputable mill, vacuum heat-treated to a documented tempering chart, and honed to the substrate-appropriate radius, both grades will deliver the same life. For a tight-tolerance drawing, write the spec as "AISI D2 or JIS SKD11, mill-certified, vacuum heat-treated to HRC 60 ± 1, decarburisation ≤ 0.1 mm/side" — and let your supplier cross-reference the two.

For a runnable cross-reference table, see [Material Grade Converter: ASTM / JIS / DIN / GB](/material-grade-converter/). For the broader five-factor methodology, see [The KAIPU 5-Factor Blade Selection Framework](/kaipu-5-factor-blade-selection-framework/).

For a written D2 / SKD11 quotation, send the part drawing to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Specification, FOB quote and indicative lead time within one business day.

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified. Ships to converters, recyclers and OEMs across four continents.*
