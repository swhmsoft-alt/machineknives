---
title: 'Cold-Work Tool Steel Selection Guide'
excerpt: 'Cold-work tool steel — the AISI D-series, A-series, O1, DC53. Compare chemistry, heat treatment, wear life and toughness for industrial blade applications.'
publishDate: 2026-09-28
category: 'selection-guide'
type: 'article'
tags:
  - cold-work tool steel
  - AISI D2
  - AISI D3
  - AISI A2
  - air hardening
  - oil hardening
  - slitter blade
  - industrial knife
  - die steel
author: 'Industrial Knives Engineering'
metadata:
  description: 'Cold-work tool steel selection guide — AISI D-series, A-series, O1, DC53 chemistry, heat treatment and selection. Compare wear life, toughness and hardenability for industrial blades.'
  canonical: 'https://www.industrial-knives.net/pillar-cold-work-tool-steel/'
image: '/images/og/pillar-cold-work-tool-steel.webp'
---

# Cold-Work Tool Steel Selection Guide

Cold-work tool steels are a family of high-carbon, high-alloy steels designed for tools and dies that operate at or near room temperature. The defining feature is a high proportion of primary carbides — M₇C₃, M₆C, M₂₃C₆, and VC — that provide the wear resistance these grades need for stamping, blanking, slitting and shearing operations. In contrast, hot-work tool steels prioritise toughness at elevated temperature, and high-speed steels prioritise hot hardness at very high cutting speeds.

Cold-work tool steels are used wherever the workpiece is harder than the substrate the blade is cutting — paper with mineral fillers, abrasive polymers, glass-fibre composites, stacked steel sheet — or where the cut quality demands a stable, wear-resistant edge. Typical applications include: slitter blades on paper and film lines; shear blades on plate; granulator knives in recycling; blanking and forming dies in stamping; punches and piercers.

The most widely used cold-work tool steels are the AISI standard grades — D2, D3, A2, A6, A8, O1 — supplemented by Japanese JIS SKD11 and SKD1 (D-equivalents), the Daido DC53 refinement, and powder-metallurgy grades like ASP 2060 for high-wear-edge applications. Each grade has a distinctive balance of carbon, chromium, vanadium and molybdenum, and the selection depends on the wear-vs-toughness-vs-grindability trade-off appropriate to the application.

This guide walks through the major AISI cold-work grades, the metallurgical differences between them, and a selection methodology grounded in the cutting conditions of converting, packaging and metalworking lines. For per-grade chemistry, heat treatment and cross-reference tables, see the [A2 reference entry](/blog/materials-encyclopedia/a2/), [D2 reference entry](/blog/materials-encyclopedia/d2/), and the other 9 encyclopedia entries linked at the end of this article.

## 1. What is cold-work tool steel?

## 18. Inspection and quality control

A cold-work tool steel blade in production goes through four QC stages:

**Incoming material inspection**: verify mill certificate chemistry against the AISI / UNS specification (1.5 % C ± 0.05 %, 12.0 % Cr ± 0.5 %, etc.). A simple spectrometer check on every heat is standard. For critical applications, request ultrasonic inspection for internal defects.

**Post-machining inspection**: verify dimensional tolerance (±0.01 mm for slitter blades, ±0.05 mm for shear blades). Visual inspection for surface defects (cracks, decarburisation layer from grinding). Decarburisation is a common defect — surface carbon loss during austenitising leaves a soft skin that wears rapidly. Spec: post-austenitising depth of decarb ≤0.05 mm (measured by microhardness traverse).

**Post-heat-treatment inspection**: verify hardness (HRC ±1) on multiple points of the blade. A 1.5 mm slitter blade typically tolerates HRC 59–62; a 5 mm shear blade HRC 58–62. Out-of-spec hardness on one end vs the other indicates quench non-uniformity — re-quench or scrap. Visual inspect for quench cracks (especially at bores, shoulders, and sharp corners — these crack first). Magnetic-particle or dye-penetrant inspection for surface cracks on critical blades.

**Final inspection (post-grinding)**: verify edge geometry (radius, rake, clearance) against drawing. Visual inspection under 10× magnification for grinding burns (oxidation discoloration at the edge — blue / straw colour indicates over-tempering during grinding, which can crack the edge). Spec: no visible burns.

**Failure analysis**: when a blade fails in service, save the failed blade and document:
- Position in the line (top vs bottom blade, position across the web)
- Substrate processed (material, thickness, contamination)
- Hours of service (or cuts made)
- Failure mode (chipping, fracture, wear, deformation)
- Visual documentation (photos at 1× and 10× magnification)

