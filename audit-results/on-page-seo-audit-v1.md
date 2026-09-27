# 页面级 SEO 审核报告 — Industrial Knives (`machineknives`)

> **范围**：仅页面级 SEO（标题/描述/标题层级/图片/内链/关键词）
> **审计时间**：2026-09-27
> **数据来源**：251 个源代码文件 + 110 篇博客 frontmatter（静态分析，未运行构建）
> **报告版本**：v1 — Round 1（博客抽样 10 篇 + 全站静态页结构审计）
> **配套交付**：[JSON 数据集](./on-page-seo-audit-v1.json)、[博客抽样附录](./on-page-seo-audit-v1-blog-samples.md)

---

## 1. Executive Summary

**总评**：站点页面级 SEO 处于 **"基础设施齐全、内容待补、隐患未清"** 的阶段 — 元数据组件、sitemap、redirects、JSON-LD 等基础设施已经搭建完成，但有 4 项阻断性技术债（品牌身份冲突、旧域名残留、Metadata 组件默认 noindex 风险、编码损坏未清完）以及 1 项内容架构问题（110 篇博客中 70% 为薄内容词汇表，缺少 pillar 级别深度文章）。

### Top 5 优先修复（按"修好后对排名/可索引性的预期影响"排序）

| # | 隐患 | 影响 | 预计工作量 |
|---|---|---|---|
| 1 | **品牌身份未决**（KAIPU vs Industrial Knives） — `site.name` 与 143 个文件内容、JSON-LD publisher 不一致 | 知识图谱碎片化、E-E-A-T 信号弱、视觉与 SERP 品牌冲突 | 决策 + 全仓替换 + 重新生成 JSON-LD，**1–2 个工作日** |
| 2 | **域名统一** — `machine-knives.net` 出现在 128 文件中 vs `industrial-knives.net` 仅 2 处；canonical、JSON-LD、组织 URL 全部走错域名 | 链接权益分散、Google 信任信号被错配到旧域 | 全仓 find/replace + 修改 8 个 `.astro/.ts` 的硬编码回退 URL，**半天** |
| 3 | **`Metadata.astro` noindex 回退默认值有误**（默认 `true`） | 若未来 `config.yaml` 的 `metadata.robots.index` 被误删/注释，**全站瞬间被 noindex** | 1 行代码修复（默认改为 `false`），**5 分钟** |
| 4 | **编码损坏 126 处** — em-dash + 数字丢失（"40—00 gsm" 应为 "40–200 gsm"），其中部分已用 `[MISSING SPEC]` 标记但大量未处理 | 句子不通顺、专业感丧失、AI 引擎可能误判为低质内容 | 按文件清单人工补全（**不能猜测**，per `.clinerules` §0.5.3），**1–2 天** |
| 5 | **110 篇博客缺 `image:` frontmatter** + **72 篇 <300 词** | OG image 全 fallback 到默认 → 社交分享无视觉钩子；薄内容在 helpful content system 下拖累整站 | 分批补图（短期）+ 内容扩充/合并（中期），**4–6 周** |

### 长期内容优化方向（高 ROI）

1. **建立 pillar–cluster 内容模型**：当前 topic 集群比例失衡（glossary 41% + materials-encyclopedia 29% = 70%，深度内容仅 8 篇 1500–3000 词）。补足 6 篇 3000+ 词的 pillar 文章能拉动整站主题权威。
2. **修复博客 "undefined" 标题 bug** — 40 篇词汇表条目仍带未替换的 `undefined — Industry Glossary Entry` 字面量。
3. **图片基础设施升级** — 16 处 hero/case-study 图用裸 `<img>` 字符串，跳过 Astro 的 WebP 转换与 srcset 生成。
4. **OG image 缺位** — 110 篇博客全部缺 image 字段，社交分享体验差。

---

## 2. 品牌与域名一致性

### 2.1 品牌身份冲突 — `KAIPU` vs `Industrial Knives`

- **`site.name` 配置**（`src/config.yaml` L2）：`Industrial Knives`
- **实际内容中出现 `KAIPU`**：**401 次，跨 143 个文件**
- **典型冲突点**（仅列 Top 10）：

| 文件 | 出现次数 | 角色 |
|---|---|---|
| `src/pages/quality.astro` | 24 | 用户可见页面 |
| `src/pages/solutions.astro` | 16 | 用户可见页面 |
| `src/pages/industries/index.astro` | 11 | 用户可见页面 |
| `src/pages/products/index.astro` | 11 | 用户可见页面 |
| `src/data/_products-overview.ts` | 10 | 内容/数据 |
| `src/data/query-acquisition/sources.kpi.yaml` | 9 | 内容/数据 |
| `src/pages/services.astro` | 9 | 用户可见页面 |
| `src/pages/lp/quote.astro` | 8 | 着陆页（noindex） |
| `src/data/post/hss-vs-carbide.md` | 7 | 内容/数据 |
| `src/data/post/material-grade-converter.md` | 7 | 内容/数据 |

