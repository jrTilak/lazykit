import { hasPath } from "./hasPath";

const configured = hasPath(
  { server: { port: 3000 } },
  "server.port"
);
