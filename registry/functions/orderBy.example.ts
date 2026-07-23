import { orderBy, type OrderByRule } from "./orderBy";

type User = { name: string; score: number };

const rules = [
  { select: (user: User) => user.score, order: "desc" }
] satisfies ReadonlyArray<OrderByRule<User>>;

const users: User[] = orderBy(
  [{ name: "Ada", score: 8 }, { name: "Lin", score: 10 }],
  rules
);
// [{ name: "Lin", score: 10 }, { name: "Ada", score: 8 }]
