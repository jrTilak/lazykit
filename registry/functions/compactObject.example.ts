import { compactObject } from "./compactObject";

const payload = compactObject({
  name: "Ada",
  nickname: null,
  flags: [true, undefined, false]
});
