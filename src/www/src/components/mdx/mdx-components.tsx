import { cn } from "@/helpers/cn";
import Link from "next/link";
import { Separator } from "../ui/separator";
import React, { ReactElement } from "react";
import * as  Alert from "../ui/alert";
import * as Icons from "lucide-react";
import * as Table from "../ui/table";
import JSExecutor from "../globals/js-executor";
import { extractTextFromElement } from "@/helpers/extract-text-from-element";
import { generateHeadingId } from "@/helpers/generate-headingId";
import HighlightCode from "../globals/highlight-code";
import CodePreview from "../globals/code-preview";
import PropsTable from "../globals/props-table";
import VanillaSandbox from "../globals/vanilla-sandbox";
import * as Examples from "./examples"
import { Button } from "../ui/button";
import { ComponentPreview } from "../globals/component-preview";

export const MDXComponents = {
  JSExecutor,
  ...Alert,
  ...Icons,
  ...Table,
  Button,
  CodePreview,
  PropsTable,
  VanillaSandbox,
  Examples,
  ComponentPreview,
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      id={generateHeadingId(extractTextFromElement(props.children))}
      className={cn("mt-2 scroll-m-20 text-4xl font-bold", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      id={generateHeadingId(extractTextFromElement(props.children))}
      className={cn(
        "mt-12 scroll-m-20 pb-2 border-b text-2xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      id={generateHeadingId(extractTextFromElement(props.children))}
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  a: ({
    className,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Link
      href={href ?? "#"}
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn("my-3 ml-6 list-disc text-muted-foreground", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn("my-3 ml-6 list-decimal text-muted-foreground", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn("mt-2 text-muted-foreground", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <Separator className="my-4 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto rounded-lg">
      <table
        className={cn("w-full overflow-hidden rounded-lg", className)}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("m-0 border-t p-0", className)} {...props} />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-base tracking-wide font-fira-code",
        className
      )}
      {...props}
    />
  ),
  pre: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement> & {
    wrapButton?: boolean;
  }) => {
    const regex = /language-([^"]+)/;
    let match = props.className?.match(regex);
    if (!match) {
      match = (children as ReactElement)?.props?.className?.match(regex);
    }
    const lang = match ? match[1] : "js";
    const code = (
      (children as ReactElement)?.props?.children as string
    )?.trim();

    const regexToCheckExecutor = /^\s*"use js-executor"\s*;?/
    if (regexToCheckExecutor.test(code)) {
      const codeToExecute = code.replace(regexToCheckExecutor, "").trim();
      return <JSExecutor code={codeToExecute} />;
    }

    return <HighlightCode language={lang} code={code} {...props} />;
  },
};
