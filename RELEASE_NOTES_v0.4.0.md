# Content Idea Organizer v0.4.0

This release adds a complete execution and publication workflow to every saved result.

## New result stages

Each result now has four independent date and time fields:

1. **Execution planned**
2. **Completed**
3. **Publication planned**
4. **Published**

Empty stages use a red attention state to show that a date still needs to be assigned. Filled stages use a green state.

## Migration

The previous single `scheduledAt` field is automatically migrated to **Completed**, so existing saved data and imported backups remain compatible.

## Additional changes

- planning filters now use the planned execution date;
- nearest-date sorting now uses planned execution;
- all new interface text is available in Russian and English;
- the four stages are displayed in a compact two-column layout.
