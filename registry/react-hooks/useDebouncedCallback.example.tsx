import { useState } from "react";

import { useDebouncedCallback } from "./useDebouncedCallback";

export const AutosaveInput = () => {
  const [status, setStatus] = useState("Nothing to save");
  const save = useDebouncedCallback((value: string) => {
    setStatus(`Saved “${value}”`);
  }, 500);

  return (
    <label>
      Note
      <input
        onChange={(event) => {
          setStatus("Waiting…");
          save(event.currentTarget.value);
        }}
      />
      <span>{status}</span>
    </label>
  );
};
