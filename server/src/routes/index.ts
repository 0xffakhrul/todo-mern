import { Router } from "express";
import todoRoutes from "./todo.routes";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/todos", todoRoutes);

export default router;
