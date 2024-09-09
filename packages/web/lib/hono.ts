import { hc } from "hono/client";
import type { AppType } from "api";

export const getApiClient = () => {
  const config = useRuntimeConfig();

  return hc<AppType>("https://msggo80kgk4w80w8sgosgkw4.theneocorner.com/api");
};
