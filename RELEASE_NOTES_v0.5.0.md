# Content Idea Organizer v0.5.0

This release introduces a complete category system for music entries.

## Music categories

Music entries can now be assigned to independent categories, just like concepts.

Each music category supports:

- a custom name;
- a color picker;
- direct HEX color input;
- rename and delete actions.

Deleting a music category does not delete its music entries. Those entries become uncategorized.

## Interface

- The Music column now has a category management button.
- Music rows use their category color.
- Saved results display the music category badge and color.
- Results can be filtered independently by concept category and music category.

## Compatibility

Existing browser data and JSON backups from earlier versions remain compatible. Missing `musicCategories` data is automatically migrated to an empty category list.
