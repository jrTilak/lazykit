import ExternalLink from "@/components/external-link";
import Heading from "@/components/heading";
import NotFound from "@/components/not-found";
import Text from "@/components/text";
import registry from "@/configs/registry.json";
import { IDoc } from "@/types/registry.types";
import CodeBlock from "../_components/code-tabs";
import CodeLine from "../_components/code-line";

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
  const methodInfo: IDoc = MethodComp.Info;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Heading>{methodInfo.name}</Heading>
        <Text>{methodInfo.description}</Text>
        {methodInfo.externalLinks && (
          <div>
            {methodInfo.externalLinks.map((link) => (
              <ExternalLink key={link.url} href={link.url}>
                {link.label}
              </ExternalLink>
            ))}
          </div>
        )}
      </div>
      <CodeBlock code={methodData.code} />
      <CodeLine code="npx @jrtilak/lazykit@latest add chunk" language="bash" />
      <MethodComp.default />
    </div>
  );
};
export default MethodPage;
