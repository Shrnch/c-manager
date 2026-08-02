# Changelog

## [1.2.1] — 2026-08-02

### Fixed

- Random-generated selections are no longer treated as manually locked;
- pressing Random repeatedly now rerandomizes every slot that was not selected manually;
- manually selected Idea / Concept / Music cells stay fixed across repeated Random presses;
- when more than one eligible item exists, repeated Random avoids returning the same item immediately where possible;
- clearing or deselecting a manual choice also removes its lock.


## [1.2.0] — 2026-08-02

### Changed

- Random now preserves source cells that are already selected;
- with one selected source, Random fills the other two;
- with two selected sources, Random fills only the remaining source;
- with no selections, Random fills all three;
- with all three selected, Random changes nothing and asks the user to deselect the slot they want to randomize;
- concept and music category filters continue to constrain Random pools.


## [1.1.0] — 2026-08-02

### Added

- category filter directly in the Concepts column header;
- category filter directly in the Music column header;
- “All categories” and “Uncategorized” options;
- concept and music filters work independently;
- Random selection respects the currently visible concept and music category filters.

### Behavior

- filtering only changes what is visible in the source columns;
- no items are deleted or modified;
- active items hidden by a category filter remain in storage and can be shown again by switching back to “All categories”.


## [1.0.0] — 2026-08-02

### First stable release

This release marks the project as **c-manager v1.0.0**.

### Changed

- project renamed from **Content Idea Organizer** to **c-manager**;
- application title, footer, README, documentation, and release branding updated;
- repository references updated to `Shrnch/c-manager`;
- release archive root folder renamed to `c-manager`.

### Included in v1.0.0

- Ideas, Concepts, and Music workflow;
- concept and music categories with custom colors;
- optional clickable links for source items;
- result scoring, sorting, and filtering;
- four-stage execution/publication timeline;
- Completed and Archive workflows;
- monthly content planning calendar;
- RU / EN interface;
- JSON export/import and local browser persistence;
- relation visualization with SVG wires.

### Compatibility

- existing browser data remains compatible;
- legacy internal localStorage keys are intentionally preserved so upgrading does not wipe saved ideas, concepts, music, results, categories, dates, archive state, or UI preferences.


## [0.7.0] — 2026-08-02

### Added

- separate Calendar tab alongside Workspace, Completed, and Archive;
- six-week monthly calendar grid with Monday-first weeks;
- color-coded events for:
  - planned execution;
  - completed work;
  - planned publication;
  - published content;
- compact result previews directly inside day cells;
- day detail panel with event time, result name, source combination, and workflow state;
- overdue indication for planned execution/publication dates that have not been resolved;
- previous month, next month, and Today navigation;
- planning overview metrics:
  - how many days ahead the current plan reaches;
  - events in the next seven days;
  - results ready to publish;
  - publications currently scheduled;
- quick navigation from a calendar event back to its active result or to the Completed tab;
- Russian and English calendar interface.

### Behavior

- Calendar data is derived from the existing four result date fields; no duplicate scheduling data is created.
- Active and completed results appear in the calendar.
- Archived results are excluded from the calendar.
- The existing detailed Results list remains unchanged and continues to be the main editing interface.


## [0.6.0] — 2026-07-22

### Added

- three-dot actions menu on result cards;
- “Mark as completed” and “Archive” actions;
- confirmation dialog before either action;
- optional checkboxes for applying the same status to the linked idea, concept, and music;
- separate Workspace, Completed, and Archive tabs;
- completed and archived lists for results, ideas, concepts, and music;
- individual restore-to-workspace action for every result and source item;
- count badges on Completed and Archive tabs;
- backward-compatible status migration for existing browser data and JSON backups;
- Russian and English interface text.

### Behavior

- completed and archived results disappear from the main Results list;
- completed and archived source items disappear from the three working columns;
- source items are only moved when their checkbox is selected;
- restoring a result does not automatically restore its linked source items, and vice versa.


## [0.5.0] — 2026-07-22

### Added

- separate categories for music entries;
- create, rename, delete, and recolor music categories;
- direct HEX input for music category colors;
- category selection while adding or editing music;
- colored music rows using the selected category color;
- music category badge and color inside saved results;
- result filtering by music category;
- backward-compatible migration for existing saves and JSON backups without `musicCategories`;
- Russian and English interface text for the new controls.


## [0.4.1] — 2026-07-22

### Added

- optional URL field for ideas, concepts, and music;
- automatic `https://` normalization when a protocol is omitted;
- secure support for `http://` and `https://` links only;
- small external-link icon in source cells;
- compact collapsible links section in result cards;
- Russian and English labels for link controls.

### UI behavior

- links are never required;
- result cards with no links do not render any links section;
- no “missing link” placeholders or empty link panels are displayed;
- one, two, or three available links are shown only after expanding the compact links row.


## [0.4.0] — 2026-07-22

### Added

- four date stages for every result:
  - planned execution;
  - completed;
  - planned publication;
  - published;
- red attention state for stages without a date;
- green completed state for stages with a date;
- automatic migration of the previous `scheduledAt` value into `completedAt`;
- Russian and English labels for all new stages.

### Changed

- the previous “Date and time” field is now “Completed”;
- planning filters and scheduled-date sorting now use the planned execution date;
- result cards display the four stages in a compact two-column timeline.


