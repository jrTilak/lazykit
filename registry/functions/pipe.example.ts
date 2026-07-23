import { pipe } from "./pipe";

const label = pipe(
  21,
  (value) => value * 2,
  String,
  (value) => `Result: ${value}`
);
