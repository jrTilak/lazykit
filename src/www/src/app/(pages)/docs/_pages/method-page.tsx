import NotFound from "@/components/pages/not-found";
import registry from "@/configs/registry.json";
import CodeTabs from "../_components/code-tabs";
import CodeLine from "../_components/code-line";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SquareArrowOutUpRight } from "lucide-react";
import PropsTable from "../_components/props-table";
import CodeBlock from "../_components/code-block";
import matter from "gray-matter";
import {
  IDoc,
  IRegistryFunctionPropTable,
  IRegistryJSON,
} from "@/types/registry.types";
import { marked } from "marked";
import ExampleTabs from "../_components/example-tabs";
const MethodPage = async ({ slug }: { slug: string[] }) => {
  if (!registry) return <NotFound />;

  //@ts-ignore
  const methodData = registry?.find(
    (method: any) =>
      method.type === slug[0] &&
      method.category === slug[1] &&
      method.name === slug[2]
  ) as IRegistryJSON;
  if (!methodData) return <NotFound />;

  const htmlContent = marked(methodData.docs.md);

  return (
    <div className="flex flex-col gap-4 lg:gap-8 2xl:gap-12">
      <div className="flex flex-col gap-2">
        <h1 className=" text-2xl sm:text-3xl lg:text-4xl font-bold">
          {methodData.name}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
          {methodData.docs?.metaData?.desc as string}
        </p>
        {methodData.docs?.metaData?.externalLinks && (
          <div className="flex gap-3">
            {methodData.docs?.metaData?.externalLinks.map((link, i) => (
              <Link href={link.url} key={i} target="_blank">
                <Badge
                  variant="secondary"
                  className="inline-flex gap-2 rounded"
                >
                  <span>{link.label}</span>
                  <SquareArrowOutUpRight className="h-3 w-3" />
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
      {[
        {
          title: "Code",
          toRender: <CodeTabs code={methodData.code} />,
        },
        {
          title: "Installation",
          toRender: (
            <CodeLine
              code={`npx @jrtilak/lazykit@latest add ${methodData.name}`}
              language="bash"
            />
          ),
        },
        {
          title: "Description",
          toRender: (
            <div className="prose prose-p:mb-0 prose-p:mt-0 prose-p:w-full w-full min-w-fit">
              <div
                className="flex flex-col gap-2 w-full"
                dangerouslySetInnerHTML={{
                  __html: htmlContent,
                }}
              />
            </div>
          ),
        },
        {
          title: "Props",
          toRender: (
            <div className="overflow-x-auto">
              <PropsTable
                data={methodData.props as IRegistryFunctionPropTable[]}
              />
            </div>
          ),
        },
        {
          title: "Examples",
          toRender: (
            <div className="flex flex-col gap-3 sm:gap-4">
              <ExampleTabs code={methodData.examples} />
            </div>
          ),
        },
      ].map((section, i) => (
        <div key={i} className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id={section.title.toLowerCase()}
          >
            <span>
              {i + 1}. {section.title}
            </span>
            <hr />
          </h3>
          {section.toRender}
        </div>
      ))}
    </div>
  );
};
export default MethodPage;
