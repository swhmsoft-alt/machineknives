# Image Catalog

> Machine-readable source of truth: [`src/data/_images-catalog.json`](../src/data/_images-catalog.json) — 26 entries.

## Naming convention

```
public/images/<page-or-section>/<role>[-<n>].svg
```

| role          | widget                       | example                                          |
| ------------- | ---------------------------- | ------------------------------------------------ |
| `hero`        | `<Hero>`                     | `/images/industries/converting/hero.svg`         |
| `content`     | `<Content>`                  | `/images/quality/content-1.svg`                  |
| `steps`       | `<Steps>`                    | `/images/solutions/steps-2.svg`                  |
| `cover`       | category hub `<Hero>`        | `/images/products/cover.svg`                     |
| `placeholder` | product detail `<section>`   | `/images/products/placeholder.svg`               |

Use `<role>-<n>.svg` when one page needs multiple images of the same role
(`solutions/steps-1.svg` + `solutions/steps-2.svg`).

## Status

| status              | meaning                                                           |
| ------------------- | ----------------------------------------------------------------- |
| `placeholder`       | dark-industry SVG waiting for real photo                          |
| `approved`          | real artwork shipped, **do not overwrite**                        |
| `needs-replacement` | real artwork exists but quality / subject is off; replace soon   |

## Replacement workflow (3 steps, 0 code changes)

1. **Find** the entry in `_images-catalog.json` by `key` or `path`.
2. **Overwrite** the file at `path` with the same filename (e.g. `hero.svg` → `hero.jpg`).
3. **Flip** `status` to `approved` in the JSON.

If you changed the file extension, also update the matching `src=` line in
the corresponding `.astro` file (1 line per page, not 26).

## Placeholder summary

26 entries, all `status: "placeholder"`. Breakdown by role:

| role        | count |
| ----------- | ----- |
| `hero`      | 13    |
| `content`   | 11    |
| `steps`     | 2     |
| `cover`     | 1     |
| `placeholder` | 2  |

Priority order for replacement (most visible first):

1. **Industry sub-page heroes** — `/images/industries/<slug>/hero.svg` × 6 (above-the-fold on every industry page)
2. **Product detail placeholder** — `/images/products/placeholder.svg` (8 product pages)
3. **Content widget images** — `/images/<page>/content.svg` × 13 (mid-page, less critical)
4. **Hub heroes** — `/images/{about,contact,services,solutions,products,industries/index}/hero.svg` × 6
5. **Steps widget** — `/images/solutions/steps-{1,2}.svg`
6. **Cover (category hub)** — `/images/products/cover.svg`

## Out-of-registry images

These predate the naming convention. Out of scope for this catalog:

- `/homepage/kaipu-precision-industrial-blade-manufacturing.png` (landing hero)
- `/homepage/placeholder.svg` (4 case-study cards)
