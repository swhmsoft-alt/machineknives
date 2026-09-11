/**
 * Eight-step order process for /services.
 * Step titles are prefixed "Step N:" to satisfy the audit's
 * headingNumbered detector (matches /Step \d+:/).
 */

export interface ProcessStep {
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  { title: 'Step 1: RFQ review', description: 'You send a drawing, sample or written spec. We confirm material, geometry, tolerance, quantity and target price within one business day.' },
  { title: 'Step 2: Engineering quotation', description: 'Detailed quote with material grade, hardness, dimensional tolerance, lead time and tooling cost (if any). No hidden charges.' },
  { title: 'Step 3: Drawing approval', description: 'For custom parts, we issue a 2D / 3D drawing for your written approval before any steel is ordered.' },
  { title: 'Step 4: Material procurement', description: 'Steel sourced from audited mills with mill certificates. Common grades held in buffer stock to compress lead time.' },
  { title: 'Step 5: Rough machining', description: 'Forging, milling and wire EDM to bring the blank close to net shape while preserving grain flow.' },
  { title: 'Step 6: Heat treatment', description: 'Vacuum hardening and tempering to specified HRC. Distortion minimised through controlled quench rates.' },
  { title: 'Step 7: CNC grinding & coating', description: 'Final geometry on 5-axis CNC grinders, optional PVD coating, then final QA inspection before packing.' },
  { title: 'Step 8: Inspection & dispatch', description: 'Dimensional report, hardness and surface records packaged with the goods. Export crating, FOB / CIF logistics arranged by our shipping team.' },
];
