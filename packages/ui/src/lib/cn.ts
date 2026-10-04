import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge that knows the NEX preset's custom class names, so a consumer's
 * `className="rounded-card"` correctly REPLACES a component's `rounded-control`
 * instead of both ending up in the output.
 *
 * Keep these lists in sync with packages/tokens (radiusRole, shadow names).
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      rounded: [{ rounded: ["badge", "control", "card", "modal", "pill"] }],
      shadow: [
        {
          shadow: ["elevation-sm", "elevation-md", "elevation-lg", "glow-sm", "glow-md", "glow-lg", "focus"],
        },
      ],
      "font-family": [{ font: ["display"] }],
      tracking: [{ tracking: ["caps"] }],
      z: [{ z: ["dropdown", "sticky", "overlay", "modal", "toast", "tooltip"] }],
      duration: [{ duration: ["fast", "base", "slow"] }],
      ease: [{ ease: ["standard", "enter", "exit"] }],
    },
  },
});

/** Join class names; later NEX/Tailwind classes win over earlier conflicting ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
