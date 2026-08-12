import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  MONGO_URI: z.string().min(1),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_PUBLISHABLE_KEY: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  console.error(`Invalid environment variables:\n${details}`);
  process.exit(1);
}

const data = parsed.data;

export const env = {
  nodeEnv: data.NODE_ENV,
  port: data.PORT,
  mongoUri: data.MONGO_URI,
  logLevel: data.LOG_LEVEL,
  corsOrigins: data.CORS_ORIGINS.split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  isDevelopment: data.NODE_ENV === "development",
  isProduction: data.NODE_ENV === "production",
} as const;
