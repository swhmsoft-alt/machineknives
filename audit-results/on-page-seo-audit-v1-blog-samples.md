# 博客抽样附录 — Round 1 抽样清单与摘要

> **配套报告**：[on-page-seo-audit-v1.md](./on-page-seo-audit-v1.md)
> **抽样方法**：分层抽样，确保覆盖 3 种 type（article/glossary/comparison）、不同 category、不同字数档
> **生成于**：2026-09-27

---

## 抽样总览

| # | 抽样槽位 | 文件 | type | category | 词数 | 描述长 | image | 抽样理由 |
|---|---|---|---|---|---|---|---|---|
| 1 | article/case-studies | `case-study-granulator-rotor-automotive.md` | article | case-studies | 1870 | 323 | ❌ | case-studies 集群最长文章 |
| 2 | article/selection-guide | `selection-guide-shear-blade-plate-steel.md` | article | selection-guide | 1675 | 295 | ❌ | selection-guide 集群最长 |
| 3 | article/maintenance | `maintenance-slitting-blade-life.md` | article | maintenance | 1797 | 305 | ❌ | maintenance 集群最长 |
| 4 | article/troubleshooting | `troubleshooting-premature-wear.md` | article | troubleshooting | 1907 | 288 | ❌ | troubleshooting 集群最长 + 整站最长 |
| 5 | glossary/material | `materials-encyclopedia-440c.md` | glossary | materials-encyclopedia | 212 | 207 | ❌ | material entityType 代表 |
| 6 | glossary/wear-mode | `glossary-chipping.md` | glossary | glossary | 358 | 189 | ❌ | wear-mode term 代表 |
| 7 | glossary/coating | `glossary-pvd-coating.md` | glossary | glossary | 172 | 193 | ❌ | coating term 代表 + **undefined 标题 bug** |
| 8 | comparison/material-grade | `material-grade-converter.md` | comparison | material-grade-converter | 2717 | 275 | ❌ | 唯一深度比较 + 锚文本："ASTM/AISI · JIS · DIN/EN · GB Steel Cross-Reference" |
| 9 | comparison/coating | `coatings-comparison.md` | comparison | coatings-comparison | _待第二轮核实_ | _待核实_ | ❌ | 涂层对比表 |
| 10 | flagship-article | `kaipu-5-factor-blade-selection-framework.md` | article | _(无 category)_ | _待第二轮核实_ | _待核实_ | ❌ | 全站引用最多的内链目标（quality, solutions, industries/index 三处指向） |

---

## Round 1 抽样结论汇总

### 健康维度（无显著问题）

- ✅ **所有 10 篇 frontmatter `title` 字段均已填写**（仅 #7 有 `undefined` 字面量但 frontmatter 字段存在）
- ✅ **所有 10 篇都设置了 `excerpt` 字段**
- ✅ **所有 10 篇都有 `publishDate` 且为同一批次（2026-09-18）**
- ✅ **所有 10 篇都设置了 `author`（统一 "KAIPU Engineering"）**
- ✅ **所有 10 篇都有 `tags`（数量 ≥ 1）**
- ✅ **description 字段超过 160 字符（Google 截断阈值）**，可能需要重写

### 不健康维度（需修复）

- ❌ **10/10 缺 `image:` frontmatter 字段** — OG image 全部走默认值
- ❌ **#7 标题包含 `undefined` 字面量** — 生成脚本 bug
- ❌ **canonical URL 走旧域名 `machine-knives.net`**（取证自 #4 troubleshooting-premature-wear.md L18）
- ❌ **#5 #7 词数 <300**（分别为 212、172、172 词）— thin content 风险
- ❌ **所有 10 篇描述均偏长**（160-330 字符）— 会被 Google 截断到 155 字符
- ❌ **#8 material-grade-converter 标题用 `·` 分隔 4 个标准体系** — 视觉优雅但**搜索可见性分散**（搜索 "ASTM/AISI steel" 的人不会看到分隔符 `·`）

---

## Round 2 抽样建议

下一轮（深度优化）应在以下维度**重新抽样**：

1. **按"修复潜力 × 搜索价值"排序**：从 sample 6/8/10 中挑出 5 篇，结合产品页与行业页做交叉优化
2. **覆盖新 category**：本轮未抽到的 `material-comparison` (5 篇) 与 `troubleshooting` 的 medium-tier 文章
3. **覆盖时间维度**：当前所有 10 篇都是 2026-09-18 批次，Round 2 应补充旧批次（如果存在）
4. **覆盖字数梯度**：本轮 8 篇 ≥ 1500 词，2 篇 < 300 词 — Round 2 应补 300-800 词的"中等"样本

---

## 抽样方法学

```text
Round 1：分层抽样矩阵
  - 维度 1：type ∈ {article, glossary, comparison} — 3 种全覆盖
  - 维度 2：category — 8 个不同 category（10 个 topic 中已覆盖 8 个）
  - 维度 3：字数档 — <300 / 800-1500 / 1500-3000 各覆盖 ≥ 2 篇
  - 维度 4：内链重要性 — 至少 1 篇是站内核心内链目标（#10）
  
抽样规则：每个 (type × category) 组合按 wc 降序取首篇；若冲突，按下一档补充。
```

---

*附录生成于 2026-09-27。完整抽样逻辑见 `audit-results/_sample.mjs` + `_sample2.mjs`。*