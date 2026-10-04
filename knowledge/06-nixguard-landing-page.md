# 06 — NixGuard landing page: mapping to tokens

*Source: a screen recording of the proposed landing page running on localhost (2026-09-25), plus the NixGuard brand board. Status: **notes for building it on the design system**. Open questions are at the bottom.*

## Page anatomy, mapped to tokens

| # | Section (top to bottom) | What it shows | Build it with |
|---|---|---|---|
| 1 | **Nav** | Logo; Product, Solutions, Customers, Resources, Plans; "Log in" (outline) and "Request a demo" (filled) | `bg-canvas`. Buttons: `secondary` and `primary` (`bg-accent text-on-accent`). Sticky with `z-sticky`. |
| 2 | **Hero** | Two-line condensed-serif headline with the second line in green; subhead; email field plus "Request a demo"; fine print; mascot peeking over the product shot | `font-display text-6xl md:text-7xl text-fg`. Second line uses `text-accent-text`. Subhead uses `text-fg-muted`. Input plus primary Button. Fine print uses `text-xs text-fg-subtle`. |
| 3 | **Product showcase** | App mockup on a white card, scroll-driven between states ("Connect your tools" at 15% and "Ready for audit" at 100%), with a SOC 2 checklist | Wrap the mockup in `<div data-theme="light">` (see open question 2). Card, Badge and progress use `bg-accent`. Check icons use `text-success-text`. |
| 4 | **Partner strip** | Full-bleed green band with partner names separated by bullets | `bg-accent text-on-accent`. Eyebrow uses `font-mono text-xs uppercase tracking-caps`. This is one of at most two full-bleed emerald bands. |
| 5 | **Problem / cost** | "SOC 2 shouldn't become your engineering roadmap." next to a card, "One report. Four invoices.", with a price table and an estimated total | `<section data-theme="light">`. Headline uses `font-display`. The price table uses Table, with `nex-data` for amounts right-aligned. The total uses `text-accent-text`. |
| 6 | **Statement** | "It's never been easier to become SOC 2 compliant." on off-white | `<section data-theme="light" class="bg-surface">` with `font-display text-5xl` |
| 7 | **CTA band** | Green band with paw prints: "All that's left is the first step." | The second full-bleed `bg-accent` band. Text uses `text-on-accent`, with `text-fg`/Bone for emphasis. Decorative paws use `aria-hidden`. |
| 8 | **Remediation** | "Don't just detect. Remediate." with feature tabs (Endpoint active defense, Cloud auto-remediation) and terminal log cards | Dark. Logs use `bg-sunken border-line rounded-card font-mono text-sm`. Log success lines use `text-success-text` and timestamps use `text-fg-subtle`. |
| 9 | **Illustrated feature cards** | "Stay protected." (green, turtle mascot) and "Speed + automation" (**purple**, rabbit mascot) | Card with an illustration slot. The purple card needs a decision (open question 3). |

## New marketing patterns this page needs

These live in `@thenexlabs/ui/marketing`, not in the core primitives. Build them after Button, Input and Card exist.

- `SectionBand`, with `tone: "dark" | "light" | "accent"`. It sets `data-theme` for light and applies `bg-accent` for accent.
- `HeroHeadline`. Two lines, where line 2 is accent. Uses `font-display`.
- `EmailCapture`. Input and primary Button with fine print, wired for a11y (label, error, success Toast).
- `LogoStrip`. A marquee that respects `prefers-reduced-motion`.
- `PriceBreakdownCard`. A Table variant with mono amounts and a highlighted total.
- `TerminalLog`. Mono, line-numbered and timestamped. It can animate lines in, but only when motion is allowed.
- `IllustratedCard`. An illustration slot plus eyebrow and title; the tone comes from the brand palette only.

## Open questions for Jon

1. **Page background.** The recording's dark canvas is a cool blue-black (about `#090D13`), but the board's Carbon is green-black `#0B0D0C`. The tokens use **Carbon**. If the cooler tone is intended, it's a one-line change, but the greys must shift with it.
2. **App mockup in light.** The hero product shot is a *white* app UI, but the product app is dark-only. Should the marketing mockup show the real dark app, or is a light app theme coming? Until that's decided, the mockup can sit in a `data-theme="light"` wrapper and needs no new tokens.
3. **Purple illustration card.** "Speed + automation" uses a violet background. Nothing on the board is purple, and BRAND.md currently says no. Options: re-colour it to Fortress or Graphite, or add a single sanctioned `illustration-*` accent token for marketing art only.
4. **Display serif.** Which face is the hero headline? The tokens use *Instrument Serif* as a placeholder. If you send the font name or file, it's a one-line change in `tokens.mjs`.
5. **Pill-shaped nav buttons.** The nav CTAs are fully rounded, while the system's controls are 6px. Should marketing CTAs use `rounded-pill`, or should the landing page follow the controls?
6. **Mascots.** There's a bulldog in a police cap, a turtle and a rabbit. Are these official brand assets? If so, they should live in a `brand-assets` package with usage rules (minimum size, never recoloured to off-palette).