A pattern of failures across multiple blades in similar conditions points to a grade / hardness mismatch; a single isolated failure is usually a manufacturing defect (blowhole, decarburisation, grind burn) and can be addressed by tightening incoming / process QC rather than changing the grade specification.

For deeper treatment of blade failure analysis, see the [Industrial Blade Failure Analysis Guide](/blog/troubleshooting-premature-wear/) and the broader [troubleshooting cluster](/blog/troubleshooting/).
## 16. Coating interactions

PVD coatings (TiN, TiCN, AlCrN, DLC, ta-C) are commonly applied to cold-work tool steel blades to extend wear life. The substrate grade matters for coating performance — not all cold-work grades accept coatings equally.

**Substrate hardness guideline**: most PVD coatings are 2000–3500 HV. The coating only performs if the substrate can support it. Below HRC 58, the substrate is too soft and the coating will spall under load. Above HRC 64, the substrate is too brittle and the coating cracks. The sweet spot for coated cold-work tools is HRC 60–62 on D2 / A2 / DC53, with the coating adding 2–5× the wear life at the cost of ~1 µm of edge sharpness.

**Coating recommendations by grade**:
- **D2 / D3 / DC53**: TiN or AlCrN (2–4 µm). D-series already has wear resistance; coating adds modest gains but significantly reduces edge wear on abrasive substrates.
- **A2 / A6 / A8**: TiCN or AlCrN (2–4 µm). A-series benefits most from coating because the substrate wear resistance is the bottleneck.
- **D7**: DLC or ta-C (1–2 µm). D7 already has very high V — coating adds marginal wear but reduces friction, which reduces heat generation at high cutting speeds.
- **O1**: TiN (2–4 µm) only for short-run applications; O1 substrate wear will dominate for production.
- **ASP 2060**: DLC or ta-C (1–2 µm) for high-temperature cutting. ASP 2060 hot hardness supports the coating at operating temperature.

**Coating cautions**:
- PVD coating temperature is 350–500 °C. Tempering above this temperature before coating is critical — otherwise the coating process itself tempers the substrate and shifts final hardness.
- The coating process adds 0.1–0.3 µm to the edge radius. For sharp-edge slitter blades, this is critical — re-grind after coating if edge radius <5 µm is required.
- Coatings fail by spallation, not by gradual wear. Once a coating spalls, the exposed substrate wears rapidly. Inspect coated blades regularly.

See the [coatings comparison table](/blog/coatings-comparison/) for detailed chemistry, hardness, thickness and deposition-temperature limits of the standard PVD coatings.

## 17. Edge geometry and hone considerations

The edge geometry of a cold-work tool steel blade is as important as the substrate grade. The four variables to control:

**Edge radius (µm)**: A 0–2 µm hone is a sharp edge suitable for paper, film, foil. A 5–15 µm hone is for paper and film with occasional contamination. A 20–50 µm hone is for abrasive substrates (glass-fibre, recycled paper). Above 50 µm the edge is effectively a chamfer and should be designed as such.

**Rake angle**: Positive rake (5–15°) reduces cutting force and is standard for thin slitter blades. Zero rake is for hard substrates where positive rake risks edge fracture. Negative rake (−5 to −15°) is for granulator blades where chipping resistance dominates.

**Clearance angle**: 8–15° is standard for slitter blades. Higher clearance reduces drag but weakens the blade section.

**Secondary bevel**: 25–35° at 0.5–2 mm width is standard for blanking and punching dies. For slitter blades, a micro-bevel at 30°/0.05–0.1 mm can dramatically improve chipping resistance without sacrificing cut quality.

**Honematching rule of thumb**: a 2 µm edge hone on D2 at HRC 62 will chip within hours on a granulator line. Move to A8 at HRC 58 with a 10 µm hone, or D2 at HRC 60 with a 15 µm hone. The hone is the cheapest insurance against edge chipping — a 30 % harder edge costs 3× as much as a 15 µm hone but delivers similar chipping resistance.

For high-precision slitting (e.g. capacitor film, optical film), hone control is critical. Hone variation of ±2 µm across the blade length shows up as cut-quality variation. Diamond honing or fine-grit abrasive honing (600–1200 grit) is standard for these applications.
## 14. International standards cross-reference

The 11 grades covered in this guide are standardised under multiple national and international systems. The cross-reference below lets you identify equivalent grades when sourcing from a different region or per a customer specification.