**取证（核心 schema）**：

```ts
// src/lib/schema.ts L189, L213, L221
author: { name: 'KAIPU Engineering', url: 'https://www.machine-knives.net/about/' },
//                                              ↑ 旧域名 + ↑ KAIPU 品牌名
publisher: { name: 'KAIPU' },
```

**SEO 影响**：
- Google Knowledge Graph 将 `Industrial Knives` 视为组织名，但 JSON-LD publisher 反复声明 `KAIPU`，**实体识别不收敛**
- 站内锚文本混用（`KAIPU 5-Factor Blade Selection Framework` vs `Industrial Knives`），外部链接权益被分散
- 用户在 SERP 看到的 brand name 与点击进入后看到的品牌不一致，**CTR 信任信号受损**

**修复方向**（不替代业务决策）：
1. **决策**：保留哪个品牌作为正式对外名称（建议保留 `KAIPU Industrial Blades` 作为产品品牌，`industrial-knives.net` 作为站域名）
2. **同步**：`site.name`、`Organization` JSON-LD、OpenGraph site_name、每篇博客的 author/publisher 全部统一
3. **回退**：执行 `npm run build` 后用 Rich Results Test 验证 Google 能识别为单一实体

### 2.2 域名不一致 — `machine-knives.net` vs `industrial-knives.net`

| 域名 | 出现次数 | 唯一文件数 | 角色 |
## 3. 标题 (Title) 审计

### 3.1 标题模板双重化

`src/config.yaml` 配置：

```yaml
metadata:
  title:
    default: 'Industrial Knives — Precision Engineered Machine Knives'
    template: '%s — Industrial Knives'
```

**渲染示例**（首页 + 模板）：

```
输入 metadata.title = "KAIPU Industrial Blades — Precision Machine Knives"
渲染 <title> = "KAIPU Industrial Blades — Precision Machine Knives — Industrial Knives"
                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 品牌后缀已存在
                                                      ^^^^^^^^^^^^^^^^ 模板再次追加
```

**实际触发双重化的页面**（抽样人工核验）：
- `/` 首页 — title 中已含 "KAIPU Industrial Blades" + 模板 "— Industrial Knives" → 重复
- `/about` — title "About KAIPU" + 模板 "— Industrial Knives" → "About KAIPU — Industrial Knives" (30 字符，正常)
- `/products/` — title "Industrial Blades by Category" + 模板 → 正常
- `/industries/printing-packaging/` — title "Printing & Packaging Blades —Slitting, Sheeting and Rewinding Knives" (79 字符) + 模板 → **超过 SERP 截断阈值 (60 字符)**

**SEO 影响**：
- SERP 截断：双重化的长 title 显示为 `...Precision Machine Knives — Industrial Knives`，后缀无信息量
- 关键词稀释：模板占用了 17 字符的 title 空间
- 品牌后缀重复 = 视觉冗余，CTR 受损

**修复建议**：
1. 在 `src/components/common/Metadata.astro` 中加 `ignoreTitleTemplate` 自动检测 — 若 `title` 已包含品牌词则跳过模板
2. 或：在每个调用方显式传 `ignoreTitleTemplate: true`（侵入式，**不推荐**）
3. 长度预警：对 >60 字符的 title 在构建时发出 warning

### 3.2 标题唯一性

- **博客标题**：110 篇中仅 1 个唯一异常字符串 **`undefined — Industry Glossary Entry`** 出现 **40 次**（详见 §6.2）。其他 70 个标题唯一。
- **静态页标题**：首页 / about / products / industries / solutions / services / contact / quality / blog / 404 — 全部唯一
- **产品分类页标题**：通过模板 `${category} | ${title}` 生成，6 个一级分类唯一

### 3.3 标题长度分布

| 类别 | 长度 | 备注 |
|---|---|---|
| 首页 | 68 字符 | 含双重品牌（过长） |
| about | 30 字符 | 正常 |
| 行业页 | ~80 字符 | **过长，会被 Google 截断** |
| 博客详情页 | frontmatter `title` + 17 字符模板 | 取决于 frontmatter 长度 |

**审计建议**：构建时增加 title 长度硬上限（≤60 字符最佳，≤70 字符可接受）

---

## 4. 描述 (Meta Description) 审计

### 4.1 全量博客描述长度分布（110 篇）

| 桶 | 数量 | 占比 | SEO 评价 |
|---|---|---|---|
| **缺失** | 0 | 0% | ✅ |
| 过短 (<80 字符) | 27 | 24.5% | ⚠️ 浪费 SERP 空间 |
| 合理 (80–160 字符) | 13 | 11.8% | ✅ 最佳 |
| 偏长 (160–320 字符) | 65 | 59.1% | ⚠️ 会被 Google 截断 |
| 过长 (>320 字符) | 5 | 4.5% | ❌ 大幅截断 |

