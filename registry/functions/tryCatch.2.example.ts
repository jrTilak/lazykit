import { tryCatch } from "./tryCatch";

const result = tryCatch(
  (): unknown => JSON.parse("invalid json")
);
const [error] = result instanceof Promise ? await result : result;

if (error) console.error("Could not parse the value", error);
