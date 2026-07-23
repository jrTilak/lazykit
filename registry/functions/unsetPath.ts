type ObjectPath = string | readonly PropertyKey[];

const blocked = new Set<PropertyKey>(["__proto__", "prototype", "constructor"]);
const toSegments = (path: ObjectPath): PropertyKey[] => {
  const segments: PropertyKey[] = typeof path === "string" ? path === "" ? [] : path.split(".") : [...path];
  if (segments.length === 0) throw new RangeError("path must contain at least one segment");
  if (segments.some((segment) => blocked.has(segment))) throw new TypeError("path contains an unsafe segment");
  return segments;
};
const isContainer = (value: unknown): value is Record<PropertyKey, unknown> =>
  typeof value === "object" && value !== null;

/** Immutably removes an own property at an object path. */
export const unsetPath = <T extends object>(object: T, path: ObjectPath): T => {
  const segments = toSegments(path);
  let current: unknown = object;
  const ancestors: Array<{ container: Record<PropertyKey, unknown>; segment: PropertyKey }> = [];

  for (const segment of segments) {
    if (!isContainer(current) || !Object.prototype.hasOwnProperty.call(current, segment)) return object;
    ancestors.push({ container: current, segment });
    current = Reflect.get(current, segment);
  }

  let child: Record<PropertyKey, unknown> | undefined;
  for (let index = ancestors.length - 1; index >= 0; index -= 1) {
    const { container, segment } = ancestors[index];
    const clone = (Array.isArray(container) ? [...container] : { ...container }) as Record<PropertyKey, unknown>;
    if (child) Reflect.set(clone, segment, child);
    else if (Array.isArray(clone) && typeof segment !== "symbol" && /^(0|[1-9]\d*)$/.test(String(segment))) clone.splice(Number(segment), 1);
    else Reflect.deleteProperty(clone, segment);
    child = clone;
  }
  return child as T;
};
