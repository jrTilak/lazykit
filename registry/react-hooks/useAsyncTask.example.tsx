import { useAsyncTask } from "./useAsyncTask";

export const UserLookup = () => {
  const lookup = useAsyncTask(async (signal, userId: number) => {
    const response = await fetch(`/api/users/${userId}`, { signal });
    if (!response.ok) throw new Error("Could not load the user");
    return response.json() as Promise<{ name: string }>;
  });

  return (
    <section>
      <button type="button" onClick={() => void lookup.run(42)}>
        Load user
      </button>
      {lookup.state.status === "pending" && <p>Loading…</p>}
      {lookup.state.status === "success" && <p>{lookup.state.data.name}</p>}
      {lookup.state.status === "error" && <p>Loading failed.</p>}
    </section>
  );
};
