'use strict';

const i18n = window.ContentIdeaI18n;
const t = (key, params) =>
  i18n?.t(key, params) ?? key;
const translateError = (error) =>
  i18n?.translateError(error?.message ?? String(error)) ??
  error?.message ??
  String(error);

const stateApi = window.ContentIdeaState;
const renderer = window.ContentIdeaRenderer;
const connections = window.ContentIdeaConnections;
const storage = window.ContentIdeaStorage;

if (!i18n || !stateApi || !renderer || !connections || !storage) {
  console.error(t('errors.loadModules'));
}

const selection = {
  ideaId: null,
  conceptId: null,
  musicId: null,
};

const manualSelectionLocks = {
  ideaId: false,
  conceptId: false,
  musicId: false,
};

const itemModal = document.querySelector('#item-modal');
const itemForm = document.querySelector('#item-form');
const itemFields = document.querySelector('#item-form-fields');
const itemModalTitle = document.querySelector('#item-modal-title');
const itemModalEyebrow = document.querySelector('#item-modal-eyebrow');
const itemSubmitButton = document.querySelector('#item-submit-button');
const itemFormError = document.querySelector('#item-form-error');

const resultNameModal = document.querySelector(
  '#result-name-modal'
);
const resultNameForm = document.querySelector(
  '#result-name-form'
);
const resultNameInput = document.querySelector(
  '#result-name-input'
);
const resultNameError = document.querySelector(
  '#result-name-error'
);

const categoriesModal = document.querySelector('#categories-modal');
const categoriesList = document.querySelector('#categories-list');
const newCategoryInput = document.querySelector('#new-category-name');
const newCategoryColorInput = document.querySelector('#new-category-color');
const newCategoryHexInput = document.querySelector('#new-category-hex');
const categoryFormError = document.querySelector('#category-form-error');

const musicCategoriesModal = document.querySelector(
  '#music-categories-modal'
);
const musicCategoriesList = document.querySelector(
  '#music-categories-list'
);
const newMusicCategoryInput = document.querySelector(
  '#new-music-category-name'
);
const newMusicCategoryColorInput = document.querySelector(
  '#new-music-category-color'
);
const newMusicCategoryHexInput = document.querySelector(
  '#new-music-category-hex'
);
const musicCategoryFormError = document.querySelector(
  '#music-category-form-error'
);

const confirmModal = document.querySelector('#confirm-modal');
const confirmTitle = document.querySelector('#confirm-title');
const confirmText = document.querySelector('#confirm-text');
const confirmActionButton = document.querySelector('#confirm-action-button');
const confirmOptions = document.querySelector(
  '#confirm-options'
);
const confirmOptionsList = document.querySelector(
  '#confirm-options-list'
);

const workspaceView = document.querySelector(
  '#workspace-view'
);
const calendarView = document.querySelector(
  '#calendar-view'
);
const calendarGrid = document.querySelector(
  '#calendar-grid'
);
const calendarDayDetails = document.querySelector(
  '#calendar-day-details'
);
const calendarDayTypeFilter = document.querySelector(
  '#calendar-day-type-filter'
);
const calendarPrevMonth = document.querySelector(
  '#calendar-prev-month'
);
const calendarNextMonth = document.querySelector(
  '#calendar-next-month'
);
const calendarTodayButton = document.querySelector(
  '#calendar-today-button'
);
const statusView = document.querySelector(
  '#status-view'
);
const statusViewTitle = document.querySelector(
  '#status-view-title'
);
const statusViewDescription =
  document.querySelector(
    '#status-view-description'
  );
const statusViewContent = document.querySelector(
  '#status-view-content'
);
const workspaceActions = document.querySelector(
  '#workspace-actions'
);
const completedViewCount =
  document.querySelector(
    '#completed-view-count'
  );
const archivedViewCount =
  document.querySelector(
    '#archived-view-count'
  );

const toast = document.querySelector('#toast');
const previewText = document.querySelector('#selection-preview-text');
const createResultButton = document.querySelector('#create-result-button');
const resultsList = document.querySelector('#results-list');
const resultsSort = document.querySelector('#results-sort');
const resultsStatusFilter = document.querySelector('#results-status-filter');
const resultsCategoryFilter = document.querySelector('#results-category-filter');
const resultsMusicCategoryFilter = document.querySelector(
  '#results-music-category-filter'
);
const conceptColumnCategoryFilter = document.querySelector(
  '#concept-column-category-filter'
);
const musicColumnCategoryFilter = document.querySelector(
  '#music-column-category-filter'
);
const exportDataButton = document.querySelector('#export-data-button');
const importDataButton = document.querySelector('#import-data-button');
const importDataInput = document.querySelector('#import-data-input');
const resetDataButton = document.querySelector('#reset-data-button');
const autosaveBadge = document.querySelector('.autosave-badge');
const autoJumpResultsToggle = document.querySelector(
  '#auto-jump-results-toggle'
);
const relationModeToggle = document.querySelector(
  '#relation-mode-toggle'
);
const languageSelect = document.querySelector(
  '#language-select'
);

let itemModalMode = 'create';
let activeItemType = null;
let activeItemId = null;
let pendingConfirmAction = null;
let pendingResultNameId = null;
let toastTimer = null;
let currentAppView = 'workspace';
let calendarCursor = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  1
);
let calendarSelectedDateKey =
  renderer?.getDateKey?.(new Date()) ?? null;

const resultsView = {
  sortBy: 'score-desc',
  statusFilter: 'all',
  categoryFilter: 'all',
  musicCategoryFilter: 'all',
};

const sourceColumnFilters = {
  conceptCategoryId: 'all',
  musicCategoryId: 'all',
};

const UI_PREFERENCES_KEY =
  'contentIdeaOrganizer.uiPreferences.v1';

const uiPreferences = {
  autoJumpToResults: false,
  relationModeEnabled: false,
  language: 'ru',
};

function loadUiPreferences() {
  try {
    const savedPreferences = JSON.parse(
      window.localStorage.getItem(UI_PREFERENCES_KEY) ?? '{}'
    );

    uiPreferences.autoJumpToResults =
      savedPreferences.autoJumpToResults === true;
    uiPreferences.relationModeEnabled =
      savedPreferences.relationModeEnabled === true;
    uiPreferences.language =
      savedPreferences.language === 'en' ? 'en' : 'ru';
  } catch (error) {
    console.warn(t('errors.loadPreferences'), error);
  }

  i18n.setLanguage(uiPreferences.language);

  if (languageSelect) {
    languageSelect.value = uiPreferences.language;
  }

  if (autoJumpResultsToggle) {
    autoJumpResultsToggle.checked =
      uiPreferences.autoJumpToResults;
  }

  if (relationModeToggle) {
    relationModeToggle.checked =
      uiPreferences.relationModeEnabled;
  }
}

function saveUiPreferences() {
  try {
    window.localStorage.setItem(
      UI_PREFERENCES_KEY,
      JSON.stringify(uiPreferences)
    );
  } catch (error) {
    console.warn(t('errors.savePreferences'), error);
  }
}

const typeConfig = {
  idea: {
    collection: 'ideas',
    selectionKey: 'ideaId',
    resultReferenceKey: 'ideaId',
    createTitleKey: 'item.addIdea',
    editTitleKey: 'item.editIdea',
    eyebrow: 'IDEA',
  },
  concept: {
    collection: 'concepts',
    selectionKey: 'conceptId',
    resultReferenceKey: 'conceptId',
    createTitleKey: 'item.addConcept',
    editTitleKey: 'item.editConcept',
    eyebrow: 'CONCEPT',
  },
  music: {
    collection: 'music',
    selectionKey: 'musicId',
    resultReferenceKey: 'musicId',
    createTitleKey: 'item.addMusic',
    editTitleKey: 'item.editMusic',
    eyebrow: 'MUSIC',
  },
};

function normalizeHexColor(value) {
  const rawValue = String(value ?? '').trim();
  const withHash = rawValue.startsWith('#')
    ? rawValue
    : `#${rawValue}`;
  const normalized = withHash.toUpperCase();

  if (!/^#[0-9A-F]{6}$/.test(normalized)) {
    throw new Error(
      t('errors.hex')
    );
  }

  return normalized;
}

function setNewCategoryColor(color) {
  const normalized = normalizeHexColor(color);

  if (newCategoryColorInput) {
    newCategoryColorInput.value = normalized.toLowerCase();
  }

  if (newCategoryHexInput) {
    newCategoryHexInput.value = normalized;
  }

  return normalized;
}

function setNewMusicCategoryColor(color) {
  const normalized = normalizeHexColor(color);

  if (newMusicCategoryColorInput) {
    newMusicCategoryColorInput.value =
      normalized.toLowerCase();
  }

  if (newMusicCategoryHexInput) {
    newMusicCategoryHexInput.value = normalized;
  }

  return normalized;
}

function showToast(message) {
  if (!toast) return;

  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('toast-visible');

  toastTimer = window.setTimeout(() => {
    toast.classList.remove('toast-visible');
  }, 2600);
}

function closeDialog(dialog) {
  if (dialog?.open) {
    dialog.close();
  }
}

function openConfirmation({
  title,
  text,
  buttonText = t('common.confirm'),
  danger = true,
  options = [],
  action,
}) {
  confirmTitle.textContent = title;
  confirmText.textContent = text;
  confirmActionButton.textContent = buttonText;
  confirmActionButton.classList.toggle(
    'button-danger',
    danger
  );
  confirmActionButton.classList.toggle(
    'button-primary',
    !danger
  );

  confirmOptionsList?.replaceChildren();

  options.forEach((option) => {
    const label = document.createElement('label');
    label.className = 'workflow-option';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = option.value;
    input.checked = option.checked === true;

    const textElement = document.createElement('span');
    textElement.textContent = option.label;

    label.append(input, textElement);
    confirmOptionsList?.append(label);
  });

  if (confirmOptions) {
    confirmOptions.hidden = !options.length;
  }

  pendingConfirmAction = action;
  confirmModal.showModal();
}

