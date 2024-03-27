import CategoryPage from "./_pages/category-page";
import MethodPage from "./_pages/method-page";
import TypePage from "./_pages/type-page";

const DocsPage = ({ params: { slug } }: { params: { slug: string[] } }) => {
  switch (slug.length) {
    case 1:
      return <TypePage type={slug[0]} />;
    case 2:
      return <CategoryPage category={slug[1]} />;
    case 3:
      return <MethodPage slug={slug} />;
    default:
      return <div>Not found</div>;
  }
};
export default DocsPage;
