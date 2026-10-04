# @thenexlabs/ui

React 18 primitives for every NEX site, styled with Tailwind classes from the `@thenexlabs/tokens` preset. The components contain no colours or sizes of their own. Brand (`data-brand`) and mode (`data-theme`) come entirely from tokens.

## Components

| Component | Status |
|---|---|
| `Button` | ✅ v0.1 |
| Badge, Input, Card, Modal, Toast, Table | Planned, in that order. See `knowledge/04-ui-direction.md`. |

## Setup in a site

1. Install both packages (GitHub Packages; see the tokens README for `.npmrc`):
   ```bash
   yarn add @thenexlabs/tokens @thenexlabs/ui
   ```
2. Configure Tailwind. Use the NEX preset, and **scan this package** so Tailwind generates the classes it uses:
   ```js
   // tailwind.config.js
   module.exports = {
     presets: [require("@thenexlabs/tokens/tailwind")],
     content: [
       "./src/**/*.{ts,tsx}",
       "./node_modules/@thenexlabs/ui/dist/**/*.{js,mjs}",
     ],
   };
   ```
3. Import `@thenexlabs/tokens/tokens.css` once in your root layout.

## Button

```tsx
import { Button } from "@thenexlabs/ui";
import Link from "next/link";

<Button>Request a demo</Button>                       {/* primary, md */}
<Button variant="secondary">Log in</Button>
<Button variant="ghost" size="sm">View controls</Button>
<Button variant="danger" loading>Revoking…</Button>
<Button asChild><Link href="/demo">Book a demo</Link></Button>
```

| Prop | Values | Default |
|---|---|---|
| `variant` | `primary` `secondary` `ghost` `danger` | `primary` |
| `size` | `sm` (32px) `md` (36px) `lg` (44px) | `md` |
| `loading` | Shows a spinner, sets `aria-busy`, disables the button | `false` |
| `asChild` | Renders the single child (for example a Next `<Link>`) with Button styling | `false` |

All native `<button>` props pass through. `type` defaults to `"button"`, not `"submit"`. Icons go in `children`; any `<svg>` is sized to 16px automatically.

**Rules:** use one `primary` per view. Don't override colours with `className`. If you need a new look, it's a new variant, added here in its own PR.

`buttonVariants({ variant, size })` returns the class string, for the rare element that can't be a Button. `cn()` merges classes and understands NEX class names. For example, `cn("rounded-control", "rounded-card")` gives `"rounded-card"`.

## Develop

```bash
npm install
npm run typecheck && npm test && npm run build
```

Next.js App Router: the bundle starts with `"use client"`, so these components can be imported from Server Components.
