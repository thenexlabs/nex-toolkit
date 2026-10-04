# 04 — Direction for shared components (`@thenexlabs/ui`)

*Status: **proposed** (2026-10-04).*

## Decision

Build new primitives in a fresh package, `packages/ui` (`@thenexlabs/ui`). Don't upgrade the legacy kit in place.

## Why not upgrade `nexdex-uikit`

Upgrading would mean replacing styled-components and styled-system, the theme shape, the font reset, every colour, the radii, the breakpoints and the test snapshots. That rewrites every file while keeping Pancake's API debt and license question. See `01-kit-audit.md`. Writing roughly seven well-scoped primitives fresh is less work, and it lands each one as its own small PR.

## Stack

| Concern | Choice | Reason |
|---|---|---|
| React | 18 (peer `>=18`) | Matches nixguard and Next 14 |
| Styling | Tailwind classes that use the NEX preset; variants via `class-variance-authority` and `tailwind-merge` | Same mental model as the sites. No runtime CSS-in-JS. Works in Server Components. |
| Behaviour and a11y | Radix primitives for Dialog, Toast, Tooltip, Popover and DropdownMenu | Focus trap, ARIA and keyboard handling come solved |
| RSC | `"use client"` banner on every interactive component; static ones (Card, Badge) stay server-safe | App Router compatible |
| Build | `tsup` to ESM, CJS and `.d.ts`, with `exports` per component (`@thenexlabs/ui/button`) | Tree-shakeable, fast |
| Docs and tests | Storybook 8 with addon-a11y as a CI gate; Vitest and Testing Library | Each primitive ships with stories in dark and light |
| Consumption | Sites add `./node_modules/@thenexlabs/ui/dist/**/*.{js,mjs}` to Tailwind `content` | Tailwind generates the classes the components use |

**Sites without Tailwind** (the main site, if it stays on styled-components) can import a prebuilt `@thenexlabs/ui/styles.css` that the package generates at build time. Plan this for when the main site migrates; it's not needed for nixguard.

## API conventions

- `variant` sets the visual style and `size` sets the scale (`sm`, `md`, `lg`). For components that use colour, `tone` is one of `neutral`, `accent`, `success`, `warning`, `danger` or `info`.
- `asChild` (Radix Slot) is supported on Button and Card, so they can render as a Next.js `<Link>`.
- Components forward `ref` and `className`, with `className` merged last.
- No component accepts raw colour props.

## First primitives (in order)

| # | Component | Spec in brief |
|---|---|---|
| 1 | **Button** | `primary` is `bg-accent text-on-accent hover:bg-accent-hover hover:shadow-glow-sm`. `secondary` is `border-line-strong text-fg hover:border-accent`. There are also `ghost` and `danger`. Supports `loading` (spinner plus `aria-busy`), `asChild`, icon slots and `rounded-control`. |
| 2 | **Badge** | `rounded-badge text-xs font-medium`. The tone sets `bg-<tone>/10 text-<tone>-text border-<tone>/30`. An optional `dot` adds a status dot, and an optional `mono` switches to mono text for codes. |
| 3 | **Input** | `bg-sunken border-line rounded-control`; on focus, `border-accent shadow-focus`. `invalid` turns the border to danger and wires `aria-invalid` and `aria-describedby`. A `Field` wrapper adds the label, hint and error. `mono` is for keys, IPs and hashes. |
| 4 | **Card** | `bg-surface border border-line rounded-card`, with Header, Body and Footer parts. `interactive` adds `hover:border-accent/50 hover:shadow-glow-sm` and focus styles. |
| 5 | **Modal** | Built on Radix Dialog. The scrim is `bg-scrim/70` and the content is `bg-raised border-line rounded-modal shadow-elevation-lg z-modal`. Title and description are wired. Sizes are `sm`, `md` and `lg`. `useModal`-style ergonomics are kept from the legacy kit. |
| 6 | **Toast** | Built on Radix Toast (or sonner, if its styling hooks are enough). `bg-raised border-line rounded-card`, with a left tone bar and `z-toast`. Exposes an imperative `toast.success()` API. Respects reduced motion. |
| 7 | **Table** | A styled-markup layer first (Table, Head, Row, Cell). The header uses `bg-sunken text-fg-subtle text-xs uppercase tracking-caps`. Numeric cells use `nex-data` and right-alignment. Row hover is `bg-raised`. Sorting and pagination come as a *separate* hook later, if needed (for example TanStack Table). |
