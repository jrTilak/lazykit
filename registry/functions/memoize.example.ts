import { memoize } from "./memoize";

const parse = memoize((source: string) => JSON.parse(source));
const value = parse('{"ready":true}');
parse.clear();
