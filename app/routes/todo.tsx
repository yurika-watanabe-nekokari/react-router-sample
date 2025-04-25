
import invariant from "tiny-invariant";
import { Link, type LoaderFunctionArgs } from "react-router";
import type { Route } from ".react-router/types/app/routes/+types/todo";

type Todo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

/**
 * データ取得
 * @param params
 * @param params.todoId
 * @returns
 */
export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.todoId, "Missing todoId param");

  const todoId = params.todoId;
  const response: Todo = await fetch(
    `https://dummyjson.com/todos/${todoId}/?delay=3000`
  ).then((res) => res.json());

  console.log("response", response);

  if (!response) {
    throw new Response("Not Found", { status: 404 });
  }

  return { todo: response };
};

/**
 * Todo詳細
 */
export const Todo = ({ loaderData }: Route.ComponentProps) => {
  const { todo } = loaderData;

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
          {`Todo詳細: ${todo.id}`}
        </h2>

        <div className={"p-3"}>
          <p className={"text-white"}>{`id: ${todo.id}`}</p>
          <p className={"text-white"}>{`todo: ${todo.todo}`}</p>
          <p className={"text-white"}>{`completed: ${todo.completed}`}</p>
          <p className={"text-white"}>{`userId: ${todo.userId}`}</p>
        </div>
      </section>
    </main>
  );
};

export default Todo;
