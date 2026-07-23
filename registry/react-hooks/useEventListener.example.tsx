import { useState } from "react";

import { useEventListener } from "./useEventListener";

export const EventListenerExample = () => {
  const [key, setKey] = useState("Press a key");
  useEventListener(
    typeof window === "undefined" ? null : window,
    "keydown",
    (event) => setKey(event.key),
  );

  return <p>Latest key: {key}</p>;
};
