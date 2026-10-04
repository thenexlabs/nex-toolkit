# 01 — Audit of the existing UI kit (`packages/nexdex-uikit`)

*Audited 2026-10-04 against `github.com/thenexlabs/nex-toolkit@8bf8086`, the last commit on master, dated 2023-04-27. If your local copy has unpushed work, re-check the sections marked ⚠.*

## TL;DR

The kit is an almost-unmodified **PancakeSwap `pancake-uikit` fork from late 2021**. The NEX work so far amounts to renamed packages and a swapped logo. It still carries PancakeSwap's colours (cyan `#1FC7D4` and purple), the Kanit font, DEX-specific widgets and 2021-era tooling. It's a reasonable *reference*, but it's the wrong *foundation* for a Next.js 14 / React 18 / Tailwind design system.

**Recommendation:** freeze it in maintenance mode, and re-theme it with `toLegacyKitColors()` so the main site picks up the brand now. Build the shared primitives fresh in `@thenexlabs/ui` on top of `@thenexlabs/tokens`. See `04-ui-direction.md`.

## Repo shape

- Monorepo using Yarn 1 workspaces and **Lerna 4** (independent versioning, conventional commits). commitlint and husky are configured.
- Packages:
  - `nexdex-uikit` (`@nextechlabs/nexdex-uikit@0.2.0`): the UI kit
  - `eslint-config-nex` and `eslint-config-thenex`: **duplicate packages with the same name** (`@nextechlabs/eslint-config-nex@1.1.2`)
  - `token-lists`: crypto token lists. The name refers to ERC-20 tokens, not design tokens.
  - `profile-sdk`: PancakeSwap profile SDK (ethers 5)
- CI runs on **Node 14** (end-of-life) with `actions/*@v2`. Storybook deploys from `master`.
- `.github/CODEOWNERS` still lists **PancakeSwap maintainers** (`@RabbitDoge`, `@Chef-Chungus`, and so on), so PRs request review from strangers. Fixed in this PR.
- The root README contradicts itself: it references `oasis-labs/oasis-toolkit` and `nextechlabs/nexdex-toolkit` and tells you to `cd oasis-toolkit`. Fixed in this PR.
- `.gitignore` did not ignore `.env*`. Fixed in this PR.
- **License:** the root is GPL-3.0, inherited from pancake-toolkit, but the uikit `package.json` says MIT. Get proper legal advice before treating kit code as proprietary. New packages written from scratch (`tokens`, `ui`) don't inherit this.

## Build and packaging

| | |
|---|---|
| Bundler | Rollup 2 with `@rollup/plugin-typescript` and `plugin-url`, outputting CJS and ESM. Types come from a separate `tsc --emitDeclarationOnly`. |
| Output | `dist/index.cjs.js`, `dist/index.esm.js`, `dist/index.d.ts`. No `exports` map and no `"use client"` banners. |
| Registry | `publishConfig.access: public` on npmjs under `@nextechlabs`. ⚠ I couldn't confirm whether it's actually published; the registry wasn't reachable from the audit environment. |
| Docs | Storybook 6.3 with `themeprovider-storybook` |
| Tests | Jest 26, Testing Library 11, jest-styled-components (snapshot-heavy) |

## Framework assumptions

| Area | Finding | Impact on Next 14 / React 18 |
|---|---|---|
| React | `peerDependencies: react ^17.0.2`, with React 17 types | React 18 installs with peer warnings. It mostly works, but it's untested. |
| Styling | **styled-components 5 + styled-system**. Every component reads `theme.colors.*` from a `ThemeProvider`. | Tailwind sites can't use the styling. App Router needs an SC registry for SSR. |
| Theme shape | `PancakeTheme` holds colours, per-component sub-themes (alert, card, nav, modal, toggle, tooltip and others), `mediaQueries` and `radii` | Colours are hex strings with alpha appended (`${colors.text}99`), so **CSS variables can't be passed directly**. That's why the legacy adapter outputs hex. |
| Server Components | No `"use client"` anywhere. Uses `createContext` (Modal) and many hooks. | Importing from a Server Component in App Router **fails**. Every usage needs a client wrapper. |
| SSR safety | `window` and `document` are mostly accessed inside effects. `getPortalRoot` and `Menu` guard `typeof window`. `BackgroundImage` and `useParticleBurst` touch the DOM in handlers. | Mostly SSR-safe in the Pages Router. Hydration warnings are likely where `useMatchBreakpoints` initialises from `matchMedia`. |
| Global CSS | `ResetCSS` is a `createGlobalStyle` reset that sets `* { font-family: 'Kanit' }` | It clobbers every font on the page. It conflicts with Tailwind's preflight and with Public Sans. |
| Router | Router-agnostic. `react-router-dom` is used only in tests. | Fine |
| Breakpoints | 370, 576, 852, 968, 1080 and 1200 px | These don't match Tailwind's 640, 768, 1024, 1280 and 1536. Tokens use Tailwind's. |

