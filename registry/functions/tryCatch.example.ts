import { tryCatch } from "./tryCatch";

const [error, value] = tryCatch(
  (): { ready: boolean } => JSON.parse('{"ready":true}')
);

if (error) {
  console.error(error);
} else {
  console.log(value);
}
