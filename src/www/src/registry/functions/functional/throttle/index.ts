/**
 * Return a throttled function that invokes the passed function at most once per every `given` milliseconds.
 **/

function throttle<A extends any[]>(
  fn: (...args: A) => void,
  limit: number
): (...args: A) => void {
  let lastCall = 0;
  return (...args: A) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

export default throttle;