**关键观察**：
- **24.5% 博客描述过短**（27 篇） — 主要是 materials-encyclopedia 词汇表条目（`description_len: 37-41` 字符），SERP 展示浪费
- **59.1% 博客描述偏长**（65 篇） — 主要在 200-300 字符范围，Google 会截断到 ~155-160 字符
- 仅 **11.8%** 描述在最佳范围（13 篇）

**修复建议**：
1. 对 materials-encyclopedia 等薄内容词汇表：将 description 扩展到 80–160 字符范围（补充 1–2 句应用场景与材料特征）
2. 对文章类博客：截断到 ≤160 字符，前置核心关键词
3. 在 `src/content.config.ts` 的 zod schema 增加 `description: z.string().min(80).max(160)` 约束（构建期强制）

### 4.2 描述字段优先级

所有 110 篇博客均设置了 `excerpt`（即 description 来源），**无完全缺失项**。

当前实现（`src/pages/blog/[category]/[slug].astro` L125）：`description: postProps.post.excerpt` — 即用 excerpt 作为 meta description。部分文件同时声明了 `metadata.description`，但 frontmatter 解析时**优先取 excerpt**（除非 excerpt 缺失）。

**优化建议**：建立 `description` 字段优先级：
1. `metadata.description`（页面级 SEO 定制）
2. `excerpt`（摘要 fallback）
3. `metadata.title` + 自动生成的 boilerplate（最后兜底）

---

## 5. 标题层级 (Heading) 审计

### 5.1 抽查页面 H1 / H2 / H3 结构

| 页面 | `<h1>` 数 | 备注 |
|---|---|---|
| `/` (首页) | 1 (Hero 渲染) | ✅ Hero → 多 H2 区块（Features/Steps/FAQs/Stats） |
| `/about` | 1 (Hero) | ✅ |
| `/products/` | 1 (Hero) | ✅ |
| `/products/[...slug]` | 1 (Hero + 动态) | ✅ |
| `/industries/*` (6 页) | 1 (Hero) | ✅ |
## 6. 内容策略审计

### 6.1 主题集群（Topical Cluster）覆盖度

**全 110 篇博客按 category 分布**：

| Category | 数量 | 占比 | 战略定位 |
|---|---|---|---|
| `glossary` | 45 | 40.9% | Supporting cluster — 术语定义 |
| `materials-encyclopedia` | 32 | 29.1% | Pillar cluster — 材料百科 |
| `selection-guide` | 8 | 7.3% | Conversion cluster — 选型指南（购买决策） |
| `case-studies` | 6 | 5.5% | Trust cluster — 案例研究（社会证明） |
| `maintenance` | 6 | 5.5% | Retention cluster — 维护指南 |
| `material-comparison` | 5 | 4.5% | Comparison cluster — 材料对比 |
| `troubleshooting` | 5 | 4.5% | Support cluster — 故障排查 |
| `coatings-comparison` | 1 | 0.9% | Comparison cluster — 涂层对比 |
| `material-grade-converter` | 1 | 0.9% | Tool cluster — 材料换算工具 |
| `Engineering` | 1 | 0.9% | ⚠️ 孤岛 / 误分类 |

**观察**：
- **41% 集中在 glossary 集群**（45 篇）— 这是 **基础性 supporting content**，对 pillar 页有支撑作用，但单独不带来大量长尾流量
- **selection-guide 集群 8 篇** — 这是 **B2B 工业制造最高 ROI 的内容类型**（用户主动搜索 "how to choose"），目前数量偏少
- **case-studies 集群 6 篇** — 仅 6 篇真实案例，**社会证明严重不足**
- **`Engineering` 分类只有 1 篇** — 极可能是误分类（应当归属到某个子分类），属于内容孤岛
- **没有 pillar 页** — 没有任何 3000+ 词的核心长文章，难以建立 topic authority

### 6.2 内容深度分布（word count）

| 桶 | 数量 | 占比 | SEO 评价 |
|---|---|---|---|
| 极薄 (<300 词) | 72 | 65.5% | ❌ thin content |
| 薄 (300–800 词) | 11 | 10.0% | ⚠️ brief |
| 中 (800–1500 词) | 18 | 16.4% | ✅ adequate |
| 长 (1500–3000 词) | 9 | 8.2% | ✅ good |
| 超长 (3000+ 词) | 0 | 0.0% | ❌ 无 pillar 内容 |

**关键观察**：
- **72/110 (65.5%) 的博客 <300 词** — 主要是 materials-encyclopedia 与 glossary 词条，**在 helpful content system 下会被识别为 thin content 并拖累整站**
- **0/110 (0%) 的博客 >3000 词** — **完全缺乏 pillar 级内容**
- 长文章 9 篇全部是 troubleshooting/selection-guide/case-studies 类型 — 这些是 "money pages"，但深度仍可加 2–3 倍

