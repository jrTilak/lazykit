import throttle from ".";

const log = throttle((message: string) => {
  console.log(message);
}, 2000);

log("Hello"); // Will print 'Hello'
log("Hello again"); // Will be ignored if called within 2 seconds from the first call

setTimeout(() => log("Hello after 2 seconds"), 2100); // Will print 'Hello after 2 seconds'
