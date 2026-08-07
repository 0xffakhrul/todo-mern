import { Router } from "express";
import * as controller from "../controllers/todo.controller";

const router = Router();

router.get("/all", controller.getAllTodos);
router.get("/:userId", controller.getTodosByUser);
router.post("/", controller.createTodo);
router.put("/:id", controller.updateTodo);
router.delete("/:id", controller.deleteTodo);

export default router;