| AISI | UNS | DIN / EN | JIS | GOST / GB | ISO 4957 | BS / AFNOR | Remarks |
|------|----:|----------|-----|-----------|----------|------------|---------|
| A2 | T30102 | 1.2363 | SKD12 | – | – | BA2 | – |
| A6 | T30106 | – | – | – | – | – | US proprietary |
| A8 | T30108 | – | – | – | – | – | US proprietary |
| D2 | T30402 | 1.2379 | SKD11 | Cr12Mo1V1 | X153CrMoV12 | BD2 | Industry workhorse |
| D3 | T30403 | 1.2080 | SKD1 | Cr12 | X210Cr12 | BD3 | Highest-wear D-series |
| D4 | T30404 | 1.2436 | – | – | – | – | Tungsten-D3 |
| D5 | T30405 | 1.2601 | – | – | – | – | Co-modified D2 |
| D7 | T30407 | – | – | – | – | – | US proprietary |
| O1 | T31501 | 1.2510 | SKS3 | – | – | – | Classic oil-hardening |
| DC53 | – | – | DC53 | – | – | – | Daido proprietary |
| ASP 2060 | – | – | – | – | HS 10-4-3-10 | – | UDDEHOLM / Voestalpine |

**Notes on the cross-reference**:
- The DIN / EN and JIS columns reflect functional interchangeability, not strict chemical equivalence. For example, DIN 1.2379 has slightly higher V than AISI D2 in some heats but is functionally interchangeable for industrial blade applications.
- ISO 4957 is the European / international cold-work tool steel standard. Coverage is partial — not all AISI grades have ISO equivalents.
- "Proprietary" entries (A6, A8, D7, DC53, ASP 2060) are single-vendor grades with no direct national standard equivalent.

## 15. Per-grade heat treatment schedule

For shop-floor reference, the table below summarises the standard heat treatment schedule for each grade. Always cross-check against the mill datasheet for the specific heat you are processing.

| Grade | Austenitise °C | Quench | Temper | Hardness HRC |
|------:|---------------:|--------|--------|-------------:|
| A2 | 940–980 | Air (or oil for thin sections) | 175–540 °C, single | 57–62 |
| A6 | 840–870 | Air | 175–200 °C, single | 58–60 |
| A8 | 980–1010 | Air | 510–540 °C, single | 58–60 |
| D2 | 1000–1050 | Air | 510–540 °C, double 2 h | 58–62 |
| D3 | 950–980 | Air or oil | 200 °C, single | 58–64 |
| D4 | 970–1010 | Air | 200 °C, single | 58–64 |
| D5 | 980–1020 | Air | 510–540 °C, double 2 h | 58–62 |
| D7 | 1050–1080 | Air | 510–540 °C, double 2 h | 58–64 |
| O1 | 800–820 | Oil (50–80 °C) | 150–200 °C, single | 58–64 |
| DC53 | 1030–1050 | Air | 510–530 °C, double 2 h | 60–62 |
| ASP 2060 | 1100–1180 | Air or martempering | 540–570 °C, triple 1 h | 67–69 |

**Notes on the heat-treatment table**:
- Austenitising temperatures are the standard range; for specific heats, refer to the mill certificate.
- The temper column shows the standard temperature and number of tempers. Multiple tempers at the same temperature are required for D-series and high-V grades to decompose retained austenite.
- Sub-zero treatment (liquid nitrogen at −196 °C or dry-ice alcohol at −78 °C) is recommended for D2, D3, D5, D7, DC53 and ASP 2060 when tight dimensional tolerances are required post-quench.
## 11. Common failure modes and field examples

Selecting the wrong grade is expensive. The five most common cold-work blade failures in production:

**1. Edge chipping on impact loading.** A 1.5 mm thick D2 slitter blade at HRC 62 chatters on a recycled-paper line where tramp metal enters the web. Visual tell: 0.1–2 mm fragments missing from the edge, often accompanied by a wire-edge or burr on the chipped side. Fix: drop hardness 2–4 HRC (to HRC 58–60), or move to A8 (higher impact resistance), or add 5–15 µm hone to the edge.

**2. Gross fracture at the bore or shoulder.** A shear blade with a 12 mm bore and a 25 mm shoulder fractures through the shoulder after 2 weeks of service. Visual tell: clean break with no wear on the rest of the edge. Fix: increase shoulder fillet radius from 0.5 mm to 2 mm; drop hardness 2 HRC; or move to a tougher grade (A2 → A8, D2 → D5 → S7 if available).

**3. Plastic deformation (mushrooming) of the edge.** A long, thin O1 blade deflects under cutting load and the edge mushrooms over. Visual tell: rounded edge profile, no chipping, edge is dull. Fix: increase section thickness by 10–15 %; upgrade to D2 (higher hot hardness at the same HRC); or add back relief to reduce radial load.

