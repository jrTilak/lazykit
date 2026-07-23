import { withQueryParams } from "./withQueryParams";

const url = withQueryParams("/search?q=old#results", {
  q: "new value",
  page: 2,
  tag: ["typescript", "bun"]
});
