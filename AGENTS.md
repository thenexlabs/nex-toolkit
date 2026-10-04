# AGENTS.md — nex-toolkit

Rules for every contributor, human or AI agent, working in this repo. This repo is the **NEX design system**: design tokens plus shared UI packages consumed by every NEX Level Labs site (main site, nixguard.com, and others). It serves two brands from the same token names: **NEX Level Labs** (default, neon on black) and **NixGuard** (`data-brand="nixguard"`, emerald on Carbon). See `BRAND.md`.

Read this file first. After that, read `BRAND.md` and the relevant file in `knowledge/` before you change anything.

## Hard rules

1. **One task = one branch = one worktree.** Never work directly in the main checkout. Worktrees live **inside** the repo in `.worktrees/` (git-ignored), never beside it:
   ```bash
   git fetch origin
   git worktree add .worktrees/<slug> -b <type>/<slug> origin/master
   cd .worktrees/<slug>
   # ...work, commit, push the branch, open a PR...
   cd ../.. && git worktree remove .worktrees/<slug>   # after merge
   ```
   `<type>` is one of `feat`, `fix`, `docs`, `chore`, `refactor` or `test`. `<slug>` is kebab-case, for example `feat/button-primitive` lives in `.worktrees/button-primitive`.
2. **Never push to `master`** (this repo's default branch). Don't force-push shared branches. Every change lands through a PR.
3. **Small PRs.** Each PR does one thing: one component, one token change, or one doc. Aim for less than about 400 changed lines, excluding generated or lock files. If a task grows, split it into stacked PRs.
4. **Never read `.env` files.** That includes `.env`, `.env.*`, `*.env` and any other secrets file. Don't `cat`, `grep`, open or summarise them, and don't add them to commits or prompts. If you need a value, ask a human. Only `.env.example`, which holds no real values, may be read or edited.
5. **Never branch on brand in components.** No `if (brand === "nixguard")`. If two brands need different values, the difference belongs in tokens.
6. **Never hard-code design values.** No raw hex, rgb, px font sizes, radii or shadows in component code. Use tokens: Tailwind classes from the NEX preset, or `cssVar`/`--nex-*` variables. If a token you need is missing, add it to `packages/tokens/src/tokens.mjs` in its own PR.
7. **No cyan.** Not as a colour, a gradient stop or a glow. The token checks fail if cyan appears. See `BRAND.md`.
8. **Never edit generated files** (`packages/*/dist/**`). Edit the source and rebuild.

## Repo map

| Path | What | Status |
|---|---|---|
| `packages/tokens` | `@thenexlabs/tokens`: source of truth for colour, type, spacing, radius, shadow/glow, motion, z-index. Ships CSS vars, a Tailwind preset and JS/TS. | **Active.** Build all new work on it. |
| `packages/ui` | `@thenexlabs/ui`: React 18 + Tailwind primitives (Button, Input, Card, Modal, Table, Badge, Toast). | Planned. See `knowledge/04-ui-direction.md`. |
| `packages/nexdex-uikit` | Legacy PancakeSwap-derived kit (React 17, styled-components 5). Used by the main site. | **Maintenance only.** Bug fixes and re-theming. No new components. |
| `packages/token-lists`, `packages/profile-sdk` | DEX/web3 leftovers from the PancakeSwap fork. | Not part of the design system. |
| `knowledge/` | Decisions, audits and plans. The "why" behind the code. | Keep up to date. |

## Commands

```bash
# Tokens (zero deps, no install needed)
cd packages/tokens
node scripts/build.mjs                    # regenerate dist/
node --test scripts/check.mjs             # hex, no-cyan, WCAG contrast, preset loads
```

The legacy kit uses the root `yarn` workspace with Lerna 4, Storybook 6 and Node 14-era tooling. Expect friction there. See `knowledge/01-kit-audit.md`.

## Commits and PRs

- Use Conventional Commits (`feat(tokens): …`, `fix(ui): …`, `docs: …`). commitlint is configured.
- A PR description says **what** changed, **why**, and **how it was checked**. UI changes include a screenshot in dark mode; if the change affects light mode, include a light-mode screenshot too.
- Token changes list each changed value before and after, with the contrast ratios printed by the checks.
- A breaking change to a published package needs a `BREAKING CHANGE:` footer and a migration note in that package's README.

## When building UI (here or in a consuming site)

- Use existing primitives before writing new markup. Check `@thenexlabs/ui`, then the legacy kit, and only then hand-roll. If you hand-roll, open an issue to add the primitive here.
- Colour roles follow the pattern `X` / `on-X` / `X-text`. Use `text-accent-text` for green text and `bg-accent text-on-accent` for green fills. Never put neon green text on a white background.
- Use `font-mono` and `.nex-data` for technical and data text: IDs, hashes, IPs, code, numbers in tables. Use `font-sans` for everything else. The brand decides the actual face (JetBrains Mono or Public Sans for NEX, Geist Mono or Geist for NixGuard).
- `font-display` is for marketing headlines only, never in app UI.
- Glow is for interactive emphasis (hover, focus, the active state of the primary action). It's not decoration, and it never goes on body text.
- Every interactive element needs a visible `:focus-visible` state (`shadow-focus`), keyboard support and an accessible name.

## Knowledge base

The `knowledge/` folder holds decisions and context. Start at `knowledge/README.md`. When you make a decision that a future agent would otherwise have to rediscover, add or update a file there in the same PR.
