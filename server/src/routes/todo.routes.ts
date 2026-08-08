import { Router } from "express";
import * as controller from "../controllers/todo.controller";
import { validate } from "../middleware/validate";
import {
  createTodoBody,
  todoIdParams,
  updateTodoBody,
  userIdParams,
} from "../validators/todo.schema";

const router = Router();

router.get("/all", controller.getAllTodos);

router.get(
  "/:userId",
  validate({ params: userIdParams }),
  controller.getTodosByUser,
);

router.post("/", validate({ body: createTodoBody }), controller.createTodo);

router.put(
  "/:id",
  validate({ params: todoIdParams, body: updateTodoBody }),
  controller.updateTodo,
);

router.delete(
  "/:id",
  validate({ params: todoIdParams }),
  controller.deleteTodo,
);

export default router;
