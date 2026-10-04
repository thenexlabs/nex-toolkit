import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hover/focus affordance for clickable cards (use with asChild + a link). */
  interactive?: boolean;
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, interactive, asChild, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex flex-col rounded-card border border-line bg-surface text-fg",
        interactive &&
          "transition-[border-color,box-shadow] duration-fast ease-standard hover:border-accent/50 hover:shadow-glow-sm focus-visible:outline-none focus-visible:shadow-focus",
        className,
      )}
      {...props}
    />
  );
});

const part = (displayName: string, base: string) => {
  const C = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn(base, className)} {...props} />
  ));
  C.displayName = displayName;
  return C;
};

export const CardHeader = part("CardHeader", "grid gap-1 p-4 pb-0");
export const CardBody = part("CardBody", "p-4");
export const CardFooter = part("CardFooter", "flex items-center gap-2 border-t border-line p-4");

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...props }, ref) {
    return <h3 ref={ref} className={cn("text-base font-semibold leading-tight", className)} {...props} />;
  },
);

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn("text-sm text-fg-muted", className)} {...props} />;
  },
);
