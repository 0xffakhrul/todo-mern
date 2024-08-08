import { UserButton, useUser } from "@clerk/clerk-react";
import TodoForm from "./TodoForm";
import { useTodos } from "../../api/todo";
import TodoTab from "./TodoTab";

export const Dashboard = () => {
  const { user } = useUser();
  const { data: todos, isLoading, error } = useTodos(user?.id);

  const todosArray = todos ?? [];

  if (isLoading) return <div>Loading..</div>;
  if (error) return <div>error occurred: {error.message}</div>;
  return (
    <div className="max-w-3xl mx-auto m-6">
      <div className="flex justify-between items-center pb-2">
        <h1 className="text-3xl font-black bg-gradient-to-l from-cyan-200 to-purple-400 bg-clip-text text-transparent">
          Welcome, {user?.firstName}
        </h1>
        <UserButton />
      </div>
      <TodoTab todos={todosArray} />
      <TodoForm />
    </div>
  );
};
