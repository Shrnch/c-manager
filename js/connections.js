'use strict';

(function createConnectionsModule(global) {
  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  const connectionColors = [
    '#6552c7',
    '#bf642f',
    '#2e70aa',
    '#2f8066',
    '#a44870',
    '#80651f',
  ];

  const dashPatterns = [
    '',
    '10 5',
    '3 5',
    '14 5 3 5',
  ];

  let resultsProvider = () => [];
  let animationFrameId = null;
  let resizeObserver = null;
  let initialized = false;

  function getElements() {
    return {
      svg: document.querySelector('#connections-svg'),
      shell: document.querySelector('#board-shell'),
      workspace: document.querySelector('#workspace'),
    };
  }

  function getRow(itemType, itemId) {
    return Array.from(
      document.querySelectorAll(
        `.content-cell-row[data-item-type="${itemType}"]`
      )
    ).find((row) => row.dataset.itemId === itemId) ?? null;
  }

  function getAnchor(row, direction, shellRectangle, verticalOffset = 0) {
    const rectangle = row.getBoundingClientRect();
    const horizontalRatio = direction === 'outgoing' ? 0.72 : 0.28;

    return {
      x:
        rectangle.left -
        shellRectangle.left +
        rectangle.width * horizontalRatio,
      y:
        rectangle.top -
        shellRectangle.top +
        rectangle.height / 2 +
        verticalOffset,
    };
  }

  function createCurve(start, end) {
    const distance = Math.max(48, end.x - start.x);
    const controlDistance = distance * 0.45;

    return [
      `M ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
      `C ${(start.x + controlDistance).toFixed(2)} ${start.y.toFixed(2)},`,
      `${(end.x - controlDistance).toFixed(2)} ${end.y.toFixed(2)},`,
      `${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
    ].join(' ');
  }

  function createPath({
    resultId,
    segment,
    start,
    end,
    color,
    dashPattern,
  }) {
    const path = document.createElementNS(SVG_NAMESPACE, 'path');

    path.classList.add('connection-path');
    path.dataset.connectionResult = resultId;
    path.dataset.connectionSegment = segment;
    path.setAttribute('d', createCurve(start, end));
    path.style.setProperty('--connection-color', color);

    if (dashPattern) {
      path.setAttribute('stroke-dasharray', dashPattern);
    }

    return path;
  }

  function calculateParallelOffset({
    pairKey,
    pairTotals,
    pairPositions,
  }) {
    const total = pairTotals.get(pairKey) ?? 1;
    const currentPosition = pairPositions.get(pairKey) ?? 0;

    pairPositions.set(pairKey, currentPosition + 1);

    return (currentPosition - (total - 1) / 2) * 6;
  }

  function countPairs(results, pairBuilder) {
    const totals = new Map();

    results.forEach((result) => {
      const key = pairBuilder(result);
      totals.set(key, (totals.get(key) ?? 0) + 1);
    });

    return totals;
  }

  function draw(results = resultsProvider()) {
    const { svg, shell } = getElements();

    if (!svg || !shell) {
      return;
    }

    const safeResults = Array.isArray(results) ? results : [];
    const width = Math.max(shell.clientWidth, shell.scrollWidth);
    const height = Math.max(shell.clientHeight, shell.scrollHeight);

    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.replaceChildren();

    if (!safeResults.length) {
      return;
    }

    const shellRectangle = shell.getBoundingClientRect();

    const firstPairBuilder = (result) =>
      `${result.ideaId}::${result.conceptId}`;
    const secondPairBuilder = (result) =>
      `${result.conceptId}::${result.musicId}`;

    const firstPairTotals = countPairs(safeResults, firstPairBuilder);
    const secondPairTotals = countPairs(safeResults, secondPairBuilder);
    const firstPairPositions = new Map();
    const secondPairPositions = new Map();

    safeResults.forEach((result, resultIndex) => {
      const ideaRow = getRow('idea', result.ideaId);
      const conceptRow = getRow('concept', result.conceptId);
      const musicRow = getRow('music', result.musicId);

      if (!ideaRow || !conceptRow || !musicRow) {
        return;
      }

      const firstOffset = calculateParallelOffset({
        pairKey: firstPairBuilder(result),
        pairTotals: firstPairTotals,
        pairPositions: firstPairPositions,
      });

      const secondOffset = calculateParallelOffset({
        pairKey: secondPairBuilder(result),
        pairTotals: secondPairTotals,
        pairPositions: secondPairPositions,
      });

      const color =
        connectionColors[resultIndex % connectionColors.length];
      const dashPattern =
        dashPatterns[
          Math.floor(resultIndex / connectionColors.length) %
            dashPatterns.length
        ];

      const ideaAnchor = getAnchor(
        ideaRow,
        'outgoing',
        shellRectangle,
        firstOffset
      );
      const conceptIncomingAnchor = getAnchor(
        conceptRow,
        'incoming',
        shellRectangle,
        firstOffset
      );
      const conceptOutgoingAnchor = getAnchor(
        conceptRow,
        'outgoing',
        shellRectangle,
        secondOffset
      );
      const musicAnchor = getAnchor(
        musicRow,
        'incoming',
        shellRectangle,
        secondOffset
      );

      const firstPath = createPath({
        resultId: result.id,
        segment: 'idea-concept',
        start: ideaAnchor,
        end: conceptIncomingAnchor,
        color,
        dashPattern,
      });

      const secondPath = createPath({
        resultId: result.id,
        segment: 'concept-music',
        start: conceptOutgoingAnchor,
        end: musicAnchor,
        color,
        dashPattern,
      });

      svg.append(firstPath, secondPath);
    });
  }

  function scheduleDraw() {
    window.cancelAnimationFrame(animationFrameId);

    animationFrameId = window.requestAnimationFrame(() => {
      draw(resultsProvider());
    });
  }

  function setActiveResults(resultIds) {
    const activeIds = new Set(
      Array.isArray(resultIds)
        ? resultIds.filter(Boolean)
        : []
    );
    const hasActiveResults = activeIds.size > 0;

    document
      .querySelectorAll('[data-connection-result]')
      .forEach((path) => {
        const matches = activeIds.has(
          path.dataset.connectionResult
        );

        path.classList.toggle(
          'connection-path-active',
          Boolean(hasActiveResults && matches)
        );
        path.classList.toggle(
          'connection-path-muted',
          Boolean(hasActiveResults && !matches)
        );
      });
  }

  function setActiveResult(resultId, isActive) {
    setActiveResults(
      isActive && resultId ? [resultId] : []
    );
  }

  function clearActiveResult() {
    setActiveResults([]);
  }

  function init(provider) {
    resultsProvider =
      typeof provider === 'function'
        ? provider
        : () => [];

    if (initialized) {
      scheduleDraw();
      return;
    }

    initialized = true;

    const { shell, workspace } = getElements();

    if ('ResizeObserver' in window && shell) {
      resizeObserver = new ResizeObserver(scheduleDraw);
      resizeObserver.observe(shell);
    }

    window.addEventListener('resize', scheduleDraw, {
      passive: true,
    });

    workspace?.addEventListener('scroll', scheduleDraw, {
      passive: true,
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleDraw);
    }

    scheduleDraw();
  }

  global.ContentIdeaConnections = {
    init,
    draw,
    scheduleDraw,
    setActiveResults,
    setActiveResult,
    clearActiveResult,
  };
})(window);
