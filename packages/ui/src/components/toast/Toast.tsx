import * as React from "react";
import * as T from "@radix-ui/react-toast";
import { cn } from "../../lib/cn";

/**
 * Toast — mount <Toaster /> once in the root layout, then call toast() anywhere:
 *   toast.success("Evidence uploaded")
 *   toast.danger("Scan failed", { description: "Retry in a minute." })
 */

export type ToastTone = "neutral" | "success" | "warning" | "danger" | "info";

export interface ToastOptions {
  description?: React.ReactNode;
  tone?: ToastTone;
  /** ms; default 5000 */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
  title: React.ReactNode;
  open: boolean;
}

let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const getSnapshot = () => items;

function show(title: React.ReactNode, opts: ToastOptions = {}): number {
  const id = nextId++;
  items = [...items, { id, title, open: true, ...opts }];
  emit();
  return id;
}

function dismiss(id: number) {
  items = items.map((t) => (t.id === id ? { ...t, open: false } : t));
  emit();
  // leave time for the exit, then drop it
  setTimeout(() => {
    items = items.filter((t) => t.id !== id);
    emit();
  }, 300);
}

type ToastFn = ((title: React.ReactNode, opts?: ToastOptions) => number) & {
  [K in Exclude<ToastTone, "neutral">]: (title: React.ReactNode, opts?: Omit<ToastOptions, "tone">) => number;
} & { dismiss: (id: number) => void };

export const toast: ToastFn = Object.assign((title: React.ReactNode, opts?: ToastOptions) => show(title, opts), {
  success: (title: React.ReactNode, opts?: ToastOptions) => show(title, { ...opts, tone: "success" }),
  warning: (title: React.ReactNode, opts?: ToastOptions) => show(title, { ...opts, tone: "warning" }),
  danger: (title: React.ReactNode, opts?: ToastOptions) => show(title, { ...opts, tone: "danger" }),
  info: (title: React.ReactNode, opts?: ToastOptions) => show(title, { ...opts, tone: "info" }),
  dismiss,
});

const bar: Record<ToastTone, string> = {
  neutral: "bg-line-strong",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

export function Toaster({ className }: { className?: string }) {
  const list = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return (
    <T.Provider swipeDirection="right">
      {list.map((t) => (
        <T.Root
          key={t.id}
          open={t.open}
          duration={t.duration ?? 5000}
          onOpenChange={(open) => {
            if (!open) dismiss(t.id);
          }}
          className="relative grid grid-cols-[3px_1fr_auto] items-start gap-3 overflow-hidden rounded-card border border-line bg-raised py-3 pr-3 text-fg shadow-elevation-md"
        >
          <span aria-hidden="true" className={cn("h-full w-[3px] rounded-r-sm", bar[t.tone ?? "neutral"])} />
          <div className="grid gap-0.5">
            <T.Title className="text-sm font-medium">{t.title}</T.Title>
            {t.description ? <T.Description className="text-xs text-fg-muted">{t.description}</T.Description> : null}
          </div>
          <T.Close
            aria-label="Dismiss"
            className="grid size-6 place-items-center rounded-control text-fg-subtle hover:text-fg focus-visible:outline-none focus-visible:shadow-focus"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </T.Close>
        </T.Root>
      ))}
      <T.Viewport
        className={cn(
          "fixed bottom-0 right-0 z-toast flex w-full max-w-sm flex-col gap-2 p-4 outline-none",
          className,
        )}
      />
    </T.Provider>
  );
}