function getSelectedItems() {
  return {
    idea: selection.ideaId
      ? stateApi.getItemById('ideas', selection.ideaId)
      : null,
    concept: selection.conceptId
      ? stateApi.getItemById('concepts', selection.conceptId)
      : null,
    music: selection.musicId
      ? stateApi.getItemById('music', selection.musicId)
      : null,
  };
}

function getItemLabel(type, item) {
  if (!item) return null;

  if (type === 'idea' || type === 'concept') {
    return item.text;
  }

  return `${item.artist} — ${item.title}`;
}

function updateSelectionInterface() {
  const selectedItems = getSelectedItems();

  document.querySelectorAll('.content-cell').forEach((cell) => {
    const type = cell.dataset.itemType;
    const itemId = cell.dataset.itemId;
    const config = typeConfig[type];
    const isSelected =
      config && selection[config.selectionKey] === itemId;

    cell.classList.toggle('content-cell-selected', Boolean(isSelected));
    cell.closest('.content-cell-row')?.classList.toggle(
      'content-cell-row-selected',
      Boolean(isSelected)
    );
    cell.setAttribute('aria-pressed', String(Boolean(isSelected)));
  });

  const parts = [
    selectedItems.idea
      ? t('selection.idea', {
          value: getItemLabel('idea', selectedItems.idea)
        })
      : t('selection.ideaMissing'),
    selectedItems.concept
      ? t('selection.concept', {
          value: getItemLabel('concept', selectedItems.concept)
        })
      : t('selection.conceptMissing'),
    selectedItems.music
      ? t('selection.music', {
          value: getItemLabel('music', selectedItems.music)
        })
      : t('selection.musicMissing'),
  ];

  if (previewText) {
    previewText.textContent = parts.join('  •  ');
  }

  if (createResultButton) {
    createResultButton.disabled = !(
      selectedItems.idea &&
      selectedItems.concept &&
      selectedItems.music
    );
  }
}

function clearSelection() {
  selection.ideaId = null;
  selection.conceptId = null;
  selection.musicId = null;

  manualSelectionLocks.ideaId = false;
  manualSelectionLocks.conceptId = false;
  manualSelectionLocks.musicId = false;
}

function clearSelectionForItem(type, itemId) {
  const config = typeConfig[type];

  if (config && selection[config.selectionKey] === itemId) {
    selection[config.selectionKey] = null;
    manualSelectionLocks[config.selectionKey] = false;
  }
}

function toggleSelection(type, itemId) {
  const config = typeConfig[type];
  if (!config) return;

  const selectionKey = config.selectionKey;
  const isDeselecting =
    selection[selectionKey] === itemId;

  selection[selectionKey] =
    isDeselecting ? null : itemId;
  manualSelectionLocks[selectionKey] =
    !isDeselecting;

  updateSelectionInterface();
}

function getWorkflowStatus(item) {
  return item?.workflowStatus ?? 'active';
}

function getActiveResults() {
  return stateApi.state.results.filter(
    (result) =>
      getWorkflowStatus(result) === 'active'
  );
}

function getWorkflowCount(status) {
  return [
    ...stateApi.state.results,
    ...stateApi.state.ideas,
    ...stateApi.state.concepts,
    ...stateApi.state.music,
  ].filter(
    (item) => getWorkflowStatus(item) === status
  ).length;
}

function updateViewCounts() {
  if (completedViewCount) {
    completedViewCount.textContent = String(
      getWorkflowCount('completed')
    );
  }

  if (archivedViewCount) {
    archivedViewCount.textContent = String(
      getWorkflowCount('archived')
    );
  }
}

function updateCalendarDayTypeFilterColor() {
  if (!calendarDayTypeFilter) {
    return;
  }

  const safeType =
    calendarDayTypeFilter.value || 'all';

  calendarDayTypeFilter.dataset.activeType =
    safeType;
}

function renderCalendarView() {
  renderer.renderCalendarView(
    stateApi.state,
    {
      cursorDate: calendarCursor,
      selectedDateKey:
        calendarSelectedDateKey,
    }
  );
}

function moveCalendarMonth(offset) {
  calendarCursor = new Date(
    calendarCursor.getFullYear(),
    calendarCursor.getMonth() + offset,
    1
  );

  calendarSelectedDateKey =
    renderer.getDateKey(calendarCursor);

  renderCalendarView();
}

function showCalendarToday() {
  const today = new Date();

  calendarCursor = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  calendarSelectedDateKey =
    renderer.getDateKey(today);

  renderCalendarView();
}

function resetResultFiltersForCalendarOpen() {
  resultsView.sortBy = 'score-desc';
  resultsView.statusFilter = 'all';
  resultsView.categoryFilter = 'all';
  resultsView.musicCategoryFilter = 'all';

  if (resultsSort) {
    resultsSort.value =
      resultsView.sortBy;
  }

  if (resultsStatusFilter) {
    resultsStatusFilter.value =
      resultsView.statusFilter;
  }

  populateCategoryFilter();
  populateMusicCategoryFilter();
}

function openCalendarResult(
  resultId,
  workflowStatus
) {
  if (workflowStatus === 'completed') {
    setAppView('completed');
    return;
  }

  resetResultFiltersForCalendarOpen();
  setAppView('workspace');
  renderResultsView();

  window.requestAnimationFrame(() => {
    const card = resultsList?.querySelector(
      `.result-card[data-result-id="${resultId}"]`
    );

    if (!card) {
      return;
    }

    card.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    card.classList.add(
      'result-card-calendar-focus'
    );

    window.setTimeout(() => {
      card.classList.remove(
        'result-card-calendar-focus'
      );
    }, 1800);
  });
}

function setAppView(viewName) {
  const safeView = [
    'workspace',
    'calendar',
    'completed',
    'archived',
  ].includes(viewName)
    ? viewName
    : 'workspace';

  currentAppView = safeView;

  if (workspaceView) {
    workspaceView.hidden =
      safeView !== 'workspace';
  }

  if (calendarView) {
    calendarView.hidden =
      safeView !== 'calendar';
  }

  if (statusView) {
    statusView.hidden =
      safeView === 'workspace' ||
      safeView === 'calendar';
  }

  if (workspaceActions) {
    workspaceActions.hidden =
      safeView !== 'workspace';
  }

  document
    .querySelectorAll('[data-app-view]')
    .forEach((button) => {
      button.classList.toggle(
        'view-tab-active',
        button.dataset.appView === safeView
      );
      button.setAttribute(
        'aria-current',
        button.dataset.appView === safeView
          ? 'page'
          : 'false'
      );
    });

  clearCellRelationInspection();

  if (safeView === 'workspace') {
    equalizeBoardRowHeights();
    connections?.scheduleDraw();
    return;
  }

  if (safeView === 'calendar') {
    renderCalendarView();
    return;
  }

  const status = safeView === 'completed'
    ? 'completed'
    : 'archived';

  if (statusViewTitle) {
    statusViewTitle.textContent = t(
      status === 'completed'
        ? 'status.completedTitle'
        : 'status.archiveTitle'
    );
  }

  if (statusViewDescription) {
    statusViewDescription.textContent = t(
      status === 'completed'
        ? 'status.completedDescription'
        : 'status.archiveDescription'
    );
  }

  renderer.renderStatusView(
    stateApi.state,
    status
  );
}

function getResultCategoryId(result) {
  const concept = stateApi.getItemById('concepts', result.conceptId);
  return concept?.categoryId ?? null;
}

function getResultMusicCategoryId(result) {
  const musicItem = stateApi.getItemById(
    'music',
    result.musicId
  );
  return musicItem?.categoryId ?? null;
}

function getVisibleResults() {
  const visibleResults = getActiveResults().filter((result) => {
    const matchesStatus =
      resultsView.statusFilter === 'all' ||
      (resultsView.statusFilter === 'planned' && Boolean(result.plannedExecutionAt)) ||
      (resultsView.statusFilter === 'unscheduled' && !result.plannedExecutionAt);

    const resultCategoryId = getResultCategoryId(result);
    const matchesCategory =
      resultsView.categoryFilter === 'all' ||
      (
        resultsView.categoryFilter === 'uncategorized' &&
        !resultCategoryId
      ) ||
      resultsView.categoryFilter === resultCategoryId;

    const resultMusicCategoryId =
      getResultMusicCategoryId(result);
    const matchesMusicCategory =
      resultsView.musicCategoryFilter === 'all' ||
      (
        resultsView.musicCategoryFilter ===
          'uncategorized' &&
        !resultMusicCategoryId
      ) ||
      resultsView.musicCategoryFilter ===
        resultMusicCategoryId;

    return (
      matchesStatus &&
      matchesCategory &&
      matchesMusicCategory
    );
  });

  const timestamp = (value) => {
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const scheduledTimestamp = (value) => {
    if (!value) {
      return Number.POSITIVE_INFINITY;
    }

    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed)
      ? parsed
      : Number.POSITIVE_INFINITY;
  };

  visibleResults.sort((first, second) => {
    switch (resultsView.sortBy) {
      case 'importance-desc':
        return (
          Number(second.importance) - Number(first.importance) ||
          timestamp(second.createdAt) - timestamp(first.createdAt)
        );

      case 'desire-desc':
        return (
          Number(second.desire) - Number(first.desire) ||
          timestamp(second.createdAt) - timestamp(first.createdAt)
        );

      case 'created-desc':
        return timestamp(second.createdAt) - timestamp(first.createdAt);

      case 'created-asc':
        return timestamp(first.createdAt) - timestamp(second.createdAt);

      case 'scheduled-asc':
        return (
          scheduledTimestamp(first.plannedExecutionAt) -
            scheduledTimestamp(second.plannedExecutionAt) ||
          timestamp(second.createdAt) - timestamp(first.createdAt)
        );

      case 'score-desc':
      default:
        return (
          Number(second.score) - Number(first.score) ||
          timestamp(second.createdAt) - timestamp(first.createdAt)
        );
    }
  });

  return visibleResults;
}