**4. Crater wear on abrasive substrates.** A D2 granulator blade on glass-fibre-filled polymer shows deep craters on the cutting edge while the rest of the blade is intact. Visual tell: smooth concave depression on the edge, no chipping. Fix: upgrade to D7 (higher V → higher VC content); or coat with PVD TiN / AlCrN; or both. Crater wear is the classic abrasive wear signature.

**5. Heat-checking cracks.** A blanking die running 200 strokes/min shows fine surface cracks perpendicular to the cutting edge after several days. Visual tell: tight crack pattern on the face of the die. Fix: reduce stroke rate; upgrade from D2 to H13 (hot-work) if heat generation is the cause; or apply PVD coating to reduce friction.

A useful diagnostic is to inspect a worn blade under 10–30× magnification before scrapping it. The wear pattern tells the story: edge chipping → impact problem; crater wear → abrasive problem; gross fracture → design problem; heat-checking → thermal problem; uniform edge dulling → normal end-of-life.

## 12. Cost and supply considerations

Cold-work tool steel prices (2026 indicative, USD/kg, finished bar stock, single-piece orders) span a 20× range:

| Grade | Indicative USD/kg | Supply availability |
|------:|------------------:|---------------------|
| O1 | $4–6 | Universal |
| A2 | $5–8 | Universal |
| A6 | $6–10 | Standard |
| A8 | $8–12 | Limited |
| D2 | $5–10 | Universal (SKD11 in Japan, 1.2379 in EU) |
| D3 | $8–12 | Standard |
| D4 | $10–15 | Limited |
| D5 | $15–20 | Limited |
| D7 | $20–30 | Limited |
| DC53 | $10–20 | Standard (Japan-origin) |
| ASP 2060 | $50–100 | Premium, 4-week lead |

The price ladder reflects raw-material cost (Co and V are expensive), processing complexity (PM grades are expensive to manufacture), and demand volume. For volume production lines, the cost differential matters: switching from D2 to D7 on a slitter line triples the blade material cost. Verify with the wear test that the gain in blade life is worth it — D7 is 2–3× the wear life of D2 in many applications, so the cost-per-cut may be lower despite higher per-blade cost.

Supply availability varies by region. D2 is universally available (SKD11 in Japan, 1.2379 in Europe, Cr12Mo1V1 in China). Less common grades (D4, D5, D7, DC53) may have 4–12 week lead times outside their primary markets. Plan tooling orders accordingly.

## 13. Summary

The cold-work tool steel family covers the A-series (medium-alloy, balanced), D-series (high-carbon high-chromium, wear-resistant), O-series (oil-hardening, low-distortion) and modern alternatives (DC53, ASP 2060). Selection follows three steps: identify the dominant failure mode; match the grade to the failure mode; verify with a controlled wear test on the actual substrate. D2 is the default; the D-series as a whole trades toughness for wear life; DC53 and ASP 2060 fill premium niches when standard grades have been exhausted.

For per-grade detail — full chemistry, heat-treatment schedule, properties, applications and international cross-references — see the 12 reference entries linked in §9 above. For the broader blade-selection framework that goes beyond steel grade, see the [5-Factor Blade Selection Framework](/blog/selection-guide/5-factor-blade-selection-framework/).
## 10. Grade comparison table

The table below summarises the chemistry, hardness, hardenability and primary application of each grade covered in this guide. Use it as a quick reference when narrowing down the candidate grades for a specific blade application.

| Grade | UNS | C | Cr | Mo | V | W | Co | Hardening | HRC | Section ≤ mm | Primary application |
|------:|----|-:|--:|--:|--:|--:|--:|-----------|----:|------------:|--------------------|
| **A2** | T30102 | 1.0 | 5.0 | 1.0 | 0.2 | – | – | Air | 57–62 | 25 | General-purpose slitter / blanking |
| **A6** | T30106 | 0.7 | 1.0 | 1.0 | – | – | – | Air | 58–60 | 50 | Low-distortion dies / forming |
| **A8** | T30108 | 0.5 | 5.0 | 1.5 | – | 1.25 | – | Air | 58–60 | 50 | High-impact shear / granulator |
| **D2** | T30402 | 1.5 | 12.0 | 1.0 | 1.0 | – | – | Air | 58–62 | 100 | Standard abrasive slitter / shear |
| **D3** | T30403 | 2.1 | 12.0 | – | – | – | – | Air / oil | 58–64 | 75 | Highest-wear (ceramic, fibreglass) |
| **D4** | T30404 | 2.1 | 12.0 | – | – | 0.7 | – | Air | 58–64 | 75 | Tungsten D3, slight hot-hardness lift |
| **D5** | T30405 | 1.5 | 12.0 | 1.0 | – | – | 3.0 | Air | 58–62 | 200 | Heavy-section shear / granulator |
| **D7** | T30407 | 2.3 | 12.0 | 1.0 | 4.0 | – | – | Air | 58–64 | 100 | Highest abrasive wear (D-series) |
| **O1** | T31501 | 0.9 | 0.5 | – | – | 0.5 | – | Oil | 58–64 | 25 | Short-run stamping, gauges |
| **DC53** | – | 1.0 | 8.0 | 2.0 | 0.3 | – | – | Air | 60–62 | 100 | D2 with 2× toughness, fineblanking |
| **ASP 2060** | – | 1.3 | 4.0 | 7.0 | 6.5 | 6.5 | 10.5 | Air | 67–69 | 150 | Premium abrasive wear (PM HSS) |

