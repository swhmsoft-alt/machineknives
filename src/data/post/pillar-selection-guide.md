---
title: 'Industrial Blade Selection Framework'
excerpt: 'A structured method to match substrate, geometry, hardness, edge prep and operating speed to a production line. The 5-Factor Blade Selection Framework —…'
publishDate: 2026-09-28
category: 'selection-guide'
type: 'article'
tags:
  - blade selection
  - 5-factor framework
  - substrate
  - geometry
  - hardness
  - edge prep
  - operating speed
  - industrial knife
author: 'Custom Machine Knives Engineering'
metadata:
  description: 'The 5-Factor Blade Selection Framework — substrate, geometry, hardness target, edge preparation, operating speed. The methodology that drives material, grade, hardness and coating choices for industrial cutting blades.'
  canonical: 'https://custommachineknives.com/blog/selection-guide/pillar-selection-guide/'
image: '/images/og/pillar-selection-guide.webp'
---
# Industrial Blade Selection Framework


The 5-Factor Blade Selection Framework is a structured method to match a cutting blade specification to a production line — substrate, geometry, hardness target, edge preparation, and operating speed. Developed over 25+ years of specifying industrial machine knives, the framework converts the noise of competing material options, hardness numbers, and edge geometry into a single, defensible specification.

The framework is not a material selection guide. Material selection (cold-work steel, martensitic stainless, HSS, hot-work steel, tungsten carbide) is downstream of the framework — once the 5 factors are specified, the material and grade follow naturally.

For the underlying material reference, see the 5-Factor Blade Selection Framework original entry, plus the five material pillars ([cold-work](/blog/selection-guide/pillar-cold-work-tool-steel/), [martensitic stainless](/blog/selection-guide/pillar-martensitic-stainless/), [high-speed steel](/blog/selection-guide/pillar-high-speed-steel/), [hot-work tool steel](/blog/selection-guide/pillar-hot-work-tool-steel/), [tungsten carbide](/blog/selection-guide/pillar-tungsten-carbide/)).





## 1. Why a framework?
The most common mistake in blade specification is to start with the material — "use D2" or "use 440C" — without first understanding the cutting conditions. The material then either:

## 2. The 5 factors

Building on the framework's rationale, the five factors in detail.

The 5-Factor Blade Selection Framework specifies five factors that determine a complete blade specification:

**Factor 1 — Substrate.** The material being cut determines the dominant failure mode, the material family for the blade, and the minimum hardness floor for the blade edge. Substrate classification is the starting point of the framework.

**Factor 2 — Geometry.** Blade thickness, diameter, edge angle and hone geometry are constrained by the substrate, the blade material, and the cutting mechanics. Geometry is the second filter that limits material and hardness options.

**Factor 3 — Hardness target.** The HRC target for the cutting edge is set by the substrate hardness, the wear life required, and the toughness needed for impact resistance. Hardness is typically the third filter after substrate and geometry.

**Factor 4 — Edge preparation.** The hone, micro-bevel, surface finish and sharpness of the edge affect cutting force, cut quality, and chipping resistance. Edge preparation is often the highest-ROI factor for incremental blade-life improvement.

**Factor 5 — Operating speed.** The linear or rotary speed of the blade through the substrate determines the cutting-edge temperature, the cutting force, and the friction heat. Operating speed is the fifth filter that drives the substrate and coating decision.

The five factors interact — a change in one factor cascades through the others. Specifying Factor 1 (substrate) without considering Factor 5 (operating speed) leads to the most common specification errors. The framework's purpose is to make all five factors explicit and traceable in the blade specification.


## 3. Factor 1 — Substrate

The substrate is the single most important factor. It determines:

- **Dominant failure mode** — abrasive wear (hard mineral content), impact (elastic substrate), corrosion (water/food contact), thermal (high friction)
- **Material family** — steel (general), stainless (corrosion), HSS (high-speed), carbide (ultra-premium wear)
- **Hardness target floor** — must be harder than the substrate (e.g., cutting 60 HRC steel needs 62+ HRC blade)

Substrate classification:

| Substrate family | Examples | Typical failure mode | Material class |
|------------------|----------|----------------------|----------------|
| Paper / tissue | Tissue, kraft paper, glassine | Edge wear (mild) | Cold-work steel |
| Film / foil | PE, PP, PET, aluminium foil | Edge wear (moderate) | Cold-work steel |
| Filled polymer | Glass-fibre PA, mineral-filled PP | Edge wear + chipping | Cold-work + coating |
| Corrugated | Corrugated board | Edge wear (abrasive) | Cold-work with coating |
| Food product | Meat, vegetables, cheese | Edge dulling + corrosion | Stainless |
| Plastic film | Plastic film | Edge wear (mild) | Cold-work steel |
| Recycled polymer | Recycled film with contamination | Impact + wear | Cold-work + coating |
| Steel plate | Cold-rolled mild steel | Edge wear (moderate) | Cold-work or HSS |
| Stainless plate | 304 stainless | Edge wear + work-hardening | HSS |
| Aluminium foil | Household + industrial foil | Edge wear (sharp) | Cold-work steel |
| Mineral wool | Insulation | Heavy abrasive wear | Carbide (YG6) |
| Glass fibre | CFRP, GFRP | Heavy abrasive wear | Carbide or PCD |
| Stone / rock | Granite, limestone | Heavy impact + wear | Carbide (YG15) |

The substrate also determines cutting-edge geometry choices. Soft, elastic substrates (paper, tissue, food) tolerate sharp edges; hard, brittle substrates (stone, glass fibre) need robust edges with hone.

## 4. Factor 2 — Geometry

Factor 2 — Geometry: thickness constrains maximum hardness.