## [0.3.0] — 2026-07-20

### Added

- переключатель языка интерфейса RU / EN;
- перевод верхней панели, кнопок, переключателей и служебных подписей;
- перевод столбцов, фильтров, сортировки и панели результатов;
- перевод форм добавления и редактирования;
- перевод управления категориями;
- перевод карточек результатов, статусов, оценок и системных названий;
- перевод уведомлений, подтверждений и пользовательских ошибок;
- локализованное форматирование даты создания;
- сохранение выбранного языка в настройках браузера.

### Important

- пользовательские идеи, концепты, музыка, категории и названия результатов не переводятся и не изменяются;
- экспортируемые пользовательские данные не зависят от языка интерфейса.


## [0.2.4] — 2026-07-20

### Added

- кнопка переименования в заголовке каждой карточки результата;
- пользовательское название результата длиной до 80 символов;
- возможность очистить название и вернуть стандартное «Результат 01»;
- сохранение названий в localStorage;
- экспорт и импорт названий результатов через JSON;
- совместимость со старыми сохранениями без поля title.


## [0.2.3] — 2026-07-20

### Changed

- при наведении на карточку результата снова подсвечиваются только её провода;
- исходные идея, концепт и музыка при наведении на карточку больше не выделяются;
- просмотр всех связей ячейки вынесен в переключатель «Режим связей»;
- режим связей по умолчанию выключен и больше не мешает обычному выбору ячеек;
- состояние режима связей сохраняется в браузере.


## [0.2.2] — 2026-07-20

### Added

- просмотр всех связей при наведении на идею, концепт или музыку;
- подсветка всех ячеек, участвующих с выбранной ячейкой в результатах;
- подсветка всех соответствующих карточек результатов;
- одновременная подсветка всех связанных SVG-проводов;
- приглушение несвязанных ячеек, карточек и проводов;
- такая же обратная подсветка ячеек при наведении на карточку результата;
- поддержка просмотра связей с клавиатуры через фокус.


## [0.2.1] — 2026-07-20

### Fixed

- соответствующие строки идей, концептов и музыки снова имеют одинаковую высоту;
- высота каждой строки рассчитывается по самому высокому содержимому в этой позиции;
- линии перерисовываются после синхронизации высоты строк;
- карточки результатов больше не сжимаются при большом количестве результатов;
- идея, концепт, музыка, ползунки и дата больше не исчезают на обычном масштабе;
- список результатов прокручивается внутри правой панели без наложения карточек;
- длинный текст больше не расширяет и не ломает правую панель.


## [0.2.0] — 2026-07-20

### Changed

- результаты перенесены в отдельную правую desktop-панель;
- панель визуально отделена от трёх рабочих столбцов;
- на широком экране панель остаётся справа и может прокручиваться отдельно;
- карточки результатов стали значительно компактнее;
- идея, концепт и музыка отображаются короткими строками;
- итоговый балл перенесён в заголовок карточки;
- ползунки и поле даты уменьшены;
- на окнах уже 1220 px панель результатов переносится вниз.


## [0.1.5] — 2026-07-20

### Added

- прямой ввод HEX-кода при создании категории;
- HEX-поле рядом с каждой существующей категорией;
- синхронизация HEX-поля и системной палитры;
- поддержка кодов с символом `#` и без него.

### Fixed

- неверный HEX-код теперь показывает понятную ошибку и не перезаписывает цвет.


## [0.1.4] — 2026-07-20

### Added

- переключатель «Автопереход к результатам»;
- сохранение настройки автоперехода в браузере.

### Changed

- автоматический переход после создания результата теперь выключен по умолчанию;
- при выключенном переключателе страница остаётся на текущей позиции.


## [0.1.3] — 2026-07-20

### Fixed

- цвет категории теперь заполняет всю строку концепта, включая область кнопок;
- усилены границы между строками столбца концептов;
- SVG-провода отображаются над цветным фоном, но под текстом;
- провода больше не обрезаются на границе цветной заливки;
- сохранена прежняя точка остановки проводов внутри ячейки.


## [0.1.2] — 2026-07-20

### Changed

- вся ячейка концепта теперь окрашивается цветом категории;
- секция концепта в сохранённом результате использует тот же цвет;
- добавлены отдельные состояния наведения и выбора.


## [0.1.1] — 2026-07-20

### Added

- индивидуальные цвета категорий концептов;
- выбор цвета при создании категории;
- inline color picker для существующих категорий;
- цветные бейджи в концептах и результатах;
- автоматическая палитра для старых сохранённых категорий;
- совместимость цветов с localStorage и JSON-резервными копиями.


## [0.1.0] — 2026-07-20

### Added

- три рабочих столбца: идеи, концепты и музыка;
- категории концептов;
- добавление, редактирование и удаление;
- выбор комбинации из трёх компонентов;
- кнопка Random;
- сохранённые результаты;
- SVG-провода между связанными ячейками;
- дата и время результата;
- важность, желание и итоговый балл;
- сортировка и фильтры;
- localStorage;
- экспорт и импорт JSON;
- полный сброс данных;
- адаптивный интерфейс;
- проверки некорректных данных;
- тестовый чек-лист и документация.
