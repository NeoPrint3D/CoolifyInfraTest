import { hc } from "hono/client";
import type { AppType } from "api";

export const getApiClient = () => {
  const config = useRuntimeConfig();
  return hc<AppType>(
    config.public.apiUrl
      ? `${config.public.apiUrl}/api`
      : "http://localhost:8080/api"
  );
};
