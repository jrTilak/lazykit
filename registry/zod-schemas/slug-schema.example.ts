import { slugSchema, type Slug } from "./slug-schema";

const articleSlug: Slug = slugSchema.parse("  Crème Brûlée for Beginners  ");

// "creme-brulee-for-beginners"
console.log(articleSlug);

const result = slugSchema.safeParse("Release Notes: Zod 4");

if (result.success) {
  // "release-notes-zod-4"
  console.log(result.data);
}

const alternateSlug = slugSchema.parse("Crème---Brûlée for Beginners!");

// Canonicalization is many-to-one, so check the final value for uniqueness.
const existingSlugs = new Set<Slug>([articleSlug]);
console.log(existingSlugs.has(alternateSlug)); // true
