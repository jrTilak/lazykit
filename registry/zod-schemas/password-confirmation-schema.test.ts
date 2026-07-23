import { describe, expect, it } from "bun:test";
import { z } from "zod";
import {
  createPasswordConfirmationSchema,
  passwordConfirmationSchema,
} from "./password-confirmation-schema";

const issuesFor = (value: unknown) => {
  const result = passwordConfirmationSchema.safeParse(value);
  return result.success ? [] : result.error.issues;
};

describe("passwordConfirmationSchema", () => {
  it("accepts matching values at both inclusive boundaries", () => {
    expect(
      passwordConfirmationSchema.parse({
        password: "a".repeat(8),
        confirmPassword: "a".repeat(8),
      }),
    ).toMatchObject({
      password: "a".repeat(8),
      confirmPassword: "a".repeat(8),
    });

    expect(
      passwordConfirmationSchema.safeParse({
        password: "😀".repeat(128),
        confirmPassword: "😀".repeat(128),
      }).success,
    ).toBeTrue();
  });

  it("counts Unicode code points for both fields", () => {
    expect(
      passwordConfirmationSchema.safeParse({
        password: "😀".repeat(8),
        confirmPassword: "😀".repeat(8),
      }).success,
    ).toBeTrue();

    const issues = issuesFor({
      password: "😀".repeat(7),
      confirmPassword: "😀".repeat(7),
    });
    expect(issues).toContainEqual(
      expect.objectContaining({
        path: ["password"],
        message: "Password must contain at least 8 characters",
      }),
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        path: ["confirmPassword"],
        message: "Password must contain at least 8 characters",
      }),
    );
  });

  it("rejects lone surrogates on their corresponding fields", () => {
    const issues = issuesFor({
      password: `${"a".repeat(8)}\uD800`,
      confirmPassword: `${"a".repeat(8)}\uDC00`,
    });
    expect(issues).toContainEqual(
      expect.objectContaining({
        path: ["password"],
        message: "Password must contain only well-formed Unicode",
      }),
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        path: ["confirmPassword"],
        message: "Password must contain only well-formed Unicode",
      }),
    );
  });

  it("normalizes both values before comparing them", () => {
    expect(
      passwordConfirmationSchema.parse({
        password: `e\u0301${"a".repeat(7)}`,
        confirmPassword: `é${"a".repeat(7)}`,
      }),
    ).toMatchObject({
      password: `é${"a".repeat(7)}`,
      confirmPassword: `é${"a".repeat(7)}`,
    });
  });

  it("does not trim either value", () => {
    const result = passwordConfirmationSchema.parse({
      password: " abcdef ",
      confirmPassword: " abcdef ",
    });
    expect(result.password).toBe(" abcdef ");
    expect(result.confirmPassword).toBe(" abcdef ");
  });

  it("reports a mismatch only on confirmPassword", () => {
    const issues = issuesFor({
      password: "password",
      confirmPassword: "passw0rd",
    });
    expect(issues).toEqual([
      expect.objectContaining({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      }),
    ]);
  });

  it("reports maximum errors at their corresponding paths", () => {
    const issues = issuesFor({
      password: "a".repeat(129),
      confirmPassword: "b".repeat(129),
    });
    expect(issues).toContainEqual(
      expect.objectContaining({
        path: ["password"],
        message: "Password must contain at most 128 characters",
      }),
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        path: ["confirmPassword"],
        message: "Password must contain at most 128 characters",
      }),
    );
  });

  it("rejects invalid field and root input types", () => {
    expect(
      issuesFor({ password: 1, confirmPassword: "password" }),
    ).toContainEqual(
      expect.objectContaining({
        path: ["password"],
        message: "Password must be a string",
      }),
    );
    expect(passwordConfirmationSchema.safeParse(null).success).toBeFalse();
    expect(passwordConfirmationSchema.safeParse([]).success).toBeFalse();
  });

  it("provides metadata without a registry id", () => {
    expect(passwordConfirmationSchema.meta()).toMatchObject({
      title: "Password confirmation",
    });
    expect(passwordConfirmationSchema.meta()).not.toHaveProperty("id");
  });
});

describe("createPasswordConfirmationSchema", () => {
  it("applies the exact same custom schema to both fields", () => {
    let transformations = 0;
    const valueSchema = z
      .string({ error: "Value must be a string" })
      .check(z.trim())
      .transform((value) => {
        transformations += 1;
        return value.toUpperCase();
      });
    const schema = createPasswordConfirmationSchema(valueSchema);

    expect(
      schema.parse({
        password: " value ",
        confirmPassword: "VALUE",
      }),
    ).toMatchObject({
      password: "VALUE",
      confirmPassword: "VALUE",
    });
    expect(transformations).toBe(2);
  });

  it("preserves custom field errors and paths", () => {
    const valueSchema = z.string().check(
      z.minLength(3, { error: "Use at least three characters" }),
    );
    const schema = createPasswordConfirmationSchema(valueSchema);
    const result = schema.safeParse({ password: "x", confirmPassword: "y" });
    expect(result.success).toBeFalse();
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ["password"],
          message: "Use at least three characters",
        }),
      );
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ["confirmPassword"],
          message: "Use at least three characters",
        }),
      );
    }
  });
});
