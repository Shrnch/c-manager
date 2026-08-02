# c-manager v1.0.0

The first stable public release of **c-manager**.

c-manager is a local browser-based content planning workspace for turning ideas, concepts, and music into organized content results and tracking them from planning through publication.

## Core workflow

- Create and manage Ideas, Concepts, and Music.
- Combine one item from each column into a Result.
- Reuse source items across multiple Results.
- Rename Results and assign importance/desire scores.
- Sort and filter Results.
- Use Random selection when needed.

## Categories

- Concept categories with custom colors and HEX input.
- Music categories with custom colors and HEX input.
- Category colors appear directly in the workspace and Results.
- Results can be filtered independently by concept and music category.

## Links

Ideas, Concepts, and Music can contain optional clickable links.

Links stay visually compact and only appear in Results when at least one source item contains a link.

## Result timeline

Each Result has four timeline stages:

1. Execution planned
2. Completed
3. Publication planned
4. Published

Missing dates use an attention state; assigned dates use a completed state.

## Completed and Archive

Results have a three-dot actions menu with:

- Mark as completed
- Archive

During confirmation, the linked Idea, Concept, and Music can optionally receive the same status.

Completed and archived items are displayed in separate tabs and can be restored independently.

## Content calendar

The Calendar tab provides a monthly overview of:

- planned execution;
- completed work;
- planned publication;
- published content.

It also shows planning coverage, events during the next seven days, ready-to-publish Results, scheduled publications, and overdue planned stages.

## Other features

- RU / EN interface.
- Local browser persistence.
- JSON export/import.
- SVG relation wires.
- Relation inspection mode.
- No account, server, build process, or external runtime dependencies required.

## Data compatibility

Existing data from earlier versions remains compatible.

Legacy localStorage keys are intentionally preserved so upgrading to c-manager v1.0.0 does not make previously saved content disappear.
