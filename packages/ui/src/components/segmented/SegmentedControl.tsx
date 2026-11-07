import * as React from "react";
import { cn } from "../../lib/cn";

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue" | "role"> {
  /** Names the group for screen readers, for example "View" or "Severity". */
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  /** sm 28px, md 32px, lg 36px (a comfortable touch target). */
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "h-7 px-2.5 text-xs", md: "h-8 px-3 text-sm", lg: "h-9 px-3.5 text-sm" } as const;

/**
 * SegmentedControl — two to five mutually exclusive choices that change what a view shows (Graph / Table,
 * All / High+ / Critical). A group of toggle buttons with aria-pressed: each choice is reachable with Tab and
 * announces whether it is on. The track is sunk (shadow-well) and the chosen segment is a raised key on the
 * selected ground with an accent edge. Not for moving between pages (use links) or for form input (use radios).
 */
export function SegmentedControl<T extends string>({
  label, options, value, onValueChange, size = "md", className, ...props
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex gap-0.5 rounded-control border border-line bg-sunken p-0.5 shadow-well", className)}
      {...props}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          disabled={option.disabled}
          onClick={() => onValueChange(option.value)}
          className={cn(
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control border border-transparent font-medium text-fg-muted",
            "transition-[background-color,border-color,box-shadow,color] duration-fast ease-standard",
            "hover:text-fg focus-visible:outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-50",
            "aria-pressed:border-accent/60 aria-pressed:bg-selected aria-pressed:text-fg aria-pressed:shadow-selected",
            "[&_svg]:size-4 [&_svg]:shrink-0",
            sizes[size],
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
