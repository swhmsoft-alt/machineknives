# AstroWind Agent Instructions

## Project Overview

AstroWind is a free, open-source website template built with **Astro v7** and **Tailwind CSS v4**. It generates a fully static site optimized for performance, SEO, and accessibility.

**Stack:** Astro v7 | Tailwind CSS v4 | TypeScript 5.9 | MDX | Sharp

## Quick Reference

| Command             | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Start dev server at localhost:4321                    |
| `npm run build`     | Production build to `./dist/` (incl. unicode lint)     |
| `npm run preview`   | Preview production build locally                       |
| `npm run check`     | astro check + ESLint + Prettier + Unicode lint         |
| `npm run fix`       | Auto-fix ESLint + Prettier issues                      |
| `npm run fix:unicode` | Repair Windows / PowerShell mojibake in data files   |
| `npm run check:unicode` | Run only the unicode lint                        |

**Node.js requirement:** >= 22.12.0

## Architecture

### Directory Structure

```
src/
  assets/styles/tailwind.css   # Tailwind v4 config (themes, utilities, plugins)
  components/
    common/        # Shared: Image, Metadata, Analytics, ToggleTheme
    ui/            # Primitives: Button, Form, Headline, Timeline, WidgetWrapper
    widgets/       # Page sections: Hero, Features, Pricing, Header, Footer
    blog/          # Blog: SinglePost, List, Pagination, Tags
    CustomStyles.astro  # CSS variables for colors and fonts
  content.config.ts    # Content Collections schema (Astro 5+ location)
  data/post/           # Blog posts (.md, .mdx)
  layouts/             # Layout.astro, PageLayout.astro, MarkdownLayout.astro
  pages/               # File-based routing
  utils/               # blog.ts, images.ts, permalinks.ts, frontmatter.ts
  config.yaml          # Site configuration (loaded as virtual module)
  navigation.ts        # Navigation structure
  types.d.ts           # TypeScript type definitions
vendor/integration/    # Custom Astro integration for config loading
```

### Path Aliases

Use `~/` to import from `src/`:

```typescript
import Image from '~/components/common/Image.astro';
import { SITE } from 'astrowind:config';
```

### Configuration System

