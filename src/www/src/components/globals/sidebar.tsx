"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import navLinks from "@/.generated/nav-links.json";
import types from "@/.generated/types.json";
import SidebarLink from "./sidebar-link";
import { META_DATA } from "@/data/metadata";
import Link from "next/link";
import Image from "next/image";
import { capitalCase } from "change-case";
import { useParams } from "next/navigation";

const Sidebar = () => {
  const { slug } = useParams() as {
    slug: string[]
  }
  const heading = capitalCase(slug ? slug[0] : "");
  return (
    <aside className="shadow-lg h-full">
      <div className="h-[calc(100vh-100px)] w-full p-6 pl-8 scrollbar-sm overflow-x-hidden overflow-y-auto">
        <Link href="/" className="lg:hidden gap-3 items-center flex">
          <Image src="/logo.svg" alt="logo" width={60} height={24} />
          <h2 className="text-sm">{META_DATA.title as string}</h2>
        </Link>
        {navLinks.map((navLink, i) => {
          if (navLink.links) {
            return (
              <Accordion
                key={i}
                type="single"
                collapsible
                defaultValue={navLink.heading}
              >
                <AccordionItem value={navLink.heading}>
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-lg">{navLink.heading}</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex gap-2 flex-col">
                    {navLink.links.map((link, i) => {
                      return <SidebarLink key={i} link={link} />;
                    })}
                    {types.map((link, i) => {
                      return <SidebarLink key={i} link={link} />;
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          }
          if (navLink.heading === heading) {
            return (
              <Accordion key={i} type="single" collapsible>
                {/* <span className="text-md font-semibold text-muted-foreground">
                {navLink.heading}
              </span> */}
                {navLink.categories.map((category, i) => {
                  return (
                    <AccordionItem key={i} value={category.label}>
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-lg">{capitalCase(category.label)}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        {category.methods.map((link, i) => {
                          return <SidebarLink key={i} link={link} />;
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )
          }
        })}
      </div>
    </aside >
  );
};
export default Sidebar;
