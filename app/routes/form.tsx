
import { Link, useFetcher } from "react-router";
import type { Route } from ".react-router/types/app/routes/+types/form";
import { z } from "zod";
import {
  Checkbox,
  TextField,
  Input,
} from "react-aria-components";

const commentSchema = z.object({
  body: z
    .string({ required_error: "Message is required" })
    .min(5, "Message is too short")
});

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

type ActionResult =
  | {
      payload: Record<string, unknown>;
      formErrors: string[];
      fieldErrors: Record<string, string[]>;
    }
  | undefined;

/**
 * フォーム値送信
 */
export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  const formData = await request.formData();
  const intent = formData.get("intent");

  // todo の更新の場合
  if (intent === "todo") {
    const updates = Object.fromEntries(formData);

    return await fetch(`https://dummyjson.com/todos/${TODO_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).then((res) => res.json());
  }

  // comment の更新の場合
  if (intent === "comment") {
    const formValues = Object.fromEntries(formData);
    // バリデーションチェック
    const validResult = commentSchema.safeParse(formValues);

    console.log("validResult", validResult);

    // バリデーションエラーがある場合はエラーを返す
    if (!validResult.success) {
      const error = validResult.error.flatten();

      console.log("error", error);

      return {
        payload: formValues,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors,
      };
    }

    const response = await fetch(
      `https://dummyjson.com/comments/${COMMENT_ID}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      }
    ).then((res) => res.json());

    // 送信時にエラーがあった場合ここでエラーを返す
    if (!response) {
      return {
        payload: formValues,
        formErrors: ["Failed!"],
        fieldErrors: {},
      };
    }

    // リダイレクトがある場合はここでリダイレクトする
    // return redirect('/');
  }
}

/**
 * 複数入力フォーム検証用ページ
 */
export const MultiForm = ({ loaderData }: Route.ComponentProps) => {
  const { todo, comment } = loaderData;

  const fetcher = useFetcher<ActionResult>();
  const actionResult = fetcher.data;

  console.log("actionResult", fetcher.data);


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
          <fetcher.Form method="post">
            <p
              className={"text-white"}
            >{`todo completed: ${todo.completed}`}</p>
            <Checkbox
              className="group/checkbox text-white"
              defaultSelected={todo.completed}
              name="completed"
            >
              <span
                className={
                  "group-data-[selected=true]/checkbox:before:content-['☑︎'] before:content-['☐']"
                }
              />
              <span>{todo.todo}</span>
            </Checkbox>

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

          <div>
            <p className={"text-white"}>{`comment: ${comment.body}`}</p>
          </div>

          <fetcher.Form method="post">
            <TextField name="body" defaultValue={comment.body}>
              <Input className={'border border-white p-1 w-full'} />
              <div className="text-red-500">
                {actionResult?.fieldErrors?.body.map((message) => (
                  <span>{message}</span>
                ))}
              </div>
            </TextField>

            <div className="text-red-500">{actionResult?.formErrors}</div>

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
