# BRAND.md — NEX Level Labs visual identity

This is the visual brand for every NEX site. Exact values live in `packages/tokens/src/tokens.mjs`. If this file and the tokens ever disagree, the **tokens win**; fix this file.

## Essence

The look is black and neon green: a terminal at night. It should read as technical, precise and calm, with an edge. Green is a signal, not wallpaper. Most of the screen is black or near-black, and green marks what matters or what can be acted on.

## Colour

### Brand anchors

| Name | Hex | Use |
|---|---|---|
| **Neon** | `#00FF41` | Primary accent: primary buttons, links (in dark mode), focus ring, active states, key data highlights |
| **Glow** | `#39FF14` | Hover state of neon elements and the colour of glow shadows **only** |
| **Black** | `#000000` | Dark-mode page canvas |
| **White** | `#FFFFFF` | Light-mode page canvas |

### Modes

- **Dark mode is the default and the core brand.** nixguard.com is dark-only.
- **Light mode** exists for the main site. It uses white backgrounds and keeps neon as a *fill* with black text on it. Green *text* becomes `#007A1F`, because neon on white has a contrast ratio of 1.4:1, which is unreadable.
- Switch modes with `data-theme="light"` or `data-theme="dark"` on `<html>`. Components never branch on mode; tokens handle it.

### Rules

1. **No cyan. Ever.** That includes cyan, teal and aqua, and blue-green gradients. The PancakeSwap-era `#1FC7D4` is gone. CI rejects any token with a hue between 165° and 205°.
2. **Green carries meaning.** It means primary action, selection, focus, success or "live". Don't use it for decoration, large backgrounds or body copy.
3. **Use one primary action per view.** It gets the neon fill; everything else is secondary (outline) or ghost.
4. **Status colours:** success is neon green, warning is amber `#FFB800`, and danger is red (`#FF4D4D` in dark mode, `#D92020` in light). "Info" is neutral, not blue and not cyan.
5. **Neutrals carry a faint green cast** (for example `#111411` rather than `#111111`) so greys sit with the brand. Use the semantic tokens (`canvas`, `surface`, `raised`, `sunken`, `line`) rather than raw greys.
6. **Contrast:** body text is at least 4.5:1 and UI boundaries and focus are at least 3:1. The token checks enforce this.

## Glow

Glow is the signature effect, so use it sparingly.

- `shadow-glow-sm` goes on hover or focus of primary controls.
- `shadow-glow-md` goes on the active or selected state, or a featured card on hover.
- `shadow-glow-lg` is for a single hero moment per page at most.
- Never use glow on text blocks, tables or more than one element at rest in the same viewport.
- In light mode, glow automatically becomes a soft green halo.
- Respect `prefers-reduced-motion`: don't pulse or animate glow when it's set.

## Typography

| Family | Use |
|---|---|
| **Public Sans** (400, 500, 600, 700) | All UI text: headings, body, labels, buttons |
| **JetBrains Mono** (400, 500) | Technical and data text: code, hashes, IPs, IDs, timestamps, CLI snippets, numeric table columns, small "terminal" labels |

- Load both with `next/font` and set the variables `--nex-font-public-sans` and `--nex-font-jetbrains-mono`. See the tokens README.
- Use tabular numerals (`.nex-data` or `tabular-nums`) for any column of numbers.
- Uppercase mono labels use `tracking-caps` (0.08em) and `text-xs`. Use them sparingly, as eyebrow labels and table headers.
- The type scale matches Tailwind's (`text-xs` through `text-5xl`). Headings use weight 600 or 700, and body text uses 400.

## Shape, space and depth

- **Corners are sharp and technical, not bubbly.** Badge radius is 4px, controls (buttons, inputs) are 6px, cards are 8px and modals are 12px. Use full rounding (pill) only for avatars, toggles and status dots.
- **Spacing is a 4px grid,** which is Tailwind's default scale.
- **Depth in dark mode comes from surface steps,** going from `canvas` to `surface` to `raised`, plus 1px `line` borders. Drop shadows are minimal; glow replaces them for emphasis.

## Motion

Motion is quick and functional. Use 120ms for hovers, 200ms for most transitions and 320ms for modals. Use the standard easing curve. Never animate for decoration, and honour reduced motion.

## Don't

- Use cyan, teal or purple, or gradients from the PancakeSwap era.
- Put neon text on a white background.
- Make full-bleed neon backgrounds.
- Use Kanit. It's a legacy-kit font and must be replaced.
- Hard-code hex values in components.
- Use more than one glowing element at rest.