Geometry constrains the maximum achievable hardness because thinner sections have less thermal mass for heat treatment and are more prone to distortion during quenching. The general rule: as blade thickness decreases, the maximum achievable hardness decreases, and the material family narrows.

**By thickness:**
- <2 mm: thin slitter geometries. Air-hardening grades only (D2, A2, SKD11, M2 HSS) to control distortion. Maximum hardness HRC 60–62 to retain toughness.
- 2–6 mm: medium slitter and shear. Most tool-steel grades applicable. Maximum hardness HRC 58–62.
- 6–20 mm: heavy shear and granulator rotors. All standard grades including carbide. Maximum hardness depends on grade.
- >20 mm: large dies and shear blades. Distortion is less of a concern; heat treatment is straightforward.

**Edge angle** is constrained by the substrate's cutting mechanics. Soft, elastic substrates (paper, food, polymer film) tolerate acute edges of 15–22° per side. Hard, brittle substrates (stone, glass fibre, stacked steel) require robust edges of 25–35° per side.

**Hone** is constrained by the substrate and the impact severity. Soft substrates tolerate small hone (0.02–0.10 mm). Hard or impact-loaded substrates require larger hone (0.20–1.5 mm) or secondary micro-bevel.

**Diameter** for circular blades is constrained by the available material stock, the grinder capacity, and the dynamic balance requirements. Large-diameter blades (>500 mm) require balanced grinding and may need through-hardening to ensure uniform hardness across the section.

## 5. Factor 3 — Hardness target

Factor 3 — Hardness target: wear-vs-toughness trade-off.

The hardness target is set by the substrate hardness (with margin) and constrained by the material family and the geometry. Higher hardness improves wear resistance but reduces toughness; the trade-off depends on the dominant failure mode.

**Substrate hardness floor.** The blade edge must be harder than the substrate being cut. For most industrial applications, this means HRC 56–60 minimum. Cutting 304 stainless (HRC 25 max) at HRC 56 leaves substantial wear margin. Cutting 60 HRC tool steel needs a 62+ HRC blade — which means HSS or carbide.

**Wear vs toughness.** Abrasive-dominated service: high hardness wins (HRC 60–62). Impact-dominated service: lower hardness for toughness (HRC 54–58). Mixed mode: middle of range (HRC 58–60).

**By material family:**
- Cold-work tool steel: HRC 58–62 typical. Maximum HRC 62 (D2, A2).
- Martensitic stainless: HRC 56–60 typical (440C). 420 only reaches HRC 50.
- HSS: HRC 62–67 (M2, M42). Maximum HRC 68 (ASP 2060).
- Hot-work tool steel: HRC 48–54 typical.
- Tungsten carbide: HRC equivalent 70–80 (HRA 87–92).

**Hardness overkill.** Specifying HRC 62 when the substrate only requires HRC 56 wastes toughness and increases chipping risk. The procurement specification should state the minimum acceptable hardness, not the maximum.

**Hardness verification.** Every blade delivery should have hardness verification per ASTM E18 (Rockwell) or ASTM E384 (micro-hardness). Out-of-spec hardness is the most common procurement failure.

## 6. Factor 4 — Edge preparation

Factor 4 — Edge preparation: highest-ROI factor.

Edge preparation covers everything that affects how the blade interacts with the substrate at the cutting interface: edge angle, primary hone, secondary micro-bevel, edge radius, surface finish, coating.

**Primary hone.** The dominant edge-preparation variable. Smaller hone (0.02–0.10 mm) for soft substrates and precision cutting. Larger hone (0.20–1.5 mm) for impact-loaded substrates. The trade-off: smaller hone reduces cutting force and improves cut quality; larger hone improves chipping resistance.

**Secondary micro-bevel.** Critical for chip-prone applications. Standard practice on granulator rotors, paper slitters cutting splices, and any application with intermittent impact. Micro-bevel width 0.5–2.0 mm, angle 25–45° per side.

**Edge radius.** For sharp edges (no hone), edge radius should be <5 µm for paper slitter, <3 µm for premium applications. Edge radius is measured by light-section microscopy or laser confocal.

**Surface finish.** Final surface finish at the cutting edge should be Ra < 0.4 µm for general industrial, Ra < 0.2 µm for premium. Surface finish affects coating adhesion, friction coefficient at the cut, and initial wear rate.

**Coating.** The edge-preparation decision interacts with the coating decision. PVD coatings require sharp edges (hone <0.5 mm) for proper deposition. The coating itself becomes part of the edge preparation — TiN, TiCN, TiAlN, CrN, DLC, AlCrN, CVD diamond.

**ROI.** Edge preparation is often the highest-ROI factor for blade-life improvement. A small change in hone size or the addition of a secondary micro-bevel can extend blade life 30–100 % without changing the substrate material or hardness. The cost of better edge preparation is small relative to the gain.

## 7. Factor 5 — Operating speed

Factor 5 — Operating speed: determines cutting-edge temperature.

Operating speed is the linear or rotary speed at which the blade engages the substrate. Speed determines the cutting-edge temperature, the cutting force, and the friction heat — all of which drive the substrate, coating and hardness decisions.

**Speed ranges and substrate crossover:**
- Below 100 m/min: cold-work tool steel (D2, A2) sufficient for most substrates
- 100–500 m/min: cold-work with PVD coating, or martensitic stainless
- 500–1500 m/min: HSS (M2, M42) for high-temperature substrates
- 1500+ m/min: HSS with TiAlN coating, or carbide (YG6, YG6X)

**Cutting-edge temperature** rises with operating speed. The approximate rule: edge temperature in °C ≈ cutting speed in m/min × 0.5–1.0 (depending on substrate). A 1000 m/min cut on paper generates edge temperature ~500–1000 °C — well above cold-work capability.

