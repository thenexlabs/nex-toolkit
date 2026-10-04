# nex-toolkit

This is the NEX Level Labs design system: design tokens and shared UI packages for every NEX site. It's a monorepo managed with Yarn workspaces.

**Start here:** [`AGENTS.md`](AGENTS.md) for working rules, [`BRAND.md`](BRAND.md) for the visual identity, and [`knowledge/`](knowledge/) for decisions and plans.

## Packages

| Package | Purpose | Status |
|---|---|---|
| `packages/tokens` (`@thenexlabs/tokens`) | Design tokens: CSS variables, Tailwind preset and JS/TS | Active |
| `packages/ui` (`@thenexlabs/ui`) | React 18 + Tailwind primitives | Planned |
| `packages/nexdex-uikit` (`@nextechlabs/nexdex-uikit`) | Legacy PancakeSwap-derived styled-components kit | Maintenance only |
| `packages/token-lists`, `packages/profile-sdk`, `packages/eslint-config-*` | Leftovers from the DEX fork | Not part of the design system |

## Getting started

```bash
git clone git@github.com:thenexlabs/nex-toolkit.git
cd nex-toolkit
git worktree add ../nex-toolkit-<slug> -b <type>/<slug> origin/master   # one task = one worktree
```

The tokens package has no dependencies. See `packages/tokens/README.md`.

This repository is a fork of [pancakeswap/pancake-toolkit](https://github.com/pancakeswap/pancake-toolkit).
