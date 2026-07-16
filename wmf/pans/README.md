# WMF — shop journey prototype (Home → Pans → Frying Pans)

A three-page usability-test prototype fed from the **real wmf.com catalog**, built with the WMF
design system (Rotis, tokens) and the existing comparison-table/header/search prototypes.

| Page | What it is |
|---|---|
| `index.html` | Home — dark hero (search-prototype style), nav with working **PANS megamenu**, search entry |
| `pans.html` | **Pans** category PLP — subcategory tiles, 34 real products |
| `frying-pans.html` | **Frying Pans** subcategory PLP — 29 real products, comparison table, FAQ |

The journey works both ways: megamenu/tiles drill down, breadcrumbs go back up.
Search works on every page (submitting from Home lands on `pans.html?q=…`).

## Running it

Must be served over **http** — the pages fetch their catalog, and browsers block `fetch()` of
`file://` URLs:

```bash
# from the repo root
python3 -m http.server 8756
# http://localhost:8756/wmf/pans/index.html
```

## Where the data lives

Everything comes from **`assets/catalog.json`** — 59 real SKUs grouped into 42 products, scraped
from the live shop (`/de/en/products/pans.html` + `/products/pans/frying-pans.html`, 48 tiles
each). Product photos are in `assets/products/<sku>.jpg` (filename = SKU).

Real per-SKU data:
- **names, prices, MSRP** (tile markup; sale price renders red with italic MSRP, like the shop)
- **labels** — `NEW` / `BESTSELLER` / `BUNDLE` / `SALE` from the shop's datalayer → corner badges
- **stock** — datalayer `product_stock` + PDP `offers.availability` → per-variant In/Out of stock
- **position** — the shop's own category ordering → the "Recommended" sort
- **ratings** — Bazaarvoice values from PDP JSON-LD. Only 9 of 42 products have reviews on the
  de/en store; the rest show **no stars rather than invented ones** (`rating: null`).

Shared code: `assets/styles.css` + `assets/app.js` (header/megamenu/search/footer chrome, grid,
facets, sort). Each page sets `window.PAGE = { kind, category }`.

## JSON contract (per product)

```jsonc
{
  "id": "p0", "brand": "WMF",
  "name": "Profi Resist Fry Pan",
  "series": "Profi Resist",          // collection eyebrow + Series facet
  "type": "Single pan",              // "Single pan" | "Set"
  "minPrice": 69.99,
  "sizes": ["24 cm", "28 cm"],
  "rating": 4.0, "reviews": 2,       // real Bazaarvoice, or null
  "default": 1,                      // variant shown first
  "cats": { "pans": 7, "frying-pans": 2 },   // category -> real shop position
  "variants": [
    { "sku": "3201000357", "size": "24 cm", "price": 69.99, "msrp": 130.48,
      "stock": true, "label": null },
    { "sku": "3201000358", "size": "28 cm", "price": 79.99, "msrp": 129.99,
      "stock": true, "label": "BESTSELLER" }
  ],
  "search": "wmf profi resist fry pan …"
}
```

Selecting a size variant swaps price, MSRP, Save %, stock, badge **and** image.

### PIM-ready facets (not populated yet)

**Material / Cooking Technique / Surface / Occasion** are on the Figma rail but not exposed by
the shop; WMF plan to add them in the PIM. They are wired up dormant — add the field to any
product and the facet group appears automatically (single value or array):

```jsonc
{ "material": "Stainless Steel 3-ply", "technique": ["Intense Searing", "All Purpose"],
  "surface": "Uncoated", "occasion": ["Everyday", "Gifting"] }
```

`technique`/`surface` values additionally render as info labels on the product image.
Nothing is fabricated in the meantime — fake product attributes in front of testers are a
claims risk.

## Behaviour

- **Megamenu** — hover PANS for the panel (columns from the megamenu prototype); click navigates.
  Mobile gets a nav drawer via the hamburger.
- **Search** — overlay on every page: live autocomplete over the whole catalog, trending/recent;
  submit filters the PLP (`?q=` deep-links work, e.g. the megamenu Material links).
- **Facets** — generated from the catalog per page (OR within group, AND across). Chips + Clear
  all; on mobile a proper drawer: header, scrollable body, sticky "Show N products" apply bar.
- **Sort** — Recommended (real shop order) / price / top rated / new in.

## Known gaps

- The hover "in-use" shot is one shared lifestyle image, not per-product.
- Non-pan nav items (POTS, CUTLERY, …) are present but not built out.
- `assets/reddot.png` unused — award dropped rather than guess which products won it.
