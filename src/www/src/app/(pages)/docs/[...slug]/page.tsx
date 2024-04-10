import NotFound from "@/components/pages/not-found";
import PAGES_CONFIG from "../_configs/_pages.config";
import MethodPage from "../_pages/method-page";
import registry from "@/configs/prev-next-button-links.json";
import { Metadata } from "next";
import types from "@/configs/types.json";
import TypePage from "../_pages/type-page";

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
  const urls = registry.map((item) =>
    item.url.replace("/docs/", "").split("/")
  );
  return urls.map((url) => ({ slug: url }));
}

export const generateMetadata = ({
  params: { slug },
}: {
  params: { slug: string[] };
}): Metadata | void => {
  const predefinedPage = PAGES_CONFIG.find(
    (page) => page.path === `/docs/${slug.join("/")}`
  );
  if (predefinedPage) {
    return predefinedPage.metaData;
  }
  // if (slug.length === 3) {
  //   return <MethodPage slug={slug} />;
  // }
};
