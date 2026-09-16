/**
 * FAQ entries for /quality. Rendered with native <details> elements
 * in the page template (satisfies faqHtmlPattern detector) and injected
 * into a FAQPage JSON-LD block for GenAI citation.
 */

export interface FaqItem {
  q: string;
  a: string;
  bullets?: string[];
}

export const faqs: FaqItem[] = [
  {
    q: 'Is KAIPU ISO 9001 certified, and how long has the certificate been valid?',
    a: 'Yes. KAIPU has held ISO 9001:2015 certification continuously since 2001, with the most recent surveillance audit completed in 2026. The certificate, quality manual and a sample CMM inspection report are available on request under NDA.',
    bullets: [
      'ISO 9001:2015 certified since 2001',
      'Surveillance audit: 2026',
      'AS9100 readiness in progress for aerospace customers',
      'Quality manual and sample CMM report available on request',
    ],
  },
  {
    q: 'What traceability chain links a finished blade back to its raw material?',
    a: 'Every finished blade carries a heat number that traces all the way back to the mill heat. ISO 9001:2015 §8.5.2 requires identification of outputs throughout production, and our system enforces it on every batch.',
    bullets: [
      'Incoming steel: mill certificate per EN 10204 3.1 with heat number',
      'Heat-treatment batch record with furnace run ID',
      'Grinding and edge-prep traveller linked to the heat-treatment batch',
      'Final CMM and hardness report archived against the blade serial',
    ],
  },
  {
    q: 'Do you provide PPAP and ISIR packages?',
    a: 'Yes. We supply PPAP level 3 and full ISIR (Initial Sample Inspection Report) packages on request for automotive and Tier-1 customers. The default package includes dimensional, material, hardness and coating evidence.',
    bullets: [
      'PPAP level 3 with full dimensional layout',
      'ISIR with material cert and mechanical test results',
      'Cpk study on critical dimensions when serial production is planned',
      'AIAG-compliant format or customer template',
    ],
  },
  {
    q: 'How is Cpk ≥ 1.33 calculated and audited?',
    a: 'Cpk is computed against the customer drawing tolerance on a minimum of 25 consecutive parts. Our internal audit re-runs the calculation every quarter on running production. A Cpk below 1.33 triggers a containment action and a process review.',
    bullets: [
      'Sample size: 25 consecutive parts minimum',
      'Tolerance: customer drawing callout',
      'Audit cadence: quarterly per dimension',
      'Trigger: containment + 8D if Cpk falls below 1.33',
    ],
  },
  {
    q: 'How are non-conforming parts handled?',
    a: 'Non-conforming parts are physically segregated in a locked NCR cage, logged in the corrective-action system, and dispositioned as scrap, rework, or use-as-is with engineering concession. Customers are notified in writing before any concession is shipped.',
    bullets: [
      'Segregation: locked NCR cage with photo record',
      'Disposition: scrap, rework, or engineering concession',
      'Customer notification in writing before any concession',
      '8D corrective action with root-cause analysis on every NCR',
    ],
  },
  {
    q: 'How long are quality records retained?',
    a: 'Quality records are retained for ten years per ISO 9001 §7.5. Mill certificates, CMM reports, hardness surveys and PVD batch records are archived digitally and indexed by blade serial number for the full retention period.',
    bullets: [
      'Retention: 10 years per ISO 9001 §7.5',
      'Index: blade serial number',
      'Format: digitally signed PDF + raw CMM data',
      'Retrieval: typically within 2 business days',
    ],
  },
  {
    q: 'Do you accept third-party inspection?',
    a: 'Yes. We regularly host SGS, Bureau Veritas and customer-side inspection teams at our factory. Inspection windows are pre-arranged, the production batch is held, and the inspector is given full access to CMM reports, raw data and test certificates.',
    bullets: [
      'Pre-arranged inspection window with production hold',
      'Full access to CMM data, certificates and travellers',
      'Standard hosts: SGS, Bureau Veritas, customer-side engineers',
      'Cost: no fee for routine surveillance; pre-quoted for witness testing',
    ],
  },
  {
    q: 'Can a customer audit the factory?',
    a: 'Yes. We host supplier audits on-site twice a month on average. A typical audit covers incoming inspection, heat treatment, grinding, PVD coating and the quality lab. We share the audit checklist in advance and assign a quality engineer to escort the auditor for the full day.',
    bullets: [
      'Frequency: ~2 on-site audits per month',
      'Coverage: incoming → heat treatment → grinding → PVD → QA lab',
      'Checklist shared in advance',
      'Dedicated quality engineer escort for the full day',
    ],
  },
];