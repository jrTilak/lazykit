//@ts-nocheck
import * as fs from "fs";

const PATH_TO_REGISTRY = "../registry.json";

const GETTING_STARTED = {
  heading: "Getting Started",
  links: [
    {
      label: "Introduction",
      url: "/docs/",
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

const PATH_TO_NAVBAR = "../../components/navbar/navLinks.json";

export const generateNavbar = () => {
  try {
    console.log("Generating navbar... 🚀");
    const registry = JSON.parse(fs.readFileSync(PATH_TO_REGISTRY, "utf-8"));
    const availableTypes = Object.keys(registry);

    //add the types to the navbar as array
    const types = availableTypes.map((type) => ({
      label: type[0].toUpperCase() + type.slice(1),
      url: `/docs/${type}/introduction`,
    }));

    //add the types to the main navbar
    const navbar = {
      gettingStarted: {
        heading: GETTING_STARTED.heading,
        links: [...GETTING_STARTED.links, ...types],
      },
    };

    //add each types with its categories  and methods to the navbar
    availableTypes.forEach((type) => {
      const categories = Object.keys(registry[type]);
      const typeObj = {
        heading: type[0].toUpperCase() + type.slice(1),
        categories: categories.map((category) => ({
          label: category[0].toUpperCase() + category.slice(1),
          url: `/docs/${type}/${category}/introduction`,
          methods: registry[type][category].methods.map((method) => ({
            label: method.name,
            url: `/docs/${type}/${category}/${method.param}`,
          })),
        })),
      };
      navbar[type] = typeObj;
    });

    //write the navbar to the file
    fs.writeFileSync(PATH_TO_NAVBAR, JSON.stringify(navbar, null, 2));
    console.log("Navbar generated 🎉\n");
  } catch (error) {
    console.error("Error generating navbar 💀");
    console.error(error);
    process.exit(1);
  }
};
