import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2020",
  external: ["react", "react-dom", "@thenexlabs/tokens"],
  // esbuild strips module-level "use client" when bundling, so add it back as a banner.
  // Every component in this entry can be imported from a Next.js Server Component.
  // When static (server-only) components arrive, give them their own entry without the banner.
  banner: { js: '"use client";' },
});
