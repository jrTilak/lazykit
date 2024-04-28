"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeBlock from "./code-block";
import { Lang, useLang } from "@/providers/lang-provider";

interface ICodeTabs {
  code: {
    ts: string;
    js: string;
  };
}

const CodeTabs = ({ code }: ICodeTabs) => {
  const { lang, setLang } = useLang();

  return (
    <Tabs
      defaultValue={lang === "js" ? "js" : "ts"}
      onValueChange={(value) => setLang(value as Lang)}
    >
      <TabsList>
        <TabsTrigger value="ts">
          <span>Typescript</span>
          {lang === "ts" && (
            <img
              src="https://www.svgrepo.com/show/374146/typescript-official.svg"
              alt=""
              className="h-5 w-5 ml-3"
            />
          )}
        </TabsTrigger>
        <TabsTrigger value="js">
          <span>Javascript</span>
          {lang === "js" && (
            <img
              src="https://www.svgrepo.com/show/349419/javascript.svg"
              alt=""
              className="h-5 w-5 ml-3"
            />
          )}
        </TabsTrigger>
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
