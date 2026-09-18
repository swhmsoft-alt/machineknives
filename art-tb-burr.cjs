module.exports = {
  slug: 'troubleshooting-burr-growth',
  category: 'troubleshooting',
  title: 'Burr Growth Diagnosis: Why Your Slitter Knife Is Producing Increasing Burr',
  excerpt: 'A slitter knife that produces growing burr is almost always one of four things: hone growth from wear, substrate variation, line condition drift, or heat-treat quality. This article walks through the 10-minute diagnostic and the corrective action for each root cause.',
  tags: ['burr growth', 'slitter troubleshooting', 'blade wear', 'hone growth', 'substrate variation'],
  body: `A slitter knife that produces growing burr is almost always one of four things: hone growth from wear, substrate variation, line condition drift, or heat-treat quality. This article walks through the 10-minute diagnostic and the corrective action for each root cause.

> **One-line summary:** *Burr growth is usually hone growth. Measure the hone weekly; when it has grown 2 µm above spec, re-grind. If hone is in spec, check substrate and line conditions.*

---

## The 10-minute diagnostic

### Step 1: measure the hone (2 minutes)

Take the worn knife and measure the hone radius with a calibrated measuring microscope or comparator gauge at 5 points around the edge. Compare to the spec value.

- Hone has grown 2 µm above spec: scheduled re-grind triggered. The burr will return to baseline after re-grind.
- Hone is in spec: continue to step 2.

### Step 2: check the substrate (2 minutes)

Pull the most recent substrate batch records and compare to the previous batch.

- Caliper changed by +5 % or more: the substrate is harder or thicker. Expect more burr.
- Surface finish changed: the surface drag has changed. Expect more burr.
- New supplier, new grade, or new coating: schedule a re-grind.
- Substrate is in spec: continue to step 3.

### Step 3: check the line conditions (2 minutes)

Audit the line for variables that affect burr:

- Web tension. 30–80 N/m for paper, 50–150 N/m for film. A 20 % deviation changes burr by 20–30 %.
- Knife-to-anvil parallel. 0.01 mm. A 0.05 mm deviation causes one-side wear.
- Knife runout. 0.02 mm. A 0.05 mm deviation causes vibration.
- Coolant pressure at nozzle. 5+ bar. A drop to 2 bar = no cooling.
- Coolant concentration. 5–8 % emulsion. A drop to 2 % = no lubrication.
- Line speed. Within the knife's rated window.

If any line condition is out of spec, fix it. The burr should return to baseline within one shift.

### Step 4: check heat-treat quality (2 minutes)

If steps 1–3 all pass, run a 5-point hardness file test.

- All 5 points within ± 1 HRC: heat-treat is OK.
- Edge points 2+ HRC soft: decarburisation. Replace the knife.
- All 5 points below target: over-tempering. Replace and audit supplier.

### Step 5: check the re-grind SOP (2 minutes)

If the burr grew after a recent re-grind, the re-grind may have left the hone wrong.

- Hone not restored: re-grind shop error. Re-grind again.
- Hone restored but burr still high: re-grind is OK.
- New chip on the edge: a wire edge or grind crack. Re-grind with finer infeed and spark-out.

---

## The four root causes, ranked by frequency

### 1. Hone growth from wear (60 %)

As the knife wears, the hone grows. The cut transitions from shearing to pushing, and burr grows. Normal wear; fix is scheduled re-grind at the right interval.

**Fix:** Weekly hone measurement; scheduled re-grind when hone is 2 µm above spec.

### 2. Substrate variation (15 %)

A new batch with +5 % caliper or changed surface finish will increase burr.

**Fix:** Audit incoming substrate; work with the supplier to keep within spec.

### 3. Line condition drift (15 %)

A line that drifts out of adjustment produces burr.

**Fix:** Weekly line condition audit; restore to spec.

### 4. Heat-treat quality (10 %)

A decarburised or over-tempered knife wears faster and produces more burr. The 5-point file test catches it.

**Fix:** Replace the knife; audit the heat-treat supplier.

---

## Field cases

**Case 1: paper slitter, 600 m/min.** Burr grew from 30 µm to 50 µm over 3 weeks. Hone: 18 µm (spec 10 µm). Fix: scheduled re-grind; hone restored; burr back to 30 µm.

**Case 2: film slitter, 800 m/min.** Burr grew suddenly after a substrate batch change. Hone: in spec. Fix: worked with supplier; caliper was 12 % over; returned to spec; burr back to baseline.

**Case 3: paper slitter.** Burr grew over 2 weeks. Hone: in spec. Line: in spec. Heat-treat: edge points 2 HRC soft. Fix: replaced knife; audited supplier; switched to vacuum heat-treat.

---

## The 5-step diagnostic at a glance

| Step | Check | Tool | Time |
|---|---|---|---|
| 1 | Hone radius | Measuring microscope | 2 min |
| 2 | Substrate | Batch records, caliper | 2 min |
| 3 | Line conditions | Tension gauge, dial indicator, pressure gauge | 2 min |
| 4 | Hardness | File test (5 points) | 2 min |
| 5 | Re-grind SOP | Visual, microscope | 2 min |

Five checks, 10 minutes, one of the four root causes lands.

---

## When the diagnostic does not land

If steps 1–5 all pass, the answer is one of:

- **Substrate batch variation outside the spec window.** Send a sample to the lab.
- **Knife design.** A knife that is too thin or has too aggressive a rake.
- **Coating wear.** A worn PVD coating on a substrate that needed the coating.

For a written burr growth diagnosis, send the worn knife, the line log, and the substrate batch records to [engineering@kaipu-industrial.com](mailto:engineering@kaipu-industrial.com) or use the [request-a-quote form](/contact). Diagnosis within 24 hours.

For the broader troubleshooting framework, see [Why is my blade wearing out too fast?](/troubleshooting-premature-wear/) and [Burr (glossary entry)](/glossary/burr/).

**About the author**

*KAIPU Engineering is the technical team at KAIPU Industrial Blades, in operation since 1998. ISO 9001:2015 certified.*`
};
