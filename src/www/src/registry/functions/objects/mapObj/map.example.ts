import mapObj from ".";

const obj1 = { a: 1, b: 2, c: 3 };
const result1 = mapObj(obj1, (value: number) => value * 2);
console.log(result1);
// Expected output:  { a: 2, b: 4, c: 6 }

const obj2 = {};
const result2 = mapObj(obj2, (value: any) => value);
console.log(result2);
// Expected output:  {}

const obj3 = { 1: "one", 2: "two", 3: "three" };
const result = mapObj(obj3, (value: string, i) => value.toUpperCase() + i);
console.log(result);
// Expected output: { 1: 'ONE1', 2: 'TWO2', 3: 'THREE3' }
