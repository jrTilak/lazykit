import { throttle } from "./throttle";

const save = throttle((value: string) => {
  console.log("Saving", value);
}, 1_000);

save("first"); // Runs immediately.
save("second"); // Dropped during the interval.
