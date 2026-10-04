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
  for (const [b, brand] of Object.entries(T.brands))
    for (const mode of Object.keys(brand.modes)) walk(brand.modes[mode].color, `${b}.${mode}.color`);
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
  for (const [b, brand] of Object.entries(T.brands)) {
    for (const mode of Object.keys(brand.modes)) {
      for (const [k, v] of Object.entries(brand.modes[mode].shadow)) {
        for (const m of v.matchAll(/rgb\((\d+) (\d+) (\d+)/g)) {
          const hex = "#" + m.slice(1, 4).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
          const { h, s } = hsl(hex);
          assert.ok(!(h >= 165 && h <= 205 && s > 0.15), `${b}.${mode}.shadow.${k} contains cyan ${hex}`);
        }
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
  assert.equal(T.brands.nex.modes, T.modes, "nex brand must be the default modes");
  assert.equal(T.defaultBrand, "nex");
});

test("NixGuard anchors match the brand board", () => {
  const ng = T.palette.nixguard;
  assert.deepEqual(
    [ng.emerald, ng.fortress, ng.signal, ng.carbon, ng.graphite, ng.iron, ng.bone, ng.mist, ng.amber, ng.red],
    ["#16A36A", "#08734B", "#45E59A", "#0B0D0C", "#141816", "#27302B", "#F5F7F5", "#A5AEA9", "#F2B84B", "#E05252"],
  );
  const d = T.brands.nixguard.modes.dark.color;
  assert.equal(d.canvas, ng.carbon);
  assert.equal(d.surface, ng.graphite);
  assert.equal(d.accent, ng.emerald);
  assert.match(T.brands.nixguard.fontFamily.sans[0], /Geist/);
  assert.match(T.brands.nixguard.fontFamily.mono[0], /Geist Mono/);
});

test("every brand and mode defines the same tokens", () => {
  const ref = T.brands[T.defaultBrand].modes.dark;
  for (const [b, brand] of Object.entries(T.brands)) {
    for (const [mode, m] of Object.entries(brand.modes)) {
      assert.deepEqual(Object.keys(m.color).sort(), Object.keys(ref.color).sort(), `${b}.${mode}.color`);
      assert.deepEqual(Object.keys(m.shadow).sort(), Object.keys(ref.shadow).sort(), `${b}.${mode}.shadow`);
    }
    assert.deepEqual(Object.keys(brand.fontFamily).sort(), ["display", "mono", "sans"], `${b}.fontFamily`);
  }
});

for (const [b, brand] of Object.entries(T.brands)) {
  for (const mode of Object.keys(brand.modes)) {
    test(`WCAG contrast — ${b} ${mode}`, () => {
      const c = brand.modes[mode].color;
      const failures = [];
      for (const [fg, bg, min] of T.contrastPairs) {
        const ratio = contrast(c[fg], c[bg]);
        if (ratio < min) failures.push(`${fg} on ${bg}: ${ratio.toFixed(2)} < ${min}`);
      }
      assert.deepEqual(failures, []);
    });
  }
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
  assert.deepEqual(Object.keys(ns.theme.extend.fontFamily), ["display"], "fonts:false keeps only the new 'display' name");

  const lib = require("../dist/index.cjs");
  assert.equal(lib.cssVar.color.accent, "rgb(var(--nex-color-accent))");
  assert.equal(lib.withAlpha("accent", 0.2), "rgb(var(--nex-color-accent) / 0.2)");
  assert.equal(lib.toLegacyKitColors("dark").primary, "#00FF41");
  assert.equal(lib.toLegacyKitColors("dark", "nixguard").primary, "#16A36A");
  assert.equal(lib.cssVar.font.display, "var(--nex-font-display)");

  const css = readFileSync(join(root, "dist/tokens.css"), "utf8");
  assert.match(css, /--nex-color-accent: 0 255 65;/);
  assert.match(css, /\[data-theme="light"\]/);
  // NixGuard: brand block, nested light sections, carbon canvas
  assert.match(css, /\[data-brand="nixguard"\] \[data-theme="light"\]/);
  assert.match(css, /--nex-color-canvas: 11 13 12;/);
  assert.match(css, /--nex-font-sans: var\(--nex-font-geist/);
  assert.doesNotMatch(css, /\bbody\s*\{/, "tokens.css must not style elements — that belongs in base.css");
});
