# 05 — Adoption plan: nixguard.com

*Site: Next.js 14, React 18, Tailwind, styled-components. **Dark-only.** Status: proposed (2026-10-04).*

**Principle:** every phase ships to production on its own, and nothing requires a big-bang rewrite. Each bullet is about one PR, using the same rules as in `AGENTS.md`: one branch, one worktree, never push to main, never read `.env`.

## Phase 0: Plumbing, with zero visual change (½ day)

1. Add `.npmrc` (registry mapping plus `${NPM_TOKEN}`), and `NPM_TOKEN` in Vercel. Then `yarn add @thenexlabs/tokens`.
2. In the root layout:
   - Import `@thenexlabs/tokens/tokens.css`.
   - Set `<html data-theme="dark">`.
   - Load Public Sans and JetBrains Mono through `next/font` with variables `--nex-font-public-sans` and `--nex-font-jetbrains-mono`.
3. In `tailwind.config`, add `presets: [createNexPreset({ fonts: false })]`. If any of these names already exist in the site config, use `colorNamespace: "nex"`: canvas, surface, raised, sunken, fg, line, accent, danger, warning, success, info, focus or scrim.
4. Make styled-components use the same tokens: `import { cssVar } from "@thenexlabs/tokens"` in any SC file you touch. No ThemeProvider is needed.
5. Add `AGENTS.md` to nixguard with these rules:
   - UI comes from `@thenexlabs/ui` or tokens.
   - No raw hex.
   - No cyan.
   - Link to this repo's `BRAND.md`.

**Done when:** the deploy is visually identical, and `getComputedStyle(document.documentElement).getPropertyValue('--nex-color-accent')` returns `0 255 65`.

## Phase 1: Foundations (1–2 days)

1. **Inventory.** Run a script that counts raw hex values, Tailwind arbitrary colours (`bg-[#…]`), cyan usages (`cyan-`, `teal-`, `#0ff`, `#00ffff`, `#1FC7D4`) and hand-rolled `<button>`/`<input>`/modal markup per file. Commit the report to `nixguard/knowledge/ui-inventory.md`. It decides the order of later PRs.
2. **Fonts on.** Switch the preset to the default (`fonts: true`) and import `@thenexlabs/tokens/base.css`. This is one visible PR; screenshot the top 5 pages.
3. **Colour codemod, by area.** Replace raw neutrals and greens with semantic classes, and remove all cyan. Do one route group per PR.
4. **Guardrail.** Add a CI step, ESLint or a grep, that fails on new raw hex or cyan in changed lines. Start it in warn mode.

**Done when:** there's zero cyan, the inventory shows a downward trend, and the guard runs on every PR.

## Phase 2: Primitives (about 1 week, in parallel with kit work)

For each primitive there are two PRs: **(a)** build it in `nex-toolkit/packages/ui` and release it; **(b)** migrate nixguard usages, one area per PR, starting with the area that has the most usages in the inventory.

| Order | Primitive | Why this order | nixguard migration notes |
|---|---|---|---|
| 1 | **Button** | Highest usage, simplest, and sets the variant/`asChild` pattern | Map existing styles to `primary`, `secondary`, `ghost` and `danger`. Use `asChild` for `<Link>` buttons. Only one `primary` per view. |
| 2 | **Badge** | Trivial; it validates the tone system | Status pills, severity labels and plan tiers. Use `mono` for codes and CVE IDs. |
| 3 | **Input** (and Field) | Forms are everywhere. Focus and invalid states are a quick a11y win. | Wire up `aria-invalid` and existing error messages. Use `mono` for API keys and IPs. |
| 4 | **Card** | Layout container. Mostly a markup swap. | Replace styled-components panels first; they are the main source of off-token colours. |
| 5 | **Modal** | Replaces ad-hoc overlays and fixes focus trapping | Audit every `position: fixed` overlay. Keep the open/close state in the page and swap in the markup. |
| 6 | **Toast** | Needs one `<Toaster>` in the layout and replaces scattered alerts | Mount it once in the root layout, then replace `alert()` and custom snackbars. |
| 7 | **Table** | Most complex. It benefits from Card and Badge existing first. | Numeric columns use `nex-data`. Keep sort logic in the site at first and only swap markup and styles. |

**Done when:** these seven account for more than 90% of matching usages in the inventory, and no new hand-rolled versions are being merged.

## Phase 3: Patterns and cleanup (ongoing)

- Promote repeated compositions into the kit: page header, empty state, stat tile, form section, data table with toolbar, and code/CLI block.
- Delete dead styled-components files as pages migrate. Long-term, styled-components stays only where it's genuinely dynamic.
- Flip the Phase 1 guard from warn to **error**.

## Risks

| Risk | Mitigation |
|---|---|
| Name collisions between preset classes and existing nixguard Tailwind config | `colorNamespace: "nex"` |
| Tailwind not generating classes used inside `@thenexlabs/ui` | Add the package's `dist` to `content` in Phase 2 PR 1 |
| styled-components SSR plus Radix portals in App Router | Keep the SC registry. Radix portals render on the client, so wrap them in `"use client"` components. |
| Font swap shifting layouts | `display: swap` plus screenshot review in Phase 1 PR 2 |
| Token package auth failing builds on Vercel | Set up `NPM_TOKEN` in Phase 0 before anything depends on it |
