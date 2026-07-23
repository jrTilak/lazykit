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
            "Authentication",
            "Comparison",
            "DOM",
            "Formats",
            "Formatting",
            "Forms",
            "Functional",
            "Logic",
            "Numbers",
            "Objects",
            "State",
            "Storage",
            "Strings",
            "Timing",
            "Validation",
            "Web APIs",
          ])
          .optional(),
        kind: z.enum(["function", "hook", "schema"]).optional(),
        source: z.string().optional(),
      }),
    }),
  }),
};
