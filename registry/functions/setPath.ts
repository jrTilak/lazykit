type ObjectPath = string | readonly PropertyKey[];

const blocked = new Set<PropertyKey>(["__proto__", "prototype", "constructor"]);
const toSegments = (path: ObjectPath): PropertyKey[] => {
  const segments: PropertyKey[] = typeof path === "string" ? path === "" ? [] : path.split(".") : [...path];
  if (segments.length === 0) throw new RangeError("path must contain at least one segment");
  if (segments.some((segment) => blocked.has(segment))) {
    throw new TypeError("path contains an unsafe segment");
  }
  return segments;
};
const isContainer = (value: unknown): value is Record<PropertyKey, unknown> =>
  typeof value === "object" && value !== null;
const isIndex = (value: PropertyKey): boolean =>
  typeof value === "number" || (typeof value === "string" && /^(0|[1-9]\d*)$/.test(value));

/** Immutably sets a value at a dot-delimited or segment-based object path. */
export const setPath = <T extends object>(
  object: T,
  path: ObjectPath,
  value: unknown
): T => {
  const segments = toSegments(path);
  const root = (Array.isArray(object) ? [...object] : { ...object }) as Record<PropertyKey, unknown>;
  let source: unknown = object;
  let target = root;

  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      Reflect.set(target, segment, value);
      return;
    }
    const existing = isContainer(source) ? Reflect.get(source, segment) : undefined;
    const next = isContainer(existing)
      ? Array.isArray(existing) ? [...existing] : { ...existing }
      : isIndex(segments[index + 1]) ? [] : {};
    Reflect.set(target, segment, next);
    source = existing;
    target = next as Record<PropertyKey, unknown>;
  });
  return root as T;
};
