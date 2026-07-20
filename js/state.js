'use strict';

(function createContentIdeaState(global) {
  const initialState = {
    ideas: [],
    conceptCategories: [],
    concepts: [],
    music: [],
    results: [],
  };

  const state = structuredClone(initialState);

  function createId(prefix = 'item') {
    const randomPart = Math.random().toString(36).slice(2, 8);
    const timePart = Date.now().toString(36);

    return `${prefix}_${timePart}_${randomPart}`;
  }

  function createTimestamp() {
    return new Date().toISOString();
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

    const item = {
      ...itemData,
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

  function deleteItem(collectionName, itemId) {
    const collection = getCollection(collectionName);
    const itemIndex = collection.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return null;
    }

    const [deletedItem] = collection.splice(itemIndex, 1);
    return deletedItem;
  }

  function addIdea(text) {
    const safeText = String(text).trim();

    if (!safeText) {
      throw new Error('Текст идеи не может быть пустым.');
    }

    return addItem('ideas', { text: safeText });
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

  function addConcept(text, categoryId = null) {
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
    });
  }

  function addMusic(artist, title) {
    const safeArtist = String(artist).trim();
    const safeTitle = String(title).trim();

    if (!safeArtist || !safeTitle) {
      throw new Error('Исполнитель и название композиции обязательны.');
    }

    return addItem('music', {
      artist: safeArtist,
      title: safeTitle,
    });
  }

  function addResult({
    ideaId,
    conceptId,
    musicId,
    title = null,
    importance = 0,
    desire = 0,
    scheduledAt = null,
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
      scheduledAt,
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

  function updateResultSchedule(resultId, scheduledAt) {
    return updateItem('results', resultId, {
      scheduledAt: scheduledAt || null,
    });
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

    addMusic('Queen', 'Bohemian Rhapsody — remix');
    addMusic('Frank Sinatra', 'My Way');
    addMusic('Wonder Girls', 'Rewind — sped up');
    addMusic('Magnetic', 'City Night Remix');
    addMusic('Moshi Moshi', 'Original');
  }

  global.ContentIdeaState = {
    state,
    createId,
    calculateScore,
    addItem,
    getItemById,
    updateItem,
    deleteItem,
    addIdea,
    normalizeCategoryColor,
    getSuggestedCategoryColor,
    addConceptCategory,
    updateConceptCategory,
    deleteConceptCategory,
    addConcept,
    addMusic,
    addResult,
    updateResultTitle,
    findDuplicateResult,
    updateResultSchedule,
    updateResultScore,
    deleteResultsByReference,
    resetState,
    seedDemoData,
  };
})(window);
