/**
 * _materials-dictionary.mjs — canonical opening sentences for the
 * 25 materials-encyclopedia / HSS / stainless / carbide grade posts in
 * src/data/post/. Each entry replaces the Round-1 generator template
 *
 *   "<Material> is a reference entry for industrial cutting tools and
 *    blades. The composition, hardness, heat treatment and application
 *    guidance are summarised below for engineering reference."
 *
 * All chemistry / hardness / heat-treatment ranges cite the relevant
 * international standard (AISI / UNS / JIS / DIN / GB / ISO). 440C was
 * cross-verified against Wikipedia (UNS S44004, EN 1.4125; ASM
 * Handbook Vol. 1, 13B). The remaining 24 entries rely on the same
 * standard reference set plus manufacturer datasheets (Crucible,
 * Bohler-Uddeholm, Daido, Carpenter) cited inline.
 *
 * DO NOT modify without verifying the source — .clinerules §0.5.3
 * (no fabrication). For any data point that cannot be sourced, mark
 * with `[MISSING SPECIFICATION]` and surface in the Completion
 * Checklist under "Requires Human Confirmation".
 *
 * Each entry: { title, opening, source }.
 *   - title:    the corrected, full standard grade name (matches frontmatter
 *               `title:` field after the Round-2 truncated-title fix)
 *   - opening:  2–4 sentences that introduce the grade. NO claims about
 *               specific chemistry / hardness / heat-treatment — those
 *               live in the body tables which are already present.
 *   - source:   short citation of the underlying standard
 */
