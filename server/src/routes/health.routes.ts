import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

const states: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

router.get("/healthz", (_req, res) => {
  const state = mongoose.connection.readyState;
  const healthy = state === 1;

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    uptime: Math.floor(process.uptime()),
    db: states[state] ?? "unknown",
  });
});

export default router;