## Tokens that exist today (all PancakeSwap values)

- **Colours:** `primary #1FC7D4` (cyan ✗), `secondary #7645D9` (purple), `failure #ED4B9E` (pink), `success #31D0AA` (teal ✗), `warning #FFB237`, plus purple-tinted neutrals and pastel gradients. Dark mode uses `#08060B` and `#27262C`.
- **Spacing:** `[0, 4, 8, 16, 24, 32, 48, 64]`, a 4px-based scale. Fine.
- **Radii:** small 4, default 16, card 24, circle. Bubbly, and off-brand for NEX.
- **Shadows:** level1, active, success, warning, focus (purple), inset, tooltip
- **Type:** no scale. Sizes are hard-coded per component (Text 14/16, Heading 20/24/32/40/64). The font is Kanit.
- **z-index:** dropdown 10, modal 100

None of these are NEX brand values. `@thenexlabs/tokens` replaces all of them.

## Component inventory

**Components (44):** Alert, BalanceInput, BaseMenu, BottomDrawer, BottomNav, BottomNavItem, Box (with Flex and Grid via styled-system), Breadcrumbs, **Button** (with IconButton and ExpandableButton), ButtonMenu, CakePrice ✗, **Card** (with CardHeader, CardBody, CardFooter and CardRibbon), Checkbox, Dropdown, DropdownMenu, FallingBunnies ✗, Footer, Heading, Image, **Input**, LangSelector, Layouts, Link, MenuItem, MenuItems, Message, NotificationDot, Overlay, PancakeToggle ✗, Progress, Radio, Skeleton, Slider, Spinner, Stepper, SubMenuItems, Svg (with about 100 icons), TabMenu, **Table** (with a `useTable` hook), **Tag**, Text, ThemeSwitcher, Timeline, Toggle and Tooltip (a hook).

**Widgets:** Menu (the app shell with nav), **Modal** (Provider plus `useModal`), and WalletModal ✗.

**Hooks:** useMatchBreakpoints, useTooltip, useOnClickOutside, useDelayedUnmount, useIsomorphicEffect, useParticleBurst ✗ and useKonamiCheatCode ✗.

✗ marks PancakeSwap or DEX-specific items that shouldn't move to the shared system.

### Mapped to the requested primitives

| Needed | In kit? | Notes |
|---|---|---|
| Button | ✅ `Button` | Variants: primary, secondary, tertiary, text, danger, subtle, success and light. Sizes: md, sm and xs. The primary variant uses literal `white` text, which **fails on neon**, so it needs `on-accent`. |
| Input | ✅ `Input` | Basic. No label, help-text or error composition. |
| Card | ✅ `Card` | Has the parts. Radius is 24px, which is off-brand. |
| Modal | ✅ `widgets/Modal` | Context and `useModal` API. No focus trap or `aria-modal` audit. |
| Table | ✅ `Table` | Generic `useTable` with sorting. Heavier than needed. |
| Badge | ≈ `Tag` | Variants exist, but it uses the old palette. |
| Toast | ❌ none | Must be built. |

## Accessibility notes

- The focus ring is purple and relies on `box-shadow`. Some components remove the outline without replacing it.
- The Modal doesn't trap focus or restore it on close.
- Storybook has `addon-a11y` installed, but there's no CI gate.

## What to keep vs drop

- **Keep as reference:** Modal's context and `useModal` ergonomics, Table's sort hook, the Card part structure and the Button `variant`/`scale` API naming.
- **Drop from the shared system:** everything ✗ above, styled-system, Kanit and the ResetCSS font rule, the Pancake theme sub-objects and the old breakpoints.
