import ExternalLink from "@/components/external-link";
import Heading from "@/components/heading";
import NotFound from "@/components/not-found";
import Text from "@/components/text";
import registry from "@/configs/registry.json";
import { IDoc } from "@/types/registry.types";
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
    <div>
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
      <MethodComp.default />
    </div>
  );
};
export default MethodPage;
