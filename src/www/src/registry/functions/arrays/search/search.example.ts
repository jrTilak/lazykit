import search from ".";

const array = [
  { name: "John", age: 25 },
  { name: "Jane", age: 30 },
  { name: "John Doe", age: 35 },
];

// No keys provided
console.log(search(array, "John", []));
// Expected output: []

// Query string is empty
console.log(search(array, "", ["name"]));
// Expected output: [ { name: 'John', age: 25 }, { name: 'Jane', age: 30 }, { name: 'John Doe', age: 35 } ]

// Filtered array of objects matching the query
console.log(search(array, "John", ["name"]));
// Expected output: [ { name: 'John', age: 25 }, { name: 'John Doe', age: 35 } ]

// None of the keys contain the query string
console.log(search(array, "Doe", ["name"]));
// Expected output: []

// Keys does not exist in the object
console.log(search(array, "John", ["email"]));
// Expected output: []
