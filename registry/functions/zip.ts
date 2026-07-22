type ZipMode = "shortest" | "longest";
type Zipped<Arrays extends readonly (readonly unknown[])[]> = {
  -readonly [Index in keyof Arrays]: Arrays[Index] extends readonly (infer Value)[]
    ? Value
    : never;
};
type ZippedLongest<Arrays extends readonly (readonly unknown[])[]> = {
  -readonly [Index in keyof Arrays]: Arrays[Index] extends readonly (infer Value)[]
    ? Value | undefined
    : never;
};

/** Groups values at matching indexes across multiple arrays. */
export const zip = <
  const Arrays extends readonly (readonly unknown[])[],
  Mode extends ZipMode = "shortest",
>(
  arrays: Arrays,
  { mode = "shortest" as Mode }: { mode?: Mode } = {}
): Array<
  Mode extends "longest" ? ZippedLongest<Arrays> : Zipped<Arrays>
> => {
  if (arrays.length === 0) return [];

  const lengths = arrays.map((array) => array.length);
  const rowCount =
    mode === "longest" ? Math.max(...lengths) : Math.min(...lengths);
  const rows: unknown[][] = [];

  for (let index = 0; index < rowCount; index += 1) {
    rows.push(arrays.map((array) => array[index]));
  }

  return rows as Array<
    Mode extends "longest" ? ZippedLongest<Arrays> : Zipped<Arrays>
  >;
};