function populateCategoryFilter() {
  if (!resultsCategoryFilter) {
    return;
  }

  const previousValue = resultsView.categoryFilter;
  resultsCategoryFilter.replaceChildren();

  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = t('results.filter.allCategories');
  resultsCategoryFilter.append(allOption);

  stateApi.state.conceptCategories
    .slice()
    .sort((first, second) =>
      first.name.localeCompare(second.name, i18n.getLocale())
    )
    .forEach((category) => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = `● ${category.name}`;
      option.style.color = category.color || '#6552c7';
      resultsCategoryFilter.append(option);
    });

  const uncategorizedOption = document.createElement('option');
  uncategorizedOption.value = 'uncategorized';
  uncategorizedOption.textContent = t('common.uncategorized');
  resultsCategoryFilter.append(uncategorizedOption);

  const validValues = Array.from(resultsCategoryFilter.options).map(
    (option) => option.value
  );

  resultsView.categoryFilter = validValues.includes(previousValue)
    ? previousValue
    : 'all';

  resultsCategoryFilter.value = resultsView.categoryFilter;
}

function populateMusicCategoryFilter() {
  if (!resultsMusicCategoryFilter) {
    return;
  }

  const previousValue =
    resultsView.musicCategoryFilter;
  resultsMusicCategoryFilter.replaceChildren();

  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent =
    t('results.filter.allMusicCategories');
  resultsMusicCategoryFilter.append(allOption);

  stateApi.state.musicCategories
    .slice()
    .sort((first, second) =>
      first.name.localeCompare(
        second.name,
        i18n.getLocale()
      )
    )
    .forEach((category) => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = `● ${category.name}`;
      option.style.color =
        category.color || '#6552c7';
      resultsMusicCategoryFilter.append(option);
    });

  const uncategorizedOption =
    document.createElement('option');
  uncategorizedOption.value = 'uncategorized';
  uncategorizedOption.textContent =
    t('common.uncategorized');
  resultsMusicCategoryFilter.append(
    uncategorizedOption
  );

  const validValues = Array.from(
    resultsMusicCategoryFilter.options
  ).map((option) => option.value);

  resultsView.musicCategoryFilter =
    validValues.includes(previousValue)
      ? previousValue
      : 'all';

  resultsMusicCategoryFilter.value =
    resultsView.musicCategoryFilter;
}

function populateSourceColumnFilters() {
  if (conceptColumnCategoryFilter) {
    const previousValue =
      sourceColumnFilters.conceptCategoryId;

    conceptColumnCategoryFilter.replaceChildren();

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent =
      t('columns.allConceptCategories');
    conceptColumnCategoryFilter.append(allOption);

    stateApi.state.conceptCategories
      .slice()
      .sort((first, second) =>
        first.name.localeCompare(
          second.name,
          i18n.getLocale()
        )
      )
      .forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `● ${category.name}`;
        option.style.color =
          category.color || '#6552c7';
        conceptColumnCategoryFilter.append(option);
      });

    const uncategorizedOption =
      document.createElement('option');
    uncategorizedOption.value = 'uncategorized';
    uncategorizedOption.textContent =
      t('common.uncategorized');
    conceptColumnCategoryFilter.append(
      uncategorizedOption
    );

    const validValues = Array.from(
      conceptColumnCategoryFilter.options
    ).map((option) => option.value);

    sourceColumnFilters.conceptCategoryId =
      validValues.includes(previousValue)
        ? previousValue
        : 'all';

    conceptColumnCategoryFilter.value =
      sourceColumnFilters.conceptCategoryId;
  }

  if (musicColumnCategoryFilter) {
    const previousValue =
      sourceColumnFilters.musicCategoryId;

    musicColumnCategoryFilter.replaceChildren();

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent =
      t('columns.allMusicCategories');
    musicColumnCategoryFilter.append(allOption);

    stateApi.state.musicCategories
      .slice()
      .sort((first, second) =>
        first.name.localeCompare(
          second.name,
          i18n.getLocale()
        )
      )
      .forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `● ${category.name}`;
        option.style.color =
          category.color || '#6552c7';
        musicColumnCategoryFilter.append(option);
      });

    const uncategorizedOption =
      document.createElement('option');
    uncategorizedOption.value = 'uncategorized';
    uncategorizedOption.textContent =
      t('common.uncategorized');
    musicColumnCategoryFilter.append(
      uncategorizedOption
    );

    const validValues = Array.from(
      musicColumnCategoryFilter.options
    ).map((option) => option.value);

    sourceColumnFilters.musicCategoryId =
      validValues.includes(previousValue)
        ? previousValue
        : 'all';

    musicColumnCategoryFilter.value =
      sourceColumnFilters.musicCategoryId;
  }
}

function getVisibleSourceItems() {
  const activeConcepts = stateApi.state.concepts.filter(
    (item) => getWorkflowStatus(item) === 'active'
  );

  const activeMusic = stateApi.state.music.filter(
    (item) => getWorkflowStatus(item) === 'active'
  );

  const concepts = activeConcepts.filter((concept) => {
    const selected =
      sourceColumnFilters.conceptCategoryId;

    return (
      selected === 'all' ||
      (
        selected === 'uncategorized' &&
        !concept.categoryId
      ) ||
      selected === concept.categoryId
    );
  });

  const music = activeMusic.filter((musicItem) => {
    const selected =
      sourceColumnFilters.musicCategoryId;

    return (
      selected === 'all' ||
      (
        selected === 'uncategorized' &&
        !musicItem.categoryId
      ) ||
      selected === musicItem.categoryId
    );
  });

  return { concepts, music };
}

function renderResultsView() {
  renderer.renderResults(stateApi.state, getVisibleResults());
}

let equalizeRowsFrameId = null;

function equalizeBoardRowHeights() {
  window.cancelAnimationFrame(equalizeRowsFrameId);

  equalizeRowsFrameId = window.requestAnimationFrame(() => {
    const rowCollections = [
      Array.from(
        document.querySelectorAll(
          '#ideas-list .content-cell-row'
        )
      ),
      Array.from(
        document.querySelectorAll(
          '#concepts-list .content-cell-row'
        )
      ),
      Array.from(
        document.querySelectorAll(
          '#music-list .content-cell-row'
        )
      ),
    ];

    rowCollections.flat().forEach((row) => {
      row.style.height = 'auto';
    });

    const longestColumnLength = Math.max(
      ...rowCollections.map((rows) => rows.length),
      0
    );

    for (
      let rowIndex = 0;
      rowIndex < longestColumnLength;
      rowIndex += 1
    ) {
      const matchingRows = rowCollections
        .map((rows) => rows[rowIndex])
        .filter(Boolean);

      if (!matchingRows.length) {
        continue;
      }

      const maximumHeight = Math.max(
        ...matchingRows.map((row) =>
          Math.ceil(row.getBoundingClientRect().height)
        )
      );

      matchingRows.forEach((row) => {
        row.style.height = `${maximumHeight}px`;
      });
    }

    connections?.scheduleDraw();
  });
}

function resetViewAndSelection() {
  clearSelection();

  resultsView.sortBy = 'score-desc';
  resultsView.statusFilter = 'all';
  resultsView.categoryFilter = 'all';
  resultsView.musicCategoryFilter = 'all';

  if (resultsSort) {
    resultsSort.value = resultsView.sortBy;
  }

  if (resultsStatusFilter) {
    resultsStatusFilter.value = resultsView.statusFilter;
  }

  if (resultsMusicCategoryFilter) {
    resultsMusicCategoryFilter.value =
      resultsView.musicCategoryFilter;
  }
}

function renderEverything() {
  populateCategoryFilter();
  populateMusicCategoryFilter();
  populateSourceColumnFilters();

  const visibleSourceItems =
    getVisibleSourceItems();

  renderer.renderIdeas(
    stateApi.state.ideas.filter(
      (item) => getWorkflowStatus(item) === 'active'
    )
  );
  renderer.renderConcepts(
    visibleSourceItems.concepts,
    stateApi.state.conceptCategories
  );
  renderer.renderMusic(
    visibleSourceItems.music,
    stateApi.state.musicCategories
  );
  renderer.renderResults(
    stateApi.state,
    getVisibleResults()
  );

  updateViewCounts();

  if (categoriesModal?.open) {
    renderer.renderCategories(
      stateApi.state.conceptCategories,
      stateApi.state.concepts
    );
  }

  if (musicCategoriesModal?.open) {
    renderer.renderMusicCategories(
      stateApi.state.musicCategories,
      stateApi.state.music
    );
  }

  updateSelectionInterface();

  if (currentAppView === 'workspace') {
    equalizeBoardRowHeights();
  } else {
    setAppView(currentAppView);
  }
}

