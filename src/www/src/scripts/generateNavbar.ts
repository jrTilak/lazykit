import {
  INavLink,
  INavLinkForPrevNextButton,
  IRegistryJSON,
} from "@/types/registry.types";
import { capitalCase } from "change-case";
import * as fs from "fs";

const PATH_TO_REGISTRY = "../configs/registry.json";
const PATH_TO_NAVBAR = "../configs/nav-links.json";
const PATH_TO_PREV_NEXT_BUTTON_LINKS = "../configs/prev-next-button-links.json";
const PATH_TO_TYPES = "../configs/types.json";

const NAV_LINKS_FOR_PREV_NEXT_BUTTON: INavLinkForPrevNextButton[] = [];

/**
 * Some links that are always present in the navbar
 */
const GETTING_STARTED = {
  heading: "Getting Started",
  links: [
    {
      label: "Introduction",
      url: "/docs/introduction",
    },
    {
      label: "CLI",
      url: "/docs/cli",
    },
    {
      label: "Installation",
      url: "/docs/cli#installation",
    },
    {
      label: "lazykit.config.json",
      url: "/docs/lazykit-config",
    },

    {
      label: "Changelog",
      url: "/docs/changelog",
    },
  ],
};

export const generateNavbar = () => {
  try {
    console.log("Generating navbar... 🚀");
    /**
     * Read the registry.json file
     * This file contains all the methods and their details
     */
    const registry: IRegistryJSON[] = JSON.parse(
      fs.readFileSync(PATH_TO_REGISTRY, "utf-8")
    );

    /**
     * Get all the types available in the registry
     * This will be used to generate the navbar
     */
    const availableTypesArr = registry.map((method) => method.type);
    //@ts-ignore
    // Remove duplicates and sort alphabetically
    const availableTypes = [...new Set(availableTypesArr)].sort();
    /**
     *
     * Navbar links
     */
    const NAV_LINKS: INavLink[] = [
      {
        heading: GETTING_STARTED.heading,
        links: [...GETTING_STARTED.links],
      },
    ];
    const TYPES: INavLink["links"] = [];

    NAV_LINKS_FOR_PREV_NEXT_BUTTON.push(...GETTING_STARTED.links);

    //write the navbar to the file
    availableTypes.forEach((type) => {
      /**
       * Add this type to the navbar in top section
       */
      const typeName = capitalCase(type);
      TYPES.push({
        label: typeName,
        url: `/docs/${type}`,
      });
      NAV_LINKS_FOR_PREV_NEXT_BUTTON.push({
        label: typeName,
        url: `/docs/${type}`,
      });

      const categoriesArr = registry
        .filter((method) => method.type === type)
        .map((method) => method.category);
      //@ts-ignore
      // Remove duplicates and sort alphabetically
      const categories = [...new Set(categoriesArr)].sort();
      const link: INavLink = {
        heading: capitalCase(type),
        categories: categories.map((category) => {
          const methods = registry.filter(
            (method) => method.type === type && method.category === category
          );
          return {
            label: category[0].toUpperCase() + category.slice(1),
            url: `/docs/${type}/${category}`,
            methods: methods.map((method) => {
              const data = {
                label: method.name,
                url: `/docs/${type}/${category}/${method.name}`,
              };
              NAV_LINKS_FOR_PREV_NEXT_BUTTON.push(data);
              return data;
            }),
          };
        }),
      };
      NAV_LINKS.push(link);
    });

    fs.writeFileSync(PATH_TO_TYPES, JSON.stringify(TYPES, null, 2));
    fs.writeFileSync(PATH_TO_NAVBAR, JSON.stringify(NAV_LINKS, null, 2));
    fs.writeFileSync(
      PATH_TO_PREV_NEXT_BUTTON_LINKS,
      JSON.stringify(NAV_LINKS_FOR_PREV_NEXT_BUTTON, null, 2)
    );
    console.log("Navbar generated 🎉\n");
  } catch (error) {
    console.error("Error generating navbar 💀");
    console.error(error);
    process.exit(1);
  }
};
