import { hc } from "hono/client";
import type { AppType } from "api";

const apiUrl = process.env.API_HOST_URL
  ? `${process.env.API_HOST_URL}/api`
  : "http://localhost:8080/api";
console.log(apiUrl);

export const client = hc<AppType>(apiUrl);
