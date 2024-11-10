"use client"
import React, { Suspense } from 'react'
import Loading from '../loaders/loading'
import registry from "@/.generated/registry"
import HighlightCode from './highlight-code'
import dynamic from 'next/dynamic'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { IRegistryJSON } from '@/types/registry.types'

type Props = {
  methodName: string
  exampleName: string
}

export const ComponentPreview = ({ exampleName, methodName }: Props) => {
  const example: IRegistryJSON["examples"][string] = registry[methodName]?.examples[exampleName]

  if (!example) {
    return <div className='my-2 text-destructive'>Component not found {methodName} - {exampleName}, Try building registry</div>
  }
  return (
    <Tabs defaultValue="preview">
      <TabsList className='mt-5'>
        <TabsTrigger value="code">
          Code - TSX
        </TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="code">
        <HighlightCode code={example.code.tsx} language='tsx' />
      </TabsContent>
      <TabsContent value="preview" className='mt-4'>
        <div className="w-full h-fit min-h-32 shadow-inner border rounded-lg bg-muted/40 p-4">
          <Suspense fallback={<Loading className='w-full h-32' />}>
            <example.component />
          </Suspense >
        </div>
      </TabsContent>
    </Tabs>

  )

}