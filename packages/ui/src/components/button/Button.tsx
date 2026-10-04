import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/**
 * Button — the NEX primary action primitive.
 *
 * Styling uses only NEX preset classes (see packages/tokens), so it renders
 * correctly for every brand (data-brand) and mode (data-theme) with no props.
 *
 * Rules (BRAND.md):
 *  - one `primary` per view
 *  - all buttons use rounded-control (marketing included)
 *  - glow only on hover/focus of primary
 */
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "rounded-control border border-transparent font-medium",
    "transition-[background-color,border-color,box-shadow,color] duration-fast ease-standard",
    "focus-visible:outline-none focus-visible:shadow-focus",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-on-accent hover:bg-accent-hover hover:shadow-glow-sm",
        secondary: "border-line-strong bg-transparent text-fg hover:border-accent hover:bg-raised",
        ghost: "bg-transparent text-fg-muted hover:bg-raised hover:text-fg",
        danger: "bg-danger text-on-danger hover:bg-danger/90",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-9 px-4 text-sm",
        lg: "h-11 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render the single child element instead of a <button>, merging Button's
   * classes and props onto it. Use for links: <Button asChild><Link href="/demo">…</Link></Button>
   */
  asChild?: boolean;
  /** Shows a spinner, sets aria-busy and disables the button. Ignored visually with asChild. */
  loading?: boolean;
}

function Spinner() {
  return (
    <svg
      data-slot="spinner"
      className="animate-spin motion-reduce:animate-none"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, loading = false, disabled, type, children, ...props },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    // Slot needs exactly one child, so no spinner here; expose state via ARIA instead.
    const inactive = disabled || loading;
    return (
      <Slot
        ref={ref}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={inactive || undefined}
        tabIndex={inactive ? -1 : undefined}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
});
