## For Arrays

- [x] sampleArr: generate a random array of specified length
- [x] shuffleArr: shuffle an array
- [x] insert: insert an element after a specified index
  - (if the index is negative, it will insert from the end)
  - (recursive => it will insert the element on every index like)
  ```js
  //insert arr = [1,2,3,4,5], element = 0, index = 2
  //output => [1,2,0,3,4,0,5]
  //insert arr = [1,2,3,4,5, 6], element = 0, index = 2
  //output => [1,2,0,3,4,0,5,6,0]
  //when index is negative, it will start inserting from the end
  ```
- [ ] remove: remove an element at a specified index (if the index is negative, it will remove from the end) index can be array of indexes
- [x] unique: remove duplicates from an array
- [ ] rotate: rotate an array by a specified number of steps ie ([1,2,3,4,5], 2) => [3,4,5,1,2]
- [ ] partition: partition an array into two arrays based on a condition
- [ ] difference: find the difference between two arrays

## For Objects 

- [ ] sampleObj: generate a random object with specified keys and values
- [ ] invertObj: invert the keys and values of an object
- [ ] merge: merge two objects
- [ ] omit: omit specified keys from an object
- [ ] pick: pick specified keys from an object and return a new object
- [ ] rename: rename a key in an object
- [ ] sortKeys: sort the keys of an object

## Functional

- [ ] memoize: memoize a function
- [ ] curry: curry a function
- [ ] partial: partial application of a function ie partial(f, x)(y) => f(x, y)
- [ ] debounce: debounce a function
- [ ] throttle: throttle a function
- [ ] once: return a function that can only be called once
- [ ] after: return a function that can only be called after being called n times
- [ ] before: return a function that can only be called before being called n times
- [ ] times: call a function n times
- [ ] delay: delay the execution of a function
- [ ] sleep: sleep for a specified amount of time
- [x] retry: retry a function n times
- [x] timeout: timeout a function after a specified amount of time ie timeout(f, 1000)(args) which will call f(args) and if it takes more than 1 second, it will return a timeout error

## Date