function createField({
  id,
  label,
  value = '',
  placeholder = '',
  type = 'text',
  required = true,
  maxLength = 120,
  autocomplete = 'off',
  inputMode = null,
}) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';

  const labelText = document.createElement('span');
  labelText.textContent = label;

  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.name = id;
  input.value = value;
  input.placeholder = placeholder;
  input.maxLength = maxLength;
  input.required = required;
  input.autocomplete = autocomplete;

  if (inputMode) {
    input.inputMode = inputMode;
  }

  wrapper.append(labelText, input);
  return wrapper;
}

function createOptionalLinkField(id, value = '') {
  const field = createField({
    id,
    label: t('item.linkOptional'),
    value,
    placeholder: t('item.linkPlaceholder'),
    required: false,
    maxLength: 2048,
    autocomplete: 'url',
    inputMode: 'url',
  });

  field.classList.add('optional-link-field');
  return field;
}

function createCategorySelect({
  id,
  categories,
  selectedCategoryId = null,
  label = t('item.category'),
}) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';

  const labelText = document.createElement('span');
  labelText.textContent = label;

  const select = document.createElement('select');
  select.id = id;
  select.name = id;

  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent =
    t('common.uncategorized');
  select.append(emptyOption);

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    option.selected =
      category.id === selectedCategoryId;
    select.append(option);
  });

  wrapper.append(labelText, select);
  return wrapper;
}

function buildItemFields(type, item = null) {
  itemFields.replaceChildren();

  if (type === 'idea') {
    itemFields.append(
      createField({
        id: 'idea-text',
        label: t('item.ideaText'),
        value: item?.text ?? '',
        placeholder: t('item.ideaPlaceholder'),
      }),
      createOptionalLinkField(
        'idea-url',
        item?.url ?? ''
      )
    );
  }

  if (type === 'concept') {
    itemFields.append(
      createField({
        id: 'concept-text',
        label: t('item.conceptName'),
        value: item?.text ?? '',
        placeholder: t('item.conceptPlaceholder'),
      }),
      createCategorySelect({
        id: 'concept-category',
        categories:
          stateApi.state.conceptCategories,
        selectedCategoryId:
          item?.categoryId ?? null,
      }),
      createOptionalLinkField(
        'concept-url',
        item?.url ?? ''
      )
    );
  }

  if (type === 'music') {
    itemFields.append(
      createField({
        id: 'music-artist',
        label: t('item.artist'),
        value: item?.artist ?? '',
        placeholder: t('item.artistPlaceholder'),
      }),
      createField({
        id: 'music-title',
        label: t('item.trackTitle'),
        value: item?.title ?? '',
        placeholder: t('item.trackPlaceholder'),
      }),
      createCategorySelect({
        id: 'music-category',
        categories: stateApi.state.musicCategories,
        selectedCategoryId:
          item?.categoryId ?? null,
        label: t('item.musicCategory'),
      }),
      createOptionalLinkField(
        'music-url',
        item?.url ?? ''
      )
    );
  }
}

function openItemModal(type, mode = 'create', itemId = null) {
  const config = typeConfig[type];
  if (!config) return;

  const item = itemId
    ? stateApi.getItemById(config.collection, itemId)
    : null;

  itemModalMode = mode;
  activeItemType = type;
  activeItemId = itemId;
  itemFormError.textContent = '';

  itemModalEyebrow.textContent = config.eyebrow;
  itemModalTitle.textContent = t(
    mode === 'edit'
      ? config.editTitleKey
      : config.createTitleKey
  );
  itemSubmitButton.textContent =
    mode === 'edit'
      ? t('common.saveChanges')
      : t('common.add');

  buildItemFields(type, item);
  itemModal.showModal();
  itemFields.querySelector('input, select')?.focus();
}

function saveIdea() {
  const text = document.querySelector('#idea-text')?.value ?? '';
  const url = stateApi.normalizeOptionalUrl(
    document.querySelector('#idea-url')?.value ?? ''
  );

  if (itemModalMode === 'edit') {
    if (!text.trim()) {
      throw new Error(t('errors.ideaEmpty'));
    }

    stateApi.updateItem('ideas', activeItemId, {
      text: text.trim(),
      url,
    });
  } else {
    stateApi.addIdea(text, url);
  }
}

function saveConcept() {
  const text = document.querySelector('#concept-text')?.value ?? '';
  const categoryValue =
    document.querySelector('#concept-category')?.value ?? '';

  const changes = {
    text: text.trim(),
    categoryId: categoryValue || null,
    url: stateApi.normalizeOptionalUrl(
      document.querySelector('#concept-url')?.value ?? ''
    ),
  };

  if (!changes.text) {
    throw new Error(t('errors.conceptEmpty'));
  }

  if (itemModalMode === 'edit') {
    stateApi.updateItem('concepts', activeItemId, changes);
  } else {
    stateApi.addConcept(
      changes.text,
      changes.categoryId,
      changes.url
    );
  }
}

function saveMusic() {
  const artist = document.querySelector('#music-artist')?.value ?? '';
  const title = document.querySelector('#music-title')?.value ?? '';
  const categoryValue =
    document.querySelector('#music-category')?.value ?? '';
  const url = stateApi.normalizeOptionalUrl(
    document.querySelector('#music-url')?.value ?? ''
  );

  if (itemModalMode === 'edit') {
    if (!artist.trim() || !title.trim()) {
      throw new Error(t('errors.musicEmpty'));
    }

    stateApi.updateItem('music', activeItemId, {
      artist: artist.trim(),
      title: title.trim(),
      categoryId: categoryValue || null,
      url,
    });
  } else {
    stateApi.addMusic(
      artist,
      title,
      categoryValue || null,
      url
    );
  }
}

function openResultNameModal(resultId) {
  const result = stateApi.getItemById(
    'results',
    resultId
  );

  if (!result || !resultNameModal) {
    return;
  }

  pendingResultNameId = resultId;

  if (resultNameInput) {
    resultNameInput.value = result.title ?? '';
  }

  if (resultNameError) {
    resultNameError.textContent = '';
  }

  resultNameModal.showModal();

  window.requestAnimationFrame(() => {
    resultNameInput?.focus();
    resultNameInput?.select();
  });
}

