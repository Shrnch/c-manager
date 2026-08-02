# Content Idea Organizer v0.6.0

This release adds completed and archive workflows for results and source items.

## Result actions

Every active result now has a three-dot menu with:

- **Mark as completed**
- **Archive**

Both actions require confirmation.

During confirmation, the linked idea, concept, and music can optionally receive the same status through three independent checkboxes. All checkboxes are off by default.

## Separate views

The application now has three tabs:

- **Workspace**
- **Completed**
- **Archive**

Completed and archived results and source items are removed from the main workspace and shown in their corresponding tab.

## Restoring items

Every result, idea, concept, and music entry in Completed or Archive has an independent **Restore to workspace** button.

Restoring a result does not automatically restore its source items. Restoring a source item does not automatically restore its results.

## Compatibility

Existing browser data and JSON backups remain compatible. Items without a workflow status are migrated to the active workspace.
