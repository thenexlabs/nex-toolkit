import * as React from "react";
import { cn } from "../../lib/cn";

/** Styled table markup. Sorting/pagination stay in the app (or TanStack Table) for now. */
export const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  function Table({ className, ...props }, ref) {
    return (
      <div className="w-full overflow-x-auto rounded-card border border-line">
        <table ref={ref} className={cn("w-full border-collapse text-sm text-fg", className)} {...props} />
      </div>
    );
  },
);

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  function TableHeader({ className, ...props }, ref) {
    return <thead ref={ref} className={cn("bg-sunken", className)} {...props} />;
  },
);

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody({ className, ...props }, ref) {
    return <tbody ref={ref} className={cn("bg-surface", className)} {...props} />;
  },
);

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  function TableRow({ className, ...props }, ref) {
    return (
      <tr
        ref={ref}
        className={cn("border-t border-line transition-colors duration-fast hover:bg-raised [thead_&]:border-t-0 [thead_&]:hover:bg-transparent", className)}
        {...props}
      />
    );
  },
);

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Right-aligned mono tabular figures, for numbers, IDs, timestamps. */
  numeric?: boolean;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }>(
  function TableHead({ className, numeric, ...props }, ref) {
    return (
      <th
        ref={ref}
        scope="col"
        className={cn(
          "px-3 py-2 text-left font-mono text-xs font-medium uppercase tracking-caps text-fg-subtle",
          numeric && "text-right",
          className,
        )}
        {...props}
      />
    );
  },
);

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, numeric, ...props },
  ref,
) {
  return (
    <td
      ref={ref}
      className={cn("px-3 py-2.5 align-middle", numeric && "text-right font-mono tabular-nums", className)}
      {...props}
    />
  );
});

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  function TableCaption({ className, ...props }, ref) {
    return <caption ref={ref} className={cn("caption-bottom px-3 py-2 text-left text-xs text-fg-subtle", className)} {...props} />;
  },
);
