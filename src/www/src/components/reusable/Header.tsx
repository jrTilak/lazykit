import { HEADER_LINKS } from "@/data/header-links";
import { META_DATA } from "@/data/metadata";
import Image from "next/image";
import Link from "next/link";
import ToggleSidebarButton from "./ToggleSidebarButton";
import types from "@/configs/types.json";
import SearchPopup from "./SearchPopup";
import { GITHUB_INFO, TWITTER_INFO } from "@/data/info";
import githubIcon from "@/assets/icons/github-142-svgrepo-com.svg";
import X from "@/assets/icons/x.svg";
import ToggleTheme from "./ToggleTheme";

const Header = () => {
  return (
    <header className="w-full shadow-lg z-50 h-14 flex items-center justify-center">
      <nav className="flex justify-between items-center w-full mx-auto px-3 lg:px-12 py-1">
        <div className="flex items-center gap-6">
          <ToggleSidebarButton />
          <Link href="/" className="lg:flex gap-3 items-center hidden ">
            <Image src="/logo.svg" alt="logo" width={80} height={32} />
            <h2>{META_DATA.title as string}</h2>
          </Link>
          <div className="items-center text-sm hidden md:flex gap-3">
            {HEADER_LINKS.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target={link.target}
                className="text-gray-600 hover:text-muted-foreground transition-all hover:underline"
              >
                {link.title}
              </Link>
            ))}
            {types.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="text-gray-600 hover:text-muted-foreground transition-all hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex gap-4 items-center min-w-max w-80">
          <SearchPopup />
          <Link
            href={GITHUB_INFO.url}
            target="_blank"
            className="hover:scale-105 transition-all opacity-80 hover:opacity-100"
          >
            <Image
              src={githubIcon}
              alt="Github"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </Link>
          <Link
            target="_blank"
            href={TWITTER_INFO.url}
            className="hover:scale-105 transition-all opacity-80 hover:opacity-100"
          >
            <Image
              src={X}
              alt="Twitter"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </Link>
          <ToggleTheme />
        </div>
      </nav>
    </header>
  );
};
export default Header;
