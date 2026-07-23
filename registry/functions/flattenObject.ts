const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};
const blocked = new Set(["__proto__", "prototype", "constructor"]);

/** Flattens nested plain-object properties into dot-delimited keys. */
export const flattenObject = (
  object: Readonly<Record<string, unknown>>
): Record<string, unknown> => {
  const result: Record<string, unknown> = Object.create(null);
  const visit = (value: Record<string, unknown>, prefix: string, stack: WeakSet<object>) => {
    if (stack.has(value)) throw new TypeError("cannot flatten a circular object");
    stack.add(value);
    const entries = Object.entries(value);
    if (entries.length === 0 && prefix) result[prefix] = {};
    for (const [key, child] of entries) {
      if (key.includes(".") || blocked.has(key)) throw new TypeError("object contains an ambiguous or unsafe key");
      const path = prefix ? `${prefix}.${key}` : key;
      if (isPlainObject(child)) visit(child, path, stack);
      else Reflect.set(result, path, child);
    }
    stack.delete(value);
  };
  visit(object, "", new WeakSet());
  return result;
};
