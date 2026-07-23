type ObjectPath = string | readonly PropertyKey[];

const toSegments = (path: ObjectPath): PropertyKey[] => {
  if (typeof path === "string") return path === "" ? [] : path.split(".");
  return [...path];
};

/** Reads an own property at a dot-delimited or segment-based object path. */
export const getPath = (
  object: unknown,
  path: ObjectPath,
  defaultValue?: unknown
): unknown => {
  let current = object;
  for (const segment of toSegments(path)) {
    if (
      (typeof current !== "object" && typeof current !== "function") ||
      current === null ||
      !Object.prototype.hasOwnProperty.call(current, segment)
    ) {
      return defaultValue;
    }
    current = Reflect.get(current, segment);
  }
  return current === undefined ? defaultValue : current;
};
