import React from "react";
import { AutomergeUrl } from "@automerge/automerge-repo";
import { useHandle, useDocument } from "./api";

type Todo = {
  description: string;
  isDone: boolean;
};

type TodoListDoc = {
  todos: Todo[];
};

const TodoListView = ({ docUrl }: { docUrl: AutomergeUrl }) => {
  const handle = useHandle<TodoListDoc>(docUrl);
  const doc = useDocument(handle);

  const onAddTodo = () => {
    handle.change((doc) => {
      doc.todos.push({ isDone: false, description: "" });
    });
  };

  const onToggleTodoAt = (indexToToggle: number) => {
    handle.change(
      (doc) =>
        (doc.todos[indexToToggle].isDone = !doc.todos[indexToToggle].isDone)
    );
  };

  const onEditTodoAt = (indexToEdit: number, description: string) => {
    handle.change((doc) => (doc.todos[indexToEdit].description = description));
  };

  if (!doc) {
    return;
  }

  return (
    <div className="w-full h-full bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>

      <div className="bg-white shadow rounded-lg p-4">
        {doc.todos.map((todo: any, index: number) => (
          <div className="flex items-center gap-2" key={index}>
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={() => onToggleTodoAt(index)}
              className="w-6 h-6"
            />
            <input
              className="w-full border-none p-2 text-lg focus:outline-none"
              value={todo.description}
              onChange={(evt) => onEditTodoAt(index, evt.target.value)}
            />
          </div>
        ))}

        <button onClick={onAddTodo} className="mt-4 w-full text-xl">
          +
        </button>
      </div>
    </div>
  );
};

export default TodoListView;
