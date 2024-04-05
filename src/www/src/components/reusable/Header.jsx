import { HEADER_LINKS } from "@/data/header-links";
import { META_DATA } from "@/data/metadata";
import Image from "next/image";
import Link from "next/link";
import ToggleSidebarButton from "./ToggleSidebarButton";
import types from "@/configs/types.json";
import SearchPopup from "./SearchPopup";

const Header = () => {
  return (
    <header className="w-full shadow-lg z-50">
      <nav
        className="flex justify-between items-center w-full mx-auto"
        style={{
          padding: "0.5rem 2rem",
        }}
      >
        <div
          className="flex items-center"
          style={{
            gap: "1rem",
          }}
        >
          <ToggleSidebarButton />
          <Link href="/" className="flex gap-3 items-center">
            <Image src="/logo.svg" alt="logo" width={80} height={32} />
            <h2>{META_DATA.title}</h2>
          </Link>
          <div
            className="items-center text-sm"
            style={{
              gap: "1rem",
              display: "flex",
            }}
          >
            {HEADER_LINKS.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target={link.target}
                className="text-gray-400 hover:text-muted-foreground transition-all hover:underline"
              >
                {link.title}
              </Link>
            ))}
            {types.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                target={link.target}
                className="text-gray-400 hover:text-muted-foreground transition-all hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <SearchPopup />
        </div>
      </nav>
    </header>
  );
};
export default Header;
