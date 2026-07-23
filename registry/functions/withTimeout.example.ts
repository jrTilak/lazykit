import { withTimeout } from "./withTimeout";

const loadProfile = withTimeout(async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}, 2_000);

const profile = await loadProfile("user-1");
console.log(profile);
