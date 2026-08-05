# c-manager

**Current version:** `v1.4.8`

c-manager is a local browser app for building content plans by combining three reusable components:

- an **idea** — the format or action used in a post or video;
- a **concept** — the topic of the content;
- **music** — the track used in the final piece.

Each saved result keeps the selected combination together with scheduling and priority information.

## Features

- three editable columns: **Ideas**, **Concepts**, and **Music**;
- optional clickable links for ideas, concepts, and music;
- add, edit, and delete items;
- reusable concept categories;
- reusable music categories;
- filter concept and music source columns by category;
- custom colors and direct HEX input for both concept and music categories;
- select one item from each column and save the combination as a result;
- visible SVG wires between connected cells;
- reuse the same source item in multiple results;
- compact results panel designed for desktop use;
- custom names for saved results;
- optional naming prompt immediately after a Result is created;
- completed and archived result workflows with separate tabs;
- monthly content calendar with day cells, stage colors, day details, and planning metrics;
- four-stage execution and publication timeline:
  - planned execution;
  - completed;
  - planned publication;
  - published;
- **Importance** and **Desire** ratings from `0` to `10`;
- weighted score formula:

```text
score = importance × 2 + desire
```

- sorting by score, importance, desire, creation date, or planned execution date;
- filtering by planning status, concept category, and music category;
- random combination selection;
- optional **Connections mode** for inspecting all relationships of a cell;
- Russian and English interface;
- automatic browser storage;
- JSON export, import, and full reset;
- no accounts, server, build tools, or external dependencies.

## Run locally

### Option 1 — open the file directly

Open `index.html` in a modern browser.

### Option 2 — use a local server

A local server is recommended for the most consistent browser behavior.

Using VS Code Live Server:

1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

You can also use any other simple static server.

## Data and privacy

All user data is stored locally in the browser through `localStorage`.

The app does not send ideas, concepts, music, results, or settings to a remote server.

Important:

- browser storage belongs to a specific browser and site address;
- opening the app through `file://` and through a local server creates separate storage locations;
- export a JSON backup before changing browser, device, or launch method;
- use **Import** to restore a backup.

## JSON backups

- **Export** downloads the complete application state;
- **Import** validates a JSON backup and replaces the current state;
- **Reset** removes all locally stored user data after confirmation.

## Interface languages

The interface can be switched between:

- Russian;
- English.

Only application interface text is translated. User-entered ideas, concepts, categories, music, and result names are never translated or modified.

## Project structure

```text
c-manager/
├── index.html
├── styles.css
├── README.md
├── LICENSE
├── CHANGELOG.md
├── RELEASE_NOTES_v0.4.1.md
├── VERSION
├── PROJECT_PLAN.md
├── PROJECT_STATE.md
├── TEST_CHECKLIST.md
├── .gitignore
├── assets/
│   └── reference.png
├── docs/
│   └── screenshot-v0.1.0.png
└── js/
    ├── app.js
    ├── connections.js
    ├── i18n.js
    ├── render.js
    ├── state.js
    └── storage.js
```

## Browser support

The app is intended for current desktop versions of:

- Chrome;
- Edge;
- Firefox;
- other modern Chromium-based browsers.

## Known limitations

- no cloud synchronization;
- no accounts or collaboration;
- data is stored only in the current browser unless exported;
- wires are created from saved results and cannot yet be dragged manually;
- the app is desktop-first, with a simplified responsive layout on narrower screens.

## Development

The project uses plain HTML, CSS, JavaScript, SVG, and `localStorage`.

There is no installation step and no package manager.

After changing the source files, refresh the browser with:

```text
Ctrl + F5
```

## Repository

GitHub: `https://github.com/Shrnch/c-manager`

## License

This project is released under the [MIT License](LICENSE).
