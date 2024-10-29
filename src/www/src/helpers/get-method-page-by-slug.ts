import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { MDXComponents } from "@/components/mdx/mdx-components";
import { insertHeadingIndexes } from "@/helpers/insert-heading-indexes";
import { ReactElement } from "react";

const PATH_T0_METHOD_PAGE = "src/registry";

export type PredefinedPageMetadata = {
  name: string;
  slug: string;
  desc: string;
};

export const getMethodPageBySlug = async (
  slug: string
): Promise<{
  meta: PredefinedPageMetadata;
  content: ReactElement;
  rawContent: string;
} | null> => {
  try {
    const fullPath = path.join(
      process.cwd(),
      PATH_T0_METHOD_PAGE,
      `${slug}/docs.mdx`
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
        slug,
        name: frontmatter.name,
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
