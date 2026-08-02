# Content Idea Organizer v0.7.0

This release adds a visual content planning calendar without replacing the existing detailed Results list.

## Calendar view

A new **Calendar** tab presents the current content pipeline as a monthly grid.

Every day can show events from the four existing result stages:

- **Execution planned**
- **Completed**
- **Publication planned**
- **Published**

Each stage has its own visual color. A day with multiple events shows compact result previews and an event count.

## Day overview

Click any calendar day to open a detailed day panel showing:

- stage;
- time;
- result title;
- idea, concept, and music combination;
- current workflow state;
- overdue status where applicable.

Calendar entries can navigate back to an active result or to the Completed view.

## Planning overview

The calendar includes four summary metrics:

- how many days ahead the current plan reaches;
- total events during the next seven days;
- results that are completed but not yet published;
- publications that have a planned publication date but are not yet published.

## Overdue planning

A planned execution date is treated as overdue when it is in the past and the result has no Completed date.

A planned publication date is treated as overdue when it is in the past and the result has no Published date.

## Data model

No duplicate calendar records are stored. The view is derived directly from the four timeline date fields already present on each result.

Active and completed results are shown. Archived results are excluded.