**最薄的博客**（部分）：
| 文件 | 词数 | 描述长度 |
|---|---|---|
| `case-study-aluminum-foil-slitter.md` | 345 | 250 |
| `case-study-textile-nonwoven-slitter.md` | 373 | 265 |
| `glossary-pvd-coating.md` | 172 | 193（含 undefined 标题 bug） |
| `materials-encyclopedia-440c.md` | 212 | 207 |
| `17-4ph.md` | 161 | 40 |
| `420.md` | 143 | 37 |
| `440a.md` | 128 | 38 |

### 6.3 关键词蚕食（Keyword Cannibalization）

**疑似蚕食组**（基于 URL slug 模式识别）：

1. **`materials-encyclopedia-*` 与裸材料 slug 重复**
   - `17-4ph.md` vs `materials-encyclopedia/17-4ph.md` → **两个 URL 指向同一内容**（已通过 redirects 处理，但仍占 crawl budget）
   - 同模式：~25 篇博客存在重复 URL（`420.md`, `440a.md`, `440b.md`, `d2.md`, `d3.md`, `d4.md`, `d5.md`, `d7.md`, `h11.md`, `h13.md`, `m1.md`, `m3.md`, `m35.md`, `m42.md`, `m50.md`, `o1.md`, `t1.md`, `t15.md`, `yg6.md`, `yg10.md`, `yg15.md`, `asp2060.md`, `6crw2si.md` 等）

2. **`glossary-*` 与 `glossary/*` 重复**
   - `glossary-chipping.md` vs `glossary/chipping.md`（待 Round 2 验证）
   - 类似：~45 篇 glossary 词条

3. **`selection-guide-*` 与 `selection-guide/*` 重复**
   - `selection-guide-paper-converting.md` vs `selection-guide/paper-converting.md`
   - 类似：~8 篇

**SEO 影响**：
- 虽然 redirects 处理了用户访问，但 sitemap 可能同时列出两套路径，触发 Google 的重复内容识别
- Crawl budget 被稀释到重复内容上

**修复建议**：
1. 在 `src/utils/redirects.ts` 验证所有 redirect 路径在 `dist/sitemap-index.xml` 中只出现最终 URL
## 7. 图片优化审计

### 7.1 占位 alt 文本

**统计**：24 处含 `(placeholder)` 字样，跨 14 个文件。

**取证（按文件分布）**：

| 文件 | 处数 |
|---|---|
| `src/pages/about.astro` | 1 |
| `src/pages/contact.astro` | 1 |
| `src/pages/industries/converting.astro` | 2 |
| `src/pages/industries/food-processing.astro` | 2 |
| `src/pages/industries/index.astro` | 1 |
| `src/pages/industries/metalworking.astro` | 2 |
| `src/pages/industries/paper-tissue.astro` | 2 |
| `src/pages/industries/plastics-recycling.astro` | 2 |
| `src/pages/industries/printing-packaging.astro` | 2 |
| `src/pages/products/index.astro` | 1 |
| `src/pages/solutions.astro` | 2 |
| `src/pages/quality.astro` | 2 |
| `src/pages/services.astro` | 1 |
| `src/pages/products/[...slug].astro` | 1 |

**SEO 影响**：
- `(placeholder)` 字面量在生产 HTML 中出现 — **屏幕阅读器会朗读 "placeholder"**，**a11y 严重问题**
- Google 图片搜索会忽略带 placeholder 的图（不会出现在 image pack）
- **内容真实性问题**：说明图片占位工作未完成

