import { compactObject } from "./compactObject";

const payload = compactObject({
  name: "Ada",
  nickname: null,
  middleName: undefined as string | undefined,
  flags: [true, undefined, false],
});

// `nickname` is removed, `middleName` is optional, and flags is boolean[].
console.log(payload);
