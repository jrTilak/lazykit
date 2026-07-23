import { useEffect, useRef } from "react";

export function usePrevious<Value>(value: Value): Value | undefined;
export function usePrevious<Value, Initial>(
  value: Value,
  initialValue: Initial,
): Value | Initial;
export function usePrevious<Value, Initial>(
  value: Value,
  initialValue?: Initial,
): Value | Initial | undefined {
  const previousRef = useRef<Value | Initial | undefined>(initialValue);

  useEffect(() => {
    previousRef.current = value;
  }, [value]);

  return previousRef.current;
}
