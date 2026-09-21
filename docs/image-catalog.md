# Image Catalog

> Machine-readable source of truth: [`src/data/_images-catalog.json`](../src/data/_images-catalog.json) — 25 entries.

## Naming convention (page + semantic)

```
public/images/<page-or-section>/<semantic-name>.svg
```

- **`<page-or-section>`**: URL path directory (`about`, `industries/plastics-recycling`, `products`).
- **`<semantic-name>`**: kebab-case description of what the image shows, derived from the alt text. Examples:
  - `manufacturing-facility-overview` (not `hero`)
  - `granulator-rotor-knife` (not `hero`)
  - `score-geometry-diagram` (not `content`)
  - `engineering-team-drawing` (not `hero`)

The filename **describes the image**, not the widget slot. The same file used by two widgets (e.g. `hero` and `cover`) keeps the same semantic name.

### Why this is better than role-based

| role-based (rejected)        | semantic (current)                       |
| ---------------------------- | ----------------------------------------- |
| `hero.svg`                 | `manufacturing-facility-overview.svg`   |
| `content.svg`              | `score-geometry-diagram.svg`            |
| `process.svg`              | `engagement-process-flow.svg`           |

A photographer replacing `hero.svg` has no idea what they are replacing. A photographer replacing `manufacturing-facility-overview.jpg` knows exactly what to deliver.

### Roles are tracked in JSON, not the filename

The `o` field in `_images-catalog.json` (e.g. `"hero"`, `"content"`, `"steps"`, `"cover"`, `"placeholder"`) tells the admin page which widget the image serves. This decouples **image identity** from **display role** — a future migration from `<Hero>` to a different widget does not require renaming files.

## Status

| status               | meaning                                                          |
| -------------------- | ---------------------------------------------------------------- |
| `placeholder`      | the file at `path` is a dark-industry SVG waiting for a real photo |
| `approved`         | real artwork lives at `path`; **do not overwrite**              |
| `needs-replacement`| real artwork exists but quality / subject is off; replace soon |

## Replacement workflow (3 steps, 0 code changes)

1. **Find** the entry in `_images-catalog.json` (or open `/admin/images/`).
2. **Overwrite** the file at `path` with the same filename (e.g. `manufacturing-facility-overview.svg` → `.jpg`).
3. **Edit** the catalog JSON `p` field if you changed the file extension. Flip `status` to `approved`.

If you changed the file extension, also update the matching `.astro` `const heroImageHtml` line (the only place a real page reads this registry).

## Priority order for replacement

1. **Industry sub-page heroes** — `/images/industries/<slug>/...hero` (above-the-fold on every industry page)
2. **Product detail placeholder** — `/images/products/product-detail.svg` (8 product pages)
3. **Content widget images** — `/images/<page>/...diagram` (mid-page, less critical)
4. **Hub heroes** — `/images/{about,contact,services,solutions,products,industries/index}/...overview` (6 pages)
5. **Steps widget** — `/images/solutions/{material-families-overview, engagement-process-flow}.svg`
6. **Cover (category hub)** — `/images/products/category-banner.svg`

## Out-of-registry images

These predate the naming convention. Out of scope for this catalog:

- `/homepage/kaipu-precision-industrial-blade-manufacturing.png` (landing hero)
- `/homepage/placeholder.svg` (4 case-study cards)
