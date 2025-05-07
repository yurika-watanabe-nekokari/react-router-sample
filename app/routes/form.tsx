
import { Link, Form, useFetcher } from "react-router";
import type { Route } from ".react-router/types/app/routes/+types/form";

const TODO_ID = 1;
const COMMENT_ID = 1;

type Todo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

type Comment = {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
};

/**
 * データ取得
 */
export const loader = async () => {
  // TODO 取得
  const todoResponse: Todo = await fetch(
    `https://dummyjson.com/todos/${TODO_ID}`
  ).then((res) => res.json());
  // コメント取得
  const commentResponse: Comment = await fetch(
    `https://dummyjson.com/comments/${COMMENT_ID}`
  ).then((res) => res.json());

  // データが取得できなかった場合は404エラーを返す
  if (!todoResponse) {
    throw new Response(`TODO-${TODO_ID} Not Found`, { status: 404 });
  }
  if (!commentResponse) {
    throw new Response(`COMMENT-${COMMENT_ID} Not Found`, { status: 404 });
  }

  return { todo: todoResponse, comment: commentResponse };
};

/**
 * フォーム値送信
 */
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  // todo の更新の場合
  if (intent === "todo") {
    const updates = Object.fromEntries(formData);

    return await fetch(`https://dummyjson.com/todos/${TODO_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
  }

  // comment の更新の場合
  if (intent === "comment") {
    const updates = Object.fromEntries(formData);

    return await fetch(`https://dummyjson.com/comments/${COMMENT_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
  }
}

/**
 * 複数入力フォーム検証用ページ
 */
export const MultiForm = ({ loaderData }: Route.ComponentProps) => {
  const { todo, comment } = loaderData;

  const fetcher = useFetcher();

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
          Form検証
        </h2>

        {/* TODO 更新 */}
        <section className={"p-3"}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 p-3">
            Todo更新
          </h2>

          <p className={"text-white"}>{`todo completed: ${todo.completed}`}</p>

          <fetcher.Form method="post">
            <input
              type="checkbox"
              name="completed"  
              defaultChecked={todo.completed}
            />

            <button type="submit" name="intent" value="todo" className="block">
              変更
            </button>
          </fetcher.Form>
        </section>

        {/* コメント更新 */}
        <section className={"p-3"}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 p-3">
            コメント更新
          </h2>

          <p className={"text-white"}>{`comment: ${comment.body}`}</p>

          <fetcher.Form method="post">
            <input
              type="text"
              name="body"
              defaultValue={comment.body}
              className="border border-gray-300 rounded-md p-2"
            />
            <button
              type="submit"
              name="intent"
              value="comment"
              className="block"
            >
              変更
            </button>
          </fetcher.Form>
        </section>
      </section>
    </main>
  );
};

export default MultiForm;
