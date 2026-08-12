# TEST CHECKLIST — c-manager

## Базовый запуск

- [ ] Страница открывается без красных JavaScript-ошибок.
- [ ] Видны три столбца: идеи, концепты и музыка.
- [ ] При первом запуске отображается стартовый набор.
- [ ] Интерфейс остаётся читаемым при уменьшении окна.

## Идеи, концепты и музыка

- [ ] Добавляется новая идея.
- [ ] Добавляется новый концепт без категории.
- [ ] Добавляется новый концепт с категорией.
- [ ] Добавляется новая композиция.
- [ ] Каждый тип элемента редактируется.
- [ ] Пустые поля не принимаются.
- [ ] Очень длинный текст не ломает ширину столбца.
- [ ] Элемент удаляется после подтверждения.

## Категории

- [ ] Создаётся новая категория.
- [ ] Нельзя создать две категории с одинаковым названием.
- [ ] Категория переименовывается.
- [ ] Категория удаляется.
- [ ] После удаления категории концепты остаются без категории.
- [ ] Фильтр удалённой категории автоматически сбрасывается.

## Выбор и Random

- [ ] В каждом столбце можно выбрать только одну ячейку.
- [ ] Повторный клик снимает выбор.
- [ ] Кнопка создания активна только после выбора трёх компонентов.
- [ ] Random выбирает три существующих элемента.
- [ ] Random не сохраняет результат автоматически.
- [ ] При пустом столбце Random показывает понятную ошибку.

## Результаты

- [ ] Создаётся обычный результат.
- [ ] Создаётся несколько результатов.
- [ ] Одна ячейка используется в нескольких результатах.
- [ ] Полный дубль вызывает предупреждение.
- [ ] Результат удаляется отдельно.
- [ ] При удалении исходной ячейки показывается число связанных результатов.
- [ ] Связанные результаты удаляются вместе с исходной ячейкой.

## Важность, желание и сортировка

- [ ] Важность меняется от 0 до 10.
- [ ] Желание меняется от 0 до 10.
- [ ] Балл равен `важность × 2 + желание`.
- [ ] Максимальный балл равен 30.
- [ ] Работает сортировка по баллу.
- [ ] Работает сортировка по важности.
- [ ] Работает сортировка по желанию.
- [ ] Работает сортировка по дате создания.
- [ ] Работает сортировка по назначенной дате.

## Фильтры и дата

- [ ] Результату назначается дата и время.
- [ ] Дата и время очищаются.
- [ ] Работает фильтр запланированных результатов.
- [ ] Работает фильтр результатов без даты.
- [ ] Работает фильтр по категории.
- [ ] Если фильтр ничего не нашёл, показывается сообщение о фильтрах.

## Провода

- [ ] Каждый результат создаёт два провода.
- [ ] Провода соединяют правильные ячейки.
- [ ] Несколько результатов могут выходить из одной ячейки.
- [ ] При наведении на карточку нужные провода подсвечиваются.
- [ ] После удаления результата провода исчезают.
- [ ] После изменения размера окна провода остаются на местах.

## Сохранение и резервные копии

- [ ] После обновления страницы данные остаются.
- [ ] После закрытия и открытия браузера данные остаются.
- [ ] Экспорт скачивает JSON.
- [ ] После сброса все данные удаляются.
- [ ] Импорт корректного JSON восстанавливает данные.
- [ ] Импорт повреждённого JSON показывает ошибку.
- [ ] Импорт файла с отсутствующими ссылками показывает ошибку.
- [ ] При заблокированном localStorage приложение продолжает работать без автосохранения.

## Браузеры

- [ ] Chrome.
- [ ] Firefox.
- [ ] Edge.


## v1.6.0 backend reliability

- [ ] Existing v1 JSON backup imports with all collection counts unchanged.
- [ ] Mark as completed survives reload.
- [ ] Mark as published survives reload.
- [ ] Editing any source item survives reload without adding the method to a storage allowlist.
- [ ] Completing a Result together with linked sources persists all changes.
- [ ] Invalid/corrupted localStorage is not cleared or replaced at startup.
- [ ] Autosave stays paused after a failed startup load.
- [ ] Importing a valid backup after a failed load restores normal autosave.
- [ ] A successful save keeps the immediately previous valid state in the recovery slot.
- [ ] Calendar renders the same lifecycle stages as before the refactor.
- [ ] Statistics frequency and planning-performance sections still match existing data.


## v1.6.1 unused Concepts filter

- [ ] Concepts filter contains `Unused only`.
- [ ] `Unused only` hides Concepts referenced by active Results.
- [ ] `Unused only` hides Concepts referenced by Completed Results.
- [ ] `Unused only` hides Concepts referenced by Archived Results.
- [ ] Concepts never referenced by any Result remain visible.
- [ ] Completed/Archived source Concepts remain excluded from Workspace as before.
- [ ] Random uses only currently visible unused Concepts while the filter is enabled.
- [ ] Switching back to `All categories` restores the normal active Concepts list.


## v1.7.0 drag-to-calendar

- [ ] Calendar shows draggable Result cards above the month grid.
- [ ] Active unfinished Result drops onto a day as Execution planned.
- [ ] Completed unpublished Result drops onto a day as Publication planned.
- [ ] Existing planned time is preserved when the date is moved.
- [ ] A Result without a plan gets 12:00 on its first drop.
- [ ] Published Results are not shown in the drag tray.
- [ ] Archived Results are not shown in the drag tray.
- [ ] Drop target day is visibly highlighted during dragging.
- [ ] Dropping onto an adjacent-month day navigates to that month.
- [ ] The new date survives page reload.


## v1.7.1 two-way Calendar drag

- [ ] Execution planned card inside Calendar can move to another day.
- [ ] Ready to publish / Publication planned card can move to another day.
- [ ] Existing time stays unchanged when moving between dates.
- [ ] Day Overview planned card can also be dragged.
- [ ] Calendar plan can be dragged back into the Result tray.
- [ ] Dragging Execution back clears plannedExecutionAt.
- [ ] Dragging Publication back clears plannedPublicationAt.
- [ ] Completed actual event is not draggable.
- [ ] Published actual event is not draggable.
- [ ] Resolved historical execution plan is not draggable.
- [ ] Changed/cleared plan survives reload.
