import { once } from "./once";

// Function that we want to run only once
const initialize = () => console.log("Initialization completed!");

const initializeOnce = once(initialize);

// Call the function multiple times
initializeOnce(); // Output: Initialization completed!
initializeOnce(); // No output
initializeOnce(); // No output
