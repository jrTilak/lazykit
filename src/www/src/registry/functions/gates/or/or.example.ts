import or from ".";

console.log(or(true, true));
// Expected Output: true

console.log(or(false, true));
// Expected Output: true

console.log(or(false, false));
// Expected Output: false

console.log(or());
// Expected Output: false

console.log(or(1, "lazykit"));
// Expected Output: true
