export type ZipMode = "shortest" | "longest";
export type Zipped<Arrays extends readonly (readonly unknown[])[]> = {
  -readonly [
    Index in keyof Arrays
  ]: Arrays[Index] extends readonly (infer Value)[] ? Value : never;
};
export type ZippedLongest<Arrays extends readonly (readonly unknown[])[]> = {
  -readonly [
    Index in keyof Arrays
  ]: Arrays[Index] extends readonly (infer Value)[] ? Value | undefined : never;
};

/** Groups values at matching indexes across multiple arrays. */
export const zip = <
  const Arrays extends readonly (readonly unknown[])[],
  const Mode extends ZipMode = "shortest",
>(
  arrays: Arrays,
  { mode = "shortest" as Mode }: { mode?: Mode } = {},
): Array<Mode extends "longest" ? ZippedLongest<Arrays> : Zipped<Arrays>> => {
  if (mode !== "shortest" && mode !== "longest") {
    throw new RangeError("mode must be shortest or longest");
  }
  const denseArrays: unknown[][] = [];
  for (let arrayIndex = 0; arrayIndex < arrays.length; arrayIndex += 1) {
    if (!Object.hasOwn(arrays, arrayIndex)) {
      throw new TypeError("arrays must not contain empty slots");
    }
    const array = arrays[arrayIndex];
    if (!Array.isArray(array)) {
      throw new TypeError("arrays must contain only arrays");
    }
    const dense: unknown[] = [];
    for (let index = 0; index < array.length; index += 1) {
      if (!Object.hasOwn(array, index)) {
        throw new TypeError("input arrays must not contain empty slots");
      }
      dense.push(array[index]);
    }
    denseArrays.push(dense);
  }
  if (denseArrays.length === 0) return [];

  const lengths = denseArrays.map((array) => array.length);
  const rowCount =
    mode === "longest" ? Math.max(...lengths) : Math.min(...lengths);
  const rows: unknown[][] = [];

  for (let index = 0; index < rowCount; index += 1) {
    rows.push(denseArrays.map((array) => array[index]));
  }

  return rows as Array<
    Mode extends "longest" ? ZippedLongest<Arrays> : Zipped<Arrays>
  >;
};
