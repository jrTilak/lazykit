import { tryCatch } from "./tryCatch";

const result = tryCatch(
  (): { ready: boolean } => JSON.parse('{"ready":true}')
);
const [error, value] = result instanceof Promise ? await result : result;

if (error) {
  console.error(error);
} else {
  console.log(value);
}
