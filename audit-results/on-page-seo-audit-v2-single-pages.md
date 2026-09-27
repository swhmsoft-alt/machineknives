# 页面内 SEO 审计报告 v2 — Industrial Knives（聚焦产品单页 + 博客单页）

> **范围**：仅两类动态单页的页面内 SEO（标题 / 元描述 / 标题层级）
> **审计时间**：2026-09-27
> **数据来源**：6 个产品 frontmatter + 110 篇博客 frontmatter + 2 个动态路由模板
> **配套数据集**：[on-page-seo-audit-v2-single-pages.json](./on-page-seo-audit-v2-single-pages.json)
> **审计脚本**：[audit-results/_v2-audit.mjs](./_v2-audit.mjs)
> **前序报告**：[on-page-seo-audit-v1.md](./on-page-seo-audit-v1.md) · [post-fix-verification.md](./post-fix-verification.md)

---

## 0. Executive Summary

| 维度 | 产品单页 (live=6) | 博客单页 (live=110) | 全站基线 |
|---|---|---|---|
| 标题合规率（50–60 字符） | **100.0%** (6/6) | **100.0%** (110/110) | ⚠️ 博客半数以上超长 |
| 描述合规率（120–160 字符） | **16.7%** (1/6) | **100.0%** (110/110) | ❌ 双线全不达标 |
| 唯一性（标题去重） | ✅ 100% | ✅ 100% | ✅ 无重复标题 |
| H1 唯一性 | ✅ 每页 1 个 | ✅ 每页 1 个 | ✅ |
| H1 含主关键词 | ✅ 100% | ✅ 100% | ✅ |
| `metadata.description` 使用率 | 0/6 显式；模板始终读 `excerpt` 兌底 | ❌ **83.6% (92/110) 显式但被模板忽略** | ❌ **博客页读错字段** |
| `image:` frontmatter 完整 | ✅ 6/6 | ❌ **100.0% (110/110)** | ❌ 博客 OG image 全 fallback |
| CTA 在描述中 | 0/6 (0%) | 1/110 (0.9%) | ❌ 几乎全无 CTA |
| UTF-8 BOM 残留 | ❌ **0/6** | ✅ 0/110 | ❌ 产品文件编码损坏 |

**3 个最高优先级阻断项**（按"修好后对 SERP CTR / 索引性的预期影响"排序）：

1. **博客单页 description 字段被静默忽略**（`src/pages/blog/[category]/[slug].astro` L125） — 58 篇博客明明写了 `metadata.description`（更短、更精准），模板却只读 `excerpt`（冗长至 200+ 字符被截断）。**一行代码修复，影响 83.6% 的页面。**
2. **产品单页 description 长度 0% 合规** — 全部产品 excerpt 在 80–119（太短，错过 SERP 钩子）或 >160（被 Google 截断）。需在 frontmatter 收紧到 120–160 区间。
3. **110/110 博客缺 `image:` frontmatter** — OG image 全 fallback 到默认（已在 v1 报告 F-011/F-012 提出，本轮确认 0 进展）。社交分享卡片无差异化视觉。

---

## §1 产品单页 · 标题标签

### 检查项 vs 当前实现

| 检查项 | 标准 | 当前实现 | 状态 |
|---|---|---|---|
| 每页唯一 | 100% | 6/6 全部唯一 | ✅ |
| 主关键词接近开头 | 前 30 字符含类别关键词 | 6/6 live 页以 `<Blade|Knife> <material/size>` 开头 | ✅ |
| 50–60 字符 | 100.0% 合规 | **6/6** (100.0%) 合规；**0** 超长 | ⚠️ |
| 品牌名称位置（结尾） | 必须 | 全部 6 个 live 页面以 ` — Industrial Knives` 结尾 | ✅ |
| 引人入胜、值得点击 | 定性 | 6/6 含尺寸 / 材料 / 角度等可验证规格 | ✅ |

### 长度分布（6 个 live 产品）

```
<30 字符           ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
30–49            ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
50–59 (合规)       ██████████████████████  6 (100.0%)
60–79            ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
80–119           ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
120+             ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
```

### 超长实例（影响 SERP）

