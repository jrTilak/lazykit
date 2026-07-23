import { isPlainObject } from "./isPlainObject";

const value: unknown = JSON.parse('{"status":"ready"}');

if (isPlainObject(value)) {
  console.log(value.status);
}
