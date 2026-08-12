import { useState } from "react";
import { useCreateTodo } from "./queries";
import toast from "react-hot-toast";

export default function TodoForm() {
  const [description, setDescription] = useState<string>("");
  const createTodoMutation = useCreateTodo();
  const isLoading = createTodoMutation.isPending;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) return;

    const id = toast.loading("Adding task...");
    try {
      await createTodoMutation.mutateAsync({
        description: trimmed,
      });
      toast.success("Todo added!", { id });
      setDescription("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add todo",
        { id },
      );
    }
  };

  return (
    <div className="pt-2">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-md h-10 w-full bg-[#414558] px-4 focus:outline-1 text-cyan-200 focus:outline-cyan-200"
            placeholder="Add task"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-lime-400/20 rounded-lg text-[#b3ff80] px-4 text-xl"
            disabled={isLoading}
          >
            {isLoading ? "..." : "+"}
          </button>
        </div>
      </form>
    </div>
  );
}
