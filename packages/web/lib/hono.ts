import { hc } from "hono/client";
import type { AppType } from "api";

console.log(process.env.API_HOST_URL);
export const client = hc<AppType>(
  process.env.API_HOST_URL + "/api" || "http://localhost:8080/api"
);
