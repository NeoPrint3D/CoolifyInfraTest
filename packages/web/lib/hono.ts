import { hc } from "hono/client";
import type { AppType } from "api";

export const getApiClient = () => {
  const config = useRuntimeConfig();
  console.log(config);
  const apiUrl = process.env.NUXT_ENV_API_HOST_URL;
  console.log(process.env);
  console.log("API_URL", apiUrl);
  return hc<AppType>(apiUrl ? `${apiUrl}/api` : "http://localhost:8080/api");
};
