---
title: "REST API"
description: "API reference for attic's REST endpoints"
---

attic provides a full REST API for managing assets, categories, locations, and more. Interactive API documentation is available via Swagger UI at `/api/docs` on your attic instance.

## Base URL

All API endpoints are relative to your attic instance URL:

```
https://attic.yourdomain.com
```

## Authentication

API requests support personal bearer API keys and authenticated browser sessions. Agents, harnesses, and scripts can use scoped keys without keeping a browser session.

### Bearer API keys

Create a key in **Profile → API keys** and send it on each request:

```shell
curl -H "Authorization: Bearer $ATTIC_API_KEY" \
  'https://attic.example.com/api/assets?limit=20&offset=0'
```

Permissions are checked per resource against the key owner’s current role and workspace features. Write access includes read; structured POST searches require asset read access. Importing requires both plugin write and asset write access. Explicit invalid Authorization credentials fail even when a session cookie is present. See [API Keys](/guides/api-keys/) for creation, expiry, revocation, and the permission catalog.

### Browser sessions

Authenticate by calling the local login endpoint, then include the session cookie in subsequent requests. Key management, user creation, password changes, and password resets require interactive account authentication and cannot use a bearer key.

```shell
# Login (session cookie is returned)
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "your-password"}' \
  -c cookies.txt

# Use the session cookie in subsequent requests
curl http://localhost:8080/api/assets -b cookies.txt
```

## Personal API Keys

All key management endpoints require an interactive account session and apply only to the current user’s keys.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/me/api-keys/permissions` | List permissions available to the current role |
| `GET` | `/api/me/api-keys` | List active keys and usage metadata |
| `POST` | `/api/me/api-keys` | Create a key; returns its secret once |
| `PATCH` | `/api/me/api-keys/:id` | Update the description only |
| `DELETE` | `/api/me/api-keys/:id` | Revoke a key |

See [key management request fields](/guides/api-keys/#key-management-endpoints).

## MCP Server

Agents and harnesses connect to `/mcp` using stateless Streamable HTTP with `Authorization: Bearer <your-api-key>` on every request. An administrator must enable MCP first. A key is required even when browser authentication is disabled.

MCP tools share REST permissions and feature gates, while discovery returns only tools available to that connection. See [MCP & Agent Integration](/guides/mcp/) for configuration, supported tools, argument formats, and REST-only operations.

## Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Log in with email and password |
| `POST` | `/auth/logout` | Log out and invalidate session |
| `GET` | `/auth/session` | Get current session info |
| `GET` | `/auth/mode` | Get authentication mode (oidc/local/disabled) |
| `GET` | `/auth/oidc/login` | Initiate OIDC login flow |
| `GET` | `/auth/oidc/callback` | OIDC callback handler |
| `GET` | `/auth/oidc/logout` | OIDC logout |

## Assets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/assets` | List assets (supports pagination, search, and filters) |
| `POST` | `/api/assets` | Create a new asset |
| `POST` | `/api/assets/search` | Search with structured criteria |
| `PATCH` | `/api/assets/:id/parent` | Move into another asset, or detach with `parent_id: null` |
| `GET` | `/api/assets/:id` | Get asset details |
| `PUT` | `/api/assets/:id` | Update an asset |
| `DELETE` | `/api/assets/:id` | Delete an asset (soft delete) |
| `GET` | `/api/assets/stats` | Get asset statistics |

### Asset Fields

Assets support the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Asset name (required) |
| `description` | string | Asset description |
| `category_id` | uuid | Category UUID (optional) |
| `location_id` | uuid | Location UUID |
| `condition_id` | uuid | Condition UUID |
| `quantity` | integer | Quantity (1-1,000,000, defaults to 1) |
| `parent_id` | uuid or null | Containing asset; null detaches an existing asset |
| `collection_ids` | uuid[] | Collections assigned to the asset |
| `tag_ids` | uuid[] | Existing tags assigned to the asset |
| `new_tag_names` | string[] | Tags to create and assign |
| `notes` | string | Personal notes about the asset |
| `purchase_at` | datetime | Purchase date |
| `purchase_price` | number | Purchase price |
| `purchase_note` | string | Notes about the purchase |
| `attributes` | object | Custom attributes (JSON) |

### Query Parameters for `GET /api/assets`