function createSelectedResult() {
  const selectedItems = getSelectedItems();

  if (!selectedItems.idea || !selectedItems.concept || !selectedItems.music) {
    return;
  }

  const createdResult = stateApi.addResult({
    ideaId: selectedItems.idea.id,
    conceptId: selectedItems.concept.id,
    musicId: selectedItems.music.id,
  });

  clearSelection();
  renderEverything();
  showToast(t('toast.resultSaved'));

  window.setTimeout(() => {
    openResultNameModal(createdResult.id);
  }, 0);

  if (uiPreferences.autoJumpToResults) {
    document.querySelector('.results-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

function requestItemDelete(type, itemId) {
  const config = typeConfig[type];
  const item = stateApi.getItemById(config.collection, itemId);

  if (!item) return;

  const usedResults = stateApi.state.results.filter(
    (result) => result[config.resultReferenceKey] === itemId
  );

  openConfirmation({
    title: t('dialog.deleteItem.title'),
    text: t(
      usedResults.length
        ? 'dialog.deleteItem.used'
        : 'dialog.deleteItem.unused',
      {
        name: getItemLabel(type, item),
        count: usedResults.length
      }
    ),
    buttonText: t('common.delete'),
    danger: true,
    action: () => {
      stateApi.deleteResultsByReference(
        config.resultReferenceKey,
        itemId
      );
      stateApi.deleteItem(config.collection, itemId);
      clearSelectionForItem(type, itemId);
      renderEverything();
      showToast(t('toast.itemDeleted'));
    },
  });
}

function requestCategoryDelete(categoryId) {
  const category = stateApi.getItemById('conceptCategories', categoryId);
  if (!category) return;

  const usedCount = stateApi.state.concepts.filter(
    (concept) => concept.categoryId === categoryId
  ).length;

  openConfirmation({
    title: t('dialog.deleteCategory.title'),
    text: t(
      usedCount
        ? 'dialog.deleteCategory.used'
        : 'dialog.deleteCategory.unused',
      {
        name: category.name,
        count: usedCount
      }
    ),
    buttonText: t('common.delete'),
    danger: true,
    action: () => {
      stateApi.deleteConceptCategory(categoryId);
      renderEverything();
      showToast(t('toast.categoryDeleted'));
    },
  });
}

function requestMusicCategoryDelete(categoryId) {
  const category = stateApi.getItemById(
    'musicCategories',
    categoryId
  );
  if (!category) return;

  const usedCount = stateApi.state.music.filter(
    (musicItem) =>
      musicItem.categoryId === categoryId
  ).length;

  openConfirmation({
    title: t('dialog.deleteMusicCategory.title'),
    text: t(
      usedCount
        ? 'dialog.deleteMusicCategory.used'
        : 'dialog.deleteMusicCategory.unused',
      {
        name: category.name,
        count: usedCount
      }
    ),
    buttonText: t('common.delete'),
    danger: true,
    action: () => {
      stateApi.deleteMusicCategory(categoryId);
      renderEverything();
      showToast(t('toast.musicCategoryDeleted'));
    },
  });
}

function requestResultWorkflowChange(
  resultId,
  targetStatus
) {
  const result = stateApi.getItemById(
    'results',
    resultId
  );

  if (!result) {
    return;
  }

  const idea = stateApi.getItemById(
    'ideas',
    result.ideaId
  );
  const concept = stateApi.getItemById(
    'concepts',
    result.conceptId
  );
  const music = stateApi.getItemById(
    'music',
    result.musicId
  );

  const isArchive =
    targetStatus === 'archived';

  openConfirmation({
    title: t(
      isArchive
        ? 'workflow.archiveTitle'
        : 'workflow.completeTitle'
    ),
    text: t(
      isArchive
        ? 'workflow.archiveText'
        : 'workflow.completeText'
    ),
    buttonText: t(
      isArchive
        ? 'result.archive'
        : 'result.markCompleted'
    ),
    danger: isArchive,
    options: [
      {
        value: 'idea',
        label: t('workflow.alsoIdea', {
          name:
            idea?.text ??
            t('result.deletedIdea'),
        }),
      },
      {
        value: 'concept',
        label: t('workflow.alsoConcept', {
          name:
            concept?.text ??
            t('result.deletedConcept'),
        }),
      },
      {
        value: 'music',
        label: t('workflow.alsoMusic', {
          name: music
            ? `${music.artist} — ${music.title}`
            : t('result.deletedMusic'),
        }),
      },
    ],
    action: (selectedOptions) => {
      if (isArchive) {
        stateApi.setWorkflowStatus(
          'results',
          resultId,
          targetStatus
        );
      } else {
        stateApi.markResultCompleted(
          resultId
        );
      }

      const sourceMap = {
        idea: {
          collection: 'ideas',
          id: result.ideaId,
          type: 'idea',
        },
        concept: {
          collection: 'concepts',
          id: result.conceptId,
          type: 'concept',
        },
        music: {
          collection: 'music',
          id: result.musicId,
          type: 'music',
        },
      };

      selectedOptions.forEach((optionName) => {
        const source = sourceMap[optionName];

        if (!source) {
          return;
        }

        stateApi.setWorkflowStatus(
          source.collection,
          source.id,
          targetStatus
        );
        clearSelectionForItem(
          source.type,
          source.id
        );
      });

      renderEverything();
      showToast(
        t(
          isArchive
            ? 'toast.resultArchived'
            : 'toast.resultCompleted'
        )
      );
    },
  });
}

function renameResult(resultId) {
  const result = stateApi.getItemById('results', resultId);

  if (!result) {
    return;
  }

  const newTitle = window.prompt(
    t('dialog.renameResult.prompt'),
    result.title ?? ''
  );

  if (newTitle === null) {
    return;
  }

  try {
    stateApi.updateResultTitle(resultId, newTitle);
    renderResultsView();
    showToast(
      newTitle.trim()
        ? t('toast.resultRenamed')
        : t('toast.resultDefaultName')
    );
  } catch (error) {
    showToast(translateError(error));
  }
}

function requestResultDelete(resultId) {
  const result = stateApi.getItemById('results', resultId);
  if (!result) return;

  openConfirmation({
    title: t('dialog.deleteResult.title'),
    text: t('dialog.deleteResult.text'),
    buttonText: t('common.delete'),
    danger: true,
    action: () => {
      stateApi.deleteItem('results', resultId);
      renderEverything();
      showToast(t('toast.resultDeleted'));
    },
  });
}

document.querySelector('#add-idea-button')?.addEventListener('click', () => {
  openItemModal('idea');
});

document.querySelector('#add-concept-button')?.addEventListener('click', () => {
  openItemModal('concept');
});

document.querySelector('#add-music-button')?.addEventListener('click', () => {
  openItemModal('music');
});

resultNameForm?.addEventListener(
  'submit',
  (event) => {
    event.preventDefault();

    if (!pendingResultNameId) {
      closeDialog(resultNameModal);
      return;
    }

    try {
      const newTitle =
        resultNameInput?.value ?? '';

      stateApi.updateResultTitle(
        pendingResultNameId,
        newTitle
      );

      closeDialog(resultNameModal);
      renderResultsView();

      showToast(
        newTitle.trim()
          ? t('toast.resultRenamed')
          : t('toast.resultDefaultName')
      );
    } catch (error) {
      if (resultNameError) {
        resultNameError.textContent =
          translateError(error);
      }
    }
  }
);

resultNameModal?.addEventListener(
  'close',
  () => {
    pendingResultNameId = null;

    if (resultNameInput) {
      resultNameInput.value = '';
    }

    if (resultNameError) {
      resultNameError.textContent = '';
    }
  }
);

document.querySelector('#manage-categories-button')?.addEventListener('click', () => {
  categoryFormError.textContent = '';
  newCategoryInput.value = '';

  if (newCategoryColorInput || newCategoryHexInput) {
    setNewCategoryColor(
      stateApi.getSuggestedCategoryColor()
    );
  }

  renderer.renderCategories(
    stateApi.state.conceptCategories,
    stateApi.state.concepts
  );
  categoriesModal.showModal();
});

document
  .querySelector('#manage-music-categories-button')
  ?.addEventListener('click', () => {
    musicCategoryFormError.textContent = '';
    newMusicCategoryInput.value = '';

    if (
      newMusicCategoryColorInput ||
      newMusicCategoryHexInput
    ) {
      setNewMusicCategoryColor(
        stateApi.getSuggestedMusicCategoryColor()
      );
    }

    renderer.renderMusicCategories(
      stateApi.state.musicCategories,
      stateApi.state.music
    );
    musicCategoriesModal.showModal();
  });

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    closeDialog(document.querySelector(`#${button.dataset.closeDialog}`));
  });
});

itemForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  itemFormError.textContent = '';

  try {
    if (activeItemType === 'idea') saveIdea();
    if (activeItemType === 'concept') saveConcept();
    if (activeItemType === 'music') saveMusic();

    renderEverything();
    closeDialog(itemModal);
    showToast(
      itemModalMode === 'edit'
        ? t('toast.itemSaved')
        : t('toast.itemAdded')
    );
  } catch (error) {
    itemFormError.textContent = translateError(error);
  }
});

const boardElement = document.querySelector('.board');

const resultReferenceByItemType = {
  idea: 'ideaId',
  concept: 'conceptId',
  music: 'musicId',
};

function clearCellRelationInspection() {
  boardElement?.classList.remove(
    'relation-inspection-active'
  );
  resultsList?.classList.remove(
    'relation-inspection-active'
  );

  document
    .querySelectorAll(
      '.relation-cell-active, ' +
        '.relation-cell-source, ' +
        '.relation-cell-muted'
    )
    .forEach((row) => {
      row.classList.remove(
        'relation-cell-active',
        'relation-cell-source',
        'relation-cell-muted'
      );
      row.removeAttribute('title');
    });

  document
    .querySelectorAll(
      '.relation-result-active, .relation-result-muted'
    )
    .forEach((card) => {
      card.classList.remove(
        'relation-result-active',
        'relation-result-muted'
      );
    });

  connections?.clearActiveResult();
}

function inspectCellRelations(sourceRow) {
  const itemType = sourceRow?.dataset.itemType;
  const itemId = sourceRow?.dataset.itemId;
  const referenceKey =
    resultReferenceByItemType[itemType];

  if (!referenceKey || !itemId) {
    clearCellRelationInspection();
    return;
  }

  const relatedResults = getActiveResults().filter(
    (result) => result[referenceKey] === itemId
  );

  if (!relatedResults.length) {
    clearCellRelationInspection();
    sourceRow.title = t('relations.count', { count: 0 });
    return;
  }

  const relatedResultIds = new Set(
    relatedResults.map((result) => result.id)
  );

  const relatedItemIds = {
    idea: new Set(),
    concept: new Set(),
    music: new Set(),
  };

  relatedResults.forEach((result) => {
    relatedItemIds.idea.add(result.ideaId);
    relatedItemIds.concept.add(result.conceptId);
    relatedItemIds.music.add(result.musicId);
  });

  relatedItemIds[itemType].add(itemId);

  boardElement?.classList.add(
    'relation-inspection-active'
  );
  resultsList?.classList.add(
    'relation-inspection-active'
  );

  document
    .querySelectorAll('.content-cell-row')
    .forEach((row) => {
      const rowType = row.dataset.itemType;
      const rowId = row.dataset.itemId;
      const isRelated =
        relatedItemIds[rowType]?.has(rowId) ?? false;
      const isSource =
        rowType === itemType && rowId === itemId;

      row.classList.toggle(
        'relation-cell-active',
        isRelated
      );
      row.classList.toggle(
        'relation-cell-source',
        isSource
      );
      row.classList.toggle(
        'relation-cell-muted',
        !isRelated
      );

      if (isSource) {
        row.title = t('relations.count', {
          count: relatedResults.length
        });
      } else {
        row.removeAttribute('title');
      }
    });

  resultsList
    ?.querySelectorAll('.result-card')
    .forEach((card) => {
      const isRelated = relatedResultIds.has(
        card.dataset.resultId
      );

      card.classList.toggle(
        'relation-result-active',
        isRelated
      );
      card.classList.toggle(
        'relation-result-muted',
        !isRelated
      );
    });

  connections?.setActiveResults(
    Array.from(relatedResultIds)
  );
}

boardElement?.addEventListener('pointerover', (event) => {
  if (!uiPreferences.relationModeEnabled) {
    return;
  }

  const row = event.target.closest('.content-cell-row');

  if (!row || row.contains(event.relatedTarget)) {
    return;
  }

  inspectCellRelations(row);
});

boardElement?.addEventListener('pointerout', (event) => {
  if (!uiPreferences.relationModeEnabled) {
    return;
  }

  const row = event.target.closest('.content-cell-row');

  if (!row || row.contains(event.relatedTarget)) {
    return;
  }

  clearCellRelationInspection();
});

boardElement?.addEventListener('focusin', (event) => {
  if (!uiPreferences.relationModeEnabled) {
    return;
  }

  const row = event.target.closest('.content-cell-row');

  if (row) {
    inspectCellRelations(row);
  }
});

