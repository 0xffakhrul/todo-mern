import { type TodoDocument, TodoModel } from "../models/todo.model";
import { AppError } from "../utils/AppError";
import type { CreateTodoBody, UpdateTodoBody } from "../validators/todo.schema";

export async function listTodosByUser(userId: string): Promise<TodoDocument[]> {
  return TodoModel.find({ userId }).sort({ createdAt: -1 });
}

export async function createTodo(
  input: CreateTodoBody & { userId: string },
): Promise<TodoDocument> {
  return TodoModel.create({
    userId: input.userId,
    description: input.description,
  });
}

export async function updateTodo(
  id: string,
  userId: string,
  input: UpdateTodoBody,
): Promise<TodoDocument> {
  const todo = await TodoModel.findOneAndUpdate({ _id: id, userId }, input, {
    new: true,
    runValidators: true,
  });
  if (!todo) throw AppError.notFound("Todo not found");
  return todo;
}

export async function deleteTodo(
  id: string,
  userId: string,
): Promise<TodoDocument> {
  const todo = await TodoModel.findOneAndDelete({ _id: id, userId });
  if (!todo) throw AppError.notFound("Todo not found");
  return todo;
}
