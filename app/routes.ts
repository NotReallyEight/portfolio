import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("projects/:projectId", "routes/projects/project.tsx"),
] satisfies RouteConfig;
