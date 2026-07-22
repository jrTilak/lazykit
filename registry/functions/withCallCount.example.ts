import { withCallCount } from "./withCallCount";

const add = withCallCount((left: number, right: number) => left + right);

console.log(add(3, 5)); // 8
console.log(add(2, 7)); // 9
console.log(add.getCallCount()); // 2

add.resetCallCount();
console.log(add.getCallCount()); // 0
