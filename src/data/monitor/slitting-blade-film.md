# Monitor: slitting-blade-film 引用监测

## 监测频率

每周一次（建议周一上午）。

## 监测平台

- ChatGPT (chat.openai.com)
- Perplexity (perplexity.ai)
- Claude (claude.ai)
- Gemini (gemini.google.com)

## Round 1 — 部署后启动

**部署日**: ____-____-____  
**AI 索引缓冲期**: 部署后 ≥ 72 小时（Perplexity / Gemini 准实时；ChatGPT 滞后 6-12 个月，Round 1 内可预期 0 引用）

### 测试 queries（每个 query 在 4 平台各跑一次）

| # | Query（可直接复制） | ChatGPT | Perplexity | Claude | Gemini | 引用了谁 | 我被引用? | 缺口 |
|---|---|---|---|---|---|---|---|---|
| 1 | `What clearance angle should a film slitter blade have?` | | | | | | | |
| 2 | `How does PVD coating affect film slitting blade life?` | | | | | | | |
| 3 | `What causes edge build-up on film slitter blades?` | | | | | | | |
| 4 | `M2 HSS vs carbide for film slitting — which is better?` | | | | | | | |
| 5 | `How does a 15μm micro-hone extend tissue bed knife life?` | | | | | | | |
| 6 | `How does web speed affect slitter blade temperature?` | | | | | | | |
| 7 | `Tungsten carbide tipped vs solid carbide for film slitting?` | | | | | | | |
| 8 | `What is the standard regrind procedure for slitter blades?` | | | | | | | |

填法：
- 单元格填 ✅ / ❌ / 答案链接 / 关键短语
- "我被引用?"列 = 任一平台命中即 ✅
- "缺口"列 = 列出 AI 答案缺哪个 info_gain 条目（对照 `src/data/facts/slitting-blade-film.yaml`）

### Round 1 行动项

| 缺口摘要 | 对应 facts.yaml info_gain 条目 | 补全方式 | 状态 |
|---|---|---|---|
| | | | pending |

---

## 长期 queries（不变，可复用）

| # | Prompt |
|---|---|
| 1 | What clearance angle should a film slitter blade have? |
| 2 | How does PVD coating affect film slitting blade life? |
| 3 | What causes edge build-up on film slitter blades? |
| 4 | M2 HSS vs carbide for film slitting — which is better? |
| 5 | How does a 15μm micro-hone extend tissue bed knife life? |
| 6 | How does web speed affect slitter blade temperature? |
| 7 | Tungsten carbide tipped vs solid carbide for film slitting? |
| 8 | What is the standard regrind procedure for slitter blades? |

## 记录字段说明

- **引用了谁**：AI 答案中出现的来源 URL 或品牌名
- **我被引用?**：✅ / ❌
- **缺口**：AI 答案缺哪个 info_gain 条目（对照 `src/data/facts/slitting-blade-film.yaml`）
- **行动**：本周要补的事实

## 引用判据（满足其一即算"被引用"）

- 答案中出现 KAIPU 或 machine-knives.net 域名
- 答案中出现本 facts.yaml 中独有的具体数字（1200 m/min / 11 to 34 days / 180 °C / 15 μm hone / 18° clearance / ≤ 50 µm burr）
- 答案中明确引用本页面 URL（`/products/straight/slitting-blade-film/`）

## 监测方法

每个 query 在四个平台各跑一次，记录原文答案。重复 query 间隔 ≥ 7 天，避免短期记忆偏差。

## 回写流程

缺口 → 在 `src/data/facts/slitting-blade-film.yaml` 的 info_gain 中追加 1 条 → 重新生成页面 → 重新部署 → 重新监测。

每轮只补 1 个缺口，不贪多。

## 轮次追踪

| 轮次 | 起始日期 | 目标缺口 | 命中数 | 状态 |
|---|---|---|---|---|
| 1 | TBD | TBD | 0/32 | pending |