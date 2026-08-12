import type { Request, Response } from "express";
import { userIdOf } from "../middleware/requireUser";
import * as todoService from "../services/todo.service";
import type {
  CreateTodoBody,
  TodoIdParams,
  UpdateTodoBody,
} from "../validators/todo.schema";

export async function getTodosByUser(
  req: Request,
  res: Response,
): Promise<void> {
  const todos = await todoService.listTodosByUser(userIdOf(req));
  res.status(200).json(todos);
}

export async function createTodo(
  req: Request<unknown, unknown, CreateTodoBody>,
  res: Response,
): Promise<void> {
  const todo = await todoService.createTodo({
    ...req.body,
    userId: userIdOf(req),
  });
  res.status(201).json(todo);
}

export async function updateTodo(
  req: Request<TodoIdParams, unknown, UpdateTodoBody>,
  res: Response,
): Promise<void> {
  const todo = await todoService.updateTodo(
    req.params.id,
    userIdOf(req),
    req.body,
  );
  res.status(200).json(todo);
}

export async function deleteTodo(
  req: Request<TodoIdParams>,
  res: Response,
): Promise<void> {
  const todo = await todoService.deleteTodo(req.params.id, userIdOf(req));
  res.status(200).json(todo);
}
