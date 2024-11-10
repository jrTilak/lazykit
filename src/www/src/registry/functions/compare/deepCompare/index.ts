/**
 * compares two or more values deeply, checking both primitive and non-primitive types for equality by comparing their serialized JSON string representations.
 */
const deepCompare = (...args: unknown[]): boolean => {
  // If there are less than 2 arguments, return true (nothing to compare)
  if (args.length < 2) {
    return true;
  }

  // Iterate over the values and compare each pair of consecutive values
  for (let i = 0; i < args.length - 1; i++) {
    const a = args[i];
    const b = args[i + 1];

    // If the types are different, return false
    if (typeof a !== typeof b) {
      return false;
    }

    // For primitive types (boolean, string, number), compare using strict equality
    if (
      typeof a === "boolean" ||
      typeof a === "string" ||
      typeof a === "number"
    ) {
      if (a !== b) return false;
    } else {
      // For non-primitive types, we compare by converting to JSON string
      if (JSON.stringify(a) !== JSON.stringify(b)) {
        return false;
      }
    }
  }

  return true; // If all comparisons passed, return true
};

export default deepCompare;
