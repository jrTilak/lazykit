import sleep from ".";

//iife
(async () => {
  console.log("sleeping for 1 second");
  await sleep(1000);
  console.log("done sleeping"); // This will be printed after 1 second
})();
