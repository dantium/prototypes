---
name: environmental-claims-review
description: Assess copy, Figma designs, live landing pages, packaging, product pages, images, badges, and campaign creative for potential environmental or green-claims risk. Use when reviewing sustainability, carbon, recycling, composting, renewable-material, energy, durability, ethical, or “better for the planet” claims across EU/EEA, UK, US, or unspecified markets.
---

# Environmental Claims Review

Use this skill for preliminary issue spotting, not legal clearance. Read `references/environmental-claims.md` for the jurisdiction notes, risk patterns, evidence questions, and official sources.

## Workflow

1. Identify the target market, language, product category, channel, publication date, and claim owner. If the market is unknown, say so and apply a conservative cross-market screen.
2. Identify the review surface: copy, Figma frame, live URL, packaging, product page, social post, video, image, badge, or product name.
3. Inspect the artifact directly. For Figma, inspect relevant frames, text layers, components, images, and responsive variants through the available Figma integration. For a live page, inspect desktop and mobile renderings, visible copy, CTAs, footnotes, accordions, badges, linked evidence, and content revealed by interaction through the available browser integration.
4. Inventory explicit and implied claims, including wording, icons, certification marks, green colour treatments, nature imagery, product names, comparisons, and qualifiers.
5. For each material claim, record the exact claim, scope, implied meaning, evidence available, missing qualification, target market, and risk level.
6. Check whether qualifiers are clear, prominent, specific, close to the claim, and understandable at the point of consumer exposure.
7. Distinguish definite evidence gaps from possible legal risk and from copy or design recommendations.
8. Return a report using the format below. Do not call a claim illegal unless qualified counsel or the relevant authority has made that determination.

## Risk levels

- `critical`: absolute, broad, or potentially deceptive environmental claim with no visible scope or evidence; unverified certification; or a claim likely to materially mislead consumers.
- `high`: material qualification, comparison basis, lifecycle scope, disposal condition, certification criteria, or substantiation appears missing.
- `medium`: ambiguous wording, weak prominence, unclear component scope, or incomplete disclosure that could change consumer understanding.
- `low`: wording or hierarchy refinement with no clear material risk.

## Review checks

Flag and investigate:

- broad claims such as “green”, “eco-friendly”, “sustainable”, or “planet-friendly”;
- absolute claims such as “zero impact”, “carbon neutral”, “climate positive”, or “100% sustainable”;
- recyclable, compostable, biodegradable, non-toxic, renewable, recycled-content, refillable, or renewable-energy claims without conditions and evidence;
- comparative claims without a named comparator, baseline, method, date, or quantified basis;
- offset claims without emissions scope, calculation, permanence/additionality information, and clear disclosure;
- certification seals or sustainability logos without current criteria, owner, scope, or verification;
- green imagery, leaves, earth symbols, or green colour palettes that imply a broader claim than the copy supports;
- claims about product, packaging, component, manufacturing, delivery, or whole-brand performance that do not make the scope clear;
- qualifications hidden below the fold, in inaccessible tooltips, or separated from the claim.

## Evidence request

Ask for the evidence needed to substantiate the specific claim: test or lifecycle methodology, product or packaging scope, baseline and comparator, percentages, facility and market availability, certification owner and criteria, geography, time period, and evidence date. Do not approve a claim based only on a supplier assertion, logo, colour palette, or offset certificate.

## Output format

```text
Verdict: PASS | PASS WITH CHANGES | ESCALATE FOR LEGAL REVIEW

Scope: market, channel, viewport/frame, URL or Figma reference, review date.

Summary: one or two sentences.

Claims reviewed:
- Exact claim or implied signal:
  Scope:
  Consumer impression:
  Risk: critical | high | medium | low
  Evidence gap:
  Recommended change:
  Official source:

Verification gaps: missing evidence, market, or source material.
```

For a Figma/live-page comparison, report intended-design versus actual-experience mismatches separately from claim risks. For a rewrite, provide a narrower, specific alternative only when the evidence supports it; otherwise recommend holding publication pending substantiation.
