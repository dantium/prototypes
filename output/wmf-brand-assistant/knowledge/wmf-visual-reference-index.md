# WMF visual reference index

Inspect the relevant files before reviewing, generating, or editing WMF imagery. Use the images as bounded evidence for the attributes listed below; do not infer approval for unrelated attributes.

## Approved references

### Clean warm-greige background

File: `../visuals/01-approved-background-warm-greige.png`

Use for:

- warm-neutral greige wall and surface
- muted beige diagonal light
- restrained graphite shadow zones
- plain edge-to-edge wall with no architectural detail
- sufficient central space for product placement

Do not add a left column, wall panel, baseboard, recess, window, visible fixture, prop, or kitchen detail.

### Balanced Function 4 hero

File: `../visuals/02-approved-product-hero.png`

Use for:

- balanced centred cookware range composition
- premium product-first hierarchy
- shaped Cromargan reflections with credible bright and dark bands
- red lid rings as the only saturated accent
- soft but substantial floor shadows
- product separation against a darker warm-neutral background

Preserve authentic product geometry and marks when editing supplied WMF assets.

### Lighting and mood source

File: `../visuals/04-lighting-mood-reference-only.png`

Use only for:

- background colour temperature
- muted beige highlight tone
- shadow density and softness
- diagonal-light mood

Ignore the architectural edge on the far left. It is not an approved background element for simplified e-commerce banners.

## Avoid reference

### Background too cool and bright

File: `../visuals/03-avoid-too-cool-and-bright.png`

Avoid:

- pale silver or blue-gray background drift
- overly high background luminance
- broad near-white light pools
- floor that reads flat, washed out, or insubstantial
- weak separation between stainless steel and background

Correction: move toward a darker warm-neutral greige, reduce blue/cyan, mute the light pool to beige, and deepen the softly diffused floor shadows while keeping the cookware luminous.

## Prompting rule

For generation or editing, name each reference and its role explicitly. Example:

```text
Image 1 is the edit target: preserve product geometry and arrangement.
Image 2 is the approved background palette and lighting reference only.
Change only the background colour grade and floor-shadow character.
Do not copy architecture or add text, lines, icons, props, or people.
```

After generation, compare the result against both an approved reference and the avoid example. Check palette, tonal density, product separation, Cromargan reflections, shadows, composition, and excluded elements.
