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
