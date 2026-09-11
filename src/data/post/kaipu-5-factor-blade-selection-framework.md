---
title: 'The KAIPU 5-Factor Blade Selection Framework — How to Specify the Right Industrial Knife in 30 Minutes'
excerpt: 'A structured method our engineers use to match substrate, geometry, hardness target, edge preparation and operating speed to a production line — without second-guessing the steel grade.'
publishDate: 2026-09-11
updateDate: 2026-09-11
category: 'Engineering'
tags:
  - blade selection
  - D2 tool steel
  - M2 high speed steel
  - SKD11
  - tungsten carbide
  - industrial knives
  - slitting blades
  - granulator knives
  - process engineering
author: 'KAIPU Engineering'
metadata:
  description: 'The KAIPU 5-Factor Blade Selection Framework: a 30-minute method for specifying industrial machine knives — substrate, geometry, hardness, edge prep, operating speed. Backed by 25+ years of converting, recycling and metalworking line experience.'
  canonical: 'https://www.machine-knives.net/kaipu-5-factor-blade-selection-framework/'
---

Most blade selection is guesswork dressed up as experience. A buyer sends a part number, a competitor cross-reference, or "we use D2"; the supplier quotes it; the line runs; three weeks later the operator is on the phone again because the edge wears twice as fast as promised.

We stopped doing that in 2001. What replaced it is a five-factor checklist that any of our sales engineers can run through in under 30 minutes and arrive at a defensible specification — without ever quoting a steel grade until the last step. This post walks through the framework as we apply it, including the decision matrix and a real case where the framework overruled the customer's original specification.

> **The framework in one line:** *Specify the cut, not the steel.* The steel grade falls out of the first four factors.

---

## Why "send me a drawing and I'll quote D2" is wrong

Hardness is the most over-weighted variable in industrial knife buying. HRC 58–62 is correct for roughly 70 % of cutting applications — but the remaining 30 % splits between situations where it is too soft (recycling, abrasive composites) and situations where it is too brittle (thin blades, shock-loaded rotors).

If a buyer leads with steel grade, the conversation is already off-track. The right opening question is **what are you cutting, how fast, and what does failure look like?**

## The five factors

### Step 1: Substrate — what is being cut

The substrate dictates the wear mechanism, the contamination tolerance and (in food/pharma) the regulatory class. We classify substrates into six families:

- **Paper and tissue** — low abrasive wear, hygiene moderate. Tolerances driven by burr control (target ≤ 50 µm).
- **Film, foil, laminate** — low to medium abrasive wear, tight web tension, edge quality critical for printed surfaces.
- **Food and pharma** — washdown environments, food-contact compliance, full material traceability required (ISO 9001 §8.5).
- **Plastics, fibre-reinforced polymers** — medium to high abrasive wear; glass fibre and mineral fillers accelerate edge wear by 3–5× versus neat polymer.
- **Recycled feedstock** — high and unpredictable abrasive wear, contamination load (metal fragments, sand), impact load on granulator rotors.
- **Metal plate and sheet** — high impact load on shear blades, work-hardening grades (stainless, aluminium) require higher HRC.

**Substrate is non-negotiable.** A D2 blade that lasts 90 days on paper will last 9 days on glass-filled PA66. We have stopped quoting until this factor is pinned down.

### Step 2: Geometry — what shape the knife takes

Geometry is the second-most-over-weighted variable, but it is determined by the machine, not the cut. The common geometries we ship:

- **Circular blades** — Ø 80 mm to Ø 600 mm. Used in slitting, sheeting, rewinding.
- **Straight blades** — 50 mm to 3,500 mm long. Used in converting, tissue, label stock.
- **Serrated blades** — teeth-per-inch from 4 TPI to 32 TPI. Used in score cuts, perforating.
- **Shear blades** — guillotine and swing-beam. Lengths to 4,000 mm, thicknesses to 60 mm.
- **Granulator rotors and stators** — 100 mm to 800 mm cutting circle. Reversible inserts or solid.
- **Custom profiles** — anything that does not fit the categories above. This is ~40 % of our work.

### Step 3: Hardness target — the operating window

Once substrate and geometry are fixed, hardness falls into a narrow window. The defaults we use:

| Substrate family | Steel grade | Equivalent standards | HRC target | Notes |
|---|---|---|---|---|
| Paper, film, foil | D2 (1.2379) | ASTM A681, DIN 1.2379, JIS SKD11 | 58–62 | Default. SKD11 or DC53 if thin blade. |
| Plastics (neat) | D2 or M2 HSS | ASTM A681, A600, JIS SKH51 | 58–65 | M2 if line speed > 400 m/min. |
| Plastics (GF / mineral filled) | M2 HSS | ASTM A600, JIS SKH51 | 60–65 | D2 wears 3× faster — quote M2 up front. |
| Recycled feedstock | M2 HSS or carbide | A600, ISO 513 K10–K20 | 60–92 | Carbide tipping for high-volume lines. |
| Food, pharma | 420 / 440C stainless | ASTM A276, EN 1.4125 | 50–58 | Hardness capped by corrosion requirement. |
| Metal plate | D2 or DC53 | A681, JIS G4404 | 58–62 | Higher HRC chip risk on guillotine. |

