#!/usr/bin/env node
/**
 * build-encoding-review.mjs — produces the F-007 encoding-damage review
 * queue. Reads _analysis.jsonl, groups every em-dash + digit-gap hit by file,
 * and emits a Markdown table the SME (product/engineering) team can use to
 * fill in the actual digit values that were eaten by the GBK round-trip.
 *
 * Output: audit-results/encoding-review-v1.md
 *
 * Per .clinerules §0.5.3, AI agents MUST NOT guess missing digits. This
 * report is the controlled handoff to humans.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const raw = readFileSync('c:/Users/User/Desktop/machineknives/audit-results/_analysis.jsonl', 'utf8').trim().split('\n');
const map = {};
for (let i = 0; i < raw.length; i += 2) {
  const key = raw[i].match(/<<<SECTION:([A-Z_]+)>>>/)[1];
  map[key] = JSON.parse(raw[i + 1]);
}

const encodingHits = map.ENCODING.hits;

const md = [];
const push = (s) => md.push(s);
push('# F-007 编码损坏审查队列 — Industrial Knives');
push('');
push('> **目的**：本文档列出 Round 1 审计发现的所有 126 处 GBK→UTF-8 编码损坏，');
push('> 等待 **产品/工程团队** 提供准确的数字。**禁止 AI 猜测补全**（`.clinerules` §0.5.3）。');
push('');
push('## 损坏模式');
push('');
push('原文（GBK 损坏后）       原文意图（UTF-8）');
push('`"40—00 gsm"`        →    `"40–200 gsm"`      (en-dash + 两位数字被吃)');
push('`"12—00 µm"`         →    `"12–100 µm"`');
push('`"6—0 µm"`           →    `"6–40 µm"`');
push('`"HRC 58—2"`         →    `"HRC 58–62"`');
push('`"5—5 µm"`           →    `"5–15 µm"`');
push('`"4— weeks"`         →    `"4–6 weeks"`');
push('`"200 × 40 × 20 mm"` →    `"200 × 40 × 20 mm"`（× 可能被译为 `脳`）');
push('');

// Group by file
const byFile = new Map();
for (const h of encodingHits) {
  if (!byFile.has(h.file)) byFile.set(h.file, []);
  byFile.get(h.file).push(h);
}

// Summary table by file
push('## 损坏分布（按文件）');
push('');
push('| 文件 | 损坏数 |');
push('|---|---|');
const fileEntries = [...byFile.entries()].sort((a, b) => b[1].length - a[1].length);
for (const [f, hits] of fileEntries) push(`| \`${f}\` | ${hits.length} |`);
push('');
push(`**总计**：${encodingHits.length} 处，跨 ${byFile.size} 个文件。`);
push('');

// Detailed review per file
let serial = 1;
for (const [f, hits] of fileEntries) {
  push(`## \`${f}\`（${hits.length} 处）`);
  push('');
  push('| # | 行 | 当前损坏文本（截取） | 期望值（待 SME 填写） |');
  push('|---|---|---|---|');
  for (const h of hits) {
    const truncated = h.snippet.length > 90 ? h.snippet.slice(0, 90) + '…' : h.snippet;
    push(`| ${serial++} | ${h.line} | \`${truncated.replace(/\|/g, '\\|')}\` | _[TODO: SME]_ |`);
  }
  push('');
}

push('---');
push('');
push('## SME 工作流');
push('');
push('1. 按 `#` 顺序逐行审查（每个文件单独一批，提高效率）');
push('2. 在"期望值"列填写准确数字，例如 `40–200 gsm`、`58–62 HRC`、`5–15 µm`');
push('3. 若规格**不存在**或**不可公开**，保留 `[MISSING SPEC: ...]` 占位符');
push('4. 完成后，由工程团队使用编辑工具或 `fix-unicode.mjs`（项目自带）执行批量替换');
push('5. 替换后执行 `node scripts/check-unicode.mjs` 验证');
push('');
push('## 建议优先级');
push('');
push('| 优先级 | 文件 | 业务影响 |');
push('|---|---|---|');
push('| P0 | `src/pages/industries/printing-packaging.astro` | 客户最常搜索的规格参数 |');
push('| P0 | `src/pages/industries/paper-tissue.astro` | 19 处损坏，最严重 |');
push('| P0 | `src/data/product/slitter-blade.md` | 高价值产品页 |');
push('| P1 | `src/pages/industries/metalworking.astro` | 10 处 |');
push('| P1 | `src/pages/industries/food-processing.astro` | 8 处 |');
push('| P1 | `src/pages/industries/plastics-recycling.astro` | 8 处 |');
push('| P2 | `src/data/product/granulator-rotor-knife-200x40.md` | 6 处 |');
push('| P2 | `src/pages/industries/converting.astro` | 6 处 |');
push('| P3 | 其他 8 个文件 | 共 24 处 |');
push('');
push('---');
push('');
push('## 不在本报告中的内容');
push('');
push('- 已通过 `fix-unicode.mjs` 修复但保留 `[MISSING SPEC: ...]` 占位符的位置（需 SME 走专门队列）');
push('- 图像文件名、URL slug 等结构化资产中的乱码（独立审计项）');
push('');
push('---');
push('');
push(`*报告生成于 ${new Date().toISOString().slice(0, 10)}，由 audit-results/build-encoding-review.mjs 自动产出。*`);
push(`*对应 Round 1 审计 F-007（severity: high，requires_human_input: true）。*`);

writeFileSync('c:/Users/User/Desktop/machineknives/audit-results/encoding-review-v1.md', md.join('\n'), 'utf8');
console.log(`Wrote encoding-review-v1.md (${md.length} lines, ${serial - 1} entries)`);