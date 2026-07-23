import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { z } from "astro/zod";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        category: z
          .enum([
            "Arrays",
            "Async",
            "Comparison",
            "Formatting",
            "Functional",
            "Logic",
            "Numbers",
            "Objects",
            "Strings",
            "Validation",
            "Web APIs",
          ])
          .optional(),
        kind: z.enum(["function", "hook"]).optional(),
        source: z.string().optional(),
      }),
    }),
  }),
};
