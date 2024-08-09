import { FC } from "react";
import { Todo } from "../../api/request";
import { useDeleteTodo, useUpdateTodo } from "../../api/todo";
import toast from "react-hot-toast";

interface TodoCardProps {
  todo: Todo;
}

const TodoCard: FC<TodoCardProps> = ({ todo }) => {
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleComplete = () => {
    toast.success("Marked as completed");
    updateTodoMutation.mutate({ ...todo, isCompleted: true });
  };

  const handleDelete = () => {
    toast.error("Task removed");
    deleteTodoMutation.mutate({ ...todo });
  };

  return (
    <div className="p-4 gap-4 bg-[#21222c] rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <div className="flex flex-col pb-4 sm:pb-0">
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
          >
            Done
          </button>
        )}
        <button
          className="px-3.5 py-1 bg-red-400/20 rounded-lg text-[#ff8880]"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
