import { retry } from "./retry";

const result = await retry(
  async (attempt) => {
    console.log("Attempt:", attempt);
    if (attempt < 3) throw new Error("Failed to fetch data");
    return "Data fetched successfully";
  },
  { maxAttempts: 3, delayMs: 1_000 }
);

console.log(result);
