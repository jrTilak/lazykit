"use client"
import React, { ReactElement, useEffect, useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import HighlightCode from "./highlight-code"
import Loading from "../loaders/loading"
import { extractImports } from "@/helpers/extract-imports"
import { removeDefaultExport } from "@/helpers/remove-default-export"
import registry from '@/configs/registry.json'
import { LiveProvider, LiveError, LivePreview, LiveEditor } from "react-live";

type Props = {
  children: React.ReactNode
}
type Lang = "html" | "css" | "js"
const VanillaSandbox = ({ children }: Props) => {
  const [selectedLang, setSelectedLang] = useState<Lang>("html")
  const [html, setHtml] = useState<string>("");
  const [css, setCss] = useState<string>('');
  const [js, setJs] = useState<string>('');
  const [jsCodeWithImportedBlockRemoved, setJsCodeWithImportedBlockRemoved] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true)
  const [code, setCode] = useState("")


  if (!children) {
    throw new Error("children of VanillaSandbox cannot be empty")
  }

  useEffect(() => {
    const fn = async () => {

      (children as Array<ReactElement>).map((c) => {
        const code = c.props.code
        switch (c.props.language) {
          case "html":
            setHtml(code)
            break;
          case "js":
            setJs(code)
            break;
          case "javascript":
            setJs(code)
            break;
          case "css":
            setCss(code)
            break;
          default:
            throw new Error("unknown language detected, only html, css and js are supported")
        }
        setIsLoading(false)
      })
    }
    fn()
  }, [children])

  useEffect(() => {
    if (!js) return
    const { cleanedCode, imports } = extractImports(js)

    const codeWithImportedMethods = `
    ${imports.map((i) => removeDefaultExport(registry.find((r) => r.name === i)?.code.js ?? "")).join("\n")}
    ${cleanedCode}
    `
    setJsCodeWithImportedBlockRemoved(codeWithImportedMethods)
  }, [js])

  useEffect(() => {
    let code = `
    <div class="w-full h-fit border border-muted-foreground/40 rounded-md p-4">

    `
    if (css) {
      code += `
        <style>
          ${css}
        </style>
      `
    }

    code += `
        ${html}
      `
    if (jsCodeWithImportedBlockRemoved) {
      code += `
        <script>
        ${jsCodeWithImportedBlockRemoved}
        </script>
        `
    }
    code += `
      </div>
      `
    setCode(code)

  }, [html, css, jsCodeWithImportedBlockRemoved])

  return (
    <div className="my-6 flex flex-col gap-2.5">
      {
        isLoading ?
          <Loading className="min-h-40 rounded-md bg-muted" />
          :
          <>
            <Tabs
              defaultValue={"html"}
              onValueChange={(value) => setSelectedLang(value as Lang)}
              value={selectedLang}
            >
              <TabsList>
                <TabsTrigger value="html">
                  <span>HTML</span>
                  {selectedLang === "html" && (
                    <Image
                      src="https://www.svgrepo.com/show/452228/html-5.svg"
                      alt=""
                      className="h-5 w-5 ml-3"
                      height={20}
                      width={20}
                    />
                  )}
                </TabsTrigger>
                {css &&
                  <TabsTrigger value="js">
                    <span>Javascript</span>
                    {selectedLang === "css" && (
                      <Image
                        src="https://www.svgrepo.com/show/452185/css-3.svg"
                        alt=""
                        className="h-5 w-5 ml-3"
                        height={20}
                        width={20}
                      />
                    )}
                  </TabsTrigger>
                }
                {js &&
                  <TabsTrigger value="js">
                    <span>Javascript</span>
                    {selectedLang === "js" && (
                      <Image
                        src="https://www.svgrepo.com/show/452045/js.svg"
                        alt=""
                        className="h-5 w-5 ml-3"
                        height={20}
                        width={20}
                      />
                    )}
                  </TabsTrigger>
                }
              </TabsList>
              <TabsContent value="html">
                <HighlightCode code={html?.trim()} language="html" />
              </TabsContent>
              {css &&
                <TabsContent value="css">
                  <HighlightCode code={css?.trim()} language="css" />
                </TabsContent>
              }
              {js &&
                <TabsContent value="js">
                  <HighlightCode code={js?.trim()} language="js" />
                </TabsContent>
              }
            </Tabs>
            <span className="text-xs text-muted-foreground">
              Live preview coming soon!
            </span>
            {/* preview */}
            {/* <div className="flex flex-col gap-4">
              <span className="text-lg font-semibold">
                Preview:
              </span>
            </div> */}
          </>
      }
    </div>
  )
}
export default VanillaSandbox