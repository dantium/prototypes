# WMF Pans PLP — developer handover (updated 28 October 2026)

Each item: what the site does **today** → the **new** behaviour. The prototype is the working
reference for every change: https://dantium.github.io/prototypes/wmf/pans/pans.html
(logic in `wmf/pans/assets/app.js`; commits `e2f1c82` · `228bc93` · `af5d555`).

## Mega menu / Header

| Change | Current site | New |
|---|---|---|
| Cart badge | Static count | Live cart total; hidden when the cart is empty |

Nothing else in the mega menu changes.

## PLP — Filters

| Change | Current site | New |
|---|---|---|
| Quick filters | None on the PLP | Chips share one sticky toolbar with Filter, result count and sort: Induction / Intense searing / Gentle frying / 28 cm / In stock. Selected chips use the pale gold fill and ×; Clear all resets shared state |
| Cooktop filter | No facet — only an "Induction pans" category tile | New "Cooktop type" facet, after Cooking Technique: `Induction / Gas / Electric / Glass ceramic / Halogen`, from **PIM** (Halogen has zero matches until compatibility data is supplied); accessories have no value and drop out when filtering; Induction is also the lead quick chip |
| Filter sidebar | Scrolls away with the page | Sticky (>900px): pins beneath the results toolbar, scrolls internally when tall, no scrollbar; mobile drawer unchanged |
| Option counts | No numbers on options | Every option shows its expected result count — computed from search + all *other* selected groups (OR within a group, AND across); zero-count options dim but stay clickable |
| Category switch | Resets all selections | Compatible selections carry over (options that exist in the new category); their groups open; "Clear all" clears everything. Prototype: sessionStorage — live: prefer URL params |

## PLP — Product tile

| Change | Current site | New |
|---|---|---|
| Tile content | Older condensed tile | Shared Product Card v2 extension: collection → name → rating → Price Summary / Card → size variants → availability. Native WMF Rotis Web: collection 12/16 Regular, name 15/22 Medium, price 20/30 Bold, supporting price 12/16. Price-line gap 2 px; 8 px after image, 4 px before price, 8 px before size/availability; row gutter 32 px |
| Tile image | Product shot inset; hover shows in-use photo (desktop) | Product shot fills the tile edge-to-edge. **Mobile:** swipeable 2-slide gallery (product shot → in-use photo) with a progress bar under the image, as on the live PLP; badges/buttons stay fixed while images swipe. Desktop hover unchanged |
| Cart quantity | Shown in the header only | Also on the tile's bag button (badge on the circle, none at 0) |
| Out of stock | No action on the tile | **Out of stock · selected size** plus bold underlined **Notify me**. Centered email dialog retains product/SKU/size; validates email and demonstrates activation; Escape/×/backdrop close and restore focus. No bell. Preview note explicitly says no email is sent; only selected SKU activation is stored for the session. Production needs the stock-alert API |

## PLP — Toolbar & layout

| Change | Current site | New |
|---|---|---|
| Pan Finder | Dead button | Bold underlined header link opens a centered three-step modal (cooking style → cooktop → size); completing it applies the catalog facets. Neocom is not connected in this prototype |
| Mobile scroll rows | Scrollbar / no affordance | Category tiles retain paging arrows. Toolbar chips scroll horizontally; Filter and Sort remain available. Phone layouts place chips on a second row |
| Category hero image | Image beside the H1 | Removed for now; single-column page head |

## PDP

| Change | Current site | New |
|---|---|---|
| Add to cart | Updates header only | Also drives the shared cart state behind the tile + header badges |
| Colour | Colour picker in the buy box | Unchanged — PDP picker drives packshot / price / SKU; pan PLP cards show size choices; the existing Pots colour swatches remain available and the PDP retains its colour picker |

## Search

| Change | Current site | New |
|---|---|---|
| Suggestions (empty) | Trending always shown | If the user has recent searches: show Recents, hide Trending; otherwise Trending as today |
| Product suggestions | Plain list | Labelled "Top results" with a live "x of y results" count. **Mobile ≤700px:** one horizontally-scrolling row of compact cards (visible above the open keyboard). Desktop list unchanged |
| Input placeholder | Long guidance text | Just "Search" on mobile |
| Results page | — | Unchanged (standard grid, now with the new tile) |

## Copy (EN / DE)

| Context | EN | DE |
|---|---|---|
| Chips row label | Frequently selected criteria | Häufig gewählte Kriterien |
| Cooktop facet | Cooktop type | Herdart |
| Ideal for — Searing | Ideal for: Searing protein and vegetables | Ideal für: Scharfes Anbraten von Fleisch und Gemüse |
| Ideal for — Gentle | Ideal for: Delicate food like eggs and fish | Ideal für: Empfindliches wie Eier und Fisch |
| Ideal for — All Purpose ⚠️ placeholder | Ideal for: All-round everyday cooking | Ideal für: Vielseitiges Kochen im Alltag |
| Notify popover | Enter your email address and we will inform you when the product is available again. → Remind me | Geben Sie Ihre E-Mail-Adresse ein … → Benachrichtigen |

Full dictionary: `assets/i18n-de.js` (EN-keyed, falls back to EN).

## Not in this scope

#16 category-tile rework (design decision pending) · #10–12 interactive comparison (on hold) ·
#6/#9/#14/#15 (discuss/later) · photo & voice search (parked, trbo ≥2027).

## Price Summary / Card

Uses the published component (`3463:4846`, Size=Card), with VAT below the amount and
comparison lines grouped at a native 2 px gap. Standard is black; Reduction is red with a
last-lowest-price reference and reduction; NL/ES can show RRP; DACH omits it; Bundle uses
bought-individually and green savings. No card info icon and no strikethrough. The current
catalog's sale comparison is prototype data, carried over from the PDP. Production must
supply actual 30-day history. See `README.md` for the data contract and preview limitations.
