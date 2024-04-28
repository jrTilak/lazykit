---
desc: Returns a new function that can be called only once.
---

The `once` function is used to create a new function that can be called only once. After the first call, the function will always return undefined without executing the original function.

This is useful when you want to ensure that a function is called only once, regardless of how many times it is called. For example, a subscribe button on a website should only be clicked once, and the function should not be executed again if the button is clicked multiple times.
