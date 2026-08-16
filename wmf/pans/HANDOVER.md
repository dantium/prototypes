# WMF Pans PLP — UX-study handover (Aug 2026)

Changes from the Aug-2026 PLP UX study (Applause). The prototype is the working reference —
every behaviour is implemented and inspectable there.

- **Live reference:** https://dantium.github.io/prototypes/wmf/pans/pans.html (sub-PLP: `frying-pans.html`)
- **Code:** `wmf/pans/assets/app.js` (logic) · `styles.css` · `i18n-de.js` · `catalog.json`
- **Commits:** `e2f1c82` (main work) · `228bc93` (notify popover) · `af5d555` (Omnibus line)
- Tile design-review page (not linked from the shop): `tile-preview.html`

---

## Mega menu / Header

- **Cart badge is dynamic**: shows the cart's total quantity, **hidden at 0** (was hard-coded "1").
  Updates from tile add-to-cart and PDP add-to-cart. Prototype: `updateCartBadge()` / `#cartCount`.
- Nothing else in the mega menu changed this round.

## PLP

### Filters

- **Quick-filter chips** — row labelled **"Frequently selected criteria"** above the toolbar.
  Curated per category (merchandiser-editable list, prototype: `QUICK_FILTERS`). Size chips show the
  serving hint `(4 – 6 people)`; all others show a live result count `(9)`. Chips and the filter rail
  are **one state** — toggling either updates both, plus the active-filter chips and counts.
  Active chip = solid black with ×.
- **Cooktop type facet** — new multi-value product attribute `cooktop`, values exactly
  `Induction | Gas | Electric | Glass ceramic` ("Glass ceramic", not "Ceramic" — that word is taken
  by the surface facet). **Source: PIM.** Accessories (lids/protectors/stands) have no value and drop
  out of any cooktop filtering. Group sits **first** in the rail; an **Induction** chip leads the quick filters.
- **Sticky rail (desktop >900px)** — `position: sticky; top: 0; max-height: 100dvh; overflow-y: auto`,
  no visible scrollbar, `overscroll-behavior: contain`. Mobile keeps the existing drawer.
- **Option counts** — every rail option shows its *expected result count*: query = search term
  + all **other** groups' selections (OR inside a group, AND across groups), own group excluded.
  Compute in the search engine (aggregations). Count-0 options dim to 45%, stay clickable.
- **Persistence across categories** — selections survive navigation; on load restore only options
  that exist in the target category's facets, expand their groups, drop the rest. "Clear all" clears
  the store too. Prototype: `sessionStorage["wmf.plp.filters"]` as `{group: [values]}`.
  **Live: prefer URL params** (shareable) with session fallback.

### Product tile (condensed v2)

Top to bottom: image (status badge top-left, action circles top-right, attribute badges
bottom-left: "Set of N" + technique/surface, max 2) → series eyebrow → name → rating
(omit when no reviews) → **"Ideal for:" line** (from cooking technique, one line, see Copy) →
**price row** (price + "Save N%" left, stock right, same row) → **Omnibus line on discounted
items only**.

- **Removed from tile** (PDP handles them): size selector, colour swatches.
- ⚠️ **Required:** `€129.99 (last 30 days lowest price)` must accompany **every**
  strike/discount price (EU Omnibus). Never drop it.
- **Cart qty on tile** — bag button shows the product's quantity as a badge (bottom-right of the
  circle), none at 0. Prototype cart: `sessionStorage["wmf.plp.cart"]` — **live: real cart.**
- **Back-in-stock notify** — out-of-stock tiles swap bag → **bell**. Tap opens a popover on the tile:
  copy line, email input, primary "Remind me" button, ×. Invalid email → red border. Valid submit →
  green confirmation → auto-close (~1.6 s) → bell gold = registered; tapping a gold bell unregisters.
  Close via ×/Esc/outside click = no registration.
  ⚠️ Prototype does **not** store or send the address — wire to the back-in-stock service with
  double opt-in (GDPR); registered state per customer, not per session.

