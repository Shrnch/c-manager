'use strict';

(function createContentIdeaState(global) {
  const initialState = {
    ideas: [],
    conceptCategories: [],
    concepts: [],
    musicCategories: [],
    music: [],
    results: [],
  };

  const state = structuredClone(initialState);

  const WORKFLOW_COLLECTIONS = new Set([
    'ideas',
    'concepts',
    'music',
    'results',
  ]);

  const WORKFLOW_STATUSES = new Set([
    'active',
    'completed',
    'archived',
  ]);

  function normalizeWorkflowStatus(value) {
    return WORKFLOW_STATUSES.has(value)
      ? value
      : 'active';
  }

  function createId(prefix = 'item') {
    const randomPart = Math.random().toString(36).slice(2, 8);
    const timePart = Date.now().toString(36);

    return `${prefix}_${timePart}_${randomPart}`;
  }

  function createTimestamp() {
    return new Date().toISOString();
  }

  function createLocalDateTimeValue(date = new Date()) {
    const safeDate =
      date instanceof Date
        ? date
        : new Date(date);

    if (Number.isNaN(safeDate.getTime())) {
      throw new TypeError('Некорректная дата.');
    }

    const pad = (value) =>
      String(value).padStart(2, '0');

    return [
      safeDate.getFullYear(),
      '-',
      pad(safeDate.getMonth() + 1),
      '-',
      pad(safeDate.getDate()),
      'T',
      pad(safeDate.getHours()),
      ':',
      pad(safeDate.getMinutes()),
    ].join('');
  }

  function calculateScore(importance, desire) {
    const safeImportance = Number(importance);
    const safeDesire = Number(desire);

    if (!Number.isFinite(safeImportance) || !Number.isFinite(safeDesire)) {
      throw new TypeError('Важность и желание должны быть числами.');
    }

    return safeImportance * 2 + safeDesire;
  }

  function getCollection(collectionName) {
    const collection = state[collectionName];

    if (!Array.isArray(collection)) {
      throw new Error(`Неизвестная коллекция: ${collectionName}`);
    }

    return collection;
  }

  function addItem(collectionName, itemData) {
    const collection = getCollection(collectionName);

    if (!itemData || typeof itemData !== 'object') {
      throw new TypeError('Данные элемента должны быть объектом.');
    }

    const workflowFields =
      WORKFLOW_COLLECTIONS.has(collectionName)
        ? {
            workflowStatus: normalizeWorkflowStatus(
              itemData.workflowStatus
            ),
            statusChangedAt:
              itemData.statusChangedAt ?? null,
          }
        : {};

    const item = {
      ...itemData,
      ...workflowFields,
      id: itemData.id ?? createId(collectionName),
      createdAt: itemData.createdAt ?? createTimestamp(),
    };

    collection.push(item);
    return item;
  }

  function getItemById(collectionName, itemId) {
    return getCollection(collectionName)
      .find((item) => item.id === itemId) ?? null;
  }

  function updateItem(collectionName, itemId, changes) {
    const collection = getCollection(collectionName);
    const itemIndex = collection.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return null;
    }

    if (!changes || typeof changes !== 'object') {
      throw new TypeError('Изменения должны быть объектом.');
    }

    const updatedItem = {
      ...collection[itemIndex],
      ...changes,
      id: collection[itemIndex].id,
      createdAt: collection[itemIndex].createdAt,
      updatedAt: createTimestamp(),
    };

    collection[itemIndex] = updatedItem;
    return updatedItem;
  }

  function setWorkflowStatus(
    collectionName,
    itemId,
    status
  ) {
    if (!WORKFLOW_COLLECTIONS.has(collectionName)) {
      throw new Error(
        'Эта коллекция не поддерживает статусы.'
      );
    }

    const safeStatus = normalizeWorkflowStatus(status);

    if (safeStatus !== status) {
      throw new Error('Неизвестный статус элемента.');
    }

    return updateItem(collectionName, itemId, {
      workflowStatus: safeStatus,
      statusChangedAt:
        safeStatus === 'active'
          ? null
          : createTimestamp(),
    });
  }

  function deleteItem(collectionName, itemId) {
    const collection = getCollection(collectionName);
    const itemIndex = collection.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return null;
    }

    const [deletedItem] = collection.splice(itemIndex, 1);
    return deletedItem;
  }

  function normalizeOptionalUrl(value) {
    const rawValue = String(value ?? '').trim();

    if (!rawValue) {
      return null;
    }

    if (rawValue.length > 2048) {
      throw new Error(
        'Ссылка не может быть длиннее 2048 символов.'
      );
    }

    const candidate = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(
      rawValue
    )
      ? rawValue
      : `https://${rawValue}`;

    let parsedUrl;

    try {
      parsedUrl = new URL(candidate);
    } catch {
      throw new Error(
        'Укажи корректную ссылку, например https://example.com.'
      );
    }

    if (
      parsedUrl.protocol !== 'http:' &&
      parsedUrl.protocol !== 'https:'
    ) {
      throw new Error(
        'Разрешены только ссылки http:// и https://.'
      );
    }

    return parsedUrl.href;
  }

  function addIdea(text, url = null) {
    const safeText = String(text).trim();

    if (!safeText) {
      throw new Error('Текст идеи не может быть пустым.');
    }

    return addItem('ideas', {
      text: safeText,
      url: normalizeOptionalUrl(url),
    });
  }

  const categoryColorPalette = [
    '#6552c7',
    '#2f8066',
    '#bf642f',
    '#2e70aa',
    '#a44870',
    '#80651f',
    '#8a4fb0',
    '#3f7c91',
  ];

  function normalizeCategoryColor(color, fallbackIndex = 0) {
    const safeColor = String(color ?? '').trim();

    if (/^#[0-9a-fA-F]{6}$/.test(safeColor)) {
      return safeColor.toLowerCase();
    }

    return categoryColorPalette[
      Math.abs(Number(fallbackIndex) || 0) % categoryColorPalette.length
    ];
  }

  function getSuggestedCategoryColor() {
    return normalizeCategoryColor(
      null,
      state.conceptCategories.length
    );
  }

  function getSuggestedMusicCategoryColor() {
    return normalizeCategoryColor(
      null,
      state.musicCategories.length
    );
  }

  function addConceptCategory(name, color = null) {
    const safeName = String(name).trim();

    if (!safeName) {
      throw new Error('Название категории не может быть пустым.');
    }

    const duplicate = state.conceptCategories.some(
      (category) => category.name.toLowerCase() === safeName.toLowerCase()
    );

    if (duplicate) {
      throw new Error('Категория с таким названием уже существует.');
    }

    return addItem('conceptCategories', {
      name: safeName,
      color: normalizeCategoryColor(
        color,
        state.conceptCategories.length
      ),
    });
  }

  function updateConceptCategory(categoryId, name, color = null) {
    const safeName = String(name).trim();
    const currentCategory = getItemById(
      'conceptCategories',
      categoryId
    );

    if (!currentCategory) {
      return null;
    }

    if (!safeName) {
      throw new Error('Название категории не может быть пустым.');
    }

    const duplicate = state.conceptCategories.some(
      (category) =>
        category.id !== categoryId &&
        category.name.toLowerCase() === safeName.toLowerCase()
    );

    if (duplicate) {
      throw new Error('Категория с таким названием уже существует.');
    }

    return updateItem('conceptCategories', categoryId, {
      name: safeName,
      color: normalizeCategoryColor(
        color ?? currentCategory.color,
        state.conceptCategories.indexOf(currentCategory)
      ),
    });
  }

  function deleteConceptCategory(categoryId) {
    state.concepts.forEach((concept) => {
      if (concept.categoryId === categoryId) {
        concept.categoryId = null;
        concept.updatedAt = createTimestamp();
      }
    });

    return deleteItem('conceptCategories', categoryId);
  }

  function addConcept(text, categoryId = null, url = null) {
    const safeText = String(text).trim();

    if (!safeText) {
      throw new Error('Текст концепта не может быть пустым.');
    }

    if (
      categoryId !== null &&
      !getItemById('conceptCategories', categoryId)
    ) {
      throw new Error('Указанная категория концепта не существует.');
    }

    return addItem('concepts', {
      text: safeText,
      categoryId,
      url: normalizeOptionalUrl(url),
    });
  }

  function addMusicCategory(name, color = null) {
    const safeName = String(name).trim();

    if (!safeName) {
      throw new Error('Название категории не может быть пустым.');
    }

    const duplicate = state.musicCategories.some(
      (category) =>
        category.name.toLowerCase() === safeName.toLowerCase()
    );

    if (duplicate) {
      throw new Error('Категория с таким названием уже существует.');
    }

    return addItem('musicCategories', {
      name: safeName,
      color: normalizeCategoryColor(
        color,
        state.musicCategories.length
      ),
    });
  }

  function updateMusicCategory(
    categoryId,
    name,
    color = null
  ) {
    const safeName = String(name).trim();
    const currentCategory = getItemById(
      'musicCategories',
      categoryId
    );

    if (!currentCategory) {
      return null;
    }

    if (!safeName) {
      throw new Error('Название категории не может быть пустым.');
    }

    const duplicate = state.musicCategories.some(
      (category) =>
        category.id !== categoryId &&
        category.name.toLowerCase() === safeName.toLowerCase()
    );

    if (duplicate) {
      throw new Error('Категория с таким названием уже существует.');
    }

    return updateItem('musicCategories', categoryId, {
      name: safeName,
      color: normalizeCategoryColor(
        color ?? currentCategory.color,
        state.musicCategories.indexOf(currentCategory)
      ),
    });
  }

  function deleteMusicCategory(categoryId) {
    state.music.forEach((musicItem) => {
      if (musicItem.categoryId === categoryId) {
        musicItem.categoryId = null;
        musicItem.updatedAt = createTimestamp();
      }
    });

    return deleteItem('musicCategories', categoryId);
  }

  function addMusic(
    artist,
    title,
    categoryId = null,
    url = null
  ) {
    const safeArtist = String(artist).trim();
    const safeTitle = String(title).trim();

    if (!safeTitle) {
      throw new Error('Название композиции обязательно.');
    }

    if (
      categoryId !== null &&
      !getItemById('musicCategories', categoryId)
    ) {
      throw new Error('Указанная категория музыки не существует.');
    }

    return addItem('music', {
      artist: safeArtist,
      title: safeTitle,
      categoryId,
      url: normalizeOptionalUrl(url),
    });
  }

  function addResult({
    ideaId,
    conceptId,
    musicId,
    title = null,
    importance = 0,
    desire = 0,
    plannedExecutionAt = null,
    completedAt = null,
    plannedPublicationAt = null,
    publishedAt = null,
  }) {
    if (!getItemById('ideas', ideaId)) {
      throw new Error('Выбранная идея не существует.');
    }

    if (!getItemById('concepts', conceptId)) {
      throw new Error('Выбранный концепт не существует.');
    }

    if (!getItemById('music', musicId)) {
      throw new Error('Выбранная музыка не существует.');
    }

    const safeTitle = String(title ?? '').trim();

    return addItem('results', {
      ideaId,
      conceptId,
      musicId,
      title: safeTitle || null,
      importance: Number(importance),
      desire: Number(desire),
      score: calculateScore(importance, desire),
      plannedExecutionAt,
      completedAt,
      plannedPublicationAt,
      publishedAt,
    });
  }

  function updateResultTitle(resultId, title) {
    const safeTitle = String(title ?? '').trim();

    if (safeTitle.length > 80) {
      throw new Error(
        'Название результата не может быть длиннее 80 символов.'
      );
    }

    return updateItem('results', resultId, {
      title: safeTitle || null,
    });
  }

  function findDuplicateResult(ideaId, conceptId, musicId) {
    return state.results.find(
      (result) =>
        result.ideaId === ideaId &&
        result.conceptId === conceptId &&
        result.musicId === musicId
    ) ?? null;
  }

  const RESULT_TIMELINE_FIELDS = new Set([
    'plannedExecutionAt',
    'plannedPublicationAt',
  ]);

  function updateResultTimelineDate(
    resultId,
    fieldName,
    value
  ) {
    if (!RESULT_TIMELINE_FIELDS.has(fieldName)) {
      throw new Error('Неизвестный этап результата.');
    }

    return updateItem('results', resultId, {
      [fieldName]: value || null,
    });
  }

  function markResultCompleted(
    resultId,
    date = new Date()
  ) {
    const result =
      getItemById('results', resultId);

    if (!result) {
      return null;
    }

    return updateItem('results', resultId, {
      completedAt:
        createLocalDateTimeValue(date),
      workflowStatus: 'completed',
      statusChangedAt: createTimestamp(),
    });
  }

  function markResultPublished(
    resultId,
    date = new Date()
  ) {
    const result =
      getItemById('results', resultId);

    if (!result) {
      return null;
    }

    if (
      !result.completedAt &&
      normalizeWorkflowStatus(
        result.workflowStatus
      ) !== 'completed'
    ) {
      throw new Error(
        'Сначала отметь результат как выполненный.'
      );
    }

    return updateItem('results', resultId, {
      publishedAt:
        createLocalDateTimeValue(date),
    });
  }

  function updateResultSchedule(resultId, scheduledAt) {
    return updateResultTimelineDate(
      resultId,
      'completedAt',
      scheduledAt
    );
  }

  function updateResultScore(resultId, importance, desire) {
    return updateItem('results', resultId, {
      importance: Number(importance),
      desire: Number(desire),
      score: calculateScore(importance, desire),
    });
  }

  function deleteResultsByReference(referenceKey, referenceId) {
    const deletedResults = state.results.filter(
      (result) => result[referenceKey] === referenceId
    );

    state.results = state.results.filter(
      (result) => result[referenceKey] !== referenceId
    );

    return deletedResults;
  }

  function resetState() {
    Object.keys(initialState).forEach((key) => {
      state[key] = [];
    });
  }

  function seedDemoData() {
    const hasExistingData =
      state.ideas.length ||
      state.conceptCategories.length ||
      state.concepts.length ||
      state.music.length;

    if (hasExistingData) {
      return;
    }

    [
      'Использовать только два цвета',
      'Показать процесс до и после',
      'Перерисовать старую работу',
      'Нарисовать за одну минуту',
      'Повторить рисунок по памяти',
    ].forEach(addIdea);

    const categories = {
      characters: addConceptCategory('Персонажи', '#6552c7'),
      animals: addConceptCategory('Животные', '#2f8066'),
      fashion: addConceptCategory('Fashion', '#a44870'),
      games: addConceptCategory('Игры', '#2e70aa'),
      portrait: addConceptCategory('Portrait', '#bf642f'),
    };

    addConcept('Mecha pilots', categories.characters.id);
    addConcept('Динозавры', categories.animals.id);
    addConcept('Red dress', categories.fashion.id);
    addConcept('Dark tower', categories.games.id);
    addConcept('Double decker bus', categories.portrait.id);

    const musicCategories = {
      dramatic: addMusicCategory('Dramatic', '#8a4fb0'),
      classic: addMusicCategory('Classic', '#80651f'),
      retro: addMusicCategory('Retro', '#a44870'),
      electronic: addMusicCategory('Electronic', '#2e70aa'),
    };

    addMusic(
      'Queen',
      'Bohemian Rhapsody — remix',
      musicCategories.dramatic.id
    );
    addMusic(
      'Frank Sinatra',
      'My Way',
      musicCategories.classic.id
    );
    addMusic(
      'Wonder Girls',
      'Rewind — sped up',
      musicCategories.retro.id
    );
    addMusic(
      'Magnetic',
      'City Night Remix',
      musicCategories.electronic.id
    );
    addMusic('Moshi Moshi', 'Original');
  }

  global.ContentIdeaState = {
    state,
    createId,
    calculateScore,
    normalizeWorkflowStatus,
    normalizeOptionalUrl,
    addItem,
    getItemById,
    updateItem,
    setWorkflowStatus,
    deleteItem,
    addIdea,
    normalizeCategoryColor,
    getSuggestedCategoryColor,
    getSuggestedMusicCategoryColor,
    addConceptCategory,
    updateConceptCategory,
    deleteConceptCategory,
    addConcept,
    addMusicCategory,
    updateMusicCategory,
    deleteMusicCategory,
    addMusic,
    addResult,
    updateResultTitle,
    findDuplicateResult,
    updateResultTimelineDate,
    markResultCompleted,
    markResultPublished,
    updateResultSchedule,
    updateResultScore,
    deleteResultsByReference,
    resetState,
    seedDemoData,
  };
})(window);
