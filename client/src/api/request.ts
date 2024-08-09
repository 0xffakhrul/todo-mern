import axios from "axios";

const BASE_URL = "https://todo-backend-vjw9.onrender.com/";

export interface Todo {
  _id: string;
  userId: string;
  createdAt: string;
  description: string;
  isCompleted: boolean;
}

export const getTodos = async (userId: string): Promise<Todo[]> => {
  const response = await axios.get(`${BASE_URL}/${userId}`);
  return response.data;
};

export const createTodo = async (
  todo: Omit<Todo, "_id" | "createdAt">
): Promise<Todo[]> => {
  const response = await axios.post(BASE_URL, todo);
  return response.data;
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await axios.put(`${BASE_URL}/${todo._id}`, todo);
  return response.data;
};

export const deleteTodo = async (todo: Todo): Promise<Todo> => {
  const response = await axios.delete(`${BASE_URL}/${todo._id}`);
  return response.data;
};
