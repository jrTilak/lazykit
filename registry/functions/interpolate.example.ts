import { interpolate } from "./interpolate";

const message = interpolate(
  "Hello {{ user.name }}, you have {{ count }} tasks.",
  { user: { name: "Ada" }, count: 3 }
);
