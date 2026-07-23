import { useState } from "react";

import { useScrollLock } from "./useScrollLock";

export const ScrollLockExample = () => {
  const [locked, setLocked] = useState(false);
  useScrollLock(undefined, { enabled: locked });

  return (
    <button type="button" onClick={() => setLocked((value) => !value)}>
      {locked ? "Unlock page scroll" : "Lock page scroll"}
    </button>
  );
};
