import * as React from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error state: danger border + aria-invalid. */
  invalid?: boolean;
  /** Monospace, for API keys, IPs, hashes. */
  mono?: boolean;
}

export const inputClasses = [
  "h-9 w-full rounded-control border border-line-strong bg-sunken px-3 text-sm text-fg",
  "placeholder:text-fg-subtle",
  "transition-[border-color,box-shadow] duration-fast ease-standard",
  "focus-visible:outline-none focus-visible:border-accent focus-visible:shadow-focus",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-[invalid=true]:border-danger",
].join(" ");

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, mono, type = "text", "aria-invalid": ariaInvalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(inputClasses, mono && "font-mono", className)}
      {...props}
      // After the spread: `invalid` must always win over an explicit aria-invalid.
      aria-invalid={invalid || ariaInvalid || undefined}
    />
  );
});

export interface FieldProps {
  label: React.ReactNode;
  /** Help text under the control. Hidden while `error` is shown. */
  hint?: React.ReactNode;
  /** Error message. Also marks the control invalid. */
  error?: React.ReactNode;
  className?: string;
  /** Exactly one control (Input, select, textarea…). Field wires id + aria for you. */
  children: React.ReactElement;
}

/** Label + control + hint/error, with ids and aria wired automatically. */
export function Field({ label, hint, error, className, children }: FieldProps) {
  const autoId = React.useId();
  const id = (children.props as { id?: string }).id ?? autoId;
  const msgId = `${id}-msg`;
  const msg = error ?? hint;

  const control = React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
    id,
    "aria-describedby": msg ? msgId : undefined,
    ...(error ? { "aria-invalid": true } : null),
  });

  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-medium text-fg-muted">
        {label}
      </label>
      {control}
      {msg ? (
        <p id={msgId} className={cn("text-xs", error ? "text-danger-text" : "text-fg-subtle")}>
          {msg}
        </p>
      ) : null}
    </div>
  );
}
