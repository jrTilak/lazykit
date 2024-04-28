---
desc: Returns a new function that can be called only for specific number of times.
---

The `callBefore` function is used to create a new function that can be called only for a specific number of times. After the specified number of calls, the function will always return `undefined` without executing the original function.

This is useful in some scenarios like `rate limiting` or `trial period` where you want to allow a function to be called only for a specific number of times.
