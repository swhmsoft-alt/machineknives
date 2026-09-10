/**
 * Page-level static content for `/products/`. Kept out of the Markdown
 * content collection so it does not collide with the `glob` loader and
 * can be imported as a typed TypeScript module by the index page.
 *
 * Update PAGE_LAST_REVIEWED whenever the on-page content materially
 * changes so the freshness signal stays honest for both users and the
 * Trinity audit.
 */

export const PAGE_LAST_REVIEWED = '2026-09-01';

/** Quantitative headline metrics surfaced in the Stats block. */
export const OVERVIEW_STATS: ReadonlyArray<{ title: string; amount: string }> = [
  { title: 'Years manufacturing', amount: '25+' },
  { title: 'Standard SKUs', amount: '600+' },
  { title: 'Annual capacity (parts)', amount: '120K' },
  { title: 'Countries served', amount: '40+' },
];

/**
 * Material / hardness / standard matrix shown as a real `<table>` element
 * on the page. `realTableElement` is a Trinity audit signal, so this is
 * intentionally rendered as a native HTML table (not a flex grid).
 */
export const MATERIAL_MATRIX: ReadonlyArray<{
  material: string;
  designation: string;
  hardness: string;
  standards: string;
  typicalUse: string;
}> = [
  {
    material: 'D2',
    designation: 'AISI D2 / 1.2379 / SKD11',
    hardness: 'HRC 58–62',
    standards: 'AMS 6478 · ASTM A681 · ISO 4957',
    typicalUse:
      'Cold-work tool steel. Default grade for paper, film and foil slitting; balanced wear resistance and toughness.',
  },
  {
    material: 'M2 HSS',
    designation: 'AISI M2 / 1.3343 / SKH51',
    hardness: 'HRC 60–64',
    standards: 'ASTM A600 · ISO 4957',
    typicalUse: 'High-speed steel for hot edges and abrasive feedstock — granulator rotors, high-speed slitting.',
  },
  {
    material: 'SKD11',
    designation: 'JIS SKD11 / DC53',
    hardness: 'HRC 58–62',
    standards: 'JIS G4404 · ISO 4957',
    typicalUse: 'Refined cold-work steel. First choice for thin-gauge slitting below 1 mm — reduces chipping risk.',
  },
  {
    material: 'H13',
    designation: 'AISI H13 / 1.2344 / SKD61',
    hardness: 'HRC 50–54',
    standards: 'ASTM A681 · ISO 4957',
    typicalUse:
      'Hot-work tool steel. Used where shear heat builds up — high-speed guillotines and abrasive plate cutting.',
  },
  {
    material: '6CrW2Si',
    designation: 'Chinese GB 6CrW2Si',
    hardness: 'HRC 54–58',
    standards: 'GB/T 1299',
    typicalUse: 'Shock-resistant grade for swing-beam shears cutting thicker mild-steel and stainless plate.',
  },
  {
    material: 'Tungsten Carbide',
    designation: 'WC-Co (K10/K20)',
    hardness: 'HRA 89–92',
    standards: 'ISO 513',
    typicalUse: 'Solid or tipped carbide for the most abrasive feedstocks — typically 8–10× the edge life of HSS.',
  },
];

/**
 * Customer pain points addressed by an in-house, engineering-led blade
 * manufacturer. Drives the `painIdentification` and `awareness` Buyer
 * Decision Chain stages.
 */
