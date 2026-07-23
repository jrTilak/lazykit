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
const isIndex = (value: PropertyKey): boolean =>
  typeof value === "number" || (typeof value === "string" && /^(0|[1-9]\d*)$/.test(value));

/** Immutably updates the value at an object path, creating missing containers. */
export const updatePath = <T extends object>(
  object: T,
  path: ObjectPath,
  update: (current: unknown) => unknown
): T => {
  const segments = toSegments(path);
  const root = (Array.isArray(object) ? [...object] : { ...object }) as Record<PropertyKey, unknown>;
  let source: unknown = object;
  let target = root;

  segments.forEach((segment, index) => {
    const existing = isContainer(source) ? Reflect.get(source, segment) : undefined;
    if (index === segments.length - 1) {
      Reflect.set(target, segment, update(existing));
      return;
    }
    const next = isContainer(existing)
      ? Array.isArray(existing) ? [...existing] : { ...existing }
      : isIndex(segments[index + 1]) ? [] : {};
    Reflect.set(target, segment, next);
    source = existing;
    target = next as Record<PropertyKey, unknown>;
  });
  return root as T;
};
