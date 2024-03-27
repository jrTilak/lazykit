import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import navLinks from "@/configs/nav-links.json";
import Link from "next/link";
const Sidebar = () => {
  return (
    <aside className="shadow-lg">
      <ScrollArea className="h-full w-full flex flex-col gap-4">
        {navLinks.map((navLink, i) => {
          if (navLink.links) {
            return (
              <Accordion key={i} type="single" collapsible>
                <AccordionItem value={navLink.heading}>
                  <AccordionTrigger>
                    <span className="p-4">{navLink.heading}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {navLink.links.map((link, i) => {
                      return (
                        <Link
                          key={i}
                          href={link.url}
                          className="p-4 block hover:bg-gray-100"
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
              <span>{navLink.heading}</span>
              {navLink.categories.map((category, i) => {
                return (
                  <AccordionItem key={i} value={category.label}>
                    <AccordionTrigger>
                      <span className="p-4">{category.label}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {category.methods.map((link, i) => {
                        return (
                          <Link
                            key={i}
                            href={link.url}
                            className="p-4 block hover:bg-gray-100"
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
