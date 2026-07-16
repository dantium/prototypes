# WMF — Frying Pans PLP prototype

Prototype of the Pans PLP ([Figma](https://www.figma.com/design/8oCPrBtDcVBGzxhSrNYlTT/WMF-Mockups-PANS?node-id=349-159)),
built with the WMF design system (Rotis, design tokens) and fed from the **real wmf.com catalog**
so it can be used for usability testing. Reuses the existing range-comparison table and the WMF header.

## Running it

It **must be served over http** — the page fetches its catalog, and browsers block `fetch()` of
`file://` URLs. Opening `index.html` directly shows a "couldn't load" message.

```bash
# from the repo root
python3 -m http.server 8756
# then open http://localhost:8756/wmf/pans/index.html
```

## Where the data lives

All products come from **`assets/products.json`** — edit that, not the HTML. The grid, the search
autocomplete and the whole facet rail are generated from it. Product photos live in
`assets/products/<sku>.jpg` (filename = the SKU in the JSON).

The data was scraped from the live category
(`wmf.com/de/en/products/pans/frying-pans.html?product_list_limit=48`): 45 SKUs grouped into
28 products. Names, prices, MSRP, discounts, sizes and images are real.

## JSON contract

```jsonc
{
  "count": 28,          // products (cards)
  "skuCount": 45,       // underlying SKUs
  "products": [
    {
      "id": "p0",
      "brand": "WMF",                    // -> Brand facet
      "name": "Profi Resist Fry Pan",
      "series": "Profi Resist",          // -> Series facet
      "type": "Single pan",              // "Single pan" | "Set"  -> Type facet
      "minPrice": 69.99,                 // -> Price facet buckets
      "sizes": ["24 cm", "28 cm"],       // -> Size facet
      "rating": 4.6,                     // NOTE: synthesized, see below
      "reviews": 605,                    //       "
      "bestseller": true,                // -> Offer facet + card badge
      "default": 1,                      // index into variants[] shown first
      "variants": [                      // each variant = a real SKU
        { "sku": "3201000357", "size": "24 cm", "price": 69.99, "msrp": 130.48 },
        { "sku": "3201000358", "size": "28 cm", "price": 79.99, "msrp": 129.99 }
      ],
      "search": "wmf profi resist fry pan 24 cm 28 cm"   // lowercase search haystack
    }
  ]
}
```

`msrp` is optional — when it's greater than `price`, the card shows MSRP plus a computed
`Save X%` tag. Selecting a size variant swaps the price, MSRP, discount **and** image.

### PIM-ready facets (not populated yet)

The Figma rail also shows **Material / Cooking Technique / Surface / Occasion**. The shop's PLP
doesn't expose these and WMF plan to add them to the PIM, so they are deliberately **omitted
rather than invented** — fabricated product attributes in front of usability testers are a real
risk (and a claims risk).

They are wired up and dormant: add the field to any product and the group appears automatically,
with options derived from the real values, in the Figma order. No code change needed.

```jsonc
{
  "material":  "Stainless Steel 3-ply",              // single value
  "technique": ["Intense Searing", "All Purpose"],   // or an array -> product appears under each
  "surface":   "Uncoated",
  "occasion":  ["Everyday", "Gifting"]
}
```

Partial coverage is fine — a group only lists the values that actually occur, and products
missing the field simply drop out when that facet is used. The option wording shown to testers is
whatever the PIM supplies, so agree the vocabulary before testing.

## Behaviour

- **Search** (header magnifier) — overlay with live autocomplete over the catalog, trending and
  recent searches; submitting filters the grid.
- **Facets** — OR within a group, AND across groups. Chips above the rail, with Clear all.
- **Sort** — Bestseller / price / rating / newest.
- Combine freely: facets and search apply together.

## Known gaps

- **Ratings and review counts are synthesized** (stable per product). The real ones are served by
  Bazaarvoice via JS and aren't in the page HTML.
- **The hover "in-use" shot is one shared lifestyle image** for every card — the PLP only exposes
  one image per product, so per-product secondary shots weren't scraped.
- `assets/reddot.png` is currently unused: the Red Dot award was dropped from the real cards
  rather than guess which products actually won it.