**修复清单**：
- 14 个文件中的 24 处 alt — 全部需要重写为描述性 alt + 替换或补全实际图片
- 优先级 P0：about, industries/*, products/*, contact, solutions（高频页面）

### 7.2 裸 `<img>` 绕过 `<Image />` 组件

**统计**：29 处裸 `<img src=...>`，跨 15 个 .astro 文件。

**Top 文件**：

| 文件 | 处数 |
|---|---|
| `src/pages/index.astro` | 5 |
| `src/pages/quality.astro` | 3 |
| `src/pages/solutions.astro` | 3 |
| `src/pages/industries/converting.astro` | 2 |
| `src/pages/industries/food-processing.astro` | 2 |
| `src/pages/industries/metalworking.astro` | 2 |
| `src/pages/industries/paper-tissue.astro` | 2 |
| `src/pages/industries/plastics-recycling.astro` | 2 |
| `src/pages/industries/printing-packaging.astro` | 2 |
| `src/pages/about.astro` | 1 |
| `src/pages/contact.astro` | 1 |
| `src/pages/industries/index.astro` | 1 |
| `src/pages/products/index.astro` | 1 |
| `src/pages/products/[...slug].astro` | 1 |
| `src/pages/services.astro` | 1 |

**典型模式**（取证）：

```astro
// src/pages/index.astro L18-19
const heroImageHtml =
  '<img src="/homepage/kaipu-precision-industrial-blade-manufacturing.webp" alt="..." class="..." width="1024" height="576" loading="eager" />';
```

**SEO 影响**：
- 跳过 Astro `<Image />` 组件 = **无自动 WebP 转换**（即便源文件是 webp，srcset 也不会生成多分辨率）
- 跳过 Sharp 处理 = **文件大小未优化**（LCP 受损）
- 跳过 responsive styles = **桌面/移动端用同一张图**（浪费带宽）
- 部分图的 `loading="eager"` 在所有页面都开 — 违反 "首屏唯一" 原则（LCP 与 TTI 受损）

**修复建议**：
1. 在 `src/components/widgets/Hero.astro` 之外建立一个 `<HeroImage />` 子组件，封装 `<Image />` 调用
2. 所有 hero 图改用该子组件
3. 删除 `(placeholder)` 字样，改为实际描述（如 "D2 circular slitting blade, OD 250 mm, ground finish"）

## 8. 编码损坏

**统计**：**126 处** em-dash (`—`, U+2014) 紧邻数字的异常模式，跨 16 个文件。

**典型损坏模式**：

```
原文（GBK 损坏后）       原文意图（UTF-8）
"40—00 gsm"        →    "40–200 gsm"      (en-dash + 两位数字被吃)
"12—00 µm"         →    "12–100 µm"
"6—0 µm"           →    "6–40 µm"
"HRC 58—2"         →    "HRC 58–62"
"5—5 µm"           →    "5–15 µm"
"4— weeks"         →    "4–6 weeks"
"200 × 40 × 20 mm" →    多数情况 × (U+00D7) 被 GBK 译为 "脳"
```

**取证（Top 损坏文件）**：

| 文件 | 处数 |
|---|---|
| `src/pages/industries/index.astro` | 27 |
| `src/pages/industries/paper-tissue.astro` | 19 |
| `src/data/product/slitter-blade.md` | 15 |
| `src/pages/industries/printing-packaging.astro` | 12 |
| `src/pages/industries/metalworking.astro` | 10 |
| `src/pages/industries/food-processing.astro` | 8 |
| `src/pages/industries/plastics-recycling.astro` | 8 |
| `src/data/product/granulator-rotor-knife-200x40.md` | 6 |
| `src/pages/industries/converting.astro` | 6 |
| `src/data/product/shear-blade-guillotine-300x60.md` | 4 |

**取证（部分损坏示例）**：

```md
// src/data/post/case-study-aluminum-foil-slitter.md L40 (示意)
> 鈥擺MISSING SPEC: ... Lead time ... 20鈥擺MISSING SPEC: ...] working days.
//       ↑ 这说明项目已经做过一轮 fix-unicode.mjs，但留下了 [MISSING SPEC: ...] 占位符等待人工补全
```

```md
// src/data/product/granulator-rotor-knife-200x40.md L22-L24
| Length          | 200 mm (range 50鈥擺MISSING SPEC: length max in mm] mm)    |
| Width           | 40 mm (range 25鈥擺MISSING SPEC: width max in mm] mm)      |
| Thickness       | 20 mm (range 12鈥擺MISSING SPEC: thickness max in mm] mm)  |
```

**SEO 影响**：
- 句子不通顺、专业感丧失（B2B 工业制造尤其敏感）
- AI 引擎（ChatGPT/Perplexity/Google AIO）解析规格时可能误读为 "Paper 40—00 gsm"，**信号可信度下降**
- `[MISSING SPEC: ...]` 占位符会出现在生产 HTML 中 — **专业性硬伤**

**修复规则（严格遵守 `.clinerules` §0.5.3）**：
- ❌ **禁止猜测补全缺失的数字**（per §0.5.3）
- ✅ 由产品/工程团队根据实际规格提供准确数字
- ✅ 不存在的规格保留 `[MISSING SPEC: ...]` 标记
- ✅ 修复后执行 `node scripts/check-unicode.mjs` 验证

---

## 9. 内部链接结构

### 9.1 链接图局限说明

本次审计用正则 `href="/path"` 直接扫描源文件中的字面量链接。但项目大量使用 JS helper（`getPermalink()`、`getBlogPermalink()`、`buildCategoryHref()`）在运行时生成链接 — 这些**不会被正则捕获**。

因此下方"链接图"仅覆盖**硬编码 href**，不反映运行时链接全貌。完整内链分析需要构建后扫描 `dist/**/*.html`。

### 9.2 字面量内链统计

- 总节点数（文件级）：**4** 个源文件含有字面量 href
- 总边数（粗略）：**5** 条字面量站内链接

**最高 outbound 文件**（最常内链的页面）：

| 来源文件 | 链出数 |
|---|---|
| `src/pages/index.astro` | 2 |
| `src/pages/admin/images.astro` | 1 |
| `src/pages/products/[...slug].astro` | 1 |
| `src/pages/solutions.astro` | 1 |

**观察**：
- 首页 `src/pages/index.astro` 仅字面量链出 2 条 — 因为导航由 `headerData` 动态注入
- 大部分链接由 helper 生成 — **手工添加的内链非常少**（首页未对博客文章做手工内链）
- **首页 → 博客详情内链 = 0** — 这是错失的"流量引导机会"

### 9.3 站内孤岛（潜在）

**仅基于字面量 href**，inbound 最少的 4 个目标：

| 路径 | 被链次数 |
|---|---|
| `/docs/image-catalog.md` | 1 |
| `/quality` | 1 |
| `/kaipu-5-factor-blade-selection-framework/` | 1 |
| `/contact` | 2 |

**注意**：此表**严重低估**真实孤岛情况 — 因为它没有把 helper 生成的链接计入。例如 `/quality` 实际被 nav 中链了多次，但只显示 1 次。

**建议**：构建后用 Sitebulb / Screaming Frog 跑一遍实际 dist/ 链接图

## 11. 博客抽样详情（10 篇）

详细见配套文件 [on-page-seo-audit-v1-blog-samples.md](./on-page-seo-audit-v1-blog-samples.md)。

**抽样覆盖**：

| 抽样维度 | 覆盖数 |
|---|---|
| `type: article` | 4 篇（case-studies / selection-guide / maintenance / troubleshooting） |
| `type: glossary` | 3 篇（material / wear-mode / coating） |
| `type: comparison` | 2 篇（material-grade / coating） |
| 旗舰内链目标 | 1 篇（kaipu-5-factor-blade-selection-framework） |
| 不同 category | 8 个不同 category |
| 总计 | **10 篇** |

---

## 12. 优先级行动方案（Roadmap）

### Q1（立即执行，1–2 周内）— 修阻断性技术债

| 任务 | 工作量 | 负责人 | 完成标准 |
|---|---|---|---|
| **决策品牌名**：KAIPU vs Industrial Knives | 0.5 天 | 业务方 | 一次性书面决议 |
| 统一全仓品牌字符串（决定后） | 0.5 天 | 工程 | grep 全仓无冲突 |
| 全仓 find/replace `machine-knives.net` → `industrial-knives.net` | 0.5 天 | 工程 | 0 处残留 |
| 修复 `Metadata.astro` L99, L105 默认值 → `false` | 5 分钟 | 工程 | 1 行代码 |
| 清理 14 个文件中的 `(placeholder)` alt | 0.5 天 | 内容 + 工程 | 0 处残留 |
| 编码损坏人工补全（仅 batch 1：Top 10 文件） | 1–2 天 | 产品/工程提供规格 + 内容编辑 | Top 10 文件清零 |

### Q2（1–3 月）— 内容刷新与基础强化

| 任务 | 工作量 | 负责人 | 完成标准 |
|---|---|---|---|
| 修复 40 篇 glossary 词条的 "undefined" 标题 bug | 0.5 天 | 工程（修改生成脚本） | 0 处残留 |
| 抽样 10 篇博客深度优化（Round 2 专项） | 1 周 | SEO + 内容 | 每篇 wc ≥ 800 + description 80-160 + alt 完整 + 内链 5+ |
| 建立 12 个月内容刷新日历（按 publishDate 触发） | 0.5 天 | 内容运营 | Playbook 文档 |
| 替换所有 hero/case-study 裸 `<img>` 为 `<Image />` 组件 | 1 周 | 工程 | 0 处裸 img 残留 |
| 建立 frontmatter 校验脚本（描述长度、image 字段必填） | 1 天 | 工程 | CI 检查 |
| 110 篇博客补齐 OG image（frontmatter `image:` + 实际图） | 2 周 | 内容 + 设计 | 100% 覆盖 |

### Q3（3–6 月）— 内容扩张与主题权威

| 任务 | 工作量 | 负责人 | 完成标准 |
|---|---|---|---|
| 新增 6 篇 pillar 文章（3000+ 词，覆盖 selection-guide 集群） | 4 周 | SEO + SME | wc ≥ 3000 + 结构化内容 + 案例 |
| case-studies 扩展至 20+ 篇（含客户证言、量化数据） | 持续 | 销售 + 内容 | 20 篇上线 |
| 建立 `/authors/[slug]` 路由 + 3–5 位署名工程师档案 | 1 周 | 工程 + 内容 | 5 位作者上线 |
| 填补内容缺口（按导航 6 产品 + 6 行业 × 5 长尾词 = 60 关键词矩阵） | 持续 | 内容 | 月新增 4–6 篇 |
| 关键词蚕食检测报告（基于 dist 链接图 + sitemap） | 1 周 | SEO | 0 处自相蚕食 |

### Q4（6–12 月）— 规模化与自动化

| 任务 | 工作量 | 负责人 | 完成标准 |
|---|---|---|---|
| 第二轮深度审核（覆盖 100% 博客 + 全静态页） | 2 周 | SEO | Round 2 报告 |
| 建立内容 ROI 跟踪（按博客 URL 维度跟踪 GSC 表现） | 持续 | SEO | 月度 dashboard |
| 内链健康监控（断链、孤岛、深度超限） | 持续 | SEO | CI 集成 |
| AI 搜索优化（LLMs.txt 扩展 + 结构化数据补全） | 持续 | SEO | 已在 ai-seo SKILL 中规划 |

---

## 附录 A：本审计的方法论与局限

- **方法**：纯静态代码审计（grep + YAML/TS 解析），未运行 `npm run build`，未访问生产 URL
- **扫描范围**：251 个文件（src/, public/, worker/），排除 .astro/, dist/, node_modules/, ai-seo/, docs/, audit-results/, .git/
- **数据来源**：
  - 110 篇博客 frontmatter（YAML 解析）
  - 16 个核心页面静态阅读
  - 30+ 个 .astro 组件抽样
- **未做的事**：
  - 未抓取生产 URL（站点是否真的能访问、Search Console 数据未知）
  - 未跑 Core Web Vitals（Lighthouse / PageSpeed）
  - 未做关键词研究（搜索量、KD、搜索意图分类）
  - 未做外链审计
  - 未验证 schema 实际渲染（依赖 `scripts/audit-schema-strict.mjs`，Round 2 待办）
  - 未检查图片实际尺寸（仅 alt 文本审计）

## 附录 B：未决问题（待业务方决策）

1. **品牌名归属**：KAIPU Industrial Blades 还是 Industrial Knives？
2. **域名策略**：保留 `industrial-knives.net` 还是回退到 `machine-knives.net`？
3. **OG image 缺失内容**：是否设计通用 OG image 还是每篇博客配独立图？
4. **作者实名策略**：是否公开署名工程师个人姓名 + LinkedIn？
5. **内容扩产预算**：每月新增 4–6 篇深度博客是否可行？需要 SME 参与？

---

## 附录 C：复现本审计的命令

```bash
# 1. 生成原始分析数据（9 个 section，写入 _analysis.jsonl）
node audit-results/_analyze.mjs > audit-results/_analysis.jsonl 2> audit-results/_analysis.err

