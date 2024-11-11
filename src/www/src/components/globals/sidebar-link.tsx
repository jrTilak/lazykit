"use client";
import { cn } from "@/helpers/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarLink = ({ link }: { link: { url: string; label: string } }) => {
  const pathname = usePathname();
  return (
    <Link
      href={link.url}
      className={cn(
        "block hover:underline text-base text-muted-foreground hover:text-foreground transition-colors w-fit",
        pathname === link.url && "text-foreground underline"
      )}
    >
      {link.label}
    </Link>
  );
};
export default SidebarLink;
