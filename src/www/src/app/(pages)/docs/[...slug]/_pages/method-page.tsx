import NotFound from "@/components/not-found";
import registry from "@/configs/registry.json";
import { IDoc } from "@/types/registry.types";
import CodeTabs from "../_components/code-tabs";
import CodeLine from "../_components/code-line";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SquareArrowOutUpRight } from "lucide-react";
import PropsTable from "../_components/PropsTable";
import { readFileAsString, readFiles } from "@/utils/readFiles";
import CodeBlock from "../_components/code-block";

const PATH_TO_REGISTRY = "./src/registry"; //I don't how this is working, but it is working

const MethodPage = async ({ slug }: { slug: string[] }) => {
  if (!registry) return <NotFound />;

  //@ts-ignore
  const methodData = registry?.find(
    (method: any) =>
      method.type === slug[0] &&
      method.category === slug[1] &&
      method.name === slug[2]
  );
  if (!methodData) return <NotFound />;

  const MethodComp = await import(
    `@/registry/${slug[0]}/${slug[1]}/${methodData.name}/docs.tsx`
  );

  const allExampleFiles = readFiles(
    `${PATH_TO_REGISTRY}/${slug[0]}/${slug[1]}/${methodData.name}`
  )?.filter((file) => file.endsWith(".example.ts"));

  const exampleFilesData = allExampleFiles?.map((file) => {
    const path = `${PATH_TO_REGISTRY}/${slug[0]}/${slug[1]}/${methodData.name}/${file}`;
    const data = readFileAsString(path);
    return data;
  });

  const methodInfo: IDoc = MethodComp.Info;

  return (
    <div className="flex flex-col gap-4 lg:gap-8">
      <div className="flex flex-col gap-2">
        <h1 className=" text-2xl sm:text-3xl lg:text-4xl font-bold">
          {methodData.name}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
          {methodInfo.description}
        </p>
        {methodInfo.externalLinks && (
          <div className="flex gap-3">
            {methodInfo.externalLinks.map((link, i) => (
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
      <div className="flex flex-col gap-3">
        <h3
          className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
          id="code"
        >
          <span>1. Code</span>
          <hr />
        </h3>
        <CodeTabs code={methodData.code} />
      </div>
      <div className="flex flex-col gap-3">
        <h3
          className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
          id="installation"
        >
          <span>2. Installation</span>
          <hr />
        </h3>
        <CodeLine
          code={`npx @jrtilak/lazykit@latest add ${methodData.name}`}
          language="bash"
        />
      </div>
      <div className="flex flex-col gap-3">
        <h3
          className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
          id="description"
        >
          <span>3. Description</span>
          <hr />
        </h3>

        <MethodComp.default />
      </div>
      <div className="flex flex-col gap-3 overflow-hidden">
        <h3
          className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
          id="props"
        >
          <span>4. Props</span>
          <hr />
        </h3>
        <div className="overflow-x-auto">
          <PropsTable data={MethodComp.Props} />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3
          className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
          id="examples"
        >
          <span>5. Examples</span>
          <hr />
        </h3>
        <div className="flex flex-col gap-3 sm:gap-4">
          {exampleFilesData?.map((example, index) => (
            <CodeBlock code={example} key={index} language="javascript" />
          ))}
        </div>
      </div>
    </div>
  );
};
export default MethodPage;
