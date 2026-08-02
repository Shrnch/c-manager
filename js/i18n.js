'use strict';

(function createContentIdeaI18n(global) {
  const dictionaries = {
    ru: {
      'app.description':
        'Локальное приложение для соединения идей, концептов и музыки в готовые планы контента.',
      'app.subtitle':
        'Соединяй формат, тему и музыку в готовые идеи для контента.',

      'language.label': 'Язык',
      'language.aria': 'Язык интерфейса',
      'language.ru': 'Русский',
      'language.en': 'English',

      'common.random': 'Random',
      'common.createResult': 'Создать результат',
      'common.export': 'Экспорт',
      'common.import': 'Импорт',
      'common.reset': 'Сбросить',
      'common.add': 'Добавить',
      'common.save': 'Сохранить',
      'common.saveChanges': 'Сохранить изменения',
      'common.cancel': 'Отмена',
      'common.close': 'Закрыть',
      'common.confirm': 'Подтвердить',
      'common.delete': 'Удалить',
      'common.edit': 'Редактировать',
      'common.change': 'Изменить',
      'common.uncategorized': 'Без категории',

      'views.aria': 'Разделы приложения',
      'views.workspace': 'Рабочая область',
      'views.calendar': 'Календарь',
      'views.completed': 'Выполнено',
      'views.archive': 'Архив',

      'calendar.eyebrow': 'CONTENT PIPELINE',
      'calendar.title': 'Календарь контента',
      'calendar.description':
        'Общая картина выполнения и публикаций по дням. Архивные результаты здесь не показываются.',
      'calendar.previousMonth': 'Предыдущий месяц',
      'calendar.nextMonth': 'Следующий месяц',
      'calendar.today': 'Сегодня',
      'calendar.legendAria': 'Легенда календаря',
      'calendar.gridAria': 'Календарь контент-плана',
      'calendar.dayEyebrow': 'DAY OVERVIEW',
      'calendar.stage.plannedExecution':
        'Запланировано выполнение',
      'calendar.stage.completed': 'Сделано',
      'calendar.stage.plannedPublication':
        'Запланирована публикация',
      'calendar.stage.published': 'Выложено',
      'calendar.metric.plannedAhead': 'План вперёд',
      'calendar.metric.nextSeven':
        'Событий за 7 дней',
      'calendar.metric.ready':
        'Готово к публикации',
      'calendar.metric.scheduledPublication':
        'Публикаций в плане',
      'calendar.metric.daysValue': '{count} дн.',
      'calendar.dayAria':
        '{date}. Событий: {count}',
      'calendar.moreEvents': '+ ещё {count}',
      'calendar.noEvents':
        'На этот день ничего не запланировано и не отмечено.',
      'calendar.overdue': 'Просрочено',
      'calendar.inWorkspace': 'В работе',
      'calendar.openResult': 'Открыть результат',
      'calendar.openCompleted':
        'Открыть «Выполнено»',

      'toggle.autoJump.label': 'Автопереход к результатам',
      'toggle.autoJump.title':
        'После создания результата автоматически перейти к списку результатов',
      'toggle.relations.label': 'Режим связей',
      'toggle.relations.title':
        'При наведении на ячейку показать все связанные ячейки, результаты и провода',

      'data.aria': 'Управление данными',
      'data.autosave': 'Автосохранение',
      'data.autosaveTitle':
        'Изменения автоматически сохраняются в браузере',
      'data.noAutosave': 'Без автосохранения',
      'data.noAutosaveTitle':
        'Браузер запретил localStorage. Используй экспорт JSON для резервных копий.',

      'selection.aria': 'Текущая комбинация',
      'selection.label': 'Текущая комбинация',
      'selection.instruction':
        'Выбери по одному элементу в каждом столбце.',
      'selection.idea': 'Идея: {value}',
      'selection.concept': 'Концепт: {value}',
      'selection.music': 'Музыка: {value}',
      'selection.ideaMissing': 'Идея не выбрана',
      'selection.conceptMissing': 'Концепт не выбран',
      'selection.musicMissing': 'Музыка не выбрана',

      'workspace.aria': 'Рабочая доска',
      'columns.ideas': 'Идеи',
      'columns.concepts': 'Концепты',
      'columns.music': 'Музыка',
      'columns.addIdea': 'Добавить идею',
      'columns.addConcept': 'Добавить концепт',
      'columns.addMusic': 'Добавить музыку',
      'columns.manageCategories': 'Управлять категориями',
      'columns.manageMusicCategories':
        'Управлять категориями музыки',
      'columns.filterConceptCategories':
        'Фильтр категорий концептов',
      'columns.filterMusicCategories':
        'Фильтр категорий музыки',
      'columns.allConceptCategories':
        'Все категории',
      'columns.allMusicCategories':
        'Все категории',

      'results.eyebrow': 'SAVED COMBINATIONS',
      'results.title': 'Результаты',
      'results.sort': 'Сортировка',
      'results.planning': 'План выполнения',
      'results.category': 'Категория концепта',
      'results.musicCategory': 'Категория музыки',
      'results.sort.score': 'По итоговому баллу',
      'results.sort.importance': 'По важности',
      'results.sort.desire': 'По желанию',
      'results.sort.newest': 'Сначала новые',
      'results.sort.oldest': 'Сначала старые',
      'results.sort.scheduled': 'По ближайшему выполнению',
      'results.filter.all': 'Все результаты',
      'results.filter.planned': 'Выполнение запланировано',
      'results.filter.unscheduled': 'Без плана выполнения',
      'results.filter.allCategories': 'Все категории',
      'results.filter.allMusicCategories':
        'Все музыкальные категории',
      'results.filter.uncategorized': 'Без категории',
      'results.empty.title': 'Сохранённых результатов пока нет',
      'results.empty.description':
        'Выбери идею, концепт и музыку, затем создай первую комбинацию.',
      'results.filtered.title':
        'По текущим фильтрам ничего не найдено',
      'results.filtered.description':
        'Измени фильтры или сортировку, чтобы снова увидеть сохранённые результаты.',

      'item.newEyebrow': 'NEW ITEM',
      'item.defaultTitle': 'Добавить элемент',
      'item.addIdea': 'Добавить идею',
      'item.editIdea': 'Редактировать идею',
      'item.addConcept': 'Добавить концепт',
      'item.editConcept': 'Редактировать концепт',
      'item.addMusic': 'Добавить музыку',
      'item.editMusic': 'Редактировать музыку',
      'item.ideaText': 'Текст идеи',
      'item.ideaPlaceholder':
        'Например: рисовать только двумя цветами',
      'item.conceptName': 'Название концепта',
      'item.conceptPlaceholder': 'Например: Динозавры',
      'item.category': 'Категория',
      'item.musicCategory': 'Категория музыки',
      'item.artist': 'Исполнитель',
      'item.artistPlaceholder': 'Например: Frank Sinatra',
      'item.trackTitle': 'Название композиции',
      'item.trackPlaceholder': 'Например: My Way',
      'item.linkOptional': 'Ссылка — необязательно',
      'item.linkPlaceholder': 'Например: youtube.com/video',
      'links.open': 'Открыть ссылку: {label}',

      'categories.eyebrow': 'CONCEPT CATEGORIES',
      'categories.title': 'Категории концептов',
      'categories.new': 'Новая категория',
      'categories.newPlaceholder': 'Например: Животные',
      'categories.color': 'Цвет',
      'categories.colorAria': 'Цвет новой категории',
      'categories.hexAria': 'HEX-код новой категории',
      'categories.empty': 'Категорий пока нет.',
      'categories.count': '{count} концепт(ов)',
      'categories.colorFor': 'Цвет категории {name}',
      'categories.hexFor': 'HEX-код категории {name}',
      'categories.chooseColor': 'Выбрать цвет',
      'categories.hexHint': 'Вставь HEX-код, например #422680',

      'musicCategories.eyebrow': 'MUSIC CATEGORIES',
      'musicCategories.title': 'Категории музыки',
      'musicCategories.new': 'Новая музыкальная категория',
      'musicCategories.newPlaceholder':
        'Например: Cinematic',
      'musicCategories.colorAria':
        'Цвет новой музыкальной категории',
      'musicCategories.hexAria':
        'HEX-код новой музыкальной категории',
      'musicCategories.empty':
        'Категорий музыки пока нет.',
      'musicCategories.count': '{count} композиция(ий)',

      'confirm.eyebrow': 'CONFIRM ACTION',
      'confirm.deleteItem': 'Удалить элемент?',

      'empty.ideas': 'Идей пока нет.',
      'empty.concepts': 'Концептов пока нет.',
      'empty.music': 'Музыки пока нет.',

      'date.unknown': 'Дата неизвестна',

      'result.defaultName': 'Результат {number}',
      'result.noCustomTitle': 'Название результата не задано',
      'result.created': 'Создано: {date}',
      'result.scoreFormula': 'Важность × 2 + Желание',
      'result.score': 'Балл',
      'result.rename': 'Переименовать результат',
      'result.delete': 'Удалить результат',
      'result.idea': 'Идея',
      'result.concept': 'Концепт',
      'result.music': 'Музыка',
      'result.deletedIdea': 'Удалённая идея',
      'result.deletedConcept': 'Удалённый концепт',
      'result.deletedMusic': 'Удалённая музыка',
      'result.ratingAria': 'Оценка результата',
      'result.importance': 'Важность',
      'result.desire': 'Желание',
      'result.importanceHelp': 'Вес в итоговом балле: ×2',
      'result.desireHelp': 'Вес в итоговом балле: ×1',
      'result.ratingValue': '{label}: {value} из 10',
      'result.timelineAria': 'Этапы выполнения и публикации',
      'result.plannedExecution': 'Запланировано выполнение',
      'result.completed': 'Сделано',
      'result.plannedPublication': 'Запланирована публикация',
      'result.published': 'Выложено',
      'result.dateMissing': 'Нужно указать дату',
      'result.dateSet': 'Дата указана',
      'result.links': 'Ссылки: {count}',
      'result.moreActions': 'Другие действия',
      'result.markCompleted':
        'Отметить как выполненное',
      'result.archive': 'Архивировать',

      'dialog.deleteItem.title': 'Удалить элемент?',
      'dialog.deleteItem.used':
        '«{name}» будет удалён. Вместе с ним будут удалены связанные результаты: {count}. Отменить это действие после подтверждения нельзя.',
      'dialog.deleteItem.unused':
        '«{name}» будет удалён. Отменить это действие после подтверждения нельзя.',
      'dialog.deleteCategory.used':
        'Категория «{name}» используется в {count} концепт(ах). Концепты останутся, но станут без категории.',
      'dialog.deleteCategory.unused':
        'Категория «{name}» будет удалена.',
      'dialog.deleteCategory.title': 'Удалить категорию?',
      'dialog.deleteCategory.text':
        'Категория будет удалена, а её концепты останутся без категории.',
      'dialog.renameResult.prompt':
        'Название результата. Оставь поле пустым, чтобы вернуть стандартное название:',
      'dialog.deleteResult.title': 'Удалить результат?',
      'dialog.deleteResult.text':
        'Сохранённая комбинация будет удалена. Исходные идея, концепт и музыка останутся.',
      'dialog.renameCategory.prompt': 'Новое название категории:',
      'dialog.renameMusicCategory.prompt':
        'Новое название музыкальной категории:',
      'dialog.deleteMusicCategory.title':
        'Удалить категорию музыки?',
      'dialog.deleteMusicCategory.used':
        'Категория «{name}» используется в {count} композиции(ях). Музыка останется, но станет без категории.',
      'dialog.deleteMusicCategory.unused':
        'Категория музыки «{name}» будет удалена.',
      'dialog.import.title': 'Импортировать данные?',
      'dialog.import.text':
        'Текущие идеи, концепты, музыка и результаты будут полностью заменены данными из выбранного файла.',
      'dialog.import.button': 'Импортировать',
      'dialog.reset.title': 'Полностью сбросить данные?',
      'dialog.reset.text':
        'Все идеи, категории, концепты, музыка и сохранённые результаты будут удалены. Перед сбросом можно сделать экспорт.',
      'dialog.reset.button': 'Удалить всё',
      'dialog.duplicate.title': 'Такая комбинация уже сохранена',
      'dialog.duplicate.text':
        'Полностью одинаковый результат уже существует. Создать ещё одну копию?',
      'dialog.duplicate.button': 'Создать повторно',

      'workflow.relatedItems':
        'Также изменить связанные элементы',
      'workflow.completeTitle':
        'Точно отметить результат как выполненный?',
      'workflow.completeText':
        'Результат переместится во вкладку «Выполнено». Ниже можно дополнительно отметить связанные идею, концепт и музыку.',
      'workflow.archiveTitle':
        'Точно архивировать результат?',
      'workflow.archiveText':
        'Результат переместится в архив. Ниже можно дополнительно архивировать связанные идею, концепт и музыку.',
      'workflow.alsoIdea': 'Идея: {name}',
      'workflow.alsoConcept': 'Концепт: {name}',
      'workflow.alsoMusic': 'Музыка: {name}',

      'status.completedTitle': 'Выполнено',
      'status.completedDescription':
        'Здесь находятся выполненные результаты и связанные элементы, которые были отмечены отдельно.',
      'status.archiveTitle': 'Архив',
      'status.archiveDescription':
        'Здесь находятся архивные результаты, идеи, концепты и музыка.',
      'status.result': 'Результат',
      'status.results': 'Результаты',
      'status.ideas': 'Идеи',
      'status.concepts': 'Концепты',
      'status.music': 'Музыка',
      'status.restore': 'Вернуть в работу',
      'status.groupEmpty': 'В этом разделе пока ничего нет.',

      'toast.resultSaved': 'Результат сохранён.',
      'toast.itemDeleted': 'Элемент удалён.',
      'toast.categoryDeleted': 'Категория удалена.',
      'toast.resultRenamed': 'Результат переименован.',
      'toast.resultDefaultName': 'Стандартное название восстановлено.',
      'toast.resultDeleted': 'Результат удалён.',
      'toast.itemSaved': 'Изменения сохранены.',
      'toast.itemAdded': 'Новый элемент добавлен.',
      'toast.categoryAdded': 'Категория добавлена.',
      'toast.categoryRenamed': 'Категория переименована.',
      'toast.categoryColorSaved': 'Цвет категории сохранён.',
      'toast.musicCategoryAdded':
        'Категория музыки добавлена.',
      'toast.musicCategoryRenamed':
        'Категория музыки переименована.',
      'toast.musicCategoryDeleted':
        'Категория музыки удалена.',
      'toast.musicCategoryColorSaved':
        'Цвет категории музыки сохранён.',
      'toast.autoJumpOn': 'Автопереход к результатам включён.',
      'toast.autoJumpOff': 'Автопереход к результатам выключен.',
      'toast.relationsOn': 'Режим связей включён.',
      'toast.relationsOff': 'Режим связей выключен.',
      'toast.languageChanged': 'Язык интерфейса изменён.',
      'toast.exported': 'Резервная копия экспортирована.',
      'toast.exportFailed': 'Не удалось экспортировать данные.',
      'toast.imported': 'Данные успешно импортированы.',
      'toast.importedNoAutosave':
        'Данные импортированы, но автосохранение недоступно.',
      'toast.importFailed': 'Импорт не выполнен: {error}',
      'toast.reset': 'Все данные удалены.',
      'toast.randomSelected':
        'Случайная комбинация выбрана. Нажми «Создать результат», чтобы сохранить её.',
      'toast.randomUnavailable':
        'Random недоступен: добавь элементы в столбцы — {columns}.',
      'toast.timelineDateSet': 'Дата этапа сохранена.',
      'toast.timelineDateCleared': 'Дата этапа очищена.',
      'toast.resultCompleted':
        'Результат перемещён во «Выполнено».',
      'toast.resultArchived':
        'Результат перемещён в архив.',
      'toast.restoredToWork':
        'Элемент возвращён в рабочую область.',
      'toast.corruptedData':
        'Сохранённые данные были повреждены. Загружен стартовый набор.',
      'toast.autosaveFailed':
        'Не удалось автоматически сохранить изменения.',
      'toast.restored': 'Сохранённые данные восстановлены.',
      'toast.autosaveUnavailable':
        'Автосохранение недоступно. Для резервных копий используй экспорт JSON.',

      'random.ideas': 'идеи',
      'random.concepts': 'концепты',
      'random.music': 'музыка',

      'relations.count': 'Связанных результатов: {count}',

      'errors.loadModules':
        'Не удалось загрузить модель данных, отображение, провода, переводы или хранилище.',
      'errors.loadPreferences':
        'Не удалось загрузить настройки интерфейса.',
      'errors.savePreferences':
        'Не удалось сохранить настройки интерфейса.',
      'errors.hex': 'HEX-код должен выглядеть так: #422680.',
      'errors.ideaEmpty': 'Текст идеи не может быть пустым.',
      'errors.conceptEmpty': 'Текст концепта не может быть пустым.',
      'errors.musicEmpty':
        'Исполнитель и название композиции обязательны.',
      'errors.linkInvalid':
        'Укажи корректную ссылку, например https://example.com.'
    },

    en: {
      'app.description':
        'A local app for combining ideas, concepts, and music into ready-to-use content plans.',
      'app.subtitle':
        'Combine a format, topic, and music into ready-made content ideas.',

      'language.label': 'Language',
      'language.aria': 'Interface language',
      'language.ru': 'Русский',
      'language.en': 'English',

      'common.random': 'Random',
      'common.createResult': 'Create result',
      'common.export': 'Export',
      'common.import': 'Import',
      'common.reset': 'Reset',
      'common.add': 'Add',
      'common.save': 'Save',
      'common.saveChanges': 'Save changes',
      'common.cancel': 'Cancel',
      'common.close': 'Close',
      'common.confirm': 'Confirm',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.change': 'Edit',
      'common.uncategorized': 'Uncategorized',

      'views.aria': 'Application sections',
      'views.workspace': 'Workspace',
      'views.calendar': 'Calendar',
      'views.completed': 'Completed',
      'views.archive': 'Archive',

      'calendar.eyebrow': 'CONTENT PIPELINE',
      'calendar.title': 'Content calendar',
      'calendar.description':
        'A day-by-day overview of execution and publication. Archived results are hidden.',
      'calendar.previousMonth': 'Previous month',
      'calendar.nextMonth': 'Next month',
      'calendar.today': 'Today',
      'calendar.legendAria': 'Calendar legend',
      'calendar.gridAria': 'Content planning calendar',
      'calendar.dayEyebrow': 'DAY OVERVIEW',
      'calendar.stage.plannedExecution':
        'Execution planned',
      'calendar.stage.completed': 'Completed',
      'calendar.stage.plannedPublication':
        'Publication planned',
      'calendar.stage.published': 'Published',
      'calendar.metric.plannedAhead': 'Planned ahead',
      'calendar.metric.nextSeven':
        'Events in 7 days',
      'calendar.metric.ready':
        'Ready to publish',
      'calendar.metric.scheduledPublication':
        'Publications planned',
      'calendar.metric.daysValue': '{count} days',
      'calendar.dayAria':
        '{date}. Events: {count}',
      'calendar.moreEvents': '+ {count} more',
      'calendar.noEvents':
        'Nothing is planned or recorded for this day.',
      'calendar.overdue': 'Overdue',
      'calendar.inWorkspace': 'In workspace',
      'calendar.openResult': 'Open result',
      'calendar.openCompleted': 'Open Completed',

      'toggle.autoJump.label': 'Jump to results',
      'toggle.autoJump.title':
        'Automatically jump to the results list after creating a result',
      'toggle.relations.label': 'Connections mode',
      'toggle.relations.title':
        'Hover over a cell to show all connected cells, results, and wires',

      'data.aria': 'Data management',
      'data.autosave': 'Autosave',
      'data.autosaveTitle':
        'Changes are saved automatically in this browser',
      'data.noAutosave': 'Autosave unavailable',
      'data.noAutosaveTitle':
        'The browser blocked localStorage. Use JSON export for backups.',

      'selection.aria': 'Current combination',
      'selection.label': 'Current combination',
      'selection.instruction':
        'Select one item in each column.',
      'selection.idea': 'Idea: {value}',
      'selection.concept': 'Concept: {value}',
      'selection.music': 'Music: {value}',
      'selection.ideaMissing': 'No idea selected',
      'selection.conceptMissing': 'No concept selected',
      'selection.musicMissing': 'No music selected',

      'workspace.aria': 'Workspace board',
      'columns.ideas': 'Ideas',
      'columns.concepts': 'Concepts',
      'columns.music': 'Music',
      'columns.addIdea': 'Add idea',
      'columns.addConcept': 'Add concept',
      'columns.addMusic': 'Add music',
      'columns.manageCategories': 'Manage categories',
      'columns.manageMusicCategories':
        'Manage music categories',
      'columns.filterConceptCategories':
        'Filter concept categories',
      'columns.filterMusicCategories':
        'Filter music categories',
      'columns.allConceptCategories':
        'All categories',
      'columns.allMusicCategories':
        'All categories',

      'results.eyebrow': 'SAVED COMBINATIONS',
      'results.title': 'Results',
      'results.sort': 'Sort',
      'results.planning': 'Execution plan',
      'results.category': 'Concept category',
      'results.musicCategory': 'Music category',
      'results.sort.score': 'Highest score',
      'results.sort.importance': 'Highest importance',
      'results.sort.desire': 'Highest desire',
      'results.sort.newest': 'Newest first',
      'results.sort.oldest': 'Oldest first',
      'results.sort.scheduled': 'Nearest planned execution',
      'results.filter.all': 'All results',
      'results.filter.planned': 'Execution planned',
      'results.filter.unscheduled': 'No execution plan',
      'results.filter.allCategories': 'All categories',
      'results.filter.allMusicCategories':
        'All music categories',
      'results.filter.uncategorized': 'Uncategorized',
      'results.empty.title': 'No saved results yet',
      'results.empty.description':
        'Select an idea, concept, and music track, then create your first combination.',
      'results.filtered.title': 'No results match these filters',
      'results.filtered.description':
        'Change the filters or sorting to see saved results again.',

      'item.newEyebrow': 'NEW ITEM',
      'item.defaultTitle': 'Add item',
      'item.addIdea': 'Add idea',
      'item.editIdea': 'Edit idea',
      'item.addConcept': 'Add concept',
      'item.editConcept': 'Edit concept',
      'item.addMusic': 'Add music',
      'item.editMusic': 'Edit music',
      'item.ideaText': 'Idea text',
      'item.ideaPlaceholder':
        'For example: draw using only two colors',
      'item.conceptName': 'Concept name',
      'item.conceptPlaceholder': 'For example: Dinosaurs',
      'item.category': 'Category',
      'item.musicCategory': 'Music category',
      'item.artist': 'Artist',
      'item.artistPlaceholder': 'For example: Frank Sinatra',
      'item.trackTitle': 'Track title',
      'item.trackPlaceholder': 'For example: My Way',
      'item.linkOptional': 'Link — optional',
      'item.linkPlaceholder': 'For example: youtube.com/video',
      'links.open': 'Open link: {label}',

      'categories.eyebrow': 'CONCEPT CATEGORIES',
      'categories.title': 'Concept categories',
      'categories.new': 'New category',
      'categories.newPlaceholder': 'For example: Animals',
      'categories.color': 'Color',
      'categories.colorAria': 'New category color',
      'categories.hexAria': 'New category HEX code',
      'categories.empty': 'No categories yet.',
      'categories.count': '{count} concept(s)',
      'categories.colorFor': 'Color for category {name}',
      'categories.hexFor': 'HEX code for category {name}',
      'categories.chooseColor': 'Choose color',
      'categories.hexHint': 'Paste a HEX code, for example #422680',

      'musicCategories.eyebrow': 'MUSIC CATEGORIES',
      'musicCategories.title': 'Music categories',
      'musicCategories.new': 'New music category',
      'musicCategories.newPlaceholder':
        'For example: Cinematic',
      'musicCategories.colorAria':
        'New music category color',
      'musicCategories.hexAria':
        'New music category HEX code',
      'musicCategories.empty':
        'No music categories yet.',
      'musicCategories.count': '{count} track(s)',

      'confirm.eyebrow': 'CONFIRM ACTION',
      'confirm.deleteItem': 'Delete item?',

      'empty.ideas': 'No ideas yet.',
      'empty.concepts': 'No concepts yet.',
      'empty.music': 'No music yet.',

      'date.unknown': 'Unknown date',

      'result.defaultName': 'Result {number}',
      'result.noCustomTitle': 'No custom result name',
      'result.created': 'Created: {date}',
      'result.scoreFormula': 'Importance × 2 + Desire',
      'result.score': 'Score',
      'result.rename': 'Rename result',
      'result.delete': 'Delete result',
      'result.idea': 'Idea',
      'result.concept': 'Concept',
      'result.music': 'Music',
      'result.deletedIdea': 'Deleted idea',
      'result.deletedConcept': 'Deleted concept',
      'result.deletedMusic': 'Deleted music',
      'result.ratingAria': 'Result rating',
      'result.importance': 'Importance',
      'result.desire': 'Desire',
      'result.importanceHelp': 'Weight in total score: ×2',
      'result.desireHelp': 'Weight in total score: ×1',
      'result.ratingValue': '{label}: {value} out of 10',
      'result.timelineAria': 'Execution and publication stages',
      'result.plannedExecution': 'Execution planned',
      'result.completed': 'Completed',
      'result.plannedPublication': 'Publication planned',
      'result.published': 'Published',
      'result.dateMissing': 'Date required',
      'result.dateSet': 'Date set',
      'result.links': 'Links: {count}',
      'result.moreActions': 'More actions',
      'result.markCompleted': 'Mark as completed',
      'result.archive': 'Archive',

      'dialog.deleteItem.title': 'Delete item?',
      'dialog.deleteItem.used':
        '“{name}” will be deleted together with {count} linked result(s). This action cannot be undone.',
      'dialog.deleteItem.unused':
        '“{name}” will be deleted. This action cannot be undone.',
      'dialog.deleteCategory.used':
        'Category “{name}” is used by {count} concept(s). The concepts will remain but become uncategorized.',
      'dialog.deleteCategory.unused':
        'Category “{name}” will be deleted.',
      'dialog.deleteCategory.title': 'Delete category?',
      'dialog.deleteCategory.text':
        'The category will be deleted and its concepts will become uncategorized.',
      'dialog.renameResult.prompt':
        'Result name. Leave it empty to restore the default name:',
      'dialog.deleteResult.title': 'Delete result?',
      'dialog.deleteResult.text':
        'The saved combination will be deleted. The original idea, concept, and music will remain.',
      'dialog.renameCategory.prompt': 'New category name:',
      'dialog.renameMusicCategory.prompt':
        'New music category name:',
      'dialog.deleteMusicCategory.title':
        'Delete music category?',
      'dialog.deleteMusicCategory.used':
        'Category “{name}” is used by {count} track(s). The music entries will remain but become uncategorized.',
      'dialog.deleteMusicCategory.unused':
        'Music category “{name}” will be deleted.',
      'dialog.import.title': 'Import data?',
      'dialog.import.text':
        'Your current ideas, concepts, music, and results will be fully replaced by the selected file.',
      'dialog.import.button': 'Import',
      'dialog.reset.title': 'Reset all data?',
      'dialog.reset.text':
        'All ideas, categories, concepts, music, and saved results will be deleted. You can export a backup first.',
      'dialog.reset.button': 'Delete everything',
      'dialog.duplicate.title': 'This combination is already saved',
      'dialog.duplicate.text':
        'An identical result already exists. Create another copy?',
      'dialog.duplicate.button': 'Create another copy',

      'workflow.relatedItems':
        'Also update linked items',
      'workflow.completeTitle':
        'Mark this result as completed?',
      'workflow.completeText':
        'The result will move to the Completed tab. You can also mark its linked idea, concept, and music as completed.',
      'workflow.archiveTitle':
        'Archive this result?',
      'workflow.archiveText':
        'The result will move to the Archive tab. You can also archive its linked idea, concept, and music.',
      'workflow.alsoIdea': 'Idea: {name}',
      'workflow.alsoConcept': 'Concept: {name}',
      'workflow.alsoMusic': 'Music: {name}',

      'status.completedTitle': 'Completed',
      'status.completedDescription':
        'Completed results and linked items that were marked separately appear here.',
      'status.archiveTitle': 'Archive',
      'status.archiveDescription':
        'Archived results, ideas, concepts, and music appear here.',
      'status.result': 'Result',
      'status.results': 'Results',
      'status.ideas': 'Ideas',
      'status.concepts': 'Concepts',
      'status.music': 'Music',
      'status.restore': 'Restore to workspace',
      'status.groupEmpty': 'Nothing here yet.',

      'toast.resultSaved': 'Result saved.',
      'toast.itemDeleted': 'Item deleted.',
      'toast.categoryDeleted': 'Category deleted.',
      'toast.resultRenamed': 'Result renamed.',
      'toast.resultDefaultName': 'Default result name restored.',
      'toast.resultDeleted': 'Result deleted.',
      'toast.itemSaved': 'Changes saved.',
      'toast.itemAdded': 'New item added.',
      'toast.categoryAdded': 'Category added.',
      'toast.categoryRenamed': 'Category renamed.',
      'toast.categoryColorSaved': 'Category color saved.',
      'toast.musicCategoryAdded':
        'Music category added.',
      'toast.musicCategoryRenamed':
        'Music category renamed.',
      'toast.musicCategoryDeleted':
        'Music category deleted.',
      'toast.musicCategoryColorSaved':
        'Music category color saved.',
      'toast.autoJumpOn': 'Jump to results enabled.',
      'toast.autoJumpOff': 'Jump to results disabled.',
      'toast.relationsOn': 'Connections mode enabled.',
      'toast.relationsOff': 'Connections mode disabled.',
      'toast.languageChanged': 'Interface language changed.',
      'toast.exported': 'Backup exported.',
      'toast.exportFailed': 'Could not export data.',
      'toast.imported': 'Data imported successfully.',
      'toast.importedNoAutosave':
        'Data imported, but autosave is unavailable.',
      'toast.importFailed': 'Import failed: {error}',
      'toast.reset': 'All data deleted.',
      'toast.randomSelected':
        'Random combination selected. Click “Create result” to save it.',
      'toast.randomUnavailable':
        'Random is unavailable: add items to these columns — {columns}.',
      'toast.timelineDateSet': 'Stage date saved.',
      'toast.timelineDateCleared': 'Stage date cleared.',
      'toast.resultCompleted':
        'Result moved to Completed.',
      'toast.resultArchived':
        'Result moved to Archive.',
      'toast.restoredToWork':
        'Item restored to the workspace.',
      'toast.corruptedData':
        'Saved data was corrupted. The starter set has been loaded.',
      'toast.autosaveFailed':
        'Could not save changes automatically.',
      'toast.restored': 'Saved data restored.',
      'toast.autosaveUnavailable':
        'Autosave is unavailable. Use JSON export for backups.',

      'random.ideas': 'ideas',
      'random.concepts': 'concepts',
      'random.music': 'music',

      'relations.count': 'Connected results: {count}',

      'errors.loadModules':
        'Could not load the data model, renderer, wires, translations, or storage.',
      'errors.loadPreferences':
        'Could not load interface settings.',
      'errors.savePreferences':
        'Could not save interface settings.',
      'errors.hex': 'The HEX code must look like this: #422680.',
      'errors.ideaEmpty': 'Idea text cannot be empty.',
      'errors.conceptEmpty': 'Concept text cannot be empty.',
      'errors.musicEmpty':
        'Artist and track title are required.',
      'errors.linkInvalid':
        'Enter a valid link, for example https://example.com.'
    }
  };

  const errorTranslations = {
    en: {
      'Важность и желание должны быть числами.':
        'Importance and desire must be numbers.',
      'Данные элемента должны быть объектом.':
        'Item data must be an object.',
      'Изменения должны быть объектом.':
        'Changes must be an object.',
      'Текст идеи не может быть пустым.':
        'Idea text cannot be empty.',
      'Название категории не может быть пустым.':
        'Category name cannot be empty.',
      'Категория с таким названием уже существует.':
        'A category with this name already exists.',
      'Текст концепта не может быть пустым.':
        'Concept text cannot be empty.',
      'Указанная категория концепта не существует.':
        'The selected concept category does not exist.',
      'Указанная категория музыки не существует.':
        'The selected music category does not exist.',
      'Исполнитель и название композиции обязательны.':
        'Artist and track title are required.',
      'Выбранная идея не существует.':
        'The selected idea does not exist.',
      'Выбранный концепт не существует.':
        'The selected concept does not exist.',
      'Выбранная музыка не существует.':
        'The selected music does not exist.',
      'Название результата не может быть длиннее 80 символов.':
        'The result name cannot be longer than 80 characters.',
      'Назначенная дата результата имеет неверный формат.':
        'The scheduled result date has an invalid format.',
      'Дата этапа результата имеет неверный формат.':
        'The result stage date has an invalid format.',
      'Эта коллекция не поддерживает статусы.':
        'This collection does not support statuses.',
      'Неизвестный статус элемента.':
        'Unknown item status.',
      'Неизвестный этап результата.':
        'Unknown result stage.',
      'Корневой объект данных имеет неверный формат.':
        'The root data object has an invalid format.',
      'localStorage недоступен.':
        'localStorage is unavailable.',
      'Файл для импорта не выбран.':
        'No import file was selected.',
      'Файл не является корректным JSON.':
        'The file is not valid JSON.',
      'HEX-код должен выглядеть так: #422680.':
        'The HEX code must look like this: #422680.',
      'Укажи корректную ссылку, например https://example.com.':
        'Enter a valid link, for example https://example.com.',
      'Разрешены только ссылки http:// и https://.':
        'Only http:// and https:// links are allowed.',
      'Ссылка не может быть длиннее 2048 символов.':
        'A link cannot be longer than 2048 characters.'
    }
  };

  let currentLanguage = 'ru';

  function interpolate(template, params = {}) {
    return String(template).replace(
      /\{(\w+)\}/g,
      (match, key) =>
        Object.prototype.hasOwnProperty.call(params, key)
          ? String(params[key])
          : match
    );
  }

  function t(key, params = {}) {
    const dictionary =
      dictionaries[currentLanguage] || dictionaries.ru;
    const fallback = dictionaries.ru[key] ?? key;
    return interpolate(dictionary[key] ?? fallback, params);
  }

  function getLanguage() {
    return currentLanguage;
  }

  function getLocale() {
    return currentLanguage === 'en' ? 'en-GB' : 'ru-RU';
  }

  function translateError(message) {
    const safeMessage = String(message ?? '');
    return (
      errorTranslations[currentLanguage]?.[safeMessage] ??
      safeMessage
    );
  }

  function applyStaticTranslations(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    root
      .querySelectorAll('[data-i18n-title]')
      .forEach((element) => {
        element.title = t(element.dataset.i18nTitle);
      });

    root
      .querySelectorAll('[data-i18n-aria]')
      .forEach((element) => {
        element.setAttribute(
          'aria-label',
          t(element.dataset.i18nAria)
        );
      });

    root
      .querySelectorAll('[data-i18n-placeholder]')
      .forEach((element) => {
        element.placeholder = t(
          element.dataset.i18nPlaceholder
        );
      });

    const description = root.querySelector(
      'meta[name="description"]'
    );

    if (description) {
      description.content = t('app.description');
    }

    document.documentElement.lang = currentLanguage;
  }

  function setLanguage(language) {
    currentLanguage = language === 'en' ? 'en' : 'ru';
    applyStaticTranslations();
  }

  global.ContentIdeaI18n = {
    t,
    setLanguage,
    getLanguage,
    getLocale,
    translateError,
    applyStaticTranslations
  };
})(window);
