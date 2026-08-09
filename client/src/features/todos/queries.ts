import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTodo,
  deleteTodo,
  getTodos,
  TodoPatch,
  updateTodo,
  type Todo,
} from "./api";
import { useCurrentUser } from "@/auth/clerk";

const todoKey = (userId: string | undefined) => ["todos", userId] as const;

export const useTodos = () => {
  const { userId, isSignedIn } = useCurrentUser();
  return useQuery<Todo[], Error>({
    queryKey: todoKey(userId),
    queryFn: () => getTodos(userId!),
    enabled: isSignedIn && !!userId,
  });
};

const useInvalidateTodos = () => {
  const qc = useQueryClient();
  const { userId } = useCurrentUser();
  return () => qc.invalidateQueries({ queryKey: todoKey(userId) });
};

export const useCreateTodo = () => {
  const invalidate = useInvalidateTodos();
  return useMutation({ mutationFn: createTodo, onSuccess: invalidate });
};

export const useUpdateTodo = () => {
  const invalidate = useInvalidateTodos();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: TodoPatch }) =>
      updateTodo(id, patch),
    onSuccess: invalidate,
  });
};

export const useDeleteTodo = () => {
  const invalidate = useInvalidateTodos();
  return useMutation({ mutationFn: deleteTodo, onSuccess: invalidate });
};
