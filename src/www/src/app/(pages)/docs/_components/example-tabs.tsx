"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import CodeBlock from "./code-block";
import { useLang } from "@/providers/lang-provider";
interface IExampleTabs {
  code: {
    ts: string;
    js: string;
  }[];
}

const ExampleTabs = ({ code }: IExampleTabs) => {
  const { lang } = useLang();

  return (
    <Tabs defaultValue={lang === "js" ? "js" : "ts"} value={lang}>
      <TabsContent value="ts">
        {code.map((item, index) => (
          <CodeBlock key={index} code={item.ts} language="typescript" />
        ))}
      </TabsContent>
      <TabsContent value="js">
        {code.map((item, index) => (
          <CodeBlock key={index} code={item.js} language="javascript" />
        ))}
      </TabsContent>
    </Tabs>
  );
};
export default ExampleTabs;
