# Changelog

## [1.5.5] — 2026-08-06

### Fixed

- fixed an infinite recursion in `getMusicDisplayLabel()` introduced in v1.5.3;
- Results, Calendar and Statistics render correctly again;
- Music without an Artist still displays as title-only;
- Music with an Artist still displays as `Artist — Track title` anywhere a compact text label is needed;
- this hotfix does not modify, migrate, reset or clear stored application data.


## [1.5.4] — 2026-08-06

### Changed

- Music cells now use Track title as the primary heading;
- Artist is displayed underneath as the smaller secondary label;
- title-only Music continues to show only the Track title with no empty Artist line.


## [1.5.3] — 2026-08-06

### Changed

- Artist is now optional when adding or editing Music;
- Track title remains required;
- Music with an Artist keeps the existing two-line Artist / Track title presentation;
- Music without an Artist shows only the Track title as the main label;
- no empty dash or “— Track title” formatting is shown anywhere;
- Result cards, Completed/Archive views, Calendar, Statistics, selection preview and workflow dialogs all use the clean title-only label when Artist is missing;
- JSON import now accepts Music entries with an empty or missing Artist field.


## [1.5.2] — 2026-08-05

### Added

- Ideas, Concepts and Music in Workspace can now be marked as Completed directly;
- each source cell now has a small ✓ action alongside Edit and Delete;
- completed source items leave Workspace and appear in the existing Completed tab;
- completing a source item does not delete it and does not break Results that already reference it;
- completed source items can still be restored through Completed → Restore to workspace;
- if the source item was part of the current selection, that selection slot is cleared automatically.


## [1.5.1] — 2026-08-05

### Improved — Statistics activity chart

- added a visible Y axis with numeric values so bar height can be read directly;
- bars now start on a real zero baseline instead of appearing to float above the bottom line;
- replaced the fixed 14-day-only chart with a selectable activity period;
- added periods:
  - 7 days;
  - 14 days;
  - 30 days;
  - 3 months;
  - 6 months;
  - 1 year;
  - All time;
- longer periods automatically aggregate activity into weekly, monthly or yearly buckets so the graph stays readable;
- All time automatically chooses daily / weekly / monthly / yearly aggregation based on the actual history span;
- X-axis labels automatically thin out when there are many buckets;
- the current aggregation mode is shown below the chart;
- tooltips show the exact day or date range plus Completed and Published counts.


## [1.5.0] — 2026-08-05

### Added

- a new top-level **Statistics** tab alongside Workspace, Calendar, Completed and Archive;
- KPI dashboard for tracked Results, Completed, Published, Ready to publish, In progress and average score;
- completion and publication rates;
- 14-day activity chart for actual Completed and Published events;
- pipeline donut chart showing In progress / Ready to publish / Published;
- Concept category usage distribution with category colours;
- Music category usage distribution with category colours;
- ranked lists for most-used Ideas, Concepts and Music;
- planning-performance analytics comparing planned and actual execution/publication dates;
- average early/late variance from the plan;
- Highlights section with the most productive day and most-used Concept/Music categories;
- Top Results ranking by score;
- Statistics automatically use corrected actual dates from the v1.4.8 history-correction workflow;
- the dashboard is fully responsive and requires no external chart libraries.

### Notes

- active-base metrics and usage rankings exclude archived Results;
- historical Completed / Published totals and activity retain actual recorded history;
- all charts are rendered locally and remain compatible with the local-first architecture.


## [1.4.8] — 2026-08-05

### Added

- Completed Results now have a discreet overflow (⋯) action for correcting actual dates;
- “Adjust actual dates” opens a compact correction modal instead of adding more permanent controls to the crowded interface;
- the actual Completed date/time can be corrected after the fact;
- the actual Published date/time can be corrected, added later if the user forgot to mark publication, or cleared if it was recorded by mistake;
- changing actual dates immediately moves the corresponding Completed / Published Calendar events to the corrected dates;
- planned execution and planned publication dates remain untouched;
- publication cannot be set earlier than completion.


## [1.4.7] — 2026-08-05

