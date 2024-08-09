import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useCreateTodo } from "../../api/todo";
import toast from "react-hot-toast";

export default function TodoForm() {
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUser();

  const createTodoMutation = useCreateTodo();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);
    toast.loading("Adding task...");

    const newTodo = {
      userId: user?.id || "",
      description: description.trim(),
      isCompleted: false,
    };

    try {
      await createTodoMutation.mutateAsync(newTodo);
      toast.dismiss();
      toast.success("Todo added!");
      setDescription("");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to add todo");
    } finally {
      setIsLoading(false);
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
