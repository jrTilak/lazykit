import once from ".";

const subscribe = once(() => {
  console.log("Subscribed");
});

const result = subscribe();
// Expected Output: Subscribed

const result2 = subscribe();
// Expected Output: undefined : as the function has been called once already.