| Parameter | Description |
|-----------|-------------|
| `offset` | Number of results to skip (default 0) |
| `limit` | Number of results (default 20, maximum 100) |
| `q` | Full-text search across names and descriptions |
| `attribute_q` | Case-insensitive search across visible attribute values and option labels |
| `category_id` | Filter by category UUID including descendants, or `uncategorized` |
| `location_id` | Filter by location UUID |
| `condition_id` | Filter by condition UUID |
| `collection_id` | Filter by collection UUID |
| `tag_id` | Filter by tag UUID; repeat for multiple tags (maximum 50) |
| `tag_match` | Match `any` (default) or `all` selected tags |
| `parent_id` | List direct contents of an asset |
| `descendant_of` | List nested contents; mutually exclusive with `parent_id` |
| `exclude_subtree_of` | Exclude an asset and its descendants |
| `exclude_ancestors_of` | Exclude an asset and its ancestors |

Responses from asset listing and structured search contain `assets`, `total`, `limit`, and `offset`. See [Search & Saved Filters](/guides/search/#search-through-the-api) for a structured request example and expression limits.

When updating an asset, `add_child_ids` and `remove_child_ids` can stage contents changes alongside the other fields. Contained assets use their parent’s location. See [asset contents](/guides/inventory/#assets-inside-other-assets) for movement and deletion behavior.

## Saved Filters

Saved filters belong to the authenticated user. Other users, including administrators, cannot access them.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/saved-filters` | List personal saved filters and validation issues |
| `POST` | `/api/saved-filters` | Create a filter with `name`, `criteria`, and optional `pinned` |
| `GET` | `/api/saved-filters/:id` | Get a personal filter |
| `PUT` | `/api/saved-filters/:id` | Update name, criteria, or pinned state |
| `DELETE` | `/api/saved-filters/:id` | Delete a personal filter |

Create and update requests require a `name` of 1–100 characters. Include the current name when changing only criteria or pinned state. Up to five filters can be pinned. Invalid saved criteria must be repaired before use; renaming can omit `criteria`.

## Collections and Tags

Collections and tags are shared within the workspace and require their respective features to be enabled. Assign them through the asset’s `collection_ids` and `tag_ids` fields.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/collections` | List collections |
| `POST` | `/api/collections` | Create a collection |
| `GET` | `/api/collections/:id` | Get a collection |
| `PUT` | `/api/collections/:id` | Update a collection |
| `DELETE` | `/api/collections/:id` | Delete a collection, preserving assets |
| `GET` | `/api/tags` | List tags |
| `POST` | `/api/tags` | Create a tag with a name and optional description |
| `GET` | `/api/tags/:id` | Get a tag |
| `PUT` | `/api/tags/:id` | Update a tag |
| `DELETE` | `/api/tags/:id` | Delete a tag, preserving assets |

## Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | List all categories |
| `POST` | `/api/categories` | Create a category |
| `GET` | `/api/categories/:id` | Get category details |
| `PUT` | `/api/categories/:id` | Update a category |
| `DELETE` | `/api/categories/:id` | Delete a category (soft delete) |
| `GET` | `/api/categories/asset-counts` | Get asset count per category |

## Locations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/locations` | List all locations |
| `POST` | `/api/locations` | Create a location |
| `GET` | `/api/locations/:id` | Get location details |
| `PUT` | `/api/locations/:id` | Update a location |
| `DELETE` | `/api/locations/:id` | Delete a location |

### Location Photos

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/locations/:id/photos` | List gallery photos, cover first |
| `POST` | `/api/locations/:id/photos` | Upload one photo using multipart field `file` |
| `PUT` | `/api/locations/:id/photos/:photoId/cover` | Set the cover photo |
| `DELETE` | `/api/locations/:id/photos/:photoId/cover` | Unset the cover without deleting the photo |
| `DELETE` | `/api/locations/:id/photos/:photoId` | Delete one photo |

Uploads accept JPEG, PNG, or GIF up to 10 MiB and 40 megapixels. Location responses include an optional cover `photo_url`. Gallery responses include photo ID, filename, cover status, creation time, and URL. Refresh data to renew S3 URLs after their 15-minute lifetime. See [location galleries](/guides/inventory/#locations-and-photo-galleries).

## Conditions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/conditions` | List all conditions |
| `POST` | `/api/conditions` | Create a condition |
| `GET` | `/api/conditions/:id` | Get condition details |
| `PUT` | `/api/conditions/:id` | Update a condition |
| `DELETE` | `/api/conditions/:id` | Delete a condition |

## Warranties

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/warranties` | List all warranties |
| `GET` | `/api/warranties/expiring` | List expiring warranties |
| `GET` | `/api/assets/:id/warranty` | Get warranty for an asset |
| `POST` | `/api/assets/:id/warranty` | Create warranty for an asset |
| `PUT` | `/api/assets/:id/warranty` | Update warranty for an asset |
| `DELETE` | `/api/assets/:id/warranty` | Delete warranty for an asset |

## Attachments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/assets/:id/attachments` | List attachments for an asset |
| `POST` | `/api/assets/:id/attachments` | Upload a file attachment |
| `GET` | `/api/attachments/:attachmentId` | Get attachment download URL |
| `DELETE` | `/api/attachments/:attachmentId` | Delete an attachment |
| `PUT` | `/api/assets/:id/main-image/:attachmentId` | Set the primary image |
| `DELETE` | `/api/assets/:id/main-image` | Clear the primary image |

## Asset History Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/assets/:id/events` | List custom history events |
| `POST` | `/api/assets/:id/events` | Create a custom event |
| `PUT` | `/api/assets/:id/events/:eventId` | Replace a custom event |
| `DELETE` | `/api/assets/:id/events/:eventId` | Delete a custom event |

Create and update bodies contain `title` (1–255 characters), `description` (up to 2,000 characters), `icon` (a Lucide icon name such as `i-lucide-wrench`), and `occurred_at` (an RFC3339 timestamp). These endpoints manage custom events; the UI also displays the asset’s creation and latest update timestamps.

## Attributes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/attributes` | List all attribute definitions |
| `POST` | `/api/attributes` | Create an attribute definition |
| `GET` | `/api/attributes/:id` | Get attribute details |
| `PUT` | `/api/attributes/:id` | Update an attribute |
| `DELETE` | `/api/attributes/:id` | Delete an attribute |
| `POST` | `/api/attributes/:id/impact-preview` | Preview the impact of an attribute change |
| `GET` | `/api/attributes/:id/options` | List select options |
| `POST` | `/api/attributes/:id/options` | Add a select option |
| `PATCH` | `/api/attributes/:id/options/:option_id` | Update a select option |
| `DELETE` | `/api/attributes/:id/options/:option_id` | Delete a select option |
| `PUT` | `/api/attributes/:id/options/order` | Reorder select options |

## Import Plugins

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/plugins` | List available import plugins |
| `GET` | `/api/plugins/:pluginId` | Get plugin details |
| `GET` | `/api/plugins/:pluginId/search` | Search plugin (query params: `field`, `q`) |
| `POST` | `/api/plugins/:pluginId/import` | Import data from plugin |

See [Import Plugins](/guides/import-plugins/) for credentials and authenticated examples, including Rebrickable’s `rebrickable_sets` and `rebrickable_minifigs` sources. The import endpoint accepts `external_id` and creates the asset immediately.

## Workspace Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/organization/features` | Read feature switches |
| `PUT` | `/api/organization/features` | Replace all feature switches (admin only) |
| `GET` | `/api/organization/settings` | Read workspace preferences |
| `PUT` | `/api/organization/settings` | Set the workspace currency (admin only) |
| `GET` | `/api/organization/settings/currencies` | List supported currency codes |
| `GET` | `/api/organization/mcp` | Read whether MCP is enabled |
| `PUT` | `/api/organization/mcp` | Enable or disable MCP with `{"enabled":true}` (admin only) |

See [Workspace Settings](/guides/workspace-settings/) for request requirements. Feature endpoints return 404 when their feature is disabled, and disabled fields are hidden or rejected in asset operations. Disabling a feature retains its stored data.

## Current User

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/me` | Get current user info |
| `PUT` | `/api/auth/password` | Change own password |

## User Management (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List all users |
| `POST` | `/api/users` | Create a user |
| `GET` | `/api/users/:id` | Get user details |
| `PUT` | `/api/users/:id` | Update a user |
| `DELETE` | `/api/users/:id` | Delete a user |
| `POST` | `/api/users/:id/reset-password` | Reset user password |

## Health & System

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Basic health check |
| `GET` | `/ready` | Readiness check |
| `GET` | `/api/docs` | Interactive Swagger UI documentation |
| `GET` | `/api/openapi.yaml` | OpenAPI 3.0 specification |

## Swagger UI

For detailed request/response schemas, visit the interactive API documentation at:

```
https://attic.yourdomain.com/api/docs
```

This provides a full Swagger UI where you can explore endpoints, view request/response bodies, and test API calls directly from your browser.
