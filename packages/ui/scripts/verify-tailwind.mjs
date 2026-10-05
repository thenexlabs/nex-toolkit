#!/usr/bin/env node
/**
 * End-to-end check that @thenexlabs/ui + the @thenexlabs/tokens Tailwind preset
 * actually work together under real Tailwind, the way a consuming site uses them.
 *
 * 1. Compile the built ui `dist` with presets: [tokens preset].
 * 2. Find every class in `dist` that uses a NEX token name (derived from the
 *    preset itself, so new components are covered automatically).
 * 3. Fail if any of those classes is missing from the CSS, or its rule does not
 *    resolve through a --nex-* variable.
 * 4. Compile again WITHOUT the preset and require `bg-accent` to be absent,
 *    proving this check can fail.
 *
 * Usage: NEX_TOKENS_DIR=<built tokens package> node scripts/verify-tailwind.mjs
 * (defaults to ../tokens). Requires `npm run build` in both packages first.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokensDir = resolve(process.env.NEX_TOKENS_DIR ?? join(root, "..", "tokens"));
const presetPath = join(tokensDir, "dist", "tailwind-preset.cjs");
const distDir = join(root, "dist");

const fail = (msg) => {
  console.error(`verify-tailwind: ${msg}`);
  // Surface the reason as a GitHub annotation so it is visible without raw logs.
  if (process.env.GITHUB_ACTIONS) {
    const enc = String(msg).slice(0, 3500).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
    console.log(`::error title=verify-tailwind::${enc}`);
  }
  process.exit(1);
};

if (!existsSync(presetPath)) fail(`tokens preset not found at ${presetPath} (build packages/tokens first)`);
if (!existsSync(distDir)) fail(`ui dist not found at ${distDir} (run npm run build first)`);

const require = createRequire(join(root, "package.json"));
const twPkgPath = require.resolve("tailwindcss/package.json");
const twPkg = JSON.parse(readFileSync(twPkgPath, "utf8"));
const twBinRel = typeof twPkg.bin === "string" ? twPkg.bin : twPkg.bin.tailwindcss;
const twBin = join(dirname(twPkgPath), twBinRel);
if (!/^3\./.test(twPkg.version)) fail(`expected tailwindcss 3.x, found ${twPkg.version}`);

const work = mkdtempSync(join(tmpdir(), "nex-tw-"));
const input = join(work, "in.css");
writeFileSync(input, "@tailwind utilities;\n");
const contentGlob = join(distDir, "**/*.{js,mjs}");

function compile(withPreset) {
  const config = join(work, withPreset ? "with.cjs" : "without.cjs");
  writeFileSync(
    config,
    `module.exports = {
  ${withPreset ? `presets: [require(${JSON.stringify(presetPath)})],` : ""}
  content: [${JSON.stringify(contentGlob)}],
};
`,
  );
  const out = join(work, withPreset ? "with.css" : "without.css");
  try {
    execFileSync(process.execPath, [twBin, "-c", config, "-i", input, "-o", out], { stdio: "pipe" });
  } catch (err) {
    const e = /** @type {{ stderr?: Buffer, message: string }} */ (err);
    fail(`tailwindcss failed (${withPreset ? "with" : "without"} preset):\n${e.stderr?.toString() || e.message}`);
  }
  return readFileSync(out, "utf8");
}

// --- token names, straight from the preset -----------------------------------
const preset = require(presetPath);
const ext = preset.theme.extend;
const names = {
  color: Object.keys(ext.colors),
  shadow: Object.keys(ext.boxShadow),
  radius: Object.keys(ext.borderRadius),
  z: Object.keys(ext.zIndex),
  duration: Object.keys(ext.transitionDuration),
  ease: Object.keys(ext.transitionTimingFunction),
  tracking: Object.keys(ext.letterSpacing),
};
const alt = (xs) => xs.map((x) => x.replace(/[-]/g, "\\-")).sort((a, b) => b.length - a.length).join("|");
// Utility (after variants) that is backed by a NEX token.
const nexUtility = new RegExp(
  `^(?:(?:bg|text|border|ring|divide|fill|stroke|outline|placeholder)-(?:${alt(names.color)})(?:/\\d+)?` +
    `|shadow-(?:${alt(names.shadow)})` +
    `|rounded-(?:${alt(names.radius)})` +
    `|z-(?:${alt(names.z)})` +
    `|duration-(?:${alt(names.duration)})` +
    `|ease-(?:${alt(names.ease)})` +
    `|tracking-(?:${alt(names.tracking)}))$`,
);
// `duration-base` etc. collide with nothing in core, but `text-xs`-style core
// utilities never match because they are not NEX token names.

// --- classes the built components actually use --------------------------------
const files = readdirSync(distDir).filter((f) => /\.(m?js)$/.test(f) && !f.endsWith(".map"));
const source = files.map((f) => readFileSync(join(distDir, f), "utf8")).join("\n");
const candidates = new Set();
for (const lit of source.matchAll(/(["'`])((?:(?!\1)[^\\\n]|\\.)*)\1/g)) {
  for (const cls of lit[2].split(/\s+/)) {
    if (!cls) continue;
    const utility = cls.split(/:(?![^[]*\])/).pop(); // strip variants, keep aria-[a=b]
    if (utility && nexUtility.test(utility)) candidates.add(cls);
  }
}
if (candidates.size < 30) fail(`only ${candidates.size} NEX classes found in dist; extractor is broken`);

// --- compile with the preset and check every class -----------------------------
const css = compile(true);
const escape = (cls) => cls.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);
const missing = [];
const unbacked = [];
for (const cls of [...candidates].sort()) {
  const sel = `.${escape(cls)}`;
  const at = css.indexOf(sel);
  if (at === -1) {
    missing.push(cls);
    continue;
  }
  const body = css.slice(css.indexOf("{", at), css.indexOf("}", at));
  if (!body.includes("var(--nex-")) unbacked.push(cls);
}
if (missing.length) fail(`classes used by components but NOT generated:\n  ${missing.join("\n  ")}`);
if (unbacked.length) fail(`classes generated without a --nex-* variable:\n  ${unbacked.join("\n  ")}`);

// --- negative control: without the preset, NEX classes must disappear ----------
const bare = compile(false);
if (bare.includes(".bg-accent")) fail("bg-accent was generated WITHOUT the preset; this check cannot detect a missing preset");

console.log(
  `verify-tailwind OK: tailwindcss ${twPkg.version}, ${candidates.size} NEX classes from ${files.length} dist files all generated and token-backed; negative control passed`,
);
