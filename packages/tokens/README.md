# @thenexlabs/tokens

NEX Level Labs design tokens, the single source of truth for colour, type, spacing, radius, shadow/glow, motion and z-index across every NEX site.

The source lives in `src/tokens.mjs`. Everything in `dist/` is generated from it. Don't edit `dist/`.

| Export | What it is |
|---|---|
| `@thenexlabs/tokens/tokens.css` | CSS custom properties (`--nex-*`). Dark is the default; `data-theme="light"` (or `.light`) swaps to light. **Defines variables only and styles nothing.** |
| `@thenexlabs/tokens/base.css` | Optional global base styles: body colours, fonts, focus ring, selection, reduced motion. |
| `@thenexlabs/tokens/tailwind` | Tailwind preset (3.3+). Adds new class names under `extend`. |
| `@thenexlabs/tokens` | JS/TS: `tokens`, `cssVar`, `withAlpha()`, `toLegacyKitColors()` |
| `@thenexlabs/tokens/tokens.json` | Everything as JSON, for scripts and AI agents |

## Install

The package is published to GitHub Packages. Add this to the consuming repo's `.npmrc`:

```
@thenexlabs:registry=https://npm.pkg.github.com
```

Then authenticate once. Locally, `npm login --registry=https://npm.pkg.github.com` with a PAT that has `read:packages`. In CI, set `NODE_AUTH_TOKEN`. After that, install the package:

```bash
yarn add @thenexlabs/tokens
```

## Adopt in a Next.js 14 + Tailwind site (incremental)

**1. Variables.** Import the CSS once in `app/layout.tsx`. This makes no visual change.

```tsx
import "@thenexlabs/tokens/tokens.css";
```

**2. Fonts.** Use `next/font` and expose the variables the tokens look for.

```tsx
import { Public_Sans, JetBrains_Mono } from "next/font/google";
const sans = Public_Sans({ subsets: ["latin"], variable: "--nex-font-public-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--nex-font-jetbrains-mono", display: "swap" });
// <html data-theme="dark" className={`${sans.variable} ${mono.variable}`}>
```

**3. Tailwind preset.**

```js
// tailwind.config.js
module.exports = {
  presets: [require("@thenexlabs/tokens/tailwind")],
  content: [/* ... */],
};
```

The preset only *adds* new names, so no existing classes change. The exception is `font-sans` and `font-mono`, which switch to Public Sans and JetBrains Mono. To hold that back for now, use `require("@thenexlabs/tokens/tailwind").createNexPreset({ fonts: false })`. If any colour names collide with ones you already have, use `createNexPreset({ colorNamespace: "nex" })`. That turns `bg-accent` into `bg-nex-accent`.

**4. Base styles (optional, later).** `import "@thenexlabs/tokens/base.css"` once you want the design system to own body colour, fonts and the focus ring.

## Class names the preset adds

| Purpose | Classes |
|---|---|
| Backgrounds | `bg-canvas` `bg-surface` `bg-raised` `bg-sunken` `bg-scrim/70` |
| Text | `text-fg` `text-fg-muted` `text-fg-subtle` `text-fg-disabled` |
| Lines | `border-line` `border-line-strong` `divide-line` |
| Accent | `bg-accent` `hover:bg-accent-hover` `text-on-accent` `text-accent-text` `bg-accent/10` |
| Status | `bg-danger` `text-on-danger` `text-danger-text`. The same pattern applies to `success`, `warning` and `info`. |
| Focus | `ring-focus` or `shadow-focus` |
| Radius by role | `rounded-badge` `rounded-control` `rounded-card` `rounded-modal` `rounded-pill` |
| Elevation / glow | `shadow-elevation-sm` `shadow-elevation-md` `shadow-elevation-lg` `shadow-glow-sm` `shadow-glow-md` `shadow-glow-lg` `shadow-focus` |
| Layers | `z-dropdown` `z-sticky` `z-overlay` `z-modal` `z-toast` `z-tooltip` |
| Type | `font-sans` (Public Sans) `font-mono` (JetBrains Mono) `tracking-caps`. Use `.nex-data` (from base.css) for tabular mono numbers. |
| Motion | `duration-fast` `duration-base` `duration-slow` `ease-standard` `ease-enter` `ease-exit` |

Every colour role X follows the same pattern. `X` is the fill, `on-X` is text placed on that fill, and `X-text` is X-coloured text on the page background. For example, `text-accent-text` is neon `#00FF41` in dark mode but `#007A1F` in light mode, because neon on white is unreadable at 1.4:1.

Spacing is Tailwind's default 4px scale, which is the NEX scale, so `p-4` and `gap-2` already comply.

## styled-components / plain CSS

```ts
import { cssVar, withAlpha } from "@thenexlabs/tokens";

const Panel = styled.div`
  background: ${cssVar.color.surface};
  border: 1px solid ${cssVar.color.line};
  border-radius: ${cssVar.radius.card};
  &:hover { box-shadow: ${cssVar.shadow["glow-sm"]}; }
  background-image: linear-gradient(${withAlpha("accent", 0.06)}, transparent);
`;
```

Because these are CSS variables, light and dark mode switch without re-rendering, and you don't need a `ThemeProvider`.

## Legacy kit (`@nextechlabs/nexdex-uikit`)

The old kit appends hex alpha to its colours (for example `${colors.text}99`), so it needs hex values rather than CSS variables. Pass it this adapter:

```tsx
import { dark } from "@nextechlabs/nexdex-uikit";
import { toLegacyKitColors } from "@thenexlabs/tokens";
<ThemeProvider theme={{ ...dark, colors: toLegacyKitColors("dark") }}>
```

## Changing a token

1. Edit `src/tokens.mjs`.
2. Run `yarn test`. This rebuilds the outputs and checks hex validity, **no cyan**, WCAG contrast in both modes, and that the preset loads.
3. Open a small PR. Colour changes need a screenshot of both modes.
