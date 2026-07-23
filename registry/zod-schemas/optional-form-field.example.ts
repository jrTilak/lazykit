import * as z from "zod";

import { optionalFormField } from "./optional-form-field";

const profileFormSchema = z.object({
  displayName: z.string().trim().min(1),
  bio: optionalFormField(z.string().trim().max(160)),
  website: optionalFormField(z.httpUrl()),
  notifications: optionalFormField(
    z.object({
      frequency: z.enum(["daily", "weekly"]),
    }),
  ),
});

const profile = profileFormSchema.parse({
  displayName: "  Ada  ",
  bio: "",
  website: "https://example.com",
  notifications: {
    frequency: "weekly",
  },
});

// {
//   displayName: "Ada",
//   bio: undefined,
//   website: "https://example.com",
//   notifications: { frequency: "weekly" }
// }
console.log(profile);

const invalid = profileFormSchema.safeParse({
  displayName: "Ada",
  notifications: {
    frequency: "monthly",
  },
});

if (!invalid.success) {
  // ["notifications", "frequency"] — the inner schema's direct issue path.
  console.log(invalid.error.issues[0]?.path);
}

export type ProfileFormInput = z.input<typeof profileFormSchema>;
export type Profile = z.output<typeof profileFormSchema>;
