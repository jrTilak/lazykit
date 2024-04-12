/**
 * Searches an array of objects based on a query string and specified keys.
 *
 * @template T - The type of objects in the array.
 * @param {T[]} array - The array of objects to search.
 * @param {string} queryString - The query string to search for.
 * @param {(keyof T)[] | string[]} keys - The keys to search within each object.
 * @returns {T[]} - The filtered array of objects that match the search criteria.
 */
const search = <T extends Record<string, unknown>>(
  array: T[],
  queryString: string,
  keys: (keyof T)[] | string[]
): T[] => {
  // Check if the query string or keys are empty, return empty array if true
  try {
    if (keys.length === 0) {
      return []; // Return empty array if no keys are provided
    }

    if (!queryString.trim()) {
      return array; // Return the original array if the query string is empty
    }

    // Loop through the array to filter objects
    const filteredArray = array.filter((obj) => {
      // Loop through the keys of each object
      for (let key of keys) {
        // Convert the value to string only for the comparison

        let value = obj[key] as any;

        if (typeof value !== "string" && typeof value !== "number") {
          continue; // Skip the key if it is not a string or number
        }
        if (typeof value === "number") {
          value = value.toString();
        }
        value = value.toLowerCase();
        if (value.includes(queryString.toLowerCase()?.trim())) {
          return true;
        }
      }
      // Return false if none of the keys contain the query string
      return false;
    });

    // Return the filtered array
    return filteredArray;
  } catch (error) {
    return [];
  }
};

export default search;
