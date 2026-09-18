// append-mt-prev.cjs — append weekly, monthly, quarterly sections
const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/data/post/maintenance-preventive-schedule.md');
const content = `

### Weekly (maintenance technician, 30 minutes)

- **Edge geometry measurement.** Hone radius with a measuring microscope or a comparator gauge. Within ± 2 µm of spec?
- **Knife dimensional check.** OD, ID, thickness, runout. Within 0.02 mm of drawing?
- **Hardness file test.** 5 points on the knife. All within ± 1 HRC of the target?
- **Coolant analysis.** Concentration, pH, contamination. Within spec?
- **Burr measurement.** Quantitative, with a microscope or comparator, on a sample piece. Trending up vs last week?
- **Re-grind decision.** If hone is +2 µm above spec, or burr has trended +20 % over 2 weeks, schedule a re-grind.

### Monthly (line engineer, 2 hours)

- **Re-grind cycle analysis.** Knife life vs target. Reject rate. Re-grind cost per metre cut. Trend over the last 3 months.
- **Knife inventory audit.** Count of new vs re-ground vs retired knives. Projected re-grind spend for the next 3 months.
- **Line-side conditions.** Tension, alignment, web temperature, draw. Within OEM spec?
- **Coolant system.** Filter change, tank clean, concentration adjustment, top-up.
- **Knife storage audit.** Knives stored in foam-lined cases, oil applied, slot dividers in place?
- **Audit findings.** Write up. Open work orders for the next month.

### Quarterly (engineering manager, half-day)

- **Hardness audit.** 1 random knife from the re-grind rotation. Full metallurgical check — 5-point hardness, surface hardness, microstructure, decarburisation check.
- **Heat-treat supplier audit.** Mill certificate review, tempering chart review, re-audit if the reject rate has trended up.
- **Re-grind supplier audit.** Re-grind cost, reject rate, on-time delivery. Site visit if the supplier is the long-term partner.
- **Knife grade review.** Has the substrate mix changed? Has a re-grind cycle shortened, suggesting a substrate drift? Should the grade be re-evaluated?
- **Cost review.** Re-grind cost per metre cut, line availability, scrap rate. Set the next quarter's targets.
- **Audit findings.** Write up. Long-term improvement plan for the next quarter.

---

## The inspection form (template)

The form should live at the machine, in a plastic sleeve, with a pencil. Every shift the operator fills in:

\`\`\`
[Knife ID]  [Date]  [Shift]  [Operator initials]
1. Edge visual:  OK / chip / roll / gall / BUE
2. Burr (µm):  ____  (target: ____)
3. Cut surface:  OK / tear / wrinkle / roughness
4. Coolant:  OK / low / no flow
5. Action:  None / re-grind / replace
[Supervisor signature]
\`\`\`

The weekly form is more detailed, the monthly more so, the quarterly includes the metallurgical data. The forms are also entered into a spreadsheet or CMMS for trending. The operator's form is the trigger for the weekly and monthly reviews.

---

## The knife tracking sheet (template)

Each knife has a tracking sheet, kept with the knife in its storage case:

\`\`\`
[Knife ID]  [Drawing]  [Initial OD]  [Initial thickness]
Re-grind | Date | OD after | Thickness after | Hardness | Hone | Operator
1        |      |          |                |          |      |
2        |      |          |                |          |      |
...
[Retire at OD < ____ or thickness < ____]
\`\`\`

A retired knife is segregated, marked with a red tag, and either re-purposed (scrap chopper, anvil backup) or scrapped. A retired knife is never sent back to the line by accident.

---

## Line-side conditions that must be held

These are the conditions on the line itself that drive knife life. The PM schedule must measure and hold them:

- **Web tension.** 30–80 N/m for paper, 50–150 N/m for film. A 20 % deviation changes knife life by 20–30 %.
- **Knife-to-anvil parallel.** 0.01 mm. A 0.05 mm deviation causes one-side wear.
- **Knife runout.** 0.02 mm. A 0.05 mm deviation causes vibration and chipping.
- **Coolant pressure at nozzle.** 5–10 bar. A drop to 2 bar = no cooling.
- **Coolant concentration.** 5–8 % emulsion. A drop to 2 % = no lubrication.
- **Line speed.** Within the knife's rated window. A 20 % overspeed = thermal damage.
- **Substrate batch.** Logged at every change. A new batch that is +5 % in caliper or surface roughness will halve knife life.

A PM schedule that ignores these and only checks the knife is half a schedule. The line is the second variable in the maintenance story.
`;
fs.appendFileSync(target, content, 'utf8');
console.log('Appended: ' + Buffer.byteLength(content, 'utf8') + ' bytes');
