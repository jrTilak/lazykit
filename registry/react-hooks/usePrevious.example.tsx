import { useState } from "react";

import { usePrevious } from "./usePrevious";

export function PreviousExample() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {previousCount ?? "none"}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </div>
  );
}
