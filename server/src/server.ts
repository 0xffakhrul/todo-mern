import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function main(): Promise<void> {
  await connectDB();
  console.log("Mongo connected");

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Listening on http://localhost:${env.port}`);
  });
}

main().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});