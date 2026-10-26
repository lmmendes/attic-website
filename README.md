# Attic website

The documentation and product website for [Attic](https://github.com/lmmendes/attic), an open-source, self-hosted home inventory application. The site explains how Attic helps individuals and households catalog their belongings, remember where items are stored, and keep receipts, warranties, and other useful details together.

## Requirements

- [Bun](https://bun.sh/) (v1 or higher)

## Setup

Install dependencies:

```bash
bun install
```

## Development

Run the dev server:

```bash
bun run dev
```

The site will be available at `http://localhost:4321`.

## Production build

Build and preview the static site:

```bash
bun run build
bun run preview
```

Product messaging lives in `src/content/docs/index.mdx`; installation and configuration documentation lives in `src/content/docs/`.


## Keeping documentation current

Check feature behavior against the Attic source before updating content. Verify the checkout is current with merged `origin/main`, including recently merged integrations:

- `attic/README.md` summarizes supported workflows.
- `attic/backend/internal/plugin/` defines catalog sources, credentials, and imported fields.
- `attic/backend/internal/handler/operations.go` defines authenticated REST routes, permission requirements, and MCP tools; `cmd/server/main.go` wires authentication and transport. Handler request types define accepted fields.
- `attic/frontend/app/pages/` and `components/` define the user-facing labels and workflows.

These paths are relative to the parent workspace containing both repositories. Add new guide pages under `src/content/docs/guides/` and register them in `astro.config.mjs`. Update the homepage, configuration reference, and API reference when a feature affects them. Run `bun run build` to validate the content and generate the static site.
