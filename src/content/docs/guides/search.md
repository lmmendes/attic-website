---
title: "Search & Saved Filters"
description: "Find assets with attribute searches, nested advanced filters, and private saved searches."
---

Open **Assets** to search names and descriptions and filter by category, location, condition, collection, or tags. Category filters include assets in descendant categories. Tag filters can match any or all selected tags.

## Search attribute values

Use **Search attribute values** for a case-insensitive substring search across active, visible custom attributes. It searches stored values and dropdown option labels, rather than attribute names or internal option IDs. Characters such as `%`, `_`, and backslashes are treated literally.

For example, searching for `Commodore` finds assets with that value in a custom field even if their names do not contain the word. Attribute search combines with the other page filters using AND.

## Build an advanced filter

Open **Advanced filter** to add rules and nested groups:

1. Choose a field and a comparison supported by that field’s type.
2. Enter a value or choose options where required.
3. Use **Match all** (AND) when every rule must match, or **Match any** (OR) when one matching rule is enough.
4. Add groups to combine those choices, then apply the draft to see the results.

For example, combine a location rule with a **Match any** group for two platforms to find games stored in one room for either platform.

| Field type | Comparisons |
|------------|-------------|
| Text | Equals, contains |
| Number or date | Comparisons and inclusive ranges |
| Boolean | True or false |
| Dropdown | Any selected option; multiple-choice fields also support all |
| Collection membership | Any or all selected collections |
| Any attribute | Empty or not empty |

Missing values, null, empty strings, and empty arrays count as empty. Zero and false count as values. Page filters, quick attribute search, and advanced rules combine using AND.

## Save and pin a search

Save a draft as a new named filter to reuse it later. Applying changes does not automatically overwrite an existing saved filter: explicitly update it when you want to retain the edited criteria. Saved searches exclude pagination.

Saved filters are private to their owner, including from workspace administrators. Pin up to **five** as desktop sidebar shortcuts. Use the saved filter’s menu to pin or unpin it.

If a referenced category, option, or other entity is deleted, or an attribute changes incompatibly, repair the affected rules before applying the saved filter. Renames preserve references through stable IDs. You can still rename a saved filter while its rules need repair.

## Search through the API

For a quick attribute search, call `GET /api/assets?attribute_q=Commodore`. Use `q` for names and descriptions, and `limit` and `offset` for pagination.

Structured searches use `POST /api/assets/search`. After [saving an authenticated session](/reference/api/#authentication), try:

```shell
curl -b cookies.txt -X POST http://localhost:8080/api/assets/search \
  -H 'Content-Type: application/json' \
  -d '{
    "criteria": {
      "version": 1,
      "expression": {
        "kind": "group",
        "match": "all",
        "children": [
          { "kind": "rule", "field": "attribute_q", "operator": "contains", "value": "Commodore" },
          { "kind": "rule", "field": "q", "operator": "search", "value": "computer" }
        ]
      }
    },
    "limit": 20,
    "offset": 0
  }'
```

Create a saved filter with `POST /api/saved-filters` and a body containing `name` and `criteria`. Update it with `PUT /api/saved-filters/{id}`; omitting `criteria` allows a rename without changing the rules. Include the current `name` when updating `criteria` or setting `pinned` to true or false to manage its shortcut. GET and list responses include `issues` identifying invalid rules by path.

Expressions allow five group levels, 50 total rules, and 100 values per membership rule. JSON request bodies are limited to 64 KiB. The bundled OpenAPI document at `/api/docs` contains the complete wire format; see the [API reference](/reference/api/) for endpoint summaries.
