import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prometheus } from "@hono/prometheus";
import { db, desc, eq } from "database";
import { todosTable } from "database/schema";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { cors } from "hono/cors";

const app = new Hono();

const { printMetrics, registerMetrics } = prometheus();

app.use("*", registerMetrics);

app.use(
  "*",
  cors({
    origin: [process.env.WEB_HOST_URL!, "http://localhost:3000"],
  })
);

app.get("/metrics", printMetrics);
const todoRouter = new Hono()
  .basePath("/todo")
  .get("/", async (c) => {
    try {
      const todos = await db
        .select()
        .from(todosTable)
        .orderBy(desc(todosTable.createdAt))
        .limit(10);
      return c.json({
        message: "Here are some todos",
        todos,
      });
    } catch (error) {
      console.error(error);
      return c.json({
        message: "An error occurred",
        todos: [],
      });
    }
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        action: z.literal("create"),
        data: z.object({
          title: z.string(),
        }),
      })
    ),
    async (c) => {
      const validated = c.req.valid("json");
      try {
        const todo = await db
          .insert(todosTable)
          .values({ title: validated.data.title })
          .returning();
        return c.json({
          message: "Todo created",
          todo,
        });
      } catch (error) {
        console.error(error);
        return c.json({
          message: "An error occurred",
        });
      }
    }
  )
  .put(
    "/:id",
    zValidator(
      "json",
      z.discriminatedUnion("action", [
        z.object({
          action: z.literal("update"),
          data: z.object({
            title: z.string(),
          }),
        }),
        z.object({
          action: z.literal("toggle"),
          data: z.object({
            status: z.enum(["completed", "incomplete"]),
          }),
        }),
      ])
    ),
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const validated = c.req.valid("json");
      const { id } = c.req.param();
      try {
        switch (validated.action) {
          case "update": {
            const todo = await db
              .update(todosTable)
              .set({ title: validated.data.title })
              .where(eq(todosTable.id, id))
              .returning();
            return c.json({
              message: "Todo updated",
              todo,
            });
          }
          case "toggle": {
            const todo = await db
              .update(todosTable)
              .set({
                status: validated.data.status,
              })
              .where(eq(todosTable.id, id))
              .returning();
            return c.json({
              message: "Todo updated",
              todo,
            });
          }
        }
      } catch (error) {
        console.error(error);
        return c.json({
          message: "An error occurred",
        });
      }
    }
  )
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const id = c.req.param("id");
      try {
        await db.delete(todosTable).where(eq(todosTable.id, id));
        return c.json({
          message: "Todo deleted",
        });
      } catch (error) {
        console.error(error);
        return c.json({
          message: "An error occurred",
        });
      }
    }
  );
app.route("/api", todoRouter);
const port = 8080;
console.log(`Server is running on port ${port}`);

export type AppType = typeof todoRouter;

serve({
  fetch: app.fetch,
  port,
});
