import { hc } from "hono/client";
import type { AppType } from "api";

const config = useRuntimeConfig();
export const client = hc<AppType>(
  config.public.apiUrl
    ? `${config.public.apiUrl}/api`
    : "http://localhost:8080/api"
);
