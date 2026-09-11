/**
 * Six in-house service capabilities for /services.
 * Each description ends with explicit "Best for" / "Not for" labels.
 */

export interface Capability {
  title: string;
  description: string;
}

export const capabilities: Capability[] = [
  {
    title: 'Custom Blade Design',
    description:
      'Reverse-engineering from a worn sample, parametric design from your drawing, or co-development against a new process. 3D CAD and FEA on request. Best for: Worn-sample reverse engineering, parametric design, co-development. Not for: Off-the-shelf blade reselling without engineering input.',
  },
  {
    title: 'CNC Precision Grinding',
    description:
      '5-axis CNC profile grinding, surface grinding to Ra 0.2 µm, OD/ID cylindrical grinding, CNC wire EDM for carbide geometries. Best for: Tight ±0.005 mm profile geometry and mirror-finish surfaces. Not for: Heavy 5-ton rough forgings or high-tonnage stamping work.',
  },
  {
    title: 'Vacuum Heat Treatment',
    description:
      'Vacuum hardening, tempering and sub-zero treatment. Hardness verified on every batch with calibrated Rockwell testers. Best for: D2 / HSS knives requiring HRC 58–62 and minimum distortion. Not for: Low-carbon structural steels where case hardening is more appropriate.',
  },
  {
    title: 'PVD Coating',
    description:
      'TiN, TiCN, CrN and DLC coatings applied in-house to ±2 µm uniformity. Adhesion tested per VDI 3198. Best for: Wear- and corrosion-resistant edges in continuous production. Not for: High-temperature hot-work above 500 °C where CVD is more suitable.',
  },
  {
    title: 'Re-sharpening & Re-grinding',
    description:
      'Return-and-resharpen service for our own blades. Original geometry preserved by reading the worn edge profile before grinding. Best for: Blades originally supplied by KAIPU with geometry record on file. Not for: Blades from other suppliers with unknown geometry or materials.',
  },
  {
    title: 'Quality Assurance',
    description:
      'CMM dimensional inspection, hardness mapping, surface roughness and full batch traceability. PPAP / ISIR on request. Best for: Automotive, packaging and converting customers needing PPAP, ISIR and Cpk ≥ 1.33. Not for: Cash buyers with no QA documentation requirements.',
  },
];