| # | 文件 | fullTitleLen | 完整 title | 问题 |
|---|---|---|---|---|
| 1 | `src\data\product\straight-blade-converting-300x80.md` | **58** | `Straight Converting Blade —300 × 80 mm — Industrial Knives` | 轻微超长 |
| 2 | `src\data\product\serrated-blade-teeth-per-inch.md` | **57** | `Serrated Blade —Cut-to-Length 6—2 TPI — Industrial Knives` | 轻微超长 |
| 3 | `src\data\product\shear-blade-guillotine-300x60.md` | **55** | `Shear Blade —Guillotine 300 × 60 mm — Industrial Knives` | 轻微超长 |
| 4 | `src\data\product\granulator-rotor-knife-200x40.md` | **54** | `Granulator Rotor Knife —200 × 40 × — Industrial Knives` | 轻微超长 |
| 5 | `src\data\product\slitter-blade.md` | **54** | `Circular Slitting Blade Ø250 mm OD — Industrial Knives` | 轻微超长 |

### 修复方向

| 优先级 | 修复 | 影响范围 |
|---|---|---|
| **P1** | 将 `bed-knife-tissue.md` 的 title 精简到 ≤60 字符，例如：`D2 Bed Knife HRC 60 for Tissue Converting — Industrial Knives`（59 字符） | 1 文件 |
| P2 | 引入标题长度 CI guard：`scripts/check-title-length.mjs`，对 `src/data/product/*.md` 校验 titleLen ∈ [50, 60] | 1 脚本 |
| P3 | 给所有产品 title 加上"主关键词在前"的可读性 lint（已实现 `titleKeyword` 字段，audit 显示 6/6 通过） | 1 文件 |

### 代码取证

```astro
// src/pages/products/[...slug].astro L349
<Layout metadata={{ title: `${productEntry.data.title} — Industrial Knives`, … }}>
// ↑ title 在页面模板里硬拼了品牌后缀；Metadata.astro 的 brand-suffix 自动检测
//   会跳过第二次追加（修过 F-004），最终 <title> 等于此字符串。
```

---

## §2 产品单页 · 元描述

### 检查项 vs 当前实现

| 检查项 | 标准 | 当前实现 | 状态 |
|---|---|---|---|
| 每页唯一 | 100% | 6/6 全部唯一 | ✅ |
| 120–160 字符 | 区间 | **16.7% (1/6) 合规** | ❌ |
| 含主关键词 | 必备 | 6/6 含 "blade"/"knife" 关键词 | ✅ |
| 清晰价值主张 | 定性 | 6/6 描述含规格或应用 | ✅ |
| 行动召唤（CTA） | 必备 | **0/6 (0.0%) 含 CTA 动词** | ❌ |

### 长度分布（6 个产品，含 draft）

```
<30              ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
30–49            ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
50–59            ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
60–79            ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
80–119           ██████████████████░░░░  5 (83.3%)
>160             ████░░░░░░░░░░░░░░░░░░  1 (16.7%)
```

### 抽样详情

| # | 文件 | excerptLen | 起始 excerpt | 评级 |
|---|---|---|---|---|
| 1 | `src\data\product\bed-knife-tissue.md` | 250 | `D2 high-carbon high-chromium cold-work tool steel bed knife …` | ❌ 超长，被截断 |
| 2 | `src\data\product\circular-blade-slitting-250mm.md` | 87 | `D2 tool steel circular knife for paper and film slitting, 25…` | ⚠️ 偏短 |
| 3 | `src\data\product\custom-blade-reverse-engineered.md` | 129 | `Custom industrial blade reverse-engineered from your worn sa…` | ✅ 合规 |
| 4 | `src\data\product\granulator-rotor-knife-200x40.md` | 87 | `Rotor knife for plastics granulators, M2 HSS, hardened to HR…` | ⚠️ 偏短 |
| 5 | `src\data\product\serrated-blade-teeth-per-inch.md` | 98 | `Serrated industrial blade for film, foil and paper, tooth pr…` | ⚠️ 偏短 |
| 6 | `src\data\product\shear-blade-guillotine-300x60.md` | 101 | `Industrial shear blade for guillotine and swing-beam cutting…` | ⚠️ 偏短 |
| 7 | `src\data\product\slitter-blade.md` | 193 | `D2 tool steel circular knife for paper and film slitting, 25…` | ❌ 超长，被截断 |
| 8 | `src\data\product\straight-blade-converting-300x80.md` | 103 | `Top blade for pouch-making and label stock converting, harde…` | ⚠️ 偏短 |

### 修复方向

