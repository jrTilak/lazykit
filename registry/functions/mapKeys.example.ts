import { mapKeys } from "./mapKeys";

const upper = mapKeys(
  { firstName: "Ada", role: "engineer" },
  (_value, key) => key.toUpperCase()
);
// { FIRSTNAME: "Ada", ROLE: "engineer" }