export const PAIN_POINTS: ReadonlyArray<{ title: string; description: string; icon: string }> = [
  {
    title: 'Premature edge failure',
    description:
      'Catalog blades wearing out in days, not weeks. The wear pattern is usually diagnostic — material, hardness or geometry is wrong for the substrate.',
    icon: 'tabler:blade',
  },
  {
    title: 'OEM lead time too long',
    description:
      'Maintenance windows measured in hours, not weeks. We hold buffer stock on common OD sizes and ship non-stock items in 15–25 working days.',
    icon: 'tabler:clock-hour-9',
  },
  {
    title: 'Obsolete or vendor-locked parts',
    description:
      'Original blade is no longer available, or the OEM has minimum-order quantities you cannot meet. Reverse-engineering from your worn sample closes the gap.',
    icon: 'tabler:lock-open',
  },
  {
    title: 'Inconsistent dimensional quality',
    description:
      'Flatness, parallelism and concentricity drifting batch-to-batch. Every dimension you specify is CMM-checked, not just the ones that fit the schedule.',
    icon: 'tabler:ruler-measure',
  },
  {
    title: 'Unclear quotations',
    description:
      'Quotes that hide tooling, setup or coating as extras. Our quotes list material grade, hardness, tolerance, lead time and tooling cost on the same page.',
    icon: 'tabler:file-text',
  },
  {
    title: 'No engineering support',
    description:
      'A supplier that just ships a SKU. Every KAIPU order has a named engineer — from RFQ review through to the dispatch paperwork.',
    icon: 'tabler:user-check',
  },
];

/** Comparison block: KAIPU vs catalog-only suppliers. */
export const COMPARISON: ReadonlyArray<{
  criterion: string;
  kaipu: string;
  catalog: string;
}> = [
  {
    criterion: 'Material certificate with every batch',
    kaipu: 'Mill certificate included',
    catalog: 'On request, often extra',
  },
  {
    criterion: 'Hardness verified per batch',
    kaipu: 'Rockwell tested, recorded',
    catalog: 'Heat-treater sub-contracted',
  },
  {
    criterion: 'CMM dimensional report',
    kaipu: 'Every specified dimension',
    catalog: 'Spot-check only',
  },
  {
    criterion: 'Custom geometry from drawing',
    kaipu: 'In-house design office',
    catalog: 'Referral to a third party',
  },
  {
    criterion: 'Reverse-engineering from worn sample',
    kaipu: 'CMM measurement + 2D/3D drawing approval',
    catalog: 'Not offered',
  },
  {
    criterion: 'Engineering contact for the order',
    kaipu: 'Named engineer, end-to-end',
    catalog: 'Sales rep only',
  },
  {
    criterion: 'Lead-time honesty',
    kaipu: 'Quoted lead time = delivered lead time',
    catalog: 'Best-case lead time quoted',
  },
];

/** "BEST FOR …" pattern — one sentence per category, AI-citation friendly. */
export const BEST_FOR_PATTERN: ReadonlyArray<{
  slug: string;
  category: string;
  description: string;
  icon: string;
}> = [
  {
    slug: 'circular',
    category: 'Circular Blades',
    description:
      'BEST FOR centre-surface and centreless winders, slitter-rewinders for label stock, and tape / foil / paper sheeters running film and laminate under 1 mm thick.',
    icon: 'tabler:circle',
  },
  {
    slug: 'straight',
    category: 'Straight Blades',
    description:
      'BEST FOR pouch-making and label-stock converting lines, top-anvil slitting, and adhesive-tape cut-to-length where straightness and edge parallelism drive cut quality.',
    icon: 'tabler:rectangle',
  },
  {
    slug: 'serrated',
    category: 'Serrated Blades',
    description:
      'BEST FOR tear-strip perforation on shrink film and lidding foil, easy-open packaging, and decorative cuts on laminated paper products (6–32 TPI selectable).',
    icon: 'tabler:wave-saw-tool',
  },
  {
    slug: 'shear',
    category: 'Shear Blades',
    description:
      'BEST FOR guillotine and swing-beam cutting of mild and stainless plate up to 12 mm, scrap shear rotors, and high-cycle service centres running more than eight shifts per week.',
    icon: 'tabler:scissors',
  },
  {
    slug: 'granulator',
    category: 'Granulator Knives',
    description:
      'BEST FOR plastics granulators cutting filled, glass-fibre reinforced or recycled feedstock — rotor / stator matched sets, bevel re-grindable four times.',
    icon: 'tabler:rotate',
  },
  {
    slug: 'custom',
    category: 'Custom Blades',
    description:
      'BEST FOR obsolete parts, vendor-locked geometries, and second-source qualification — reverse-engineered from your worn sample or STEP / IGES / DXF drawing.',
    icon: 'tabler:tool',
  },
];

