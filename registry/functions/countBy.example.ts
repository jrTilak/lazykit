import { countBy } from "./countBy";

const totals = countBy(
  ["api", "web", "api"] as const,
  (value) => value
);
// { api: 2, web: 1 }

const apiCount = totals.api ?? 0;
// 2
