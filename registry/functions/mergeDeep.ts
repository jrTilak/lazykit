const blocked = new Set<PropertyKey>(["__proto__", "prototype", "constructor"]);
const isPlainObject = (value: unknown): value is Record<PropertyKey, unknown> => {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const clone = (value: unknown, seen: WeakMap<object, unknown>): unknown => {
  if (value === null || typeof value !== "object") return value;
  const cached = seen.get(value);
  if (cached) return cached;
  if (Array.isArray(value)) {
    const result: unknown[] = [];
    seen.set(value, result);
    value.forEach((item) => result.push(clone(item, seen)));
    return result;
  }
  if (!isPlainObject(value)) return value;
  const result: Record<PropertyKey, unknown> = {};
  seen.set(value, result);
  for (const key of Reflect.ownKeys(value)) {
    if (blocked.has(key) || !Object.prototype.propertyIsEnumerable.call(value, key)) continue;
    Reflect.set(result, key, clone(Reflect.get(value, key), seen));
  }
  return result;
};

/** Recursively merges plain objects; arrays and other values are replaced. */
export const mergeDeep = <Base extends object, Override extends object>(
  base: Base,
  override: Override
): Base & Override => {
  const seen = new WeakMap<object, unknown>();
  const merge = (left: unknown, right: unknown): unknown => {
    if (!isPlainObject(left) || !isPlainObject(right)) return clone(right, seen);
    const result = clone(left, seen) as Record<PropertyKey, unknown>;
    for (const key of Reflect.ownKeys(right)) {
      if (blocked.has(key) || !Object.prototype.propertyIsEnumerable.call(right, key)) continue;
      const next = Reflect.get(right, key);
      Reflect.set(result, key, merge(Reflect.get(left, key), next));
    }
    return result;
  };
  return merge(base, override) as Base & Override;
};
