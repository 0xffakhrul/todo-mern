import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Todo {
  _id: string;
  userId: string;
  date: Date;
  description: string;
  isCompleted: boolean;
}

export default function TodoForm() {
  const [description, setDescription] = useState<string>("");
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Fetch todos
  const { data: todos, isLoading, error } = useQuery<Todo[]>({
    queryKey: ['todos', user?.id],
    queryFn: () => axios.get(`http://localhost:6969/api/todos/${user?.id}`).then(res => res.data),
    enabled: !!user?.id
  });

  // Create todo mutation
  const createTodoMutation = useMutation({
    mutationFn: (newTodo: Omit<Todo, '_id'>) => axios.post("http://localhost:6969/api/todos", newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
    },
  });

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: (updatedTodo: Todo) => axios.put(`http://localhost:6969/api/todos/${updatedTodo._id}`, updatedTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
    },
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`http://localhost:6969/api/todos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      userId: user?.id || '',
      date: new Date(),
      description: description,
      isCompleted: false,
    };

    createTodoMutation.mutate(newTodo);
    setDescription("");
  };

  const handleToggleComplete = (todo: Todo) => {
    updateTodoMutation.mutate({ ...todo, isCompleted: !todo.isCompleted });
  };

  const handleDelete = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="desc">Description</label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Todos:</h2>
        <ul>
          {todos?.map((todo) => (
            <li key={todo._id}>
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => handleToggleComplete(todo)}
              />
              {todo.description}
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}