**Notes on the table**:
- Section thickness is the round-section thickness through which the grade can be air-hardened to ≥90 % martensite. Heavy-section quench requires switching to oil (O1) or vacuum / martempering bath.
- Hardness is for the standard tempering practice specified in §7.
- The D-series with 12 % Cr is corrosion-resistant in mild environments but is NOT a replacement for stainless grades in food-contact or wet cutting applications. For those, see the [martensitic stainless pillar](/blog/selection-guide/pillar-martensitic-stainless/).
## 8. Selection methodology

A pragmatic selection methodology for cold-work tool steel in industrial blades:

1. **Identify the dominant failure mode**. Is it abrasive wear (sharp edge dulling), chipping (small fragments breaking off), gross fracture (catastrophic break), or thermal damage (heat-affected edge)? Different grades target different failure modes.

2. **Match the grade to the failure mode**:
   - Abrasive wear dominant → D-series (D2, D3, D7) or ASP 2060
   - Chipping dominant → A-series (A2, A8) or DC53; reduce hardness 2–4 HRC from maximum
   - Gross fracture dominant → never cold-work tool steel; move to hot-work or HSS
   - Thermal damage dominant → HSS or carbide; cold-work grades lose hardness above 200 °C

3. **Check section thickness and hardenability**:
   - <25 mm: any air-hardening grade (A2, D2)
   - 25–50 mm: A2, D2, DC53 (air-hardening)
   - 50–100 mm: D5 (Co-modified for through-hardening)
   - >100 mm: ASP 2060 (PM for compositional uniformity)

4. **Check grindability constraint**. If the blade must be finish-ground to a tight tolerance (e.g. ≤0.01 mm flatness), avoid high-V grades (D7, ASP 2060). The VC carbides burn through grinding wheels quickly and raise per-blade grinding cost 2–5×.

5. **Verify edge stability**. A 1.5 mm section D2 blade at HRC 62 will chip on a high-impact recycling line. Drop hardness 2 HRC to HRC 60 for marginal impact, 4 HRC to HRC 58 for severe impact. The wear-life penalty is 10–20 % per 2 HRC drop; the chipping-resistance gain is 30–50 %.

6. **Cost-vs-performance trade-off**. D2 is the price-performance benchmark at ~$5–10/kg finished. ASP 2060 at $50–100/kg is only justified when no D-series grade survives the wear test. DC53 at $10–20/kg fills the niche where D2 wear is acceptable but grindability is the constraint.

7. **Document and verify**. Once a grade is selected for a line, lock the specification: AISI grade, UNS designation, hardness target ±1 HRC, double-temper schedule. Field failures from grade substitution are rare but always expensive.

## 9. See also — cold-work tool steel reference entries

For per-grade chemistry, heat treatment, hardness, properties, applications and cross-references for each standard cold-work tool steel grade, see the following materials-encyclopedia entries:

