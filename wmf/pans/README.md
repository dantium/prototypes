# WMF — shop journey prototype (Home → Pans → Frying Pans → PDP)

A four-page usability-test prototype fed from the **real wmf.com catalog**, built with the WMF
design system (Rotis, tokens) and the existing comparison-table/header/search prototypes.

| Page | What it is |
|---|---|
| `index.html` | Home — full-screen campaign banner (the megamenu prototype's World Cup hero, header overlaid), CTA into the journey |
| `pans.html` | **Pans** category PLP — subcategory tiles, 34 real products |
| `frying-pans.html` | **Frying Pans** subcategory PLP — 29 real products, comparison table, FAQ |
| `pots.html` | **Pots** category PLP (reached from the POTS nav) — carries the Fusiontec Mineral Pro colour-variant set (`p42`) |
| `product.html?id=…` | **PDP** — Figma "PDP - HoneyComb Pro+" design, rendered from the catalog for any product (defaults to `p1`, the Profi Resist Fry Pan the mock depicts) |

The journey works both ways: megamenu/tiles drill down, breadcrumbs go back up.
Every product tile (grid + search overlay) links to `product.html?id=…`.
Search works on every page (submitting from Home or a PDP lands on `pans.html?q=…`).

## Locale switcher & languages (EN / DE)

The footer trigger (flag + "Germany · English") opens a right-hand **Select Country** panel
(styled after the Our Place reference: current-location note, highlighted current row, then
the shipping areas with flags and language buttons). Locales: Germany (English, Deutsch),
Netherlands (English), Spain (English), Austria (Deutsch), Switzerland (Deutsch, English) —
only the two content languages we actually have are offered (no French/Dutch/Spanish
interface or products). Each market has a billing currency shown **only in the switcher
note** — Switzerland reads "billed in CHF", the rest "billed in EUR"; the pages themselves
stay in EUR (the prototype isn't a real FX/checkout). Picking a row stores `wmf_locale` +
`wmf_lang` and reloads; `?lang=de` also works. Choosing German flips the whole journey to
German:

- **UI strings** come from `assets/i18n-de.js` — a dictionary keyed by the English source
  strings; anything missing falls back to English. JS-rendered surfaces translate via `t()`,
  static markup via `data-i18n` / `data-i18n-html` attributes swapped on load.
- **Product data**: `name_de` on all 42 products and `description_de` on 26 come from the
  real `wmf.com/de/de` shop (same SKU join as the EN scrape — the DE shop also reveals the
  real series naming, e.g. EN "Non-Stick Fry Pan" = DE "Devil Stielpfanne"). The remaining
  names are pattern-translated from the EN names; products without `description_de` fall
  back to the English description.
- Prices format per language (`€79.99` ↔ `79,99 €`), search matches both languages'
  names, and the deep megamenu links outside the Pans/Knives panels stay English
  (dead links; translate in `i18n-de.js` when needed).

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
- **names, prices, MSRP** — price rendering follows the Figma Price Display component
  (`1621:6329`): the Discount variant (red price, "Save N%" chip, italic "€… (last 30 days
  lowest price)") shows only for variants flagged `"sale": true` in the JSON. Nearly every
  scraped product carries an MSRP, so sale display is opt-in — flagged today: the two products
  the shop itself labels SALE (p24, p26) plus the two the mock features discounted (p1, p10).
  Everything else renders the Default variant (black price, "Including VAT"); MSRPs stay in
  the data.
- **labels** — `NEW` / `BESTSELLER` / `BUNDLE` / `SALE` from the shop's datalayer → corner badges
- **stock** — datalayer `product_stock` + PDP `offers.availability` → per-variant In/Out of stock
- **position** — the shop's own category ordering → the "Recommended" sort
- **ratings + reviews** — scraped from the German store (`wmf.com/de/de`), where an exact-SKU
  search redirects straight to the PDP. The aggregate comes from the page's JSON-LD, the review
  bodies from the inline Alpine component. 37 of 43 products carry a real rating covering **905
  real reviews**; the rest show **no stars rather than invented ones** (`rating: null`). The live
  shop lists each size as its own product, so counts are summed across a product's variant SKUs
  and the rating is weighted by count. Each product also stores up to 3 real review bodies
  (`reviewItems`) with the author, date and star count, English alongside the German original.
- **descriptions** — the real PDP copy (JSON-LD `description`, footnotes stripped) on 41 of 42
  products. Search matches against it, so attribute queries like "induction" or
  "scratch-resistant" find products; name/series matches rank first, and the overlay shows the
  matched description text as the row's subtitle.

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
  "rating": 4.45, "reviews": 80,     // real, scraped from de/de — or null
  "reviewItems": [                   // up to 3 real reviews, EN + DE
    { "name": "Werner", "date": "25.04.26", "stars": 5,
      "title": "…", "text": "…", "title_de": "…", "text_de": "…" }
  ],
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

### Enriched attributes (until the PIM supplies them)

**Material / Cooking Technique / Surface / Occasion** match the Figma rail. The shop's PLP
doesn't expose them, so they are **derived** (authorised for the usability test) and will be
replaced by PIM data when it lands — the facet groups read whatever the JSON contains:

- **Material** — from the shop's own datalayer `marketing_subcategory` per SKU:
  `P&P MULTILAYER` → Stainless Steel 3-ply, `P&P STAINLESS…` → Stainless Steel 1-ply,
  `P&P SILARGAN` → Fusiontec, `P&P ALU…` → Cast Aluminium, `P&P CAST IRON` → Cast Iron.
- **Surface** — subcategory (`…CERAMIC`, `…ALU NS`) plus the real PDP description wording
  (`non-stick`/`PermaDur` → Non-stick, `CeraDur`/ceramic → Ceramic, else Uncoated).
- **Cooking Technique** — merchandising rule: Profi Resist + Fusiontec → All Purpose,
  Uncoated → Intense Searing, coated → Gentle Frying.
- **Occasion** — merchandising rule: everything Everyday; Sets and €150+ also Gifting.

The derivation lives in the scrape pipeline (`enrich.mjs`); rules are deterministic and
re-runnable. `technique`/`surface` also render as info labels on the product image. Size
options show the Figma serving hints ("28 cm (4 – 6 people)") as display-only text.

## PDP (`product.html`)

Built from the Figma **"PDP - HoneyComb Pro+ (Version 1)"** mock (file `8oCPrBtDcVBGzxhSrNYlTT`,
node `2:2`), as one template that renders **any catalog product** via `?id=`:

- **Data-driven** (from `catalog.json`): breadcrumb trail, series eyebrow, title (+ selected
  size), real PDP description behind Read more, real rating/review count (none shown when the
  shop has none), the Price Display component (Figma `1621:6329`, Default and Discount
  variants) — red price + "Save N%" chip + italic "€… (last 30 days lowest price)" when
  discounted, otherwise black price with the underlined free-shipping hint —
  Klarna 3-way split and Club Points (computed from price),
  set upsell (appears when the series has a Set — links to its PDP), size chips with serving
  hints + per-variant stock, stock-aware delivery block and CTA, Technical Data accordion
  (per-variant SKU), "Suitable alternatives" (same category, real shop order, live tiles).
  Bundle products (the shop's BUNDLE label: `p12`, `p30`) list their components under the CTA
  like the live bundle PDP ("This set contains:", thumbnails + 1 × item), driven by a `bundle`
  array in the JSON; components that exist as catalog products link to their own PDP.
  **Set / bundle configurations** are presented as a third selector alongside colour and size,
  so all three read the same way (label + current choice + outlined options): an "Options:"
  group listing every configuration of the family as a stacked row — thumbnail, the real
  product name, and on a second line the configuration (Set of 2 / Set of 3 …). Sets/bundles
  add a dashed **"What's included"** toggle on that second line: hover previews the contents,
  and a tap pins the card open (works on touch, where hover doesn't) — one open at a time,
  dismissed by an outside tap. The price column shows the set's RRP as its value
  ("(€199 value)", muted grey, sets only — a plain single pan shows no value line) and a subtle
  gold **"Best value"** tag above the price of the strongest-value set (largest RRP saving).
  The selected row takes the same plain 1px black stroke as the size chips. Rows stack rather
  than sit side-by-side so the full names fit on one line. Contents come from each product's
  `bundle` array.
  Products are tied together by `bundleGroup` in the JSON with a `bundleLabel` each — today
  `profi-resist-frypan` (Single pan / With spatula / Set of 2) and `durado-frypan` (Single pan
  / Set of 2 / Set of 3 / Set of 3 + protectors), ordered by an explicit `bundleOrder` where
  the catalog sets one, else single → accessory → sets. That last Durado option is a real
  cross-product **bundle** (the shop's own `bundle-<sku>-<sku>` product: the 3-piece set plus a
  2-piece pan-protector set, €132.46 against €137.98 bought separately) — the case where a
  bundle builds on a set rather than a single pan, which is why the order is explicit. The current configuration is the
  selected card; the others link to their own PDP. This replaces the old one-off set-upsell
  row. The "This set contains:" list still appears on set PDPs — the selector picks the
  configuration, the list says what's inside it.
  **Colour-variant products** (a `colors` array in the JSON — `p42`, the 8-colour Fusiontec
  Mineral Pro pot set) render a "Color / <name>" image-swatch selector (selected one outlined,
  like the reference); picking a colour swaps the gallery packshot, price, Klarna split, Club
  points and article number. Its 8 real colour packshots come from the live shop by SKU. The
  size chip is hidden for single-size colour products (colour is the axis).
- **Figma example content** — the feature USP icon strip (7 line icons: 10-year warranty,
  metal-utensil safe, oven-safe, dishwasher safe, mineral ceramic non-stick, all hobs,
  3-ply — drawn as inline SVGs) and the below-fold marketing (SearProtect®/3-ply banners, Product
  Advantages, UGC row, VOGUE testimonial, recipes) describes the honeycomb Profi Resist build,
  so it renders **only for the Profi Resist series** (`p1`, `p11`, `p12`); other products get the
  standard PDP without it. The gallery works the same way: Profi Resist gets the mock's
  lifestyle shots (steak main + honeycomb/3-ply/cleaning/heating thumbs, "Watch video" flag),
  everything else gets its packshot + the shared in-use shot. Gallery chrome follows the live
  shop: the stage is a horizontal track that **slides** between images (prev/next, thumbs,
  keyboard and touch-swipe all animate the same translate), prev/next circles on the stage
  (pale when at either end), a thin progress bar, square bordered thumbnails (black border =
  active) that center when they fit and scroll when they don't, and the zoom icon top-right
  (or a click on the image) opening a fullscreen viewer with arrows, an image counter,
  Esc/arrow-key support. Packshot slides re-point to the selected size/colour sku on the fly.
- **Example content, shared across products** (same precedent as the shared hover shot):
  the buy-box accessory (Profi Plus spatula) and the "Ideally complements" accessories with
  prices from the mock, Use & Care copy keyed off the product's surface attribute, and the
  how-to video card. FAQ = the same 5 Q&As as the frying-pans PLP, and the "Compare our
  Range" table from the PLP sits above it (white background variant) on every PDP.
- Images live in `assets/pdp/` (downloaded from the Figma mock, resized ≤1100px, ~1.2 MB
  total). Two mock thumbs carry German captions baked into the artwork.
- Cart clicks bump the header count; size switches swap price/UVP/Klarna/points/SKU/packshot.
- **Popups**: Size Guide (rim-diameter note + serves/use table, the product's own sizes ticked,
  others dimmed) and Club Points ((i) on the myWMF bar — how points work + the points this
  purchase earns). Scrim click, × and Esc close them.
- **Accessory slider**: the buy-box "Add Accessories" row pages through 4 example accessories
  with the ‹ › arrows from the mock (clamped at the ends, position kept across size switches).

## Search: natural language

Trending searches mix natural-language needs ("Pan for cooking steak", "Pan for a large
family", "Best pan for eggs", "Gift for a home cook") with product shorthand. For those to
return something sensible the matcher drops filler words (a/for/the/best/cooking… plus the
German equivalents) and maps intent words onto the catalog's real attributes — `steak`/`sear`
→ Intense Searing, `eggs`/`fish`/`pancake` → Gentle Frying or a non-stick/ceramic surface,
`family`/`large` → 28 cm+ and sets, `gift` → the Gifting occasion, `everyday` → Everyday.
Both languages share the maps, so "Pfanne zum Steak braten" works too. Add new phrasings by
extending `STOPWORDS` / `INTENT` in [assets/app.js](assets/app.js).

## Behaviour

- **Megamenu** — every nav item opens its panel on hover, with the full menu data from the
  megamenu prototype living in **`assets/menu.json`** (edit that file to change menus; pan links
  are live, the rest are `#`). Clicking PANS navigates. On mobile the hamburger opens the menu
  drawer; tapping an item opens its panel with BACK/CLOSE, like the prototype.
- **Search** — the search prototype's UX, fed by the real catalog. A persistent header search box
  mirrors the active query (× clears it). The overlay is a centered modal with: recent searches
  (per-item remove + Clear all, kept for the session), trending searches, popular-category chips,
  and — while typing — query completions with bold match highlighting (built from the real product
  vocabulary), category suggestions with real counts, product rows with photos and prices, and a
  "See all results" CTA. Queries also match the real product descriptions (name matches rank
  first; description hits show the matched text). Submitting switches the page into results mode:
  a "N results for "q"" head replaces the category head, and the category content (title, hero,
  subcategory tiles, comparison table, FAQ) hides until the search is cleared. `?q=` deep-links
  work, e.g. the megamenu Material links. Zero results strips the page to the message and its
  escape routes — popular searches and popular category tiles — hiding breadcrumbs, toolbar,
  filters and sort until a search succeeds or is cleared.
- **Facets** — generated from the catalog per page (OR within group, AND across). Chips + Clear
  all; on mobile a proper drawer: header, scrollable body, sticky "Show N products" apply bar.
- **Sort** — Recommended (real shop order) / price / top rated / new in.

## Known gaps

- The hover "in-use" shot is one shared lifestyle image, not per-product.
- Non-pan nav items (POTS, CUTLERY, …) are present but not built out.
- `assets/reddot.png` unused — award dropped rather than guess which products won it.
- PDP: Watch video / Size Guide / Klarna Learn more / recipe cards / document downloads are
  visual affordances only (nothing to open in a static prototype); the wishlist heart toggles
  but persists nothing; the design mock's "HEAT-RESPOSIVE" typo is corrected to RESPONSIVE.
