// src/data/_product-faqs.ts
// ─────────────────────────────────────────────────────────────────────────────
// Per-product FAQ source for Schema.org FAQPage + visible accordion.
// Facts are derived from src/data/facts/<node-id>.yaml — no fabricated data.
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductFaq {
  q: string;
  a: string;
}

/**
 * Keyed by product entry id (filename without extension).
 * Add a new array when a new product is onboarded to the GEO closed loop.
 */
export const PRODUCT_FAQS: ReadonlyMap<string, ReadonlyArray<ProductFaq>> = new Map([
  [
    'bed-knife-tissue',
    [
      {
        q: 'Why does a sharp D2 edge chip on a 1200 m/min tissue line?',
        a: 'At 1200 m/min on 4-ply tissue, edge temperature reaches approximately 180 °C. A sharp edge (micro-hone under 5 μm) is susceptible to thermal-fatigue micro-cracking at this temperature. The failure mode is sub-millimetre edge chipping, followed by accelerated burr formation.',
      },
      {
        q: 'Does changing the steel grade fix edge-chipping on tissue converting lines?',
        a: 'No. The 1200 m/min case study on 4-ply tissue showed that 15 μm micro-hone plus 18° clearance angle, with D2 at HRC 60 unchanged, extended service life from 11 to 34 days. The steel grade was not the variable — edge preparation was.',
      },
      {
        q: 'What clearance angle should a tissue bed knife have?',
        a: 'For high web speed (1200 m/min) on tissue, 18° is the documented working clearance angle in our case data. A conventional 22° clearance on a sharp edge chatters and chips; 18° on a 15 μm hone runs clean.',
      },
      {
        q: 'What hardness should a D2 tissue bed knife be?',
        a: 'HRC 60, which sits within the D2 typical as-tempered band of HRC 58-62. Hardness above this range risks chipping on a thin blade; hardness below this range risks accelerated wear.',
      },
      {
        q: 'How is the heat-treatment batch linked to the finished blade?',
        a: 'ISO 9001:2015 §8.5.2 requires identification of outputs throughout production. Each finished blade\'s dimensional and edge-prep inspection record references back to the material heat number, the mill certificate, and the heat-treatment batch record.',
      },
      {
        q: 'Can burr height be controlled below 50 µm on tissue?',
        a: 'Yes. Less than or equal to 50 µm is the burr control target on tissue slitting, achieved by the 18° clearance angle and 15 μm micro-hone combination. Exceeding this threshold indicates either edge wear (replace) or geometry drift (regrind or scrap).',
      },
    ],
  ],
]);

export function getProductFaqs(id: string): ReadonlyArray<ProductFaq> {
  return PRODUCT_FAQS.get(id) ?? [];
}