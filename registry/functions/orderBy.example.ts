import { orderBy } from "./orderBy";

const users = orderBy(
  [{ name: "Ada", score: 8 }, { name: "Lin", score: 10 }],
  [{ select: (user) => user.score, order: "desc" }]
);