Site config lives in `src/config.yaml` and is loaded as a Vite virtual module `astrowind:config` by the custom integration in `vendor/integration/`. Exports: `SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `ANALYTICS`.

## Tailwind CSS v4

Configuration is CSS-first in `src/assets/styles/tailwind.css`:

- **Theme tokens:** `@theme { --color-primary: var(--aw-color-primary); ... }`
- **Custom utilities:** `@utility bg-page { ... }`
- **Dark mode:** Class-based via `@variant dark (&:where(.dark, .dark *))`
- **Plugins:** `@plugin "@tailwindcss/typography"`
- **Custom variant:** `@custom-variant intersect (&:not([no-intersect]))`

CSS variables for colors/fonts are defined in `src/components/CustomStyles.astro` with light/dark theme variants.

The Vite plugin `@tailwindcss/vite` is configured in `astro.config.ts` (not as an Astro integration).

### Class Merging

Components use `twMerge` from `tailwind-merge` v3 for conditional class composition.

## Content Collections

Defined in `src/content.config.ts` using Astro's Content Layer API with `glob()` loader. Posts are in `src/data/post/` as `.md` or `.mdx` files.

Post frontmatter: `title` (required), `publishDate`, `updateDate`, `draft`, `excerpt`, `image`, `category`, `tags`, `author`, `metadata`.

## Component Patterns

- Props extend interfaces from `~/types`
- Use `class:list` for conditional classes
- Use `twMerge()` when accepting className overrides
- Use named slots for layout composition
- Widget components accept standardized props (see `~/types`)

## Image Handling

`src/components/common/Image.astro` supports:

- Local images via `astro:assets` (optimized by Sharp)
- Remote images via Unpic CDN
- Allowed domains (for providers Unpic can't detect, processed by Sharp): `cdn.pixabay.com`

Hero images use `loading="eager"` and `fetchpriority="high"`.

## Fonts

Fonts are handled by Astro's native **Fonts API**, configured in `astro.config.ts` under the `fonts` key (provider, family, `cssVariable`) and injected via the `<Font />` component in `src/layouts/Layout.astro`. Astro self-hosts, subsets, preloads, and generates metric-adjusted fallbacks. To change the typeface, edit the `fonts` entry and point `--aw-font-*` in `CustomStyles.astro` at the new `cssVariable`.

## Third-party Scripts (Partytown)

`@astrojs/partytown` is wired as an **opt-in** in `astro.config.ts`, gated behind `const hasExternalScripts = false`. Set it to `true` to offload third-party scripts (e.g. Google Analytics via `analytics.vendors.googleAnalytics.partytown`) to a web worker. It is disabled by default so the base template ships no external scripts.

## Content Security Policy

Astro's native CSP is intentionally **not** enabled in this version: it is incompatible with `<ClientRouter />` view transitions (shipped on by default) and would break the arbitrary third-party scripts a template user typically adds. CSP is deferred to AstroWind v2, where the component model (and optional SSR) make it clean and opt-in.

## Verification Checklist

After changes, always verify:

1. `npm run build` succeeds
2. `npm run check` passes (astro check + ESLint + Prettier + Unicode lint)
3. Visual check in browser: homepage, blog, dark mode, mobile menu

## Unicode / Encoding Tooling

The historical pipeline wrote content files through PowerShell on zh-CN Windows, which silently downgrades any character outside GBK to `�?` (U+FFFD + ASCII `?`). Two scripts guard against it:

| Script                          | Purpose                                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `scripts/check-unicode.mjs`     | CI lint. Scans `src/data/{product,post,glossary}/**/*` for `U+FFFD`, GBK mojibake (`鈥?` `碌` `脳` `鈥`), and digit-gap heuristics (e.g. `100?500`). Wired into `npm run check` and `npm run build`. |
| `scripts/fix-unicode.mjs`       | Idempotent repair. Each rule is a context-anchored `[from, to]` pair (longest first to prevent prefix collisions). Run via `npm run fix:unicode`. The legacy `fix-unicode.cjs` at repo root only covered generator scripts and is now redundant — leave it alone for now. |

When adding new product / post files, ensure they round-trip through `node -e "require('fs').writeFileSync(path, content, 'utf8')"` rather than `Out-File` or `>` so the file stays clean.

## Hard Rules

- **Background color**: full-site background is unique and unified. No section/card may define its own background. Only `bg-page` is permitted. Details in `.agents/skills/styling.md` § "Background Color Discipline".
- **UTF-8 only on Windows**: never write `.md` / `.astro` / `.ts` / `.json` files through PowerShell (`>`, `Out-File`, `Set-Content` without `-Encoding utf8`). On zh-CN Windows the default code page is CP936/GBK, and any character outside GBK's repertoire (`Ø`, `±`, `≤`, `≥`, `–`, `—`, `→`, `µ`, `×`, `°`) gets downgraded to `�?` (U+FFFD + ASCII `?`) and renders as garbage in production. Use Node.js `fs.writeFileSync(path, data, 'utf8')` or any editor that explicitly saves as UTF-8 (no BOM). The `scripts/check-unicode.mjs` lint fails `npm run check` / `npm run build` if any data file contains the signature; `npm run fix:unicode` repairs it.
- **Adding components**: read `.agents/skills/styling.md` and `.clinerules` first. Reuse existing widgets when possible. Never invent custom backgrounds.

## Contact Form Inquiry Pipeline (CRITICAL — DO NOT BREAK)

The `/contact/` form's submit-to-D1 flow spans three files; touching any of them in isolation can break submissions. Treat the following as a hard contract.

### Files in scope

1. **`src/pages/contact.astro`** — defines the form's input `name` attributes (`fullName`, `company`, `email`, `phone`, `productType`, `quantity`, `materialSpec`, `requirements`, `disclaimer`). Field names are the contract.
2. **`src/components/ui/Form.astro`** — wires `fetch('/api/inquiry', { method: 'POST', body: new FormData(form) })` and renders the success/error status banner.
3. **`worker/index.ts`** — `handleInquiryPost()` calls `formData.get(<same name>)` for every field, then `env.DB.prepare(...).bind(...).run()`. Column order in the `INSERT` MUST match the `bind()` order.

### Deployment invariants (verified by `npm run deploy:verify`)

- `wrangler.toml` MUST contain `routes = [{ pattern = "custommachineknives.com/api/*", zone_name = "custommachineknives.com" }]`. Without this block, `wrangler deploy` re-deploys the Worker but the route on `custommachineknives.com` is dropped, and `GET /api/inquiry` returns 404. **This is the bug that caused the Oct 9 outage** — do not remove this block.
- `wrangler.toml` MUST contain `[[d1_databases]] binding = "DB" database_id = "52db485c-8c75-4074-917b-2c9c137538de"`.
- The `functions/` directory MUST NOT exist. It was a dead-code trap (a Pages Functions mirror of `worker/index.ts`). When both exist, Cloudflare Pages may route `/api/inquiry` to the Pages Function, which has no D1 binding, producing 500s. It is now deleted; keep it gone.
- D1 table `inquiries` schema MUST match the 11 `bind()` columns in `worker/index.ts`: `full_name, company, email, phone, product_type, quantity, material_spec, requirements, disclaimer, user_agent, ip`.

### Post-deploy verification

After every deploy, run `npm run deploy:verify` (which runs `wrangler deploy` then `node scripts/verify-inquiry-api.mjs`). The script does a `GET https://custommachineknives.com/api/inquiry` and expects HTTP 200 + `{"success":true,"message":"inquiry API is working"}`. Any other response means the route was dropped — restore the `routes` block in `wrangler.toml` and redeploy before customers can submit. Run `npm run verify:inquiry` on its own to re-check the live endpoint at any time (e.g. from a monitoring cron).
