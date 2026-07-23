type MissingValue = "keep" | "empty" | "throw";

const readPath = (object: unknown, path: string): unknown => {
  let current = object;
  for (const segment of path.split(".")) {
    if (current === null || typeof current !== "object" || !Object.prototype.hasOwnProperty.call(current, segment)) return undefined;
    current = Reflect.get(current, segment);
  }
  return current;
};

/** Replaces {{ dot.path }} placeholders with own properties from a values object. */
export const interpolate = (
  template: string,
  values: object,
  { missing = "keep" }: { missing?: MissingValue } = {}
): string => {
  return template.replace(/{{\s*([^{}]+?)\s*}}/g, (placeholder, path: string) => {
    const value = readPath(values, path.trim());
    if (value !== undefined && value !== null) return String(value);
    if (missing === "empty") return "";
    if (missing === "throw") throw new ReferenceError(`Missing interpolation value: ${path.trim()}`);
    return placeholder;
  });
};
