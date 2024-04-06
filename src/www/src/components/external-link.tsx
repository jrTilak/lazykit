import Link from "next/link";
import React from "react";
import { Badge } from "./ui/badge";
import { ExternalLinkIcon } from "lucide-react";

type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const ExternalLink: React.FC<ExternalLinkProps> = ({
  children,
  href,
  target = "_blank",
  ...props
}) => {
  return (
    <Link href={href as string} target={target} {...props}>
      <Badge variant="secondary" className="inline-flex gap-2 rounded">
        {children}
        <ExternalLinkIcon size={12} />
      </Badge>
    </Link>
  );
};

export default ExternalLink;
