import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("todo", "routes/todos.tsx"),
  route("todo/:todoId", "routes/todo.tsx"),
  route("form", "routes/form.tsx"),
] satisfies RouteConfig;
