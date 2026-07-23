import { useState } from "react";

import { useEventCallback } from "./useEventCallback";

export function EventCallbackExample() {
  const [count, setCount] = useState(0);
  const announce = useEventCallback(() => {
    window.alert(`The latest count is ${count}.`);
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <button type="button" onClick={announce}>
        Show latest count
      </button>
    </div>
  );
}
