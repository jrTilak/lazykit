// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightRosePine from "starlight-theme-rose-pine";

export default defineConfig({
  site: "https://lazykit.thapatilak.com.np",
  integrations: [
    starlight({
      title: "LazyKit",
      description:
        "A personal collection of copyable TypeScript utilities and React hooks.",
      favicon: "/logo.svg",
      logo: {
        src: "./src/assets/logo.svg",
      },
      customCss: [
        "@fontsource-variable/outfit",
        "@fontsource-variable/jetbrains-mono",
        "./src/styles/fonts.css",
      ],
      expressiveCode: {
        themes: ["rose-pine", "rose-pine-dawn"],
      },
      components: {
        PageTitle: "./src/components/PageTitle.astro",
      },
      plugins: [starlightRosePine()],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/jrTilak/lazykit",
        },
      ],
      sidebar: [
        {
          label: "Start here",
          items: [
            { label: "Overview", slug: "index" },
            { label: "Getting started", slug: "getting-started" },
          ],
        },
        {
          label: "Functions",
          items: [
            { label: "All functions", slug: "functions" },
            { autogenerate: { directory: "functions" } },
          ],
        },
      ],
    }),
  ],
});
