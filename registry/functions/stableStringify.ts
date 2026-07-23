const normalize = (value: unknown, stack: WeakSet<object>, inArray: boolean): unknown => {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "bigint") throw new TypeError("cannot stringify BigInt values");
  if (typeof value === "undefined" || typeof value === "function" || typeof value === "symbol") {
    return inArray ? null : undefined;
  }
  if (typeof value !== "object") return value;
  if (stack.has(value)) throw new TypeError("cannot stringify a circular value");
  stack.add(value);
  try {
    const withToJSON = value as { toJSON?: () => unknown };
    if (typeof withToJSON.toJSON === "function") return normalize(withToJSON.toJSON(), stack, inArray);
    if (Array.isArray(value)) return value.map((item) => normalize(item, stack, true));
    const result: Record<string, unknown> = Object.create(null);
    for (const key of Object.keys(value).sort()) {
      const item = normalize(Reflect.get(value, key), stack, false);
      if (item !== undefined) Reflect.set(result, key, item);
    }
    return result;
  } finally {
    stack.delete(value);
  }
};

/** Serializes a value with deterministic object-key ordering. */
export const stableStringify = (value: unknown, space?: string | number): string | undefined => {
  return JSON.stringify(normalize(value, new WeakSet(), false), null, space);
};
