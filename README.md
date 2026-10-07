# NEX Toolkit — NEX Level Labs design system: design tokens, Tailwind preset and React UI components

The NEX design system: CSS-variable design tokens, a Tailwind preset and React 18 UI components shared by NixGuard and every NEX Level Labs site.

**Start here:** [contributor rules in AGENTS.md](AGENTS.md), [the visual identity in BRAND.md](BRAND.md), and [design decisions and plans in knowledge/](knowledge/README.md).

## What is it

`nex-toolkit` is the frontend monorepo (Yarn workspaces, Lerna) behind the NEX Level Labs design system. One set of token names serves two brands:

- **NEX Level Labs** (default): neon green on black.
- **NixGuard**, the AI-native SOC and continuous compliance platform: opt in with `<html data-brand="nixguard">`.

Dark mode is the default; `data-theme="light"` switches any page or section to light mode. Components contain no colours or sizes of their own, so brand and mode come entirely from tokens.

## Packages

| Package | npm name | What it is | Status |
|---|---|---|---|
| [`packages/tokens`](packages/tokens/README.md) | `@thenexlabs/tokens` | Design tokens for colour, type, spacing, radius, shadow/glow, motion and z-index. Ships CSS custom properties (`--nex-*`), an optional base stylesheet, a Tailwind preset, JS/TS exports and JSON. | Active (0.1.0) |
| [`packages/ui`](packages/ui/README.md) | `@thenexlabs/ui` | React 18 + Tailwind primitives styled with the token preset: `Button`, `Badge`, `Input`/`Field`, `Card`, `Modal` (Radix Dialog), `Toast`, `Table`. | Early (0.1.0) |
| [`packages/nexdex-uikit`](packages/nexdex-uikit/README.md) | `@nextechlabs/nexdex-uikit` | Legacy styled-components UI kit (React 17), derived from PancakeSwap's UIkit. | Maintenance only |
| `packages/token-lists`, `packages/profile-sdk`, `packages/eslint-config-*` | — | Leftovers from the upstream fork. | Not part of the design system |

## Features

- **Design tokens as CSS variables.** Light and dark mode switch without re-rendering and without a `ThemeProvider`.
- **Multi-brand theming** from the same token names (NEX Level Labs and NixGuard).
- **Tailwind CSS preset** (`@thenexlabs/tokens/tailwind`, Tailwind 3.3+) that only adds class names such as `bg-canvas`, `text-fg-muted`, `bg-accent`, `rounded-card` and `shadow-glow-sm`.
- **Automated token checks:** valid hex, WCAG contrast in both modes, a brand "no cyan" rule, and a preset load test.
- **Accessible React components** with visible focus states, built on Radix primitives where interaction is complex (modal, toast).
- **TypeScript types** for every published package.
- **Legacy kit adapter:** `toLegacyKitColors()` feeds token values into the older styled-components kit.

## Requirements

- Node.js 18 or later (`engines` in `@thenexlabs/tokens` and `@thenexlabs/ui`).
- React 18 and Tailwind CSS 3.4+ to use `@thenexlabs/ui`; Tailwind is optional for `@thenexlabs/tokens`.
- Access to GitHub Packages: both packages set `publishConfig.registry` to `https://npm.pkg.github.com`.

## Installation

Map the `@thenexlabs` scope to GitHub Packages in your project's `.npmrc`, and authenticate with a token that has `read:packages` (in CI, via `NODE_AUTH_TOKEN` or an env reference — never commit a real token):

```
@thenexlabs:registry=https://npm.pkg.github.com
```

Then install:

```bash
yarn add @thenexlabs/tokens            # tokens only
yarn add @thenexlabs/tokens @thenexlabs/ui
```

## Usage

Import the token variables once in your root layout (for example `app/layout.tsx` in Next.js):

```tsx
import "@thenexlabs/tokens/tokens.css";
```

Add the Tailwind preset, and scan the UI package so Tailwind generates the classes it uses:

```js
// tailwind.config.js
module.exports = {
  presets: [require("@thenexlabs/tokens/tailwind")],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@thenexlabs/ui/dist/**/*.{js,mjs}",
  ],
};
```

Use the components:

```tsx
import { Button, Badge } from "@thenexlabs/ui";

<Button>Request a demo</Button>
<Badge tone="success" dot>Passing</Badge>
```

Fonts, brand opt-in, preset options (`createNexPreset({ fonts: false })`, `colorNamespace`), styled-components usage and the full component API are documented in the [@thenexlabs/tokens README](packages/tokens/README.md) and the [@thenexlabs/ui README](packages/ui/README.md).

## Development

Work on a branch in its own worktree and open a pull request; see [AGENTS.md](AGENTS.md) for the full rules.

```bash
git clone https://github.com/thenexlabs/nex-toolkit.git
cd nex-toolkit
git worktree add .worktrees/<slug> -b <type>/<slug> origin/master   # one task = one worktree
```

Tokens (no dependencies, no install needed):

```bash
cd packages/tokens
node scripts/build.mjs          # regenerate dist/ from src/tokens.mjs
node --test scripts/check.mjs   # hex, no-cyan, WCAG contrast, preset loads
```

UI components:

```bash
cd packages/ui
npm install
npm run typecheck && npm test && npm run build
```

The legacy kit uses the root Yarn workspace (`yarn build`, `yarn test`, `yarn lint` via Lerna) with older tooling; see [the kit audit](knowledge/01-kit-audit.md). Commits follow Conventional Commits, enforced by commitlint.

## Security

Please report vulnerabilities privately, never in a public issue. Follow [the security policy in SECURITY.md](SECURITY.md) (GitHub private vulnerability reporting), or email the security contact listed on [nixguard.com](https://nixguard.com).

## License

See [the LICENSE file](LICENSE) (GNU GPL v3.0). Individual packages also declare a `license` field in their own `package.json`.

This repository is a fork of [pancakeswap/pancake-toolkit](https://github.com/pancakeswap/pancake-toolkit).

## About NEX Level Labs

NEX Level Labs Inc. is a deeptech cybersecurity company. Its flagship product, [NixGuard](https://nixguard.com), is an AI-native active security operations center (AI SOC) and continuous compliance platform built on Wazuh SIEM/XDR telemetry. Learn more at [thenex.world](https://thenex.world).
