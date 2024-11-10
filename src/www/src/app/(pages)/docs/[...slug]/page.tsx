import prevNextBtnJson from "@/.generated/prev-next-button-links.json";
import { getPredefinedPageBySlug } from "@/helpers/get-predefined-page-by-slug";
import RenderMdx from "@/components/mdx/render-mdx";
import { getMethodPageBySlug } from "@/helpers/get-method-page-by-slug";
import { Separator } from "@/components/ui/separator";
import Error404 from "@/components/blocks/404";
import { Metadata } from "next";
import { PACKAGE_INFO } from "@/data/info";

const DocsPage = async ({ params: { slug } }: { params: { slug: string[] } }) => {
  const predefinedPage = await getPredefinedPageBySlug(slug.join("/"));
  if (predefinedPage) {
    return (
      <RenderMdx>
        {predefinedPage.content}
      </RenderMdx>
    )
  }

  const methodPage = await getMethodPageBySlug(slug.join("/"));
  if (methodPage) {
    return (
      <RenderMdx>
        <h1 className="mt-2 scroll-m-20 text-4xl font-bold">
          {methodPage.meta.name}
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-2.5 text-muted-foreground">
          {methodPage.meta.desc}
        </p>
        <Separator className="mb-4 mt-2" />
        {/* external links */}
        {methodPage.content}
      </RenderMdx>
    )
  }

  return <Error404 />;
};
export default DocsPage;

export async function generateStaticParams() {
  const urls = prevNextBtnJson.map((item) =>
    item.url.replace("/docs/", "").split("/")
  );
  return urls.map((url) => ({ slug: url }));
}

export const generateMetadata = async ({
  params: { slug },
}: {
  params: { slug: string[] };
}): Promise<Metadata> => {
  const predefinedPage = await getPredefinedPageBySlug(slug.join("/"));
  if (predefinedPage) {
    return (
      {
        title: `${predefinedPage.meta.title} | ${PACKAGE_INFO.name}`,
        description: predefinedPage.meta.desc,
      }
    )
  }

  const methodPage = await getMethodPageBySlug(slug.join("/"));
  if (methodPage) {
    return (
      {
        title: `${methodPage.meta.name} | ${PACKAGE_INFO.name}`,
        description: methodPage.meta.desc,
      }
    )
  }

  return {
    title: "404 | Not Found",
    description: "Page not found",
  }
};
