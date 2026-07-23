import { pipe } from "./pipe";

const label = pipe(
  21,
  (value) => value * 2,
  String,
  (value) => `Result: ${value}`
);

const summaryLength = pipe(
  ["Ada", "Grace", "Linus"],
  (names) => names.join(", "),
  (names) => `Contributors: ${names}`,
  (summary) => summary.length
);
