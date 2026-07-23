import { useCounter } from "./useCounter";

export function CounterExample() {
  const { count, increment, decrement, reset } = useCounter(0, {
    min: 0,
    max: 20,
    step: 2,
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button type="button" onClick={() => decrement()}>Decrease</button>
      <button type="button" onClick={() => increment()}>Increase</button>
      <button type="button" onClick={reset}>Reset</button>
    </div>
  );
}
