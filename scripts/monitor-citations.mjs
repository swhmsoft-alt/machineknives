#!/usr/bin/env node
// scripts/monitor-citations.mjs
// AI SEO Skill Citation Monitor — weekly report generator.
// Reads citations.log.yaml + queries.seed.yaml, writes a markdown report
// to src/data/monitor/reports/ with per-platform citation rates.

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const ROOT = process.cwd();
const LOG = path.join(ROOT, "src/data/query-acquisition/citations.log.yaml");
const SEED = path.join(ROOT, "src/data/query-acquisition/queries.seed.yaml");
const OUT_DIR = path.join(ROOT, "src/data/monitor/reports");

if (!fs.existsSync(LOG)) { console.error("citations.log.yaml not found"); process.exit(1); }
fs.mkdirSync(OUT_DIR, {recursive: true});

const log = yaml.load(fs.readFileSync(LOG, "utf8")) || {};
const seed = yaml.load(fs.readFileSync(SEED, "utf8"));
const queries = (seed.queries || []).reduce((acc, q) => { acc[q.id] = q; return acc; }, {});

const week = new Date().toISOString().slice(0, 10);
const lines2 = [];
lines2.push("# AI SEO Citation Monitor — " + week);
lines2.push("");
lines2.push("Source: src/data/query-acquisition/citations.log.yaml");
lines2.push("Queries: src/data/query-acquisition/queries.seed.yaml");
lines2.push("");

const platforms = ["chatgpt", "perplexity", "claude", "gemini", "ai_mode"];
const counts = {};
for (const p of platforms) counts[p] = {cited: 0, total: 0};
for (const [id, entry] of Object.entries(log)) {
  const q = queries[id];
  if (!q) continue;
  for (const p of platforms) {
    counts[p].total++;
    if (entry.citation_status && entry.citation_status[p] === "cited") counts[p].cited++;
  }
}

lines2.push("## Citation Rate by Platform");
lines2.push("");
lines2.push("| Platform | Cited | Total | Rate |");
lines2.push("|---|---|---|---|");
for (const p of platforms) {
  const c = counts[p];
  const rate = c.total ? Math.round(c.cited * 100 / c.total) + "%" : "0%";
  lines2.push("| " + p + " | " + c.cited + " | " + c.total + " | " + rate + " |");
}
lines2.push("");
lines2.push("## Per-Query Detail");
lines2.push("");
for (const [id, entry] of Object.entries(log)) {
  const q = queries[id];
  if (!q) continue;
  const status = Object.entries(entry.citation_status || {}).map(([p, v]) => p + ":" + v).join(", ");
  lines2.push("- **" + id + "** (" + (q.query || "") + "): " + status);
}

const outPath = path.join(OUT_DIR, "citation-report-" + week + ".md");
fs.writeFileSync(outPath, lines2.join("\n") + "\n", "utf8");
console.log("OK wrote", outPath);

