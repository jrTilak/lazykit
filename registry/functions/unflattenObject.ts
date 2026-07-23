const blocked = new Set(["__proto__", "prototype", "constructor"]);

/** Expands dot-delimited keys into nested plain objects. */
export const unflattenObject = (
  object: Readonly<Record<string, unknown>>
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [path, value] of Object.entries(object)) {
    const segments = path.split(".");
    if (segments.some((segment) => segment === "" || blocked.has(segment))) {
      throw new TypeError("path contains an empty or unsafe segment");
    }
    let target = result;
    segments.forEach((segment, index) => {
      if (index === segments.length - 1) {
        if (Object.prototype.hasOwnProperty.call(target, segment) && typeof target[segment] === "object") {
          throw new TypeError(`path conflicts with an existing value: ${path}`);
        }
        target[segment] = value;
        return;
      }
      const existing = target[segment];
      if (existing === undefined) target[segment] = {};
      else if (existing === null || typeof existing !== "object" || Array.isArray(existing)) {
        throw new TypeError(`path conflicts with an existing value: ${path}`);
      }
      target = target[segment] as Record<string, unknown>;
    });
  }
  return result;
};