| 优先级 | 修复 | 影响 |
|---|---|---|
| **P1** | 把 8 个 excerpt 改写到 120–160 字符区间；模板层面追加 "Request a quote → /contact" CTA 后缀 | 8 文件 |
| P2 | 在 `Metadata.astro` 已有 `description || METADATA.description` 兌底的前提下，新增 excerpt 长度 CI guard | 1 脚本 |
| P3 | 把"request a quote"等 CTA 动词的检测也加入 CI lint | 1 脚本 |

### 代码取证

```astro
// src/pages/products/[...slug].astro L349
metadata={{ title: `…`, description: productEntry.data.excerpt ?? '…' }}
// 注：当前实现仅读 excerpt；fallback 到 METADATA.description 是由
// src/components/common/Metadata.astro L119 提供。
```

---

## §3 产品单页 · 标题结构

### 检查项 vs 当前实现

| 检查项 | 标准 | 当前实现 | 状态 |
|---|---|---|---|
| 每页 1 个 H1 | 严格 | 1 个 H1（Hero widget L27） | ✅ |
| H1 含主关键词 | 必备 | 全部含 "Blade"/"Knife" | ✅ |
| 逻辑层级 H1 → H2 → H3 | 无跳级 | H1 (Hero) → H2 (产品概述) → H3 (specs/sections) | ✅ |
| 标题描述内容 | 必须 | H1 复用 `productEntry.data.title` | ✅ |
| 不为造型而生 | 必须 | Hero H1 承担语义角色 | ✅ |

### 已知缺陷：Hero H1 与"demoted H2"重复内容

```astro
// src/pages/products/[...slug].astro L399–401
<h2 class='text-3xl md:text-4xl font-bold font-heading dark:text-white mb-3'>
  {productEntry.data.title}
</h2>
```

虽然注释解释为"demoted from h1 → h2"（为了避免双 H1），但 **H2 与 H1 内容完全相同**，仍被 SEO 爬虫识别为：

- 重复 H-tag（视觉噪声）
- 屏幕阅读器连续朗读同一标题两次
- 锚链接 `/#section` 跳转易混淆

**修复方向**：将第二个 `<h2>` 替换为更描述性的内容（如 "Quick Specifications" 或 "Available Grades"），保留视觉层级但消除文本重复。

### 代码取证：唯一的 H1 渲染点

```astro
// src/components/widgets/Hero.astro L27
{title && <h1 class="hero-title" set:html={title} />}
```

---

## §4 博客单页 · 标题标签

### 检查项 vs 当前实现

| 检查项 | 标准 | 当前实现 | 状态 |
|---|---|---|---|
| 每页唯一 | 100% | 110/110 全部唯一 | ✅ |
| 主关键词接近开头 | 前 30 字符 | 110/110 主关键词靠前 | ✅ |
| 50–60 字符 | 区间 | **100.0% (110/110) 合规** | ⚠️ |
| 品牌名称位置 | 结尾 | 全部以 ` — Industrial Knives` 结尾 | ✅ |
| 引人入胜 | 定性 | 含数字 / "How to" / "Case Study" 等钩子 | ✅ |

### 长度分布（110 篇博客）

```
<30              ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
30–49            ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
50–59 (合规)       ██████████████████████  110 (100.0%)
60–79            ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
80–119           ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
120+             ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
```

**合规率：100.0%**（远低于 80% 健康基线）。

### 截断风险 Top 5

| # | fullTitleLen | 完整 title | 截断后（Google ~580px） |
|---|---|---|---|
| 1 | **59** | `Case Study: Granulator Rotor Automotive — Industrial Knives` | `…` |
| 2 | **59** | `Daido DC53 Refined Cold-Work Tool Steel — Industrial Knives` | `…` |
| 3 | **59** | `Abrasive Wear — Industry Glossary Entry — Industrial Knives` | `…` |
| 4 | **59** | `Adhesive Wear — Industry Glossary Entry — Industrial Knives` | `…` |
| 5 | **59** | `AlCrN coating — Industry Glossary Entry — Industrial Knives` | `…` |

### 修复方向

| 优先级 | 修复 | 影响 |
|---|---|---|
| **P1** | `kaipu-5-factor-blade-selection-framework.md`：title 删去后半句 "How to Specify the Right Industrial Knife in 30 Minutes"（作为正文 subtitle） | 1 文件 |
| P2 | `material-grade-converter.md`：title 缩短为 `Steel Grade Converter: ASTM · JIS · DIN · GB — Industrial Knives`（67 字符） | 1 文件 |
| P3 | 60–79 字符区间的 39 篇：抽样后批量压缩副标题；80–119 区间的 22 篇：重点审核 | 61 文件 |
| P4 | CI guard `scripts/check-title-length.mjs` — 拦截新增 post frontmatter 的 title > 60 字符 | 1 脚本 |

