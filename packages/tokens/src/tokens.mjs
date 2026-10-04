/**
 * NEX design tokens — the single source of truth.
 *
 * Everything else in this package (CSS variables, Tailwind preset, JSON,
 * JS/TS exports, the legacy-kit adapter) is generated from this file by
 * scripts/build.mjs. Edit values HERE, never in dist/.
 *
 * Layers:
 *   1. primitives  — raw palette and scales. Never used directly by components.
 *   2. semantic    — role-based tokens (canvas, fg, accent, danger...). Per mode.
 *   3. component   — a few role tokens for shared primitives (radius per role).
 *
 * Brand rules (see BRAND.md): black + neon green. #00FF41 is the accent,
 * #39FF14 is hover/glow. No cyan, anywhere — scripts/check.mjs enforces it.
 */

/* ------------------------------------------------------------------ */
/* 1. Primitives                                                       */
/* ------------------------------------------------------------------ */

export const palette = {
  green: {
    // Brand
    neon: "#00FF41", // accent fill, focus ring, dark-mode accent text
    glow: "#39FF14", // hover + glow ONLY
    // Darker steps exist so green text is readable on white (light mode)
    600: "#00C832",
    700: "#00A82B",
    800: "#008F24",
    900: "#007A1F", // 5.5:1 on white — light-mode accent text
    950: "#006B1B",
  },
  // Neutral ramp with a faint green cast so greys sit with the brand.
  neutral: {
    0: "#FFFFFF",
    50: "#F6F7F6",
    100: "#ECEEEC",
    200: "#D9DDD9",
    300: "#B8BEB8",
    400: "#8C948C",
    500: "#6B726B",
    600: "#5C635C",
    700: "#4A504A",
    800: "#2E332E",
    850: "#1C201C",
    900: "#111411",
    925: "#0A0C0A",
    950: "#050605",
    1000: "#000000",
  },
  red: { 400: "#FF4D4D", 600: "#D92020", 700: "#C41C1C" },
  amber: { 400: "#FFB800", 800: "#8A5F00" },
};

export const typography = {
  fontFamily: {
    // next/font can inject --nex-font-public-sans / --nex-font-jetbrains-mono;
    // otherwise the named family (Google Fonts / self-hosted) is used.
    sans: ["var(--nex-font-public-sans, 'Public Sans')", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
    mono: ["var(--nex-font-jetbrains-mono, 'JetBrains Mono')", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace"],
  },
  fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  // [font-size, line-height] — names match Tailwind's so nothing shifts on adoption.
  fontSize: {
    xs: ["0.75rem", "1rem"],
    sm: ["0.875rem", "1.25rem"],
    base: ["1rem", "1.5rem"],
    lg: ["1.125rem", "1.75rem"],
    xl: ["1.25rem", "1.75rem"],
    "2xl": ["1.5rem", "2rem"],
    "3xl": ["1.875rem", "2.25rem"],
    "4xl": ["2.25rem", "2.5rem"],
    "5xl": ["3rem", "3.5rem"],
  },
  letterSpacing: { tight: "-0.02em", normal: "0", wide: "0.04em", caps: "0.08em" },
};

// 4px grid. Identical to Tailwind's default spacing, so Tailwind sites already comply.
export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
};

export const radius = {
  none: "0",
  xs: "2px",
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  full: "9999px",
};

/* ------------------------------------------------------------------ */
/* 3. Component-role tokens (mode-independent)                         */
/* ------------------------------------------------------------------ */

// Sharp, terminal-flavoured corners. Use the role, not the raw step.
export const radiusRole = {
  badge: radius.sm,
  control: radius.md, // Button, Input, Select, Toggle
  card: radius.lg, // Card, Table container, Toast
  modal: radius.xl, // Modal, Drawer, Popover
  pill: radius.full,
};

export const motion = {
  duration: { fast: "120ms", base: "200ms", slow: "320ms" },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    enter: "cubic-bezier(0, 0, 0, 1)",
    exit: "cubic-bezier(0.3, 0, 1, 1)",
  },
};

export const zIndex = {
  dropdown: 1000,
  sticky: 1100,
  overlay: 1300,
  modal: 1400,
  toast: 1500,
  tooltip: 1600,
};

