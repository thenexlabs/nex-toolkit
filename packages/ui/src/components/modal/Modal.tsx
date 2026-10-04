import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "../../lib/cn";

/**
 * Modal — Radix Dialog with NEX styling. Focus trap, Esc, aria-modal and
 * focus restore come from Radix.
 *
 *   <Modal>
 *     <ModalTrigger asChild><Button>Rotate key</Button></ModalTrigger>
 *     <ModalContent>
 *       <ModalHeader><ModalTitle>Rotate API key?</ModalTitle><ModalDescription>…</ModalDescription></ModalHeader>
 *       <ModalFooter><ModalClose asChild><Button variant="secondary">Cancel</Button></ModalClose>…</ModalFooter>
 *     </ModalContent>
 *   </Modal>
 */
export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;

const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" } as const;

export interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof Dialog.Content> {
  size?: keyof typeof sizes;
  /** Show the ✕ close button (default true). */
  showClose?: boolean;
}

export const ModalContent = React.forwardRef<React.ElementRef<typeof Dialog.Content>, ModalContentProps>(
  function ModalContent({ className, size = "md", showClose = true, children, ...props }, ref) {
    return (
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-overlay bg-scrim/70" />
        <Dialog.Content
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 z-modal grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4",
            "rounded-modal border border-line bg-raised p-6 text-fg shadow-elevation-lg",
            "focus-visible:outline-none",
            sizes[size],
            className,
          )}
          {...props}
        >
          {children}
          {showClose ? (
            <Dialog.Close
              aria-label="Close"
              className="absolute right-3 top-3 grid size-8 place-items-center rounded-control text-fg-subtle transition-colors duration-fast hover:bg-surface hover:text-fg focus-visible:outline-none focus-visible:shadow-focus"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </Dialog.Close>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    );
  },
);

export function ModalHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-1 pr-8", className)} {...props} />;
}

export function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-wrap justify-end gap-2", className)} {...props} />;
}

export const ModalTitle = React.forwardRef<
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(function ModalTitle({ className, ...props }, ref) {
  return <Dialog.Title ref={ref} className={cn("text-lg font-semibold leading-tight", className)} {...props} />;
});

export const ModalDescription = React.forwardRef<
  React.ElementRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(function ModalDescription({ className, ...props }, ref) {
  return <Dialog.Description ref={ref} className={cn("text-sm text-fg-muted", className)} {...props} />;
});
