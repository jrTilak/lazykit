import { useMap } from "./useMap";

export function MapExample() {
  const scores = useMap<string, number>([["Ada", 1]]);

  return (
    <div>
      <ul>
        {Array.from(scores.map, ([name, score]) => (
          <li key={name}>{name}: {score}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => scores.update("Ada", (score) => (score ?? 0) + 1)}
      >
        Add point
      </button>
      <button type="button" onClick={() => scores.set("Grace", 1)}>
        Add Grace
      </button>
    </div>
  );
}
