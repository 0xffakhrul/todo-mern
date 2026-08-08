import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import healthRoutes from "./routes/health.routes";
import { requestLogger } from "./middleware/requestLogger";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { env } from "./config/env";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(requestLogger);

  app.use(
    cors({
      origin: env.corsOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
  );

  app.use(express.json({ limit: "100kb" }));

  app.use(healthRoutes);
  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}