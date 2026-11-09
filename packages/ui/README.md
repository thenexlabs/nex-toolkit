# @thenexlabs/ui

React 18 primitives for every NEX site, styled with Tailwind classes from the `@thenexlabs/tokens` preset. The components contain no colours or sizes of their own. Brand (`data-brand`) and mode (`data-theme`) come entirely from tokens.

## Components

| Component | Status |
|---|---|
| `Button` | ✅ |
| `Badge` | ✅ |
| `Input`, `Field` | ✅ |
| `Card` (`CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, `CardFooter`) | ✅ |
| `Modal` (Radix Dialog: focus trap, Esc, aria) | ✅ |
| `Toast` (`<Toaster />` + `toast()`) | ✅ |
| `Table` (`TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell numeric`, `TableCaption`) | ✅ |
| `SegmentedControl` | ✅ (0.2.0) |

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

**Depth (0.2.0).** `primary` and `danger` carry `shadow-key-accent` and `secondary` is a filled key (`bg-key shadow-key`, hover `bg-selected`). Every button moves down 1px while pressed. The brand's tokens decide what that looks like: NixGuard draws a raised key with a light top edge; NEX sets the shadows to nothing and `key` to its canvas, so its buttons look as before. Needs `@thenexlabs/tokens` 0.2.0.

**Rules:** use one `primary` per view. Don't override colours with `className`. If you need a new look, it's a new variant, added here in its own PR.

`buttonVariants({ variant, size })` returns the class string, for the rare element that can't be a Button. `cn()` merges classes and understands NEX class names. For example, `cn("rounded-control", "rounded-card")` gives `"rounded-card"`.

## Badge

```tsx
import { Badge } from "@thenexlabs/ui";

<Badge>Draft</Badge>                                 {/* neutral */}
<Badge tone="success" dot>Passing</Badge>
<Badge tone="warning">Evidence due</Badge>
<Badge tone="danger" dot>Failing</Badge>
<Badge tone="info" mono>CC6.1</Badge>
```

| Prop | Values | Default |
|---|---|---|
| `tone` | `neutral` `accent` `success` `warning` `danger` `info` | `neutral` |
| `dot` | Leading status dot in the tone colour (decorative, hidden from screen readers) | `false` |
| `mono` | Monospace with tabular figures, for codes and IDs (CVE IDs, control IDs, versions) | `false` |

Badges aren't interactive. For something clickable, use a Button.

**Rules:** status tones (`success`, `warning`, `danger`) are for status only. The label must make sense without colour, so write "Failing", not just a red dot.

## SegmentedControl

Two to five mutually exclusive choices that change what a view shows. A labelled group of toggle buttons (`aria-pressed`), so each choice is one Tab stop and announces whether it is on. Not for moving between pages (use links) or for form input (use radios).

```tsx
import { SegmentedControl } from "@thenexlabs/ui";

<SegmentedControl label="View" value={view} onValueChange={setView}
  options={[{ value: "graph", label: "Graph" }, { value: "table", label: "Table" }]} />
```

| Prop | Values | Default |
|---|---|---|
| `label` | The group's accessible name, for example `"View"` | (required) |
| `options` | `{ value, label, disabled? }[]` | (required) |
| `value`, `onValueChange` | The chosen value and its setter | (required) |
| `size` | `sm` (28px) `md` (32px) `lg` (36px, a comfortable touch target) | `md` |

The track is sunk (`bg-sunken shadow-well`); the chosen segment is `bg-selected shadow-selected` with an accent edge.

## Input, Card, Modal, Toast, Table

Since 0.2.0: `Input` is sunk (`shadow-well`), `Card` has `shadow-panel`, and `CardTitle` and `ModalTitle` use `font-title` (Bricolage Grotesque for NixGuard, the sans face for NEX).

```tsx
import {
  Field, Input, Card, CardHeader, CardTitle, CardBody, Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell, Modal, ModalTrigger, ModalContent, ModalHeader,
  ModalTitle, ModalDescription, ModalFooter, ModalClose, Toaster, toast, Button,
} from "@thenexlabs/ui";

<Field label="API key" hint="Starts with nx_" error={err}><Input mono /></Field>

<Card interactive>
  <CardHeader><CardTitle>SOC 2</CardTitle></CardHeader>
  <CardBody>…</CardBody>
</Card>

<Table>
  <TableHeader><TableRow><TableHead>Control</TableHead><TableHead numeric>Evidence</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>CC6.1</TableCell><TableCell numeric>42 / 42</TableCell></TableRow></TableBody>
</Table>

<Modal>
  <ModalTrigger asChild><Button variant="danger">Rotate key</Button></ModalTrigger>
  <ModalContent size="sm">
    <ModalHeader><ModalTitle>Rotate API key?</ModalTitle><ModalDescription>The old key stops working immediately.</ModalDescription></ModalHeader>
    <ModalFooter>
      <ModalClose asChild><Button variant="secondary">Cancel</Button></ModalClose>
      <Button variant="danger">Rotate</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

// root layout, once:
<Toaster />
// anywhere:
toast.success("Evidence uploaded");
toast.danger("Scan failed", { description: "Retry in a minute." });
```

## Develop

```bash
npm install
npm run typecheck && npm test && npm run build
```

Next.js App Router: the bundle starts with `"use client"`, so these components can be imported from Server Components.
