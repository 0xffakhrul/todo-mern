import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { requestLogger } from "./middleware/requestLogger";
import routes from "./routes";
import healthRoutes from "./routes/health.routes";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(requestLogger);

  app.use(
    cors({
      origin: ["http://localhost:5173"],
      allowedHeaders: ["Authorization", "Content-Type"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
  );

  app.use(express.json({ limit: "100kb" }));

  app.use(healthRoutes);
  app.use(clerkMiddleware());
  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