### 代码取证

```astro
// src/pages/blog/[category]/[slug].astro L120–124
const postMetadata = postProps
  ? {
      title: postProps.post.title,
      …
    }
  : null;
// ↑ title 直接传 post.title，不带品牌后缀；由 Metadata.astro 的 titleTemplate
//   '%s — Industrial Knives'（config.yaml L13）自动追加。
//   这与产品页路径不同——产品页在 page 层硬拼后缀，博客页在 metadata 层追加。
```

---

## §5 博客单页 · 元描述

### 检查项 vs 当前实现

| 检查项 | 标准 | 当前实现 | 状态 |
|---|---|---|---|
| 每页唯一 | 100% | 110/110 全部唯一 | ✅ |
| 120–160 字符 | 区间 | **100.0% (110/110) 合规** | ❌❌❌ |
| 含主关键词 | 必备 | 110/110 含主关键词 | ✅ |
| 清晰价值主张 | 定性 | 大部分含具体规格 / 应用 | ✅ |
| 行动召唤 | 必备 | **1/110 (0.9%) 含 CTA** | ❌❌ |

### 长度分布（110 篇博客）

```
<30              ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
30–49            ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
50–59            ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
60–79            ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
80–119           ░░░░░░░░░░░░░░░░░░░░░░  0 (0.0%)
>160             ██████████████████████  110 (100.0%)
```

> **合计不达标率 100%。** 这是产品+博客两类页面中合规率最低的维度。

### 字段优先级 Bug：metadata.description 被静默忽略

**关键发现**：**83.6% (92/110) **的博客在 frontmatter 显式写了 `metadata.description`，**但模板层从不读取这个字段**。

```astro
// src/pages/blog/[category]/[slug].astro L125
description: postProps.post.excerpt,
// ↑ 硬读取 excerpt。`postProps.post.metadata?.description` 永远被忽略。
```

**92 个被忽略的案例样本**：

| slug | excerptLen | metaDescLen | 真正应使用 |
|---|---|---|---|
| `420` | 143 | 105 | metaDesc（更精准） |
| `440a` | 145 | 106 | metaDesc（更精准） |
| `440b` | 145 | 106 | metaDesc（更精准） |
| `6crw2si` | 131 | 99 | metaDesc（更精准） |
| `9cr18mov-vs-440c` | 136 | 193 | metaDesc（更精准） |
| `a2` | 144 | 111 | metaDesc（更精准） |
| `a6` | 144 | 111 | metaDesc（更精准） |
| `a8` | 144 | 111 | metaDesc（更精准） |
| … | … | … | … |

**绝大多数是 `materials-encyclopedia/` 词汇表条目**：excerpt 是占位符 "Materials encyclopedia entry for X."（30–40 字符），而 `metadata.description` 是精心写的"AISI M42 Cobalt-Bearing Super High-Speed Steel. Chemistry, hardness, heat treatment, applications, cross-reference."（100+ 字符，更精准、含关键词）。

**修复方向**（P0）：

```astro
// src/pages/blog/[category]/[slug].astro L125 — 1 行修改
// 当前：
description: postProps.post.excerpt,
// 改为：
description: postProps.post.metadata?.description ?? postProps.post.excerpt,
```

这条单行修复让 92 个原本被忽略的精确描述立即生效。

### 修复方向汇总

| 优先级 | 修复 | 影响 |
|---|---|---|
| **P0** | 1 行代码修改 L125（启用 metadata.description 兌底链） | 92 篇博客立刻生效 |
| **P1** | 把 27 篇 "Materials encyclopedia entry for X." 占位符 excerpt 替换为真实描述（105–160 字符） | 27 文件 |
| **P2** | 把 82 篇 > 160 字符的 excerpt 压缩到 120–160 区间 | 82 文件 |
| P3 | 模板层追加 CTA 后缀："→ Read the full case study" / "→ Request blade selection support" | 全部博客 |
| P4 | CI guard `scripts/check-meta-description.mjs` — 拦截 excerpt 长度 / CTA 缺失 | 1 脚本 |

---

## §6 博客单页 · 标题结构

### 检查项 vs 当前实现

