// append-sg-gran-b.cjs — append final part
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/selection-guide-granulator-knife.md');
const content = `

---

## Common mistakes

1. **Bed knife harder than rotor knife.** A HRC 60 bed + HRC 56 rotor wears the rotor 2× faster than the bed. Match hardness or have the bed 0.5–1.0 HRC softer.
2. **Chamfer too small.** A 0.05 mm chamfer on a granulator knife is a chip in 200 hours. Match chamfer to material thickness.
3. **Re-grind without indexing.** A re-grind that does not restore the chamfer to the substrate-appropriate width is the most-common granulator-knife failure.
4. **Under-torqued bolts.** A loose rotor knife shifts under load, rubs, and chips. Use a torque wrench.
5. **No wear strips.** A worn cutting chamber lets the rotor knife contact the chamber wall, which is a chip. Replace wear strips at every other knife rotation.
6. **Carbide on the rotor without checking the bed.** A carbide rotor on a worn D2 bed will destroy the bed in days. Match the bed to the rotor, or upgrade both.

---

## Field cases

**Case 1: PE film recycling, 800 kg/h, rotor 400 mm × 4 blades.** Customer was getting 14 days from D2 rotor knives. We quoted M2 HSS, HRC 58, 4-edge reversible, 0.25 mm chamfer. Service life: 42 days. The M2's toughness absorbed the impact of film bundles; the reversible edges doubled the number of re-grinds per knife.

**Case 2: Glass-filled PA66 recycling, 30 % GF, 1,200 kg/h.** Customer was getting 5 days from D2 bed knives. We quoted YG8 bed + M2 HSS rotor. Bed life: 35 days, rotor life: 28 days. The YG8 bed wore slower; the M2 rotor survived the metal contamination.

**Case 3: Automotive shredder residue, mixed plastic + metal fragments, 2,000 kg/h.** Customer was chipping both bed and rotor in 2 days. We quoted YG15 rotor + YG10X bed. Rotor life: 18 days, bed life: 22 days. Carbide was the only answer for the heavy contamination.

---

## The spec to write

For a granulator knife:

> "Granulator [bed / rotor] knife, [L] × [W] × [T] mm, AISI M2 HSS (or YG8 / YG10X / YG15 for abrasive / contamination), vacuum heat-treated to HRC [58–60] ± 1, 5-point file test, edge chamfer [0.10–0.30] mm on cutting edge, [2-edge / 4-edge reversible]. Substrate: [polymer family / filler / contamination profile]. Rotor speed: [RPM]. Throughput: [kg/h]. Mill certificate required."

For the broader five-factor selection framework, see [The KAIPU 5-Factor Blade Selection Framework](/kaipu-5-factor-blade-selection-framework/). For a runnable steel grade cross-reference, see [Material Grade Converter](/material-grade-converter/). For a head-to-head on carbide grades, see [YG6X vs YG8](/yg6x-vs-yg8-carbide/).

For a written granulator-knife specification, send the part drawing, the polymer, the filler content, the contamination profile and the current service life to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Specification, FOB quote and lead time within one business day.

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified. Ships to converters, recyclers and OEMs across four continents.*
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