- [AISI A2 Air-Hardening Cold-Work Tool Steel](/blog/materials-encyclopedia/a2/)
- [AISI A6 Air-Hardening Cold-Work Tool Steel](/blog/materials-encyclopedia/a6/)
- [AISI A8 Air-Hardening Cold-Work Tool Steel](/blog/materials-encyclopedia/a8/)
- [AISI D2 Cold-Work Tool Steel](/blog/materials-encyclopedia/d2/) — the workhorse
- [AISI D3 High-Carbon, High-Chromium Cold-Work Tool Steel](/blog/materials-encyclopedia/d3/)
- [AISI D4 High-Carbon, High-Chromium + Tungsten Cold-Work Tool Steel](/blog/materials-encyclopedia/d4/)
- [AISI D5 High-Carbon, High-Chromium + Molybdenum Cold-Work Tool Steel](/blog/materials-encyclopedia/d5/)
- [AISI D7 High-Carbon, High-Chromium + Vanadium Cold-Work Tool Steel](/blog/materials-encyclopedia/d7/)
- [AISI O1 Oil-Hardening Cold-Work Tool Steel](/blog/materials-encyclopedia/o1/)
- [Daido DC53 Refined Cold-Work Tool Steel](/blog/materials-encyclopedia/dc53/)
- [ASP 2060 Powder Metallurgy HSS](/blog/materials-encyclopedia/asp2060/)
- [JIS SKD11 Cold-Work Tool Steel](/blog/materials-encyclopedia/skd11/) — Japanese equivalent of D2

For related selection frameworks, see the [5-Factor Blade Selection Framework](/blog/selection-guide/5-factor-blade-selection-framework/) and the broader [selection-guide cluster](/blog/selection-guide/pillar-selection-guide/). For heat-work and high-speed alternatives, see the [hot-work tool steel pillar](/blog/selection-guide/pillar-hot-work-tool-steel/) and [high-speed steel pillar](/blog/selection-guide/pillar-high-speed-steel/) (forthcoming).
## 7. Heat treatment

Cold-work tool steel heat treatment has three stages: austenitising, quenching, and tempering. Each step drives specific microstructural changes that determine final hardness and toughness.

**Austenitising** dissolves primary carbides into the austenite matrix. For D-series grades, the austenitising temperature is 1000–1050 °C; for A-series, 940–980 °C; for O1, 800–820 °C. Holding time is 20–30 minutes per inch of section thickness. Higher temperatures dissolve more carbide and raise final hardness, but also raise austenite grain size and risk of retained austenite at room temperature.

**Quenching** transforms austenite to martensite. Air-hardening grades (A-series, D-series, DC53, ASP) are cooled in still air or under pressure to 50–100 °C. Oil-hardening O1 is quenched in oil at 50–80 °C. Water-quenching is not recommended for any standard cold-work grade — risk of cracking is too high. For heavy sections, a martempering bath (salt or oil at 200–300 °C, hold until equalised, then air-cool) reduces distortion.

**Tempering** relieves quench stresses and decomposes retained austenite. For D-series, two tempers at 510–540 °C for 2 hours each give the best toughness-temper resistance balance. For A-series, single temper at 175–200 °C is sufficient. For O1, single temper at 150–200 °C. **Note**: the D-series secondary hardening at 510–540 °C coincides with chromium-carbide precipitation in the 400–500 °C range — if you drop the D-series temper below ~480 °C, you get high hardness but poor temper resistance. The standard 510–540 °C two-temper practice sacrifices 1–2 HRC for much better toughness at operating temperature.

**Sub-zero treatment** (cooling to −80 °C in liquid nitrogen or dry-ice alcohol after quenching) transforms most retained austenite to martensite. Recommended for D-series when grinding is a problem (retained austenite causes dimensional change during grinding). Sub-zero should be done within 1 hour of quench and before the first temper.

**Distortion control**: even air-hardening cold-work grades distort slightly during quench. For long, thin tools (slitter blades, shear blades), rough machining with 0.13–0.25 mm grinding stock and finish grinding after heat treatment is standard practice. Stress relieving at 600 °C before final machining removes residual stress from rough machining and reduces post-heat-treatment movement.

Heat-treatment service quality is the single most common cause of premature blade failure in the field. Verify: austenitising temperature (pyrometer calibrated, ±5 °C); quench medium (oil temperature ≤80 °C, water content <0.5 %); tempering soak time and temperature. A 10 °C austenitising error shifts final hardness 0.5–1 HRC; a missed second temper drops impact toughness 30 %.
## 5. Oil-hardening O-series

**O1 (UNS T31501)** is the classic oil-hardening cold-work tool steel — 0.9 % C, 0.5 % Cr, 0.5 % W. Hardened to HRC 58–64 with minimal distortion when quenched in oil, O1 remains popular for short-run tooling, prototype knives and gauges where the convenience of oil-hardening offsets the air-hardening trend. O1 has poor wear resistance compared to the D-series (low carbide volume) but excellent toughness and ease of grinding.

O-series selection rule: use O1 for short-run stamping tools and prototype knives where distortion must be minimised and wear life is not the bottleneck. Do not use O1 for slitter blades in production — D2 wear life is 3–4× O1 at the same hardness.

## 6. Modern alternatives

