'use strict';

(function createContentIdeaStorage(global) {
  const STORAGE_KEY = 'contentIdeaOrganizer.state.v1';
  const RECOVERY_KEY =
    'contentIdeaOrganizer.state.v1.recovery';
  const COLLECTION_NAMES = [
    'ideas',
    'conceptCategories',
    'concepts',
    'musicCategories',
    'music',
    'results',
  ];


  function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function requireObject(value, message) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(message);
    }
  }

  function requireString(value, message) {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(message);
    }

    return value.trim();
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

  function normalizeStatusChangedAt(value, status) {
    if (status === 'active') {
      return null;
    }

    if (
      typeof value === 'string' &&
      !Number.isNaN(Date.parse(value))
    ) {
      return value;
    }

    return new Date().toISOString();
  }

  function normalizeTimestamp(value) {
    if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
      return new Date().toISOString();
    }

    return value;
  }

  function normalizeResultDate(value) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value !== 'string') {
      throw new Error('Дата этапа результата имеет неверный формат.');
    }

    const safeValue = value.trim();
    const datetimeLocalPattern =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/;

    if (
      !datetimeLocalPattern.test(safeValue) ||
      Number.isNaN(Date.parse(safeValue))
    ) {
      throw new Error('Дата этапа результата имеет неверный формат.');
    }

    return safeValue;
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

  function normalizeCategoryColor(value, fallbackIndex = 0) {
    const safeValue = String(value ?? '').trim();

    if (/^#[0-9a-fA-F]{6}$/.test(safeValue)) {
      return safeValue.toLowerCase();
    }

    return categoryColorPalette[
      Math.abs(Number(fallbackIndex) || 0) % categoryColorPalette.length
    ];
  }

  function normalizeRating(value) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return 0;
    }

    return Math.min(10, Math.max(0, Math.round(numericValue)));
  }

  function assertUniqueIds(items, collectionName) {
    const ids = new Set();

    items.forEach((item) => {
      if (ids.has(item.id)) {
        throw new Error(
          `В коллекции «${collectionName}» найден повторяющийся ID.`
        );
      }

      ids.add(item.id);
    });
  }

  function getLocalStorage() {
    try {
      return global.localStorage ?? null;
    } catch {
      return null;
    }
  }

  function isAvailable() {
    const localStorage = getLocalStorage();

    if (!localStorage) {
      return false;
    }

    const testKey = `${STORAGE_KEY}.availability-test`;

    try {
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  function normalizeState(rawState) {
    requireObject(rawState, 'Корневой объект данных имеет неверный формат.');

    COLLECTION_NAMES.forEach((collectionName) => {
      const isOptionalLegacyCollection =
        collectionName === 'musicCategories';

      if (
        !Array.isArray(rawState[collectionName]) &&
        !isOptionalLegacyCollection
      ) {
        throw new Error(
          `В файле отсутствует массив «${collectionName}».`
        );
      }
    });

    const ideas = rawState.ideas.map((rawItem, index) => {
      requireObject(rawItem, `Идея №${index + 1} имеет неверный формат.`);

      return {
        id: requireString(
          rawItem.id,
          `У идеи №${index + 1} отсутствует ID.`
        ),
        text: requireString(
          rawItem.text,
          `У идеи №${index + 1} отсутствует текст.`
        ),
        url: normalizeOptionalUrl(rawItem.url),
        workflowStatus:
          normalizeWorkflowStatus(
            rawItem.workflowStatus
          ),
        statusChangedAt:
          normalizeStatusChangedAt(
            rawItem.statusChangedAt,
            normalizeWorkflowStatus(
              rawItem.workflowStatus
            )
          ),
        createdAt: normalizeTimestamp(rawItem.createdAt),
        ...(rawItem.updatedAt
          ? { updatedAt: normalizeTimestamp(rawItem.updatedAt) }
          : {}),
      };
    });

    const conceptCategories = rawState.conceptCategories.map(
      (rawItem, index) => {
        requireObject(
          rawItem,
          `Категория №${index + 1} имеет неверный формат.`
        );

        return {
          id: requireString(
            rawItem.id,
            `У категории №${index + 1} отсутствует ID.`
          ),
          name: requireString(
            rawItem.name,
            `У категории №${index + 1} отсутствует название.`
          ),
          color: normalizeCategoryColor(rawItem.color, index),
          createdAt: normalizeTimestamp(rawItem.createdAt),
          ...(rawItem.updatedAt
            ? { updatedAt: normalizeTimestamp(rawItem.updatedAt) }
            : {}),
        };
      }
    );

    const categoryIds = new Set(
      conceptCategories.map((category) => category.id)
    );

    const concepts = rawState.concepts.map((rawItem, index) => {
      requireObject(
        rawItem,
        `Концепт №${index + 1} имеет неверный формат.`
      );

      const categoryId =
        rawItem.categoryId === null ||
        rawItem.categoryId === undefined ||
        rawItem.categoryId === ''
          ? null
          : requireString(
              rawItem.categoryId,
              `У концепта №${index + 1} неверная категория.`
            );

      if (categoryId && !categoryIds.has(categoryId)) {
        throw new Error(
          `Концепт №${index + 1} ссылается на отсутствующую категорию.`
        );
      }

      return {
        id: requireString(
          rawItem.id,
          `У концепта №${index + 1} отсутствует ID.`
        ),
        text: requireString(
          rawItem.text,
          `У концепта №${index + 1} отсутствует текст.`
        ),
        categoryId,
        url: normalizeOptionalUrl(rawItem.url),
        workflowStatus:
          normalizeWorkflowStatus(
            rawItem.workflowStatus
          ),
        statusChangedAt:
          normalizeStatusChangedAt(
            rawItem.statusChangedAt,
            normalizeWorkflowStatus(
              rawItem.workflowStatus
            )
          ),
        createdAt: normalizeTimestamp(rawItem.createdAt),
        ...(rawItem.updatedAt
          ? { updatedAt: normalizeTimestamp(rawItem.updatedAt) }
          : {}),
      };
    });

    const musicCategories = (
      Array.isArray(rawState.musicCategories)
        ? rawState.musicCategories
        : []
    ).map((rawItem, index) => {
      requireObject(
        rawItem,
        `Категория музыки №${index + 1} имеет неверный формат.`
      );

      return {
        id: requireString(
          rawItem.id,
          `У категории музыки №${index + 1} отсутствует ID.`
        ),
        name: requireString(
          rawItem.name,
          `У категории музыки №${index + 1} отсутствует название.`
        ),
        color: normalizeCategoryColor(rawItem.color, index),
        createdAt: normalizeTimestamp(rawItem.createdAt),
        ...(rawItem.updatedAt
          ? { updatedAt: normalizeTimestamp(rawItem.updatedAt) }
          : {}),
      };
    });

    const musicCategoryIds = new Set(
      musicCategories.map((category) => category.id)
    );

    const music = rawState.music.map((rawItem, index) => {
      requireObject(
        rawItem,
        `Композиция №${index + 1} имеет неверный формат.`
      );

      const categoryId =
        rawItem.categoryId === null ||
        rawItem.categoryId === undefined ||
        rawItem.categoryId === ''
          ? null
          : requireString(
              rawItem.categoryId,
              `У композиции №${index + 1} неверная категория.`
            );

      if (categoryId && !musicCategoryIds.has(categoryId)) {
        throw new Error(
          `Композиция №${index + 1} ссылается на отсутствующую категорию.`
        );
      }

      return {
        id: requireString(
          rawItem.id,
          `У композиции №${index + 1} отсутствует ID.`
        ),
        artist:
          typeof rawItem.artist === 'string'
            ? rawItem.artist.trim()
            : '',
        title: requireString(
          rawItem.title,
          `У композиции №${index + 1} отсутствует название.`
        ),
        categoryId,
        url: normalizeOptionalUrl(rawItem.url),
        workflowStatus:
          normalizeWorkflowStatus(
            rawItem.workflowStatus
          ),
        statusChangedAt:
          normalizeStatusChangedAt(
            rawItem.statusChangedAt,
            normalizeWorkflowStatus(
              rawItem.workflowStatus
            )
          ),
        createdAt: normalizeTimestamp(rawItem.createdAt),
        ...(rawItem.updatedAt
          ? { updatedAt: normalizeTimestamp(rawItem.updatedAt) }
          : {}),
      };
    });

    [
      ['ideas', ideas],
      ['conceptCategories', conceptCategories],
      ['concepts', concepts],
      ['musicCategories', musicCategories],
      ['music', music],
    ].forEach(([collectionName, items]) => {
      assertUniqueIds(items, collectionName);
    });

    const ideaIds = new Set(ideas.map((item) => item.id));
    const conceptIds = new Set(concepts.map((item) => item.id));
    const musicIds = new Set(music.map((item) => item.id));

    const results = rawState.results.map((rawItem, index) => {
      requireObject(
        rawItem,
        `Результат №${index + 1} имеет неверный формат.`
      );

      const ideaId = requireString(
        rawItem.ideaId,
        `У результата №${index + 1} отсутствует идея.`
      );
      const conceptId = requireString(
        rawItem.conceptId,
        `У результата №${index + 1} отсутствует концепт.`
      );
      const musicId = requireString(
        rawItem.musicId,
        `У результата №${index + 1} отсутствует музыка.`
      );

      if (!ideaIds.has(ideaId)) {
        throw new Error(
          `Результат №${index + 1} ссылается на отсутствующую идею.`
        );
      }

      if (!conceptIds.has(conceptId)) {
        throw new Error(
          `Результат №${index + 1} ссылается на отсутствующий концепт.`
        );
      }

      if (!musicIds.has(musicId)) {
        throw new Error(
          `Результат №${index + 1} ссылается на отсутствующую музыку.`
        );
      }

      const importance = normalizeRating(rawItem.importance);
      const desire = normalizeRating(rawItem.desire);

      return {
        id: requireString(
          rawItem.id,
          `У результата №${index + 1} отсутствует ID.`
        ),
        ideaId,
        conceptId,
        musicId,
        title:
          typeof rawItem.title === 'string' &&
          rawItem.title.trim()
            ? rawItem.title.trim().slice(0, 80)
            : null,
        importance,
        desire,
        score: importance * 2 + desire,
        plannedExecutionAt: normalizeResultDate(
          rawItem.plannedExecutionAt
        ),
        completedAt: normalizeResultDate(
          rawItem.completedAt ?? rawItem.scheduledAt
        ),
        plannedPublicationAt: normalizeResultDate(
          rawItem.plannedPublicationAt
        ),
        publishedAt: normalizeResultDate(
          rawItem.publishedAt
        ),
        workflowStatus:
          normalizeWorkflowStatus(
            rawItem.workflowStatus
          ),
        statusChangedAt:
          normalizeStatusChangedAt(
            rawItem.statusChangedAt,
            normalizeWorkflowStatus(
              rawItem.workflowStatus
            )
          ),
        createdAt: normalizeTimestamp(rawItem.createdAt),
        ...(rawItem.updatedAt
          ? { updatedAt: normalizeTimestamp(rawItem.updatedAt) }
          : {}),
      };
    });

    assertUniqueIds(results, 'results');

    return {
      ideas,
      conceptCategories,
      concepts,
      musicCategories,
      music,
      results,
    };
  }

  function replaceState(targetState, nextState) {
    const normalizedState = normalizeState(nextState);

    COLLECTION_NAMES.forEach((collectionName) => {
      targetState[collectionName] = cloneData(
        normalizedState[collectionName]
      );
    });

    return targetState;
  }

  function save(state) {
    const localStorage = getLocalStorage();

    if (!localStorage) {
      throw new Error('localStorage недоступен.');
    }

    const normalizedState = normalizeState(state);
    const serializedState =
      JSON.stringify(normalizedState);

    const previousState =
      localStorage.getItem(STORAGE_KEY);

    if (
      previousState &&
      previousState !== serializedState
    ) {
      try {
        const parsedPrevious =
          JSON.parse(previousState);

        normalizeState(parsedPrevious);

        try {
          localStorage.setItem(
            RECOVERY_KEY,
            previousState
          );
        } catch (error) {
          console.warn(
            'Не удалось обновить recovery snapshot.',
            error
          );
        }
      } catch {
        // Never replace the recovery slot with corrupted data.
      }
    }

    localStorage.setItem(
      STORAGE_KEY,
      serializedState
    );

    return true;
  }

  function load(targetState) {
    const localStorage = getLocalStorage();

    if (!localStorage || !isAvailable()) {
      return {
        loaded: false,
        error: null,
        unavailable: true,
      };
    }

    try {
      const serializedState = localStorage.getItem(STORAGE_KEY);

      if (!serializedState) {
        return {
          loaded: false,
          error: null,
          unavailable: false,
        };
      }

      const parsedState = JSON.parse(serializedState);
      replaceState(targetState, parsedState);

      return {
        loaded: true,
        error: null,
        unavailable: false,
      };
    } catch (error) {
      return {
        loaded: false,
        error,
        unavailable: false,
      };
    }
  }

  function loadRecovery(targetState) {
    const localStorage = getLocalStorage();

    if (!localStorage) {
      return {
        loaded: false,
        error: null,
        unavailable: true,
      };
    }

    try {
      const serializedState =
        localStorage.getItem(RECOVERY_KEY);

      if (!serializedState) {
        return {
          loaded: false,
          error: null,
          unavailable: false,
        };
      }

      replaceState(
        targetState,
        JSON.parse(serializedState)
      );

      return {
        loaded: true,
        error: null,
        unavailable: false,
      };
    } catch (error) {
      return {
        loaded: false,
        error,
        unavailable: false,
      };
    }
  }

  function clear() {
    const localStorage = getLocalStorage();

    if (!localStorage || !isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }

  function createBackupPayload(state) {
    return {
      app: 'c-manager',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: normalizeState(state),
    };
  }

  function downloadBackup(state) {
    const payload = createBackupPayload(state);
    const serializedPayload = JSON.stringify(payload, null, 2);
    const blob = new Blob([serializedPayload], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-');

    const link = document.createElement('a');
    link.href = url;
    link.download =
      `c-manager-backup-${timestamp}.json`;
    document.body.append(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  async function readBackupFile(file) {
    if (!(file instanceof File)) {
      throw new Error('Файл для импорта не выбран.');
    }

    const text = await file.text();
    let parsedPayload;

    try {
      parsedPayload = JSON.parse(text);
    } catch {
      throw new Error('Файл не является корректным JSON.');
    }

    const rawState =
      parsedPayload &&
      typeof parsedPayload === 'object' &&
      parsedPayload.data
        ? parsedPayload.data
        : parsedPayload;

    return normalizeState(rawState);
  }

  const autosaveSubscriptions =
    new WeakMap();

  function enableAutosave(
    stateApi,
    onError = null
  ) {
    if (!isAvailable()) {
      return false;
    }

    if (
      !stateApi ||
      typeof stateApi.subscribe !== 'function'
    ) {
      throw new Error(
        'State API does not support subscriptions.'
      );
    }

    if (autosaveSubscriptions.has(stateApi)) {
      return true;
    }

    const unsubscribe =
      stateApi.subscribe(() => {
        try {
          save(stateApi.state);
        } catch (error) {
          if (typeof onError === 'function') {
            onError(error);
          } else {
            console.error(
              'Не удалось автоматически сохранить данные.',
              error
            );
          }
        }
      });

    autosaveSubscriptions.set(
      stateApi,
      unsubscribe
    );

    return true;
  }

  function disableAutosave(stateApi) {
    const unsubscribe =
      autosaveSubscriptions.get(stateApi);

    if (!unsubscribe) {
      return false;
    }

    unsubscribe();
    autosaveSubscriptions.delete(stateApi);
    return true;
  }

  global.ContentIdeaStorage = {
    STORAGE_KEY,
    RECOVERY_KEY,
    normalizeState,
    replaceState,
    save,
    load,
    loadRecovery,
    clear,
    isAvailable,
    downloadBackup,
    readBackupFile,
    enableAutosave,
    disableAutosave,
  };
})(window);
