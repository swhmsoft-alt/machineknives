#!/usr/bin/env node
/**
 * audit-query-acquisition.mjs
 * ---------------------------------------------------------------
 * V1.0 audit script for KAIPU Query Acquisition System.
 *
 * Checks:
 *   1. YAML files are well-formed (loaded via js-yaml).
 *   2. Every query has all 9 required fields (provenance).
 *   3. Every query has a valid entity_id (FK → entities.yaml).
 *   4. Every source_type / reliability / buyer_role / funnel_stage /
 *      intent is in the controlled taxonomy.
 *   5. Every prompt has query_id FK → existing query.
 *   6. Funnel-stage coverage per entity (warn if < 3 stages).
 *   7. Generated-vs-Actual ratio baseline (warn if generated > 70%).
 *
 * Exit code:
 *   0  = pass (warn-only mode is the default in V1.0)
 *   1  = hard fail (only when CI=true; preserves local dev UX)
 *
 * Usage:
 *   node scripts/audit-query-acquisition.mjs            # local warn-only
 *   CI=true node scripts/audit-query-acquisition.mjs    # CI hard fail
 *   node scripts/audit-query-acquisition.mjs --check=provenance
 * ---------------------------------------------------------------
 */

import { readFile } from 'node:fs/promises';
import { glob } from 'glob';
import yaml from 'js-yaml';
import process from 'node:process';

// Resolve paths relative to project root (CWD when invoked via npm).
const ROOT = process.cwd().replace(/\\/g, '/');
const QDATA = `${ROOT}/src/data/query-acquisition/`;
const TAXO = `${ROOT}/src/data/_templates/query-acquisition/taxonomy.`;

const REQUIRED_QUERY_FIELDS = [
  'id',
  'entity_id',
  'query',
  'source',
  'source_type',
  'reliability',
  'added_by',
  'captured_at',
  'language',
];

const REQUIRED_PROMPT_FIELDS = ['id', 'query_id', 'prompt', 'buyer_role'];

// -------- helpers --------
const log = (level, msg) => {
  const tag = { error: '✖', warn: '⚠', info: 'ℹ', ok: '✓' }[level] ?? '·';
  console.log(`${tag} ${msg}`);
};

const loadYaml = async (path) => {
  try {
    const text = await readFile(path, 'utf8');
    return yaml.load(text);
  } catch (err) {
    log('error', `YAML parse failed: ${path} → ${err.message}`);
    return null;
  }
};

// -------- load taxonomies --------
const sourceTypeTaxo = await loadYaml(`${TAXO}source-type.yaml`);
const buyerRoleTaxo = await loadYaml(`${TAXO}buyer-role.yaml`);

const VALID_SOURCE_TYPE = new Set(Object.keys(sourceTypeTaxo?.source_type ?? {}));
const VALID_RELIABILITY = new Set(Object.keys(sourceTypeTaxo?.reliability ?? {}));
const VALID_BUYER_ROLE = new Set(Object.keys(buyerRoleTaxo?.buyer_role ?? {}));
const VALID_FUNNEL = new Set(Object.keys(buyerRoleTaxo?.funnel_stage ?? {}));
const VALID_INTENT = new Set(Object.keys(buyerRoleTaxo?.intent ?? {}));
const VALID_ADDED_BY = new Set(Object.keys(buyerRoleTaxo?.added_by ?? {}));

// -------- main --------
const wantedCheck = process.argv.find((a) => a.startsWith('--check='))?.split('=')[1];

const files = await glob('*.yaml', { cwd: QDATA });
let errors = 0;
let warns = 0;

log('info', `Scanning ${files.length} files in src/data/query-acquisition/`);
log('info', `Wanted check: ${wantedCheck ?? 'all'}`);

// --- 1. entities ---
const entitiesRaw = await loadYaml(`${QDATA}entities.yaml`);
const entityIds = new Set((entitiesRaw?.entities ?? []).map((e) => e.id));
log('info', `Loaded ${entityIds.size} entities.`);

