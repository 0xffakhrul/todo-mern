import React, { useState } from "react";
import { Todo } from "../../api/request";
import TodoCard from "./TodoCard";

interface TodoTabProps {
  todos: Todo[];
}

const TodoTab: React.FC<TodoTabProps> = ({ todos }) => {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">(
    "all"
  );

  const handleTabClick = (tab: "all" | "pending" | "completed") => {
    setActiveTab(tab);
  };

  const filteredTodos = (): Todo[] => {
    switch (activeTab) {
      case "pending":
        return todos.filter((todo) => !todo.isCompleted);
      case "completed":
        return todos.filter((todo) => todo.isCompleted);
      default:
        return todos;
    }
  };

  const countByStatus = (status: "all" | "pending" | "completed") => {
    switch (status) {
      case "pending":
        return todos.filter((todo) => !todo.isCompleted).length;
      case "completed":
        return todos.filter((todo) => todo.isCompleted).length;
      default:
        return todos.length;
    }
  };

  return (
    <div className="text-gray-500  border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <div className="flex space-x-4 mb-4">
        <button
          className={` p-4 border-b-2 rounded-t-lg  hover:border-gray-300  ${
            activeTab === "all"
              ? "border-pink-400 text-white border-b-2 "
              : "text-gray-500 border-transparent"
          }`}
          onClick={() => handleTabClick("all")}
        >
          All
          <span> ({countByStatus("all")})</span>
        </button>
        <button
          className={`inline-block p-4 border-b-2 rounded-t-lg  hover:border-gray-300  ${
            activeTab === "pending"
              ? "text-white border-b-2 border-pink-400"
              : "text-gray-500 border-transparent"
          }`}
          onClick={() => handleTabClick("pending")}
        >
          Pending
          <span> ({countByStatus("pending")})</span>
        </button>
        <button
          className={`inline-block p-4 border-b-2 rounded-t-lg  hover:border-gray-300  ${
            activeTab === "completed"
              ? "text-white border-b-2 border-pink-400"
              : "text-gray-500 border-transparent"
          }`}
          onClick={() => handleTabClick("completed")}
        >
          Completed
          <span> ({countByStatus("completed")})</span>
        </button>
      </div>
      <div className="space-y-2">
        {filteredTodos().map((todo) => (
          <TodoCard key={todo._id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

export default TodoTab;
