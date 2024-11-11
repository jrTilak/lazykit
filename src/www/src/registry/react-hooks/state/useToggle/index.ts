import { useState, useCallback, SetStateAction } from "react";

/**
 * A custom hook to toggle between two specific values.
 */
const useToggle = <
  A extends string | number | boolean,
  B extends string | number | boolean,
>(
  value1: A,
  value2: B
) => {
  const [state, setState] = useState<A | B>(value1);

  const toggle = useCallback(() => {
    setState((prevState) => (prevState === value1 ? value2 : value1));
  }, [value1, value2]);

  const setStateFn = useCallback(
    (value: SetStateAction<A | B>) => {
      if (typeof value === "function") {
        setState((prevState) => {
          const nextState = value(prevState);
          if (nextState !== value1 && nextState !== value2) {
            throw new Error(`Invalid value: ${nextState}`);
          }
          return nextState;
        });
        return;
      }

      if (value !== value1 && value !== value2) {
        throw new Error(`Invalid value: ${value}`);
      }
      setState(value);
    },
    [value1, value2]
  );

  return { state, toggle, setState: setStateFn };
};

export default useToggle;
