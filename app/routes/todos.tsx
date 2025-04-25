import type { Route } from ".react-router/types/app/routes/+types/todos";
import { Link, useLoaderData } from "react-router";

type Todo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

type TodoList = {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
};

/**
 * データ取得
 */
export const loader = async () => {
  const response: TodoList = await fetch(
    "https://dummyjson.com/todos/?delay=3000"
  ).then((res) => res.json());

  if (!response) {
    throw new Response("Not Found", { status: 404 });
  }

  return response;
};

/**
 * Todo一覧
 */
export const Todos = ({ loaderData }: Route.ComponentProps) => {
  const { todos } = loaderData;

  return (
    <main>
      <nav>
        <Link
          className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
          to={`/`}
        >
          {`< HOME`}
        </Link>
      </nav>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 p-3">
          Todo一覧
        </h2>

        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <Link
                className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                to={`/todo/${todo.id}`}
              >
                {`${todo.id}: ${todo.todo}`}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Todos;
