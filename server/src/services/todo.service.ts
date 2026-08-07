import { TodoModel, type Todo, type TodoDocument } from "../models/todo.model";
import { AppError } from "../utils/AppError";

export type CreateTodoInput = Pick<Todo, "userId" | "description">;
export type UpdateTodoInput = Partial<Pick<Todo, "description" | "isCompleted">>;

export async function listTodos(): Promise<TodoDocument[]> {
  return TodoModel.find().sort({ createdAt: -1 });
}

export async function listTodosByUser(userId: string): Promise<TodoDocument[]> {
  return TodoModel.find({ userId }).sort({ createdAt: -1 });
}

export async function createTodo(input: CreateTodoInput): Promise<TodoDocument> {
  return TodoModel.create({
    userId: input.userId,
    description: input.description,
  });
}

export async function updateTodo(
  id: string,
  input: UpdateTodoInput,
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