import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  target: "node20",
  outDir: "dist",
  noExternal: ["database"],
});
