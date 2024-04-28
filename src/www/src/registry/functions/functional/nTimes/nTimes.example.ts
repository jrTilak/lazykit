import nTimes from ".";

const result = nTimes(() => "result", 3);
// Expected: ["result", "result", "result"]

// You can also use the index of the iteration.
const result2 = nTimes((i) => i, 3);
// Expected: [0, 1, 2]
