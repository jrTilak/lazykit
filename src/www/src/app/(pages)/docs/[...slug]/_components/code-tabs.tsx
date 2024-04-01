"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeBlock from "./code-block";
import useLocalStorage from "use-local-storage";
interface ICodeTabs {
  code: {
    ts: string;
    js: string;
  };
}

const CodeTabs = ({ code }: ICodeTabs) => {
  const [lang, setLang] = useLocalStorage("code-lang", "ts");

  return (
    <Tabs
      defaultValue={lang === "js" ? "js" : "ts"}
      onValueChange={(value) => setLang(value)}
    >
      <TabsList>
        <TabsTrigger value="ts">Typescript</TabsTrigger>
        <TabsTrigger value="js">Javascript</TabsTrigger>
      </TabsList>
      <TabsContent value="ts">
        <CodeBlock code={code.ts} language="typescript" />
      </TabsContent>
      <TabsContent value="js">
        <CodeBlock code={code.js} language="javascript" />
      </TabsContent>
    </Tabs>
  );
};
export default CodeTabs;
