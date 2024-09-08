import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(
    __dirname,
    `../../${
      process.env.NODE_ENV === "production" ? ".env.prod" : ".env.local"
    }`
  ),
});

export default defineConfig({
  schema: "./src/schema.ts",
  dialect: "postgresql",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
