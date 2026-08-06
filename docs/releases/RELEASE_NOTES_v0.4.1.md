# Content Idea Organizer v0.4.1

This update adds optional clickable links to ideas, concepts, and music without making the interface visually heavy.

## What changed

- Ideas can include an optional link.
- Concepts can include an optional link.
- Music entries can include an optional link.
- Links can be added while creating an item or later through Edit.
- Links without a protocol automatically receive `https://`.
- Only `http://` and `https://` links are accepted.

## Interface behavior

A source cell with a link displays a small external-link icon next to its edit and delete controls.

A result card displays a compact collapsed **Links** row only when at least one of its source items contains a link.

When none of the three source items has a link, the result card renders no links UI at all. There are no empty panels or “no link” placeholders.

## Data

Links are stored locally and included in JSON export and import.