# 2. 摘要输出
node audit-results/_summary.mjs > audit-results/_summary.txt

# 3. 博客抽样
node audit-results/_sample.mjs > audit-results/_sample.txt
node audit-results/_sample2.mjs > audit-results/_sample2.txt
```

---

*报告生成于 2026-09-27，由 Cline 在审计模式下产出（无修改项目源码）。所有数值基于 `audit-results/_analysis.jsonl` 可复现。*
---

## 10. Metadata 组件隐患

`src/components/common/Metadata.astro` L94-105 的回退逻辑：

```ts
noindex:
  typeof robots?.index !== 'undefined'
    ? !robots.index
    : typeof METADATA?.robots?.index !== 'undefined'
      ? !METADATA.robots.index
      : true,   // ← 默认 noindex = true（不安全！）
```

**当前依赖的救场逻辑**：`src/config.yaml` 的 `metadata.robots.index: true` 强制走第二分支，使 `noindex = !true = false`（可索引）。

**隐患**：
- 若有人误删 `config.yaml` L16-17 的两行 → **全站所有页面瞬间 `noindex`**
- 没有防御性默认值 — 应改为 `false`（默认可索引，符合 SEO 安全默认）

**修复（1 行）**：

```ts
// 改为：默认 false（可索引）
noindex:
  typeof robots?.index !== 'undefined'
    ? !robots.index
    : typeof METADATA?.robots?.index !== 'undefined'
      ? !METADATA.robots.index
      : false,  // ← 改这里
