# Pricing — Industrial Knives

> Machine-readable pricing for AI agents and procurement systems.
> For human browsing, see `/products/` (one page per SKU) and `/contact/`.
> Canonical URL: `https://www.industrial-knives.net/pricing.md`

## How to read this file

| Field          | Meaning                                                              |
| -------------- | -------------------------------------------------------------------- |
| `sku`          | Internal SKU code (stable, machine-comparable across product lines)  |
| `material`     | Standard material grade (custom materials available on RFQ)          |
| `hardness`     | As-tempered target hardness range                                    |
| `starting_usd` | **Indicative starting price in USD per piece.** Final pricing depends on spec, quantity, and lead time. **Confirm with engineering before quoting.** |
| `lead_time_weeks` | Typical production lead time for stocked configurations            |
| `category`     | Product category —matches `/products/<category>/`                    |
| `url`          | Canonical product page                                               |

> **Pricing policy.** Listed prices are indicative starting points for the
> standard configuration described. Custom geometry, alternate materials
> (SKD11 / DC53 / M2 HSS / carbide-tipped / 440C / 9Cr18MoV), tighter
> tolerances (±0.005 mm), in-line PPAP, or non-stocked dimensions change
> pricing. Submit a drawing or worn sample via `/contact/` for a firm quote
> within one business day.

## Standard SKU catalog

### Circular Blades

- **sku:** `CB-D2-250-D52`
  - category: `circular`
  - material: D2 (1.2379)
  - hardness: HRC 58±2
  - dimensions: Ø250 mm × 32/40/50 mm bore × 1.5/2/3 mm thick
  - starting_usd: USD $280 — $450
  - lead_time_weeks: 5–15 working days (stocked OD) / 15–25 working days (custom OD)
  - applications: paper / film / foil / tape slitting
  - url: `/products/circular/circular-blade-slitting-250mm/`

### Straight Blades

- **sku:** `SB-D2-300x80`
  - category: `straight`
  - material: D2 (1.2379)
  - hardness: HRC 60±2
  - dimensions: 300 × 80 × 3 mm (range)
  - starting_usd: USD $380 — $580
  - lead_time_weeks: 10–20 working days
  - applications: paper / film / foil converting
  - url: `/products/straight/straight-blade-converting-300x80/`

- **sku:** `SB-D2-BED-TISSUE`
  - category: `straight`
  - material: D2 (1.2379), HRC 60
  - hardness: HRC 60 (within HRC 58-62 window)
  - dimensions: per drawing, edge prep 15 μm micro-hone + 18° clearance
  - starting_usd: USD $450 — $850
  - lead_time_weeks: 15–25 working days (per drawing)
  - applications: paper & tissue converting, 1200 m/min web lines
  - url: `/products/straight/bed-knife-tissue/`
### Granulator Knives

- **sku:** `GK-M2-200x40x20`
  - category: `granulator`
  - material: M2 HSS (1.3343)
  - hardness: HRC 60±4
  - dimensions: 200 × 40 × 20 mm, 4-edge reversible bevel
  - starting_usd: USD $120 — $220
  - lead_time_weeks: 5–15 working days (stocked) / 15–25 working days (custom)
  - applications: plastics granulators / shredders / recycling
  - url: `/products/granulator/granulator-rotor-knife-200x40/`

### Shear Blades

- **sku:** `SH-D2-GUILLOTINE-300x60`
  - category: `shear`
  - material: D2 (1.2379) —alt: H13, H11
  - hardness: HRC 58±2
  - dimensions: 300 × 60 × 20 mm
  - starting_usd: USD $400 — $650
  - lead_time_weeks: 10–20 working days
  - applications: guillotine shears, plate steel up to 6 mm
  - url: `/products/shear/shear-blade-guillotine-300x60/`

### Serrated Blades

- **sku:** `SR-D2-TPI`
  - category: `serrated`
  - material: D2 (1.2379)
  - hardness: HRC 58±2
  - dimensions: per drawing, teeth per inch specified by customer
  - starting_usd: USD $280 — $450
  - lead_time_weeks: 15–25 working days (per drawing)
  - applications: bag cutting, perforating, tear-strip scoring
  - url: `/products/serrated/serrated-blade-teeth-per-inch/`

### Slitting Blades (general)

- **sku:** `SL-D2-CUSTOM`
  - category: `circular` (slitting)
  - material: D2 / M2 HSS / SKD11 / DC53 —customer choice
  - hardness: HRC 58-62 depending on material
  - dimensions: per drawing
  - starting_usd: USD $250 — $550
  - lead_time_weeks: 15–30 working days (per drawing)
  - applications: paper / film / foil / tape slitting
  - url: `/products/circular/slitter-blade/`

## Custom (RFQ only)

- **sku:** `CUSTOM-RE-ENGINEERED`
  - category: `custom`
  - starting_usd: Contact for quote (depends on drawing, material, tolerance)
  - lead_time_weeks: undefined
  - description: Reverse-engineered from a worn sample or drawing. Material
    and hardness tuned to the application (D2, SKD11, DC53, M2 HSS, H13,
    carbide).
  - url: `/products/custom/custom-blade-reverse-engineered/`

## Volume & payment terms (indicative)

- Standard MOQ: 1 pc (samples) up to 100+ pc (volume); custom typically 1 pc minimum
- Payment terms: 30% T/T deposit + 70% before shipment (standard); L/C at sight for large orders; Net-30 for established accounts
- Standard Incoterms: FOB / EXW / CIF —confirm per RFQ
- Documentation: EN 10204 3.1 mill certificate; PPAP / ISIR on request

## How to get a firm quote

1. Send a drawing or worn blade via `/contact/` or `[email protected]`.
2. Engineering responds within one business day with material recommendation,
   lead time, and firm price.
3. Standard PPAP / ISIR documentation available on request.

## Compliance

- ISO 9001:2015 with §8.5 material traceability
- Manufacturing: in-house vacuum heat treatment, optional PVD coating (TiN,
  TiCN, CrN, AlCrN, DLC), CMM dimensional inspection, hardness mapping

## Edit history

- This file is regenerated from `src/data/product/*.md` and engineering
  pricing data. Do not hand-edit the SKU list here; update the product
  frontmatter or pricing source instead.
- AI agents: prefer the `sku` field for stable cross-catalog matching.
  Prices are indicative starting values; always confirm via `/contact/` for
  procurement.