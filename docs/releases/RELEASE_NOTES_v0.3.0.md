# Content Idea Organizer v0.3.0

The first public release of Content Idea Organizer.

Content Idea Organizer is a local browser app for combining reusable content ideas, concepts, and music into scheduled and prioritized results.

## Highlights

- editable Ideas, Concepts, and Music columns;
- reusable concept categories with custom colors and HEX input;
- saved combinations with visible SVG connections;
- compact desktop results panel;
- custom result names;
- Importance and Desire ratings with a weighted score;
- result sorting and filtering;
- random combination selection;
- optional Connections mode;
- Russian and English interface;
- automatic local browser storage;
- JSON backup, restore, and reset;
- no server, account, installation, or external dependencies.

## Score formula

```text
score = importance × 2 + desire
```

## Installation

1. Download the release archive.
2. Extract it to any folder.
3. Open `index.html` in a modern browser.

For the most consistent behavior, run the folder through a simple local static server such as VS Code Live Server.

## Data storage

All data is stored locally in the browser through `localStorage`.

Export a JSON backup before changing browser, device, or launch method.

## Language behavior

The interface can be switched between Russian and English.

User-created content is never translated or modified.

## Known limitations

- no cloud synchronization;
- no accounts or collaboration;
- no manual drag-and-drop wires;
- desktop-first interface.

## License

MIT License.
