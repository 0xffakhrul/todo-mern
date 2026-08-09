import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTodo, deleteTodo, getTodos, Todo, updateTodo } from "./request";

export const useTodos = (userId: string | undefined) => {
  return useQuery<Todo[], Error>({
    queryKey: ["todos", userId],
    queryFn: () => getTodos(userId ?? ""),
    enabled: !!userId,
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["todos", variables.userId] });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["todos", variables.userId] });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["todos", variables.userId] });
    },
  });
};
