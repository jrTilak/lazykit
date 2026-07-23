import { getPath } from "./getPath";

const name = getPath(
  { user: { profile: { name: "Ada" } } },
  "user.profile.name"
);
