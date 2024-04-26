---
desc: Partitions an array into two arrays based on a given callback ie predicate.
---

The `partition` function takes an array and a predicate function as parameters and returns a tuple of two arrays. The first array contains all elements of the original array for which the predicate function returns `true`, and the second array contains all elements for which the predicate function returns `false`.

The predicate function is a callback function that you provide, which is called for each element in the array. It receives three arguments: the current element, its index, and the original array. The predicate function should return a `boolean` value.

The partition function creates two empty arrays, `pass` and `fail`, and then iterates over the original array using the forEach method. For each element, it calls the predicate function and pushes the element to the pass array if the predicate returns true, and to the fail array if the predicate returns false.

Finally, the partition function returns a tuple containing the pass and fail arrays. This function does not modify the original array.