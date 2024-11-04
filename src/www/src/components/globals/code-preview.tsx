"use client"
import registry from '@/.generated/registry'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lang, useLang } from '@/providers/lang-provider'
import Image from 'next/image'
import HighlightCode from './highlight-code'
import { useState } from 'react'
import { IRegistryJSON } from '@/types/registry.types'


type Props = {
  methodName: string
}
const CodePreview = ({ methodName }: Props) => {
  //@ts-expect-error
  const method: IRegistryJSON = registry[methodName]
  const [lang, setLang] = useState<Lang>()

  if (!method) return null
  return (
    <Tabs
      defaultValue={lang || "ts"}
      onValueChange={(value) => setLang(value as Lang)}
      value={lang}
    >
      <TabsList>
        <TabsTrigger value="ts">
          <span>Typescript</span>
          {lang === "ts" && (
            <Image
              src="https://www.svgrepo.com/show/374146/typescript-official.svg"
              alt=""
              className="h-5 w-5 ml-3"
              height={20}
              width={20}
            />
          )}
        </TabsTrigger>
        <TabsTrigger value="js">
          <span>Javascript</span>
          {lang === "js" && (
            <Image
              src="https://www.svgrepo.com/show/349419/javascript.svg"
              alt=""
              className="h-5 w-5 ml-3"
              height={20}
              width={20}
            />
          )}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ts">
        <HighlightCode code={method.code.ts.trim()} language="typescript" />
      </TabsContent>
      <TabsContent value="js">
        <HighlightCode code={method.code.js.trim()} language="javascript" />
      </TabsContent>
    </Tabs>
  )
}
export default CodePreview