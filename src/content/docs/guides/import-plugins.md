---
title: "Import Plugins"
description: "Import assets from external sources like Google Books, TMDB, and BoardGameGeek"
---

attic includes a plugin system that lets you import asset metadata from external sources. Plugins automatically create categories, set up custom attributes, and fetch cover images.

## Available Plugins

### Google Books

Search and import books by title, author, or ISBN. Imported data includes:

- Title, author, publisher
- ISBN, page count, publication date
- Description and cover image
- Language and categories

No API key is required for Google Books.

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

No API key is required for BoardGameGeek.

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

When you import an asset through a plugin:

- A **category** is created automatically if it doesn't exist (e.g., "Books", "Movies", "Board Games")
- **Custom attributes** are created for the category based on the plugin's data model (e.g., ISBN for books, runtime for movies)
- The asset is created with all metadata populated
- **Cover images** are downloaded and attached automatically

Subsequent imports using the same plugin reuse the existing category and attributes.

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