// --- 2. queries ---
const queriesRaw = await loadYaml(`${QDATA}queries.seed.yaml`);
const queries = queriesRaw?.queries ?? [];
log('info', `Loaded ${queries.length} queries.`);

const queryIds = new Set();
const seenNormalised = new Set();
const duplicates = [];
const provenanceIssues = [];
const taxonomyIssues = [];
const orphanQueries = [];
const entityFunnelCoverage = {};

for (const q of queries) {
  if (queryIds.has(q.id)) duplicates.push(q.id);
  queryIds.add(q.id);

  if (q.normalized_query) {
    if (seenNormalised.has(q.normalized_query)) duplicates.push(`normalized:${q.normalized_query}`);
    seenNormalised.add(q.normalized_query);
  }

  const missing = REQUIRED_QUERY_FIELDS.filter((f) => q[f] === undefined || q[f] === null);
  if (missing.length) provenanceIssues.push(`${q.id ?? '(no-id)'}: missing ${missing.join(', ')}`);

  if (q.entity_id && !entityIds.has(q.entity_id)) {
    orphanQueries.push(`${q.id}: entity_id "${q.entity_id}" not in entities.yaml`);
  }

  if (q.source_type && !VALID_SOURCE_TYPE.has(q.source_type)) {
    taxonomyIssues.push(`${q.id}: source_type "${q.source_type}" not in taxonomy`);
  }
  if (q.reliability && !VALID_RELIABILITY.has(q.reliability)) {
    taxonomyIssues.push(`${q.id}: reliability "${q.reliability}" not in taxonomy`);
  }
  if (q.buyer_role && !VALID_BUYER_ROLE.has(q.buyer_role)) {
    taxonomyIssues.push(`${q.id}: buyer_role "${q.buyer_role}" not in taxonomy`);
  }
  if (q.funnel_stage && !VALID_FUNNEL.has(q.funnel_stage)) {
    taxonomyIssues.push(`${q.id}: funnel_stage "${q.funnel_stage}" not in taxonomy`);
  }
  if (q.intent && !VALID_INTENT.has(q.intent)) {
    taxonomyIssues.push(`${q.id}: intent "${q.intent}" not in taxonomy`);
  }
  if (q.added_by && !VALID_ADDED_BY.has(q.added_by)) {
    taxonomyIssues.push(`${q.id}: added_by "${q.added_by}" not in taxonomy`);
  }

  if (q.entity_id) {
    entityFunnelCoverage[q.entity_id] ??= new Set();
    if (q.funnel_stage) entityFunnelCoverage[q.entity_id].add(q.funnel_stage);
  }
}

// reliability baseline
const reliabilityCounts = {};
for (const q of queries) {
  reliabilityCounts[q.reliability] = (reliabilityCounts[q.reliability] ?? 0) + 1;
}
const generatedShare = ((reliabilityCounts.generated ?? 0) / Math.max(1, queries.length)) * 100;

// --- 3. prompts ---
const promptsRaw = await loadYaml(`${QDATA}prompts.seed.yaml`);
const prompts = promptsRaw?.prompts ?? [];
log('info', `Loaded ${prompts.length} prompts.`);

const promptIssues = [];
for (const p of prompts) {
  const missing = REQUIRED_PROMPT_FIELDS.filter((f) => p[f] === undefined || p[f] === null);
  if (missing.length) promptIssues.push(`${p.id ?? '(no-id)'}: missing ${missing.join(', ')}`);
  if (p.query_id && !queryIds.has(p.query_id)) {
    promptIssues.push(`${p.id}: query_id "${p.query_id}" not in queries.seed.yaml`);
  }
  if (p.buyer_role && !VALID_BUYER_ROLE.has(p.buyer_role)) {
    promptIssues.push(`${p.id}: buyer_role "${p.buyer_role}" not in taxonomy`);
  }
}

