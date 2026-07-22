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

const itemModal = document.querySelector('#item-modal');
const itemForm = document.querySelector('#item-form');
const itemFields = document.querySelector('#item-form-fields');
const itemModalTitle = document.querySelector('#item-modal-title');
const itemModalEyebrow = document.querySelector('#item-modal-eyebrow');
const itemSubmitButton = document.querySelector('#item-submit-button');
const itemFormError = document.querySelector('#item-form-error');

const categoriesModal = document.querySelector('#categories-modal');
const categoriesList = document.querySelector('#categories-list');
const newCategoryInput = document.querySelector('#new-category-name');
const newCategoryColorInput = document.querySelector('#new-category-color');
const newCategoryHexInput = document.querySelector('#new-category-hex');
const categoryFormError = document.querySelector('#category-form-error');

const confirmModal = document.querySelector('#confirm-modal');
const confirmTitle = document.querySelector('#confirm-title');
const confirmText = document.querySelector('#confirm-text');
const confirmActionButton = document.querySelector('#confirm-action-button');

const toast = document.querySelector('#toast');
const previewText = document.querySelector('#selection-preview-text');
const createResultButton = document.querySelector('#create-result-button');
const resultsList = document.querySelector('#results-list');
const resultsSort = document.querySelector('#results-sort');
const resultsStatusFilter = document.querySelector('#results-status-filter');
const resultsCategoryFilter = document.querySelector('#results-category-filter');
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
let toastTimer = null;

const resultsView = {
  sortBy: 'score-desc',
  statusFilter: 'all',
  categoryFilter: 'all',
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
  action,
}) {
  confirmTitle.textContent = title;
  confirmText.textContent = text;
  confirmActionButton.textContent = buttonText;
  confirmActionButton.classList.toggle('button-danger', danger);
  confirmActionButton.classList.toggle('button-primary', !danger);
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
}

function clearSelectionForItem(type, itemId) {
  const config = typeConfig[type];

  if (config && selection[config.selectionKey] === itemId) {
    selection[config.selectionKey] = null;
  }
}

function toggleSelection(type, itemId) {
  const config = typeConfig[type];
  if (!config) return;

  selection[config.selectionKey] =
    selection[config.selectionKey] === itemId ? null : itemId;

  updateSelectionInterface();
}

function getResultCategoryId(result) {
  const concept = stateApi.getItemById('concepts', result.conceptId);
  return concept?.categoryId ?? null;
}

function getVisibleResults() {
  const visibleResults = stateApi.state.results.filter((result) => {
    const matchesStatus =
      resultsView.statusFilter === 'all' ||
      (resultsView.statusFilter === 'planned' && Boolean(result.plannedExecutionAt)) ||
      (resultsView.statusFilter === 'unscheduled' && !result.plannedExecutionAt);

    const resultCategoryId = getResultCategoryId(result);
    const matchesCategory =
      resultsView.categoryFilter === 'all' ||
      (resultsView.categoryFilter === 'uncategorized' && !resultCategoryId) ||
      resultsView.categoryFilter === resultCategoryId;

    return matchesStatus && matchesCategory;
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

  if (resultsSort) {
    resultsSort.value = resultsView.sortBy;
  }

  if (resultsStatusFilter) {
    resultsStatusFilter.value = resultsView.statusFilter;
  }
}

function renderEverything() {
  populateCategoryFilter();
  renderer.renderAll(stateApi.state, getVisibleResults());

  if (categoriesModal?.open) {
    renderer.renderCategories(
      stateApi.state.conceptCategories,
      stateApi.state.concepts
    );
  }

  updateSelectionInterface();
  equalizeBoardRowHeights();
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

function createCategorySelect(selectedCategoryId = null) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';

  const labelText = document.createElement('span');
  labelText.textContent = t('item.category');

  const select = document.createElement('select');
  select.id = 'concept-category';
  select.name = 'concept-category';

  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = t('common.uncategorized');
  select.append(emptyOption);

  stateApi.state.conceptCategories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    option.selected = category.id === selectedCategoryId;
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
      createCategorySelect(item?.categoryId ?? null),
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
      url,
    });
  } else {
    stateApi.addMusic(artist, title, url);
  }
}

function createSelectedResult() {
  const selectedItems = getSelectedItems();

  if (!selectedItems.idea || !selectedItems.concept || !selectedItems.music) {
    return;
  }

  stateApi.addResult({
    ideaId: selectedItems.idea.id,
    conceptId: selectedItems.concept.id,
    musicId: selectedItems.music.id,
  });

  clearSelection();
  renderEverything();
  showToast(t('toast.resultSaved'));

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

  const relatedResults = stateApi.state.results.filter(
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

confirmActionButton?.addEventListener('click', () => {
  if (typeof pendingConfirmAction === 'function') {
    pendingConfirmAction();
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

function getRandomItem(items) {
  if (!Array.isArray(items) || !items.length) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
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
  const randomIdea = getRandomItem(stateApi.state.ideas);
  const randomConcept = getRandomItem(stateApi.state.concepts);
  const randomMusic = getRandomItem(stateApi.state.music);

  const missingColumns = [];

  if (!randomIdea) {
    missingColumns.push(t('random.ideas'));
  }

  if (!randomConcept) {
    missingColumns.push(t('random.concepts'));
  }

  if (!randomMusic) {
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

  selection.ideaId = randomIdea.id;
  selection.conceptId = randomConcept.id;
  selection.musicId = randomMusic.id;

  updateSelectionInterface();
  brieflyHighlightRandomSelection();

  showToast(
    t('toast.randomSelected')
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

[itemModal, categoriesModal, confirmModal].forEach((dialog) => {
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
  connections.init(() => stateApi.state.results);

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
});

console.log('v0.4.1: необязательные ссылки источников подключены.');
