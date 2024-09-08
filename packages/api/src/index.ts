import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prometheus } from "@hono/prometheus";
import { db, todosTable } from "database";

const app = new Hono();

const { printMetrics, registerMetrics } = prometheus();

app.use("*", registerMetrics);

app.get("/metrics", printMetrics);

app.get("/", async (c) => {
  try {
    const todos = await db.select().from(todosTable);
    return c.json({
      todos,
    });
  } catch (error) {
    console.error(error);
    return c.json({
      message: "An error occurred",
    });
  }
});

app.post("/", async (c) => {
  try {
    const todo = await db
      .insert(todosTable)
      .values({ title: "New Todo" })
      .returning();
    return c.json({
      todo,
    });
  } catch (error) {
    console.error(error);
    return c.json({
      message: "An error occurred",
    });
  }
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
