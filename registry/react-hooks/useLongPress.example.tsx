import { useState } from "react";

import { useLongPress } from "./useLongPress";

export const LongPressExample = () => {
  const [count, setCount] = useState(0);
  const handlers = useLongPress<HTMLButtonElement>(
    () => setCount((value) => value + 1),
    { delayMs: 600 },
  );

  return (
    <button type="button" {...handlers}>
      Hold to increment: {count}
    </button>
  );
};