**Friction coefficient.** Substrate-dependent. Polymer film: friction 0.3–0.5. Paper: friction 0.4–0.6. Steel: friction 0.2–0.4 with lubrication, 0.5–0.8 dry. Friction drives heat generation; lower friction allows higher speeds.

**Cooling.** Cutting-edge temperature can be reduced by 30–50 % with proper cooling (flood coolant, air knife, or substrate-side lubrication). Cold-work tool steel is limited to dry or low-coolant service because of thermal-shock cracking risk. HSS tolerates flood coolant. Carbide tolerates flood coolant and dry cutting equally well.

**The speed-temperature-substrate triangle.** Operating speed determines edge temperature, which determines the required substrate family, which determines the achievable hardness and edge geometry. The triangle is closed by the substrate selection, the speed selection, and the cooling strategy.

## 8. Worked example: glass-filled PA granulator rotor blade

Worked example: applying the framework to glass-filled PA granulator.

A plastics recycler is selecting a rotor blade for a granulator processing glass-filled polyamide (PA66 + 30 % glass fibre). The rotor operates at 600 rpm (peripheral speed ~30 m/min), with intermittent impact loading.

**Factor 1 — Substrate.** Glass-filled polyamide. Dominant failure mode: abrasive wear from glass fibre ends, combined with impact from granulator cutting action. Substrate classification: filled polymer. Material family: cold-work tool steel with coating, or carbide.

**Factor 2 — Geometry.** Rotor blade, 250 mm long, 80 mm wide, 12 mm thick. Edge angle 25° per side. Secondary micro-bevel 1.5 mm at 35°. Maximum hardness HRC 60 achievable at this thickness.

**Factor 3 — Hardness target.** Wear-dominant: target HRC 60 minimum. Toughness secondary but important due to impact. Material family options: D2 at HRC 60, or YG10 at HRC equivalent 75.

**Factor 4 — Edge preparation.** Primary hone 0.4 mm for chip resistance. Secondary micro-bevel 1.5 mm at 35° to arrest any chip initiation. Surface finish Ra <0.4 µm. No coating on the rotor (coating is optional here — the bulk material handles wear life; coating helps but is not critical).

**Factor 5 — Operating speed.** 30 m/min peripheral — low to moderate. Cutting-edge temperature ~50–100 °C, well below cold-work capability. No thermal constraint on substrate selection.

**Decision.** Compare D2 vs YG10:

| Factor | D2 cold-work | YG10 carbide |
|--------|--------------|---------------|
| Wear life (relative) | 1× | 5–8× |
| Cost per blade | $400 | $1,500 |
| Blade life | 4 shifts | 18 shifts |
| Cost per shift | $100 | $83 |
| Chipping risk | Moderate | Lower (tougher) |

YG10 wins on total cost per shift despite higher per-blade cost. The factor-driven analysis identifies the right answer through the framework: substrate (filled polymer) and impact severity (moderate) point to carbide; cost analysis confirms YG10 is the right answer.

## 9. Decision matrix

Decision matrix mapping factors to recommended materials.

The 5-factor framework produces a decision matrix that maps the substrate classification to a recommended material family. The matrix is a starting point; specific applications may require deviation based on local conditions.

| Substrate family | Material recommendation | Coating recommendation | Edge geometry |
|------------------|-------------------------|----------------------|---------------|
| Paper / tissue | D2 or DC53 | TiN or TiCN | 18–22°, 0.05–0.15 mm hone |
| Film / foil | D2 or DC53 | DLC for adhesive wear | 20–25°, 0.05–0.15 mm hone |
| Filled polymer | D2 with TiCN, or YG10 carbide | TiCN | 22–28°, 0.20–0.50 mm hone + micro-bevel |
| Corrugated | D2 with TiCN | TiCN | 22–28°, 0.20–0.40 mm hone |
| Food product | 420 or 440A | CrN or uncoated | 18–22°, 0.05–0.15 mm hone |
| Plastic film | D2 or A2 | DLC for adhesive | 18–22°, 0.05–0.10 mm hone |
| Recycled polymer | D2 with TiCN | TiCN or TiAlN | 22–28°, 0.30–0.80 mm hone + micro-bevel |
| Steel plate | D2 or HSS M2 | TiAlN | 22–28°, 0.10–0.30 mm hone |
| Stainless plate | HSS M2 or M42 | TiAlN | 22–28°, 0.10–0.30 mm hone |
| Aluminium foil | D2 or DC53 | DLC or uncoated | 18–22°, 0.02–0.08 mm hone |
| Mineral wool | YG6 carbide | TiN | 22–28°, 0.10–0.20 mm hone |
| Glass fibre | YG6X or YG10 | DLC or CVD diamond | 25–30°, 0.20–0.40 mm hone + micro-bevel |
| Stone / rock | YG15 + sinter-HIP | None (coating wears off too fast) | 28–35°, 0.5–1.5 mm hone + micro-bevel |

For non-standard substrates (CFRP, ceramic, abrasive food, etc.), apply the framework factors individually and select the material based on the dominant failure mode.

## 10. Failure mode mapping

Failure mode mapping: each failure mode traces to a mis-specified factor.

The 5-factor framework is most useful as a diagnostic tool. When a blade fails prematurely, the failure mode can usually be traced to one or more factors that were mis-specified at procurement. The standard mapping is:

**Premature abrasive wear.** Cause: Factor 1 (substrate) mis-specified — too soft a material for the abrasive content. Or Factor 4 (edge prep) — insufficient surface hardness from coating. Or Factor 5 (operating speed) — too high for the substrate. Fix: harder substrate (upgrade material family); PVD coating; reduce speed or add cooling.

