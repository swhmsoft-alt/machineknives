// append-tb-crack.cjs — append final sections
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/troubleshooting-shear-blade-cracking.md');
const content = `

---

## Field cases

**Case 1: 316 stainless plate shear, 5 mm, hydraulic guillotine, 30 strokes/min.** Customer was cracking an M2 HSS shear blade every 800 strokes. Visual: crack from the back face, 1 mm behind the edge. Chamfer was 0.05 mm, recommended for the substrate was 0.10 mm. Re-ground the chamfer to 0.10 mm, added a TiN coating. Service life: 18,000 strokes.

**Case 2: Mild steel plate shear, 12 mm, swing-beam, 20 strokes/min.** Customer was cracking an M2 HSS blade every 200 strokes. Visual: crack from the very tip. Hardness test: HRC 64, recommended for 12 mm is HRC 60. Dropped to HRC 60, kept M2. Service life: 22,000 strokes.

**Case 3: Hardox 450 plate shear, 8 mm.** Customer was cracking a D2 shear blade every 50 strokes. Visual: crack from impact, irregular. Plate was out of spec — actual hardness was HB 480, not the HB 450 of the spec. Worked with the plate supplier, switched to a carbide shear insert. Service life: 22,000 strokes.

**Case 4: Mild steel plate shear, 6 mm, 25 strokes/min.** Customer was cracking on one side only. Visual: crack on the right side of the upper blade, the side that hits the plate first. Blade gap was 0.10 mm on the left, 0.40 mm on the right (the right side was worn). Re-ground the upper blade to restore the parallel gap. Crack eliminated.

---

## Common false diagnoses

A few patterns show up over and over, and they are almost always wrong:

1. **"The steel is wrong."** Almost always the chamfer, the hardness, or the gap. Change one variable at a time.
2. **"The plate is harder than spec."** Sometimes, but check the chamfer first. A 0.05 mm chamfer on a 12 mm plate is the most common cause of cracking on plate shears.
3. **"We need a harder knife."** A harder knife on a 12 mm plate will crack faster, not slower. Drop the hardness, increase the chamfer.
4. **"The re-grind shop over-ground."** Possible, but the original chamfer may have been too small. The shop followed the drawing; the drawing was wrong.
5. **"The blade gap is set correctly."** Measure it. A 0.1 mm gap difference across the blade length is invisible to the eye.

---

## When the diagnostic does not land

If visual, chamfer, hardness, gap and plate checks all pass, and the knife is still cracking, the answer is one of:

- **Knife material defect.** An inclusion, a forging lap, a quench crack. Send the knife to a metallurgical lab.
- **Plate has inclusions or hard spots.** The plate itself has metallurgical defects. Send a plate sample to the lab.
- **Knife has been damaged in storage.** Drop, dent, or impact in the tool crib. Inspect every knife on receipt.
- **Shear frame is misaligned.** The upper or lower blade rail is bent. Check with a dial indicator across the full frame.

For a written diagnosis on a cracked shear blade, send the cracked blade, the line log, the plate batch records and the blade gap measurement to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Diagnosis within 24 hours, replacement blade within 3 weeks.

For the broader shear blade selection guidance, see [How to choose a shear blade for plate steel](/selection-guide-shear-blade-plate-steel/) and [Troubleshooting: why is my blade wearing out too fast?](/troubleshooting-premature-wear/).

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified. Ships to converters, recyclers and OEMs across four continents, with a dedicated shear-blade cell for hot-rolling-mill and service-centre customers.*
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
