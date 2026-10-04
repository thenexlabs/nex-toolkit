# BRAND.md — visual identity for NEX sites

This design system serves **two brands** that share one set of token *names* but use different values:

| Brand | Used on | How to select it |
|---|---|---|
| **NEX Level Labs** | Main site and the parent brand | Default (no attribute needed) |
| **NixGuard** | nixguard.com (product app and marketing) | `<html data-brand="nixguard">` |

Exact values live in `packages/tokens/src/tokens.mjs`. If this file and the tokens ever disagree, the **tokens win**; fix this file.

---

## Shared rules (all brands)

1. **No cyan. Ever.** That includes teal, aqua and blue-green gradients. CI rejects any token with a hue between 165° and 205°.
2. **Green carries meaning.** It means primary action, protected, verified, passing, or live. Don't use it as decoration in product UI.
3. **One primary action per view.** It gets the accent fill. Everything else is secondary (outline) or ghost.
4. **Status colours are reserved for status.** Use amber for warnings and red for danger or failure. "Info" is neutral, never blue or cyan.
5. **Use roles, not raw colours.** Write `bg-surface`, `text-fg-muted` and `text-accent-text`, never hex values. Every role X has three tokens:
   - `X` is the fill.
   - `on-X` is text on that fill.
   - `X-text` is X-coloured text on the page background.
6. **Contrast:** text must be at least 4.5:1, and UI boundaries and focus must be at least 3:1. CI checks this per brand and mode.
7. **Corners are sharp and technical, not bubbly.**
   - Badge: 4px
   - Control: 6px
   - Card: 8px
   - Modal: 12px
   - Pill: only for avatars, toggles and status dots
8. **Spacing is a 4px grid** (Tailwind's default scale).
9. **Motion is quick and functional.**
   - Duration is 120ms for hover, 200ms by default and 320ms for modals.
   - Always honour `prefers-reduced-motion`.
10. **Mono type is for data.** Use it for IDs, hashes, IPs, timestamps, CLI and code, and use tabular numerals (`.nex-data`) in number columns.

---

## NEX Level Labs

*The look: black and neon green, like a terminal at night. Technical, precise and calm, with an edge.*

| Role | Value |
|---|---|
| Accent (fill, focus, dark-mode accent text) | **Neon `#00FF41`** |
| Hover and glow | **Glow `#39FF14`**, only for hover and glow |
| Dark canvas | Black `#000000`, with green-tinted neutrals (`#0A0C0A`, `#111411`) |
| Light canvas (main site) | White `#FFFFFF`. Neon stays a *fill* with black text. Green **text** becomes `#007A1F`, because neon on white is 1.4:1. |
| Danger / warning | `#FF4D4D` in dark mode, `#D92020` in light; amber `#FFB800` |
| UI font | **Public Sans** (400, 500, 600, 700) |
| Data font | **JetBrains Mono** (400, 500) |

**Glow** is the NEX signature effect, so use it sparingly:
- `shadow-glow-sm` is for hover or focus on primary controls.
- `shadow-glow-md` is for active or selected states.
- `shadow-glow-lg` is for at most one hero moment per page.

Never put glow on text blocks or tables, and never on more than one element at rest per viewport.

**Don't:** put neon text on white, use full-bleed neon backgrounds, use Kanit, or use any leftover PancakeSwap purple.

---

## NixGuard

*Security, compliance and trust. "A safer tomorrow builds brighter possibilities." The look is calm and confident: deep green-black with emerald, not neon.*

Values come from the NixGuard brand board (2026-09).

### Palette

| Name | Hex | Role |
|---|---|---|
| **Nix Emerald** | `#16A36A` | Accent fill: primary buttons, progress bars, status icons. Text on it is **black** (6.5:1); white on emerald is only 3.2:1. |
| **Fortress Green** | `#08734B` | Accent *text* on light sections and focus ring on light (5.9:1 on white) |
| **Signal Green** | `#45E59A` | Hover state, accent text on dark, and "Protected" or "Passing" emphasis (12:1 on Carbon) |
| **Carbon** | `#0B0D0C` | Dark canvas |
| **Graphite** | `#141816` | Dark surface (cards, panels) |
| **Iron** | `#27302B` | Dark borders and dividers |
| **Bone** | `#F5F7F5` | Primary text on dark; light-section surface |
| **Mist** | `#A5AEA9` | Muted text on dark (7.9:1 on Graphite) |
| **Amber** | `#F2B84B` | Warning |
| **Signal Red** | `#E05252` | Danger on dark. On light it deepens to `#C43B3B` (fill) and `#B03030` (text), because `#E05252` on white is 3.8:1. |

### Type

| Family | Use |
|---|---|
| **Geist** | Headlines and UI in the product app; body text everywhere |
| **Geist Mono** | Data and commands: logs, IDs, control IDs, CLI, numbers in tables |
| **Instrument Serif** (`font-display`) | **Marketing headlines only**, as in the landing page hero ("Get compliant faster. Stay protected after."). Never use it in the product app, in body copy or below `text-3xl`. |

### Brand principles (from the board)

1. Green means protected, verified and passing.
2. Black anchors trust and authority.
3. Use Bone for clarity and balance.
4. Reserve accent colours for status and alerts.

### Modes

- **The product app is dark-only**, and so are screenshots and mockups of it on marketing pages.
- **Marketing pages** are dark-first and may use **light sections** (`<section data-theme="light">`) for product screenshots, pricing comparisons and long-form copy. Each light band is self-contained, and the page header and footer stay dark.
- **Full-bleed emerald bands** are allowed on marketing pages only, for partner logo strips and the closing CTA, at most two per page. Text on them is black or Carbon.

### Glow

NixGuard has **no neon bloom**. Its `glow-*` tokens are quiet emerald rings, used for focus, the selected nav item and the hover state of interactive cards.

### Don't

- Use neon `#00FF41` or `#39FF14`, which belong to NEX Level Labs.
- Put white text on Emerald.
- Use the display serif in the app UI.
- Use purple, violet or any off-palette colour in illustrations. Illustration grounds come from the palette, with Amber as the only secondary hue.
- Use pill-shaped buttons. All buttons, marketing CTAs included, use `rounded-control`.
- Use cyan.

### Mascots

The bulldog, turtle and rabbit are official brand assets, kept in `brand-assets/nixguard/mascots/`.
- Marketing only, never in the product app UI.
- Recolour only within the palette.
- Never stretch them or put them on busy backgrounds.
- Minimum size is 64px.
