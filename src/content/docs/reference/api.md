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

API requests require an authenticated session. Authenticate by calling the login endpoint first, then include the session cookie in subsequent requests.

```shell
# Login (session cookie is returned)
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "your-password"}' \
  -c cookies.txt

# Use the session cookie in subsequent requests
curl http://localhost:8080/api/assets -b cookies.txt
```

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
| `category_id` | uuid | Category UUID (required) |
| `location_id` | uuid | Location UUID |
| `condition_id` | uuid | Condition UUID |
| `quantity` | integer | Quantity (1-1,000,000, defaults to 1) |
| `notes` | string | Personal notes about the asset |
| `purchase_at` | datetime | Purchase date |
| `purchase_price` | number | Purchase price |
| `purchase_note` | string | Notes about the purchase |
| `attributes` | object | Custom attributes (JSON) |

### Query Parameters for `GET /api/assets`

| Parameter | Description |
|-----------|-------------|
| `page` | Page number for pagination |
| `limit` | Number of items per page |
| `search` | Full-text search query |
| `category_id` | Filter by category UUID |
| `location_id` | Filter by location UUID |
| `condition_id` | Filter by condition UUID |

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

## Attributes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/attributes` | List all attribute definitions |
| `POST` | `/api/attributes` | Create an attribute definition |
| `GET` | `/api/attributes/:id` | Get attribute details |
| `PUT` | `/api/attributes/:id` | Update an attribute |
| `DELETE` | `/api/attributes/:id` | Delete an attribute |

## Import Plugins

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/plugins` | List available import plugins |
| `GET` | `/api/plugins/:pluginId` | Get plugin details |
| `GET` | `/api/plugins/:pluginId/search` | Search plugin (query params: `field`, `q`) |
| `POST` | `/api/plugins/:pluginId/import` | Import data from plugin |

## User Management (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/me` | Get current user info |
| `PUT` | `/api/auth/password` | Change own password |
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
