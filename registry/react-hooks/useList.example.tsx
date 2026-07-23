import { useList } from "./useList";

export function ListExample() {
  const list = useList(["Write tests", "Update docs"]);

  return (
    <div>
      <ul>
        {list.items.map((item, index) => (
          <li key={item}>
            {item}
            <button type="button" onClick={() => list.removeAt(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => list.append(`Task ${list.items.length + 1}`)}
      >
        Add task
      </button>
      <button type="button" onClick={list.reset}>Reset</button>
    </div>
  );
}
