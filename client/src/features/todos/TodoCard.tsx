import { FC, useState } from "react";
import { Todo } from "../../api/request";
import { useDeleteTodo, useUpdateTodo } from "../../api/todo";
import toast from "react-hot-toast";

interface TodoCardProps {
  todo: Todo;
}

const TodoCard: FC<TodoCardProps> = ({ todo }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleComplete = async () => {
    setIsLoading(true);
    toast.loading("Processing...");

    try {
      await updateTodoMutation.mutateAsync({ ...todo, isCompleted: true });
      toast.dismiss();
      toast.success("Marked as completed");
    } catch (error) {
      toast.dismiss();
      toast.error("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    toast.loading("Processing...");

    try {
      await deleteTodoMutation.mutateAsync({ ...todo });
      toast.dismiss();
      toast.error("Task removed");
    } catch (error) {
      toast.dismiss();
      toast.error("Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 gap-2 bg-[#21222c] rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <div className="flex flex-col pb-2 sm:pb-0">
        <span
          className={`break-all ${
            todo.isCompleted
              ? "text-gray-500 line-through"
              : "bg-gradient-to-l from-cyan-200 to-purple-400 bg-clip-text text-transparent max-w-lg"
          } pb-1 font-semibold`}
        >
          {todo.description}
        </span>
        <span className="text-gray-600">
          {new Date(todo.createdAt).toLocaleString()}
        </span>
      </div>
      <div className="space-x-2 flex">
        {!todo.isCompleted && (
          <button
            className="px-3.5 py-1 bg-green-400/20 rounded-lg text-[#8aff80]"
            onClick={handleComplete}
            disabled={isLoading}
          >
            Done
          </button>
        )}
        <button
          className="px-3.5 py-1 bg-red-400/20 rounded-lg text-[#ff8880]"
          onClick={handleDelete}
          disabled={isLoading}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
