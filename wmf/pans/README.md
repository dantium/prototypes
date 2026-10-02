# WMF — shop journey prototype (Home → Pans → Frying Pans → PDP)

A four-page usability-test prototype fed from the **real wmf.com catalog**, built with the WMF
design system (Rotis, tokens) and the existing comparison-table/header/search prototypes.

| Page | What it is |
|---|---|
| `index.html` | Home — full-screen campaign banner (the megamenu prototype's World Cup hero, header overlaid), CTA into the journey |
| `pans.html` | **Pans** category PLP — subcategory tiles, 34 real products |
| `frying-pans.html` | **Frying Pans** subcategory PLP — 29 real products, comparison table, FAQ |
| `pots.html` | **Pots** category PLP (reached from the POTS nav) — carries the Fusiontec Mineral Pro colour-variant set (`p42`) |
| `product.html?id=…` | **PDP** — Figma "PDP v2" + bundle PDP designs, rendered from the catalog for any product (defaults to `p1`, the Profi Resist Fry Pan; bundle example `p44`) |

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

Built from the Figma **"PDP v2"** handover (file `8oCPrBtDcVBGzxhSrNYlTT`, page "PDP - Dev
handover": desktop `2399:276`, mobile `2666:1164`) plus the **bundle PDP** (`3234:2347`), as one
template that renders **any catalog product** via `?id=` (logic in `assets/pdp.js`, styles in
`assets/pdp.css`, v2 icons in `assets/pdp/v2/`). Boxes are square like the live shop; only pills
and round icon buttons are rounded.

- **Buy box (v2 section stack)** — series eyebrow (links to the series PLP), title, DS
  RatingStars + "(4.5) 80 Reviews" + (i) review notice; **Price Summary**: price + "VAT included,
  plus shipping (free shipping on orders over €49)" (opens the shipping-cost note), and on sale
  items "Last lowest price: ~~€…~~ −38 % (i)" — the (i) opens the **price-history dialog** (today's
  price / lowest price of the last 30 days). Then product selection: **Color** (66 px packshot
  tiles, hover previews the name + price difference), **Size** (124×56 chips with serving
  guidance "For 2–3 people", Size Guide modal), **Options** (DS Product Option Card: name,
  dotted "What's included" that previews on hover / pins on tap, price, and on sets a green
  "You save €…" computed from the set's items; the largest saving gets the DS PromoLabel
  "Best value"). Grey delivery / Click & Collect box, 56 px black CTA + outlined wishlist circle,
  "Also add to your cart" (one example accessory, swipe for the next — the mock hides the
  arrows), myWMF Club Points bar, Klarna bar, 2×2 shopping benefits (stacked on mobile).
- **Below the fold** — **Product Details** accordion (open by default): feature cards + long
  description + "Compare our Range" (pan PDPs only); then collapsed accordions **Scope of
  delivery / Technical data / Reviews / Documents & downloads**; recommendation rows
  ("Suitable alternatives" = live tiles from the same category, "Ideally complements");
  FAQ. The old HoneyComb mock's USP strip, banners, UGC, testimonial, recipes and how-to video
  were dropped with v2.
- **Bundle template** — any product whose sku is a shop bundle (`bundle-<sku>-<sku>…`: `p12`,
  `p30`, `p43`, and `p44`, the live Aparto cooking set from wmf.com/de/de) gets: the DS
  PromoLabel **"Bundle savings"** on the gallery (only when it saves money); a plain black set
  price — never a strikethrough or 30-day reduction, since the saving is against the items'
  total, not a price cut — with **"You save €21.80 (10%) compared to buying individually"**; a
  **"This bundle includes N products"** box, collapsed by default (Figma component `3250:2914`),
  that expands to one row per item (packshot, qty × name linking to the item PDP where it's in
  the catalog, its price, and **its own rating** — no aggregated set rating) and a summary
  (bought individually / set price / your saving); **"Advantages of the set"** bullets in place of
  the accessory upsell (when the catalog has them — `bundleInfo.advantages`); gallery = set
  shot + each item's packshot + `bundleInfo.gallery`; feature cards / description from
  `bundleInfo`; Technical data grouped per item; no Reviews accordion while the bundle has no
  reviews of its own. "Bought individually" is the live shop's "statt" price (the bundle's
  `msrp`), else the sum of the item prices when all are known. Bundle items take `price` /
  `rating` / `reviews` / `tech` from the `bundle` entry, falling back to the catalog product
  (`id`) or any variant with that `sku`.
- **Profi Resist** (`p1`, `p11`) keeps the mock's lifestyle gallery ("Watch video" flag) and the
  six Product Details feature cards; other products show their packshot (+ shared in-use shot),
  and only the long description.
- **Set / bundle configurations** — products tied by `bundleGroup` (+ `bundleLabel`, optional
  `bundleOrder`) show as Options; the current one is selected, the others link to their PDP.
  Products whose own variants are "Set of N" pick in place. **Colour-variant products** (`p42`)
  swap packshot, price, Klarna, points and article number.
- Gallery: sliding track (arrows, thumbs, keys, swipe), progress bar, 114 px bordered thumbs
  (88 px on mobile), fullscreen zoom viewer.
- Images: `assets/pdp/` (mock), `assets/pdp/v2/` (v2 icons from Figma), `assets/pdp/bundle-aparto/`
  and `assets/products/<sku>.jpg` (live shop photos for the Aparto bundle and its items).

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
