---
title: "API Keys"
description: "Create scoped personal API keys for scripts, agents, and integrations with Attic’s REST API and MCP server."
---

Personal API keys let scripts, agents, and harnesses access Attic on your behalf. The same key works with the [REST API](/reference/api/) and the [MCP server](/guides/mcp/). Each key has its own resource permissions and optional expiration date.

## Create a key

1. Open your account menu and choose **Profile → API keys**.
2. Give the key a description that identifies its integration.
3. For each resource, choose no access, read, or read-write access.
4. Optionally set an expiration date, then create the key.
5. Save the secret when it appears. Attic displays it **only once** and stores its SHA-256 hash.

Start with asset read access for an assistant that only finds belongings. Add other resources as needed: for example, location read access for browsing locations, or asset write access for creating and editing inventory. Write access includes read access.

The key acts with the intersection of its granted permissions, your current role, and enabled workspace features. Regular members cannot grant attribute-definition writes, user administration, or organization-setting writes. The creation form shows the permissions available to your role.

## Use a key with REST

Make the saved secret available to your integration as `ATTIC_API_KEY`, then send it in the Authorization header on each request:

```shell
curl -H "Authorization: Bearer $ATTIC_API_KEY" \
  'https://attic.example.com/api/assets?limit=20&offset=0'
```

`ATTIC_API_KEY` is an example client-side variable for your script or harness; it is not a server configuration option. Attic creates personal keys through Profile.

Searches need asset **read** access, including structured searches that use POST:

```shell
curl -H "Authorization: Bearer $ATTIC_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"criteria":{"version":1,"q":"camera"},"limit":20}' \
  https://attic.example.com/api/assets/search
```

## Resource permissions

The permissions object uses these resource names:

| Resource | Covers |
|----------|--------|
| `assets` | Asset details, listing, search, statistics, and changes |
| `locations` | Locations and their REST photo galleries |
| `collections`, `tags`, `conditions` | Their respective inventory organization features |
| `categories`, `attributes` | Categories, attribute definitions, and select options |
| `warranties` | Warranty records and overviews |
| `attachments` | Asset attachments and main images |
| `asset_events` | Custom asset history events |
| `saved_filters` | The key owner’s personal saved filters |
| `plugins` | Import source discovery, catalog searches, and imports |
| `users` | User administration available to administrators |
| `organization` | Workspace features, settings, and MCP status |

Use `read` or `write` for granted resources and omit resources with no access. For example, `{"assets":"read","locations":"read"}` allows reading assets and locations. Importing an asset requires **both** `plugins: write` and `assets: write`.

Keys cannot manage API keys, create users, change passwords, or reset passwords. Those operations require interactive account authentication. Administrators can read and change other workspace settings only when both their role and the key’s permissions allow it.

## Manage and revoke keys

In **Profile → API keys**, review active keys and their last-used times, edit descriptions, or delete a key to revoke it. Changing a key’s permissions or expiration requires creating a replacement key. A revoked or expired key no longer authenticates requests.

Keys belong to their owner. Administrators see active-key counts and the most recent use of active keys in the People list, while key details and deletion remain private to the owner. Authorization checks use the owner’s current role and workspace on every request.

An explicitly invalid Authorization header fails even when a valid browser cookie is also present or browser authentication is disabled. Remove a stale header when returning to session-based access.

## Key management endpoints

These endpoints require an interactive account session, such as the cookie from [local login](/reference/api/#browser-sessions). A bearer key cannot call them.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/me/api-keys/permissions` | Get the permission catalog for the current role |
| `GET` | `/api/me/api-keys` | List your active keys and usage metadata |
| `POST` | `/api/me/api-keys` | Create a key; the response includes the one-time `secret` |
| `PATCH` | `/api/me/api-keys/:id` | Change only the description |
| `DELETE` | `/api/me/api-keys/:id` | Revoke your key |

Creation accepts a `description` of 1–255 characters, a nonempty `permissions` object, and optional `expires_at` as a future RFC3339 timestamp. For example:

```json
{
  "description": "Inventory assistant",
  "permissions": { "assets": "read", "locations": "read" }
}
```

To connect an agent through MCP rather than direct REST calls, follow [MCP & Agent Integration](/guides/mcp/).
