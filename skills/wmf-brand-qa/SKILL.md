---
name: wmf-brand-qa
description: Review WMF copy, images, Figma designs, live landing pages, layouts, logos, colours, typography, packaging, web content, social content, and media assets against the WMF brand book. Use when checking brand adherence, assessing potential environmental or green-claims risk, rewriting content in the WMF voice, preparing a brand-compliance report, comparing Figma with a live page, or ingesting a revised WMF brand-book PDF locally.
---

# WMF Brand QA

Use this skill as the WMF brand source of truth for content and creative review. Read the smallest relevant reference first:

- `references/brand-guide.md` for narrative guidance and source-page citations.
- `references/brand-rules.json` for structured rules, colours, logo clear space, media specifications, and unresolved questions.
- `references/qa-checks.yaml` for review checks and severity levels.

## Review workflow

1. Identify the review surface: copy, image, logo/layout, product asset, video, packaging, Figma frame, live URL, web/PDP, or social content.
2. Load the relevant sections of `brand-guide.md` and `qa-checks.yaml`. Do not load the entire source PDF unless a page-level visual check is needed.
3. For a Figma design, inspect the relevant frames and components through the available Figma integration. Check the rendered visual, text layers, images, component variants, spacing, and responsive frames. If only a screenshot is available, state that underlying font, colour, and component properties could not be verified.
4. For a live page, inspect the rendered page at relevant desktop and mobile widths through the available browser integration. Check visible copy, hero imagery, CTA labels, footnotes, accordions, badges, linked evidence, and any content revealed by interaction. Record URL, viewport, and review date.
5. Inspect supplied artifacts directly. For images and layouts, use visual inspection; do not infer visual compliance from filenames or extracted text alone.
6. If the page or design uses environmental, sustainability, durability, recyclability, materials, energy, carbon, waste, ethical, or “better for the planet” language—or visuals that imply such claims—invoke or recommend `$environmental-claims-review` for the separate claims assessment.
7. Separate definite violations, likely risks, and compliant observations. Do not invent rules where the brand book is silent.
8. Cite the WMF source page for brand findings. Let `$environmental-claims-review` cite the applicable official regulatory source for environmental-claims findings.
9. Return a compact report with: verdict (`pass`, `pass with changes`, or `fail`), findings, severity, evidence, recommended fix, source page, and verification gaps.
10. Escalate legal, usage-rights, manufacturing-origin, product-performance, endorsement, environmental-substantiation, or trademark questions for human confirmation.

## Figma and live-page comparison

When both a Figma design and a live page are available, review them as two related artifacts:

- Compare copy, hierarchy, CTA wording, imagery, logo treatment, colour, typography, spacing, and responsive behaviour.
- Identify changes that weaken the WMF brand or change the meaning/scope of a claim.
- Treat the live page as the source for actual consumer exposure and the Figma file as the source for intended design decisions.
- Report mismatches separately from brand violations.
- Do not treat a visually attractive page as compliant if evidence, qualifiers, or claim scope are missing.

## Copy review

Check for clear and concise language, direct statements, emotional and functional benefit, meaningful product or heritage substance, and fresh angles. Flag complex sentences, hollow marketing language, excessive superlatives, generic mass-market phrasing, unsupported claims, and incorrect registered-mark usage.

Treat these as approved brand anchors, not mandatory text in every asset:

- `Taste Matters`
- `Inspired by professionals. Designed for home.`
- `anything but ordinary`

## Visual review

Check the logo, clear space, placement, colour treatment, typography, hierarchy, contrast, cropping, product focus, lighting, setting, props, food, casting, and overall look. The desired visual language is elevated, minimalistic, modern, confident, design-oriented, cosmopolitan, bright, and product-first. Flag rustic, retro, mainstream, overly commercial, overly dark, playful, or cluttered treatments.

For Cromargan® imagery, inspect whether the material reads as credible: glossy products need shaped highlights and hard edges; matt products need matt highlights and shadows; brushing must remain visible. Flag uniformly black, unnaturally matt, or visually flat metal.

## Asset and legal review

Use `scripts/inspect_brand_book.py` when a new or revised PDF is available locally. It creates a small extraction and preview pack without modifying the original. Prefer local processing for confidential brand books.

Use the media rules in `brand-rules.json` for image resolution, formats, colour space, aspect ratio, video resolution, rights metadata, and AI-content disclosure. Never approve usage rights merely because an asset appears in the brand book.

The Heritage Label is for brand communication with the WMF logo and not pure product communication. “Made in Germany” requires that the product is actually manufactured in Germany and that the use is approved. The source contains unresolved editorial questions about “Signature”, “Made in Germany”, and the Brand Vision; treat them as open questions, not automatic rules.

## Output format

Use this structure unless the user asks for another format:

```text
Verdict: PASS | PASS WITH CHANGES | FAIL

Summary: one or two sentences.

Findings:
- [severity] Finding. Evidence. Recommended fix. Source: p. X.

Open questions: items requiring human confirmation.
```

For a rewrite, provide the revised copy first, then a brief rationale and any claims requiring substantiation. For an image or layout, describe the visual evidence and distinguish subjective fit from deterministic checks such as dimensions, file format, and logo clear space.

## Updating the knowledge pack

When the brand book changes, run:

```bash
python3 scripts/inspect_brand_book.py /path/to/brand-book.pdf --output-dir /tmp/wmf-brand-book
```

Use the resulting page-separated extraction and previews to update the three reference files. Preserve source-page citations, record conflicts as open questions, validate JSON/YAML, and do not copy a large source PDF or all page previews into Git unless explicitly requested.