### Layout & toolbar

- Category hero image removed for now (markup commented out); page head is single-column.
- **Category tiles + chip rows on mobile (≤900px)**: edge-bleed horizontal scroll, no scrollbar,
  **paging arrows** (white circle + chevron) shown only for directions with off-screen content;
  tap scrolls ~70% of the visible width.
- **Pan Finder** button opens an **on-site modal** (no page change): title bar + ×, scrim, Esc close,
  scroll lock. The modal body's `.finder-slot` is the **mount point for the Neocom widget**
  (prototype shows a placeholder).

## PDP

- Add-to-cart feeds the same cart/badge as the PLP tiles (prototype: `bumpCart()` writes the shared store).
- Size and colour selection now happen **only** on the PDP — the tile no longer offers them.
- Omnibus disclosure applies here too wherever a strike price shows.

## Search

- **Empty state:** user has recent searches → show **Recents** (+ Popular categories), **no Trending**.
  No recents → Trending + Popular categories. All viewports.
- **Typing state:** completions → categories → **"Top results"** with a live count
  (`4 of 38 results`) right-aligned in the section header.
- **Mobile ≤700px:** Top results render as **one horizontally scrolling row of compact product
  cards** (image, name, price) so they stay visible above the open keyboard.
  Desktop keeps the stacked list rows. Input placeholder shortens to "Search" on mobile.
- Full results page (after Enter / "See all results") is the normal PLP grid — nothing special.

---

## Integration cheat-sheet

| Prototype (sessionStorage)     | Shape                | Live equivalent                    |
|--------------------------------|----------------------|------------------------------------|
| `wmf.plp.filters`              | `{group: [values]}`  | URL params / session               |
| `wmf.plp.cart`                 | `{productId: qty}`   | Real cart                          |
| `wmf.plp.notify`               | `[productId]`        | Back-in-stock service (+ opt-in)   |
| `wmf_recent`                   | `[query]` (max 6)    | Existing search history            |

**Breakpoints:** >900 sticky rail · ≤900 drawer + scroll arrows · ≤700 search mobile layout · ≤560 one-column grid.
**Cache busting:** all asset links + the catalog fetch carry `?v=YYYYMMDDx` — bump on any asset change.
**i18n:** `i18n-de.js`, keyed by the EN source string, falls back to EN.

## Copy (EN / DE)

| Context | EN | DE |
|---|---|---|
| Chips row label | Frequently selected criteria | Häufig gewählte Kriterien |
| Facet group | Cooktop type | Herdart |
| Ideal for — label | Ideal for: | Ideal für: |
| Ideal for — Intense Searing | Searing protein and vegetables | Scharfes Anbraten von Fleisch und Gemüse |
| Ideal for — Gentle Frying | Delicate food like eggs and fish | Empfindliches wie Eier und Fisch |
| Ideal for — All Purpose ⚠️ placeholder | All-round everyday cooking | Vielseitiges Kochen im Alltag |
| Notify — copy | Enter your email address and we will inform you when the product is available again. | Geben Sie Ihre E-Mail-Adresse ein und wir informieren Sie, sobald das Produkt wieder verfügbar ist. |
| Notify — field / button | E-mail address / Remind me | E-Mail-Adresse / Benachrichtigen |
| Notify — success | Thanks — we'll email you when it's back in stock. | Danke — wir informieren Sie per E-Mail, sobald es wieder verfügbar ist. |
| Search | Top results / x of y results | Top-Ergebnisse / x von y Ergebnissen |

## Open / on hold

- **#16 Category-tile rework** (remove levels / icons / A/B) — awaiting design decision.
- **#10–12 Interactive comparison** — on hold ("Discuss").
- #6 tooltips · #9 tile hierarchy · #14 suggestion order · #15 NL-hint — discuss / later iteration.
- Photo / voice search — parked (trbo, ≥2027).
