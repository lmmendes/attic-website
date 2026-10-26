// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://getattic.dev",
  integrations: [
    starlight({
      title: "Attic",
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
            { label: "Organize Your Inventory", slug: "guides/inventory" },
            { label: "Search & Saved Filters", slug: "guides/search" },
            { label: "Workspace Settings", slug: "guides/workspace-settings" },
            { label: "Authentication", slug: "guides/authentication" },
            { label: "Storage", slug: "guides/storage" },
            { label: "Reverse Proxy", slug: "guides/reverse-proxy" },
            { label: "Import Plugins", slug: "guides/import-plugins" },
            { label: "API Keys", slug: "guides/api-keys" },
            { label: "MCP & Agent Integration", slug: "guides/mcp" },
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
