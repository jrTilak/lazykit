import timeout from ".";

timeout(() => "Hello, World!", 1000);
// Expected Output: "Hello, World!"

timeout(() => new Promise((resolve) => setTimeout(resolve, 2000)), 1000);
// Expected Output: Error: Function timed out

timeout(
  () => new Promise((resolve) => setTimeout(resolve, 2000)),
  1000,
  () => console.log("I failed")
);
// Expected Output: I failed
