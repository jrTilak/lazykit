import { useObjectState } from "./useObjectState";

export function ObjectStateExample() {
  const form = useObjectState({ name: "", subscribed: false });

  return (
    <form>
      <label>
        Name
        <input
          value={form.state.name}
          onChange={(event) => form.setKey("name", event.currentTarget.value)}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={form.state.subscribed}
          onChange={(event) =>
            form.setKey("subscribed", event.currentTarget.checked)
          }
        />
        Subscribe
      </label>
      <button type="button" onClick={form.reset}>Reset</button>
    </form>
  );
}
