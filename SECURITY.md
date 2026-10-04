# Security policy

NEX Level Labs builds security products, and we hold our own code to the same standard.

## Reporting a vulnerability

Please report vulnerabilities **privately** through GitHub: open the **Security** tab of this repository and click **Report a vulnerability**. Don't open a public issue.

We'll acknowledge your report within 3 business days and keep you updated until it's resolved. We're happy to credit you once a fix ships.

## Scope

| In scope | Status |
|---|---|
| `packages/tokens` (`@thenexlabs/tokens`) | Supported |
| `packages/ui` (`@thenexlabs/ui`) | Supported |
| `packages/nexdex-uikit`, `token-lists`, `profile-sdk`, `eslint-config-*` | Legacy and unmaintained; not published by this repo's workflows |

## How we keep this repo safe

- Every change goes through a pull request; there are no direct pushes to `master`.
- CodeQL runs a security analysis on every pull request and weekly.
- Dependabot watches dependencies and GitHub Actions.
- Runtime dependencies of published packages must pass `npm audit` with zero findings.
- GitHub Actions are pinned to commit SHAs, and workflows run with read-only permissions by default.
- Packages are published only from `master`, by CI, never from a laptop.
