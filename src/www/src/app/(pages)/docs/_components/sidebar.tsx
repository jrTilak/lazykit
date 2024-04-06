import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import navLinks from "@/configs/nav-links.json";
import types from "@/configs/types.json";
import Link from "next/link";
const Sidebar = () => {
  return (
    <aside className="shadow-lg h-full">
      <ScrollArea className="h-full w-full p-6 pl-8">
        {navLinks.map((navLink, i) => {
          if (navLink.links) {
            return (
              <Accordion key={i} type="single" collapsible>
                <AccordionItem value={navLink.heading}>
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-lg">{navLink.heading}</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex gap-2 flex-col">
                    {navLink.links.map((link, i) => {
                      return (
                        <Link
                          key={i}
                          href={link.url}
                          className="block hover:underline text-base text-muted-foreground hover:text-foreground transition-colors w-fit"
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                    {types.map((link, i) => {
                      return (
                        <Link
                          key={i}
                          href={link.url}
                          className="block hover:underline text-base text-muted-foreground hover:text-foreground transition-colors w-fit"
                        >
                          {link.label}
                        </Link>
                      );
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
                        return (
                          <Link
                            key={i}
                            href={link.url}
                            className="block hover:underline text-base text-muted-foreground hover:text-foreground transition-colors w-fit"
                          >
                            {link.label}
                          </Link>
                        );
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
