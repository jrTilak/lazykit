import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { MDXComponents } from "@/components/mdx/mdx-components";
import { insertHeadingIndexes } from "@/helpers/insert-heading-indexes";
import { ReactElement } from "react";

const PATH_T0_PREDEFINED_PAGES = "src/contents/pages";

export type PredefinedPageMetadata = {
  title: string;
  desc: string;
};

export const getPredefinedPageBySlug = async (
  slug: string
): Promise<{
  meta: PredefinedPageMetadata;
  content: ReactElement;
  rawContent: string;
} | null> => {
  try {
    const fullPath = path.join(
      process.cwd(),
      PATH_T0_PREDEFINED_PAGES,
      `${slug}.mdx`
    );

    //check if file exits
    const isFileExist = fs.existsSync(fullPath);

    if (!isFileExist) return null;

    const file = fs.readFileSync(fullPath, "utf-8");

    if (!file) {
      return null;
    }
    const source = insertHeadingIndexes(
      fs.readFileSync(fullPath, "utf-8"),
      [1, 2, 3]
    );

    const { frontmatter, content } = await compileMDX<PredefinedPageMetadata>({
      source,
      // @ts-expect-error error
      components: MDXComponents,
      options: {
        parseFrontmatter: true,
      },
    });

    return {
      meta: {
        title: frontmatter.title,
        desc: frontmatter.desc,
      },
      content,
      rawContent: source,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