export const breakpoints = { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" };

/* ------------------------------------------------------------------ */
/* 2. Semantic tokens, per mode                                        */
/* ------------------------------------------------------------------ */
/*
 * Colour naming pattern for every role X:
 *   X        fill / icon colour
 *   on-X     text & icons placed ON an X fill
 *   X-text   X-coloured text placed on canvas/surface (contrast-checked)
 */

const p = palette;

export const modes = {
  dark: {
    color: {
      canvas: p.neutral[1000], // page background
      surface: p.neutral[925], // cards, panels
      raised: p.neutral[900], // popovers, modals, hovered rows
      sunken: p.neutral[950], // inputs, code blocks, table headers
      fg: p.neutral[50],
      "fg-muted": "#A1A8A1",
      "fg-subtle": p.neutral[400],
      "fg-disabled": p.neutral[700],
      line: p.neutral[850],
      "line-strong": p.neutral[800],
      accent: p.green.neon,
      "accent-hover": p.green.glow,
      "on-accent": p.neutral[1000],
      "accent-text": p.green.neon,
      success: p.green.neon,
      "on-success": p.neutral[1000],
      "success-text": p.green.neon,
      warning: p.amber[400],
      "on-warning": p.neutral[1000],
      "warning-text": p.amber[400],
      danger: p.red[400],
      "on-danger": p.neutral[1000],
      "danger-text": p.red[400],
      info: p.neutral[200],
      "on-info": p.neutral[1000],
      "info-text": p.neutral[200],
      focus: p.green.neon,
      scrim: p.neutral[1000], // use with opacity, e.g. bg-scrim/70
    },
    shadow: {
      "elevation-sm": "0 1px 2px 0 rgb(0 0 0 / 0.6)",
      "elevation-md": "0 4px 12px -2px rgb(0 0 0 / 0.7)",
      "elevation-lg": "0 12px 32px -4px rgb(0 0 0 / 0.8)",
      "glow-sm": "0 0 6px 0 rgb(57 255 20 / 0.45)",
      "glow-md": "0 0 4px 0 rgb(57 255 20 / 0.6), 0 0 16px 0 rgb(57 255 20 / 0.35)",
      "glow-lg": "0 0 8px 0 rgb(57 255 20 / 0.6), 0 0 32px 4px rgb(57 255 20 / 0.3)",
      focus: "0 0 0 2px rgb(0 0 0), 0 0 0 4px rgb(0 255 65)",
    },
  },
  light: {
    color: {
      canvas: p.neutral[0],
      surface: p.neutral[50],
      raised: p.neutral[0],
      sunken: p.neutral[100],
      fg: p.neutral[925],
      "fg-muted": p.neutral[700],
      "fg-subtle": p.neutral[600],
      "fg-disabled": p.neutral[300],
      line: p.neutral[200],
      "line-strong": p.neutral[300],
      accent: p.green.neon, // still neon as a FILL (black text on it = 15:1)
      "accent-hover": p.green.glow,
      "on-accent": p.neutral[1000],
      "accent-text": p.green[900], // neon text on white is 1.4:1 — never do that
      success: p.green.neon,
      "on-success": p.neutral[1000],
      "success-text": p.green[900],
      warning: p.amber[400],
      "on-warning": p.neutral[1000],
      "warning-text": p.amber[800],
      danger: p.red[600],
      "on-danger": p.neutral[0],
      "danger-text": p.red[700],
      info: p.neutral[700],
      "on-info": p.neutral[0],
      "info-text": p.neutral[700],
      focus: p.green[900],
      scrim: p.neutral[1000],
    },
    shadow: {
      "elevation-sm": "0 1px 2px 0 rgb(10 12 10 / 0.06)",
      "elevation-md": "0 4px 12px -2px rgb(10 12 10 / 0.10)",
      "elevation-lg": "0 12px 32px -4px rgb(10 12 10 / 0.14)",
      // On white, glow becomes a soft green halo rather than a neon bloom.
      "glow-sm": "0 0 0 2px rgb(0 255 65 / 0.35)",
      "glow-md": "0 0 0 3px rgb(0 255 65 / 0.35), 0 4px 12px -2px rgb(0 122 31 / 0.20)",
      "glow-lg": "0 0 0 4px rgb(0 255 65 / 0.35), 0 8px 24px -4px rgb(0 122 31 / 0.25)",
      focus: "0 0 0 2px rgb(255 255 255), 0 0 0 4px rgb(0 122 31)",
    },
  },
};

/** Contrast pairs that must pass WCAG AA (4.5:1 text, 3:1 UI). Checked in CI. */
export const contrastPairs = [
  ["fg", "canvas", 4.5],
  ["fg", "surface", 4.5],
  ["fg", "raised", 4.5],
  ["fg-muted", "canvas", 4.5],
  ["fg-muted", "surface", 4.5],
  ["fg-muted", "raised", 4.5],
  ["fg-subtle", "canvas", 4.5],
  ["fg-subtle", "surface", 4.5],
  ["accent-text", "canvas", 4.5],
  ["accent-text", "surface", 4.5],
  ["on-accent", "accent", 4.5],
  ["on-accent", "accent-hover", 4.5],
  ["success-text", "canvas", 4.5],
  ["warning-text", "canvas", 4.5],
  ["danger-text", "canvas", 4.5],
  ["danger-text", "surface", 4.5],
  ["info-text", "canvas", 4.5],
  ["on-success", "success", 4.5],
  ["on-warning", "warning", 4.5],
  ["on-danger", "danger", 4.5],
  ["on-info", "info", 4.5],
  ["focus", "canvas", 3],
  ["line-strong", "canvas", 1.3],
];
