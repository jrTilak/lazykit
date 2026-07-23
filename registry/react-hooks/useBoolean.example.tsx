import { useBoolean } from "./useBoolean";

export function BooleanExample() {
  const { value, setTrue, setFalse, toggle } = useBoolean();

  return (
    <div>
      <p>The setting is {value ? "enabled" : "disabled"}.</p>
      <button type="button" onClick={setTrue}>Enable</button>
      <button type="button" onClick={setFalse}>Disable</button>
      <button type="button" onClick={toggle}>Toggle</button>
    </div>
  );
}
