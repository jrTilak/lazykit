import prevNextBtnJson from "@/configs/prev-next-button-links.json";
import { getPredefinedPageBySlug } from "@/helpers/get-predefined-page-by-slug";
import RenderMdx from "@/components/mdx/render-mdx";
import { getMethodPageBySlug } from "@/helpers/get-method-page-by-slug";
import { Separator } from "@/components/ui/separator";
import Error404 from "@/components/blocks/404";

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

// export const generateMetadata = async ({
//   params: { slug },
// }: {
//   params: { slug: string[] };
// }) => {
//   const predefinedPage = PAGES_CONFIG.find(
//     (page) => page.path === `/docs/${slug.join("/")}`
//   );
//   if (predefinedPage) {
//     return predefinedPage.metaData;
//   }
//   if (
//     slug.length === 1 &&
//     types.filter((type) => type.label.toLowerCase() === slug[0]).length === 1
//   ) {
//     return {
//       title: `${slug[0]} | ${PACKAGE_INFO.name}`,
//     };
//   }
//   if (slug.length === 3) {
//     const methodData = registry?.find(
//       (method: any) =>
//         method.type === slug[0] &&
//         method.category === slug[1] &&
//         method.name === slug[2]
//     );
//     if (!methodData) return;

//     return {
//       title: `${methodData?.name} | ${PACKAGE_INFO.name}`,
//       description: methodData?.docs?.metaData?.desc as string,
//     };
//   }
// };
