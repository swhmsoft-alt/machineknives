/**
 * FAQ entries for /services. Rendered with native <details> elements
 * in the page template (satisfies faqHtmlPattern detector).
 */

export interface FaqItem {
  q: string;
  a: string;
  bullets?: string[];
}

export const faqs: FaqItem[] = [
  { q: 'What is the typical lead time for a custom blade?', a: 'For most custom orders we ship within 4–6 weeks after drawing approval. The breakdown:', bullets: ['Rough machining and forging: 1 week', 'Heat treatment and sub-zero: 1 week', 'CNC grinding and PVD: 1–2 weeks', 'Final QA, docs and packing: 3–5 days'] },
  { q: 'What is your minimum order quantity (MOQ)?', a: 'No hard MOQ for custom work:', bullets: ['Prototype: 1–10 pieces', 'Pilot run: 50–200 pieces', 'Serial production: 500+ with capacity lock'] },
  { q: 'Can you sign an NDA before we share drawings?', a: 'Yes — mutual NDAs before any technical exchange:', bullets: ['Mutual NDA template available', 'Drawings stored in restricted PDM', 'No reverse-engineering of customer designs for third parties'] },
  { q: 'Do you provide material certificates and PPAP?', a: 'Yes. Every batch ships with full traceability:', bullets: ['Mill certificate (EN 10204 3.1) with heat number', 'Hardness mapping + dimensional CMM report', 'PPAP level 3 / ISIR on request for automotive'] },
  { q: 'Which steel grades do you typically work with?', a: 'Full range of tool and high-speed steels per ASTM A681:', bullets: ['D2 / 1.2379 — cold-work tool steel', 'M2 / 1.3343 — high-speed steel', 'SKD11 / DC53 — Japanese equivalents', 'Carbide YG8 / YG15 for wear edges'] },
  { q: 'What are the standard payment terms?', a: 'New customers: T/T 30 % deposit, 70 % against shipping docs:', bullets: ['New customer: 30 / 70 T/T', 'Returning: net-30 after third order', 'Frame agreement with quarterly settlement on request'] },
  { q: 'What shipping terms do you offer?', a: 'Ex-works, FOB and CIF all available:', bullets: ['Ex-works Shanghai / Ningbo', 'FOB Shanghai / Ningbo', 'CIF to Hamburg, Long Beach, Santos, Dubai'] },
  { q: 'Can you measure and re-engineer a worn blade?', a: 'Yes — one of our most common reverse-engineering workflows:', bullets: ['Receive worn blade + failure description', '3D scan and edge-profile measurement', 'Improved geometry proposal within 5 business days'] },
];
