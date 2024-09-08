import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  status: varchar("status", { enum: ["completed", "incomplete"] }).default(
    "incomplete"
  ),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
