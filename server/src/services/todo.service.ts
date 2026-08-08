import { TodoModel, type TodoDocument } from "../models/todo.model";
import type { CreateTodoBody, UpdateTodoBody } from "../validators/todo.schema";
import { AppError } from "../utils/AppError";

export async function listTodos(): Promise<TodoDocument[]> {
  return TodoModel.find().sort({ createdAt: -1 });
}

export async function listTodosByUser(userId: string): Promise<TodoDocument[]> {
  return TodoModel.find({ userId }).sort({ createdAt: -1 });
}

export async function createTodo(input: CreateTodoBody): Promise<TodoDocument> {
  return TodoModel.create({
    userId: input.userId,
    description: input.description,
  });
}

export async function updateTodo(
  id: string,
  input: UpdateTodoBody,
): Promise<TodoDocument> {
  const todo = await TodoModel.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  });
  if (!todo) throw AppError.notFound("Todo not found");
  return todo;
}

export async function deleteTodo(id: string): Promise<TodoDocument> {
  const todo = await TodoModel.findByIdAndDelete(id);
  if (!todo) throw AppError.notFound("Todo not found");
  return todo;
}
