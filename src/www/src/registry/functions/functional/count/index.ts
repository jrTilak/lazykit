/**
 * returns the result of a function and the number of times that function is invoked.
 **/
const count = <A extends any[], R>(fn: (...args: A) => R) => {
  let callCount = 0;

  const wrapper = (...args: A): R => {
    callCount++;
    const result = fn(...args);
    return result;
  };

  const getCount: () => number = () => callCount;
  wrapper.getCount = getCount;

  return wrapper;
};

export default count;
