import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/**
 * Badge — a small, non-interactive status label.
 *
 * `tone` maps 1:1 to the token colour roles (X / X-text), so the same Badge
 * reads correctly in every brand and mode:
 *   fill   = bg-X/10   (tint)
 *   text   = text-X-text (contrast-checked against canvas/surface)
 *   border = border-X/30
 *
 * Status colours are for status only (BRAND.md). Use `neutral` for plain labels.
 */
export const badgeVariants = cva(
  [
    "inline-flex h-5 items-center gap-1.5 whitespace-nowrap rounded-badge border px-2",
    "text-xs font-medium leading-none",
  ],
  {
    variants: {
      tone: {
        neutral: "border-line bg-raised text-fg-muted",
        accent: "border-accent/30 bg-accent/10 text-accent-text",
        success: "border-success/30 bg-success/10 text-success-text",
        warning: "border-warning/30 bg-warning/10 text-warning-text",
        danger: "border-danger/30 bg-danger/10 text-danger-text",
        info: "border-info/30 bg-info/10 text-info-text",
      },
      mono: {
        true: "font-mono tabular-nums",
        false: "",
      },
    },
    defaultVariants: {
      tone: "neutral",
      mono: false,
    },
  },
);

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof badgeVariants>, "mono"> {
  /** Leading status dot in the tone's colour. */
  dot?: boolean;
  /** Monospace + tabular numerals, for codes and IDs (CVE-2026-1234, CC6.1, v2.4.0). */
  mono?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone, mono = false, dot = false, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cn(badgeVariants({ tone, mono }), className)} {...props}>
      {dot ? <span data-slot="dot" aria-hidden="true" className="size-1.5 shrink-0 rounded-pill bg-current" /> : null}
      {children}
    </span>
  );
});
