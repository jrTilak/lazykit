import { pLimit } from "./pLimit";

const limit = pLimit(2);
const users = await Promise.all(
  ["ada", "lin", "sam"].map((id) =>
    limit(() => fetch(`/api/users/${id}`).then((response) => response.json()))
  )
);
