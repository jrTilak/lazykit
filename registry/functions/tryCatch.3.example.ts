import { tryCatch } from "./tryCatch";

const [error, response] = await tryCatch(() => fetch("/api/profile"));

if (error) {
  console.error(error);
} else {
  console.log(await response.json());
}
