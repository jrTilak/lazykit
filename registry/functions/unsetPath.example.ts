import { unsetPath } from "./unsetPath";

const publicUser = unsetPath(
  { user: { name: "Ada", token: "secret" } },
  "user.token"
);
