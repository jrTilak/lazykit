const compactValue = (value: unknown, seen: WeakMap<object, unknown>): unknown => {
  if (value == null || typeof value !== "object") return value;
  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null) return value;
  const cached = seen.get(value);
  if (cached) return cached;

  if (Array.isArray(value)) {
    const result: unknown[] = [];
    seen.set(value, result);
    for (const item of value) {
      if (item != null) result.push(compactValue(item, seen));
    }
    return result;
  }

  const result: Record<PropertyKey, unknown> = Object.create(prototype);
  seen.set(value, result);
  for (const key of Reflect.ownKeys(value)) {
    if (!Object.prototype.propertyIsEnumerable.call(value, key)) continue;
    const item = Reflect.get(value, key);
    if (item != null) {
      Reflect.defineProperty(result, key, {
        value: compactValue(item, seen),
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }
  }
  return result;
};

/** Recursively removes null and undefined properties and array entries. */
export const compactObject = <T extends object>(object: T): T => {
  return compactValue(object, new WeakMap()) as T;
};
