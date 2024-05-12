import count from ".";

const add = (a: number, b: number) => {
  return a + b;
};

const countAddFn = count(add);
countAddFn(1, 2);
countAddFn(3, 4);

console.log(countAddFn.getCount());
// Expected Output: 2
