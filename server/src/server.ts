import type { Server } from "node:http";
import { createApp } from "./app";
import { connectDB, disconnectDB } from "./config/db";
import { env } from "./config/env";
import { logger } from "./config/logger";

let server: Server | undefined;

async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, "Shutting down");

  const force = setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10_000);
  force.unref();

  try {
    const s = server;
    if (s) {
      await new Promise<void>((resolve, reject) => {
        s.close((err) => (err ? reject(err) : resolve()));
      });
    }
    await disconnectDB();
    logger.info("Shutdown complete");
    process.exit(0);
  } catch (err) {
    logger.error({ err }, "Error during shutdown");
    process.exit(1);
  }
}

async function main(): Promise<void> {
  await connectDB();
  logger.info("Mongo connected");

  const app = createApp();
  server = app.listen(env.port, () => {
    logger.info(`Listening on port ${env.port} — deploy test 1`);
  });
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => void shutdown(signal));
}

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled rejection");
  void shutdown("unhandledRejection");
});

main().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
