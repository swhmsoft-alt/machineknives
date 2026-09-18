// append-tb-chip.cjs — append final part
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/troubleshooting-edge-chipping-paper-slitter.md');
const content = `

---

## The four root causes, ranked by frequency

### 1. Hone too sharp (40 % of cases)

A hone that is too small for the substrate is the single most common cause of edge chipping. A 0–2 µm hone on a 600 m/min paper line fails by micro-chipping within hours.

**Fix.** Specify the hone by substrate, not by feel. 5–10 µm for paper, 10–15 µm for tissue and non-woven, 5–10 µm for film. Bake the hone into the re-grind SOP.

### 2. Hardness too high (25 % of cases)

HRC 64 on a knife that the substrate allows HRC 60 will chip. Hardness is a wear-vs-toughness trade; a 2-point drop buys 20–30 % more chip resistance.

**Fix.** Drop the next knife to the substrate-appropriate hardness. 58–60 for most paper, 60–62 for tough substrates, 62–64 only for thin knives on clean substrates.

### 3. Heat-treat quality (20 % of cases)

A decarburised surface is soft. The substrate cracks the soft skin on impact. A 5-point hardness file test catches it. A metallographic check (cross-section, etch) confirms.

**Fix.** Replace the knife, audit the heat-treat supplier. The 5-point file test on receipt is mandatory for any critical knife.

### 4. Substrate contamination (10 % of cases)

A hard particle in the substrate (sand, metal fragment, agglomerate) hits the edge at line speed and chips it. The chips are on the front face, often clustered in one area where the contamination was concentrated.

**Fix.** Audit incoming substrate. The defect rate should be < 0.1 %; if higher, work with the supplier.

### 5. Line-side (5 % of cases)

Tension spike, parallel off, runout off, coolant drop, overspeed. These are the line-side variables that the PM schedule should catch before they cause chipping.

**Fix.** Follow the PM schedule. Most line-side issues are visible days before the chip.

---

## Field cases

**Case 1: Tissue slitter, 320 mm, 1,200 m/min, 18 gsm.** Customer was chipping a D2 knife within 4 days of re-grind. Hone was 0–2 µm. Spec called for 15 µm. We supplied a knife with the correct hone, and added a re-grind SOP that specified 15 µm. Service life went from 4 days to 32 days.

**Case 2: Paper slitter, 250 mm, 400 m/min, 80 gsm.** Customer was chipping a D2 knife within 14 days. 5-point hardness test showed edge at HRC 56, centre at HRC 60. Decarburisation. Replaced the knife, audited the heat-treat supplier, found an open-air furnace. Switched supplier, no more chipping from decarb.

**Case 3: Film slitter, 200 mm, 600 m/min.** Customer was chipping an M2 HSS knife within 7 days. Visual showed chips on the front face, clustered in one area. Audited the substrate: 0.8 % defect rate, hard particles. Worked with the film supplier to drop to 0.1 %. No more chipping.

---

## When the diagnostic does not land on a root cause

If the visual, dimensional, hardness, line-side and re-grind checks all pass, and the knife is still chipping, the answer is one of:

- **Substrate that does not match the assumed substrate.** A change in incoming material that was not logged. Send a sample to the lab.
- **Heat-treat that passed the file test but failed in service.** Request a metallographic check from the heat-treat supplier.
- **Knife design.** A knife that is too thin for the substrate, or has too aggressive a rake angle, will chip. Send the drawing to the supplier for review.

For a written chip diagnosis on a specific knife, send the chipped knife, the line log and the substrate batch records to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Diagnosis within 24 hours.

For the broader troubleshooting framework, see [Why is my blade wearing out too fast?](/troubleshooting-premature-wear/) and [Chipping (glossary entry)](/glossary/chipping/).

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified. Ships to converters, recyclers and OEMs across four continents.*
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
