# 06 — NixGuard landing page: mapping to tokens

*Source: a screen recording of the proposed landing page running on localhost (2026-09-25), plus the NixGuard brand board. Status: **decided** (2026-10-04). See the decisions table at the bottom.*

## Page anatomy, mapped to tokens

| # | Section (top to bottom) | What it shows | Build it with |
|---|---|---|---|
| 1 | **Nav** | Logo; Product, Solutions, Customers, Resources, Plans; "Log in" (outline) and "Request a demo" (filled) | `bg-canvas`. Buttons: `secondary` and `primary` (`bg-accent text-on-accent`), both `rounded-control` (decision 5). Sticky with `z-sticky`. |
| 2 | **Hero** | Two-line condensed-serif headline with the second line in green; subhead; email field plus "Request a demo"; fine print; mascot peeking over the product shot | `font-display text-6xl md:text-7xl text-fg`. Second line uses `text-accent-text`. Subhead uses `text-fg-muted`. Input plus primary Button. Fine print uses `text-xs text-fg-subtle`. |
| 3 | **Product showcase** | App mockup, scroll-driven between states ("Connect your tools" at 15% and "Ready for audit" at 100%), with a SOC 2 checklist | Show the **dark** app (decision 2) inside a `bg-surface border-line rounded-modal shadow-elevation-lg` frame. Card, Badge and progress use `bg-accent`. Check icons use `text-success-text`. |
| 4 | **Partner strip** | Full-bleed green band with partner names separated by bullets | `bg-accent text-on-accent`. Eyebrow uses `font-mono text-xs uppercase tracking-caps`. This is one of at most two full-bleed emerald bands. |
| 5 | **Problem / cost** | "SOC 2 shouldn't become your engineering roadmap." next to a card, "One report. Four invoices.", with a price table and an estimated total | `<section data-theme="light">`. Headline uses `font-display`. The price table uses Table, with `nex-data` for amounts right-aligned. The total uses `text-accent-text`. |
| 6 | **Statement** | "It's never been easier to become SOC 2 compliant." on off-white | `<section data-theme="light" class="bg-surface">` with `font-display text-5xl` |
| 7 | **CTA band** | Green band with paw prints: "All that's left is the first step." | The second full-bleed `bg-accent` band. Text uses `text-on-accent`, with `text-fg`/Bone for emphasis. Decorative paws use `aria-hidden`. |
| 8 | **Remediation** | "Don't just detect. Remediate." with feature tabs (Endpoint active defense, Cloud auto-remediation) and terminal log cards | Dark. Logs use `bg-sunken border-line rounded-card font-mono text-sm`. Log success lines use `text-success-text` and timestamps use `text-fg-subtle`. |
| 9 | **Illustrated feature cards** | "Stay protected." (green, turtle mascot) and "Speed + automation" (rabbit mascot) | Card with an illustration slot. Grounds come from the palette only; the purple card is recoloured (decision 3). |

## New marketing patterns this page needs

These live in `@thenexlabs/ui/marketing`, not in the core primitives. Build them after Button, Input and Card exist.

- `SectionBand`, with `tone: "dark" | "light" | "accent"`. It sets `data-theme` for light and applies `bg-accent` for accent.
- `HeroHeadline`. Two lines, where line 2 is accent. Uses `font-display`.
- `EmailCapture`. Input and primary Button with fine print, wired for a11y (label, error, success Toast).
- `LogoStrip`. A marquee that respects `prefers-reduced-motion`.
- `PriceBreakdownCard`. A Table variant with mono amounts and a highlighted total.
- `TerminalLog`. Mono, line-numbered and timestamped. It can animate lines in, but only when motion is allowed.
- `IllustratedCard`. An illustration slot plus eyebrow and title; the tone comes from the brand palette only.

## Decisions (2026-10-04)

Each decision was made against the system's long-term goals: one design system shared by every site, buildable by humans and AI agents without guessing, and adopted incrementally. The rule of thumb is that **when a draft page and the brand board disagree, the board wins**, because the board is the spec agents read. Pages are implementations of it.

| # | Question | Decision | Why |
|---|---|---|---|
| 1 | Page background: cool `#090D13` or Carbon `#0B0D0C`? | **Carbon `#0B0D0C`**. Re-skin the landing page to the token. | The board names Carbon. The greys are derived from its green cast, so a cool canvas would need a second neutral ramp. |
| 2 | App mockup shown in light | **Show the real dark app.** | A compliance brand sells trust, so the screenshot should match what customers log into. It also avoids maintaining a light app theme nobody uses. |
| 3 | Purple "Speed + automation" card | **Recolour it inside the palette.** Use a Graphite or Fortress ground, Emerald or Signal for highlights, and Amber as the one permitted secondary hue. No purple. | An off-palette exception teaches agents that exceptions are allowed. If cards need more variety later, add a named `illustration-*` token set, not one-off colours. |
| 4 | Display serif | **Adopt Instrument Serif as the official display face.** | It's open-licensed (OFL), free on every site, loads through `next/font/google`, and closely matches the draft. If a designer supplies a different licensed face, swapping it is a one-line change in `tokens.mjs`. |
| 5 | Pill-shaped nav CTAs | **Use `rounded-control` (6px) everywhere, marketing included.** | One button shape means one Button component and no "which radius?" decision for anyone. Pills stay reserved for avatars, toggles and status dots. |
| 6 | Mascots (bulldog, turtle, rabbit) | **Treat them as official brand assets.** Keep source files in `brand-assets/nixguard/mascots/` with usage rules: minimum size, no recolouring outside the palette, and marketing only (never in the product app UI). | Recurring characters are brand equity, and agents can only use them consistently if they live in one documented place. **Action for Jon:** add the source files (SVG preferred). |

These decisions are reflected in `BRAND.md`. The landing page needs four changes to match: Carbon canvas, a dark app mockup, the recoloured card, and 6px CTAs.
