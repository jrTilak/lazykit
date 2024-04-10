import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import navLinks from "@/configs/nav-links.json";
import types from "@/configs/types.json";
import SidebarLink from "./sidebar-link";
import { META_DATA } from "@/data/metadata";
import Link from "next/link";
import Image from "next/image";
const Sidebar = () => {
  return (
    <aside className="shadow-lg h-full">
      <ScrollArea className="h-full w-full p-6 pl-8">
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
          return (
            <Accordion key={i} type="single" collapsible>
              {/* <span className="text-md font-semibold text-muted-foreground">
                {navLink.heading}
              </span> */}
              {navLink.categories.map((category, i) => {
                return (
                  <AccordionItem key={i} value={category.label}>
                    <AccordionTrigger className="hover:no-underline">
                      <span className="text-lg">{category.label}</span>
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
          );
        })}
      </ScrollArea>
    </aside>
  );
};
export default Sidebar;
