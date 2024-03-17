import { INavLink, IRegistryJSON } from "@/types/registry.types";
import * as fs from "fs";

const PATH_TO_REGISTRY = "../configs/registry.json";

const GETTING_STARTED = {
  heading: "Getting Started",
  links: [
    {
      label: "Introduction",
      url: "/docs/getting-started",
    },
    {
      label: "Installation",
      url: "/docs/installation",
    },
    {
      label: "Usage",
      url: "/docs/usage",
    },
    {
      label: "lazykit.config.json",
      url: "/docs/lazykit-config",
    },
    {
      label: "CLI",
      url: "/docs/cli",
    },
    {
      label: "Changelog",
      url: "/docs/changelog",
    },
  ],
};

const PATH_TO_NAVBAR = "../configs/nav-links.json";

export const generateNavbar = () => {
  try {
    console.log("Generating navbar... 🚀");
    const registry: IRegistryJSON[] = JSON.parse(
      fs.readFileSync(PATH_TO_REGISTRY, "utf-8")
    );
    const availableTypes = registry.map((method) => method.type);

    //add the types to the navbar as array
    const types = availableTypes.map((type) => ({
      label: type[0].toUpperCase() + type.slice(1),
      url: `/docs/${type}/introduction`,
    }));

    //add the types to the main navbar
    const NAV_LINKS: INavLink[] = [
      {
        heading: GETTING_STARTED.heading,
        links: [...GETTING_STARTED.links, ...types],
      },
    ];

    //write the navbar to the file
    availableTypes.forEach((type) => {
      const categories = registry
        .filter((method) => method.type === type)
        .map((method) => method.category);
      const link: INavLink = {
        heading: type[0].toUpperCase() + type.slice(1),
        categories: categories.map((category) => {
          const methods = registry.filter(
            (method) => method.type === type && method.category === category
          );
          return {
            label: category[0].toUpperCase() + category.slice(1),
            url: `/docs/${type}/${category}`,
            methods: methods.map((method) => ({
              label: method.name,
              url: `/docs/${type}/${category}/${method.name}`,
            })),
          };
        }),
      };
      NAV_LINKS.push(link);
    });

    fs.writeFileSync(PATH_TO_NAVBAR, JSON.stringify(NAV_LINKS, null, 2));
    console.log("Navbar generated 🎉\n");
  } catch (error) {
    console.error("Error generating navbar 💀");
    console.error(error);
    process.exit(1);
  }
};
