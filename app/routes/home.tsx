import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const pageLink = [
  {
    to: "/todo",
    text: "TODO一覧",
  },
];

export default function Home() {
  return (
    <ul>
      {pageLink.map(({ to, text }) => (
        <li key={to}>
          <Link
            className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
            to={to}
          >
            {text}
          </Link>
        </li>
      ))}
    </ul>
  );
}