Two modern alternatives to the standard AISI cold-work grades deserve separate mention because they break the standard property envelope.

**Daido DC53** is a Japanese refinement of D2 with reduced Cr and elevated Mo + V. Compared to standard D2, DC53 claims roughly double the toughness at the same HRC 60–62 hardness, plus better grindability. Used in high-precision slitter blades, fineblanking tools and cold-work dies where D2 wear life is required but D2 grindability is the bottleneck. See the [DC53 reference entry](/blog/materials-encyclopedia/dc53/) for full details.

**ASP 2060** (UDDEHOLM / Voestalpine) is a powder-metallurgy high-speed steel that crosses into cold-work territory for high-wear-edge applications. With 4 % Cr, 7 % Mo, 6.5 % W, 6.5 % V, 10.5 % Co, ASP 2060 reaches HRC 67–69 and gives 3–5× the wear life of D2 on abrasive substrates. Used for high-speed slitter blades on abrasive paper / film, and for cutting tools where M42 / M35 wear life is insufficient. See the [ASP 2060 reference entry](/blog/materials-encyclopedia/asp2060/) for full details.

Both DC53 and ASP 2060 are premium options — 1.5–3× the price of standard D2 — and should be selected only after the standard grades have been exhausted.
## 4. The D-series: high-carbon high-chromium

The D-series (D2, D3, D4, D5, D7) are the high-carbon high-chromium cold-work tool steels — the wear-resistant workhorses for abrasive substrates. With 1.5–2.4 % C and 11–13 % Cr, they develop 10–15 % primary carbide volume at solidification, mostly M₇C₃. The wear life is 1.5–3× the A-series at equivalent hardness, at the cost of 30–40 % lower toughness.

**D2 (UNS T30402)** is the standard of the D-series — chemistry 1.5 % C, 12 % Cr, 1.0 % Mo, 1.0 % V. Air-hardening to HRC 58–62 with good dimensional stability. D2 is the most widely used cold-work tool steel in industrial blade production, used for slitter blades, shear blades, blanking and forming dies on abrasive substrates. JIS SKD11 is the Japanese equivalent (compositionally interchangeable), and DIN 1.2379 is the European designation. D2 is the benchmark against which all other D-series grades are measured.

**D3 (UNS T30403)** is a higher-carbon variant with 2.0–2.5 % C. The additional carbon produces more M₇C₃ primary carbides than D2, giving the highest wear resistance in the standard D-series. The trade-off is toughness: D3 Charpy impact is 15–25 J vs D2 20–30 J. D3 cannot be water-quenched (use air or oil). Used on highly abrasive substrates — ceramic, glass fibre, rock-wool insulation, refractory materials.

**D4 (UNS T30404)** is a tungsten-modified D3 (0.5–0.8 % W). The W addition raises hot hardness slightly — useful when the cutting edge runs at elevated temperature due to friction. Otherwise similar to D3. Less widely available than D2/D3.

**D5 (UNS T30405)** is cobalt- and molybdenum-modified D2 (2.5–3.5 % Co, 0.7–1.2 % Mo). The cobalt improves through-hardening of heavy sections (>50 mm) while retaining wear resistance similar to D2. D5 is the right D-series grade for large-section shear blades, granulator rotors and rock-crusher blades.

**D7 (UNS T30407)** is a vanadium- and molybdenum-enriched D3 (4 % V, 1 % Mo). The high vanadium content produces a significant population of very hard VC carbides that give the highest abrasive wear resistance in the standard D-series — at the cost of grindability. D7 is used on granulator rotors crushing highly abrasive feedstock (filled plastics, mineral wool, fibreglass-reinforced composites).

D-series selection rule: start with D2 as the default. Move to D3 if wear life from D2 is insufficient and toughness is not the bottleneck (i.e. substrate is highly abrasive and impact loading is low). Move to D5 if section thickness exceeds 50 mm and D2 is not through-hardening. Move to D7 if D3 wear life is still insufficient and grindability is not the bottleneck.
## 3. The A-series: air-hardening medium-alloy

The A-series grades (A2, A6, A8) are air-hardening medium-alloy cold-work tool steels. With 5 % Cr and 1.0–1.5 % Mo, they offer an attractive balance of wear resistance, toughness and dimensional stability for short-to-medium run tooling.

**A2 (UNS T30102)** is the workhorse of the A-series and the most widely used cold-work tool steel after D2. Composition is 1.0 % C, 5.0 % Cr, 1.0 % Mo, 0.2 % V. Air-hardening to HRC 57–62 gives a clean, low-distortion hardening response that makes A2 ideal for punches, blanking dies and slitter blades where D2 wear life is overkill but oil-hardening O1 distortion cannot be tolerated. A2 is the standard slitter-blade grade for paper, film and plastic film lines in many Asian and European converting shops.

