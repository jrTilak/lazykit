import { partition } from "./partition";

const people = [
  { name: 'Alice', active: true },
  { name: 'Bob', active: false },
  { name: 'Charlie', active: true },
];

const [active, inactive] = partition(people, (person) => person.active);

console.log(active);   // Output: [{ name: 'Alice', active: true }, { name: 'Charlie', active: true }]
console.log(inactive); // Output: [{ name: 'Bob', active: false }]
