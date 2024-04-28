import callAfter from ".";

const fn = (x: number) => x + 1;

const callAfterFn = callAfter(fn, 2);

const result1 = callAfterFn(1);
// Expected Output: undefined

const result2 = callAfterFn(2);
// Expected Output: undefined

const result3 = callAfterFn(3);
// Expected Output: 4 : as the function `fn` has been called twice already.