**A6 (UNS T30106)** is a low-distortion variant with elevated manganese (1.6–2.0 %). The high Mn content retains austenite at the quench, reducing dimensional change during cooling. Hardened to HRC 58–60, A6 is used where A2 standard is acceptable but improved dimensional stability is critical — long, thin blanking dies and forming tools.

**A8 (UNS T30108)** is a high-toughness variant with 5 % Cr, 1.5 % Mo and W additions. The W addition raises impact resistance to roughly twice that of A2 at the same hardness. A8 is specified where A2 wear life is sufficient but impact loading dominates — shear blades on thick plate, granulator bed knives under shock load.

A-series selection rule: use A2 for general-purpose slitting, blanking and forming at HRC 60. Upgrade to A6 when dimensional stability matters more than wear life. Upgrade to A8 when impact resistance dominates the failure mode. The A-series as a group trades the wear life of the D-series for ~30 % better toughness, and is the right choice when section thickness is below 50 mm and impact is moderate.
## 2. Chemistry and primary carbides

The chemistry of cold-work tool steel is dominated by three elements: carbon, chromium and vanadium. Each drives a specific set of properties through the carbide phases formed at solidification.

**Carbon** controls the volume fraction of primary carbides. At 1.0 % C (A-series), about 5–8 % of the microstructure by volume is primary carbide. At 1.5–2.4 % C (D-series), the fraction rises to 10–15 %. More carbides mean more wear resistance — but also lower toughness, because carbides are brittle and act as crack initiation sites under impact. The D-series thus trades toughness for wear life compared to the A-series.

**Chromium** provides modest corrosion resistance (more importantly it is an internal carbide former rather than a passivation driver) and is the dominant carbide former in the D-series. The M₇C₃ primary carbides in D2 carry 35–40 % Cr and are the primary source of wear resistance. Higher chromium also shifts the hardenability curve: A2 with 5 % Cr is air-hardening through 25 mm sections, while D2 with 12 % Cr is air-hardening through 100 mm.

**Vanadium** is the hardest carbide former — VC is ~2700 HV, vs ~1800 HV for M₇C₃. Vanadium additions directly boost wear resistance but at the cost of grindability. D7 with 4 % V has the highest wear resistance in the standard D-series; A2 with 0.2 % V is the most grindable. This vanadium-vs-grindability trade-off is the single most important selection criterion for slitter blades in production.

**Molybdenum** is a secondary carbide former and a temper-resistance additive. It is most prominent in A-series grades (1.0–1.5 % Mo) where it contributes to secondary hardening at 510–540 °C. D-series grades carry little molybdenum because their chromium already provides enough secondary hardening response.

**Manganese and silicon** are residual elements from steelmaking. Both contribute to hardenability through solute effects but neither forms primary carbides. Manganese also binds sulfur to mitigate hot shortness during austenitising.

The carbide volume fraction and primary carbide type together determine the wear-vs-toughness-vs-grindability position of any cold-work tool steel. As a first rule: chromium drives wear resistance and hardenability; vanadium drives wear resistance and grindability cost; carbon ties the two together by setting the carbide volume.
Cold-work tool steel is defined operationally as a tool steel that operates at temperatures below ~200 °C, where thermal softening is not the dominant failure mechanism. The AISI / UNS standard cold-work grades span HRC 58–64 hardened, with primary carbide volume 5–15 % depending on chemistry. The defining metallurgical feature is the presence of primary carbides — chromium-rich M₇C₃ and M₂₃C₆, vanadium-rich VC, and tungsten-rich M₆C — that remain undissolved at austenitising temperature and provide the wear resistance.

The cold-work family includes:
- **A-series** — air-hardening medium-alloy grades (5 % Cr, 1 % Mo)
- **D-series** — air-hardening high-carbon high-chromium grades (12 % Cr, 1.5–2.4 % C)
- **O-series** — oil-hardening medium-carbon grades (0.5 % Cr, 0.5 % W)
- **Modern alternatives** — DC53 (D2 refinement), ASP 2060 (PM HSS crossover)

For comparison, hot-work tool steels (H11, H13) operate at 200–600 °C and prioritise thermal fatigue resistance; high-speed steels (M2, M42) operate at 500–650 °C and prioritise hot hardness. Neither of these families is suitable as a cold-work replacement — cold-work grades are NOT a subset of HSS or hot-work, they are a distinct family.