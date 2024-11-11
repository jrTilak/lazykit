import { Metadata } from "next";
import { CREATOR_INFO, PACKAGE_INFO } from "./info";

export const META_DATA: Metadata = {
  title: PACKAGE_INFO.name,
  description: PACKAGE_INFO.description,
  authors: [
    {
      name: CREATOR_INFO.username,
      url: CREATOR_INFO.github,
    },
  ],
  creator: CREATOR_INFO.name,
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg",
    },
  ],
  category: "Web Development",
  keywords: [
    "javascript",
    "typescript",
    "lazykit",
    "jrtilak/lazykit",
    "@jrtilak/lazykit",
    "utility functions",
    "javascript utility functions",
    "typescript utility functions",
    "lazykit utility functions",
    "jrtilak/lazykit utility functions",
    "copy paste utility functions",
    "Modular code integration",
    "Customizable functions",
    "Developer productivity",
    "Code efficiency",
    "JavaScript libraries",
    "TypeScript libraries",
    "Code optimization",
    "Developer tools",
    "react-hooks",
    "react",
    "hooks",
    "react hooks",
    "reactjs",
    "usehooks",
    "use hooks ts",
    "use hooks js",
    "usehooks ts",
    "hooks ts",
    "hooks js",
  ],
};
