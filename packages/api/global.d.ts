declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    DATABASE_URL: string; // Add your own required environment variables
    WEB_URL: string;
  }
}
