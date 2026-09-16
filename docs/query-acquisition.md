# KAIPU Query Acquisition System (V1.0)

> **The problem:** AI Search has no official "Keyword Planner". We cannot Google "all AI prompts". We must build our own Query Acquisition Stack — the missing infrastructure for AI-era SEO.

## What this is

A data-layer pipeline that turns 5 categories of real-world queries into a **queryable Query Universe**, then drives a **Prompt Matrix** that tests how AI Search engines (ChatGPT, Gemini, Perplexity, AI Mode) cite us versus competitors.

```
5 Acquire Channels
       ↓
  Query Database       ← queries.seed.yaml (40 entries)
       ↓
  Prompt Matrix        ← prompts.seed.yaml (14 entries)
       ↓
  AI Citation Log      ← citations.log.yaml (V1.0: empty)
       ↓
   Content Brief
```

## File map

| File                                                                                                                                    | Purpose                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [`src/data/_templates/query-acquisition/README.md`](../src/data/_templates/query-acquisition/README.md)                                 | Methodology (full)                                            |
| [`src/data/_templates/query-acquisition/workflow.md`](../src/data/_templates/query-acquisition/workflow.md)                             | 5-step SOP                                                    |
| [`src/data/_templates/query-acquisition/schema.query.yaml`](../src/data/_templates/query-acquisition/schema.query.yaml)                 | Query schema (22 fields)                                      |
| [`src/data/_templates/query-acquisition/schema.prompt.yaml`](../src/data/_templates/query-acquisition/schema.prompt.yaml)               | Prompt schema (11 fields)                                     |
| [`src/data/_templates/query-acquisition/schema.citation.yaml`](../src/data/_templates/query-acquisition/schema.citation.yaml)           | Citation schema (12 fields)                                   |
| [`src/data/_templates/query-acquisition/schema.entity.yaml`](../src/data/_templates/query-acquisition/schema.entity.yaml)               | Entity schema (8 fields)                                      |
| [`src/data/_templates/query-acquisition/taxonomy.source-type.yaml`](../src/data/_templates/query-acquisition/taxonomy.source-type.yaml) | source_type + reliability dictionary                          |
| [`src/data/_templates/query-acquisition/taxonomy.buyer-role.yaml`](../src/data/_templates/query-acquisition/taxonomy.buyer-role.yaml)   | buyer_role / funnel_stage / intent / evidence_type dictionary |
| [`src/data/query-acquisition/entities.yaml`](../src/data/query-acquisition/entities.yaml)                                               | KAIPU 7 entities (seed)                                       |
| [`src/data/query-acquisition/sources.kpi.yaml`](../src/data/query-acquisition/sources.kpi.yaml)                                         | KAIPU source KPI / configuration                              |
| [`src/data/query-acquisition/queries.seed.yaml`](../src/data/query-acquisition/queries.seed.yaml)                                       | 40 queries across 7 entities × 5 buyer_roles                  |
| [`src/data/query-acquisition/prompts.seed.yaml`](../src/data/query-acquisition/prompts.seed.yaml)                                       | 14 prompts (5 buyer_roles × 7 entities subset)                |
| [`src/data/query-acquisition/citations.log.yaml`](../src/data/query-acquisition/citations.log.yaml)                                     | V1.0 placeholder (empty)                                      |
| [`scripts/audit-query-acquisition.mjs`](../scripts/audit-query-acquisition.mjs)                                                         | Schema + provenance + taxonomy + coverage audit               |

## Running the audit

```bash
npm run query:audit                # local warn-only
CI=true npm run query:audit        # CI hard fail on errors
```

The audit verifies:

1. **YAML well-formed** — every file parses.
2. **Provenance completeness** — every query has the 9 required fields.
3. **Entity FK integrity** — no orphan queries.
4. **Taxonomy compliance** — every enum value is in the controlled dictionary.
5. **Funnel coverage** — every entity has ≥ 3 funnel stages.
6. **Reliability baseline** — warns if `generated` share > 70% (LLM dependency).
7. **Prompt FK integrity** — every prompt points to an existing query.

## Hard rules (do not break)

1. **Generated ≠ Actual** — AI-generated queries MUST be tagged `reliability: generated` + `added_by: llm_fanout` (or `chatgpt` / `gemini` / `perplexity`). Never mix them with GSC / RFQ data.
2. **Entity-first** — no orphan queries. Every query must anchor to an entity.
3. **Append-only** — schema evolution goes through `schema_version` field. Never delete entries.
4. **PII redaction** — RFQ / sales inquiry / LinkedIn entries must be anonymized before insertion.

## V1.0 vs V2.0 boundary

| V1.0 (this commit)                | V2.0 (future)                          |
| --------------------------------- | -------------------------------------- |
| Manual capture, YAML-only         | Automated GSC / SERP / AI Mode capture |
| Human-in-the-loop AI testing      | Scripted 4-channel AI Test Runner      |
| Citation log placeholder          | Citation log filled + dashboard        |
| Single-language (en)              | Multi-language (en / zh / de / ja)     |
| `npm run query:audit` (warn-only) | `CI=true` hard fail                    |

## License

Internal — KAIPU Industrial Blades. Not for redistribution.
