// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "attic",
      head: [
        {
          tag: "script",
          attrs: {
            src: "https://www.googletagmanager.com/gtag/js?id=G-GHQMK5GWQP",
            async: true,
          },
        },
        {
          tag: "script",
          content: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-GHQMK5GWQP');`,
        },
      ],
      components: {
        Footer: "./src/components/Footer.astro",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/lmmendes/attic",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Installation", slug: "installation" },
            { label: "Configuration", slug: "options" },
          ],
        },
        {
          label: "Guides",
          items: [
            { label: "Authentication", slug: "guides/authentication" },
            { label: "Storage", slug: "guides/storage" },
            { label: "Reverse Proxy", slug: "guides/reverse-proxy" },
            { label: "Import Plugins", slug: "guides/import-plugins" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      customCss: ["./src/styles/style.css"],
    }),
  ],
});
