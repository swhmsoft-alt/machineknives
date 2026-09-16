# Query Acquisition Workflow (V1.0)

五步 SOP，每步都有产出物 + 校验命令。

## Step 1 — Seed（种子建立）

- 来源：`entities.yaml` 中每个 entity 的 `seed_queries` 字段
- 产出：`queries.seed.yaml` 中的 `origin: seed` 条目
- 校验：`npm run query:audit -- --check=seed`

## Step 2 — Acquire（采集）

- 操作：人工 / 半自动从 5 类数据源采集新查询
- 录入纪律：每条 query 必填 9 个强制字段（见 schema.query.yaml）
- 产出：`queries.seed.yaml` 新增条目
- 校验：`npm run query:audit -- --check=provenance`

## Step 3 — Tag（打标签）

- 必填字段：`entity_id` / `buyer_role` / `funnel_stage` / `intent`
- 选填字段：`task` / `information_requirement` / `evidence_requirement`
- 受控字典见 `taxonomy.buyer-role.yaml`
- 校验：`npm run query:audit -- --check=tags`

## Step 4 — Test（AI 搜索测试）

- 入口：从 `queries.seed.yaml` 选 N 条高频 query → 转化为 `prompts.seed.yaml`
- 跑分：在 ChatGPT / Gemini / Perplexity / AI Mode 4 个通道人工跑分
- 记录：`citations.log.yaml` 新增条目
- V1.0 状态：占位空表，待人工填写
- 校验：`npm run query:audit -- --check=citations`

## Step 5 — Feedback（反馈）

- 把胜出的 prompt → 转化为内容 brief
- 把失败的 query → 退回 Step 2 重新打标签或拆分
- 周节奏：每周固定时间复盘

## 强制纪律（违反任意一条 → 不入库）

1. **Generated ≠ Actual**：AI 生成的 query 必须打 `reliability: generated`，禁止与 GSC/RFQ 等量齐观。
2. **Entity-First**：禁止孤儿 query。每条 query 必须挂在一个 `entity_id` 下。
3. **不删旧的**：schema 演化通过 `schema_version` 字段向后兼容，不删条目。
4. **id 唯一**：每条 query 的 `id` 必须全局唯一（kebab-case-friendly）。
