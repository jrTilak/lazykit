import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/helpers/cn";
import { extractHeadings, Heading } from "@/helpers/extract-headings";
import { generateHeadingId } from "@/helpers/generate-headingId";
import { getMethodPageBySlug } from "@/helpers/get-method-page-by-slug";
import { getPredefinedPageBySlug } from "@/helpers/get-predefined-page-by-slug";
import Link from "next/link";

const OnThisPage = async ({
  slug
}: {
  slug: string
}) => {
  let rawContent: string = ""
  const page = await getPredefinedPageBySlug(slug);
  if (page) rawContent = page.rawContent

  const method = await getMethodPageBySlug(slug);
  if (method) rawContent = method.rawContent


  if (!rawContent) return null;
  return (
    <Card
      className="h-full rounded-none border-l"
    >
      <CardHeader
        role="button"
        className="flex items-center justify-between flex-row p-3.5"
      >
        <CardTitle className="text-lg">On this Page</CardTitle>
      </CardHeader>
      <CardContent className="p-3.5 pt-0 pb-0">
        <div
          className={cn(
            "pb-2 scrollbar"
          )}
        >
          <div className="flex flex-col gap-1.5 text-muted-foreground overflow-hidden pr-4">
            {extractHeadings(rawContent, [1, 2, 3]).map((content, i) => (
              <TOCLink key={i} content={content} indexLevel={0} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default OnThisPage;

const TOCLink = ({
  content,
  indexLevel,
}: {
  content: Heading;
  indexLevel: number;
}) => {
  if (!content.children || content.children.length === 0) {
    return (
      <Link
        style={{
          marginLeft: `${indexLevel * 8}px`,
          fontSize: indexLevel === 0 ? "15px" : "14px",
        }}
        href={`#${generateHeadingId(content.label)}`}
        className="hover:text-primary hover:underline transition-all truncate"
      >
        {content.label}
      </Link>
    );
  } else {
    return (
      <div className="flex flex-col gap-1">
        <Link
          style={{
            marginLeft: `${indexLevel * 8}px`,
            fontSize: indexLevel === 0 ? "15px" : "14px",
          }}
          href={`#${generateHeadingId(content.label)}`}
          className="hover:text-primary hover:underline transition-all truncate"
        >
          {content.label}
        </Link>
        {content.children.map((childContent, i) => (
          <TOCLink key={i} content={childContent} indexLevel={indexLevel + 1} />
        ))}
      </div>
    );
  }
};

