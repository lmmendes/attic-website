---
title: "Import Plugins"
description: "Import assets from external sources like Google Books, TMDB, BoardGameGeek, IGDB, and Rebrickable"
---

Attic includes a plugin system that lets you import asset metadata from external sources. Plugins automatically create categories, set up custom attributes, and fetch cover images.

## Available Plugins

### Google Books

Search and import books by title, author, or ISBN. Imported data includes:

- Title, author, publisher
- ISBN, page count, publication date
- Description and cover image
- Language and categories

Google Books can work without a key, but unauthenticated requests may hit Google's shared quota.
For a reliable self-hosted setup, create a key in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. Create or select a Google Cloud project.
2. Open **APIs & Services → Library**, find **Books API**, and enable it.
3. Open **APIs & Services → Credentials**, choose **Create credentials → API key**.
4. Copy the key and add it to your Attic environment:

```shell
ATTIC_GOOGLE_BOOKS_API_KEY=your-api-key
```

Because Attic calls Google from the server, configure server/IP restrictions rather than browser
HTTP-referrer restrictions when restricting the key.

### TMDB (The Movie Database)

Search and import movies and TV series. Imported data includes:

- Title, overview, release date
- Genres and rating
- Original language and status
- Movie runtime, tagline, budget, and revenue
- TV first/last air dates, season and episode counts
- Poster image

**Requires an API key.** Register for a free API key at [themoviedb.org](https://www.themoviedb.org/settings/api) and set:

```shell
ATTIC_TMDB_API_KEY=your-api-key
```

### BoardGameGeek

Search and import board games. Imported data includes:

- Title, description, year published
- Designer, publisher
- Player count, playing time
- Complexity rating and cover image

**Requires an application key.** Sign in to BoardGameGeek and create an application from the
[BoardGameGeek applications page](https://boardgamegeek.com/applications). After the application is
approved, copy its API key and set:

```shell
ATTIC_BGG_API_KEY=your-api-key
```

BoardGameGeek may require a short review period before the key becomes usable. Follow the
[BoardGameGeek XML API guidance](https://boardgamegeek.com/using_the_xml_api) and its terms when
publishing or sharing an integration.

### IGDB (Video Games)

Search and import video games from the Internet Game Database (IGDB). Imported data includes:

- Title, description, and cover image
- Platform-specific release dates and release year
- Genres, themes, game modes, and player perspectives
- Developers, publishers, game type, and release status
- IGDB rating, age rating, and source URL

**Requires a Twitch application.** IGDB uses Twitch's client-credentials flow, so both a Client ID
and Client Secret are required:

1. Open the [Twitch Developer Console](https://dev.twitch.tv/console/apps).
2. Register an application and copy its **Client ID** and **Client Secret**.
3. Add both values to the Attic environment and restart the server:

```shell
ATTIC_IGDB_CLIENT_ID=your-twitch-client-id
ATTIC_IGDB_CLIENT_SECRET=your-twitch-client-secret
```

Keep the Client Secret private. Attic exchanges it for a short-lived IGDB access token and stores
the token only in memory. Search results include platform-specific releases so you can select the
edition that matches the game you own.

### Rebrickable (LEGO Sets and Minifigures)

Import individual LEGO sets and minifigures from the Rebrickable catalog. One API key enables two sources:

| Source | Category | Plugin ID |
|--------|----------|-----------|
| Rebrickable LEGO Sets | LEGO Sets | `rebrickable_sets` |
| Rebrickable Minifigures | LEGO Minifigures | `rebrickable_minifigs` |

**Requires an API key.** Create a free [Rebrickable account and API key](https://rebrickable.com/api/), add the key to your Attic server environment, and restart Attic:

```shell
ATTIC_REBRICKABLE_API_KEY=your-api-key
```

For Docker Compose, pass the variable to the Attic service. A `.env` entry alone only supplies values for interpolation; the service must reference it:

```yaml
services:
  attic:
    environment:
      - ATTIC_REBRICKABLE_API_KEY=${ATTIC_REBRICKABLE_API_KEY}
```

Open **Import sources** and choose **Rebrickable LEGO Sets** or **Rebrickable Minifigures**. Search by **Name** or **Catalog Number**. Catalog numbers must be complete, including the variant suffix: for example, `75192-1` for a set or `fig-000001` for a minifigure.

Each selection creates one asset with quantity one. Imported details include the name, image when available, catalog number, piece count, and Rebrickable URL. Sets also include the release year when available. Edit the asset afterward to add its location, condition, purchase details, or quantity.

Both sources share a limit of one catalog request per second. Attic honors throttle cooldowns without automatically retrying failed requests; try again later if the service is unavailable. If a source still needs setup, check that the key reaches the server environment and restart Attic. Rebrickable can also reject an invalid key.

This workflow imports individual catalog entries. It does not synchronize a Rebrickable account, bulk-import a collection, import part inventories, or automatically import the minifigures included in a set.

## Using Plugins

### Importing Assets

1. Open **Assets** and click **Import**, or open **Import sources** and choose a configured source.
2. Choose the catalog and search field, then enter at least two characters.
3. Search and select the item that matches what you own.
4. Attic creates the asset immediately with the imported metadata and available cover image.
5. Open the asset to review and edit its details.

The **Import sources** page separates configured catalogs from providers that need setup and shows their required credentials. An administrator must enable **Plugins** in [workspace settings](/guides/workspace-settings/) for imports to be available.

### How Plugins Work

When Attic starts, it creates the category and custom fields for every enabled plugin. This lets you
review and customize the category before importing anything. When you import an asset:

- The plugin reuses its category (e.g., "Books", "Movies", "Board Games", "Video Games", "LEGO Sets", or "LEGO Minifigures")
- The asset receives the plugin's custom metadata (e.g., ISBN for books or runtime for movies)
- The asset is created with all metadata populated
- **Cover images** are downloaded and attached automatically

Category initialization is safe to run again whenever Attic restarts. Existing plugin categories are
reused and user changes are preserved.

## Plugin Endpoints

Plugins are also accessible via the REST API. First [authenticate and save a session cookie](/reference/api/#authentication); the examples below reuse `cookies.txt`:

```shell
# List available plugins
curl -b cookies.txt http://localhost:8080/api/plugins

# Get plugin details
curl -b cookies.txt http://localhost:8080/api/plugins/google_books

# Search for items
curl -b cookies.txt "http://localhost:8080/api/plugins/google_books/search?field=title&q=dune"

# Import an item
curl -b cookies.txt -X POST http://localhost:8080/api/plugins/google_books/import \
  -H "Content-Type: application/json" \
  -d '{"external_id": "book-id-here"}'
```

For example, search the LEGO sets catalog by its complete number:

```shell
curl -b cookies.txt \
  "http://localhost:8080/api/plugins/rebrickable_sets/search?field=catalog_number&q=75192-1"

curl -b cookies.txt -X POST http://localhost:8080/api/plugins/rebrickable_sets/import \
  -H "Content-Type: application/json" \
  -d '{"external_id":"75192-1"}'
```
