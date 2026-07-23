import { useState } from "react";

import { useThrottledCallback } from "./useThrottledCallback";

export const ThrottledClicks = () => {
  const [count, setCount] = useState(0);
  const increment = useThrottledCallback(() => {
    setCount((value) => value + 1);
  }, 1_000);

  return (
    <button type="button" onClick={increment}>
      Accepted clicks: {count}
    </button>
  );
};
