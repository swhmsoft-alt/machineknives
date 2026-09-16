# Query Acquisition System — Methodology (V1.0)

> AI Search 时代没有"官方 Query Planner"。我们必须自己建一套 **Query Acquisition Stack**，
> 把 5 类数据源里的查询统一登记进 Query Database，然后形成 **Query Universe**，再产出
> **Prompt Matrix** 去测试 AI，最终落地到内容、citation 监控和 RFQ 转化。

## 1. 数据源（5 类，13+ 个 source_type）

| Tier | Source                            | source_type     | reliability       | V1.0 录入方式        |
| ---- | --------------------------------- | --------------- | ----------------- | -------------------- |
| L1   | Google Search Console             | `gsc`           | `actual`          | 人工导出 CSV → 录入  |
| L1   | Google Keyword Planner            | `gkp`           | `search_data`     | 人工导出 CSV → 录入  |
| L2   | SERP Autocomplete / PAA / Related | `serp_*`        | `observed`        | 浏览器抓取 → 录入    |
| L2   | Google AI Mode                    | `ai_mode`       | `observed`        | 浏览器观察 → 录入    |
| L3   | ChatGPT / Gemini / Perplexity     | `chatgpt` 等    | `generated`       | 对话日志 → 录入      |
| L3   | LLM Fan-Out 模拟                  | `llm_fanout`    | `generated`       | 多角色 prompt → 录入 |
| L4   | RFQ / 客户邮件 / LinkedIn 询问    | `rfq` 等        | `buyer_evidence`  | 销售归档 → 录入      |
| L4   | Reddit / 论坛 / 行业社区          | `forum`         | `buyer_evidence`  | 浏览器观察 → 录入    |
| L5   | 竞品内容（标题/H2/FAQ）           | `competitor`    | `competitive`     | 人工核对 → 录入      |
| L5   | 标准文档 / 技术手册               | `standards_doc` | `domain_evidence` | 人工核对 → 录入      |

完整字典见 [`taxonomy.source-type.yaml`](./taxonomy.source-type.yaml)。

## 2. 工作流（5 步）

详见 [`workflow.md`](./workflow.md)。一句话：**Seed → Acquire → Tag → Test → Feedback**。

## 3. 数据 Schema

每个 `query` 强制 9 个字段：`id` / `entity_id` / `query` / `source` / `source_type` / `reliability` / `added_by` / `captured_at` / `language`。
完整字段定义见 [`schema.query.yaml`](./schema.query.yaml)（共 22 个字段）。

## 4. 不做的事（V1.0 边界）

- ❌ 不写 GSC API 自动抓取（GSC 不公开 query 字符串）
- ❌ 不写 SERP 爬虫（ToS 与反爬风险）
- ❌ 不写 AI Test Runner（V2.0 再说）
- ❌ 不创建 Astro 页面（保持纯数据层）
- ❌ 不修改 `astro.config` / `content.config` / `navigation`

## 5. 当前实例

KAIPU 实例化首批种子见 `src/data/query-acquisition/`。
