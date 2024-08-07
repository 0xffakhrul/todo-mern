import { useUser } from "@clerk/clerk-react";
import TodoForm from "./TodoForm";

export const Dashboard = () => {
  const { user } = useUser();
  return (
    <div>
      Welcome, {user?.firstName} <TodoForm />
    </div>
  );
};
