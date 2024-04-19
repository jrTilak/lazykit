import retry from ".";

const fn = async () => {
  Promise.reject(new Error("failed"));
};

retry(fn, 2, 1000).catch((error) => {
  console.log(error.message);
});
// Expected output: "failed" after retrying twice but It will call the function 3 times.