**Best for:** standard industrial cutting, 80 % of orders.
**Not suitable for:** exotic alloys (ASP® 2023, CPM® 10V) — quoted separately on request.

### Step 4: Edge preparation — honed, sharp, or micro-honed

Edge prep is the most under-specified variable and the one most often blamed for "the steel is wrong" when it is actually the grind. Three families:

1. **Sharp edge (no hone, < 5 μm radius):** for paper, film, foil. Cleanest cut, lowest pull force, fastest first-cut burr.
2. **Light hone (5–25 μm radius):** for general converting, plastics. Balanced.
3. **Micro-hone (25–75 μm radius):** for recycled feedstock, abrasive composites, anything where chipping is the dominant failure mode.

We specify edge prep on the drawing with a numeric radius, not a verbal description. "Slightly honed" is not a specification.

### Step 5: Operating speed and environment

This is where the framework pays for itself. Operating speed drives:

- **Heat at the edge.** At 600 m/min on film, edge temperature can hit 200–300 °C. D2 loses hardness above 200 °C; M2 holds to 600 °C.
- **Vibration and balance.** Above 1,500 RPM on circular blades, balance grade matters. Above 3,000 RPM, only precision-ground blanks survive.
- **Washdown and corrosion.** Food/pharma lines need stainless; humidity-controlled lines need either coating or storage protocol.
- **Coating choice.** PVD coatings (TiN, TiCN, CrN, DLC) extend interval by 2–4× but only if the substrate and edge prep are right.

A blade specified for "M2, 60–62 HRC" without naming the line speed is not a specification. It is a guess.
---

## The decision matrix (one page)

| Factor | Default if unspecified | What overrides the default |
|---|---|---|
| Substrate | Ask the buyer | Nothing — substrate decides everything else |
| Geometry | Match the machine | Chip flow / clearance requirement |
| Hardness | 58–62 HRC | Substrate wear + line speed heat |
| Edge prep | Light hone | Burr target vs. chip risk |
| Operating speed | Ask the buyer | Heat at the edge, coating choice |

We use this matrix on the engineering bench before any steel is quoted. It takes 25–35 minutes for a new geometry and 10–15 minutes for a repeat geometry where the operating parameters have changed.

---

## A real case: tissue converter, 1,200 m/min line

A tissue converter running 1,200 m/min on a 4-ply laminate was getting 11 days of service life from D2 bed knives. The competitor was telling them to switch to M2. We asked the five questions first.

1. **Substrate:** 4-ply tissue, no film, no abrasive filler. (Confirmed.)
2. **Geometry:** 320 × 25 × 4 mm bed knife. (Confirmed.)
3. **Hardness target:** D2 at HRC 60 was within the substrate window.
4. **Edge prep:** competitor was shipping a sharp edge (< 5 μm).
5. **Operating speed:** **this is where the conversation changed.**

At 1,200 m/min on tissue, edge temperature is approximately 180 °C — not enough to soften D2, but enough to cause **thermal fatigue micro-cracking** at a sharp edge. The failure mode was not wear; it was edge chipping on a sub-millimetre scale, after which burr accelerated.

We quoted the same D2, same HRC 60, but specified a **15 μm micro-hone** and a **lighter clearance angle (18° instead of 22°)**. Service life went from 11 days to 34 days at the same line speed. No steel change. No price change. The grade was never the problem.

---

## Common failure modes the framework catches

We have applied this framework to roughly 4,500 part numbers since 2001. The recurring failure modes are:

1. **"The steel is wrong"** — almost always the edge prep or the clearance angle.
2. **"It wears too fast"** — substrate mismatch (e.g., abrasive composite on a D2 that was specified for paper).
3. **"It chips after a week"** — edge too sharp for the substrate, or hardness too high for a thin blade.
4. **"The competitor's blade lasted longer"** — different edge prep, same steel. Often the spec sheet never mentioned edge radius.
5. **"We can't hold tolerance"** — heat treatment variation, not steel grade. Test with a hardness file before re-quoting.

If the conversation starts with the steel grade, all five of these will repeat.

---

## When the framework does not apply

The framework assumes a defined production line with measurable parameters. There are three cases where it falls short:

1. **Exotic alloys** (titanium, Inconel, beryllium copper) — quoted per drawing with a metallurgist review.
2. **Reverse-engineered legacy parts** where the original spec is lost — we measure the existing blade, replicate the geometry, and verify by trial cut.
3. **New product development** where no line exists yet — we specify conservatively (D2, light hone, standard clearance) and iterate after the first 100 m of trial.

---

## Want KAIPU to run this for you?

If you have a drawing, a worn blade, or a competitor's part number, send it to [engineering](mailto:[email protected]) or use the [request-a-quote form](/contact). We will run the framework, return a specification within one business day, and ship against a written tolerance guarantee.

For the broader material selection guide, see our [industry solutions overview](/solutions#materials). For a step-by-step walkthrough of how a drawing becomes a finished blade, see our [engagement process](/solutions#process).

---

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, a precision machine knife manufacturer in operation since 1998. The team holds ISO 9001:2015 certification and ships to converters, recyclers and OEMs across four continents.*
Geometry interacts with substrate through **chip flow and clearance angle**. A 30° clearance that works for paper will chip on recycled polymer; a 12° clearance that survives recycled polymer will smear on paper. This is the second conversation, not the first.