import { useState } from "react";

import { useThrottledValue } from "./useThrottledValue";

export const ThrottledRange = () => {
  const [value, setValue] = useState(0);
  const displayedValue = useThrottledValue(value, 250);

  return (
    <label>
      Value: {displayedValue}
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => setValue(event.currentTarget.valueAsNumber)}
      />
    </label>
  );
};
