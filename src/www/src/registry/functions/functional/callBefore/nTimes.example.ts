import callBefore from ".";

const fn = (x: number) => x + 1;

const callBeforeFn = callBefore(fn, 2);

const result1 = callBeforeFn(1);
// Expected Output: 2

const result2 = callBeforeFn(2);
// Expected Output: 3

const result3 = callBeforeFn(3);
// Expected Output: undefined : as the function `fn` has been called twice already.