### Added

- Calendar now has a “Show progress” checkbox;
- with Show progress enabled, Calendar behaves exactly as before and shows all event stages;
- with Show progress disabled, Calendar shows only outstanding planning states:
  - Execution planned;
  - Publication planned — still in progress;
  - Ready to publish;
- Completed, Published, resolved Execution plans and historical resolved publication-plan events are hidden in planning-only mode;
- Day Overview and its event-type filter follow the same visibility mode;
- progress/history legend items are hidden while planning-only mode is active;
- “Events in 7 days” follows the currently visible Calendar mode;
- the preference is saved locally and restored on reload.


## [1.4.6] — 2026-08-04

### Changed

- completed, unpublished Results can now edit Publication planned directly from the Completed view;
- changing the publication plan no longer requires restoring the Result to Workspace;
- completedAt and the Completed workflow status remain unchanged when the publication date is edited;
- Calendar updates immediately after the publication plan changes;
- the publication plan can also be cleared directly from Completed.


## [1.4.5] — 2026-08-04

### Changed

- Day Overview event-type filter options now use the same colors as their Calendar legend/event types;
- Execution planned uses the execution orange;
- Completed uses the completed green;
- publication-plan states use their respective purple shades;
- Published uses the published teal;
- the closed filter control also adopts the color of the currently selected event type.


## [1.4.4] — 2026-08-04

### Added

- Day Overview now has an event-type filter;
- users can show only Execution planned, resolved execution plans, Completed, Publication planned — still in progress, Ready to publish, historical Publication planned, or Published events;
- “All types” restores the full selected-day list;
- filtering affects only Day Overview and does not hide events from the calendar grid;
- the selected filter remains active while moving between calendar days.


## [1.4.3] — 2026-08-04

### Changed

- a future Execution planned event is retained after a Result is completed, preserving the original plan;
- resolved execution plans are now visually marked with a checked, muted orange state instead of looking like outstanding work;
- Calendar day details label the old plan as completed against plan;
- the real Completed event still appears on the actual completion date;
- resolved execution plans no longer count toward Planned ahead.


## [1.4.2] — 2026-08-04

### Changed

- Calendar “Planned ahead” now means the number of distinct calendar days from today onward that contain at least one planned content event;
- Execution planned, Publication planned — still in progress, and Ready to publish all count equally;
- multiple planned Results on the same date count as one planned day;
- today is included when it contains at least one plan;
- gaps between planned dates do not create extra days.


## [1.4.1] — 2026-08-04

### Fixed

- Calendar “Ready to publish” no longer counts unpublished Results whose planned publication date is already before today;
- Calendar “Publications planned” now counts only unpublished publication plans scheduled for today or a future date;
- historical / overdue publication plans no longer inflate forward-looking calendar metrics;
- dates scheduled for today are still included in both metrics.


## [1.4.0] — 2026-08-04

### Changed

- Workspace now contains only Execution planned and Publication planned;
- Completed and Published timestamps can no longer be entered manually;
- Mark as completed automatically records the current completion date/time and moves the Result to Completed;
- Completed Results waiting for publication are labeled Ready to publish;
- Completed Results can be marked as published directly from the Completed view;
- Mark as published automatically records the current publication date/time;
- Calendar Completed / Ready to publish / Published events are driven by these workflow actions.


## [1.3.1] — 2026-08-03

### Fixed

- planned publication events in Calendar now distinguish content that is still in progress from content that is already ready to publish;
- a planned publication for an unfinished Result uses a lighter, hollow/dashed publication state;
- a planned publication for a completed Result uses a stronger “Ready to publish” state;
- Calendar day details explicitly show “Result not completed yet” or “Ready to publish”;
- the Ready to publish metric now also respects Results moved to the Completed workflow.


## [1.3.0] — 2026-08-03

### Added

- c-manager now offers to name a Result immediately after it is created;
- compact naming dialog with an automatically focused text field;
- “Save name” and “Skip” actions;
- skipping keeps the standard generated Result name;
- the existing pencil rename action remains available later.


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