boardElement?.addEventListener('focusout', (event) => {
  if (!uiPreferences.relationModeEnabled) {
    return;
  }

  const row = event.target.closest('.content-cell-row');

  if (
    row &&
    !row.contains(event.relatedTarget)
  ) {
    clearCellRelationInspection();
  }
});

document.querySelector('.board')?.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]');

  if (actionButton) {
    const row = actionButton.closest('.content-cell-row');
    const type = row?.dataset.itemType;
    const itemId = row?.dataset.itemId;

    if (!type || !itemId) return;

    if (actionButton.dataset.action === 'edit') {
      openItemModal(type, 'edit', itemId);
    }

    if (actionButton.dataset.action === 'delete') {
      requestItemDelete(type, itemId);
    }

    return;
  }

  const cell = event.target.closest('.content-cell');
  if (!cell) return;

  toggleSelection(cell.dataset.itemType, cell.dataset.itemId);
});

document.querySelector('#add-category-button')?.addEventListener('click', () => {
  categoryFormError.textContent = '';

  try {
    const categoryColor = normalizeHexColor(
      newCategoryHexInput?.value ||
        newCategoryColorInput?.value
    );

    stateApi.addConceptCategory(
      newCategoryInput.value,
      categoryColor
    );
    newCategoryInput.value = '';

    setNewCategoryColor(
      stateApi.getSuggestedCategoryColor()
    );

    renderer.renderCategories(
      stateApi.state.conceptCategories,
      stateApi.state.concepts
    );
    showToast(t('toast.categoryAdded'));
  } catch (error) {
    categoryFormError.textContent = translateError(error);
  }
});

newCategoryColorInput?.addEventListener('input', () => {
  categoryFormError.textContent = '';

  if (newCategoryHexInput) {
    newCategoryHexInput.value =
      newCategoryColorInput.value.toUpperCase();
  }
});

newCategoryHexInput?.addEventListener('input', () => {
  const rawValue = newCategoryHexInput.value
    .replace(/\s/g, '')
    .toUpperCase();

  newCategoryHexInput.value = rawValue;

  try {
    const normalized = normalizeHexColor(rawValue);
    categoryFormError.textContent = '';

    if (newCategoryColorInput) {
      newCategoryColorInput.value =
        normalized.toLowerCase();
    }
  } catch {
    // Пока пользователь печатает, ошибку не показываем.
  }
});

newCategoryHexInput?.addEventListener('change', () => {
  try {
    setNewCategoryColor(newCategoryHexInput.value);
    categoryFormError.textContent = '';
  } catch (error) {
    categoryFormError.textContent = translateError(error);
    newCategoryHexInput.focus();
    newCategoryHexInput.select();
  }
});

newCategoryInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.querySelector('#add-category-button')?.click();
  }
});

categoriesList?.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-category-action]');
  if (!actionButton) return;

  const row = actionButton.closest('.category-row');
  const categoryId = row?.dataset.categoryId;
  const category = stateApi.getItemById('conceptCategories', categoryId);

  if (!category) return;

  if (actionButton.dataset.categoryAction === 'edit') {
    const newName = window.prompt(
      t('dialog.renameCategory.prompt'),
      category.name
    );

    if (newName === null) return;

    try {
      stateApi.updateConceptCategory(
        categoryId,
        newName,
        category.color
      );
      renderEverything();
      categoryFormError.textContent = '';
      showToast(t('toast.categoryRenamed'));
    } catch (error) {
      categoryFormError.textContent = translateError(error);
    }
  }

  if (actionButton.dataset.categoryAction === 'delete') {
    requestCategoryDelete(categoryId);
  }
});

categoriesList?.addEventListener('input', (event) => {
  const hexInput = event.target.closest(
    '[data-category-action="color-hex"]'
  );

  if (!hexInput) {
    return;
  }

  hexInput.value = hexInput.value
    .replace(/\s/g, '')
    .toUpperCase();

  try {
    const normalized = normalizeHexColor(hexInput.value);
    const editor = hexInput.closest('.category-color-editor');
    const picker = editor?.querySelector(
      '[data-category-action="color-picker"]'
    );

    if (picker) {
      picker.value = normalized.toLowerCase();
    }

    categoryFormError.textContent = '';
  } catch {
    // Не мешаем пользователю допечатать код.
  }
});

categoriesList?.addEventListener('change', (event) => {
  const colorControl = event.target.closest(
    '[data-category-action="color-picker"], ' +
      '[data-category-action="color-hex"]'
  );

  if (!colorControl) {
    return;
  }

  const row = colorControl.closest('.category-row');
  const categoryId = row?.dataset.categoryId;
  const category = stateApi.getItemById(
    'conceptCategories',
    categoryId
  );

  if (!category) {
    return;
  }

  const editor = colorControl.closest('.category-color-editor');
  const picker = editor?.querySelector(
    '[data-category-action="color-picker"]'
  );
  const hexInput = editor?.querySelector(
    '[data-category-action="color-hex"]'
  );

  try {
    const normalized =
      colorControl.dataset.categoryAction === 'color-picker'
        ? normalizeHexColor(colorControl.value)
        : normalizeHexColor(hexInput?.value);

    if (picker) {
      picker.value = normalized.toLowerCase();
    }

    if (hexInput) {
      hexInput.value = normalized;
    }

    stateApi.updateConceptCategory(
      categoryId,
      category.name,
      normalized
    );

    categoryFormError.textContent = '';
    renderEverything();
    showToast(t('toast.categoryColorSaved'));
  } catch (error) {
    categoryFormError.textContent = translateError(error);

    if (picker) {
      picker.value = category.color;
    }

    if (hexInput) {
      hexInput.value = category.color.toUpperCase();
      hexInput.focus();
      hexInput.select();
    }
  }
});

document
  .querySelector('#add-music-category-button')
  ?.addEventListener('click', () => {
    musicCategoryFormError.textContent = '';

    try {
      const categoryColor = normalizeHexColor(
        newMusicCategoryHexInput?.value ||
          newMusicCategoryColorInput?.value
      );

      stateApi.addMusicCategory(
        newMusicCategoryInput.value,
        categoryColor
      );
      newMusicCategoryInput.value = '';

      setNewMusicCategoryColor(
        stateApi.getSuggestedMusicCategoryColor()
      );

      renderer.renderMusicCategories(
        stateApi.state.musicCategories,
        stateApi.state.music
      );
      populateMusicCategoryFilter();
      showToast(t('toast.musicCategoryAdded'));
    } catch (error) {
      musicCategoryFormError.textContent =
        translateError(error);
    }
  });

newMusicCategoryColorInput?.addEventListener(
  'input',
  () => {
    musicCategoryFormError.textContent = '';

    if (newMusicCategoryHexInput) {
      newMusicCategoryHexInput.value =
        newMusicCategoryColorInput.value.toUpperCase();
    }
  }
);

newMusicCategoryHexInput?.addEventListener(
  'input',
  () => {
    const rawValue = newMusicCategoryHexInput.value
      .replace(/\s/g, '')
      .toUpperCase();

    newMusicCategoryHexInput.value = rawValue;

    try {
      const normalized = normalizeHexColor(rawValue);
      musicCategoryFormError.textContent = '';

      if (newMusicCategoryColorInput) {
        newMusicCategoryColorInput.value =
          normalized.toLowerCase();
      }
    } catch {
      // Не мешаем пользователю допечатать код.
    }
  }
);

newMusicCategoryHexInput?.addEventListener(
  'change',
  () => {
    try {
      setNewMusicCategoryColor(
        newMusicCategoryHexInput.value
      );
      musicCategoryFormError.textContent = '';
    } catch (error) {
      musicCategoryFormError.textContent =
        translateError(error);
      newMusicCategoryHexInput.focus();
      newMusicCategoryHexInput.select();
    }
  }
);

newMusicCategoryInput?.addEventListener(
  'keydown',
  (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      document
        .querySelector('#add-music-category-button')
        ?.click();
    }
  }
);

musicCategoriesList?.addEventListener(
  'click',
  (event) => {
    const actionButton = event.target.closest(
      '[data-music-category-action]'
    );
    if (!actionButton) return;

    const row = actionButton.closest('.category-row');
    const categoryId = row?.dataset.categoryId;
    const category = stateApi.getItemById(
      'musicCategories',
      categoryId
    );

    if (!category) return;

    if (
      actionButton.dataset.musicCategoryAction ===
      'edit'
    ) {
      const newName = window.prompt(
        t('dialog.renameMusicCategory.prompt'),
        category.name
      );

      if (newName === null) return;

      try {
        stateApi.updateMusicCategory(
          categoryId,
          newName,
          category.color
        );
        renderEverything();
        musicCategoryFormError.textContent = '';
        showToast(t('toast.musicCategoryRenamed'));
      } catch (error) {
        musicCategoryFormError.textContent =
          translateError(error);
      }
    }

    if (
      actionButton.dataset.musicCategoryAction ===
      'delete'
    ) {
      requestMusicCategoryDelete(categoryId);
    }
  }
);

musicCategoriesList?.addEventListener(
  'input',
  (event) => {
    const hexInput = event.target.closest(
      '[data-music-category-action="color-hex"]'
    );

    if (!hexInput) {
      return;
    }

    hexInput.value = hexInput.value
      .replace(/\s/g, '')
      .toUpperCase();

    try {
      const normalized = normalizeHexColor(
        hexInput.value
      );
      const editor = hexInput.closest(
        '.category-color-editor'
      );
      const picker = editor?.querySelector(
        '[data-music-category-action="color-picker"]'
      );

      if (picker) {
        picker.value = normalized.toLowerCase();
      }

      musicCategoryFormError.textContent = '';
    } catch {
      // Не мешаем пользователю допечатать код.
    }
  }
);

