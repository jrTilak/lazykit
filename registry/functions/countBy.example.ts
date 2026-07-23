import { countBy } from "./countBy";

const totals = countBy(["api", "web", "api"], (value) => value);
// { api: 2, web: 1 }
