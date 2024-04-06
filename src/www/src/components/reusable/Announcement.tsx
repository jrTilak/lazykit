import Link from "next/link";
import { ArrowRightIcon, Blocks, LucideIcon } from "lucide-react";
import { Separator } from "../ui/separator";

type AnnouncementProps = {
  url: string;
  icon: LucideIcon;
  title: string;
};

export function Announcement({ url, icon: Icon, title }: AnnouncementProps) {
  return (
    <Link
      href={url}
      className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium hover:shadow-sm transition-all"
    >
      <Icon className="h-4 w-4" />{" "}
      <Separator className="mx-2 h-4" orientation="vertical" />{" "}
      <span>{title}</span>
      <ArrowRightIcon className="ml-1 h-4 w-4 relative" />
    </Link>
  );
}
