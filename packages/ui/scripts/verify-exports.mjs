#!/usr/bin/env node
// Fails the build if package.json points at a file the build did not produce.
// (tsup names outputs by the package "type": without "type": "module",
//  CJS is index.js and ESM is index.mjs — easy to get wrong.)
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const paths = new Set([pkg.main, pkg.module, pkg.types]);
const walk = (v) => {
  if (typeof v === "string") paths.add(v);
  else if (v && typeof v === "object") Object.values(v).forEach(walk);
};
walk(pkg.exports);

const missing = [...paths].filter((p) => p && !existsSync(join(root, p)));
if (missing.length) {
  console.error("package.json points at files the build did not produce:\n  " + missing.join("\n  "));
  process.exit(1);
}

const esm = readFileSync(join(root, pkg.module), "utf8");
const cjs = readFileSync(join(root, pkg.main), "utf8");
for (const [name, src] of [["ESM", esm], ["CJS", cjs]]) {
  if (!src.trimStart().startsWith('"use client"')) {
    console.error(`${name} bundle is missing the "use client" banner`);
    process.exit(1);
  }
}
console.log(`exports OK (${paths.size} paths, "use client" present)`);
