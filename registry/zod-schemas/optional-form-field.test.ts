import { describe, expect, test } from "bun:test";
import * as z from "zod";

import { optionalFormField } from "./optional-form-field";

describe("optionalFormField", () => {
  test("maps an exact empty string to undefined", () => {
    const schema = optionalFormField(z.string().min(1));

    expect(schema.parse("")).toBeUndefined();
  });

  test("accepts undefined without invoking the inner schema", () => {
    let parses = 0;
    const schema = optionalFormField(
      z.string().transform((value) => {
        parses += 1;
        return value;
      }),
    );

    expect(schema.parse(undefined)).toBeUndefined();
    expect(parses).toBe(0);
  });

  test("preprocesses the empty string before an inner schema that accepts it", () => {
    const schema = optionalFormField(
      z.string().transform((value) => `inner:${value}`),
    );

    expect(schema.parse("")).toBeUndefined();
  });

  test("delegates non-empty input to the inner schema", () => {
    const schema = optionalFormField(
      z
        .string()
        .trim()
        .min(2)
        .transform((value) => value.toUpperCase()),
    );

    expect(schema.parse("  lazykit  ")).toBe("LAZYKIT");
  });

  test("does not silently treat whitespace-only strings as empty", () => {
    const schema = optionalFormField(z.literal("allowed"));
    const result = schema.safeParse("   ");

    expect(result.success).toBe(false);
  });

  test("preserves whitespace when the inner schema permits it", () => {
    const schema = optionalFormField(z.string());

    expect(schema.parse("   ")).toBe("   ");
  });

  test("preserves non-string input accepted by a generic inner schema", () => {
    const schema = optionalFormField(
      z.object({
        enabled: z.boolean(),
      }),
    );

    expect(schema.parse({ enabled: true })).toEqual({ enabled: true });
  });

  test("rejects non-empty values rejected by the inner schema", () => {
    const schema = optionalFormField(z.int().positive());

    for (const input of [0, -1, 1.5, "1", null, false]) {
      expect(schema.safeParse(input).success).toBe(false);
    }
  });

  test("retains the inner schema's issue path when nested in an object", () => {
    const schema = z.object({
      profile: z.object({
        nickname: optionalFormField(z.string().min(3)),
      }),
    });

    const result = schema.safeParse({
      profile: {
        nickname: "ab",
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: "too_small",
          path: ["profile", "nickname"],
        }),
      );
    }
  });

  test("reports a nested inner type issue directly instead of wrapping it in invalid_union", () => {
    const schema = z.object({
      settings: optionalFormField(
        z.object({
          notifications: z.object({
            frequency: z.number(),
          }),
        }),
      ),
    });

    const result = schema.safeParse({
      settings: {
        notifications: {
          frequency: "daily",
        },
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);
      expect(result.error.issues[0]).toEqual(
        expect.objectContaining({
          code: "invalid_type",
          path: ["settings", "notifications", "frequency"],
        }),
      );
      expect(
        result.error.issues.some((issue) => issue.code === "invalid_union"),
      ).toBe(false);
    }
  });

  test("short-circuits an inner default for absent form values", () => {
    const schema = optionalFormField(z.string().default("fallback"));

    expect(schema.parse(undefined)).toBeUndefined();
    expect(schema.parse("")).toBeUndefined();
  });

  test("supports async inner schemas through parseAsync", async () => {
    const schema = optionalFormField(
      z.string().transform(async (value) => value.toUpperCase()),
    );

    await expect(schema.parseAsync("lazykit")).resolves.toBe("LAZYKIT");
    await expect(schema.parseAsync("")).resolves.toBeUndefined();
    await expect(schema.parseAsync(undefined)).resolves.toBeUndefined();
  });

  test("does not mutate object output from the inner schema", () => {
    const input = {
      tags: ["typescript"],
    };
    const schema = optionalFormField(
      z.object({
        tags: z.array(z.string()),
      }),
    );

    const output = schema.parse(input);

    expect(output).toEqual(input);
    expect(output).not.toBe(input);
  });
});