```

---
### 7.3 `loading="eager"` 滥用

**统计**：20 处，跨 19 个文件。

**原则**：每个页面应**只有首屏 hero 图**使用 `loading="eager"`。其他图默认 `loading="lazy"`（`Image.astro` L58 已默认）。

**取证**：

| 文件 | 处数 | 评估 |
|---|---|---|
| `src/components/widgets/Hero.astro` | 1 | ✅ 正常 |
| `src/components/widgets/Hero2.astro` | 1 | ✅ 正常 |
| `src/components/blog/SinglePost.astro` | 1 | ⚠️ 仅当文章 hero 是首屏才合理 |
| `src/pages/about.astro` | 1 | ✅ hero |
| `src/pages/contact.astro` | 1 | ⚠️ 视布局判断 |
| `src/pages/index.astro` | 1 | ✅ hero |
| `src/pages/industries/*` (6 页) | 6 | ✅ 每个页面 hero |
| `src/pages/products/[...slug].astro` | 2 | ⚠️ 可能存在非首屏图 |

---
2. 或者执行 **301 + canonical** 双重保险（最终 URL 加 self-canonical）
3. Round 2 审计应专门验证 sitemap 内容

### 6.4 内容陈旧度（Staleness）

- **0 篇博客超 12 个月且无 updateDate** — 全部发布于 2026-09-18，是新批量内容
- **隐患**：未来 12 个月后无刷新机制，会变成 stale content。建议建立 `publishDate + 12 个月` 触发的提醒工作流

### 6.5 内容质量信号（E-E-A-T）

- **作者信息**：所有博客 `author: 'KAIPU Engineering'`（统一组织作者），无个人作者档案 — **E-E-A-T 中 E（Experience）信号损失**，因为 Google 倾向识别个人专家
- **来源引用**：仅在 4 篇 selection-guide 类博客中显式引用 ASTM A681 / JIS SKD11 等标准号 — **T（Trustworthiness）信号覆盖不足**
- **案例研究**：6 篇 case-studies 是 **最有价值的 E-E-A-T 资产**，但只有 6 篇 — **数量不足，建议扩到 20+ 篇**（可在每篇案例后邀请客户证言+量化数据）
- **作者档案**：当前无独立 `/about/author/*` 路由，所有博客作者统一为 "KAIPU Engineering"

**优化建议**：
1. 选定 3–5 位署名工程师，建立 `/authors/[slug]` 路由 + 个人 bio + LinkedIn 链接
2. 在 selection-guide 与 case-studies 类文章中系统化引用标准号（已部分做到）
3. 案例研究增加量化结果数据（已部分做到：例如 `burr held below 0.10 mm for 18 000 cycles`）

---
| `/solutions` | 1 (Hero) | ✅ |
| `/services` | 1 (Hero) | ✅ |
| `/blog/[category]/[slug]` | 1 (SinglePost 渲染) | ✅ |
| `/404` | **0** | ❌ **缺 `<h1>`，仅用 `<h2>` 显示 "404"** |
| `/lp/quote` | 1 (Hero, 但 noindex) | ✅（因 noindex 不参与 SERP） |

### 5.2 层级跳级检测

- 首页案例研究：Hero `<h1>` → Features `<h2>` → 案例 `<h3>` → FAQs `<h2>` — 案例 `<h3>` 嵌在 case-studies 区块内，结构合理
- 行业页：Hero `<h1>` → Content `<h2>` → Content.items 各 `<h3>`（CTA 项）— 结构合理
- **未发现 H1→H3 跳级**（除非各 widget 自身内部跳级，需要逐 widget 检查 — Round 2 待办）

### 5.3 404 页缺 `<h1>`

```astro
// src/pages/404.astro L12-15
<h2 class="mb-8 font-bold text-9xl">
  <span class="sr-only">Error</span>
  <span class="text-primary">404</span>
</h2>
```

**问题**：
- 404 页是用户访问失效链接时的着陆页，**应该是 SEO 友好的引导页**
- 用 `<h2>` 显示 "404" 不符合 HTML5 语义（每个页面应有 1 个 `<h1>`）
- 屏幕阅读器无法识别这是页面主标题

**修复建议**：
```astro
<h1 class="sr-only">Page not found (Error 404)</h1>
<h2 class="mb-8 font-bold text-9xl" aria-hidden="true">404</h2>
```

---
|---|---|---|---|
| `machine-knives.net`（旧） | 132 | 128 | canonical、JSON-LD url/author.url、社交链接 |
| `industrial-knives.net`（新） | 2 | 2 | 仅 `src/config.yaml` + `worker/index.ts` |

**取证**：

```md
// src/data/post/troubleshooting-premature-wear.md L18
canonical: 'https://www.machine-knives.net/troubleshooting-premature-wear/'
```

```astro
// src/pages/blog/[category]/[slug].astro L68, L81
String(new URL(it.href, Astro.site ?? 'https://www.machine-knives.net'))
const siteUrl = String(Astro.site ?? 'https://www.machine-knives.net').replace(/\/$/, '');
```

**SEO 影响**：
- canonical 指向旧域名 = Google 把排名权益归到旧域，**新域本身权重很低**
- JSON-LD author.publisher.url 错误 = 知识图谱关联断裂
- 用户的浏览器收藏与社交分享会落到旧域（即便 HTTP 302 后能跳走，**仍损失 link equity**）

**修复**：在 `src/` 全仓 find/replace `machine-knives.net` → `industrial-knives.net`，再人工检查硬编码字符串的 fallback。

---