---
title: "Import Plugins"
description: "Import assets from external sources like Google Books, TMDB, BoardGameGeek, and IGDB"
---

attic includes a plugin system that lets you import asset metadata from external sources. Plugins automatically create categories, set up custom attributes, and fetch cover images.

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
- Genres, runtime, rating
- Cast and crew
- Poster and backdrop images

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

## Using Plugins

### Importing Assets

1. Navigate to **Assets** in the web interface
2. Click **Add Asset**
3. Select the **Import** tab
4. Choose a plugin from the dropdown
5. Search for the item you want to import
6. Select the item from the results
7. Review the imported data and save

### How Plugins Work

When Attic starts, it creates the category and custom fields for every enabled plugin. This lets you
review and customize the category before importing anything. When you import an asset:

- The plugin reuses its category (e.g., "Books", "Movies", "Board Games", or "Video Games")
- The asset receives the plugin's custom metadata (e.g., ISBN for books or runtime for movies)
- The asset is created with all metadata populated
- **Cover images** are downloaded and attached automatically

Category initialization is safe to run again whenever Attic restarts. Existing plugin categories are
reused and user changes are preserved.

## Plugin Endpoints

Plugins are also accessible via the REST API:

```shell
# List available plugins
curl http://localhost:8080/api/plugins

# Get plugin details
curl http://localhost:8080/api/plugins/google-books

# Search for items
curl "http://localhost:8080/api/plugins/google-books/search?field=title&q=dune"

# Import an item
curl -X POST http://localhost:8080/api/plugins/google-books/import \
  -H "Content-Type: application/json" \
  -d '{"external_id": "book-id-here"}'
```