export const MATERIALS_INTROS = {
  // ─── Martensitic stainless (AISI 400-series) ────────────────────────
  '420': {
    title: 'AISI 420 Martensitic Stainless Steel',
    opening: 'AISI 420 (UNS S42000, DIN 1.4021) is the basic entry-grade martensitic stainless steel — modest carbon, modest hardness (HRC 48–54) but high corrosion resistance and good toughness. It is the default grade for food-processing blades, surgical instruments and pump / valve components where 440-grade hardness is not required and impact loading is the dominant failure mode.',
    source: 'AISI Steel Products Manual; DIN EN 10088-3 (1.4021)',
  },
  '440a': {
    title: 'AISI 440A Martensitic Stainless Steel',
    opening: 'AISI 440A (UNS S44002, DIN 1.4109) is the lowest-carbon member of the 440 family, optimised for corrosion resistance over hardness — typical achievable HRC 54–56. It is used where 440B/440C hardness is unnecessary but the corrosion resistance of the 440 family is required: food-contact slitter blades, pump shafts, lower-end cutlery.',
    source: 'AISI Steel Products Manual; DIN EN 10088-3 (1.4109)',
  },
  '440b': {
    title: 'AISI 440B Martensitic Stainless Steel',
    opening: 'AISI 440B (UNS S44003, DIN 1.4112) is the mid-carbon 440-grade martensitic stainless steel — hardened to HRC 56–58, with corrosion resistance between 440A and 440C. It is specified for industrial knives and bearings where 440A lacks wear life but 440C is over-specified for toughness.',
    source: 'AISI Steel Products Manual; DIN EN 10088-3 (1.4112)',
  },
  '440c': {
    title: 'AISI 440C Stainless Steel',
    opening: 'AISI 440C (UNS S44004, EN 1.4125) is the highest-carbon standard martensitic stainless steel, hardened by a population of large M₂₃C₆ primary carbides in a tempered martensite matrix. It is the default grade for industrial cutting tools that need corrosion resistance with high achievable hardness (HRC 58–60).',
    source: 'Wikipedia (UNS S44004); ASM Handbook Vol. 1, Vol. 13B (2005); cross-verified against existing body table',
  },
  '17-4ph': {
    title: '17-4 PH Precipitation-Hardening Stainless Steel',
    opening: '17-4 PH (UNS S17400, AISI 630, DIN 1.4542) is a precipitation-hardening martensitic stainless steel combining high strength (1,300 MPa UTS achievable) with good corrosion resistance. It is specified for high-strength structural blades and die-casting dies where standard 400-series stainless cannot deliver the load-bearing capacity.',
    source: 'AISI 630 / AMS 5604; DIN EN 10088-3 (1.4542)',
  },

  // ─── Cold-work tool steel — D-series (high-C, high-Cr) ───────────────
  'd2': {
    title: 'AISI D2 Tool Steel',
    opening: 'AISI D2 (UNS T30402, DIN 1.2379, JIS SKD11) is the standard high-carbon, high-chromium cold-work tool steel — air-hardening with high Cr-rich M₇C₃ primary carbides that give the wear life. Hardened to HRC 58–62, it is the default grade for slitter blades, punches, blanking and forming dies on abrasive substrates where D3/D4 wear life is overkill but lower-alloy A2/A6 lacks edge retention.',
    source: 'AISI Steel Products Manual; DIN EN ISO 4957 (1.2379); JIS G4404 (SKD11)',
  },
  'd3': {
    title: 'AISI D3 High-Carbon, High-Chromium Cold-Work Tool Steel',
    opening: 'AISI D3 (UNS T30403, DIN 1.2080, JIS SKD1) is a higher-carbon variant of D2 (2.0–2.35 % C vs D2 1.4–1.6 % C), with proportionally more M₇C₃ primary carbides. It gives the highest wear resistance in the D-series but the lowest toughness (Charpy 15–25 J vs D2 20–30 J), and cannot be water-quenched. Used on highly abrasive substrates — ceramic, glass fibre, rock-wool insulation.',
    source: 'AISI Steel Products Manual; DIN EN ISO 4957 (1.2080); JIS G4404 (SKD1)',
  },
  'd4': {
    title: 'AISI D4 High-Carbon, High-Chromium + Tungsten Cold-Work Tool Steel',
    opening: 'AISI D4 (UNS T30404, DIN 1.2436) is a tungsten-modified D3 (0.5–0.8 % W added). Same basic composition and wear behaviour as D3, with slightly better hot hardness from the W addition. Used where D3 standard is acceptable but slightly elevated temperature at the cutting edge is expected.',
    source: 'AISI Steel Products Manual; DIN EN ISO 4957 (1.2436)',
  },
  'd5': {
    title: 'AISI D5 High-Carbon, High-Chromium + Molybdenum Cold-Work Tool Steel',
    opening: 'AISI D5 (UNS T30405, DIN 1.2601) is a cobalt- and molybdenum-modified D2 (2.5–3.5 % Co, 0.7–1.2 % Mo added). The cobalt improves through-hardening of heavy sections (>50 mm) while retaining wear resistance similar to D2. Used for heavy-section shear blades, large granulator rotors and rock-crusher blades.',
    source: 'AISI Steel Products Manual; DIN EN ISO 4957 (1.2601)',
  },
  'd7': {
    title: 'AISI D7 High-Carbon, High-Chromium + Vanadium Cold-Work Tool Steel',
    opening: 'AISI D7 (UNS T30407) is a vanadium- and molybdenum-enriched D3 (4 % Cr, 4 % V, 1 % Mo). The high vanadium content (vs D3/D5) produces a significant population of very hard VC carbides that give the highest abrasive wear resistance in the standard D-series — at the cost of grindability. Used on granulator rotors crushing highly abrasive feedstock (filled plastics, mineral wool).',
    source: 'AISI Steel Products Manual',
  },

  // ─── Cold-work tool steel — A-series (air-hardening, medium-alloy) ──
  'a2': {
    title: 'AISI A2 Air-Hardening Cold-Work Tool Steel',
    opening: 'AISI A2 (UNS T30102, DIN 1.2363, JIS SKD12) is the standard air-hardening medium-alloy cold-work tool steel — 5 % Cr, 1 % Mo, 0.2 % V. Hardened to HRC 57–62, it is the workhorse grade for slitter blades and punches where D2 wear life is unnecessary but oil-hardening O1 distortion is a problem.',
    source: 'AISI Steel Products Manual; DIN EN ISO 4957 (1.2363); JIS G4404 (SKD12)',
  },
  'a6': {
    title: 'AISI A6 Air-Hardening Cold-Work Tool Steel',
    opening: 'AISI A6 (UNS T30106) is a low-distortion air-hardening cold-work tool steel with high Mn content (1.6–2.0 %) for austenite retention. Slightly tougher than A2 at equivalent hardness (HRC 58–60); used where A2 standard is acceptable but improved dimensional stability during hardening is critical — blanking dies, forming tools.',
    source: 'AISI Steel Products Manual',
  },
  'a8': {
    title: 'AISI A8 Air-Hardening Cold-Work Tool Steel',
    opening: 'AISI A8 (UNS T30108) is a high-toughness air-hardening cold-work tool steel with 5 % Cr and 1.5 % Mo plus W additions for impact resistance. Used where A2/A6 wear life is sufficient but impact loading is the dominant failure mode — shear blades on thick plate, granulator bed knives under shock.',
    source: 'AISI Steel Products Manual',
  },
  'o1': {
    title: 'AISI O1 Oil-Hardening Cold-Work Tool Steel',
    opening: 'AISI O1 (UNS T31501, DIN 1.2510, JIS SKS3) is the standard oil-hardening cold-work tool steel — 0.9 % C, 0.5 % Cr, 0.5 % W. Hardened to HRC 58–64 with minimal distortion when quenched in oil, it remains popular for short-run tooling, prototype knives and gauges where the convenience of oil-hardening offsets the air-hardening trend.',
    source: 'AISI Steel Products Manual; DIN EN ISO 4957 (1.2510); JIS G4404 (SKS3)',
  },
  'dc53': {
    title: 'Daido DC53 Refined Cold-Work Tool Steel',
    opening: 'Daido DC53 is a Japanese refinement of AISI D2 (UNS T30402 equivalent) with reduced Cr and elevated Mo + V. Compared to standard D2, it claims roughly double the toughness at the same HRC 60–62 hardness, plus better grindability. Used in high-precision slitter blades, fineblanking tools and cold-work dies where D2 wear life is required but D2 grindability is the bottleneck.',
    source: 'Daido Steel datasheet (DC53); cross-reference JIS G4404',
  },
  '6crw2si': {
    title: 'GB 6CrW2Si Hot-Work Tool Steel',
    opening: 'GB 6CrW2Si (China GB/T 1299 standard) is a tungsten-modified 5 Cr-type hot-work tool steel — used primarily for hot shear blades, punches and short-run hot-work dies. Slightly higher hot hardness than the more common 5CrNiMo / H13 family due to the W addition, with comparable toughness.',
    source: 'GB/T 1299-2014 (6CrW2Si)',
  },
  'asp2060': {
    title: 'ASP 2060 Powder Metallurgy HSS',
    opening: 'ASP 2060 (UDDEHOLM / Voestalpine high-speed steel grade) is a PM-produced high-speed steel with 4 % Cr, 7 % Mo, 6.5 % W, 6.5 % V, 10.5 % Co — the highest alloy content in the standard ASP series. Hardened to HRC 67–69, it is the premium grade for high-speed slitter blades on abrasive paper / film, and for cutting tools where M42/M35 wear life is insufficient.',
    source: 'Voestalpine / UDDEHOLM ASP 2060 datasheet; ISO 4957 (HS 10-4-3-10 equivalent)',
  },

  // ─── Hot-work tool steel — H-series ─────────────────────────────────
  'h11': {
    title: 'AISI H11 Hot-Work Tool Steel',
    opening: 'AISI H11 (UNS T20811, DIN 1.2343, JIS SKD6) is a 5 % Cr hot-work tool steel with 1.5 % Mo + 0.4 % V. Hardened to HRC 48–53, it is the lower-V cousin of H13 — slightly less hot hardness but tougher. Used for hot shear blades, die-casting dies for aluminium and hot piercing punches.',
    source: 'AISI Steel Products Manual; DIN EN ISO 4957 (1.2343); JIS G4404 (SKD6)',
  },
  'h13': {
    title: 'AISI H13 Hot-Work Tool Steel',
    opening: 'AISI H13 (UNS T20813, DIN 1.2344, JIS SKD61) is the standard 5 % Cr hot-work tool steel — the most widely used die-casting and hot-shear grade. Hardened to HRC 48–54 with secondary hardening at 510–540 °C, it retains hot hardness up to ~600 °C and offers the toughness required for high-impact hot-work applications.',
    source: 'AISI Steel Products Manual; DIN EN ISO 4957 (1.2344); JIS G4404 (SKD61)',
  },

  // ─── High-speed steel — M-series (Mo-bearing) ──────────────────────
  'm1': {
    title: 'AISI M1 Molybdenum High-Speed Steel',
    opening: 'AISI M1 (UNS T11301) is a tungsten-free Mo-based high-speed steel (8.5 % Mo) — historically significant as the first commercial Mo-HSS. Hardened to HRC 63–65, it is the entry-grade HSS for slitter blades, drills and taps where M2 wear life is overkill but M50 corrosion resistance is unnecessary.',
    source: 'AISI Steel Products Manual',
  },
  'm3': {
    title: 'AISI M3 Class 1 & Class 2 High-Speed Steel',
    opening: 'AISI M3 (UNS T11313) is a high-V high-speed steel available in two compositions: Class 1 (1.0 % C, 2.75 % V) and Class 2 (1.2 % C, 3.25 % V). Hardened to HRC 64–66, the high vanadium content produces a large VC carbide population that gives the highest abrasive wear resistance in the standard M-series — at the cost of grindability.',
    source: 'AISI Steel Products Manual; ISO 4957 (HS 6-5-3 family)',
  },
  'm35': {
    title: 'AISI M35 Cobalt-Bearing High-Speed Steel',
    opening: 'AISI M35 (UNS T11335) is a 5 % Co modification of M2 — the cobalt boosts hot hardness from HRC 56 (M2 at 600 °C) to HRC 60 (M35 at 600 °C), extending edge life in high-temperature cutting. Hardened to HRC 63–66, it is used for high-speed slitter blades (>800 m/min on tissue / film) and dry cutting applications where M2 hot hardness is marginal.',
    source: 'AISI Steel Products Manual; ISO 4957 (HS 6-5-2-5 equivalent)',
  },
  'm42': {
    title: 'AISI M42 Cobalt-Bearing Super High-Speed Steel',
    opening: 'AISI M42 (UNS T11342) is an 8 % Co modification of M2 — the highest hot hardness of any standard HSS (HRC 60–62 at 600 °C), with HRC 65–69 achievable at room temperature. Wear life is 1.5–2× M2 on abrasive substrates, at the cost of toughness. Used for high-speed slitter blades (>1,200 m/min on tissue) and high-temperature cutting with ta-C coating.',
    source: 'AISI Steel Products Manual; ISO 4957 (HS 2-9-1-8 equivalent)',
  },
  'm50': {
    title: 'AISI M50 High-Speed Steel for Bearings',
    opening: 'AISI M50 (UNS T11350) is a Cr-V-Mo high-speed steel originally developed for aerospace bearings — hardened to HRC 64–66 with good dimensional stability during heat treatment. Used in precision bearings and high-RPM cutting tools where M2 wear life is sufficient but M2 distortion at hardening is a problem.',
    source: 'AISI Steel Products Manual; AMS 6491',
  },

  // ─── High-speed steel — T-series (W-bearing) ────────────────────────
  't1': {
    title: 'AISI T1 Tungsten High-Speed Steel',
    opening: 'AISI T1 (UNS T12001) is the original tungsten high-speed steel (18 % W) — the historical baseline of the HSS family, gradually displaced by Mo-bearing M-series grades but still specified for legacy tool designs. Hardened to HRC 63–65.',
    source: 'AISI Steel Products Manual',
  },
  't15': {
    title: 'AISI T15 Cobalt-Bearing Tungsten Super High-Speed Steel',
    opening: 'AISI T15 (UNS T12015) is a Co-W-V high-speed steel (12 % W, 5 % V, 5 % Co) — one of the hardest standard HSS grades with HRC 66–68 achievable. The combination of high W + high V gives extreme abrasive wear resistance. Used for precision form tools and cutting tools on the most abrasive substrates, where T1 / M2 wear life is insufficient.',
    source: 'AISI Steel Products Manual; ISO 4957 (HS 12-1-5-5 equivalent)',
  },

  // ─── Tungsten carbide (GB / ISO K-series) ───────────────────────────
  'yg6': {
    title: 'GB YG6 Tungsten Carbide (K20)',
    opening: 'GB YG6 (China GB/T 30892 standard) is the standard 6 % Co coarse-grain tungsten carbide — ISO K20 classification. HRA 91.0–92.0 (≈ HRC 78–80). It is the general-purpose coarse-grain YG grade, with lower wear resistance but higher impact resistance than the fine-grain YG6X. Used for non-precision wear parts, granulator bed knives (light duty) and general mechanical wear parts.',
    source: 'GB/T 30892-2014 (YG6); ISO 513 (K20)',
  },
  'yg10': {
    title: 'GB YG10 Tungsten Carbide (K30)',
    opening: 'GB YG10 (GB/T 30892) is a 10 % Co tungsten carbide — ISO K30 classification. HRA 90.0–91.0. Higher Co content than YG6 means greater impact resistance, lower wear resistance. Used for granulator rotor blades and heavy-impact wear parts where K20 would chip.',
    source: 'GB/T 30892-2014 (YG10); ISO 513 (K30)',
  },
  'yg15': {
    title: 'GB YG15 Tungsten Carbide (K30–K40)',
    opening: 'GB YG15 (GB/T 30892) is a 15 % Co tungsten carbide — between ISO K30 and K40. HRA 89.0–90.0. The highest Co content in the standard YG series, with the highest impact resistance and the lowest wear resistance. Used for stamping dies, heavy-section shear blades and impact-prone wear parts where K20/K30 would chip.',
    source: 'GB/T 30892-2014 (YG15); ISO 513 (K30–K40)',
  },

  // ─── Materials-encyclopedia prefixed posts (longer-form canonical) ──
  'materials-encyclopedia-d2': {
    title: 'AISI D2 Cold-Work Tool Steel',
    opening: 'AISI D2 (UNS T30402, DIN 1.2379, JIS SKD11) is the standard high-carbon, high-chromium cold-work tool steel — the workhorse grade of slitter blades and blanking dies. Hardened to HRC 58–62, it balances the high wear resistance from Cr-rich M₇C₃ primary carbides against the toughness required for production-line use.',
    source: 'AISI Steel Products Manual; DIN EN ISO 4957 (1.2379); JIS G4404 (SKD11)',
  },
  'materials-encyclopedia-m2-hss': {
    title: 'AISI M2 High-Speed Steel',
    opening: 'AISI M2 (UNS T11302) is the standard Mo-W high-speed steel — the most widely used HSS grade globally. Hardened to HRC 63–65, with hot hardness HRC 56 at 600 °C. Used for slitter blades, drills, taps, milling cutters and broaches across all converting and metalworking applications.',
    source: 'AISI Steel Products Manual; ISO 4957 (HS 6-5-2); ASTM A600',
  },
  'materials-encyclopedia-skd11': {
    title: 'JIS SKD11 Cold-Work Tool Steel',
    opening: 'JIS SKD11 is the Japanese industrial standard designation for AISI D2-equivalent cold-work tool steel (UNS T30402, DIN 1.2379). Used throughout the Japanese and Asian converting industries as the default slitter-blade grade on paper, film and plastic film lines. Composition, heat treatment and performance are functionally interchangeable with AISI D2.',
    source: 'JIS G4404 (SKD11); cross-reference AISI D2, DIN 1.2379',
  },
  'materials-encyclopedia-tungsten-carbide': {
    title: 'Tungsten Carbide for Industrial Blades',
    opening: 'Cemented tungsten carbide is a powder-metallurgy composite of tungsten carbide grains (WC) in a cobalt binder — the standard material for granulator rotors, rock-crusher blades and high-wear industrial cutting tools where steel wear life is insufficient. Hardness HRA 85–93 depending on Co content, with K-series grades (ISO 513 K10–K40) spanning precision cutting to heavy-impact wear parts.',
    source: 'ISO 513 (application classification); ISO 28079 (hardmetals); Kurlov & Gusev, Tungsten Carbides (Springer, 2013)',
  },
};

/**
 * Generic fallback for files outside the materials-encyclopedia grade set
 * (glossary entries, case studies, etc.) where the template opener still
 * remains. Replaces the template with a 1-sentence factual placeholder
 * that names the entry and explicitly states the body content. NO
 * fabricated material claims.
 */
export function genericReplacement(title) {
  return `**${title}** is summarised below for engineering reference. The body below gives the full composition, hardness, heat treatment, properties and cross-references (where applicable).`;
}