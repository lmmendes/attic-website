---
title: "Organize Your Inventory"
description: "Use categories, collections, tags, nested assets, location photos, and history to organize your belongings."
---

Start with **Assets → Add Asset** to record a belonging, or use **Import** to bring in details from a [supported catalog](/guides/import-plugins/). Add a name, quantity, description, and any purchase information you want to keep. Attach receipts, manuals, and photos from the asset detail page.

## Choose how to organize

| Feature | Use it for | Example |
|---------|------------|---------|
| Categories | Classifying an asset and defining its custom fields | Electronics → Computers |
| Locations | Recording where something is stored | Office → Cupboard → Top shelf |
| Collections | Grouping related assets regardless of location | Retro computers |
| Tags | Adding flexible labels across your inventory | Needs repair, On loan |
| Asset contents | Recording assets physically inside another asset | A toolbox containing a drill |

Administrators can enable or disable optional features in [workspace settings](/guides/workspace-settings/).

## Categories and custom attributes

Create nested categories to describe different kinds of belongings. Child categories inherit their ancestors’ custom fields, so a field defined on **Electronics** can also appear on **Computers**. Filtering by a category includes assets in its descendant categories.

Custom attributes support text, numbers, booleans, dates, URLs with optional display text, and configurable single- or multiple-choice selections. Use fields such as serial number, storage capacity, or platform to capture details beyond the standard asset form. Select fields let you manage and reorder their options.

## Locations and photo galleries

Create nested locations that follow your rooms, shelves, cupboards, and boxes. Open a location’s **Photos** tab to add pictures of the space and make it easier to recognize later.

- Choose several files or drag them into the gallery. Uploads run sequentially; successful photos remain saved if another fails. **Retry failed photos** retries only the failed uploads.
- Use a photo’s menu and choose **Set as cover** to replace the location’s icon with that photo. Adding a photo does not automatically change the cover.
- Choose **Remove cover** to return to the icon while keeping the photo. Deleting the cover also restores the icon; another photo is never selected automatically.
- Open a photo to view it full screen. Use the arrow keys to browse and Escape to close.

Location photos accept JPEG, PNG, and GIF files up to **10 MiB** and **40 megapixels** each. Photo management is separate from creating or editing a location. Deleting a photo preserves the location and its assets; deleting a location cleans up its photos.

Photos use the configured [local or S3 storage](/guides/storage/). S3 photo URLs expire after 15 minutes; refresh the location or gallery to renew them.

## Collections and tags

Create shared household collections with a name, description, and icon. Assign an asset to multiple collections from its form, then filter **Assets** by collection. Deleting a collection preserves its assets.

Use tags for labels that apply across categories and locations. Assign existing tags or create new ones from the asset form, and manage names and descriptions on **Tags**. On **Assets**, select tags and choose whether results must match **any** or **all** of them. Removing a tag does not delete the assets it labeled.

## Assets inside other assets

Use an asset’s **Contents** section to add existing assets or create a new asset inside it. Contents can themselves contain assets. Browse the hierarchy, search within it, and enable **Include nested contents** to search below the current level.

A contained asset has one parent and uses that parent’s location. Moving the container to another location moves its nested contents too. An asset cannot contain itself or an ancestor. Detaching an asset preserves its current location; deleting a container detaches its direct contents instead of deleting them.

When editing an asset, staged contents changes apply when you save the asset. The detail-page contents browser also lets you move or detach an item directly. The contents summary shows the total cost including contents, using purchase prices and quantities.

## Warranty coverage

Add a warranty from the asset detail page with its provider, policy number, start and end dates, and notes. Use **Warranties** for an overview of coverage, and the dashboard to monitor approaching expiration dates. Keep proof of purchase in the asset’s attachments.

## Asset history

Open an asset’s **History** section to record a repair, maintenance visit, loan, or other event. Add a title, description, date and time, and icon. You can edit or delete custom events from their action menus.

The timeline also shows **Asset Created** and **Last Updated**. These entries reflect the asset’s timestamps; the timeline does not retain a separate record of every field change.

## Find things again

Use [search and saved filters](/guides/search/) to combine organization fields and custom attributes, save a useful view, and pin frequently used searches to your desktop sidebar.
