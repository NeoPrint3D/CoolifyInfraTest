import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(
    __dirname,
    `../../../${
      process.env.NODE_ENV === "production" ? ".env.prod" : ".env.local"
    }`
  ),
});

console.log("NODE_ENV", process.env.DATABASE_URL);

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables");
}

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient);

export * from "drizzle-orm";

import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  status: varchar("status", { enum: ["completed", "incomplete"] }).default(
    "incomplete"
  ),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
