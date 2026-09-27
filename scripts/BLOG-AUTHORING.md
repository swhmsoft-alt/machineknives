# Blog post authoring guide

> **All new posts MUST follow the [Round 3 SEO standards](../audit-results/on-page-seo-audit-v2-single-pages.md).** This README is the operational how-to.

## 🚀 Quick start (recommended)

```bash
node scripts/new-blog-post.mjs \
  --title "How to Choose Slitter Blades for Paper" \
  --category selection-guide \
  --excerpt "Pick the right circular slitter blade for paper or film. Covers material grade, edge geometry, clearance angles and expected service life in converting lines."
```

That command:

1. Validates the title (50–60 chars **including** the auto-appended brand suffix ` — Industrial Knives`)
2. Validates the excerpt (120–160 chars)
3. Validates the category and type against the schema
4. Generates a kebab-case slug from the title
5. Creates `src/data/post/<slug>.md` with the full frontmatter + a body skeleton
6. Triggers `scripts/og-image-generator.mjs --slug <slug>` to produce a 1200×630 WebP OG card in `public/images/og/<slug>.webp`
7. Prints the next-step checklist

Use `--draft` to mark the post as noindex during review. Use `--skip-og` to defer OG generation.

## 📋 Field constraints (enforced by `scripts/check-frontmatter-lint.mjs`)

| Field | Required | Constraint |
|---|---|---|
| `title` | ✅ | raw length + 20 (brand suffix) ∈ [50, 60] chars |
| `excerpt` | ✅ | length ∈ [120, 160] chars |
| `image` | ✅ | matches `/^\/images\/og\/[a-z0-9-]+\.(png\|webp)$/` |
| `category` | ✅ | one of 9 known slugs |
| `type` | ✅ | `article` \| `glossary` \| `comparison` |
| `publishDate` | ✅ | ISO date (YYYY-MM-DD) |
| `tags` | optional | array of kebab-case strings |
| `author` | optional | default `Industrial Knives Engineering` |
| `metadata.description` | optional | mirrors excerpt; can be tuned independently |
| `metadata.canonical` | optional | absolute URL; auto-derived if absent |
| `draft` | optional | `true` → noindex |

## 🎨 OG card palette (auto-selected by `type`)

| `type` | pill color | orb color | mood |
|---|---|---|---|
| `article` | cyan `#38BDF8` | brand orange `#C9531F` | engineering |
| `glossary` | violet `#A78BFA` | amber `#F59E0B` | academic |
| `comparison` | emerald `#34D399` | brand orange `#C9531F` | analytical |

The OG generator also adds a faint circular-blade silhouette at bottom-right (12 teeth + 5 concentric rings + 6 radial spokes) using the type's pill color, plus a 3-line vertical grid and two blurred radial orbs.

## ✍️ Manual workflow (when not using the helper)

If you prefer to hand-author the markdown:

1. Copy `scripts/blog-post-template.md` to `src/data/post/<kebab-slug>.md`
2. Fill in `title`, `excerpt`, `category`, `type`, `publishDate`
3. Leave `image: ''` (the next build pipeline fills it)
4. Write the body
5. Run `node scripts/og-image-generator.mjs --slug <your-slug>` to render the OG card
6. Verify: `node scripts/check-frontmatter-lint.mjs`

## 🛠️ Available helper scripts

| Script | When |
|---|---|
| `node scripts/new-blog-post.mjs` | scaffolding a new post from CLI |
| `node scripts/og-image-generator.mjs` | regenerating OG cards (all 110) |
| `node scripts/og-image-generator.mjs --slug X` | regenerating one OG card |
| `node scripts/og-image-generator.mjs --force` | regenerating all even when fresh |
| `node scripts/check-frontmatter-lint.mjs` | CI-style validation of all frontmatter |
| `node audit-results/_v2-audit.mjs` | SEO compliance dashboard |

## ⚠️ Common pitfalls

- **Title too long (full > 60)**: trim to 30–40 raw chars
- **Title too short (full < 50)**: add context (material / feature / category)
- **Excerpt too short (< 120)**: state concrete value proposition
- **Excerpt too long (> 160)**: Google will truncate, SERP real-estate wasted
- **Missing `image:` field**: build will fail (schema requires it)
- **MOJIBAKE in title/excerpt (`�`)**: triggers audit warning; check your editor's encoding (must be UTF-8 no BOM)
- **Draft posts**: the URL still emits (for category routing) but the page is noindex

## 🔗 Related

- [Round 2 verification report](../../audit-results/post-fix-v2-verification.md) — what Round 2 changed
- [Round 3 verification report](../../audit-results/post-fix-p0p1p2-verification.md) — content rewrite mechanics
- [OG workflow verification report](../../audit-results/post-fix-og-workflow.md) — visual + format history