import { HEADER_LINKS } from "@/data/header-links";
import { META_DATA } from "@/data/metadata";
import Image from "next/image";
import Link from "next/link";
import ToggleSidebarButton from "./ToggleSidebarButton";

const Header = () => {
  return (
    <header className="w-full shadow-lg z-50">
      <nav
        className="flex justify-between items-center w-full mx-auto"
        style={{
          padding: "0.5rem 2rem",
        }}
      >
        <div className="flex gap-5 items-center">
          <ToggleSidebarButton />
          <Link href="/" className="flex gap-3 items-center">
            <Image src="/logo.svg" alt="logo" width={80} height={32} />
            <span>{META_DATA.title}</span>
          </Link>
          <div className="md:flex gap-4 items-center hidden">
            {HEADER_LINKS.map((link, index) => (
              <Link key={index} href={link.href} target={link.target}>
                {link.title}
              </Link>
            ))}
          </div>
        </div>
        <div>Other</div>
      </nav>
    </header>
  );
};
export default Header;