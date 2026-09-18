// append-cs-gran-b.cjs — final
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/case-study-granulator-rotor-automotive.md');
const content = `

---

## Lessons learned

1. **ASR is a carbide substrate, not a tool-steel substrate.** Glass fibre + metal fragments + abrasive fillers will burn through D2 in days. YG15 is the only sensible answer.
2. **Rotor and bed do not have to be the same material.** A tougher rotor (YG15) + a wear-resistant bed (YG10X) is a better combination than both at the same grade.
3. **Torque discipline is non-negotiable on carbide.** A loose carbide knife shatters. A torque wrench is the cheapest insurance.
4. **Rotation protocol matters.** A 4-edge reversible knife that is rotated "when it looks dull" is a 2.5-edge knife. A measured schedule doubles the effective life.
5. **Downstream effects matter.** The screen life improvement was a 40 % bonus that we did not predict. The new rotor geometry fed material through the screen more evenly.

---

## What this means for similar recyclers

The same pattern reproduces on most ASR, WEEE, and heavy-contamination recycling lines:

- ASR (mixed plastic + glass + metal): YG15 rotor + YG10X bed
- WEEE (mixed plastic + metal + glass fibre): YG15 rotor + YG10X bed
- Heavy-contamination film recycling: YG10X rotor + YG8 bed
- Clean film recycling: M2 HSS rotor + D2 bed (carbide is overkill)
- Glass-filled polymer (PA66 30 % GF): YG8 bed + M2 HSS rotor

The decision rule: **the rotor takes the impact, the bed takes the wear.** Match the materials to the dominant failure mode on each.

---

## Granulator knife selection in 60 seconds

If you have a granulator line and the knives are wearing too fast:

1. **Quantify the substrate.** Polymer family, filler content (glass, mineral), contamination profile (metal, sand, foreign polymer).
2. **Quantify the throughput.** kg/h, rotor speed, screen size.
3. **Identify the dominant failure mode.** Rotor chipping = impact, bed edge wear = abrasion, screen wear = knife geometry.
4. **Pick the rotor steel first.** YG15 for impact, YG10X for moderate impact, M2 HSS for clean cuts.
5. **Pick the bed steel second.** YG10X for wear, YG8 for moderate wear, D2 for clean cuts.
6. **Specify the geometry.** 0.20–0.30 mm chamfer on the rotor, 0.10–0.20 mm on the bed.
7. **Specify the bolting.** Torque wrench, calibrated, specific value.
8. **Specify the rotation.** Measured schedule, not visual.

For a written granulator audit on your line, send the substrate, the throughput, the rotor speed, the current knife spec and the current service life to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). A typical audit takes 1 day on site, returns a written diagnosis and a trial protocol, and ships the trial knives within 3 weeks. ROI is typically inside 6 months on lines with > €50k/year knife spend.

For the broader granulator selection guidance, see [How to choose a granulator knife](/selection-guide-granulator-knife/) and the granulator section in [The KAIPU 5-Factor Blade Selection Framework](/kaipu-5-factor-blade-selection-framework/).

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified. The team ships to converters, recyclers and OEMs across four continents, with active distribution in Germany, Poland, Italy, Turkey, India, Vietnam and Brazil, and a dedicated recycling-industry cell for ASR, WEEE and heavy-contamination applications.*
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