/** External standards referenced from the page body. */
export const STANDARDS_REFERENCED: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'AMS 6478 — D2 tool steel', href: 'https://www.sae.org/standards/content/ams6478/' },
  { label: 'ASTM A681 — Tool steels alloy', href: 'https://www.astm.org/a0681_a0681m-15.html' },
  { label: 'ISO 4957 — Tool steels', href: 'https://www.iso.org/standard/71490.html' },
  { label: 'VDI 3198 — Coating adhesion', href: 'https://www.vdi.de/richtlinien/details?VdiRgl=VDI%203198' },
];

/** Frequently Asked Questions — drives FAQPage schema + visible accordion. */
export const OVERVIEW_FAQS: ReadonlyArray<{ title: string; description: string }> = [
  {
    title: 'Which blade material should I choose — D2, SKD11 or M2 HSS?',
    description:
      'D2 (1.2379) is the default grade for paper, film and foil slitting at ambient temperature. SKD11 / DC53 is the first choice for thin gauges under 1 mm because its refined carbide distribution reduces chipping. M2 HSS (1.3343) is the right pick when the edge runs hot — granulators, high-speed slitting, or abrasive recycled feedstock. Send us your substrate, line speed and current blade life and we will recommend a grade on the quotation.',
  },
  {
    title: 'What tolerances can you hold on a custom blade?',
    description:
      'Standard CNC grinding holds ±0.01 mm on flatness and parallelism, ±0.02 mm on concentricity and surface finish to Ra 0.2–0.4 µm. Tighter tolerances (down to ±0.002 mm) are available on request with a quoted lead-time impact. Every dimension you specify is CMM-checked and the report ships with the parts.',
  },
  {
    title: 'What is the typical lead time for a non-stock blade?',
    description:
      'Stocked OD sizes ship in 10 working days. Custom non-stock items follow our 8-step process and ship in 20–25 working days from drawing approval. Reverse-engineered parts add 5–10 working days for the CMM measurement and drawing-approval stage. Lead times we quote are the lead times we deliver against — we tell you on the day we know if anything slips.',
  },
  {
    title: 'Do you offer reverse-engineering from a worn sample?',
    description:
      'Yes. Send us the worn blade, a 3D scan, or a STEP / IGES / DXF file. We CMM-measure the critical features, reconstruct the original geometry, and propose a material and hardness upgrade where the wear pattern allows. A 2D / 3D drawing is issued for your written approval before any steel is ordered.',
  },
  {
    title: 'Which PVD coating should I specify — TiN, TiCN, CrN or DLC?',
    description:
      'TiN is the general-purpose choice for wear resistance. TiCN suits thin film and paper where lower friction matters. CrN is used for corrosive or food-contact applications. DLC (diamond-like carbon) is the lowest-friction option for sticky or adhesive substrates. Coating thickness is held to ±2 µm uniformity and adhesion is verified per VDI 3198 on every batch.',
  },
  {
    title: 'Can you match an OEM part if I do not have a drawing?',
    description:
      'Yes — that is the reverse-engineering workflow. We CMM-measure your worn part (or your spare), recover the original geometry, and either reproduce it exactly or upgrade it based on the wear pattern. The replacement is shipped with a 2D / 3D drawing of the recovered geometry for your records.',
  },
  {
    title: 'What is the minimum order quantity for a custom blade?',
    description:
      'For a one-off custom blade the minimum order quantity is one piece. Tooling and setup are amortised into the unit price for low-volume runs. For ongoing consumption we typically schedule a quarterly batch (e.g. 20–50 pieces) so you receive a lower unit price and a predictable dispatch cadence.',
  },
  {
    title: 'How quickly will I receive an engineering quotation?',
    description:
      'Within one business day of receiving your drawing, sample or written specification. The quote lists material grade, hardness, dimensional tolerance, lead time and tooling cost (if any) on the same page — there are no hidden extras. PPAP / ISIR documentation can be included on request for automotive and medical customers.',
  },
];

/** Proprietary framework referenced once on the page. */
export const PROPRIETARY_FRAME = 'Material-to-Tolerance Scorecard';
