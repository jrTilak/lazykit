"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { useRouter } from "next/navigation";
import navLinks from "@/configs/nav-links.json";
import { File, FunctionSquare } from "lucide-react";

const SearchPopup = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setOpen(true);
      }
    });
    return () => {
      window.removeEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "/") {
          e.preventDefault();
          setOpen(true);
        }
      });
    };
  });

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>/
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {navLinks.map((navLink, i) => {
            if (navLink.links) {
              return (
                <CommandGroup key={i} heading={navLink.heading}>
                  {navLink.links?.map((link, i) => {
                    return (
                      <CommandItem
                        key={i}
                        onSelect={() => runCommand(() => router.push(link.url))}
                        className="flex gap-3"
                      >
                        <File className="w-4 h-4" />
                        {link.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            } else {
              return (
                <Fragment key={i}>
                  {navLink.categories.map((category, i) => {
                    return (
                      <Fragment key={i}>
                        <CommandSeparator />
                        <CommandGroup key={i} heading={category.label}>
                          {category.methods.map((method, i) => {
                            return (
                              <CommandItem
                                key={i}
                                onSelect={() =>
                                  runCommand(() => router.push(method.url))
                                }
                                className="flex gap-3"
                              >
                                <FunctionSquare className="w-4 h-4" />
                                {method.label}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Fragment>
                    );
                  })}
                </Fragment>
              );
            }
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};
export default SearchPopup;
