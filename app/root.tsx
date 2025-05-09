import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

/**
 * 全ページ共通の link を定義
 */
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

/**
 * 全ページ共通のHTMLを定義するコンポーネント
 * @memo 全ページに適用されるため、特定のページに依存しない内容を記述する
 */
export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* すべてのルートのすべての `meta` export はここにレンダリングされる */}
        <Meta />
        {/* すべてのルートのすべての `link` export はここにレンダリングされる */}
        <Links />
      </head>
      <body>
        {/* ローディング中表示 */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white opacity-30">
            loading...
          </div>
        )}
        {/* 子ルートレンダリング */}
        {children}
        {/* クライアント側の遷移のスクロール位置を管理 */}
        <ScrollRestoration />
        {/* スクリプトタグ */}
        <Scripts />
      </body>
    </html>
  );
}

/**
 * アプリケーションのルートコンポーネント
 * @description Layout の children に入る要素。全ページ共通の表示を定義
 */
export default function App() {
  return <Outlet />;
}

/**
 * エラーハンドリング
 * @description アプリケーション内で発生したエラーをキャッチし、ユーザーに適切なエラーメッセージを表示
 * @param param.error
 * @returns
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "エラーが発生しました";
  let details = "予期せぬエラーが発生しました";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    // ルートエラーの場合
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "ページが見つかりません"
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    // 開発環境でのエラーの場合
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
