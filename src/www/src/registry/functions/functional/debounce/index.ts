/**
 * Returns a debounced function that delays invoking the passed function until after `given` milliseconds have elapsed since the last time the debounced function was invoked.
 **/

function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  delay: number = 300
) {
  let timer: any;
  return (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export default debounce;
