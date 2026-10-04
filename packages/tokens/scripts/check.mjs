#!/usr/bin/env node
/**
 * Guardrails for the token source. Run with `yarn test` (node --test).
 *  - every colour is valid 6-digit hex
 *  - NO CYAN: no token hue in the cyan band (brand rule)
 *  - WCAG contrast for every pair in contrastPairs, in both modes
 *  - dark and light define exactly the same token names
 *  - generated outputs exist and the Tailwind preset loads
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as T from "../src/tokens.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const lum = (hex) => {
  const [r, g, b] = rgb(hex).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const hsl = (hex) => {
  const [r, g, b] = rgb(hex);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return { h, s, l };
};

const allColours = () => {
  const out = [];
  const walk = (obj, path) => {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") out.push([`${path}.${k}`, v]);
      else walk(v, `${path}.${k}`);
    }
  };
  walk(T.palette, "palette");
  for (const mode of Object.keys(T.modes)) walk(T.modes[mode].color, `${mode}.color`);
  return out;
};

test("colours are 6-digit hex", () => {
  for (const [name, v] of allColours()) assert.match(v, /^#[0-9A-Fa-f]{6}$/, name);
});

test("no cyan (brand rule)", () => {
  for (const [name, v] of allColours()) {
    const { h, s } = hsl(v);
    assert.ok(!(h >= 165 && h <= 205 && s > 0.15), `${name} ${v} is cyan (hue ${h.toFixed(0)}°)`);
  }
  // Shadows embed rgb() literals — check those too.
  for (const mode of Object.keys(T.modes)) {
    for (const [k, v] of Object.entries(T.modes[mode].shadow)) {
      for (const m of v.matchAll(/rgb\((\d+) (\d+) (\d+)/g)) {
        const hex = "#" + m.slice(1, 4).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
        const { h, s } = hsl(hex);
        assert.ok(!(h >= 165 && h <= 205 && s > 0.15), `${mode}.shadow.${k} contains cyan ${hex}`);
      }
    }
  }
});

test("brand anchors are untouched", () => {
  assert.equal(T.palette.green.neon, "#00FF41");
  assert.equal(T.palette.green.glow, "#39FF14");
  assert.equal(T.modes.dark.color.accent, "#00FF41");
  assert.equal(T.modes.dark.color["accent-hover"], "#39FF14");
  assert.equal(T.modes.dark.color.canvas, "#000000");
  assert.equal(T.modes.light.color.canvas, "#FFFFFF");
});

test("dark and light define the same tokens", () => {
  assert.deepEqual(Object.keys(T.modes.light.color).sort(), Object.keys(T.modes.dark.color).sort());
  assert.deepEqual(Object.keys(T.modes.light.shadow).sort(), Object.keys(T.modes.dark.shadow).sort());
});

for (const mode of Object.keys(T.modes)) {
  test(`WCAG contrast — ${mode}`, () => {
    const c = T.modes[mode].color;
    const failures = [];
    for (const [fg, bg, min] of T.contrastPairs) {
      const ratio = contrast(c[fg], c[bg]);
      if (ratio < min) failures.push(`${fg} on ${bg}: ${ratio.toFixed(2)} < ${min}`);
    }
    assert.deepEqual(failures, []);
  });
}

test("generated outputs exist and load", () => {
  for (const f of ["tokens.css", "base.css", "tokens.json", "index.mjs", "index.cjs", "index.d.ts", "tailwind-preset.cjs", "tailwind-preset.mjs"]) {
    assert.ok(existsSync(join(root, "dist", f)), `dist/${f} missing — run yarn build`);
  }
  const preset = require("../dist/tailwind-preset.cjs");
  assert.equal(preset.theme.extend.colors.accent, "rgb(var(--nex-color-accent) / <alpha-value>)");
  assert.ok(preset.theme.extend.fontFamily.sans);
  assert.equal(preset.theme.extend.letterSpacing.caps, "var(--nex-tracking-caps)");
  const ns = preset.createNexPreset({ colorNamespace: "nex", fonts: false });
  assert.ok(ns.theme.extend.colors.nex.accent);
  assert.equal(ns.theme.extend.fontFamily, undefined);

  const lib = require("../dist/index.cjs");
  assert.equal(lib.cssVar.color.accent, "rgb(var(--nex-color-accent))");
  assert.equal(lib.withAlpha("accent", 0.2), "rgb(var(--nex-color-accent) / 0.2)");
  assert.equal(lib.toLegacyKitColors("dark").primary, "#00FF41");

  const css = readFileSync(join(root, "dist/tokens.css"), "utf8");
  assert.match(css, /--nex-color-accent: 0 255 65;/);
  assert.match(css, /\[data-theme="light"\]/);
  assert.doesNotMatch(css, /\bbody\s*\{/, "tokens.css must not style elements — that belongs in base.css");
});