musicCategoriesList?.addEventListener(
  'change',
  (event) => {
    const colorControl = event.target.closest(
      '[data-music-category-action="color-picker"], ' +
        '[data-music-category-action="color-hex"]'
    );

    if (!colorControl) {
      return;
    }

    const row = colorControl.closest('.category-row');
    const categoryId = row?.dataset.categoryId;
    const category = stateApi.getItemById(
      'musicCategories',
      categoryId
    );

    if (!category) {
      return;
    }

    const editor = colorControl.closest(
      '.category-color-editor'
    );
    const picker = editor?.querySelector(
      '[data-music-category-action="color-picker"]'
    );
    const hexInput = editor?.querySelector(
      '[data-music-category-action="color-hex"]'
    );

    try {
      const normalized =
        colorControl.dataset.musicCategoryAction ===
        'color-picker'
          ? normalizeHexColor(colorControl.value)
          : normalizeHexColor(hexInput?.value);

      if (picker) {
        picker.value = normalized.toLowerCase();
      }

      if (hexInput) {
        hexInput.value = normalized;
      }

      stateApi.updateMusicCategory(
        categoryId,
        category.name,
        normalized
      );

      musicCategoryFormError.textContent = '';
      renderEverything();
      showToast(
        t('toast.musicCategoryColorSaved')
      );
    } catch (error) {
      musicCategoryFormError.textContent =
        translateError(error);

      if (picker) {
        picker.value = category.color;
      }

      if (hexInput) {
        hexInput.value =
          category.color.toUpperCase();
        hexInput.focus();
        hexInput.select();
      }
    }
  }
);

confirmActionButton?.addEventListener('click', () => {
  const selectedOptions = new Set(
    Array.from(
      confirmOptionsList?.querySelectorAll(
        'input[type="checkbox"]:checked'
      ) ?? []
    ).map((input) => input.value)
  );

  if (typeof pendingConfirmAction === 'function') {
    pendingConfirmAction(selectedOptions);
  }

  pendingConfirmAction = null;
  closeDialog(confirmModal);
});

languageSelect?.addEventListener('change', () => {
  const openItemValues = {};

  if (itemModal?.open) {
    itemFields
      .querySelectorAll('input, select')
      .forEach((control) => {
        openItemValues[control.id] = control.value;
      });
  }

  uiPreferences.language =
    languageSelect.value === 'en' ? 'en' : 'ru';
  i18n.setLanguage(uiPreferences.language);
  saveUiPreferences();

  renderEverything();

  if (itemModal?.open && activeItemType) {
    const config = typeConfig[activeItemType];
    const item = activeItemId
      ? stateApi.getItemById(
          config.collection,
          activeItemId
        )
      : null;

    itemModalTitle.textContent = t(
      itemModalMode === 'edit'
        ? config.editTitleKey
        : config.createTitleKey
    );
    itemSubmitButton.textContent =
      itemModalMode === 'edit'
        ? t('common.saveChanges')
        : t('common.add');

    buildItemFields(activeItemType, item);

    Object.entries(openItemValues).forEach(
      ([controlId, value]) => {
        const control = document.getElementById(controlId);

        if (control) {
          control.value = value;
        }
      }
    );
  }

  showToast(t('toast.languageChanged'));
});

autoJumpResultsToggle?.addEventListener(
  'change',
  () => {
    uiPreferences.autoJumpToResults =
      autoJumpResultsToggle.checked;
    saveUiPreferences();

    showToast(
      uiPreferences.autoJumpToResults
        ? t('toast.autoJumpOn')
        : t('toast.autoJumpOff')
    );
  }
);


relationModeToggle?.addEventListener(
  'change',
  () => {
    uiPreferences.relationModeEnabled =
      relationModeToggle.checked;
    saveUiPreferences();
    clearCellRelationInspection();

    showToast(
      uiPreferences.relationModeEnabled
        ? t('toast.relationsOn')
        : t('toast.relationsOff')
    );
  }
);

exportDataButton?.addEventListener('click', () => {
  try {
    storage.downloadBackup(stateApi.state);
    showToast(t('toast.exported'));
  } catch (error) {
    console.error(error);
    showToast(t('toast.exportFailed'));
  }
});

importDataButton?.addEventListener('click', () => {
  importDataInput?.click();
});

importDataInput?.addEventListener('change', async () => {
  const [file] = Array.from(importDataInput.files ?? []);

  if (!file) {
    return;
  }

  try {
    const importedState = await storage.readBackupFile(file);

    openConfirmation({
      title: t('dialog.import.title'),
      text:
        t('dialog.import.text'),
      buttonText: t('dialog.import.button'),
      danger: false,
      action: () => {
        storage.replaceState(stateApi.state, importedState);

        if (storage.isAvailable()) {
          storage.save(stateApi.state);
        }

        resetViewAndSelection();
        renderEverything();
        showToast(
          storage.isAvailable()
            ? t('toast.imported')
            : t('toast.importedNoAutosave')
        );
      },
    });
  } catch (error) {
    console.error(error);
    showToast(
      t('toast.importFailed', {
        error: translateError(error)
      })
    );
  } finally {
    importDataInput.value = '';
  }
});

resetDataButton?.addEventListener('click', () => {
  openConfirmation({
    title: t('dialog.reset.title'),
    text:
      t('dialog.reset.text'),
    buttonText: t('dialog.reset.button'),
    danger: true,
    action: () => {
      stateApi.resetState();
      resetViewAndSelection();
      renderEverything();
      showToast(t('toast.reset'));
    },
  });
});

resultsSort?.addEventListener('change', () => {
  resultsView.sortBy = resultsSort.value;
  renderResultsView();
});

resultsStatusFilter?.addEventListener('change', () => {
  resultsView.statusFilter = resultsStatusFilter.value;
  renderResultsView();
});

resultsCategoryFilter?.addEventListener('change', () => {
  resultsView.categoryFilter = resultsCategoryFilter.value;
  renderResultsView();
});

resultsMusicCategoryFilter?.addEventListener(
  'change',
  () => {
    resultsView.musicCategoryFilter =
      resultsMusicCategoryFilter.value;
    renderResultsView();
  }
);

conceptColumnCategoryFilter?.addEventListener(
  'change',
  () => {
    sourceColumnFilters.conceptCategoryId =
      conceptColumnCategoryFilter.value;
    renderEverything();
  }
);

musicColumnCategoryFilter?.addEventListener(
  'change',
  () => {
    sourceColumnFilters.musicCategoryId =
      musicColumnCategoryFilter.value;
    renderEverything();
  }
);

function getRandomItem(items, currentId = null) {
  if (!Array.isArray(items) || !items.length) {
    return null;
  }

  const alternativeItems =
    currentId && items.length > 1
      ? items.filter(
          (item) => item.id !== currentId
        )
      : items;

  const pool = alternativeItems.length
    ? alternativeItems
    : items;

  const randomIndex = Math.floor(
    Math.random() * pool.length
  );

  return pool[randomIndex];
}

function brieflyHighlightRandomSelection() {
  document
    .querySelectorAll('.content-cell-selected')
    .forEach((cell) => {
      cell.classList.remove('content-cell-random');
      void cell.offsetWidth;
      cell.classList.add('content-cell-random');
    });

  window.setTimeout(() => {
    document
      .querySelectorAll('.content-cell-random')
      .forEach((cell) => {
        cell.classList.remove('content-cell-random');
      });
  }, 700);
}

document.querySelector('#random-button')?.addEventListener('click', () => {
  const visibleSourceItems =
    getVisibleSourceItems();

  const activeIdeas = stateApi.state.ideas.filter(
    (item) => getWorkflowStatus(item) === 'active'
  );

  const needsIdea =
    !manualSelectionLocks.ideaId;
  const needsConcept =
    !manualSelectionLocks.conceptId;
  const needsMusic =
    !manualSelectionLocks.musicId;

  if (!needsIdea && !needsConcept && !needsMusic) {
    showToast(t('toast.randomEverythingLocked'));
    return;
  }

  const missingColumns = [];

  if (needsIdea && !activeIdeas.length) {
    missingColumns.push(t('random.ideas'));
  }

  if (
    needsConcept &&
    !visibleSourceItems.concepts.length
  ) {
    missingColumns.push(t('random.concepts'));
  }

  if (
    needsMusic &&
    !visibleSourceItems.music.length
  ) {
    missingColumns.push(t('random.music'));
  }

  if (missingColumns.length) {
    showToast(
      t('toast.randomUnavailable', {
        columns: missingColumns.join(', ')
      })
    );
    return;
  }

  if (needsIdea) {
    selection.ideaId =
      getRandomItem(
        activeIdeas,
        selection.ideaId
      ).id;
  }

  if (needsConcept) {
    selection.conceptId =
      getRandomItem(
        visibleSourceItems.concepts,
        selection.conceptId
      ).id;
  }

  if (needsMusic) {
    selection.musicId =
      getRandomItem(
        visibleSourceItems.music,
        selection.musicId
      ).id;
  }

  if (needsIdea) {
    manualSelectionLocks.ideaId = false;
  }

  if (needsConcept) {
    manualSelectionLocks.conceptId = false;
  }

  if (needsMusic) {
    manualSelectionLocks.musicId = false;
  }

  updateSelectionInterface();
  brieflyHighlightRandomSelection();

  const randomizedCount = [
    needsIdea,
    needsConcept,
    needsMusic,
  ].filter(Boolean).length;

  showToast(
    t('toast.randomFilledEmpty', {
      count: randomizedCount
    })
  );
});

