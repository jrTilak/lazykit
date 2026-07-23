import { useToggle } from "./useToggle";

export function ToggleExample() {
  const { value: theme, toggle } = useToggle("light", "dark");

  return (
    <div>
      <p>Theme: {theme}</p>
      <button type="button" onClick={toggle}>Switch theme</button>
    </div>
  );
}
