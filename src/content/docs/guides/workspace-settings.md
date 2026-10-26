---
title: "Workspace Settings"
description: "Choose optional inventory features and the shared currency used for asset prices."
---

Administrators can open **Settings** to choose which features are available to the household and set its currency. These settings are stored in the database and apply to everyone in the workspace.

## Choose inventory features

Toggle the features you want and click **Save features**:

- Locations
- Collections
- Tags
- Categories & attributes
- Conditions
- Warranties
- Plugins

Categories and attributes share one switch. Turning off a feature hides its interface and prevents access through its feature endpoints while retaining its data for later re-enabling. This can keep a simple inventory focused without deleting existing organization or metadata.

Plugin credentials are configured separately through [server environment variables](/options/#import-plugins). Enabling **Plugins** makes imports available, while each catalog still needs its required credentials. The **Import sources** page shows configured sources and setup details.

## Set the currency

Under **General settings**, choose the currency used for asset purchase prices and value summaries, then save the section.

Changing the currency **relabels existing prices without converting their amounts**. For example, changing from USD to EUR leaves a stored price of 100 as 100 and displays it in EUR. Choose the household’s intended currency before recording purchase prices.

## Enable MCP for agents

Open **Settings → Integrations** and enable **MCP server** to allow agent and harness connections. It is disabled by default and is stored independently of the inventory feature switches. Disabling MCP blocks subsequent MCP requests while leaving REST access available.

Each member creates a personal key in **Profile → API keys** and finds connection instructions in **Profile → MCP connection**. Follow [MCP & Agent Integration](/guides/mcp/) for endpoint and client configuration, and [API Keys](/guides/api-keys/) for resource permissions.

## API access

Authenticated users can read feature settings, general settings, and available currency codes. Updating feature or general settings requires an administrator session.

- `GET` / `PUT /api/organization/features`: read or replace the feature map. A replacement includes all eight boolean keys: `locations`, `collections`, `tags`, `categories`, `attributes`, `conditions`, `warranties`, and `plugins`. Attic keeps `attributes` aligned with `categories`.
- `GET` / `PUT /api/organization/settings`: read or update general settings using a body such as `{"currency":"EUR"}`.
- `GET /api/organization/settings/currencies`: retrieve the supported currency codes.
- `GET` / `PUT /api/organization/mcp`: read or change the independent MCP switch using `{"enabled":true}`.

See [authentication](/guides/authentication/) for login setup and [configuration](/options/) for server options.