createResultButton?.addEventListener('click', () => {
  const duplicate = stateApi.findDuplicateResult(
    selection.ideaId,
    selection.conceptId,
    selection.musicId
  );

  if (duplicate) {
    openConfirmation({
      title: t('dialog.duplicate.title'),
      text: t('dialog.duplicate.text'),
      buttonText: t('dialog.duplicate.button'),
      danger: false,
      action: createSelectedResult,
    });
    return;
  }

  createSelectedResult();
});

calendarPrevMonth?.addEventListener(
  'click',
  () => {
    moveCalendarMonth(-1);
  }
);

calendarNextMonth?.addEventListener(
  'click',
  () => {
    moveCalendarMonth(1);
  }
);

calendarTodayButton?.addEventListener(
  'click',
  () => {
    showCalendarToday();
  }
);

calendarGrid?.addEventListener(
  'click',
  (event) => {
    const day = event.target.closest(
      '[data-calendar-date]'
    );

    if (!day) {
      return;
    }

    calendarSelectedDateKey =
      day.dataset.calendarDate;

    const selectedDate =
      new Date(
        `${calendarSelectedDateKey}T12:00`
      );

    if (
      !Number.isNaN(
        selectedDate.getTime()
      ) &&
      (
        selectedDate.getMonth() !==
          calendarCursor.getMonth() ||
        selectedDate.getFullYear() !==
          calendarCursor.getFullYear()
      )
    ) {
      calendarCursor = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
    }

    renderCalendarView();
  }
);

calendarDayTypeFilter?.addEventListener(
  'change',
  () => {
    updateCalendarDayTypeFilterColor();
    renderCalendarView();
  }
);

calendarDayDetails?.addEventListener(
  'click',
  (event) => {
    const button = event.target.closest(
      '[data-calendar-result-action="open"]'
    );

    if (!button) {
      return;
    }

    openCalendarResult(
      button.dataset.resultId,
      button.dataset.workflowStatus
    );
  }
);

document
  .querySelector('.view-tabs')
  ?.addEventListener('click', (event) => {
    const button = event.target.closest(
      '[data-app-view]'
    );

    if (!button) {
      return;
    }

    setAppView(button.dataset.appView);
  });

statusViewContent?.addEventListener(
  'change',
  (event) => {
    const input = event.target.closest(
      '[data-status-action="publication-date"]'
    );

    if (!input) {
      return;
    }

    const resultId =
      input.dataset.itemId;

    if (!resultId) {
      return;
    }

    stateApi.updateResultTimelineDate(
      resultId,
      'plannedPublicationAt',
      input.value
    );

    renderEverything();
    showToast(
      input.value
        ? t('toast.publicationPlanUpdated')
        : t('toast.publicationPlanCleared')
    );
  }
);

statusViewContent?.addEventListener(
  'click',
  (event) => {
    const publishButton =
      event.target.closest(
        '[data-status-action="mark-published"]'
      );

    if (publishButton) {
      const resultId =
        publishButton.dataset.itemId;

      if (!resultId) {
        return;
      }

      try {
        stateApi.markResultPublished(
          resultId
        );
        renderEverything();
        showToast(
          t('toast.resultPublished')
        );
      } catch (error) {
        showToast(translateError(error));
      }

      return;
    }

    const button = event.target.closest(
      '[data-status-action="restore"]'
    );

    if (!button) {
      return;
    }

    const collectionName =
      button.dataset.collection;
    const itemId = button.dataset.itemId;

    if (!collectionName || !itemId) {
      return;
    }

    stateApi.setWorkflowStatus(
      collectionName,
      itemId,
      'active'
    );

    renderEverything();
    showToast(t('toast.restoredToWork'));
  }
);

resultsList?.addEventListener('pointerover', (event) => {
  const card = event.target.closest('.result-card');

  if (!card || card.contains(event.relatedTarget)) {
    return;
  }

  connections?.setActiveResult(
    card.dataset.resultId,
    true
  );
});

resultsList?.addEventListener('pointerout', (event) => {
  const card = event.target.closest('.result-card');

  if (!card || card.contains(event.relatedTarget)) {
    return;
  }

  connections?.clearActiveResult();
});

resultsList?.addEventListener('focusin', (event) => {
  const card = event.target.closest('.result-card');

  if (card) {
    connections?.setActiveResult(
      card.dataset.resultId,
      true
    );
  }
});

resultsList?.addEventListener('focusout', (event) => {
  const card = event.target.closest('.result-card');

  if (
    card &&
    !card.contains(event.relatedTarget)
  ) {
    connections?.clearActiveResult();
  }
});

resultsList?.addEventListener('click', (event) => {
  const action = event.target.closest('[data-result-action]');
  if (!action) return;

  const card = action.closest('.result-card');
  const resultId = card?.dataset.resultId;

  if (!resultId) return;

  if (
    action.dataset.resultAction ===
    'mark-completed'
  ) {
    requestResultWorkflowChange(
      resultId,
      'completed'
    );
    return;
  }

  if (
    action.dataset.resultAction === 'archive'
  ) {
    requestResultWorkflowChange(
      resultId,
      'archived'
    );
    return;
  }

  if (action.dataset.resultAction === 'rename') {
    renameResult(resultId);
    return;
  }

  if (action.dataset.resultAction === 'delete') {
    requestResultDelete(resultId);
  }
});

resultsList?.addEventListener('input', (event) => {
  const slider = event.target.closest(
    '[data-result-action="importance"], [data-result-action="desire"]'
  );

  if (!slider) return;

  const card = slider.closest('.result-card');
  const resultId = card?.dataset.resultId;

  if (!resultId) return;

  const importanceInput = card.querySelector(
    '[data-result-action="importance"]'
  );
  const desireInput = card.querySelector(
    '[data-result-action="desire"]'
  );

  const importance = Number(importanceInput?.value ?? 0);
  const desire = Number(desireInput?.value ?? 0);
  const updatedResult = stateApi.updateResultScore(
    resultId,
    importance,
    desire
  );

  if (!updatedResult) return;

  const importanceOutput = card.querySelector(
    '[data-rating-output="importance"]'
  );
  const desireOutput = card.querySelector(
    '[data-rating-output="desire"]'
  );
  const scoreOutput = card.querySelector('[data-result-score]');

  if (importanceOutput) {
    importanceOutput.textContent = String(updatedResult.importance);
  }

  if (desireOutput) {
    desireOutput.textContent = String(updatedResult.desire);
  }

  if (scoreOutput) {
    scoreOutput.textContent = String(updatedResult.score);
  }

  importanceInput?.setAttribute(
    'aria-label',
    t('result.ratingValue', {
      label: t('result.importance'),
      value: updatedResult.importance
    })
  );
  desireInput?.setAttribute(
    'aria-label',
    t('result.ratingValue', {
      label: t('result.desire'),
      value: updatedResult.desire
    })
  );
});

resultsList?.addEventListener('change', (event) => {
  const ratingInput = event.target.closest(
    '[data-result-action="importance"], [data-result-action="desire"]'
  );

  if (
    ratingInput &&
    ['score-desc', 'importance-desc', 'desire-desc'].includes(
      resultsView.sortBy
    )
  ) {
    renderResultsView();
    return;
  }

  const input = event.target.closest(
    '[data-result-action="timeline-date"]'
  );
  if (!input) return;

  const card = input.closest('.result-card');
  const resultId = card?.dataset.resultId;
  const fieldName = input.dataset.timelineField;

  if (!resultId || !fieldName) return;

  stateApi.updateResultTimelineDate(
    resultId,
    fieldName,
    input.value
  );
  renderResultsView();
  showToast(
    input.value
      ? t('toast.timelineDateSet')
      : t('toast.timelineDateCleared')
  );
});

[
  itemModal,
  resultNameModal,
  categoriesModal,
  musicCategoriesModal,
  confirmModal
].forEach((dialog) => {
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) {
      closeDialog(dialog);
    }
  });
});

window.addEventListener(
  'resize',
  equalizeBoardRowHeights,
  { passive: true }
);

document.fonts?.ready.then(equalizeBoardRowHeights);

if (stateApi && renderer && connections && storage) {
  loadUiPreferences();
  updateCalendarDayTypeFilterColor();

  const loadResult = storage.load(stateApi.state);
  const storageAvailable = !loadResult.unavailable;

  if (autosaveBadge && !storageAvailable) {
    autosaveBadge.textContent = t('data.noAutosave');
    autosaveBadge.classList.add('autosave-badge-unavailable');
    autosaveBadge.title =
      t('data.noAutosaveTitle');
  }

  if (loadResult.error) {
    console.error('Сохранённые данные повреждены.', loadResult.error);
    storage.clear();
    stateApi.seedDemoData();

    if (storageAvailable) {
      storage.save(stateApi.state);
    }

    showToast(
      t('toast.corruptedData')
    );
  } else if (!loadResult.loaded) {
    stateApi.seedDemoData();

    if (storageAvailable) {
      storage.save(stateApi.state);
    }
  }

  if (storageAvailable) {
    storage.enableAutosave(stateApi, (error) => {
      console.error('Автосохранение не выполнено.', error);
      showToast(t('toast.autosaveFailed'));
    });
  }

  renderEverything();
  connections.init(() => getActiveResults());

  if (loadResult.loaded) {
    showToast(t('toast.restored'));
  } else if (!storageAvailable) {
    showToast(
      t('toast.autosaveUnavailable')
    );
  }
}

confirmModal?.addEventListener('close', () => {
  pendingConfirmAction = null;

  if (confirmOptions) {
    confirmOptions.hidden = true;
  }

  confirmOptionsList?.replaceChildren();
});

console.log('v1.4.6: дата публикации редактируется прямо из Completed.');
