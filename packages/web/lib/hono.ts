import { hc } from "hono/client";
import type { AppType } from "api";

export const getApiClient = () => {
  const config = useRuntimeConfig();
  console.log(config);
  console.log("API_URL", config.public.apiUrl);

  return hc<AppType>(
    config.apiUrl ? `${config.public.apiUrl}/api` : "http://localhost:8080/api"
  );
};
