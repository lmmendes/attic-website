---
title: "MCP & Agent Integration"
description: "Connect agents, assistants, and harnesses to Attic with scoped API keys over Streamable HTTP."
---

Attic’s Model Context Protocol (MCP) server lets agents and harnesses discover inventory tools and use them with permissions you choose. An assistant can find belongings, browse locations, record changes, or import catalog entries when its key allows those operations.

The server uses **stateless Streamable HTTP** at `/mcp`. It authenticates every request with a personal bearer API key.

## Enable the server

An administrator opens **Settings → Integrations**, enables **MCP server**, and saves the setting. MCP is disabled by default. This switch is independent of the inventory feature switches and does not require an environment variable.

Every member can open **Profile → MCP connection** to check availability and copy the endpoint, Authorization header template, and connection configuration. If these controls are missing, upgrade to an Attic build that includes API keys and MCP and apply its database migrations; migration 34 adds this support.

## Connect an agent or harness

1. Create a [personal API key](/guides/api-keys/) under **Profile → API keys**. Choose the resources the agent needs; asset read access is sufficient for asset listing and search.
2. Open the MCP server settings in your agent or harness.
3. Select **Streamable HTTP** and enter your public Attic URL followed by `/mcp`, for example `https://attic.example.com/mcp`.
4. Configure the header `Authorization: Bearer <your-api-key>` and save the connection.
5. Connect and refresh tool discovery. Ask the agent to find an item in your inventory to check the connection.

For clients that accept an `mcpServers` object with URL and header fields, the configuration is:

```json
{
  "mcpServers": {
    "attic": {
      "url": "https://attic.example.com/mcp",
      "headers": {
        "Authorization": "Bearer <your-api-key>"
      }
    }
  }
}
```

Replace the URL and key placeholder with your instance and saved secret. Configuration formats vary by client; use its remote MCP connection fields if it does not accept this JSON shape. Attic provides neither OAuth login nor a stdio transport. Your client must support a remote Streamable HTTP server and bearer headers.

## Tools and permissions

Tool discovery reflects the key’s permissions, its owner’s current role, and enabled workspace features. Attic checks authorization again when a tool is called.

| Task | Examples and required access |
|------|------------------------------|
| Find inventory | `list_assets`, `search_assets`, and `get_asset` need asset read access |
| Create or edit inventory | `create_asset` and `update_asset` need asset write access |
| Organize belongings | Location, collection, category, tag, and condition tools use their respective resource permissions |
| Keep records | Warranty, attachment, asset event, and personal saved filter tools use their respective permissions |
| Import from a catalog | Plugin discovery and search need plugin read access; importing needs plugin write and asset write access |
| Administer the workspace | User and organization tools require the appropriate permissions and administrator role for administrative actions |

The server also exposes attribute and select-option tools, impact previews, asset statistics, main-image operations, and MCP status tools. Authentication, sessions, password operations, user creation, and API key management are excluded. Location photo galleries, general currency settings, and the dedicated asset-parent endpoint are REST-only.

For a read-only assistant, try “Find my camera and tell me where it is stored.” With asset write permission, an assistant can also create or edit an inventory entry. The available tools are the ones returned by discovery for that connection.

## Tool arguments and results

Tools use REST path parameter names at the top level, an optional `query` object, and a `body` matching the REST request schema. For example, arguments to `get_asset` are:

```json
{ "id": "<asset-uuid>" }
```

Arguments to `create_asset` are:

```json
{ "body": { "name": "Camera", "quantity": 1 } }
```

Query values are strings; repeated `tag_id` values may be passed as an array. Results preserve REST status and response details in the shape `{"status":200,"body":...}`. Failed REST operations are marked as MCP tool errors.

For `upload_attachment`, supply the asset `id` and a `body` containing `filename`, `content_type`, base64 `content`, and optional `description`. Decoded files are limited to 50 MiB; MCP requests are limited to 72 MiB. Attachment reads return metadata and a download URL.

For attribute changes that require confirmation, first call `preview_attribute_impact`, then pass its `confirmation_token` as the top-level `impact_token` argument to the confirmed change.

## Availability and troubleshooting

- **401 / invalid API key:** check the bearer header, expiry, and revocation. MCP requires a key even when browser authentication is disabled; a browser session alone is insufficient.
- **404 / MCP is disabled:** an administrator must enable the server in **Settings → Integrations**.
- **Missing tools or forbidden operations:** check resource permissions, the key owner’s current role, and workspace feature switches. Reconnect or refresh discovery after changes.
- **Connection cannot reach Attic:** use an instance URL reachable from the harness and ensure your [reverse proxy](/guides/reverse-proxy/) forwards `/mcp` and Authorization headers. Host and origin protections remain enabled.

Revoke a key from **Profile → API keys** to stop that integration. Disabling the MCP server blocks subsequent MCP requests while leaving REST API access available.
