import { tryCatch } from "./tryCatch";

const [error] = await tryCatch(async () => {
  throw new Error("Profile request failed");
});

if (error) console.error(error.message);
