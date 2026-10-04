# 02 — How the design system reaches every site

*Status: **proposed** (2026-10-04). Owner: Jon.*

## Decision

Publish **versioned private npm packages to GitHub Packages** under the `@thenexlabs` scope, built from this repo. That covers `@thenexlabs/tokens` now and `@thenexlabs/ui` next. Each site stays in its own repo and pins a version.

## Options compared

| | **A. GitHub Packages (npm)** ✅ | B. Git submodule | C. One monorepo for all sites |
|---|---|---|---|
| How a site consumes it | `yarn add @thenexlabs/tokens` | `git submodule add …` plus a build step or path alias in each site | `workspace:*` import, with every site moved into one repo |
| Versioning | Semver, with changelog per release. Sites upgrade on their own schedule. | A commit SHA. No semver and no changelog by default. | No versions; everyone is always on HEAD. |
| Incremental adoption | Excellent. Pin, upgrade per site, roll back by downgrading. | Possible, but each site has to compile the kit's source with its own toolchain. | Every kit change hits every site at once. |
| Vercel / CI | Needs one read token (`NPM_TOKEN`) per project | Needs submodule checkout auth on Vercel, which is a known pain point | Simplest at build time, but needs per-project root dirs and ignored-build-step rules |
| Atomic "change kit and site together" | Two PRs. Use `yalc` or `yarn link` locally while developing. | Two commits, with a pointer bump | One PR |
| AI agents | Clear contract: the package README and types in `node_modules`. Agents can't silently edit the kit from a site repo. | Agents frequently edit the submodule in place by mistake | Agents see everything, which is powerful but also easy to blast-radius |
| Migration cost | **Low.** This repo is already a package monorepo. | Low, but you pay it forever | **High.** Merge histories, unify tooling, redo deploys for every site. |
| Main risk | Token management, and remembering to bump | Drift and detached HEADs | Coupled release cadences, and one broken build blocks every site |

## Why A

- You have several independent sites with different cadences: nixguard.com, the main site, nix-chat and others. Semver lets each one adopt incrementally, which is the whole goal.
- It keeps the **one task = one branch = one worktree** discipline clean. A kit change is a kit PR and a site upgrade is a site PR, so both stay small.
- Agents get a stable, typed and documented surface instead of reaching into source.
- You can still move to C later. If more than about half of all PRs end up touching kit and site together, revisit this decision. Packages make that migration easy, because `workspace:*` replaces a version string.

## Setup checklist

1. **Scope.** GitHub Packages requires the npm scope to match the GitHub owner, so packages are named `@thenexlabs/*`. The legacy `@nextechlabs/nexdex-uikit` keeps its name until it's retired; it doesn't move.
2. **Visibility. ⚠ This repo is currently *public*.** Decide whether the design system should be private.
   - If private: make the repo private, or set package visibility to private under Org → Packages. Packages published from a public repo are typically public.
   - Public is acceptable for tokens and generic primitives. It's not acceptable if site-specific or unreleased product UI lands here.
3. **Publishing.** `.github/workflows/tokens.yml` runs on manual dispatch from `master` with `GITHUB_TOKEN` and `packages: write`. Nobody publishes from a laptop.
4. **Consuming sites.** Commit an `.npmrc` that contains only the registry mapping and an env reference, never a real token:
   ```
   @thenexlabs:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
   ```
   - **Vercel:** add `NPM_TOKEN`, a fine-grained PAT or bot token with `read:packages`, as a project environment variable for Build.
   - **GitHub Actions:** `NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}` works if the package grants that repo read access under Package settings → Manage Actions access.
5. **Upgrades.** Enable Renovate or Dependabot for the `@thenexlabs/*` scope in every site, so a new kit release opens a small upgrade PR automatically.
6. **Release tooling (later).** Replace Lerna 4 with **Changesets** when `@thenexlabs/ui` lands. It gives per-PR changelog entries and handles multi-package versioning.

## Local development across repos

```bash
# in nex-toolkit worktree
cd packages/tokens && node scripts/build.mjs && npx yalc publish
# in the site worktree
npx yalc add @thenexlabs/tokens && yarn
```

`yalc` copies files rather than symlinking them, so Next.js and Tailwind's content scanning behave the same as with a real install.
