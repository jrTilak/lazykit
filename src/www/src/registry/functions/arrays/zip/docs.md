---
desc: Zips arrays together in the form of an array of arrays.
---

The `zip` function in the combines multiple arrays into a single array of tuples.

The function accepts an `object` as an argument, which has two properties: `arr` (an array of arrays) and `strict` (a boolean). The strict property is optional and defaults to false if not provided.

If the strict property is set to true, the function will only zip arrays of the same length. If the strict property is set to false, the function will zip arrays of different lengths by filling in the missing values with `undefined`.

This function is useful for combining multiple arrays into a single array of tuples.
