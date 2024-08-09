import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useCreateTodo } from "../../api/todo";

export default function TodoForm() {
  const [description, setDescription] = useState<string>("");
  const { user } = useUser();

  const createTodoMutation = useCreateTodo();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      userId: user?.id || "",
      // date: new Date(),
      description: description,
      isCompleted: false,
    };

    createTodoMutation.mutate(newTodo);
    setDescription("");
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
            className="rounded-md h-10 w-full bg-[#414558] px-4 focus:outline-1 text-cyan-200 focus:outline-cyan-200 "
            placeholder="Add task"
          />
          <button
            type="submit"
            className="bg-lime-400/20 rounded-lg text-[#b3ff80] px-4 text-xl"
          >
            +
          </button>
        </div>
      </form>
    </div>
  );
}