**Premature chipping.** Cause: Factor 2 (geometry) — hone too small. Or Factor 3 (hardness) — too high for the impact load. Or Factor 4 (edge prep) — missing secondary micro-bevel. Fix: increase hone; add micro-bevel; reduce hardness; switch to tougher substrate (DC53 instead of D2, YG10 instead of YG6).

**Gross fracture.** Cause: Factor 1 (substrate) — too brittle (carbide where HSS was correct). Or Factor 2 (geometry) — sharp internal corner. Or Factor 3 (hardness) — over-tempered, low hardness. Fix: tougher substrate; corner radius design; verify heat-treatment records.

**Corrosion pitting.** Cause: Factor 1 (substrate) — cold-work specified where stainless was correct. Or Factor 5 (operating speed) — wet service with insufficient material selection. Fix: switch to martensitic stainless or coated substrate.

**Plastic deformation (sinking).** Cause: Factor 3 (hardness) — too low for the operating temperature. Or Factor 5 (operating speed) — too high for the substrate. Fix: higher hot hardness (HSS, hot-work, or carbide); reduce speed or add cooling.

**Cut quality issues.** Cause: Factor 2 (geometry) — wrong edge angle. Or Factor 4 (edge prep) — hone too large. Or Factor 1 (substrate) — wrong material for the substrate. Fix: refine geometry; sharpen edge; reconsider material.

## 11. Implementation in the production environment

Implementation through specification, wear-testing, and review.

The 5-factor framework is implemented in three steps: specification, validation, and continuous review.

**Specification.** Each blade specification should document all five factors explicitly. A standardised specification sheet covers: Factor 1 substrate being cut (with material grade and key properties); Factor 2 blade geometry (dimensions, edge angle, hone); Factor 3 hardness target (HRC range); Factor 4 edge preparation (hone, micro-bevel, surface finish, coating); Factor 5 operating speed and cutting-edge temperature estimate. The specification sheet is the procurement document and the inspection reference.

**Validation.** New blade specifications should be validated by wear testing before full deployment. The validation test runs the candidate blade at production parameters for a defined period (typically 1–4 weeks) and measures blade life, cut quality, and any failure modes. The validation data feeds back into the specification — confirming or revising the original factor choices.

**Continuous review.** Production blade performance is reviewed quarterly or after significant changes (new substrate, new line, new product). The review identifies systematic under-performance or systematic over-specification, both of which waste money. The framework's data — blade life, failure modes, cost-per-cut — feeds into the review and informs future specifications.

**Specification drift.** Over time, blade specifications tend to drift — suppliers change, materials change, lines change speed or product. The framework's discipline (specifying all five factors explicitly) makes drift visible. Without the framework, the same blade may be specified under different assumptions by different people, leading to inconsistent procurement.

**Training.** Operators, procurement engineers, and blade-shop staff should all be trained on the framework. The framework's value is in consistent application across the team, not just in the head of the engineering department.

## 12. Standards and references

Standards and references for the framework.

The framework is grounded in international standards that govern the materials, testing, and inspection referenced throughout the cluster.

**Material standards.** ISO 4957 (tool steels), ASTM A681 (wrought tool steel), GB/T 1299 (Chinese tool steel standard), GB/T 30892 (Chinese cemented carbide standard), ISO 513 (hard cutting materials classification), ASTM B294 (carbide hardness), ASTM B311 (carbide density), ASTM B657 (carbide microstructure).

**Testing standards.** ASTM E18 (Rockwell hardness), ASTM E384 (micro-hardness), ASTM E112 (grain size), ASTM A262 (intergranular corrosion), ASTM G48 (pitting corrosion), ASTM B117 (salt spray), ISO 3327 (TRS for carbide), ISO 8442 (cutlery materials).

**Quality system standards.** ISO 9001 (general quality), AS9100 (aerospace), NADCAP (special processes), ISO 13485 (medical devices), FDA 21 CFR (food contact), EU 1935/2004 (food contact).

**Coating standards.** ISO 14577 (instrumented indentation for coating hardness), VDI 3198 (coating adhesion test), manufacturer-specific coating datasheets.

**References.** The framework draws on published industrial references on cutting tool engineering, blade-shop practice, and tool-material metallurgy. The five pillar pages (cold-work, martensitic stainless, HSS, hot-work, tungsten carbide) provide the material-specific reference data that the framework applies.

## 13. Summary

Summary of the 5-Factor Framework.

The 5-Factor Blade Selection Framework is the methodology that converts substrate classification, blade geometry, hardness target, edge preparation, and operating speed into a single defensible blade specification. The framework's value is in making all five factors explicit and traceable — eliminating the most common specification errors (wrong material, wrong hardness, wrong geometry) and enabling diagnostic analysis of premature blade failures. The framework is implemented through specification, validation, and continuous review. The five pillar pages (cold-work, martensitic stainless, HSS, hot-work, tungsten carbide) provide the material-specific reference data that the framework applies to industrial blade selection.

## 14. Edge geometry quick reference

Edge geometry quick reference.

| Substrate family | Edge angle | Primary hone | Micro-bevel | Surface finish |
|------------------|------------|--------------|-------------|----------------|
| Paper, tissue, film | 18–22° | 0.05–0.15 mm | Optional 0.5 mm | Ra <0.4 µm |
| Light abrasive (film with fillers) | 20–25° | 0.10–0.20 mm | 0.5–1.0 mm | Ra <0.4 µm |
| Filled polymer, glass fibre | 22–28° | 0.20–0.40 mm | 1.0–1.5 mm | Ra <0.4 µm |
| Granulator rotors | 25–32° | 0.30–0.80 mm | 1.5–2.0 mm | Ra <0.8 µm |
| Steel plate | 22–28° | 0.10–0.30 mm | Optional | Ra <0.4 µm |
| Stainless plate | 22–28° | 0.10–0.30 mm | Optional | Ra <0.4 µm |
| Aluminium foil | 18–22° | 0.02–0.10 mm | Not recommended | Ra <0.2 µm |
| Food product | 18–22° | 0.05–0.15 mm | Optional | Ra <0.2 µm |
| Mineral wool | 22–28° | 0.10–0.20 mm | Optional | Ra <0.4 µm |
| Glass fibre composite | 25–30° | 0.20–0.40 mm | 1.0–1.5 mm | Ra <0.4 µm |
| Stone, rock | 28–35° | 0.5–1.5 mm | 1.5–2.5 mm | Ra <0.8 µm |

