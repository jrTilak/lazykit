function debounce<A extends any[]>(
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
