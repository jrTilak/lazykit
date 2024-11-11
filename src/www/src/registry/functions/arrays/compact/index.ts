/**
 * Removes falsy values from an array, If extend is true, also removes empty objects and arrays.
 **/
const compact = <T>(array: T[], extend: boolean = false): T[] => {
  let truthy = array.filter((item) => {
    // remove all falsy values and excluded values
    return Boolean(item);
  });

  if (extend) {
    // remove all empty objects
    truthy = truthy.filter((item) => {
      if (typeof item === "object" && !(item instanceof Array)) {
        return Object.keys(item as object).length > 0;
      }
      return true;
    });
    // remove all empty arrays
    truthy = truthy.filter((item) => {
      if (Array.isArray(item)) {
        return (item as []).length > 0;
      }
      return true;
    });
  }
  return truthy;
};

export default compact;
