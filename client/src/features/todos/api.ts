import { api } from "@/lib/api-client";

export interface Todo {
  _id: string;
  userId: string;
  createdAt: string;
  description: string;
  isCompleted: boolean;
}

export type NewTodo = Pick<Todo, "userId" | "description">;
export type TodoPatch = Partial<Pick<Todo, "description" | "isCompleted">>;

export const getTodos = async (userId: string): Promise<Todo[]> => {
  const { data } = await api.get<Todo[]>(`/api/todos/${userId}`);
  return data;
};

export const createTodo = async (todo: NewTodo): Promise<Todo> => {
  const { data } = await api.post<Todo>("/api/todos", todo);
  return data;
};

export const updateTodo = async (
  id: string,
  patch: TodoPatch,
): Promise<Todo> => {
  const { data } = await api.put<Todo>(`/api/todos/${id}`, patch);
  return data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/api/todos/${id}`);
};
