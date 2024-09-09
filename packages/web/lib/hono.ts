import { hc } from "hono/client";
import type { AppType } from "api";

export const getApiClient = () => {
  const config = useRuntimeConfig();
  console.log("API_URL", config.apiUrl);

  return hc<AppType>(
    config.apiUrl ? `${config.apiUrl}/api` : "http://localhost:8080/api"
  );
};
