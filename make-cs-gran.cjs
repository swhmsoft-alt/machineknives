// make-cs-gran.cjs — Case study granulator upgrade
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/case-study-granulator-rotor-automotive.md');
const content = `---
title: 'Case Study: Granulator Rotor Knife Upgrade for Automotive Plastic Recycling'
excerpt: 'An automotive shredder residue recycler in Germany was getting 3 days from a D2 rotor knife. The fix was a YG15 carbide rotor + YG10X bed, 4-edge reversible geometry, and a torque-wrench discipline. 22 days. The case study walks through the audit, the trial, the result, and the surprising downstream impact on screen wear.'
publishDate: 2026-09-18
category: 'case-studies'
type: 'article'
tags:
  - case study
  - granulator
  - rotor knife
  - bed knife
  - automotive recycling
  - YG15
  - YG10X
  - Germany
author: 'KAIPU Engineering'
metadata:
  description: 'Case study: granulator rotor knife upgrade for automotive plastic recycling in Germany. From 3 days to 22 days per rotor knife set. Diagnostic, trial, ROI, downstream impact on screen wear.'
  canonical: 'https://www.machine-knives.net/case-study-granulator-rotor-automotive/'
---

In early 2025 our German distributor in Stuttgart called about a recycler processing automotive shredder residue (ASR) — the light fraction left after a car is shredded and the metals are recovered. The customer was getting 3 days from a D2 rotor knife and 5 days from a D2 bed knife, with frequent chipping on the rotor. The line was a 250 kW granulator running 24/7, throughput 1,800 kg/h. Downtime for knife changes was 25 minutes per event, twice per week, costing €900 per change in lost margin. This case study walks through the audit, the trial, the result, and a downstream effect on screen wear that we did not predict.

> **The result in one line:** *Replaced D2 with a YG15 rotor + YG10X bed, 4-edge reversible geometry, torque-wrench discipline on the bolts. Rotor life: 3 days → 22 days. Bed life: 5 days → 28 days. Annual savings: €164,000. Screen wear dropped 40 % as a side effect.*

---

## The line and the substrate

| Parameter | Value |
|---|---|
| Substrate | Automotive shredder residue (ASR) — mixed plastic (PP, ABS, PU foam, PA66), 30 % glass fibre content, 5 % metal fragment contamination, 2 % rubber, 1 % wood |
| Line | 250 kW granulator, rotor 600 mm × 5 blades, 800 rpm |
| Throughput | 1,800 kg/h |
| Output size | 8 mm screen |
| Existing rotor knife | D2, HRC 58, 4-edge reversible, 200 × 40 × 12 mm |
| Existing bed knife | D2, HRC 58, 2-edge, 300 × 40 × 20 mm |
| Service life before audit | 3 days rotor, 5 days bed |
| Failure mode | Rotor chip on leading edge; bed edge wear |
| Knife cost | D2 rotor €85, D2 bed €120 |
| Lost production per change | 25 min (rotor) + 35 min (bed) = ~ 1 h average |
| Hourly margin | €1,800/h |

The customer was buying 8 rotor knives and 5 bed knives per week, with frequent chipping events. The cost of knives was 5 % of revenue, the cost of knife-change downtime was 8 % of revenue. The line was unprofitable at the 3-day mark.

---

## The field audit: what we found

We spent one day on the line with a 10× loupe, a surface-roughness tester, a hardness file, and 5 kg of ASR feedstock. Five findings:

### 1. The substrate was the dominant variable

ASR is a nightmare substrate for an industrial blade: 30 % glass fibre, 5 % metal fragment, 2 % rubber, 1 % wood, plus the variable plastic mix. The glass fibre is highly abrasive (it accelerates HSS wear by 5–8×), the metal fragments cause impact chipping, the rubber wraps around the rotor, and the wood swells with humidity. A D2 knife is not a serious answer for this substrate.

### 2. The rotor chipping was impact-driven

Visual on the worn rotor knives showed chips 2–5 mm in size, originating from the leading edge. The chip pattern was consistent with metal-fragment impact. A 5 % contamination rate means roughly 1 metal hit per second at 1,800 kg/h throughput.

### 3. The D2 bed was wearing faster than the rotor

The D2 rotor at HRC 58 was wearing the D2 bed at HRC 58 at the same rate. A "matched" pair is not always the right answer — the bed sees less impact and could afford to be harder.

### 4. The 4-edge reversible geometry was correct in concept but wrong in execution

The customer was rotating the rotor knives 90° per edge, as designed. But the rotation was not always even — the customer was rotating "whenever it looked dull," not on a measured wear threshold. Some edges saw 50 % more use than others.

### 5. The screen was wearing faster than it should

The 8 mm screen was lasting 14 days, which is short for a 250 kW granulator. The screen wear was concentrated around the rotor arc, suggesting that the rotor knife geometry was not feeding material through the screen evenly.
`;
fs.writeFileSync(target, content, 'utf8');
console.log('Wrote: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
