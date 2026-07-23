import { memoizeAsync } from "./memoizeAsync";

const getUser = memoizeAsync(async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
});
