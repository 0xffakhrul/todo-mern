import type { Request, Response } from "express";
import * as todoService from "../services/todo.service";
import type { UpdateTodoInput } from "../services/todo.service";
import { AppError } from "../utils/AppError";

export async function getAllTodos(_req: Request, res: Response): Promise<void> {
  const todos = await todoService.listTodos();
  res.status(200).json(todos);
}

export async function getTodosByUser(
  req: Request<{ userId: string }>,
  res: Response,
): Promise<void> {
  const todos = await todoService.listTodosByUser(req.params.userId);
  res.status(200).json(todos);
}

export async function createTodo(req: Request, res: Response): Promise<void> {
  const { userId, description } = req.body ?? {};

  if (typeof userId !== "string" || typeof description !== "string") {
    throw AppError.badRequest("userId and description are required strings");
  }

  const todo = await todoService.createTodo({ userId, description });
  res.status(201).json(todo);
}

export async function updateTodo(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const { description, isCompleted } = req.body ?? {};
  const update: UpdateTodoInput = {};

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw AppError.badRequest("description must be a string");
    }
    update.description = description;
  }

  if (isCompleted !== undefined) {
    if (typeof isCompleted !== "boolean") {
      throw AppError.badRequest("isCompleted must be a boolean");
    }
    update.isCompleted = isCompleted;
  }

  if (Object.keys(update).length === 0) {
    throw AppError.badRequest("Nothing to update");
  }

  const todo = await todoService.updateTodo(req.params.id, update);
  res.status(200).json(todo);
}

export async function deleteTodo(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const todo = await todoService.deleteTodo(req.params.id);
  res.status(200).json(todo);
}
