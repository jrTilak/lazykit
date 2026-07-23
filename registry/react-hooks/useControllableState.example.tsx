import { useState } from "react";

import { useControllableState } from "./useControllableState";

export function ControllableStateExample() {
  const [controlledValue, setControlledValue] = useState("controlled");
  const field = useControllableState({
    value: controlledValue,
    defaultValue: "",
    onChange: setControlledValue,
  });

  return (
    <label>
      Controlled value
      <input
        value={field.value}
        onChange={(event) => field.setValue(event.currentTarget.value)}
      />
    </label>
  );
}