Edge angles below the recommended range produce chipping. Edge angles above produce excessive cutting force and poor cut quality. Hone sizes below the recommended range produce chipping. Hone sizes above produce poor cut quality and high cutting force.

## 15. Coating selection matrix

Coating selection matrix.

| Application | Recommended coating | Hardness | Thickness | Notes |
|-------------|---------------------|----------|-----------|-------|
| Paper slitter (general) | TiN | 2300 HV | 2–4 µm | Standard first choice |
| Paper slitter (mineral) | TiCN | 3000 HV | 2–4 µm | Higher wear resistance |
| Film slitter (polymer) | DLC | 1500–3000 HV | 1–3 µm | Low friction, adhesive wear |
| Film slitter (aluminium foil) | CrN or DLC | 1800 / 1500–3000 HV | 2–4 µm | Non-stick + corrosion |
| Filled polymer slitter | TiCN or TiAlN | 3000 / 3000 HV | 2–4 µm | High abrasive wear |
| Granulator rotor | TiAlN or no coating | 3000 HV / — | 2–4 µm or none | Coating optional on carbide |
| Steel plate shear | TiAlN | 2800–3200 HV | 2–5 µm | High temperature |
| Stainless plate shear | TiAlN or AlCrN | 3000 HV | 2–5 µm | High temperature + abrasive |
| Aluminium foil slitter | DLC or none | 1500–3000 HV | 1–3 µm | Non-stick essential |
| Food product | CrN or none | 1800 HV | 2–4 µm | Corrosion resistance |
| Mineral wool | TiN | 2300 HV | 2–4 µm | Standard first choice |
| Glass fibre | DLC or CVD diamond | varies | 1–3 µm or 5–20 µm | DLC for fine edges; CVD for high wear |
| Stone, rock | None | — | — | Coating wears off too fast |

Coating thickness is typically 2–4 µm for general industrial; thicker coatings (5–8 µm) for high-wear service; thinner coatings (1–2 µm) for sharp edges. Coating hardness is measured by nano-indentation per ISO 14577.

## 16. Quality control checklist

QC checklist for blade procurement.

A documented QC checklist is the difference between consistent blade procurement and inconsistent procurement. The checklist covers:

**At order placement:**
- All five factors specified in the procurement document
- Material grade referenced to a recognised standard (AISI, UNS, WNr, JIS, GB, ISO)
- Mill certification required
- Hardness range specified
- Dimensional tolerances specified
- Edge geometry specified (angle, hone, micro-bevel)
- Coating specified if applicable
- Heat-treatment specification referenced (austenitising, tempering)
- Inspection and testing requirements specified

**At receipt:**
- Mill certificate reviewed against specification
- Hardness tested per ASTM E18
- Dimensions checked against drawing
- Edge geometry measured
- Visual inspection under 10× magnification for surface defects
- Coating thickness verified (for coated blades)
- Documentation chain complete

**At deployment:**
- First article validated in production
- Blade life tracked against specification target
- Failure modes recorded
- Wear-test data fed back to specification

**Continuous review:**
- Quarterly review of blade performance
- Specification updates based on production data
- Supplier qualification maintenance

The QC checklist should be a living document — updated as specifications evolve, as new materials become available, and as production conditions change. A static checklist is a barrier to improvement.

## 17. Real-world case 2: tissue slitter upgrade

Real-world case 2: tissue slitter upgrade.

A tissue converter is running log-saw blades at HRC 60 with TiN coating. Blade life is 12 shifts. The line is losing 18 minutes per shift to blade changes plus 30 minutes of off-caliper product after each change. The total cost of the current blade specification is approximately $18,000/year per blade in service.

**Factor 1 — Substrate.** Tissue paper, soft, mildly abrasive (no fillers). Substrate classification: clean paper. Material family: cold-work tool steel is correct.

**Factor 2 — Geometry.** 250 mm diameter log saw, 2.5 mm thick, 18° per side edge angle. Geometry is appropriate.

**Factor 3 — Hardness target.** Target HRC 60 is appropriate for the substrate. No change needed.

**Factor 4 — Edge preparation.** Current: 0.10 mm primary hone, no micro-bevel, TiN coating. Issue: coating is breaking down at the edge after 6 shifts, exposing the substrate to accelerated wear. The coating is the weak link.

**Factor 5 — Operating speed.** 1500 m/min line speed. Cutting-edge temperature ~750 °C at this speed. Above the cold-work tool-steel operating limit (200 °C continuous). The substrate selection may be wrong.

**Diagnosis.** Factor 5 (operating speed) creates the dominant constraint. At 1500 m/min, the cutting edge runs at 750 °C — well above cold-work capability. The TiN coating is failing because the substrate is softening under heat.

**Intervention.** Switch substrate from cold-work tool steel (D2) to HSS (M2). Apply TiAlN coating instead of TiN. The M2 substrate retains hardness at 750 °C; TiAlN's aluminium oxide layer provides additional oxidative stability.

**Outcome.** Blade life extends from 12 to 35 shifts (3×). TiAlN coating lasts the full blade life. Line speed can potentially be increased further because the substrate and coating can handle more heat.

