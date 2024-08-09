import { UserButton, useUser } from "@clerk/clerk-react";
import TodoForm from "./TodoForm";
import { useTodos } from "../../api/todo";
import TodoTab from "./TodoTab";
import { Loader } from "lucide-react";

export const Dashboard = () => {
  const { user } = useUser();
  const { data: todos, isLoading, error } = useTodos(user?.id);

  const todosArray = todos ?? [];

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center w-11/12 max-w-3xl mx-auto gap-7">
        <Loader className="text-white animate-spin h-16 w-16" />
        <h1 className="bg-gradient-to-l from-cyan-200 to-purple-400 bg-clip-text text-transparent text-2xl font-bold text-center">
          Please wait, this might take a while...
        </h1>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center w-11/12 max-w-3xl mx-auto gap-7">
        <h1 className="bg-gradient-to-l from-red-200 to-red-400 bg-clip-text text-transparent text-2xl font-bold text-center">
          Error occurred: {error.message}
        </h1>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto m-6 w-11/12">
      <div className="flex justify-between items-center pb-2">
        <h2 className="text-3xl font-black bg-gradient-to-l from-cyan-200 to-purple-400 bg-clip-text text-transparent">
          Welcome, {user?.firstName}
        </h2>
        <UserButton />
      </div>
      <TodoTab todos={todosArray} />
      <TodoForm />
    </div>
  );
};
