import { mapKeys } from "./mapKeys";

const upper = mapKeys(
  { firstName: "Ada" },
  (_value, key) => String(key).toUpperCase()
);
