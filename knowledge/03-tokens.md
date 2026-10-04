# 03 — Design tokens: structure and naming

*Status: **implemented** in `packages/tokens` (PR `feat/tokens`).*

## Source of truth

`packages/tokens/src/tokens.mjs` is a plain JS module with no dependencies and no Style Dictionary. `scripts/build.mjs` turns it into CSS vars, a Tailwind preset, JS/TS and JSON. `scripts/check.mjs` enforces the brand rules, so no human has to remember them.

Why plain JS rather than Style Dictionary or W3C DTCG JSON? There's one person maintaining it, there's one output family, and there's no install step, so CI runs it in about 100 ms. If you later need Figma Tokens or Tokens Studio sync, add a DTCG export step to `build.mjs`. The source stays the same.

## Three layers

1. **Primitives** (`palette`, `spacing`, `radius`, `typography`) are raw values. Components never reference them directly.
2. **Semantic** (`modes.dark` and `modes.light`) are roles: `canvas`, `surface`, `raised`, `sunken`, `fg*`, `line*`, `accent*`, the status roles, `focus`, `scrim` and the shadow tokens. These are what change between modes.
3. **Role tokens** are mode-independent roles for shared primitives, such as `radiusRole.control`, `radiusRole.card` and `radiusRole.modal`.

## Naming rules

- CSS variables: `--nex-<category>-<name>`. Colours hold **RGB channels** (`0 255 65`) so alpha composition works: `rgb(var(--nex-color-accent) / 0.12)`.
- Each colour role X has three tokens:
  - `X` is the fill or icon colour.
  - `on-X` is text on an X fill.
  - `X-text` is X-coloured text on canvas or surface.

  This exists because neon works as a fill in both modes but isn't readable as text on white.
- Tailwind class names equal the token names (`bg-surface`, `text-fg-muted`, `rounded-control`, `shadow-glow-sm`, `z-modal`). The preset is **extend-only and collision-free**. The only intentional override is `font-sans` and `font-mono`, which you can switch off with `{ fonts: false }`.
- Mode switching happens through `data-theme` on `<html>`; dark is the default. Components must never contain `dark:` variants for token-backed colours, because the variables already swap.

## Guardrails (CI)

- Every colour is valid 6-digit hex.
- **No cyan:** no hue in 165°–205° with saturation above 15%, including colours embedded in shadows.
- Brand anchors are pinned: `#00FF41`, `#39FF14`, black and white canvases.
- Dark and light define identical token sets.
- WCAG contrast is checked for every pair in `contrastPairs`, in both modes. Body text needs 4.5:1, and focus needs 3:1.

## Adding a token

Add a token only when two or more components need the same value for the same *reason*. Name it by role, not appearance: `danger`, not `red`. Add any contrast pair it participates in. Each token gets its own small PR.
