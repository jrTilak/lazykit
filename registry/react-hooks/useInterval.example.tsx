import { useState } from "react";

import { useInterval } from "./useInterval";

export const ElapsedSeconds = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useInterval(
    () => setSeconds((value) => value + 1),
    running ? 1_000 : null,
  );

  return (
    <button type="button" onClick={() => setRunning((value) => !value)}>
      {seconds}s · {running ? "Pause" : "Resume"}
    </button>
  );
};