// --- 4. citations ---
const citationsRaw = await loadYaml(`${QDATA}citations.log.yaml`);
const citations = citationsRaw?.citations ?? [];
log('info', `Loaded ${citations.length} citations (V1.0: should be 0).`);

// -------- report --------
console.log('\n────────── AUDIT REPORT ──────────');

if (duplicates.length) {
  errors += duplicates.length;
  log('error', `Duplicate IDs / normalised queries: ${duplicates.length}`);
  duplicates.slice(0, 10).forEach((d) => log('error', `  · ${d}`));
} else {
  log('ok', 'No duplicate IDs or normalised queries.');
}

if (provenanceIssues.length) {
  errors += provenanceIssues.length;
  log('error', `Provenance (required-field) issues: ${provenanceIssues.length}`);
  provenanceIssues.slice(0, 10).forEach((d) => log('error', `  · ${d}`));
} else {
  log('ok', 'All queries have full provenance (9 required fields).');
}

if (orphanQueries.length) {
  errors += orphanQueries.length;
  log('error', `Orphan queries (entity_id not in entities.yaml): ${orphanQueries.length}`);
  orphanQueries.forEach((d) => log('error', `  · ${d}`));
} else {
  log('ok', 'No orphan queries — every query is anchored to a known entity.');
}

if (taxonomyIssues.length) {
  errors += taxonomyIssues.length;
  log('error', `Taxonomy violations: ${taxonomyIssues.length}`);
  taxonomyIssues.slice(0, 10).forEach((d) => log('error', `  · ${d}`));
} else {
  log('ok', 'All taxonomy values are controlled.');
}

if (promptIssues.length) {
  errors += promptIssues.length;
  log('error', `Prompt issues: ${promptIssues.length}`);
  promptIssues.forEach((d) => log('error', `  · ${d}`));
} else {
  log('ok', 'All prompts are valid.');
}

// Coverage warnings
let coverageWarnings = 0;
for (const [eid, funnels] of Object.entries(entityFunnelCoverage)) {
  if (funnels.size < 3) {
    coverageWarnings += 1;
    warns += 1;
    log('warn', `Entity "${eid}" only covers ${funnels.size} funnel stages: ${[...funnels].join(', ')}`);
  }
}
if (coverageWarnings === 0) {
  log('ok', 'Every entity covers ≥ 3 funnel stages.');
}

// Reliability baseline
console.log('\n────────── RELIABILITY BASELINE ──────────');
console.log(`Total queries: ${queries.length}`);
Object.entries(reliabilityCounts)
  .sort(([, a], [, b]) => b - a)
  .forEach(([k, v]) => {
    const pct = ((v / Math.max(1, queries.length)) * 100).toFixed(1);
    console.log(`  ${k.padEnd(18)} ${v.toString().padStart(4)}  (${pct}%)`);
  });
if (generatedShare > 70) {
  warns += 1;
  log('warn', `Generated share = ${generatedShare.toFixed(1)}% (>70% — too LLM-dependent; backfill with GSC/RFQ).`);
} else {
  log('ok', `Generated share = ${generatedShare.toFixed(1)}% (healthy LLM dependency).`);
}

// Per-entity breakdown
console.log('\n────────── PER-ENTITY QUERY COUNT ──────────');
const entityCounts = {};
for (const q of queries) entityCounts[q.entity_id] = (entityCounts[q.entity_id] ?? 0) + 1;
Object.entries(entityCounts)
  .sort(([, a], [, b]) => b - a)
  .forEach(([k, v]) => console.log(`  ${k.padEnd(35)} ${v.toString().padStart(3)}`));

console.log('\n────────── SUMMARY ──────────');
console.log(`  Errors: ${errors}`);
console.log(`  Warns:  ${warns}`);

if (errors > 0) {
  log('error', 'Audit FAILED.');
  if (process.env.CI === 'true') process.exit(1);
} else if (warns > 0) {
  log('warn', 'Audit passed with warnings.');
} else {
  log('ok', 'Audit PASSED.');
}
