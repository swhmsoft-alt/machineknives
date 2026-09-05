# EdgeTech Industrial Blades — 项目开发规则

> Cline / AI Agent 必须遵守。本文件是项目级硬约束，优先级高于通用编程习惯。

## 项目基本信息

- **项目名**：EdgeTech Industrial Blades（工业刀片/刀具 B2B 官网）
- **技术栈**：Astro v7 + Tailwind CSS v4 + TypeScript
- **部署目标**：Cloudflare Pages（静态站点）
- **语言**：英文站（面向欧美出口市场）
- **核心页面**：Home / Products / Solutions / Services / About / Contact / Blog

## 目录结构（必须遵守）

```
src/
├── config.yaml              # 站点全局配置（站名、SEO、i18n、blog 设置）
├── navigation.ts            # 头部导航 + 页脚链接（改页面必须同步更新这里）
├── content.config.ts        # Content collections 定义（post + product）
├── data/
│   ├── post/                # Blog 文章（.md / .mdx）
│   └── product/             # 产品数据（.md / .mdx），每个产品一个文件
├── pages/
│   ├── index.astro          # 首页
│   ├── products/
│   │   ├── index.astro      # 产品列表
│   │   └── [...slug].astro  # 产品详情（动态路由）
│   ├── solutions.astro      # 行业解决方案
│   ├── services.astro       # 服务
│   ├── about.astro          # 关于我们
│   ├── contact.astro        # 询盘表单
│   ├── [...blog]/           # Blog 系统（自动生成，勿手动改）
│   ├── privacy.md / terms.md
│   └── 404.astro
├── layouts/                 # PageLayout / Layout / MarkdownLayout
├── components/
│   ├── widgets/             # 页面级组件（Hero, Features, Stats, CTA 等）
│   ├── ui/                  # 基础组件（Button, Form, Headline）
│   ├── common/              # 通用组件（Metadata, Image, Analytics）
│   └── blog/                # Blog 专用组件
└── assets/
    ├── styles/tailwind.css  # Tailwind 入口 + @theme 自定义 token
    ├── images/              # 本地图片
    └── favicons/
```

## 技术栈约束

### Astro
- 严格使用 Astro 官方模式：content collections、layouts、`.astro` 组件、`<slot />`
- 页面数据优先用 `getCollection()` 从 content collection 取，不要硬编码在页面里
- 动态路由必须用 `getStaticPaths()`，禁止 SSR 模式（本站是纯静态）
- 图片用 `import` + Astro Assets，禁止写死外部 Unsplash URL 作为正式内容（占位图可以，但必须标注 TODO）

### Tailwind CSS v4
- 自定义设计 token 写在 `src/assets/styles/tailwind.css` 的 `@theme { }` 块里
- 禁止在组件里写 `<style>` 标签或内联 `style=""`（动态计算值除外）
- 颜色优先用语义化 class（`text-primary`, `bg-accent`），不要硬编码 `text-blue-700` 除非是临时调试
- 响应式用 `sm:` `md:` `lg:` 前缀，移动端优先

### TypeScript
- 组件 props 必须显式定义 `interface` 或 `type`，禁止隐式 any
- content collection 的 schema 在 `content.config.ts` 里用 Zod 定义，新增字段必须同步更新
- 禁止 `// @ts-ignore`，类型错误必须修复

### 依赖管理
- 包管理器：npm（锁文件 `package-lock.json`）
- **禁止擅自安装新依赖**，需要时先说明理由 + 包名 + 版本，等确认
- **禁止擅自升级已有依赖版本**，包括 Astro、Tailwind、icon 库
- **禁止修改 `astro.config.mjs`** 除非明确要求

## 文件操作铁律

1. **改前必读**：修改任何文件前必须先 `Read` 完整内容，禁止凭印象或摘要改
2. **最小改动**：只改被要求的范围，保留未要求改动的代码、注释、空行和格式
3. **删除前三查**：删除文件前必须确认 (a) 没有被其他文件 import (b) navigation.ts 里没有链接指向它 (c) content.config.ts 里没有引用它
4. **新增页面同步导航**：新建页面后必须同时更新 `src/navigation.ts` 的 `headerData` 和 `footerData`
5. **新增产品同步 collection**：新建产品文件放在 `src/data/product/`，文件名 = slug，frontmatter 必须符合 `productCollection` schema
6. **禁止覆盖用户数据**：`src/data/post/` 和 `src/data/product/` 下的文件是用户内容，禁止删除或重写，只能新增或按明确要求修改

## Content Collection 规范

### Product（产品）
```yaml
---
title: string              # 产品名（必填）
excerpt: string            # 一句话摘要（列表页显示）
category: string           # circular / straight / serrated / shear / granulator / custom
bladeMaterial: string      # 材质，如 "D2 / SKD11 / HSS / Tungsten Carbide"
hardness: string           # 硬度，如 "HRC 58–62"
applications: string[]     # 应用行业列表
image: string | null       # 产品图（暂用 null）
draft: boolean             # true = 不发布
---
产品详细描述（Markdown，支持表格）
```

### Post（Blog 文章）
```yaml
---
publishDate: date          # 发布日期
title: string              # 标题
excerpt: string            # 摘要
category: string           # 分类
tags: string[]             # 标签
author: string             # 作者
draft: boolean             # 草稿
---
文章正文（Markdown / MDX）
```

## 询盘表单规范

`src/pages/contact.astro` 是 B2B 询盘页，表单字段：
- 必填：Full Name, Company, Email, Product Type, Requirements
- 选填：Phone, Quantity, Material/Specification
- 表单 `action="#"` 是占位，接入后端时改为 Formspree URL 或 Cloudflare Functions 路径
- **禁止删除字段或改字段名**，询盘数据依赖这些字段名做后续处理

## 验证流程（强制，每次改完必须执行）

1. **构建验证**：`npm run build`，必须 0 error
2. **类型检查**：涉及 TypeScript 改动时额外跑 `npx astro check`
3. **链接检查**：新增页面后确认 navigation.ts 里的链接能正常跳转
4. **结果上报**：回复中必须明确写出 `npm run build` 的结果（成功 / 失败+错误信息）
5. **禁止跳过验证说"完成"**：build 失败时必须修复到通过，或者明确说明阻塞原因

## 禁止行为

- 禁止擅自升级 `package.json` 中的任何依赖
- 禁止修改 `astro.config.mjs`、`tsconfig.json` 除非明确要求
- 禁止删除 `src/data/` 下的用户内容文件
- 禁止在回复中输出大段无关解释或教程，只说"改了什么文件 + build 结果"
- 禁止猜测用户意图，不确定时一次问清（列出选项+影响），不要自行脑补
- 禁止把 demo/占位内容（lorem ipsum、假联系方式）留在正式页面上
- 禁止使用 emoji 作为正式内容的一部分（代码注释除外）

## 提交规范

- 小步提交，每个独立功能一个 commit
- Commit message 格式：
  - `feat: 新增产品页 X`
  - `fix: 修复 contact 表单字段名`
  - `docs: 更新 CUSTOM.md`
  - `style: 调整首页 hero 间距`
- 提交前确保 `npm run build` 通过
- 不要把 `node_modules/`、`.astro/`、`dist/` 提交进去（已在 .gitignore）

## 常用命令

```bash
npm run dev        # 启动开发服务器 (localhost:4321)
npm run build      # 生产构建（验证用）
npm run preview    # 预览构建结果
npx astro check    # TypeScript + 模板类型检查
```
