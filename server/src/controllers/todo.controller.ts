import type { Request, Response } from "express";
import * as todoService from "../services/todo.service";
import type {
  CreateTodoBody,
  UpdateTodoBody,
  TodoIdParams,
  UserIdParams,
} from "../validators/todo.schema";

export async function getAllTodos(_req: Request, res: Response): Promise<void> {
  const todos = await todoService.listTodos();
  res.status(200).json(todos);
}

export async function getTodosByUser(
  req: Request<UserIdParams>,
  res: Response,
): Promise<void> {
  const todos = await todoService.listTodosByUser(req.params.userId);
  res.status(200).json(todos);
}

export async function createTodo(
  req: Request<unknown, unknown, CreateTodoBody>,
  res: Response,
): Promise<void> {
  const todo = await todoService.createTodo(req.body);
  res.status(201).json(todo);
}

export async function updateTodo(
  req: Request<TodoIdParams, unknown, UpdateTodoBody>,
  res: Response,
): Promise<void> {
  const todo = await todoService.updateTodo(req.params.id, req.body);
  res.status(200).json(todo);
}

export async function deleteTodo(
  req: Request<TodoIdParams>,
  res: Response,
): Promise<void> {
  const todo = await todoService.deleteTodo(req.params.id);
  res.status(200).json(todo);
}