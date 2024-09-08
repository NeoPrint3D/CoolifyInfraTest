import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/index.ts"], // Update with your entry point file(s)
  format: ["cjs"], // Output formats (CommonJS and ES modules)
  outDir: "dist", // Output directory
  minify: true, // Minify output
  dts: true, // Generate declaration files
  noExternal: [/(.*)/],
});
