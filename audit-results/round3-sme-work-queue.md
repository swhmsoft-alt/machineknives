# Round 3 SME 工作队列 — Industrial Knives

> **生成时间**：2026-09-27
> **来源**：[_v2-audit.mjs](./_v2-audit.mjs) · [on-page-seo-audit-v2-single-pages.md](./on-page-seo-audit-v2-single-pages.md)
> **用途**：SME 团队逐项复核与重写，依此队列为依据
> **原则**：所有需要人工作出的内容都在此备案，**不在队列中的已被工程处理完成**。请在完成后从队列中删除项目并在 commit message 中引用原文件名。

---

## 0. 队列概览

| 类别 | 需人工处理项目数 | 总数 | 占比 |
|---|---|---|---|
| A. 描述超长 (>160) | 0 | 110 博客 | 0.0% |
| B. 描述超短 (<80) | 0 | 110 博客 | 0.0% |
| B’0. 描述缺失 (=0) | 0 | 110 博客 | 0.0% |
| B’1. 描述为占位符 "Materials encyclopedia entry for X." | 0 | 110 博客 | 0.0% |
| C. 标题超长 (>60) | 0 | 110 博客 | 0.0% |
| D. 标题超短 (<50) | 0 | 110 博客 | 0.0% |
| E. 缺 OG image frontmatter | 0 | 110 博客 | 0.0% |
| 产品描述超长 | 0 | 6 产品 | 0.0% |
| 产品描述超短 | 0 | 6 产品 | 0.0% |

**总计**：**0 项需人工处理**（博客侧），要求全部改到 <80、<120 且 >160 区间外 + 110 张 OG 图

---

## A. 描述超长（>160）——需压缩

**总数**：0 篇

**修复路径**：对每篇文章，将 `excerpt`（或优先使用 `metadata.description`）压缩到 120–160 字符。建议阅读全文后提炼 2–3 句核心价值主张。

| # | 文件 | 现有长度 | 预计需压缩至 |
|---|---|---|---|

---

## B. 描述超短（<80）——需扩充

**总数**：0 篇

**修复路径**：对每篇文章扩充为 120–160 字符。重点抽取核心价值主张（胜任的应用场景、主要规格、与同类产品的区别点）。

| # | 文件 | 现有长度 | 现 excerpt |
|---|---|---|---|

### B-1. 描述为占位符 "Materials encyclopedia entry for X."

**总数**：0 篇——这些文件的 `excerpt` 都是生成脚本填的默认文本。可先使用「`metadata.description`」字段作为替代输出（已由 V2-P0 修复启用先走序）；如果 metadata.description 不足，需补写为真实描述。

**上下文**：这些是 `materials-encyclopedia/` 词条，需要 2–3 句包含化学成分、硬度、典型应用三要素的描述。参考已有的完整词条如 `440c`、`d2`、`skd11`。

| # | 文件 | `metadata.description` 现状（若有） |
|---|---|---|

---

## C. 标题超长（>60）——需修剪

**总数**：0 篇

**修复路径**：将 `title` 修剪使「`title` + " — Industrial Knives"」总长度≥60。原则：保留核心主关键词（材料/场景数字），删除说明性文字。

| # | 文件 | fullTitleLen | 现 title |
|---|---|---|---|

---

## D. 标题超短（<50）——需扩充

**总数**：0 篇

**修复路径**：添加主关键词或上下文（例如材料作业、典型应用）使「`title` + " — Industrial Knives"」总长度≥50。

| # | 文件 | fullTitleLen | 现 title |
|---|---|---|---|

---

## E. 缺少 OG image frontmatter（需设计/工程提供）

**总数**：0 / 110

**修复路径**：

1. 为每篇博客设计 1200×630 像素的 OG 卡片（同一系列可共用模板，只换主标题不同文本）
2. 将图片保存到 `public/images/og/` 目录（例如 `public/images/og/materials-encyclopedia-d2.jpg`）
3. 在 frontmatter 中添加 `image: /images/og/<filename>` 字段

**参考模板**：
  • 例：`case-study-granulator-rotor-automotive.md` 需一张发光点以“前/before”、“后/after”对比为背景的卡片
  • 例：`selection-guide-*.md` 需一张表格型的参数选型决策树示意图
  • 例：`materials-encyclopedia-*.md` 可共用同一型钢牌原料样品照片，区分在文本上即可

**当前状态**：

| 类别 | 数量 |
|---|---|

---

## F. 产品描述超长 / 超短

**总数**：0 / 6 live 产品

---

## 工作流程建议

### 优先级序

1. **P0 — 关键资产**：B —— 占位符 excerpt 替换（使用 `metadata.description` 先走，已由 V2-P0 启用；余下需手动补）
2. **P1 — 高 SERP CTR**：C —— 23 篇标题超长修剪（会被 Google 截断）
3. **P2 — 描述优化**：A + B —— 116 个描述重写到 120–160 区间
4. **P3 — 社交卡片**：E —— 110 张 OG 图

### 批量修改脚本（仅供参考）

如果你需要一个脚本辅助批量修改，请使用以下流程：

```bash
# 1. 创建一份备份
cp src/data/post/glossary-chipping.md src/data/post/glossary-chipping.md.bak

# 2. 手动编辑 frontmatter，保存后运行
node scripts/check-frontmatter-lint.mjs

# 3. 确认仅余未解决项目（预期只剩 E 部分）
```

### 使用 Round 3 后的工具

修改后运行：

```bash
node audit-results/_v2-audit.mjs && node audit-results/_v2-report.mjs && node scripts/check-frontmatter-lint.mjs
```

**预期**：

- `node audit-results/_v2-audit.mjs` 会生成新数据集，标题/描述合规率提升
- `node audit-results/_v2-report.mjs` 会重新生成报告，反映修复后状态
- `node scripts/check-frontmatter-lint.mjs` 仍会输出 warnings（超过未修复部分），但不会阻塞 CI
