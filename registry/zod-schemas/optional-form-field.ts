import * as z from "zod";

/**
 * Creates an optional schema that treats an exact empty string as `undefined`.
 *
 * Other values, including whitespace-only strings, are passed to the supplied
 * schema unchanged so that it remains in control of validation and transforms.
 */
export const optionalFormField = <Schema extends z.ZodType>(
  schema: Schema,
): z.ZodType<
  z.output<Schema> | undefined,
  z.input<Schema> | "" | undefined
> =>
  z.preprocess(
    (value: z.input<Schema> | "" | undefined) =>
      value === "" ? undefined : value,
    schema.optional(),
  ) as z.ZodType<
    z.output<Schema> | undefined,
    z.input<Schema> | "" | undefined
  >;
