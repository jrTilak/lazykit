import { mergeDeep } from "./mergeDeep";

const config = mergeDeep(
  { server: { host: "localhost", port: 3000 } },
  { server: { port: 8080 } }
);
