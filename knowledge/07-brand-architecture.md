# 07 — Brand architecture and cross-site consistency

*Status: **accepted** (2026-10-04). Applies to every NEX web property. Read this together with `BRAND.md`.*

## The brands

| Brand | Role | Site | Token brand |
|---|---|---|---|
| **NEX Level Labs** | Parent company and R&D lab | thenex.world | default (`nex`) |
| **NixGuard** | Flagship product: an AI-native security and compliance platform | nixguard.com | `data-brand="nixguard"` |

**NixGuard is the product and NEX Level Labs is the company behind it.** Every site should make that relationship obvious in the same way.

## thenex.world direction

thenex.world presents **a deep-tech R&D company**, not a crypto project.

- **Hide web3 UI by default:** wallet connect buttons, token prices and tickers, swap, farm, staking, balance inputs, and network or chain selectors. Remove them from navigation and page layouts.
- **Don't delete that code yet.** Put it behind one feature flag, off by default (for example `NEXT_PUBLIC_ENABLE_WEB3=false`), so it can come back deliberately later.
- **Lead with:** what NEX Level Labs builds (NixGuard first), research areas, team, and contact.
- **Network or DLT research** may appear as a *research* topic, in plain technical language: no token sale language, no price talk, no "buy" calls to action.
- **The legacy kit's DEX components** (`CakePrice`, `BalanceInput`, `WalletModal` and similar) must not render on any public page.

## Shared elements: identical on every site

| Element | Rule |
|---|---|
| **Header** | Logo left; at most 5 nav items; one primary CTA right (`Button variant="primary"`); `Log in` as secondary when relevant. Sticky, `bg-canvas`, `border-b border-line`. |
| **Footer** | Product links, company links, legal (Privacy, Terms, Security), and the endorsement line. Mono `text-xs` for the copyright line. |
| **Endorsement line** | nixguard.com footer: **"NixGuard is built by NEX Level Labs"**, linking to thenex.world. thenex.world shows NixGuard as its flagship product, linking to nixguard.com. |
| **Logos** | Use the official SVGs only. No recolouring outside the brand palette, no stretching, clear space at least the height of the mark. Assets live in `brand-assets/` in this repo. |
| **Type** | Fonts come from the token brand only. Never load extra font families on a site. |
| **Buttons and CTAs** | Same labels across sites: "Request a demo", "Log in", "Contact us". Always `rounded-control`. |
| **Favicons and OG images** | Each brand has one favicon set and one OG image template, on the brand's canvas colour with its logo. |
| **Security page** | Each site has a `/security` page and serves `/.well-known/security.txt` (RFC 9116) with a contact and a policy link. This is non-negotiable for a security company. |
| **Legal** | Privacy and Terms are linked from every footer. The company name is written the same way everywhere. |

## Copy voice (both brands)

Plain, specific and calm. Say what the product does, in short sentences. No hype words ("revolutionary", "game-changing"), no crypto jargon, no fear-mongering. Every claim must be something we can stand behind publicly.

## When a site needs something that isn't in the kit

Build it locally from tokens, note it in that repo's `knowledge/ui-requests.md`, and the kit owner promotes it into `@thenexlabs/ui` (planned first: `SiteHeader`, `SiteFooter`, `BrandMark`).
