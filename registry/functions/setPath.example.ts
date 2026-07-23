import { setPath } from "./setPath";

const next = setPath(
  { user: { name: "Ada" } },
  "user.active",
  true
);
