type ObjectPath = string | readonly PropertyKey[];

const toSegments = (path: ObjectPath): PropertyKey[] => {
  if (typeof path === "string") return path === "" ? [] : path.split(".");
  return [...path];
};

/** Checks whether every segment in an object path is an own property. */
export const hasPath = (object: unknown, path: ObjectPath): boolean => {
  let current = object;
  for (const segment of toSegments(path)) {
    if (
      (typeof current !== "object" && typeof current !== "function") ||
      current === null ||
      !Object.prototype.hasOwnProperty.call(current, segment)
    ) {
      return false;
    }
    current = Reflect.get(current, segment);
  }
  return true;
};
