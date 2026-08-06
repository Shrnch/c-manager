'use strict';

(function createContentIdeaRenderer(global) {
  const i18n = global.ContentIdeaI18n;
  const t = (key, params) =>
    i18n?.t(key, params) ?? key;

  function getMusicDisplayLabel(music) {
    if (!music) {
      return '';
    }

    const artist = String(
      music.artist ?? ''
    ).trim();
    const title = String(
      music.title ?? ''
    ).trim();

    if (artist && title) {
      return `${artist} — ${title}`;
    }

    return title || artist;
  }

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
      createActionButton(
        'complete',
        t('workspace.markItemCompleted'),
        '✓'
      ),
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

      if (music.artist) {
        const title =
          document.createElement('strong');
        title.className =
          'music-track-title';
        title.textContent = music.title;

        const artist =
          document.createElement('span');
        artist.className =
          'music-artist-name';
        artist.textContent = music.artist;

        body.append(
          badge,
          title,
          artist
        );
      } else {
        const titleOnly =
          document.createElement('strong');
        titleOnly.className =
          'music-title-only music-track-title';
        titleOnly.textContent =
          music.title;

        body.append(
          badge,
          titleOnly
        );
      }

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
      return getMusicDisplayLabel(item);
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
        ? getMusicDisplayLabel(music)
        : t('result.deletedMusic'),
    ].join(' • ');

    content.append(
      typeLabel,
      title,
      combination
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

    if (resultLinks) {
      resultLinks.classList.add(
        'result-links-status'
      );
      content.append(resultLinks);
    }

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

      const publicationEditor =
        document.createElement('label');
      publicationEditor.className =
        'status-result-publication-editor';

      const publicationLabel =
        document.createElement('span');
      publicationLabel.textContent =
        t('result.plannedPublication');

      const publicationInput =
        document.createElement('input');
      publicationInput.type =
        'datetime-local';
      publicationInput.value =
        result.plannedPublicationAt ?? '';
      publicationInput.dataset.statusAction =
        'publication-date';
      publicationInput.dataset.itemId =
        result.id;
      publicationInput.setAttribute(
        'aria-label',
        t('status.editPublicationPlan')
      );
      publicationInput.title =
        t('status.editPublicationPlan');

      publicationEditor.append(
        publicationLabel,
        publicationInput
      );
      content.append(publicationEditor);
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

    if (status === 'completed') {
      const moreMenu =
        document.createElement('details');
      moreMenu.className =
        'status-result-more-menu';

      const moreSummary =
        document.createElement('summary');
      moreSummary.className =
        'status-result-more-button';
      moreSummary.setAttribute(
        'aria-label',
        t('status.moreActions')
      );
      moreSummary.title =
        t('status.moreActions');
      moreSummary.textContent = '⋯';

      const morePopover =
        document.createElement('div');
      morePopover.className =
        'status-result-more-popover';

      const adjustDatesButton =
        document.createElement('button');
      adjustDatesButton.type = 'button';
      adjustDatesButton.className =
        'status-result-more-action';
      adjustDatesButton.dataset.statusAction =
        'adjust-actual-dates';
      adjustDatesButton.dataset.itemId =
        result.id;
      adjustDatesButton.textContent =
        t('status.adjustActualDates');

      morePopover.append(
        adjustDatesButton
      );
      moreMenu.append(
        moreSummary,
        morePopover
      );
      actions.append(moreMenu);
    }

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


  function getStatisticsResultTitle(
    result,
    index
  ) {
    return (
      result.title ||
      t('result.defaultName', {
        number: String(index + 1).padStart(
          2,
          '0'
        ),
      })
    );
  }

  function parseStatisticsDate(value) {
    if (!value) {
      return null;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? null
      : date;
  }

  function getStatisticsDateKey(value) {
    const date =
      value instanceof Date
        ? value
        : parseStatisticsDate(value);

    if (!date) {
      return null;
    }

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');
    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function getStatisticsDayStart(value) {
    const date =
      value instanceof Date
        ? new Date(value)
        : parseStatisticsDate(value);

    if (!date) {
      return null;
    }

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  function formatStatisticsCompactDate(
    date
  ) {
    return new Intl.DateTimeFormat(
      i18n?.getLocale?.() ?? 'ru-RU',
      {
        day: 'numeric',
        month: 'short',
      }
    ).format(date);
  }

  function formatStatisticsLongDate(
    date
  ) {
    return new Intl.DateTimeFormat(
      i18n?.getLocale?.() ?? 'ru-RU',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    ).format(date);
  }

  function createStatisticsMetric({
    label,
    value,
    note = null,
    tone = 'neutral',
  }) {
    const card =
      document.createElement('article');
    card.className =
      `statistics-metric statistics-tone-${tone}`;

    const labelElement =
      document.createElement('span');
    labelElement.className =
      'statistics-metric-label';
    labelElement.textContent = label;

    const valueElement =
      document.createElement('strong');
    valueElement.className =
      'statistics-metric-value';
    valueElement.textContent =
      String(value);

    card.append(
      labelElement,
      valueElement
    );

    if (note) {
      const noteElement =
        document.createElement('small');
      noteElement.className =
        'statistics-metric-note';
      noteElement.textContent = note;
      card.append(noteElement);
    }

    return card;
  }

  function createStatisticsPanel({
    title,
    subtitle = null,
    className = '',
  }) {
    const panel =
      document.createElement('section');
    panel.className =
      `statistics-panel ${className}`.trim();

    const header =
      document.createElement('header');
    header.className =
      'statistics-panel-header';

    const heading =
      document.createElement('h3');
    heading.textContent = title;
    header.append(heading);

    if (subtitle) {
      const description =
        document.createElement('p');
      description.textContent = subtitle;
      header.append(description);
    }

    panel.append(header);

    return panel;
  }

  function createStatisticsEmpty(
    text
  ) {
    const empty =
      document.createElement('div');
    empty.className =
      'statistics-empty';
    empty.textContent = text;

    return empty;
  }

  function getStatisticsFrequency(
    results,
    referenceKey,
    items,
    labelBuilder
  ) {
    const counts = new Map();

    results.forEach((result) => {
      const itemId =
        result[referenceKey];

      if (!itemId) {
        return;
      }

      counts.set(
        itemId,
        (counts.get(itemId) ?? 0) + 1
      );
    });

    return Array.from(
      counts.entries()
    )
      .map(([itemId, count]) => {
        const item = items.find(
          (candidate) =>
            candidate.id === itemId
        );

        if (!item) {
          return null;
        }

        return {
          id: itemId,
          count,
          label: labelBuilder(item),
        };
      })
      .filter(Boolean)
      .sort(
        (first, second) =>
          second.count - first.count ||
          first.label.localeCompare(
            second.label,
            i18n?.getLocale?.() ??
              'ru-RU'
          )
      );
  }

  function createStatisticsRankList(
    entries,
    {
      limit = 5,
      emptyText,
    }
  ) {
    const list =
      document.createElement('ol');
    list.className =
      'statistics-rank-list';

    const visibleEntries =
      entries.slice(0, limit);

    if (!visibleEntries.length) {
      return createStatisticsEmpty(
        emptyText
      );
    }

    visibleEntries.forEach(
      (entry, index) => {
        const item =
          document.createElement('li');

        const rank =
          document.createElement('span');
        rank.className =
          'statistics-rank-number';
        rank.textContent =
          String(index + 1).padStart(
            2,
            '0'
          );

        const label =
          document.createElement('span');
        label.className =
          'statistics-rank-label';
        label.textContent =
          entry.label;

        const count =
          document.createElement('strong');
        count.className =
          'statistics-rank-count';
        count.textContent = t(
          'statistics.uses',
          {
            count: entry.count,
          }
        );

        item.append(
          rank,
          label,
          count
        );
        list.append(item);
      }
    );

    return list;
  }

  function createStatisticsDistribution(
    entries,
    {
      emptyText,
    }
  ) {
    const wrapper =
      document.createElement('div');
    wrapper.className =
      'statistics-distribution';

    if (!entries.length) {
      return createStatisticsEmpty(
        emptyText
      );
    }

    const maximum = Math.max(
      ...entries.map(
        (entry) => entry.count
      ),
      1
    );

    entries
      .slice(0, 7)
      .forEach((entry) => {
        const row =
          document.createElement('div');
        row.className =
          'statistics-distribution-row';

        const header =
          document.createElement('div');
        header.className =
          'statistics-distribution-row-header';

        const label =
          document.createElement('span');
        label.textContent = entry.label;

        const count =
          document.createElement('strong');
        count.textContent =
          String(entry.count);

        header.append(label, count);

        const track =
          document.createElement('div');
        track.className =
          'statistics-distribution-track';

        const fill =
          document.createElement('div');
        fill.className =
          'statistics-distribution-fill';
        fill.style.width =
          `${Math.max(
            4,
            (entry.count / maximum) * 100
          )}%`;

        if (entry.color) {
          fill.style.setProperty(
            '--statistics-bar-color',
            entry.color
          );
        }

        track.append(fill);
        row.append(header, track);
        wrapper.append(row);
      });

    return wrapper;
  }


  const STATISTICS_ACTIVITY_RANGES = {
    '7d': {
      days: 7,
      grouping: 'day',
      translationKey:
        'statistics.range.7d',
    },
    '14d': {
      days: 14,
      grouping: 'day',
      translationKey:
        'statistics.range.14d',
    },
    '30d': {
      days: 30,
      grouping: 'day',
      translationKey:
        'statistics.range.30d',
    },
    '90d': {
      days: 90,
      grouping: 'week',
      translationKey:
        'statistics.range.90d',
    },
    '180d': {
      days: 180,
      grouping: 'week',
      translationKey:
        'statistics.range.180d',
    },
    '365d': {
      days: 365,
      grouping: 'month',
      translationKey:
        'statistics.range.365d',
    },
    all: {
      days: null,
      grouping: 'auto',
      translationKey:
        'statistics.range.all',
    },
  };

  let statisticsActivityRange =
    '14d';

  function getStatisticsRangeStart(
    results,
    today,
    rangeKey
  ) {
    const config =
      STATISTICS_ACTIVITY_RANGES[
        rangeKey
      ] ??
      STATISTICS_ACTIVITY_RANGES[
        '14d'
      ];

    if (config.days !== null) {
      const start =
        new Date(today);
      start.setDate(
        start.getDate() -
          (config.days - 1)
      );
      return start;
    }

    const dates = results
      .flatMap((result) => [
        parseStatisticsDate(
          result.completedAt
        ),
        parseStatisticsDate(
          result.publishedAt
        ),
      ])
      .filter(
        (date) =>
          date &&
          date.getTime() <=
            today.getTime()
      )
      .map(
        (date) =>
          getStatisticsDayStart(date)
      )
      .filter(Boolean);

    if (!dates.length) {
      const fallback =
        new Date(today);
      fallback.setDate(
        fallback.getDate() - 13
      );
      return fallback;
    }

    return new Date(
      Math.min(
        ...dates.map(
          (date) => date.getTime()
        )
      )
    );
  }

  function getStatisticsActivityGrouping(
    start,
    end,
    rangeKey
  ) {
    const configured =
      STATISTICS_ACTIVITY_RANGES[
        rangeKey
      ]?.grouping ?? 'day';

    if (configured !== 'auto') {
      return configured;
    }

    const spanDays =
      Math.max(
        1,
        Math.round(
          (
            end.getTime() -
            start.getTime()
          ) / 86400000
        ) + 1
      );

    if (spanDays <= 45) {
      return 'day';
    }

    if (spanDays <= 210) {
      return 'week';
    }

    if (spanDays <= 900) {
      return 'month';
    }

    return 'year';
  }

  function addStatisticsPeriod(
    date,
    grouping,
    amount = 1
  ) {
    const next =
      new Date(date);

    if (grouping === 'day') {
      next.setDate(
        next.getDate() + amount
      );
      return next;
    }

    if (grouping === 'week') {
      next.setDate(
        next.getDate() +
          (amount * 7)
      );
      return next;
    }

    if (grouping === 'month') {
      next.setMonth(
        next.getMonth() + amount,
        1
      );
      return next;
    }

    next.setFullYear(
      next.getFullYear() + amount,
      0,
      1
    );
    return next;
  }

  function getStatisticsBucketStart(
    date,
    grouping,
    rangeStart
  ) {
    const day =
      getStatisticsDayStart(date);

    if (!day) {
      return null;
    }

    if (grouping === 'day') {
      return day;
    }

    if (grouping === 'week') {
      const differenceDays =
        Math.floor(
          (
            day.getTime() -
            rangeStart.getTime()
          ) / 86400000
        );

      const bucketOffset =
        Math.max(
          0,
          Math.floor(
            differenceDays / 7
          ) * 7
        );

      const bucket =
        new Date(rangeStart);
      bucket.setDate(
        bucket.getDate() +
          bucketOffset
      );
      return bucket;
    }

    if (grouping === 'month') {
      return new Date(
        day.getFullYear(),
        day.getMonth(),
        1
      );
    }

    return new Date(
      day.getFullYear(),
      0,
      1
    );
  }

  function getStatisticsBucketEnd(
    start,
    grouping,
    overallEnd
  ) {
    const next =
      addStatisticsPeriod(
        start,
        grouping,
        1
      );

    next.setMilliseconds(
      next.getMilliseconds() - 1
    );

    return next.getTime() >
      overallEnd.getTime()
      ? overallEnd
      : next;
  }

  function formatStatisticsBucketLabel(
    bucket,
    grouping,
    {
      includeYear = false,
    } = {}
  ) {
    const locale =
      i18n?.getLocale?.() ??
      'ru-RU';

    if (grouping === 'day') {
      return new Intl.DateTimeFormat(
        locale,
        {
          day: 'numeric',
          month: 'short',
        }
      ).format(bucket.start);
    }

    if (grouping === 'week') {
      return new Intl.DateTimeFormat(
        locale,
        {
          day: 'numeric',
          month: 'short',
        }
      ).format(bucket.start);
    }

    if (grouping === 'month') {
      return new Intl.DateTimeFormat(
        locale,
        includeYear
          ? {
              month: 'short',
              year: '2-digit',
            }
          : {
              month: 'short',
            }
      ).format(bucket.start);
    }

    return String(
      bucket.start.getFullYear()
    );
  }

  function formatStatisticsBucketTooltipDate(
    bucket,
    grouping
  ) {
    if (grouping === 'day') {
      return formatStatisticsLongDate(
        bucket.start
      );
    }

    if (
      getStatisticsDateKey(
        bucket.start
      ) ===
      getStatisticsDateKey(
        bucket.end
      )
    ) {
      return formatStatisticsLongDate(
        bucket.start
      );
    }

    return t(
      'statistics.activityDateRange',
      {
        start:
          formatStatisticsLongDate(
            bucket.start
          ),
        end:
          formatStatisticsLongDate(
            bucket.end
          ),
      }
    );
  }

  function createStatisticsActivityBuckets(
    results,
    now,
    rangeKey
  ) {
    const today =
      getStatisticsDayStart(now) ??
      new Date();

    const start =
      getStatisticsRangeStart(
        results,
        today,
        rangeKey
      );

    const grouping =
      getStatisticsActivityGrouping(
        start,
        today,
        rangeKey
      );

    let alignedStart =
      new Date(start);

    if (grouping === 'month') {
      alignedStart = new Date(
        start.getFullYear(),
        start.getMonth(),
        1
      );
    } else if (grouping === 'year') {
      alignedStart = new Date(
        start.getFullYear(),
        0,
        1
      );
    }

    const buckets = [];
    let cursor =
      new Date(alignedStart);

    while (
      cursor.getTime() <=
      today.getTime()
    ) {
      const bucketStart =
        new Date(cursor);
      const bucketEnd =
        getStatisticsBucketEnd(
          bucketStart,
          grouping,
          today
        );

      buckets.push({
        start: bucketStart,
        end: bucketEnd,
        completed: 0,
        published: 0,
      });

      cursor =
        addStatisticsPeriod(
          cursor,
          grouping,
          1
        );
    }

    const bucketMap =
      new Map(
        buckets.map(
          (bucket) => [
            getStatisticsDateKey(
              bucket.start
            ),
            bucket,
          ]
        )
      );

    results.forEach((result) => {
      [
        [
          'completedAt',
          'completed',
        ],
        [
          'publishedAt',
          'published',
        ],
      ].forEach(
        ([field, counter]) => {
          const date =
            parseStatisticsDate(
              result[field]
            );

          if (
            !date ||
            date.getTime() <
              alignedStart.getTime() ||
            date.getTime() >
              today.getTime()
          ) {
            return;
          }

          const bucketStart =
            getStatisticsBucketStart(
              date,
              grouping,
              alignedStart
            );

          const bucket =
            bucketMap.get(
              getStatisticsDateKey(
                bucketStart
              )
            );

          if (bucket) {
            bucket[counter] += 1;
          }
        }
      );
    });

    return {
      buckets,
      grouping,
      start: alignedStart,
      end: today,
    };
  }

  function getStatisticsActivityScale(
    buckets
  ) {
    const rawMaximum =
      Math.max(
        0,
        ...buckets.flatMap(
          (bucket) => [
            bucket.completed,
            bucket.published,
          ]
        )
      );

    if (rawMaximum <= 4) {
      const maximum =
        Math.max(
          1,
          rawMaximum
        );

      return {
        maximum,
        ticks:
          Array.from(
            {
              length:
                maximum + 1,
            },
            (_, index) => index
          ),
      };
    }

    const step =
      Math.max(
        1,
        Math.ceil(
          rawMaximum / 4
        )
      );

    const maximum =
      step * 4;

    return {
      maximum,
      ticks: [
        0,
        step,
        step * 2,
        step * 3,
        maximum,
      ],
    };
  }

  function getStatisticsActivityLabelStep(
    bucketCount
  ) {
    if (bucketCount <= 14) {
      return 1;
    }

    if (bucketCount <= 30) {
      return 4;
    }

    return Math.ceil(
      bucketCount / 10
    );
  }

  function createStatisticsActivityRangeSelect() {
    const wrapper =
      document.createElement('label');
    wrapper.className =
      'statistics-activity-range-control';

    const label =
      document.createElement('span');
    label.textContent =
      t('statistics.range.label');

    const select =
      document.createElement('select');
    select.setAttribute(
      'aria-label',
      t('statistics.range.aria')
    );

    Object.entries(
      STATISTICS_ACTIVITY_RANGES
    ).forEach(
      ([value, config]) => {
        const option =
          document.createElement('option');
        option.value = value;
        option.textContent =
          t(config.translationKey);
        option.selected =
          value ===
          statisticsActivityRange;
        select.append(option);
      }
    );

    select.addEventListener(
      'change',
      () => {
        if (
          STATISTICS_ACTIVITY_RANGES[
            select.value
          ]
        ) {
          statisticsActivityRange =
            select.value;
        }
      }
    );

    wrapper.append(label, select);

    return {
      wrapper,
      select,
    };
  }

  function createStatisticsActivityChart(
    results,
    now,
    rangeKey =
      statisticsActivityRange
  ) {
    const {
      buckets,
      grouping,
      start,
      end,
    } =
      createStatisticsActivityBuckets(
        results,
        now,
        rangeKey
      );

    const {
      maximum,
      ticks,
    } =
      getStatisticsActivityScale(
        buckets
      );

    const chart =
      document.createElement('div');
    chart.className =
      'statistics-activity-chart';

    const body =
      document.createElement('div');
    body.className =
      'statistics-activity-body';

    const yAxis =
      document.createElement('div');
    yAxis.className =
      'statistics-activity-y-axis';

    ticks.forEach((tick) => {
      const label =
        document.createElement('span');
      label.textContent =
        String(tick);
      label.style.bottom =
        `${(tick / maximum) * 100}%`;
      yAxis.append(label);
    });

    const canvas =
      document.createElement('div');
    canvas.className =
      'statistics-activity-canvas';

    const gridlines =
      document.createElement('div');
    gridlines.className =
      'statistics-activity-gridlines';

    ticks.forEach((tick) => {
      const line =
        document.createElement('i');
      line.style.bottom =
        `${(tick / maximum) * 100}%`;

      if (tick === 0) {
        line.classList.add(
          'statistics-activity-baseline'
        );
      }

      gridlines.append(line);
    });

    const plot =
      document.createElement('div');
    plot.className =
      'statistics-activity-plot';
    plot.style.gridTemplateColumns =
      `repeat(${Math.max(
        buckets.length,
        1
      )}, minmax(3px, 1fr))`;

    buckets.forEach((bucket) => {
      const column =
        document.createElement('div');
      column.className =
        'statistics-activity-column';
      column.title = t(
        'statistics.activityTooltip',
        {
          date:
            formatStatisticsBucketTooltipDate(
              bucket,
              grouping
            ),
          completed:
            bucket.completed,
          published:
            bucket.published,
        }
      );

      const completedBar =
        document.createElement('i');
      completedBar.className =
        'statistics-activity-bar statistics-activity-bar-completed';
      completedBar.style.height =
        `${(bucket.completed / maximum) * 100}%`;

      const publishedBar =
        document.createElement('i');
      publishedBar.className =
        'statistics-activity-bar statistics-activity-bar-published';
      publishedBar.style.height =
        `${(bucket.published / maximum) * 100}%`;

      column.append(
        completedBar,
        publishedBar
      );
      plot.append(column);
    });

    canvas.append(
      gridlines,
      plot
    );

    body.append(
      yAxis,
      canvas
    );

    const xAxis =
      document.createElement('div');
    xAxis.className =
      'statistics-activity-x-axis';
    xAxis.style.gridTemplateColumns =
      `34px repeat(${Math.max(
        buckets.length,
        1
      )}, minmax(3px, 1fr))`;

    const spacer =
      document.createElement('span');
    spacer.className =
      'statistics-activity-x-spacer';
    xAxis.append(spacer);

    const labelStep =
      getStatisticsActivityLabelStep(
        buckets.length
      );

    const includeYear =
      start.getFullYear() !==
      end.getFullYear();

    buckets.forEach(
      (bucket, index) => {
        const label =
          document.createElement('span');
        label.className =
          'statistics-activity-label';

        const shouldShow =
          index % labelStep === 0 ||
          index ===
            buckets.length - 1;

        label.textContent =
          shouldShow
            ? formatStatisticsBucketLabel(
                bucket,
                grouping,
                {
                  includeYear,
                }
              )
            : '';

        label.title =
          formatStatisticsBucketTooltipDate(
            bucket,
            grouping
          );

        xAxis.append(label);
      }
    );

    const footer =
      document.createElement('div');
    footer.className =
      'statistics-activity-footer';

    const legend =
      document.createElement('div');
    legend.className =
      'statistics-chart-legend';

    [
      [
        'completed',
        t('statistics.completed'),
      ],
      [
        'published',
        t('statistics.published'),
      ],
    ].forEach(([type, label]) => {
      const item =
        document.createElement('span');
      const dot =
        document.createElement('i');
      dot.className =
        `statistics-legend-dot statistics-legend-${type}`;
      item.append(
        dot,
        document.createTextNode(label)
      );
      legend.append(item);
    });

    const aggregation =
      document.createElement('small');
    aggregation.className =
      'statistics-activity-aggregation';
    aggregation.textContent = t(
      `statistics.grouping.${grouping}`
    );

    footer.append(
      legend,
      aggregation
    );

    chart.append(
      body,
      xAxis,
      footer
    );
    return chart;
  }

  function createStatisticsPipelineChart(
    {
      inProgress,
      ready,
      published,
    }
  ) {
    const total =
      inProgress + ready + published;

    const wrapper =
      document.createElement('div');
    wrapper.className =
      'statistics-pipeline';

    if (!total) {
      return createStatisticsEmpty(
        t('statistics.noData')
      );
    }

    const inProgressShare =
      (inProgress / total) * 100;
    const readyShare =
      (ready / total) * 100;
    const publishedShare =
      (published / total) * 100;

    const donut =
      document.createElement('div');
    donut.className =
      'statistics-donut';
    donut.style.background =
      `conic-gradient(
        var(--calendar-execution) 0 ${inProgressShare}%,
        var(--calendar-publication-ready) ${inProgressShare}% ${inProgressShare + readyShare}%,
        var(--calendar-published) ${inProgressShare + readyShare}% 100%
      )`;

    const donutCenter =
      document.createElement('div');
    donutCenter.className =
      'statistics-donut-center';

    const totalValue =
      document.createElement('strong');
    totalValue.textContent =
      String(total);

    const totalLabel =
      document.createElement('span');
    totalLabel.textContent =
      t('statistics.results');

    donutCenter.append(
      totalValue,
      totalLabel
    );
    donut.append(donutCenter);

    const legend =
      document.createElement('div');
    legend.className =
      'statistics-pipeline-legend';

    [
      {
        type: 'in-progress',
        label:
          t('statistics.inProgress'),
        value: inProgress,
      },
      {
        type: 'ready',
        label:
          t('statistics.readyToPublish'),
        value: ready,
      },
      {
        type: 'published',
        label:
          t('statistics.published'),
        value: published,
      },
    ].forEach((entry) => {
      const row =
        document.createElement('div');
      row.className =
        'statistics-pipeline-row';

      const label =
        document.createElement('span');
      const dot =
        document.createElement('i');
      dot.className =
        `statistics-legend-dot statistics-legend-${entry.type}`;
      label.append(
        dot,
        document.createTextNode(
          entry.label
        )
      );

      const value =
        document.createElement('strong');
      value.textContent =
        String(entry.value);

      row.append(label, value);
      legend.append(row);
    });

    wrapper.append(donut, legend);
    return wrapper;
  }

  function getStatisticsCategoryDistribution(
    results,
    {
      sourceItems,
      categories,
      referenceKey,
    }
  ) {
    const sourceById = new Map(
      sourceItems.map(
        (item) => [item.id, item]
      )
    );
    const categoryById = new Map(
      categories.map(
        (category) => [
          category.id,
          category,
        ]
      )
    );
    const counts = new Map();

    results.forEach((result) => {
      const source =
        sourceById.get(
          result[referenceKey]
        );

      const categoryId =
        source?.categoryId ?? null;
      const key =
        categoryId ||
        '__uncategorized__';

      counts.set(
        key,
        (counts.get(key) ?? 0) + 1
      );
    });

    return Array.from(
      counts.entries()
    )
      .map(([categoryId, count]) => {
        if (
          categoryId ===
          '__uncategorized__'
        ) {
          return {
            id: categoryId,
            label:
              t('common.uncategorized'),
            count,
            color:
              'var(--text-muted)',
          };
        }

        const category =
          categoryById.get(categoryId);

        if (!category) {
          return null;
        }

        return {
          id: category.id,
          label: category.name,
          count,
          color: category.color,
        };
      })
      .filter(Boolean)
      .sort(
        (first, second) =>
          second.count - first.count ||
          first.label.localeCompare(
            second.label,
            i18n?.getLocale?.() ??
              'ru-RU'
          )
      );
  }

  function calculateStatisticsPerformance(
    results,
    plannedField,
    actualField
  ) {
    const comparable =
      results.filter(
        (result) =>
          result[plannedField] &&
          result[actualField]
      );

    if (!comparable.length) {
      return {
        count: 0,
        onTime: 0,
        rate: null,
        averageVarianceDays: null,
      };
    }

    let onTime = 0;
    let varianceTotal = 0;

    comparable.forEach((result) => {
      const planned =
        getStatisticsDayStart(
          result[plannedField]
        );
      const actual =
        getStatisticsDayStart(
          result[actualField]
        );

      if (!planned || !actual) {
        return;
      }

      const difference =
        (
          actual.getTime() -
          planned.getTime()
        ) / 86400000;

      varianceTotal += difference;

      if (difference <= 0) {
        onTime += 1;
      }
    });

    return {
      count: comparable.length,
      onTime,
      rate: Math.round(
        (onTime / comparable.length) *
          100
      ),
      averageVarianceDays:
        varianceTotal /
        comparable.length,
    };
  }

  function createStatisticsPerformanceRow(
    label,
    performance
  ) {
    const row =
      document.createElement('div');
    row.className =
      'statistics-performance-row';

    const top =
      document.createElement('div');
    top.className =
      'statistics-performance-top';

    const labelElement =
      document.createElement('span');
    labelElement.textContent = label;

    const value =
      document.createElement('strong');
    value.textContent =
      performance.rate === null
        ? '—'
        : `${performance.rate}%`;

    top.append(labelElement, value);

    const track =
      document.createElement('div');
    track.className =
      'statistics-performance-track';

    const fill =
      document.createElement('div');
    fill.className =
      'statistics-performance-fill';
    fill.style.width =
      `${performance.rate ?? 0}%`;
    track.append(fill);

    const note =
      document.createElement('small');

    if (
      performance.averageVarianceDays ===
      null
    ) {
      note.textContent =
        t('statistics.noComparableData');
    } else {
      const variance =
        performance.averageVarianceDays;
      const rounded =
        Math.round(
          Math.abs(variance) * 10
        ) / 10;

      note.textContent =
        Math.abs(variance) < 0.05
          ? t(
              'statistics.onPlanAverage'
            )
          : variance < 0
            ? t(
                'statistics.earlyAverage',
                { days: rounded }
              )
            : t(
                'statistics.lateAverage',
                { days: rounded }
              );
    }

    row.append(top, track, note);
    return row;
  }

  function renderStatisticsView(
    state,
    now = new Date()
  ) {
    const container =
      document.querySelector(
        '#statistics-dashboard'
      );

    if (!container) {
      return;
    }

    const allResults =
      Array.isArray(state.results)
        ? state.results
        : [];

    const trackedResults =
      allResults.filter(
        (result) =>
          getWorkflowStatus(result) !==
          'archived'
      );

    const completedHistory =
      allResults.filter(
        (result) =>
          Boolean(result.completedAt)
      );

    const publishedHistory =
      allResults.filter(
        (result) =>
          Boolean(result.publishedAt)
      );

    const completedTracked =
      trackedResults.filter(
        (result) =>
          Boolean(result.completedAt)
      );

    const publishedTracked =
      trackedResults.filter(
        (result) =>
          Boolean(result.publishedAt)
      );

    const readyToPublish =
      trackedResults.filter(
        (result) =>
          Boolean(result.completedAt) &&
          !result.publishedAt
      );

    const inProgress =
      trackedResults.filter(
        (result) =>
          !result.completedAt
      );

    const completionRate =
      trackedResults.length
        ? Math.round(
            (
              completedTracked.length /
              trackedResults.length
            ) * 100
          )
        : 0;

    const publicationRate =
      completedTracked.length
        ? Math.round(
            (
              publishedTracked.length /
              completedTracked.length
            ) * 100
          )
        : 0;

    const averageScore =
      trackedResults.length
        ? (
            trackedResults.reduce(
              (sum, result) =>
                sum +
                Number(
                  result.score ?? 0
                ),
              0
            ) /
            trackedResults.length
          ).toFixed(1)
        : '0.0';

    const metrics =
      document.createElement('div');
    metrics.className =
      'statistics-metrics';

    metrics.append(
      createStatisticsMetric({
        label:
          t('statistics.resultsTracked'),
        value: trackedResults.length,
        note:
          t('statistics.excludesArchive'),
      }),
      createStatisticsMetric({
        label:
          t('statistics.completed'),
        value:
          completedHistory.length,
        note:
          t('statistics.completionRate', {
            rate: completionRate,
          }),
        tone: 'completed',
      }),
      createStatisticsMetric({
        label:
          t('statistics.published'),
        value:
          publishedHistory.length,
        note:
          t('statistics.publicationRate', {
            rate: publicationRate,
          }),
        tone: 'published',
      }),
      createStatisticsMetric({
        label:
          t(
            'statistics.readyToPublish'
          ),
        value:
          readyToPublish.length,
        note:
          t('statistics.completedNotPublished'),
        tone: 'ready',
      }),
      createStatisticsMetric({
        label:
          t('statistics.inProgress'),
        value: inProgress.length,
        note:
          t('statistics.activePipeline'),
        tone: 'execution',
      }),
      createStatisticsMetric({
        label:
          t('statistics.averageScore'),
        value: averageScore,
        note:
          t('statistics.scoreScale'),
      })
    );

    const visualGrid =
      document.createElement('div');
    visualGrid.className =
      'statistics-visual-grid';

    const activityPanel =
      createStatisticsPanel({
        title:
          t('statistics.activityTitle'),
        subtitle:
          t('statistics.activitySubtitle'),
        className:
          'statistics-panel-wide',
      });

    const activityRangeControl =
      createStatisticsActivityRangeSelect();

    const activityHeader =
      activityPanel.querySelector(
        '.statistics-panel-header'
      );

    if (activityHeader) {
      activityHeader.classList.add(
        'statistics-activity-panel-header'
      );
      activityHeader.append(
        activityRangeControl.wrapper
      );
    }

    activityPanel.append(
      createStatisticsActivityChart(
        allResults,
        now,
        statisticsActivityRange
      )
    );

    activityRangeControl.select
      .addEventListener(
        'change',
        () => {
          renderStatisticsView(
            state,
            new Date()
          );
        }
      );

    const pipelinePanel =
      createStatisticsPanel({
        title:
          t('statistics.pipelineTitle'),
        subtitle:
          t('statistics.pipelineSubtitle'),
      });
    pipelinePanel.append(
      createStatisticsPipelineChart({
        inProgress:
          inProgress.length,
        ready:
          readyToPublish.length,
        published:
          publishedTracked.length,
      })
    );

    visualGrid.append(
      activityPanel,
      pipelinePanel
    );

    const distributionGrid =
      document.createElement('div');
    distributionGrid.className =
      'statistics-distribution-grid';

    const conceptDistribution =
      getStatisticsCategoryDistribution(
        trackedResults,
        {
          sourceItems:
            state.concepts,
          categories:
            state.conceptCategories,
          referenceKey:
            'conceptId',
        }
      );

    const musicDistribution =
      getStatisticsCategoryDistribution(
        trackedResults,
        {
          sourceItems:
            state.music,
          categories:
            state.musicCategories,
          referenceKey:
            'musicId',
        }
      );

    const conceptPanel =
      createStatisticsPanel({
        title:
          t(
            'statistics.conceptCategories'
          ),
        subtitle:
          t(
            'statistics.categorySubtitle'
          ),
      });
    conceptPanel.append(
      createStatisticsDistribution(
        conceptDistribution,
        {
          emptyText:
            t('statistics.noData'),
        }
      )
    );

    const musicPanel =
      createStatisticsPanel({
        title:
          t(
            'statistics.musicCategories'
          ),
        subtitle:
          t(
            'statistics.categorySubtitle'
          ),
      });
    musicPanel.append(
      createStatisticsDistribution(
        musicDistribution,
        {
          emptyText:
            t('statistics.noData'),
        }
      )
    );

    distributionGrid.append(
      conceptPanel,
      musicPanel
    );

    const frequencyGrid =
      document.createElement('div');
    frequencyGrid.className =
      'statistics-frequency-grid';

    const topIdeas =
      getStatisticsFrequency(
        trackedResults,
        'ideaId',
        state.ideas,
        (idea) => idea.text
      );

    const topConcepts =
      getStatisticsFrequency(
        trackedResults,
        'conceptId',
        state.concepts,
        (concept) => concept.text
      );

    const topMusic =
      getStatisticsFrequency(
        trackedResults,
        'musicId',
        state.music,
        (musicItem) =>
          getMusicDisplayLabel(musicItem)
      );

    [
      {
        title:
          t('statistics.topIdeas'),
        entries: topIdeas,
      },
      {
        title:
          t('statistics.topConcepts'),
        entries: topConcepts,
      },
      {
        title:
          t('statistics.topMusic'),
        entries: topMusic,
      },
    ].forEach((group) => {
      const panel =
        createStatisticsPanel({
          title: group.title,
          subtitle:
            t(
              'statistics.frequencySubtitle'
            ),
        });

      panel.append(
        createStatisticsRankList(
          group.entries,
          {
            emptyText:
              t('statistics.noData'),
          }
        )
      );
      frequencyGrid.append(panel);
    });

    const insightGrid =
      document.createElement('div');
    insightGrid.className =
      'statistics-insight-grid';

    const performancePanel =
      createStatisticsPanel({
        title:
          t(
            'statistics.planningPerformance'
          ),
        subtitle:
          t(
            'statistics.planningPerformanceSubtitle'
          ),
      });

    const executionPerformance =
      calculateStatisticsPerformance(
        allResults,
        'plannedExecutionAt',
        'completedAt'
      );

    const publicationPerformance =
      calculateStatisticsPerformance(
        allResults,
        'plannedPublicationAt',
        'publishedAt'
      );

    const performanceBody =
      document.createElement('div');
    performanceBody.className =
      'statistics-performance';

    performanceBody.append(
      createStatisticsPerformanceRow(
        t('statistics.executionOnTime'),
        executionPerformance
      ),
      createStatisticsPerformanceRow(
        t('statistics.publicationOnTime'),
        publicationPerformance
      )
    );

    performancePanel.append(
      performanceBody
    );

    const productiveDays = new Map();

    completedHistory.forEach(
      (result) => {
        const key =
          getStatisticsDateKey(
            result.completedAt
          );

        if (!key) {
          return;
        }

        productiveDays.set(
          key,
          (productiveDays.get(key) ?? 0) +
            1
        );
      }
    );

    const mostProductive =
      Array.from(
        productiveDays.entries()
      ).sort(
        (first, second) =>
          second[1] - first[1] ||
          second[0].localeCompare(
            first[0]
          )
      )[0] ?? null;

    const highlightPanel =
      createStatisticsPanel({
        title:
          t('statistics.highlights'),
        subtitle:
          t('statistics.highlightsSubtitle'),
      });

    const highlights =
      document.createElement('div');
    highlights.className =
      'statistics-highlights';

    const bestCategory =
      conceptDistribution[0] ?? null;
    const bestMusicCategory =
      musicDistribution[0] ?? null;

    const highlightData = [
      {
        label:
          t(
            'statistics.mostProductiveDay'
          ),
        value:
          mostProductive
            ? formatStatisticsLongDate(
                new Date(
                  `${mostProductive[0]}T12:00`
                )
              )
            : '—',
        note:
          mostProductive
            ? t(
                'statistics.completedCount',
                {
                  count:
                    mostProductive[1],
                }
              )
            : t('statistics.noData'),
      },
      {
        label:
          t(
            'statistics.favoriteConceptCategory'
          ),
        value:
          bestCategory?.label ?? '—',
        note:
          bestCategory
            ? t(
                'statistics.uses',
                {
                  count:
                    bestCategory.count,
                }
              )
            : t('statistics.noData'),
      },
      {
        label:
          t(
            'statistics.favoriteMusicCategory'
          ),
        value:
          bestMusicCategory?.label ??
          '—',
        note:
          bestMusicCategory
            ? t(
                'statistics.uses',
                {
                  count:
                    bestMusicCategory.count,
                }
              )
            : t('statistics.noData'),
      },
    ];

    highlightData.forEach(
      (entry) => {
        const item =
          document.createElement('div');
        item.className =
          'statistics-highlight';

        const label =
          document.createElement('span');
        label.textContent =
          entry.label;

        const value =
          document.createElement('strong');
        value.textContent =
          entry.value;

        const note =
          document.createElement('small');
        note.textContent =
          entry.note;

        item.append(
          label,
          value,
          note
        );
        highlights.append(item);
      }
    );

    highlightPanel.append(highlights);
    insightGrid.append(
      performancePanel,
      highlightPanel
    );

    const topResultsPanel =
      createStatisticsPanel({
        title:
          t('statistics.topResults'),
        subtitle:
          t('statistics.topResultsSubtitle'),
        className:
          'statistics-panel-wide',
      });

    const resultRanking =
      trackedResults
        .map((result, index) => ({
          result,
          index,
        }))
        .sort(
          (first, second) =>
            Number(
              second.result.score ?? 0
            ) -
              Number(
                first.result.score ?? 0
              ) ||
            String(
              first.result.title ?? ''
            ).localeCompare(
              String(
                second.result.title ?? ''
              ),
              i18n?.getLocale?.() ??
                'ru-RU'
            )
        )
        .slice(0, 5);

    const topResultsList =
      document.createElement('div');
    topResultsList.className =
      'statistics-top-results';

    if (!resultRanking.length) {
      topResultsList.append(
        createStatisticsEmpty(
          t('statistics.noData')
        )
      );
    } else {
      resultRanking.forEach(
        ({ result, index }, rankIndex) => {
          const row =
            document.createElement('div');
          row.className =
            'statistics-top-result';

          const rank =
            document.createElement('span');
          rank.className =
            'statistics-top-result-rank';
          rank.textContent =
            `#${rankIndex + 1}`;

          const title =
            document.createElement('strong');
          title.textContent =
            getStatisticsResultTitle(
              result,
              index
            );

          const score =
            document.createElement('span');
          score.className =
            'statistics-top-result-score';
          score.textContent =
            t('statistics.scoreValue', {
              score:
                Number(
                  result.score ?? 0
                ),
            });

          row.append(
            rank,
            title,
            score
          );
          topResultsList.append(row);
        }
      );
    }

    topResultsPanel.append(
      topResultsList
    );

    container.replaceChildren(
      metrics,
      visualGrid,
      distributionGrid,
      frequencyGrid,
      insightGrid,
      topResultsPanel
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
            ? getMusicDisplayLabel(music)
            : t('result.deletedMusic'),
          ideaUrl: idea?.url ?? null,
          conceptUrl: concept?.url ?? null,
          musicUrl: music?.url ?? null,
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
    now = new Date(),
    {
      showProgress = true,
    } = {}
  ) {
    const allEvents = buildCalendarEvents(state);
    const visibleStageKeys = new Set([
      'planned-execution',
      'planned-publication-pending',
      'planned-publication-ready',
    ]);
    const events = showProgress
      ? allEvents
      : allEvents.filter(
          (event) =>
            visibleStageKeys.has(
              event.stageKey
            )
        );
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

    const resultLinks = createResultLinks([
      {
        label: t('result.idea'),
        url: event.ideaUrl,
      },
      {
        label: t('result.concept'),
        url: event.conceptUrl,
      },
      {
        label: t('result.music'),
        url: event.musicUrl,
      },
    ]);

    if (resultLinks) {
      resultLinks.classList.add(
        'result-links-calendar'
      );
    }

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
      combination
    );

    if (resultLinks) {
      card.append(resultLinks);
    }

    card.append(footer);

    return card;
  }

  function renderCalendarView(
    state,
    {
      cursorDate = new Date(),
      selectedDateKey = null,
      showProgress = true,
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

    const allEvents =
      buildCalendarEvents(state);
    const visibleStageKeys = new Set([
      'planned-execution',
      'planned-publication-pending',
      'planned-publication-ready',
    ]);
    const events = showProgress
      ? allEvents
      : allEvents.filter(
          (event) =>
            visibleStageKeys.has(
              event.stageKey
            )
        );

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
      today,
      {
        showProgress,
      }
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
          ? getMusicDisplayLabel(music)
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
    renderStatisticsView,
    renderAll,
  };
})(window);
