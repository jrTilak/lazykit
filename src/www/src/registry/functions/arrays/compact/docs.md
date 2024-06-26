---
desc: Removes falsy values from an array, If strict is true, also removes empty objects and arrays.
---

The compact function is a utility function in TypeScript that removes
&apos;falsy&apos; values from an array.

Falsy values in JavaScript are values that are considered false when
encountered in a Boolean context. These include false, 0, &apos;&apos;
(empty string), null, undefined, and NaN.

The function takes two parameters: an array of any type (array) and a
boolean (strict). If the strict parameter is set to true, the function
also removes empty objects and arrays from the array. An empty object is
an object without any properties, and an empty array is an array without
any elements. The function returns a new array that contains only
&apos;truthy&apos; values, and if strict is true, it also doesn&apos;t
contain any empty objects or arrays.
