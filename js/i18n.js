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

      'results.eyebrow': 'SAVED COMBINATIONS',
      'results.title': 'Результаты',
      'results.sort': 'Сортировка',
      'results.planning': 'Планирование',
      'results.category': 'Категория концепта',
      'results.sort.score': 'По итоговому баллу',
      'results.sort.importance': 'По важности',
      'results.sort.desire': 'По желанию',
      'results.sort.newest': 'Сначала новые',
      'results.sort.oldest': 'Сначала старые',
      'results.sort.scheduled': 'По ближайшей дате',
      'results.filter.all': 'Все результаты',
      'results.filter.planned': 'Только запланированные',
      'results.filter.unscheduled': 'Без даты',
      'results.filter.allCategories': 'Все категории',
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
      'item.artist': 'Исполнитель',
      'item.artistPlaceholder': 'Например: Frank Sinatra',
      'item.trackTitle': 'Название композиции',
      'item.trackPlaceholder': 'Например: My Way',

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
      'result.schedule': 'Дата и время',
      'result.planned': 'Запланировано',
      'result.noDate': 'Дата не назначена',

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
      'toast.scheduleSet': 'Дата и время назначены.',
      'toast.scheduleCleared': 'Дата и время очищены.',
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
        'Исполнитель и название композиции обязательны.'
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

      'results.eyebrow': 'SAVED COMBINATIONS',
      'results.title': 'Results',
      'results.sort': 'Sort',
      'results.planning': 'Planning',
      'results.category': 'Concept category',
      'results.sort.score': 'Highest score',
      'results.sort.importance': 'Highest importance',
      'results.sort.desire': 'Highest desire',
      'results.sort.newest': 'Newest first',
      'results.sort.oldest': 'Oldest first',
      'results.sort.scheduled': 'Nearest scheduled date',
      'results.filter.all': 'All results',
      'results.filter.planned': 'Scheduled only',
      'results.filter.unscheduled': 'Without a date',
      'results.filter.allCategories': 'All categories',
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
      'item.artist': 'Artist',
      'item.artistPlaceholder': 'For example: Frank Sinatra',
      'item.trackTitle': 'Track title',
      'item.trackPlaceholder': 'For example: My Way',

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
      'result.schedule': 'Date and time',
      'result.planned': 'Scheduled',
      'result.noDate': 'No date assigned',

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
      'toast.scheduleSet': 'Date and time assigned.',
      'toast.scheduleCleared': 'Date and time cleared.',
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
        'Artist and track title are required.'
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
      'Корневой объект данных имеет неверный формат.':
        'The root data object has an invalid format.',
      'localStorage недоступен.':
        'localStorage is unavailable.',
      'Файл для импорта не выбран.':
        'No import file was selected.',
      'Файл не является корректным JSON.':
        'The file is not valid JSON.',
      'HEX-код должен выглядеть так: #422680.':
        'The HEX code must look like this: #422680.'
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
