# WMF Pans PLP — changes vs. current site (Aug 2026 UX study)

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
| Quick filters | None on the PLP | "Frequently selected criteria" chip row above the toolbar; curated per category; live counts; fully synced with the sidebar (toggle either) |
| Cooktop filter | No facet — only an "Induction pans" category tile | New "Cooktop type" facet, first in the sidebar: `Induction / Gas / Electric / Glass ceramic`, from **PIM**; accessories have no value and drop out when filtering; Induction is also the lead quick chip |
| Filter sidebar | Scrolls away with the page | Sticky (>900px): pins to viewport, scrolls internally when tall, no scrollbar; mobile drawer unchanged |
| Option counts | No numbers on options | Every option shows its expected result count — computed from search + all *other* selected groups (OR within a group, AND across); zero-count options dim but stay clickable |
| Category switch | Resets all selections | Compatible selections carry over (options that exist in the new category); their groups open; "Clear all" clears everything. Prototype: sessionStorage — live: prefer URL params |

## PLP — Product tile

| Change | Current site | New |
|---|---|---|
| Tile content | Size + colour swatches on the tile; no usage guidance | Condensed tile: attribute badges stay on the photo; stock indicator sits on the collection/series row (right-aligned); price directly under the name; new one-line **"Ideal for:"** (from cooking technique); size swatches stay (switch variant + price); colour swatches stay (image thumbs, own colour outlined, tap swaps to that colour's product). ⚠️ Keep `(last 30 days lowest price)` with every discounted price — EU Omnibus |
| Tile image | Product shot inset; hover shows in-use photo (desktop) | Product shot fills the tile edge-to-edge. **Mobile:** swipeable 2-slide gallery (product shot → in-use photo) with a progress bar under the image, as on the live PLP; badges/buttons stay fixed while images swipe. Desktop hover unchanged |
| Cart quantity | Shown in the header only | Also on the tile's bag button (badge on the circle, none at 0) |
| Out of stock | No action on the tile | Bag becomes a **bell** → email popover ("Remind me") → registered = gold bell; tap again to unregister. ⚠️ Prototype doesn't store/send the email — needs the back-in-stock service + double opt-in |

## PLP — Toolbar & layout

| Change | Current site | New |
|---|---|---|
| Pan Finder | Dead button | Opens an on-site modal; `.finder-slot` inside is the **Neocom widget** mount point |
| Mobile scroll rows | Scrollbar / no affordance | Category tiles + chips scroll edge-to-edge with paging arrows (shown only where content is off-screen); no scrollbars |
| Category hero image | Image beside the H1 | Removed for now; single-column page head |

## PDP

| Change | Current site | New |
|---|---|---|
| Add to cart | Updates header only | Also drives the shared cart state behind the tile + header badges |
| Colour | Colour picker in the buy box | Unchanged — PDP picker drives packshot / price / SKU; PLP tile swatches link into the sibling colour product |

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