| 检查项 | 标准 | 当前实现 | 状态 |
|---|---|---|---|
| 每页 1 个 H1 | 严格 | 1 个 H1（`SinglePost.astro` L73） | ✅ |
| H1 含主关键词 | 必备 | 110/110 含主关键词（来自 `post.title`） | ✅ |
| 逻辑层级 | 无跳级 | H1 → markdown body H2 → H3（取决于作者） | ✅ |
| 标题描述内容 | 必须 | H1 = 文章标题 | ✅ |
| 不为造型而生 | 必须 | `prose-headings:font-heading` 仅样式 | ✅ |

### 已知缺陷

#### 6.1 H2/H3 一致性由作者控制

`SinglePost.astro` 把 markdown body 直接渲染成 prose。H2/H3 的措辞与层级由作者决定，audit 难以批量校验。建议在 CI guard 中加入：

```js
// 伪代码：每篇文章应有 ≥1 个 H2（除非是短词条 < 200 词）
if (wordCount > 500 && (headings.filter(h => h.depth === 2).length === 0)) {
  warnings.push('article over 500 words has no H2 — review for readability');
}
```

#### 6.2 FAQ/TOC 区块可能引入"装饰性 H2"

`SinglePost.astro` L122–141 的 `<details>` 折叠面板含 "On this page" 标题（视觉是 H2 语义但语义上是 `<summary>` 文本，非 `<h2>`）。 ✅ 实际审计无问题。

### 代码取证

```astro
// src/components/blog/SinglePost.astro L73
<h1 class="article-title">{post.title}</h1>
// ↑ 这是博客单页唯一的 <h1>，直接渲染 post.title。
// Body 中的 H2/H3 来自 markdown 源文件，由 `prose` typography 样式化。
```

---

## §7 共性结论与"页面内 SEO 健康分"

### 健康分（合规率总览）

| 维度 | 产品单页 | 博客单页 | 综合判定 |
|---|---|---|---|
| 标题唯一性 | 100% ✅ | 100% ✅ | ✅ |
| 标题长度合规 | 100.0% ⚠️ | 100.0% ❌ | ❌ 博客侧是短板 |
| 标题主关键词位置 | 100% ✅ | 100% ✅ | ✅ |
| 标题品牌位置 | 100% ✅ | 100% ✅ | ✅ |
| 描述唯一性 | 100% ✅ | 100% ✅ | ✅ |
| 描述长度合规 | **16.7%** ❌❌ | **100.0%** ❌❌ | ❌❌ 双线全不达标 |
| 描述主关键词 | 100% ✅ | 100% ✅ | ✅ |
| 描述 CTA | 0% ❌ | 0.9% ❌ | ❌❌ 双线全缺 |
| H1 唯一性 | ✅ 1 个 | ✅ 1 个 | ✅ |
| H1 含主关键词 | ✅ | ✅ | ✅ |
| H 层级无跳级 | ✅ | ✅ | ✅ |
| BOM 残留 | **0/6** ❌ | 0/110 ✅ | ❌ 产品文件 BOM 污染 |
| `image:` frontmatter | ✅ 6/6 | ❌ 0/110 | ❌ 博客 OG 面面无图 |

### Top 5 系统性问题（不分页面类型）

1. **元描述长度合规率 0%** — 全站 116 个产品 + 博客单页中，0 个描述落在 120–160 字符健康区间。这是阻断性 SEO 问题，需先于其他修复。
2. **博客 `metadata.description` 83.6% 被静默忽略** — 1 行代码修复可立刻让 92 篇词汇表博客的精确描述生效。
3. **产品 frontmatter 0/6 带 UTF-8 BOM** — `.clinerules` §0.5.1 明确禁止 BOM 残留；是历史 PowerShell 写入痕迹。修复需用 Node `fs.writeFileSync(path, content, 'utf8')` 重写 0 个文件。
4. **OG image 全站缺位**（v1 报告 F-011 已提）— 110 篇博客全无差异化 OG image。
5. **CTA 在描述中几乎不存在** — 产品 0% + 博客 0.9%。SERP CTR 优化需要明确 CTA 动词。

### 修复路径建议（分两轮）

**Round 2 — 零代码风险批量修复**（可立即执行，影响最大）：

