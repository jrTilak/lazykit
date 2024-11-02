import Sidebar from "@/components/globals/sidebar";
import OnThisPage from "../_components/on-this-page";
import PrevNext from "../_components/prev-next";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRightIcon } from "lucide-react";


export default function DocsLayout({
  children,
  params: { slug },
}: Readonly<{
  children: React.ReactNode;
  params: { slug: string[] };
}>) {
  return (
    <section className="grid grid-cols-12 h-full gap-6 lg:gap-12 overflow-hidden">
      <div
        id="sidebar"
        className="hidden lg:block lg:col-span-3 absolute lg:static h-[calc(100vh-40px)] lg:h-full w-[250px] lg:w-auto bg-background lg:bg-inherit z-40 lg:z-auto -translate-x-full lg:translate-x-0 transition-transform"
      >
        <Sidebar />
      </div>
      <main
        id="main-content"
        className="col-span-12 px-4 sm:px-6 md:px-12 lg:px-0 lg:col-span-7 flex flex-col h-full py-6 lg:py-12 gap-6 overflow-y-scroll"
      >
        <Breadcrumb>
          <BreadcrumbList>
            {
              ["Docs", ...slug].map((s, index) => (
                <BreadcrumbItem key={index}>
                  {
                    index !== 0 &&
                    <BreadcrumbSeparator>
                      <ChevronRightIcon />
                    </BreadcrumbSeparator>
                  }
                  <BreadcrumbLink href={`/${["docs", ...slug].slice(0, index + 1).join("/")}`}>{s}</BreadcrumbLink>
                </BreadcrumbItem>
              ))
            }
          </BreadcrumbList>
        </Breadcrumb>
        {children}
        <PrevNext />
      </main>
      <div className="col-span-2 h-full hidden lg:block">
        <OnThisPage slug={slug.join("/")} />
      </div>
    </section>
  );
}