The framework identifies the substrate and coating changes through Factor 5, which was the actual root cause of premature failure. Without the framework, the diagnosis would have been "coating failure" and the intervention would have been a different coating — not the right fix.

## 18. Real-world case 3: abrasive paper slitter

Real-world case 3: abrasive paper slitter.

A specialty paper mill is producing abrasive paper with 30 % calcium-carbonate filler. Current slitter blade is D2 at HRC 60 with TiN coating. Blade life is 40 hours. The line is losing 15 minutes per blade change plus 30 minutes of off-caliper product after each change.

**Factor 1 — Substrate.** Abrasive paper with mineral filler. Substrate classification: filled paper, highly abrasive. Material family: D2 is appropriate but borderline.

**Factor 2 — Geometry.** 200 mm diameter slitter, 1.8 mm thick, 20° per side edge angle, 0.08 mm primary hone. Geometry is appropriate for the thickness constraint.

**Factor 3 — Hardness target.** Target HRC 60 is appropriate for D2 wear life.

**Factor 4 — Edge preparation.** TiN coating helps but is not optimal for abrasive wear. TiCN would deliver better wear resistance. Hone is small — adequate for the substrate, but a secondary micro-bevel of 0.5 mm would help arrest the occasional chipping at splice points.

**Factor 5 — Operating speed.** 600 m/min line speed. Cutting-edge temperature ~300 °C, manageable for D2. Not the dominant constraint.

**Diagnosis.** The dominant constraint is Factor 4 — edge preparation and coating. TiN is the wrong coating; TiCN or TiAlN would extend wear life 2–3×. The TiN coating is also being applied to too small a hone area — increasing the hone to 0.15 mm and adding a micro-bevel would help arrest chipping.

**Intervention.** Upgrade coating from TiN to TiCN. Increase primary hone from 0.08 to 0.15 mm. Add secondary micro-bevel of 0.5 mm at 30° per side. Substrate (D2) and hardness (HRC 60) remain unchanged.

**Outcome.** Blade life extends from 40 to 110 hours (2.75×). Coating lasts the full blade life. Micro-bevel arrests the chipping at splice points, eliminating off-caliper product on splice cuts.

The framework identifies the edge preparation as the dominant constraint, not the substrate. Without the framework, the procurement team might have switched to a more expensive substrate (DC53 or carbide) — which would also have worked but at 5–10× the cost of the TiCN + hone change.

## 19. Troubleshooting flowchart

Troubleshooting flowchart for blade failures.

The troubleshooting flowchart maps observed failure modes to the most likely mis-specified framework factor and the standard corrective action.

**Symptom: premature abrasive wear.** Most likely: Factor 1 (substrate too soft) or Factor 4 (coating inadequate). Action: upgrade substrate family (cold-work → HSS → carbide); upgrade coating (TiN → TiCN → TiAlN).

**Symptom: chipping at the edge.** Most likely: Factor 2 (hone too small) or Factor 3 (hardness too high) or Factor 4 (missing micro-bevel). Action: increase hone; add micro-bevel; reduce hardness; switch to tougher substrate.

**Symptom: gross fracture.** Most likely: Factor 1 (substrate too brittle) or Factor 2 (geometry — sharp internal corner) or Factor 3 (heat-treat defect). Action: tougher substrate; corner radii; verify heat-treatment records.

**Symptom: corrosion pitting.** Most likely: Factor 1 (substrate — cold-work specified where stainless was correct). Action: switch to martensitic stainless or coated substrate.

**Symptom: plastic deformation at the edge.** Most likely: Factor 3 (hardness too low for the operating temperature) or Factor 5 (speed too high). Action: higher hot hardness substrate; reduce speed; add cooling.

**Symptom: cut quality issues (ragged edge, tearing).** Most likely: Factor 2 (wrong edge angle) or Factor 4 (hone too large) or Factor 1 (wrong substrate). Action: refine edge geometry; sharpen hone; reconsider substrate.

**Symptom: rapid wear after resharpening.** Most likely: Factor 4 (grinding burn — edge over-tempered during resharpening). Action: improve grinding protocol; remove more material to get below the burn zone.

The flowchart is a starting point. Each specific application may have additional considerations that change the diagnosis. The framework's value is in making the diagnosis systematic rather than ad hoc.

## 20. Real-world case 4: hot shear blade

Real-world case 4: hot shear blade.

A steel mill operates crop-shear blades for 150 mm mild steel billets at 950 °C. Current blade is H13 at HRC 50 with nitriding. Blade life is 800 shifts. Failure mode is combination of edge rounding and gross cracking after 600–800 shifts.

**Factor 1 — Substrate.** Hot steel workpiece at 950 °C. Substrate classification: hot shear. Material family: H11, H13, or H21. H13 is appropriate.

**Factor 2 — Geometry.** 350 mm wide × 50 mm thick × 25° per side edge angle × 1.0 mm primary hone. Geometry is robust for the impact loading.

**Factor 3 — Hardness target.** HRC 50 is appropriate for the impact-dominated service. Higher hardness would increase chipping risk.

**Factor 4 — Edge preparation.** Nitriding provides the surface hardness. PVD coating (AlCrN) could extend edge life at the high-temperature contact.

**Factor 5 — Operating speed.** Cutting-edge temperature during the cut is 600+ °C. Operating speed is moderate. The substrate selection (H13) handles this.

**Diagnosis.** The dominant constraint is Factor 4 — the surface treatment. Nitriding provides HRC 60 surface hardness but only to 0.3 mm depth. PVD AlCrN would provide HRC 70+ surface hardness with thermal stability to 800 °C. The combination of nitriding + AlCrN would deliver substantially better wear life.

**Intervention.** Add PVD AlCrN coating on top of the nitrided case. Verify coating thickness 3–5 µm. Verify coating adhesion per VDI 3198 (Rockwell C indentation test). Keep substrate (H13), hardness (HRC 50), and geometry unchanged.

