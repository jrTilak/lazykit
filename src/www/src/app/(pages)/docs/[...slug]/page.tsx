import NotFound from "@/components/pages/not-found";
import PAGES_CONFIG from "../_configs/_pages.config";
import MethodPage from "../_pages/method-page";
import prevNextBtnJson from "@/configs/prev-next-button-links.json";
import registry from "@/configs/registry.json";
import { Metadata } from "next";
import types from "@/configs/types.json";
import TypePage from "../_pages/type-page";
import { PACKAGE_INFO } from "@/data/info";

const DocsPage = ({ params: { slug } }: { params: { slug: string[] } }) => {
  const predefinedPage = PAGES_CONFIG.find(
    (page) => page.path === `/docs/${slug.join("/")}`
  );
  if (predefinedPage) {
    return <predefinedPage.component />;
  }
  if (
    slug.length === 1 &&
    types.filter((type) => type.label.toLowerCase() === slug[0]).length === 1
  ) {
    return <TypePage type={slug[0]} />;
  }
  if (slug.length === 3) {
    return <MethodPage slug={slug} />;
  }
  return <NotFound />;
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
}) => {
  const predefinedPage = PAGES_CONFIG.find(
    (page) => page.path === `/docs/${slug.join("/")}`
  );
  if (predefinedPage) {
    return predefinedPage.metaData;
  }
  if (
    slug.length === 1 &&
    types.filter((type) => type.label.toLowerCase() === slug[0]).length === 1
  ) {
    return {
      title: `${slug[0]} | ${PACKAGE_INFO.name}`,
    };
  }
  if (slug.length === 3) {
    const methodData = registry?.find(
      (method: any) =>
        method.type === slug[0] &&
        method.category === slug[1] &&
        method.name === slug[2]
    );
    const MethodComp = await import(
      `@/registry/${slug[0]}/${slug[1]}/${methodData?.name}/docs.tsx`
    );
    return {
      title: `${methodData?.name} | ${PACKAGE_INFO.name}`,
      description: MethodComp?.Info?.description,
    };
  }
};
