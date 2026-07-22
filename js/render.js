'use strict';

(function createContentIdeaRenderer(global) {
  const i18n = global.ContentIdeaI18n;
  const t = (key, params) =>
    i18n?.t(key, params) ?? key;

  function createEmptyState(message) {
    const paragraph = document.createElement('p');
    paragraph.className = 'column-empty';
    paragraph.textContent = message;
    return paragraph;
  }

  function createActionButton(action, label, symbol) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cell-action-button';
    button.dataset.action = action;
    button.setAttribute('aria-label', label);
    button.title = label;
    button.textContent = symbol;
    return button;
  }

  function createExternalLink(url, label, className) {
    const link = document.createElement('a');
    link.className = className;
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer nofollow';
    link.setAttribute(
      'aria-label',
      t('links.open', { label })
    );
    link.title = t('links.open', { label });
    link.textContent = '↗';
    return link;
  }

  function createResultLinks(items) {
    const availableLinks = items.filter(
      (item) => Boolean(item.url)
    );

    if (!availableLinks.length) {
      return null;
    }

    const details = document.createElement('details');
    details.className = 'result-links';

    const summary = document.createElement('summary');
    summary.className = 'result-links-summary';

    const icon = document.createElement('span');
    icon.className = 'result-links-icon';
    icon.textContent = '↗';

    const text = document.createElement('span');
    text.textContent = t('result.links', {
      count: availableLinks.length,
    });

    summary.append(icon, text);

    const list = document.createElement('div');
    list.className = 'result-links-list';

    availableLinks.forEach((item) => {
      const link = document.createElement('a');
      link.className = 'result-link-chip';
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer nofollow';
      link.textContent = item.label;
      link.setAttribute(
        'aria-label',
        t('links.open', { label: item.label })
      );
      link.title = item.url;
      list.append(link);
    });

    details.append(summary, list);
    return details;
  }

  function createCellShell(item, type) {
    const row = document.createElement('div');
    row.className = 'content-cell-row';
    row.dataset.itemId = item.id;
    row.dataset.itemType = type;

    const body = document.createElement('button');
    body.type = 'button';
    body.className = 'content-cell';
    body.dataset.itemId = item.id;
    body.dataset.itemType = type;

    const actions = document.createElement('div');
    actions.className = 'cell-actions';

    if (item.url) {
      actions.append(
        createExternalLink(
          item.url,
          t(`result.${type}`),
          'cell-action-link'
        )
      );
    }

    actions.append(
      createActionButton('edit', t('common.edit'), '✎'),
      createActionButton('delete', t('common.delete'), '×')
    );

    row.append(body, actions);
    return { row, body };
  }

  function renderIdeas(ideas) {
    const container = document.querySelector('#ideas-list');
    if (!container) return;

    container.replaceChildren();

    if (!ideas.length) {
      container.append(createEmptyState(t('empty.ideas')));
      return;
    }

    ideas.forEach((idea) => {
      const { row, body } = createCellShell(idea, 'idea');
      body.textContent = idea.text;
      container.append(row);
    });
  }

  function renderConcepts(concepts, categories) {
    const container = document.querySelector('#concepts-list');
    if (!container) return;

    container.replaceChildren();

    if (!concepts.length) {
      container.append(createEmptyState(t('empty.concepts')));
      return;
    }

    concepts.forEach((concept) => {
      const { row, body } = createCellShell(concept, 'concept');
      body.classList.add('concept-cell');

      const category = categories.find(
        (item) => item.id === concept.categoryId
      );

      const badge = document.createElement('span');
      badge.className = 'category-badge';
      badge.textContent = category?.name ?? t('common.uncategorized');

      if (category?.color) {
        badge.style.setProperty('--category-color', category.color);
        row.style.setProperty('--category-color', category.color);
        row.classList.add('concept-row-colored');
      }

      const text = document.createElement('span');
      text.textContent = concept.text;

      body.append(badge, text);
      container.append(row);
    });
  }

  function renderMusic(musicItems) {
    const container = document.querySelector('#music-list');
    if (!container) return;

    container.replaceChildren();

    if (!musicItems.length) {
      container.append(createEmptyState(t('empty.music')));
      return;
    }

    musicItems.forEach((music) => {
      const { row, body } = createCellShell(music, 'music');
      body.classList.add('music-cell');

      const artist = document.createElement('strong');
      artist.textContent = music.artist;

      const title = document.createElement('span');
      title.textContent = music.title;

      body.append(artist, title);
      container.append(row);
    });
  }

  function renderCategories(categories, concepts) {
    const container = document.querySelector('#categories-list');
    if (!container) return;

    container.replaceChildren();

    if (!categories.length) {
      const empty = document.createElement('p');
      empty.className = 'category-empty';
      empty.textContent = t('categories.empty');
      container.append(empty);
      return;
    }

    categories.forEach((category) => {
      const conceptsCount = concepts.filter(
        (concept) => concept.categoryId === category.id
      ).length;

      const row = document.createElement('div');
      row.className = 'category-row';
      row.dataset.categoryId = category.id;

      const info = document.createElement('div');
      info.className = 'category-row-info';

      const nameRow = document.createElement('div');
      nameRow.className = 'category-name-row';

      const colorEditor = document.createElement('span');
      colorEditor.className = 'category-color-editor';

      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.className = 'category-inline-color';
      colorInput.value = category.color || '#6552c7';
      colorInput.dataset.categoryAction = 'color-picker';
      colorInput.setAttribute(
        'aria-label',
        t('categories.colorFor', { name: category.name })
      );
      colorInput.title = t('categories.chooseColor');

      const hexInput = document.createElement('input');
      hexInput.type = 'text';
      hexInput.className = 'category-inline-hex';
      hexInput.value = (category.color || '#6552c7').toUpperCase();
      hexInput.maxLength = 7;
      hexInput.spellcheck = false;
      hexInput.autocomplete = 'off';
      hexInput.dataset.categoryAction = 'color-hex';
      hexInput.setAttribute(
        'aria-label',
        t('categories.hexFor', { name: category.name })
      );
      hexInput.title = t('categories.hexHint');

      colorEditor.append(colorInput, hexInput);

      const name = document.createElement('strong');
      name.textContent = category.name;

      nameRow.append(colorEditor, name);

      const count = document.createElement('span');
      count.textContent = t('categories.count', { count: conceptsCount });

      info.append(nameRow, count);

      const actions = document.createElement('div');
      actions.className = 'category-row-actions';

      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'small-text-button';
      editButton.dataset.categoryAction = 'edit';
      editButton.textContent = t('common.change');

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'small-text-button small-text-button-danger';
      deleteButton.dataset.categoryAction = 'delete';
      deleteButton.textContent = t('common.delete');

      actions.append(editButton, deleteButton);
      row.append(info, actions);
      container.append(row);
    });
  }

  function formatCreatedAt(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return t('date.unknown');
    }

    return new Intl.DateTimeFormat(i18n?.getLocale?.() ?? 'ru-RU', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }

  function createResultPart(label, value, extra = null) {
    const part = document.createElement('div');
    part.className = 'result-part';

    const partLabel = document.createElement('span');
    partLabel.className = 'result-part-label';
    partLabel.textContent = label;

    const partValue = document.createElement('strong');
    partValue.textContent = value;

    part.append(partLabel);

    if (extra) {
      part.append(extra);
    }

    part.append(partValue);
    return part;
  }

  function createRatingControl({
    label,
    value,
    action,
    helperText,
  }) {
    const control = document.createElement('label');
    control.className = 'rating-control';

    const header = document.createElement('span');
    header.className = 'rating-control-header';

    const labelText = document.createElement('span');
    labelText.textContent = label;

    const output = document.createElement('output');
    output.dataset.ratingOutput = action;
    output.textContent = String(value);

    header.append(labelText, output);

    const input = document.createElement('input');
    input.type = 'range';
    input.min = '0';
    input.max = '10';
    input.step = '1';
    input.value = String(value);
    input.dataset.resultAction = action;
    input.setAttribute(
      'aria-label',
      t('result.ratingValue', { label, value })
    );

    const helper = document.createElement('small');
    helper.textContent = helperText;

    control.append(header, input, helper);
    return control;
  }

  function createTimelineField({
    fieldName,
    label,
    value,
  }) {
    const field = document.createElement('label');
    field.className = 'result-timeline-field';
    field.classList.add(
      value ? 'result-timeline-field-set' : 'result-timeline-field-missing'
    );

    const header = document.createElement('span');
    header.className = 'result-timeline-field-header';

    const labelText = document.createElement('span');
    labelText.className = 'result-timeline-label';
    labelText.textContent = label;

    const status = document.createElement('small');
    status.className = 'result-timeline-status';
    status.textContent = value
      ? t('result.dateSet')
      : t('result.dateMissing');

    header.append(labelText, status);

    const wrapper = document.createElement('span');
    wrapper.className = 'datetime-wrapper result-timeline-input-wrapper';

    const input = document.createElement('input');
    input.type = 'datetime-local';
    input.dataset.resultAction = 'timeline-date';
    input.dataset.timelineField = fieldName;
    input.value = value ?? '';
    input.setAttribute('aria-label', label);
    input.title = label;

    wrapper.append(input);
    field.append(header, wrapper);

    return field;
  }

  function createResultsEmptyState({
    title = t('results.empty.title'),
    description =
      t('results.empty.description'),
    filtered = false,
  } = {}) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.classList.toggle('empty-state-filtered', filtered);

    const icon = document.createElement('div');
    icon.className = 'empty-state__icon';
    icon.textContent = filtered ? '⌕' : '↗';

    const content = document.createElement('div');
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;

    content.append(titleElement, descriptionElement);
    empty.append(icon, content);

    return empty;
  }

  function renderResults(state, visibleResults = state.results) {
    const container = document.querySelector('#results-list');
    if (!container) return;

    container.replaceChildren();

    if (!visibleResults.length) {
      const hasSavedResults = state.results.length > 0;

      container.append(
        createResultsEmptyState(
          hasSavedResults
            ? {
                title: t('results.filtered.title'),
                description:
                  t('results.filtered.description'),
                filtered: true,
              }
            : undefined
        )
      );
      return;
    }

    visibleResults.forEach((result, index) => {
      const idea = state.ideas.find((item) => item.id === result.ideaId);
      const concept = state.concepts.find((item) => item.id === result.conceptId);
      const music = state.music.find((item) => item.id === result.musicId);
      const category = state.conceptCategories.find(
        (item) => item.id === concept?.categoryId
      );

      const card = document.createElement('article');
      card.className = 'result-card';
      card.dataset.resultId = result.id;

      const header = document.createElement('header');
      header.className = 'result-card-header';

      const headerText = document.createElement('div');

      const eyebrow = document.createElement('span');
      eyebrow.className = 'result-card-number';
      eyebrow.textContent =
        result.title ||
        t('result.defaultName', {
          number: String(index + 1).padStart(2, '0')
        });
      eyebrow.title = result.title
        ? result.title
        : t('result.noCustomTitle');

      const createdAt = document.createElement('span');
      createdAt.className = 'result-created-at';
      createdAt.textContent = t('result.created', {
        date: formatCreatedAt(result.createdAt)
      });

      headerText.append(eyebrow, createdAt);

      const headerActions = document.createElement('div');
      headerActions.className = 'result-card-header-actions';

      const scoreBadge = document.createElement('div');
      scoreBadge.className = 'result-score result-score-compact';
      scoreBadge.title = t('result.scoreFormula');

      const scoreLabel = document.createElement('span');
      scoreLabel.textContent = t('result.score');

      const scoreValue = document.createElement('strong');
      scoreValue.dataset.resultScore = '';
      scoreValue.textContent = String(Number(result.score) || 0);

      scoreBadge.append(scoreLabel, scoreValue);

      const renameButton = document.createElement('button');
      renameButton.type = 'button';
      renameButton.className =
        'result-header-button result-rename-button';
      renameButton.dataset.resultAction = 'rename';
      renameButton.setAttribute(
        'aria-label',
        t('result.rename')
      );
      renameButton.title = t('result.rename');
      renameButton.textContent = '✎';

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className =
        'result-header-button result-delete-button';
      deleteButton.dataset.resultAction = 'delete';
      deleteButton.setAttribute('aria-label', t('result.delete'));
      deleteButton.title = t('result.delete');
      deleteButton.textContent = '×';

      headerActions.append(
        scoreBadge,
        renameButton,
        deleteButton
      );
      header.append(headerText, headerActions);

      const combination = document.createElement('div');
      combination.className = 'result-combination';

      combination.append(
        createResultPart(t('result.idea'), idea?.text ?? t('result.deletedIdea'))
      );

      const conceptBadge = document.createElement('span');
      conceptBadge.className = 'category-badge';
      conceptBadge.textContent = category?.name ?? t('common.uncategorized');

      if (category?.color) {
        conceptBadge.style.setProperty('--category-color', category.color);
      }

      const conceptResultPart = createResultPart(
        t('result.concept'),
        concept?.text ?? t('result.deletedConcept'),
        conceptBadge
      );
      conceptResultPart.classList.add('result-part-concept');

      if (category?.color) {
        conceptResultPart.style.setProperty(
          '--category-color',
          category.color
        );
      }

      combination.append(conceptResultPart);

      combination.append(
        createResultPart(
          t('result.music'),
          music
            ? `${music.artist} — ${music.title}`
            : t('result.deletedMusic')
        )
      );

      const resultLinks = createResultLinks([
        {
          label: t('result.idea'),
          url: idea?.url,
        },
        {
          label: t('result.concept'),
          url: concept?.url,
        },
        {
          label: t('result.music'),
          url: music?.url,
        },
      ]);

      const importance = Number(result.importance) || 0;
      const desire = Number(result.desire) || 0;
      const ratings = document.createElement('section');
      ratings.className = 'result-ratings';
      ratings.setAttribute('aria-label', t('result.ratingAria'));

      const importanceControl = createRatingControl({
        label: t('result.importance'),
        value: importance,
        action: 'importance',
        helperText: t('result.importanceHelp'),
      });

      const desireControl = createRatingControl({
        label: t('result.desire'),
        value: desire,
        action: 'desire',
        helperText: t('result.desireHelp'),
      });

      ratings.append(importanceControl, desireControl);

      const timeline = document.createElement('section');
      timeline.className = 'result-timeline';
      timeline.setAttribute(
        'aria-label',
        t('result.timelineAria')
      );

      timeline.append(
        createTimelineField({
          fieldName: 'plannedExecutionAt',
          label: t('result.plannedExecution'),
          value: result.plannedExecutionAt,
        }),
        createTimelineField({
          fieldName: 'completedAt',
          label: t('result.completed'),
          value: result.completedAt,
        }),
        createTimelineField({
          fieldName: 'plannedPublicationAt',
          label: t('result.plannedPublication'),
          value: result.plannedPublicationAt,
        }),
        createTimelineField({
          fieldName: 'publishedAt',
          label: t('result.published'),
          value: result.publishedAt,
        })
      );

      card.append(header, combination);

      if (resultLinks) {
        card.append(resultLinks);
      }

      card.append(ratings, timeline);
      container.append(card);
    });
  }

  function renderAll(state, visibleResults = state.results) {
    renderIdeas(state.ideas);
    renderConcepts(state.concepts, state.conceptCategories);
    renderMusic(state.music);
    renderResults(state, visibleResults);
  }

  global.ContentIdeaRenderer = {
    renderIdeas,
    renderConcepts,
    renderMusic,
    renderCategories,
    renderResults,
    renderAll,
  };
})(window);