**Outcome.** Blade life extends from 800 to 1400 shifts (75 % improvement). Edge rounding is delayed by the harder coating; gross cracking still happens but at extended life. Annual savings: 60 % reduction in blade consumption, equivalent to ~$120,000/year.

The framework identifies the surface treatment as the dominant constraint, not the substrate. Without the framework, the procurement team might have switched to H21 or higher-Mo HSS — which would also have worked but at 3–5× the cost of the AlCrN coating.

## 21. Closing notes

Closing notes for the framework.

The 5-Factor Blade Selection Framework is the methodology that drives industrial blade specification across the substrate family. It is not a material guide — material selection is downstream of the framework. Once the five factors are specified correctly, the material and grade follow naturally.

The framework's value is in consistency. The same blade specification, applied across an organisation by different engineers and procurement officers, produces the same blade specification. The framework removes the variability that comes from individual preference, legacy specifications, or vendor recommendations that are not aligned with the actual cutting conditions.

The framework's limitations are real. It does not capture every consideration — regulatory compliance, supplier relationships, lead time, cost structure — that affect blade procurement. The framework is the technical foundation; procurement is broader. The framework should be combined with procurement discipline (cost analysis, supplier qualification, lead-time management) to produce the complete procurement specification.

The framework is a living document. New materials, new coatings, new substrate families (PCD, ceramic, cermet) extend the framework's reach. The framework's structure (five factors) remains valid; the specific recommendations within each factor evolve with the industry.

For readers seeking specific material data, the five pillar pages (cold-work, martensitic stainless, HSS, hot-work, tungsten carbide) and the encyclopedia entries provide the detailed reference information that the framework applies.

## 22. Blade procurement playbook

Blade procurement playbook.

Procurement of industrial blades combines technical specification (the framework) with commercial discipline (cost, supplier, lead time). The procurement playbook is a standardised workflow that ensures both are addressed.

**Step 1 — Define the application.** Document the substrate (material being cut), the blade geometry (existing or proposed), the production parameters (speed, throughput, downtime cost), and the failure modes observed.

**Step 2 — Apply the framework.** Use the 5 factors to derive the blade specification. Document each factor explicitly. Reference the relevant material pillar pages for substrate-specific data.

**Step 3 — Cost analysis.** Compare candidate blade specifications on cost-per-cut or cost-per-shift basis. Include blade cost, coating cost, grinding cost, downtime cost, and off-spec product cost.

**Step 4 — Supplier selection.** Identify qualified suppliers for the chosen specification. Consider mill source (Western vs Chinese), regional logistics, supplier technical support, and historical performance.

**Step 5 — Specification issuance.** Issue the procurement specification with all five factors, the referenced standards (AISI, GB, ISO, etc.), the mill certificate requirements, the inspection and testing requirements, and the acceptance criteria.

**Step 6 — First article validation.** Before full deployment, validate the first article in production. Verify hardness, dimensions, edge geometry, coating thickness. Run the blade through a defined test cycle and confirm the expected life and cut quality.

**Step 7 — Production deployment and tracking.** Deploy the validated specification. Track blade life, failure modes, and cost-per-cut. Compare to the specification target.

**Step 8 — Quarterly review.** Review blade performance against specification. Identify systematic over-performance or under-performance. Update the specification based on data.

**Step 9 — Continuous improvement.** Apply the framework's failure-mode mapping to identify systematic issues. Refine specifications based on production data.

The playbook's discipline ensures that the framework's methodology is applied consistently and the procurement decisions are auditable.

## 23. Vendor selection criteria

Vendor selection criteria.

Industrial blade vendors (mills, blade processors, coaters) are evaluated on multiple criteria. The framework's specification is technical; the vendor selection is commercial.

**Technical capability.** The vendor must be able to produce the specified material, heat treatment, geometry, and coating. For tool-steel blades: vacuum furnace capability, CBN or ceramic grinding capability, PVD coating capability (in-house or sub-contracted). For carbide: powder pressing, vacuum sintering or sinter-HIP, diamond grinding, edge preparation.

**Quality system.** ISO 9001 baseline. AS9100 for aerospace. ISO 13485 for medical. The vendor's quality system must match the application's regulatory requirements.

**Capacity and lead time.** The vendor must be able to deliver the required quantity within the procurement timeline. Stocked material and standard geometries have shorter lead times than custom work.

**Geographic logistics.** Domestic vs international sourcing affects lead time, freight cost, customs, and the ability to handle returns. Chinese sourcing typically delivers 30–50 % cost advantage at the cost of 2–4 weeks additional lead time and higher logistics complexity.

**Technical support.** The vendor should be able to provide metallurgical consultation, failure analysis support, and application engineering. The most valuable vendor is one that helps solve blade-life problems, not one that just delivers product.

**Reputation and references.** Customer references in similar applications. The vendor's track record on the specific blade type.

**Pricing.** Per-piece cost should be compared on a like-for-like basis (same material, same hardness, same edge geometry, same coating). Significant pricing variation typically reflects quality variation.

**Documentation.** Mill certificate, heat-treatment records, dimensional inspection, coating certification. The vendor's documentation discipline affects the buyer's QC burden.

## 24. Common mistakes in blade specification

Common mistakes in blade specification.

The framework prevents most specification errors, but some common mistakes still appear in industrial blade procurement.

**Starting with the material.** Specifying "use D2" or "use 440C" without first understanding the cutting conditions. The material then either under-performs (because the application actually needed HSS or carbide) or over-pays (because cold-work was specified where carbon tool steel would have sufficed).

**Specifying maximum hardness.** Procurement specs that say "HRC 62 minimum" or "hardest available" drive the supplier toward brittle materials that chip in service. The correct spec is the *minimum acceptable* hardness for the substrate, not the maximum.