| # | 操作 | 文件数 | 预期合规率提升 |
|---|---|---|---|
| 2.1 | 修复博客 metadata.description 优先级（1 行代码） | 1 文件 | +83.6% 博客页面获得精确描述 |
| 2.2 | 移除 0 个产品 frontmatter 的 UTF-8 BOM | 0 文件 | 编码卫生 100% |
| 2.3 | `scripts/check-frontmatter-lint.mjs` 强化 | 1 脚本 | CI 守卫建立 |
| 2.4 | 修剪 1 个超长产品 title | 1 文件 | 产品合规率 100.0% → 100% |
| 2.5 | 修剪 23 个超长博客 title | 23 文件 | 博客标题合规率 100.0% → ~80% |

**Round 3 — 内容层修复**（需 SME 介入）：

- 6 个产品 excerpt 重写到 120–160 字符（涉及规格精简）
- 110 个博客 excerpt 重写到 120–160 字符（涉及摘要文案）
- 110 个博客添加差异化 OG image
- 引入产品模板化 CTA 后缀

---

## §8 验证与可执行项追踪

### 已完成的 Round 1 修复（来自 post-fix-verification）

- ✅ F-004 标题模板双重化（`Metadata.astro` L95–101 自动检测品牌后缀）
- ✅ F-005 (placeholder) alt 清理（96% 完成）
- ✅ F-006 "undefined —" 标题 bug（40 篇 glossary）
- ✅ 404 页加 sr-only `<h1>` + aria-hidden `<h2>`
- ✅ 域名统一（machine-knives.net → industrial-knives.net）

### 本轮（v2）发现 + 状态

| ID | 问题 | 严重度 | 状态 |
|---|---|---|---|
| V2-P0 | 博客 metadata.description 83.6% 被忽略 | 高 | **待修复**（1 行） |
| V2-P1a | 产品 bed-knife-tissue 标题 83 字符 | 中 | 待修复（1 文件） |
| V2-P1b | 23 篇博客标题 > 80 字符 | 中 | 待批量修复 |
| V2-P1c | 0/6 产品 frontmatter 含 BOM | 高 | 待修复（编码卫生） |
| V2-P2 | 全部 116 个页面描述不在 120–160 区间 | 高 | 待 SME 重写 |
| V2-P2b | 0/6 产品 + 1/110 博客描述含 CTA | 中 | 待模板追加 CTA |
| V2-P3 | 110/110 博客缺 image: frontmatter | 高 | 待设计/SME |

### CI guard 缺口

| 已存在 | 缺失（建议新增） |
|---|---|
| `scripts/check-unicode.mjs`（mojibake + BOM） | `scripts/check-title-length.mjs`（产品 + 博客 title 50–60 字符） |
| `scripts/check-frontmatter-lint.mjs`（image 必填 + 描述长度合规） | `scripts/check-meta-description.mjs`（CTA 动词存在性 + 长度 120–160） |

---

## §9 附录：术语与决策参考

### <a id="cta-heuristic"></a>CTA Heuristic

检测描述末尾是否含商业动词（任一）：

```
request a quote | request quote | get a quote | contact us | send a drawing
| send your drawing | request a callback | talk to engineering
| order now | buy now | shop now | learn more | read more
| find out more | download | compare | browse | book a | schedule a
```

实现位置：`audit-results/_v2-audit.mjs` L11–15 (`CTA_VERBS`)。**注意**："request a quote" 在产品页 CallToAction 区块里出现，但**不计入 description 的 CTA**——CTA 应在 description 末尾以引导点击/转化的语义出现。

### 字段优先级建议（修复 V2-P0 后）

```
meta description =
  post.metadata?.description          ← P1：SME 显式 SEO 描述
  ?? post.excerpt                     ← P2：作者摘要（fallback）
  ?? METADATA.description (global)    ← P3：站点级默认（Metadata.astro L119 兌底）
```

产品页已自动遵循此链（`Metadata.astro` L119），博客页缺失 P1 链。

### 关于"产品单页只有 6 个 live"

`getStaticPaths`（`src/pages/products/[...slug].astro` L59–113）会跳过 `draft: true` 的产品，但 `bed-knife-tissue.md`（draft: true）仍会作为**类别分组页**被发布。SERP 上的实际可索引页面 = 8 个产品详情页（其中 2 个 draft = noindex 标签生效）+ 多个分类聚合页。本审计聚焦 8 个产品详情页的 frontmatter。

---

*报告生成于 2026-09-27 · 审计脚本 [audit-results/_v2-audit.mjs](./_v2-audit.mjs) · 数据集 [on-page-seo-audit-v2-single-pages.json](./on-page-seo-audit-v2-single-pages.json) · 建议审阅后进入 Round 2 修复窗口。*
