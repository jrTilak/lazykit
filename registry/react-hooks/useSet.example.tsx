import { useSet } from "./useSet";

const availableTags = ["react", "typescript", "testing"] as const;

export function SetExample() {
  const selected = useSet<(typeof availableTags)[number]>(["react"]);

  return (
    <fieldset>
      <legend>Tags</legend>
      {availableTags.map((tag) => (
        <label key={tag}>
          <input
            type="checkbox"
            checked={selected.set.has(tag)}
            onChange={() => selected.toggle(tag)}
          />
          {tag}
        </label>
      ))}
    </fieldset>
  );
}