**Ignoring operating speed.** Specifying cold-work tool steel for a 1500 m/min tissue slitter (where cutting-edge temperature is 750 °C). The substrate softens; the coating fails. The substrate should be HSS, not cold-work.

**Ignoring substrate abrasiveness.** Specifying D2 (12 % Cr) for a 30 % glass-fibre polymer application. D2 wears out in 4 shifts; YG10 carbide runs 18 shifts. The substrate is wrong.

**Specifying chrome-plated blades.** Chrome plating is a cosmetic treatment that does not provide wear resistance at the cutting edge. The cutting edge is still the substrate. Chrome plating can also hydrogen-embrittle high-hardness tool steel.

**Confusing HRC and HRA.** Hardness specifications sometimes mix HRC (Rockwell C, for tool steel) and HRA (Rockwell A, for carbide). The numbers are not interchangeable. Carbide at HRA 90 is roughly equivalent to HRC 76, but the conversion is approximate and varies by grade.

**Overspecifying tolerances.** Tight dimensional tolerances (e.g., ±0.01 mm) drive up grinding cost without functional benefit. Specify the tolerance that the application requires, not the tightest tolerance the grinder can hold.

**Under-specifying heat treatment.** Specifying the material without specifying the heat treatment. The same material can be heat-treated to different hardness levels with different results. Specify austenitising, tempering, and target hardness.

**Specifying coating without specifying the substrate.** A TiN coating on D2 is not the same as TiN on HSS. The coating's effectiveness depends on the substrate's hardness at operating temperature.

**Specifying the wrong standard cross-reference.** "D2 equivalent" without specifying which mill's D2. The chemistry ranges for D2 from different mills (Bohler, Assab, Tisco) are nominally similar but the carbide distribution and micro-cleanliness differ to affect performance.

## 25. ROI framework for blade optimisation

ROI framework for blade optimisation.

Blade optimisation ROI is calculated by comparing the total cost of the current specification to the total cost of the proposed specification. The framework is straightforward but requires discipline to apply.

**Cost components:**
- Blade cost (per piece)
- Resharpening cost (per cycle)
- Coating cost (per cycle, if re-coated)
- Blade-change downtime cost (per change, in $)
- Off-spec product cost (per change, in $)
- Scrap cost from blade-related quality issues

**Calculation:**
- Total cost per blade life = blade cost + (resharpening cost × cycles) + (downtime cost × number of changes) + off-spec cost
- Cost per cut or per shift = total cost / blade life in cuts or shifts

**Comparison:**
- Compare cost per cut or per shift across candidate specifications
- The specification with the lowest cost per cut (assuming equivalent cut quality) is the optimum
- Non-monetary factors (regulatory compliance, supplier reliability) modify the comparison

**Example.** A production line is running D2 at HRC 60 with TiN coating at $120/change, 36-hour life. Cost per hour = $120 / 36 = $3.33/hour (excluding downtime). The upgrade to DC53 + TiAlN at $200/change, 72-hour life. Cost per hour = $200 / 72 = $2.78/hour. The upgrade saves $0.55/hour per blade. On a 24/7 line with 10 blades in service, the savings are ~$48,000/year.

The ROI calculation should include the downtime and off-spec product costs to capture the full value of the upgrade. A material upgrade that extends blade life but does not address downtime may have a lower ROI than an edge-preparation upgrade that addresses downtime directly.

**Payback period.** The ROI framework's output is payback period — the time required for the upgrade savings to equal the upgrade investment. Payback periods of 3–6 months are typical for well-targeted blade optimisations. Payback periods above 12 months suggest the optimisation is over-specified or the application is not a good fit for the upgrade.

## 26. Future trends

Future trends in blade specification.

**New substrate families.** Polycrystalline diamond (PCD) is becoming cost-competitive for selected industrial blade applications (paper slitter, film slitter). CVD diamond coating on carbide substrates extends the high-wear range. Cermet (TiC-based) appears in metal-cutting inserts and may extend to industrial blades. The framework's substrate classification will need to incorporate these new families as they become economically viable.

**Smart blades.** Embedded sensors (strain gauges, temperature sensors, RFID tags) are being developed for high-value blades. The sensors provide real-time data on blade wear, temperature, and operating parameters. The data feeds back into the framework's continuous-review process. Smart blades are not yet commercially standard for industrial applications but the technology is advancing.

**Additive manufacturing.** 3D printing of metal blades is in development. The technology allows complex internal cooling channels and tailored microstructures. AM is not yet cost-competitive for standard industrial blades but may be relevant for high-value custom tooling.

**AI-assisted specification.** Machine learning applied to blade performance data could identify non-obvious patterns (specific combinations of substrate, geometry, and operating parameters that produce unexpectedly long or short blade life). AI-assisted specification is in early development and may emerge as a tool to augment the framework in the next 5–10 years.

**Sustainability drivers.** Recycled carbide, recycled tool steel, and reduced-coating environmental impact are increasing priorities. The framework's cost analysis will need to incorporate the full lifecycle cost, not just the procurement cost. Carbon footprint may become a procurement criterion alongside technical performance.

**Coating technology.** PVD coating technology continues to advance — multi-layer coatings, nanocomposite coatings, and DLC variants with improved temperature stability are appearing. The framework's edge-preparation factor will need to track these coating advances.

**Standard evolution.** ISO 513 is updated periodically to incorporate new carbide grades and application categories. Material standards (ASTM A681, ISO 4957) are stable but do see revisions. The framework's standards reference should be reviewed against the latest revisions every 2–3 years.

The framework itself remains the constant. The five factors are stable across decades of industrial blade practice. The materials, coatings, and applications within each factor evolve; the structure does not.

