# knowledge/

This folder holds decisions, audits and plans for the NEX design system. Code shows *what*; these files explain *why*, so neither humans nor agents have to rediscover it.

| File | Topic | Status |
|---|---|---|
| [01-kit-audit.md](01-kit-audit.md) | Audit of the legacy PancakeSwap-derived kit | Done 2026-10-04 |
| [02-distribution.md](02-distribution.md) | How packages reach every site (GitHub Packages) | Proposed |
| [03-tokens.md](03-tokens.md) | Token structure, naming and CI guardrails | Implemented |
| [04-ui-direction.md](04-ui-direction.md) | Stack and API for `@thenexlabs/ui`, plus the first primitives | Proposed |
| [05-nixguard-adoption.md](05-nixguard-adoption.md) | Phased rollout to nixguard.com | Proposed |
| [06-nixguard-landing-page.md](06-nixguard-landing-page.md) | Landing page mapped to tokens, plus decisions | Decided |
| [07-brand-architecture.md](07-brand-architecture.md) | NEX vs NixGuard, thenex.world direction (web3 hidden), shared header/footer/legal/security rules | Accepted |

## Conventions

- Number files in order (`NN-topic.md`). Don't renumber existing files.
- Each file opens with a status line: *proposed*, *accepted*, *implemented* or *superseded by NN*.
- When a decision changes, update the file in the same PR as the code and note the date.
- Keep each file short and factual. Link to code rather than copying it.
