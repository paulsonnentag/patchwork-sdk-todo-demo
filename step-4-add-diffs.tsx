import React from "react";
import { AutomergeUrl } from "@automerge/automerge-repo";
import { useHandle, useDocument, DocHandle } from "./api";
import { BranchPicker, Timeline } from "./components";
import { isEqual } from "lodash";
import clsx from "clsx";

type Todo = {
  description: string;
  isDone: boolean;
};

type TodoListDoc = {
  todos: Todo[];
};

const TodoListViewWithVersionControl = ({ url }: { url: AutomergeUrl }) => {
  const handle = useHandle<TodoListDoc>(url);

  return (
    <div className="flex flex-col">
      <div className="bg-gray-200">
        <BranchPicker handle={handle} />
      </div>
      <div className="flex">
        <TodoListView handle={handle} />
        <Timeline handle={handle} enableRangeSelection={true} />
      </div>
    </div>
  );
};

export default TodoListViewWithVersionControl;

const TodoListView = ({ handle }: { handle: DocHandle<TodoListDoc> }) => {
  const doc = useDocument(handle);

  const isReadOnly = !isEqual(handle.latestHeads, handle.heads);

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
        {handle.withDeletedValues(doc.todos).map((todo: any, index: number) => (
          <div
            className={clsx("flex items-center gap-2", {
              "bg-green-100": handle.hasBeenAdded(todo),
              "bg-red-100": handle.hasBeenDeleted(todo),
            })}
            key={index}
          >
            <input
              disabled={isReadOnly}
              type="checkbox"
              checked={todo.isDone}
              onChange={() => onToggleTodoAt(index)}
              className={clsx("w-6 h-6", {
                "bg-yellow-100": handle.hasChanged(todo, "isDone"),
              })}
            />
            <input
              disabled={isReadOnly}
              className={clsx(
                "w-full border-none p-2 text-lg focus:outline-none",
                {
                  "bg-yellow-100": handle.hasChanged(todo, "description"),
                }
              )}
              value={todo.description}
              onChange={(evt) => onEditTodoAt(index, evt.target.value)}
            />
          </div>
        ))}

        <button
          disabled={isReadOnly}
          onClick={onAddTodo}
          className="mt-4 w-full text-xl"
        >
          +
        </button>
      </div>
    </div>
  );
};
