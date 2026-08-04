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

  function renderMusic(musicItems, categories) {
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

      const category = categories.find(
        (item) => item.id === music.categoryId
      );

      const badge = document.createElement('span');
      badge.className = 'category-badge';
      badge.textContent =
        category?.name ?? t('common.uncategorized');

      if (category?.color) {
        badge.style.setProperty(
          '--category-color',
          category.color
        );
        row.style.setProperty(
          '--category-color',
          category.color
        );
        row.classList.add('music-row-colored');
      }

      const artist = document.createElement('strong');
      artist.textContent = music.artist;

      const title = document.createElement('span');
      title.textContent = music.title;

      body.append(badge, artist, title);
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

  function renderMusicCategories(
    categories,
    musicItems
  ) {
    const container = document.querySelector(
      '#music-categories-list'
    );
    if (!container) return;

    container.replaceChildren();

    if (!categories.length) {
      const empty = document.createElement('p');
      empty.className = 'category-empty';
      empty.textContent = t('musicCategories.empty');
      container.append(empty);
      return;
    }

    categories.forEach((category) => {
      const musicCount = musicItems.filter(
        (musicItem) =>
          musicItem.categoryId === category.id
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
      colorInput.dataset.musicCategoryAction =
        'color-picker';
      colorInput.setAttribute(
        'aria-label',
        t('categories.colorFor', {
          name: category.name
        })
      );
      colorInput.title = t('categories.chooseColor');

      const hexInput = document.createElement('input');
      hexInput.type = 'text';
      hexInput.className = 'category-inline-hex';
      hexInput.value = (
        category.color || '#6552c7'
      ).toUpperCase();
      hexInput.maxLength = 7;
      hexInput.spellcheck = false;
      hexInput.autocomplete = 'off';
      hexInput.dataset.musicCategoryAction = 'color-hex';
      hexInput.setAttribute(
        'aria-label',
        t('categories.hexFor', {
          name: category.name
        })
      );
      hexInput.title = t('categories.hexHint');

      colorEditor.append(colorInput, hexInput);

      const name = document.createElement('strong');
      name.textContent = category.name;

      nameRow.append(colorEditor, name);

      const count = document.createElement('span');
      count.textContent = t(
        'musicCategories.count',
        { count: musicCount }
      );

      info.append(nameRow, count);

      const actions = document.createElement('div');
      actions.className = 'category-row-actions';

      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'small-text-button';
      editButton.dataset.musicCategoryAction = 'edit';
      editButton.textContent = t('common.change');

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className =
        'small-text-button small-text-button-danger';
      deleteButton.dataset.musicCategoryAction = 'delete';
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

  function getWorkflowStatus(item) {
    return item?.workflowStatus ?? 'active';
  }

  function getStatusItemLabel(type, item) {
    if (!item) {
      return '';
    }

    if (type === 'idea' || type === 'concept') {
      return item.text;
    }

    if (type === 'music') {
      return `${item.artist} — ${item.title}`;
    }

    return item.title || item.id;
  }

  function createRestoreButton(
    collectionName,
    itemId
  ) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className =
      'button button-secondary button-compact status-restore-button';
    button.dataset.statusAction = 'restore';
    button.dataset.collection = collectionName;
    button.dataset.itemId = itemId;
    button.textContent = t('status.restore');
    return button;
  }

  function createStatusSourceCard({
    collectionName,
    type,
    item,
    category = null,
  }) {
    const card = document.createElement('article');
    card.className = 'status-item-card';

    const content = document.createElement('div');
    content.className = 'status-item-card-content';

    const typeLabel = document.createElement('span');
    typeLabel.className = 'status-item-type';
    typeLabel.textContent = t(`result.${type}`);

    const title = document.createElement('strong');
    title.textContent = getStatusItemLabel(
      type,
      item
    );

    content.append(typeLabel, title);

    if (category) {
      const badge = document.createElement('span');
      badge.className = 'category-badge';
      badge.textContent = category.name;

      if (category.color) {
        badge.style.setProperty(
          '--category-color',
          category.color
        );
      }

      content.append(badge);
    }

    card.append(
      content,
      createRestoreButton(
        collectionName,
        item.id
      )
    );

    return card;
  }

  function createStatusResultCard(
    state,
    result,
    index,
    status
  ) {
    const idea = state.ideas.find(
      (item) => item.id === result.ideaId
    );
    const concept = state.concepts.find(
      (item) => item.id === result.conceptId
    );
    const music = state.music.find(
      (item) => item.id === result.musicId
    );

    const card = document.createElement('article');
    card.className =
      'status-item-card status-result-card';

    const content = document.createElement('div');
    content.className = 'status-item-card-content';

    const typeLabel = document.createElement('span');
    typeLabel.className = 'status-item-type';
    typeLabel.textContent = t('status.result');

    const title = document.createElement('strong');
    title.textContent =
      result.title ||
      t('result.defaultName', {
        number: String(index + 1).padStart(
          2,
          '0'
        ),
      });

    const combination = document.createElement('small');
    combination.className =
      'status-result-combination';
    combination.textContent = [
      idea?.text ?? t('result.deletedIdea'),
      concept?.text ?? t('result.deletedConcept'),
      music
        ? `${music.artist} — ${music.title}`
        : t('result.deletedMusic'),
    ].join(' • ');

    content.append(
      typeLabel,
      title,
      combination
    );

    if (result.completedAt) {
      const completedMeta =
        document.createElement('small');
      completedMeta.className =
        'status-result-timeline-meta';
      completedMeta.textContent = t(
        'status.completedAt',
        {
          date: formatCreatedAt(
            result.completedAt
          ),
        }
      );
      content.append(completedMeta);
    }

    if (result.publishedAt) {
      const publishedMeta =
        document.createElement('small');
      publishedMeta.className =
        'status-result-timeline-meta status-result-published-meta';
      publishedMeta.textContent = t(
        'status.publishedAt',
        {
          date: formatCreatedAt(
            result.publishedAt
          ),
        }
      );
      content.append(publishedMeta);
    } else if (status === 'completed') {
      const readyBadge =
        document.createElement('span');
      readyBadge.className =
        'status-result-ready-badge';
      readyBadge.textContent =
        t('status.readyToPublish');
      content.append(readyBadge);
    }

    const actions = document.createElement('div');
    actions.className =
      'status-result-actions';

    if (
      status === 'completed' &&
      !result.publishedAt
    ) {
      const publishButton =
        document.createElement('button');
      publishButton.type = 'button';
      publishButton.className =
        'button button-primary button-compact status-publish-button';
      publishButton.dataset.statusAction =
        'mark-published';
      publishButton.dataset.itemId =
        result.id;
      publishButton.textContent =
        t('result.markPublished');
      actions.append(publishButton);
    }

    actions.append(
      createRestoreButton(
        'results',
        result.id
      )
    );

    card.append(
      content,
      actions
    );

    return card;
  }

  function createStatusGroup(
    title,
    items,
    cardBuilder
  ) {
    const section = document.createElement('section');
    section.className = 'status-group';

    const header = document.createElement('header');
    header.className = 'status-group-header';

    const heading = document.createElement('h3');
    heading.textContent = title;

    const count = document.createElement('span');
    count.className = 'status-count-badge';
    count.textContent = String(items.length);

    header.append(heading, count);

    const list = document.createElement('div');
    list.className = 'status-group-list';

    if (items.length) {
      items.forEach((item, index) => {
        list.append(cardBuilder(item, index));
      });
    } else {
      const empty = document.createElement('p');
      empty.className = 'status-group-empty';
      empty.textContent =
        t('status.groupEmpty');
      list.append(empty);
    }

    section.append(header, list);
    return section;
  }

  function renderStatusView(state, status) {
    const container = document.querySelector(
      '#status-view-content'
    );

    if (!container) {
      return;
    }

    const results = state.results.filter(
      (item) => getWorkflowStatus(item) === status
    );
    const ideas = state.ideas.filter(
      (item) => getWorkflowStatus(item) === status
    );
    const concepts = state.concepts.filter(
      (item) => getWorkflowStatus(item) === status
    );
    const music = state.music.filter(
      (item) => getWorkflowStatus(item) === status
    );

    container.replaceChildren(
      createStatusGroup(
        t('status.results'),
        results,
        (result, index) =>
          createStatusResultCard(
            state,
            result,
            index,
            status
          )
      ),
      createStatusGroup(
        t('status.ideas'),
        ideas,
        (idea) =>
          createStatusSourceCard({
            collectionName: 'ideas',
            type: 'idea',
            item: idea,
          })
      ),
      createStatusGroup(
        t('status.concepts'),
        concepts,
        (concept) =>
          createStatusSourceCard({
            collectionName: 'concepts',
            type: 'concept',
            item: concept,
            category:
              state.conceptCategories.find(
                (category) =>
                  category.id ===
                  concept.categoryId
              ) ?? null,
          })
      ),
      createStatusGroup(
        t('status.music'),
        music,
        (musicItem) =>
          createStatusSourceCard({
            collectionName: 'music',
            type: 'music',
            item: musicItem,
            category:
              state.musicCategories.find(
                (category) =>
                  category.id ===
                  musicItem.categoryId
              ) ?? null,
          })
      )
    );
  }

  const CALENDAR_STAGES = [
    {
      key: 'planned-execution',
      field: 'plannedExecutionAt',
      translationKey: 'calendar.stage.plannedExecution',
      planned: true,
      resolutionField: 'completedAt',
      priority: 1,
    },
    {
      key: 'completed',
      field: 'completedAt',
      translationKey: 'calendar.stage.completed',
      planned: false,
      resolutionField: null,
      priority: 2,
    },
    {
      key: 'planned-publication',
      field: 'plannedPublicationAt',
      translationKey: 'calendar.stage.plannedPublication',
      planned: true,
      resolutionField: 'publishedAt',
      priority: 3,
    },
    {
      key: 'published',
      field: 'publishedAt',
      translationKey: 'calendar.stage.published',
      planned: false,
      resolutionField: null,
      priority: 4,
    },
  ];

  function getDateKey(date) {
    const safeDate =
      date instanceof Date ? date : new Date(date);

    if (Number.isNaN(safeDate.getTime())) {
      return null;
    }

    const year = safeDate.getFullYear();
    const month = String(
      safeDate.getMonth() + 1
    ).padStart(2, '0');
    const day = String(
      safeDate.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function getDateFromKey(dateKey) {
    const match = String(dateKey ?? '').match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (!match) {
      return null;
    }

    const date = new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3])
    );

    return Number.isNaN(date.getTime())
      ? null
      : date;
  }

  function parseCalendarDateTime(value) {
    if (!value) {
      return null;
    }

    const match = String(value).match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
    );

    if (!match) {
      return null;
    }

    const date = new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4]),
      Number(match[5])
    );

    return Number.isNaN(date.getTime())
      ? null
      : date;
  }

  function getCalendarResultTitle(
    result,
    resultIndex
  ) {
    return (
      result.title ||
      t('result.defaultName', {
        number: String(resultIndex + 1).padStart(
          2,
          '0'
        ),
      })
    );
  }

  function buildCalendarEvents(state) {
    const events = [];

    state.results.forEach((result, resultIndex) => {
      if (getWorkflowStatus(result) === 'archived') {
        return;
      }

      const idea = state.ideas.find(
        (item) => item.id === result.ideaId
      );
      const concept = state.concepts.find(
        (item) => item.id === result.conceptId
      );
      const music = state.music.find(
        (item) => item.id === result.musicId
      );

      CALENDAR_STAGES.forEach((stage) => {
        const rawValue = result[stage.field];
        const date = parseCalendarDateTime(
          rawValue
        );

        if (!date) {
          return;
        }

        const workflowStatus =
          getWorkflowStatus(result);

        const isPublicationPlan =
          stage.key ===
          'planned-publication';

        const resultIsCompleted =
          Boolean(result.completedAt) ||
          workflowStatus === 'completed';

        const publicationIsReady =
          isPublicationPlan &&
          resultIsCompleted &&
          !result.publishedAt;

        const publicationNeedsWork =
          isPublicationPlan &&
          !resultIsCompleted &&
          !result.publishedAt;

        const executionPlanResolved =
          stage.key === 'planned-execution' &&
          resultIsCompleted;

        const calendarStageKey =
          executionPlanResolved
            ? 'planned-execution-resolved'
            : publicationIsReady
              ? 'planned-publication-ready'
              : publicationNeedsWork
                ? 'planned-publication-pending'
                : stage.key;

        const calendarStageTranslationKey =
          executionPlanResolved
            ? 'calendar.stage.plannedExecutionResolved'
            : publicationIsReady
              ? 'calendar.stage.readyPublication'
              : publicationNeedsWork
                ? 'calendar.stage.plannedPublicationPending'
                : stage.translationKey;

        events.push({
          id: `${result.id}:${stage.key}`,
          resultId: result.id,
          resultTitle: getCalendarResultTitle(
            result,
            resultIndex
          ),
          workflowStatus,
          stageKey: calendarStageKey,
          baseStageKey: stage.key,
          stageField: stage.field,
          stageTranslationKey:
            calendarStageTranslationKey,
          stagePriority: stage.priority,
          isPlanned: stage.planned,
          isResolved:
            !stage.resolutionField ||
            Boolean(
              result[stage.resolutionField]
            ),
          publicationIsReady,
          publicationNeedsWork,
          executionPlanResolved,
          value: rawValue,
          date,
          dateKey: getDateKey(date),
          ideaText:
            idea?.text ??
            t('result.deletedIdea'),
          conceptText:
            concept?.text ??
            t('result.deletedConcept'),
          musicText: music
            ? `${music.artist} — ${music.title}`
            : t('result.deletedMusic'),
        });
      });
    });

    events.sort((first, second) => (
      first.date.getTime() -
        second.date.getTime() ||
      first.stagePriority -
        second.stagePriority ||
      first.resultTitle.localeCompare(
        second.resultTitle,
        i18n?.getLocale?.() ?? 'ru-RU'
      )
    ));

    return events;
  }

  function getCalendarMetrics(
    state,
    now = new Date()
  ) {
    const events = buildCalendarEvents(state);
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const todayKey = getDateKey(today);

    const nextSevenEnd = new Date(today);
    nextSevenEnd.setDate(
      nextSevenEnd.getDate() + 6
    );
    const nextSevenEndKey =
      getDateKey(nextSevenEnd);

    const plannedEvents = events.filter(
      (event) =>
        event.isPlanned &&
        !event.isResolved
    );

    const futurePlannedEvents =
      plannedEvents.filter(
        (event) =>
          event.dateKey >= todayKey
      );

    const plannedAheadDays =
      new Set(
        futurePlannedEvents.map(
          (event) => event.dateKey
        )
      ).size;

    const nextSevenEvents = events.filter(
      (event) =>
        event.dateKey >= todayKey &&
        event.dateKey <= nextSevenEndKey
    ).length;

    const visibleResults = state.results.filter(
      (result) =>
        getWorkflowStatus(result) !== 'archived'
    );

    const hasCurrentOrFuturePublicationPlan =
      (result) => {
        const publicationDate =
          parseCalendarDateTime(
            result.plannedPublicationAt
          );

        if (!publicationDate) {
          return false;
        }

        const publicationDateKey =
          getDateKey(publicationDate);

        return (
          publicationDateKey !== null &&
          publicationDateKey >= todayKey
        );
      };

    const readyToPublish =
      visibleResults.filter(
        (result) =>
          (
            Boolean(result.completedAt) ||
            getWorkflowStatus(result) ===
              'completed'
          ) &&
          !result.publishedAt &&
          hasCurrentOrFuturePublicationPlan(
            result
          )
      ).length;

    const scheduledPublications =
      visibleResults.filter(
        (result) =>
          !result.publishedAt &&
          hasCurrentOrFuturePublicationPlan(
            result
          )
      ).length;

    return {
      plannedAheadDays,
      nextSevenEvents,
      readyToPublish,
      scheduledPublications,
    };
  }

  function formatCalendarDate(
    date,
    options
  ) {
    return new Intl.DateTimeFormat(
      i18n?.getLocale?.() ?? 'ru-RU',
      options
    ).format(date);
  }

  function formatCalendarTime(value) {
    const date = parseCalendarDateTime(
      value
    );

    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat(
      i18n?.getLocale?.() ?? 'ru-RU',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    ).format(date);
  }

  function createCalendarEventPreview(
    event,
    todayKey
  ) {
    const preview = document.createElement('div');
    preview.className =
      `calendar-event-preview calendar-event-${event.stageKey}`;

    const isOverdue =
      event.isPlanned &&
      !event.isResolved &&
      event.dateKey < todayKey;

    if (isOverdue) {
      preview.classList.add(
        'calendar-event-overdue'
      );
    }

    const dot = document.createElement('i');
    dot.className =
      `calendar-stage-dot calendar-stage-${event.stageKey}`;

    const label = document.createElement('span');
    label.textContent = event.resultTitle;

    preview.append(dot, label);
    return preview;
  }

  function createCalendarDayDetail(
    event,
    todayKey
  ) {
    const card = document.createElement('article');
    card.className =
      `calendar-detail-card calendar-detail-${event.stageKey}`;

    const header = document.createElement('div');
    header.className =
      'calendar-detail-card-header';

    const stage = document.createElement('span');
    stage.className =
      `calendar-stage-badge calendar-stage-${event.stageKey}`;
    stage.textContent = t(
      event.stageTranslationKey
    );

    const time = document.createElement('time');
    time.dateTime = event.value;
    time.textContent =
      formatCalendarTime(event.value);

    header.append(stage, time);

    const title = document.createElement('strong');
    title.className =
      'calendar-detail-title';
    title.textContent = event.resultTitle;

    const combination =
      document.createElement('p');
    combination.className =
      'calendar-detail-combination';
    combination.textContent = [
      event.ideaText,
      event.conceptText,
      event.musicText,
    ].join(' • ');

    const footer = document.createElement('div');
    footer.className =
      'calendar-detail-footer';

    const isOverdue =
      event.isPlanned &&
      !event.isResolved &&
      event.dateKey < todayKey;

    const stateBadge =
      document.createElement('span');
    stateBadge.className =
      'calendar-detail-state';

    if (isOverdue) {
      stateBadge.classList.add(
        'calendar-detail-state-overdue'
      );
      stateBadge.textContent =
        t('calendar.overdue');
    } else if (event.executionPlanResolved) {
      stateBadge.classList.add(
        'calendar-detail-state-resolved-plan'
      );
      stateBadge.textContent =
        t('calendar.planCompleted');
    } else if (event.publicationIsReady) {
      stateBadge.classList.add(
        'calendar-detail-state-ready'
      );
      stateBadge.textContent =
        t('calendar.readyToPublish');
    } else if (event.publicationNeedsWork) {
      stateBadge.classList.add(
        'calendar-detail-state-pending-work'
      );
      stateBadge.textContent =
        t('calendar.notCompletedYet');
    } else if (
      event.workflowStatus === 'completed'
    ) {
      stateBadge.textContent =
        t('views.completed');
    } else {
      stateBadge.textContent =
        t('calendar.inWorkspace');
    }

    const openButton =
      document.createElement('button');
    openButton.type = 'button';
    openButton.className =
      'small-text-button calendar-open-result';
    openButton.dataset.calendarResultAction =
      'open';
    openButton.dataset.resultId =
      event.resultId;
    openButton.dataset.workflowStatus =
      event.workflowStatus;
    openButton.textContent =
      event.workflowStatus === 'completed'
        ? t('calendar.openCompleted')
        : t('calendar.openResult');

    footer.append(
      stateBadge,
      openButton
    );

    card.append(
      header,
      title,
      combination,
      footer
    );

    return card;
  }

  function renderCalendarView(
    state,
    {
      cursorDate = new Date(),
      selectedDateKey = null,
    } = {}
  ) {
    const grid = document.querySelector(
      '#calendar-grid'
    );
    const weekdays = document.querySelector(
      '#calendar-weekdays'
    );
    const monthTitle = document.querySelector(
      '#calendar-month-title'
    );
    const selectedDateTitle =
      document.querySelector(
        '#calendar-selected-date-title'
      );
    const details = document.querySelector(
      '#calendar-day-details'
    );
    const dayTypeFilter =
      document.querySelector(
        '#calendar-day-type-filter'
      );

    if (
      !grid ||
      !weekdays ||
      !monthTitle ||
      !selectedDateTitle ||
      !details
    ) {
      return;
    }

    const safeCursor = new Date(
      cursorDate.getFullYear(),
      cursorDate.getMonth(),
      1
    );
    const today = new Date();
    const todayKey = getDateKey(today);

    const effectiveSelectedDateKey =
      selectedDateKey || todayKey;

    const events = buildCalendarEvents(state);
    const eventsByDate = new Map();

    events.forEach((event) => {
      if (!eventsByDate.has(event.dateKey)) {
        eventsByDate.set(
          event.dateKey,
          []
        );
      }

      eventsByDate.get(event.dateKey).push(
        event
      );
    });

    const metrics = getCalendarMetrics(
      state,
      today
    );

    const plannedAheadElement =
      document.querySelector(
        '#calendar-metric-planned-ahead'
      );
    const nextSevenElement =
      document.querySelector(
        '#calendar-metric-next-seven'
      );
    const readyElement =
      document.querySelector(
        '#calendar-metric-ready'
      );
    const publicationPlanElement =
      document.querySelector(
        '#calendar-metric-publication-plan'
      );

    if (plannedAheadElement) {
      plannedAheadElement.textContent =
        metrics.plannedAheadDays === null
          ? '—'
          : t(
              'calendar.metric.daysValue',
              {
                count:
                  metrics.plannedAheadDays,
              }
            );
    }

    if (nextSevenElement) {
      nextSevenElement.textContent = String(
        metrics.nextSevenEvents
      );
    }

    if (readyElement) {
      readyElement.textContent = String(
        metrics.readyToPublish
      );
    }

    if (publicationPlanElement) {
      publicationPlanElement.textContent =
        String(
          metrics.scheduledPublications
        );
    }

    monthTitle.textContent =
      formatCalendarDate(
        safeCursor,
        {
          month: 'long',
          year: 'numeric',
        }
      );

    weekdays.replaceChildren();

    const mondayReference =
      new Date(2026, 0, 5);

    for (let offset = 0; offset < 7; offset += 1) {
      const weekdayDate =
        new Date(mondayReference);
      weekdayDate.setDate(
        weekdayDate.getDate() + offset
      );

      const weekday =
        document.createElement('span');
      weekday.textContent =
        formatCalendarDate(
          weekdayDate,
          { weekday: 'short' }
        );
      weekdays.append(weekday);
    }

    const firstDay = new Date(
      safeCursor.getFullYear(),
      safeCursor.getMonth(),
      1
    );
    const mondayIndex =
      (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(
      firstDay
    );
    gridStart.setDate(
      gridStart.getDate() - mondayIndex
    );

    grid.replaceChildren();

    for (
      let dayOffset = 0;
      dayOffset < 42;
      dayOffset += 1
    ) {
      const date = new Date(gridStart);
      date.setDate(
        date.getDate() + dayOffset
      );

      const dateKey = getDateKey(date);
      const dayEvents =
        eventsByDate.get(dateKey) ?? [];

      const day = document.createElement('button');
      day.type = 'button';
      day.className = 'calendar-day';
      day.dataset.calendarDate = dateKey;
      day.setAttribute('role', 'gridcell');

      const isCurrentMonth =
        date.getMonth() ===
          safeCursor.getMonth() &&
        date.getFullYear() ===
          safeCursor.getFullYear();

      if (!isCurrentMonth) {
        day.classList.add(
          'calendar-day-outside'
        );
      }

      if (dateKey === todayKey) {
        day.classList.add(
          'calendar-day-today'
        );
      }

      if (
        dateKey ===
        effectiveSelectedDateKey
      ) {
        day.classList.add(
          'calendar-day-selected'
        );
      }

      if (dayEvents.length) {
        day.classList.add(
          'calendar-day-has-events'
        );

        const dominantEvent = dayEvents.reduce(
          (current, event) =>
            event.stagePriority >
            current.stagePriority
              ? event
              : current,
          dayEvents[0]
        );

        day.classList.add(
          `calendar-day-dominant-${dominantEvent.stageKey}`
        );
      }

      const top = document.createElement('div');
      top.className = 'calendar-day-top';

      const number = document.createElement('span');
      number.className =
        'calendar-day-number';
      number.textContent = String(
        date.getDate()
      );

      top.append(number);

      if (dayEvents.length) {
        const eventCount =
          document.createElement('span');
        eventCount.className =
          'calendar-day-count';
        eventCount.textContent = String(
          dayEvents.length
        );
        top.append(eventCount);
      }

      const markerRow =
        document.createElement('div');
      markerRow.className =
        'calendar-day-stage-markers';

      Array.from(
        new Set(
          dayEvents.map(
            (event) => event.stageKey
          )
        )
      ).forEach((stageKey) => {
        const marker =
          document.createElement('i');
        marker.className =
          `calendar-stage-dot calendar-stage-${stageKey}`;
        markerRow.append(marker);
      });

      const previewList =
        document.createElement('div');
      previewList.className =
        'calendar-day-events';

      dayEvents
        .slice(0, 3)
        .forEach((event) => {
          previewList.append(
            createCalendarEventPreview(
              event,
              todayKey
            )
          );
        });

      if (dayEvents.length > 3) {
        const more =
          document.createElement('span');
        more.className =
          'calendar-day-more';
        more.textContent = t(
          'calendar.moreEvents',
          {
            count:
              dayEvents.length - 3,
          }
        );
        previewList.append(more);
      }

      day.append(
        top,
        markerRow,
        previewList
      );

      day.setAttribute(
        'aria-label',
        t('calendar.dayAria', {
          date: formatCalendarDate(
            date,
            {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }
          ),
          count: dayEvents.length,
        })
      );

      grid.append(day);
    }

    const selectedDate =
      getDateFromKey(
        effectiveSelectedDateKey
      ) ?? today;

    selectedDateTitle.textContent =
      formatCalendarDate(
        selectedDate,
        {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      );

    details.replaceChildren();

    const selectedEvents =
      eventsByDate.get(
        getDateKey(selectedDate)
      ) ?? [];

    const selectedType =
      dayTypeFilter?.value ?? 'all';

    const visibleSelectedEvents =
      selectedType === 'all'
        ? selectedEvents
        : selectedEvents.filter(
            (event) =>
              event.stageKey ===
              selectedType
          );

    if (!visibleSelectedEvents.length) {
      const empty =
        document.createElement('div');
      empty.className =
        'calendar-day-empty';

      const icon =
        document.createElement('span');
      icon.textContent = selectedEvents.length
        ? '⌕'
        : '○';

      const text =
        document.createElement('p');
      text.textContent = selectedEvents.length
        ? t('calendar.noEventsForType')
        : t('calendar.noEvents');

      empty.append(icon, text);
      details.append(empty);
      return;
    }

    visibleSelectedEvents.forEach((event) => {
      details.append(
        createCalendarDayDetail(
          event,
          todayKey
        )
      );
    });
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
      const hasSavedResults = state.results.some(
        (result) =>
          getWorkflowStatus(result) === 'active'
      );

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
      const musicCategory = state.musicCategories.find(
        (item) => item.id === music?.categoryId
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

      const moreMenu = document.createElement('details');
      moreMenu.className = 'result-more-menu';

      const moreSummary = document.createElement('summary');
      moreSummary.className =
        'result-header-button result-more-button';
      moreSummary.setAttribute(
        'aria-label',
        t('result.moreActions')
      );
      moreSummary.title = t('result.moreActions');
      moreSummary.textContent = '⋮';

      const morePopover = document.createElement('div');
      morePopover.className =
        'result-more-popover';

      const completeButton =
        document.createElement('button');
      completeButton.type = 'button';
      completeButton.className =
        'result-more-action result-more-action-complete';
      completeButton.dataset.resultAction =
        'mark-completed';
      completeButton.textContent =
        t('result.markCompleted');

      const archiveButton =
        document.createElement('button');
      archiveButton.type = 'button';
      archiveButton.className =
        'result-more-action result-more-action-archive';
      archiveButton.dataset.resultAction =
        'archive';
      archiveButton.textContent =
        t('result.archive');

      morePopover.append(
        completeButton,
        archiveButton
      );
      moreMenu.append(
        moreSummary,
        morePopover
      );

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
        moreMenu,
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

      const musicBadge = document.createElement('span');
      musicBadge.className = 'category-badge';
      musicBadge.textContent =
        musicCategory?.name ?? t('common.uncategorized');

      if (musicCategory?.color) {
        musicBadge.style.setProperty(
          '--category-color',
          musicCategory.color
        );
      }

      const musicResultPart = createResultPart(
        t('result.music'),
        music
          ? `${music.artist} — ${music.title}`
          : t('result.deletedMusic'),
        musicBadge
      );
      musicResultPart.classList.add('result-part-music');

      if (musicCategory?.color) {
        musicResultPart.style.setProperty(
          '--category-color',
          musicCategory.color
        );
      }

      combination.append(musicResultPart);

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
          fieldName: 'plannedPublicationAt',
          label: t('result.plannedPublication'),
          value: result.plannedPublicationAt,
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
    const activeIdeas = state.ideas.filter(
      (item) => getWorkflowStatus(item) === 'active'
    );
    const activeConcepts = state.concepts.filter(
      (item) => getWorkflowStatus(item) === 'active'
    );
    const activeMusic = state.music.filter(
      (item) => getWorkflowStatus(item) === 'active'
    );

    renderIdeas(activeIdeas);
    renderConcepts(
      activeConcepts,
      state.conceptCategories
    );
    renderMusic(
      activeMusic,
      state.musicCategories
    );
    renderResults(state, visibleResults);
  }

  global.ContentIdeaRenderer = {
    renderIdeas,
    renderConcepts,
    renderMusic,
    renderCategories,
    renderMusicCategories,
    renderResults,
    renderCalendarView,
    buildCalendarEvents,
    getCalendarMetrics,
    getDateKey,
    renderStatusView,
    renderAll,
  };
})(window);
