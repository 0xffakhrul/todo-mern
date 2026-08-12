import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    env: {
      NODE_ENV: "test",
      MONGO_URI: "mongodb://placeholder/test",
      LOG_LEVEL: "silent",
      CORS_ORIGINS: "http://localhost:5173",
      CLERK_SECRET_KEY: "sk_test_dummy",
      CLERK_PUBLISHABLE_KEY: "pk_test_dummy",
    },
    fileParallelism: false,
  },
});
