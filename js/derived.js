'use strict';

(function createContentIdeaDerived(global) {
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

  function getWorkflowStatus(item) {
    return ['active', 'completed', 'archived'].includes(
      item?.workflowStatus
    )
      ? item.workflowStatus
      : 'active';
  }

  function parseLocalDateTime(value) {
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

  function getDateKey(value) {
    const date =
      value instanceof Date
        ? value
        : parseLocalDateTime(value);

    if (!date || Number.isNaN(date.getTime())) {
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

  function buildCalendarEvents(state) {
    const events = [];

    state.results.forEach((result, resultIndex) => {
      const workflowStatus =
        getWorkflowStatus(result);

      if (workflowStatus === 'archived') {
        return;
      }

      CALENDAR_STAGES.forEach((stage) => {
        const rawValue = result[stage.field];
        const date = parseLocalDateTime(rawValue);

        if (!date) {
          return;
        }

        const isPublicationPlan =
          stage.key === 'planned-publication';

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

        const stageKey =
          executionPlanResolved
            ? 'planned-execution-resolved'
            : publicationIsReady
              ? 'planned-publication-ready'
              : publicationNeedsWork
                ? 'planned-publication-pending'
                : stage.key;

        const stageTranslationKey =
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
          resultIndex,
          workflowStatus,
          stageKey,
          baseStageKey: stage.key,
          stageField: stage.field,
          stageTranslationKey,
          stagePriority: stage.priority,
          isPlanned: stage.planned,
          isResolved:
            !stage.resolutionField ||
            Boolean(result[stage.resolutionField]),
          publicationIsReady,
          publicationNeedsWork,
          executionPlanResolved,
          value: rawValue,
          date,
          dateKey: getDateKey(date),
        });
      });
    });

    events.sort((first, second) => (
      first.date.getTime() -
        second.date.getTime() ||
      first.stagePriority -
        second.stagePriority ||
      first.resultIndex -
        second.resultIndex
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
    const planningStageKeys = new Set([
      'planned-execution',
      'planned-publication-pending',
      'planned-publication-ready',
    ]);

    const events = showProgress
      ? allEvents
      : allEvents.filter(
          (event) =>
            planningStageKeys.has(event.stageKey)
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
          parseLocalDateTime(
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

  function getFrequency(
    results,
    referenceKey,
    items,
    labelBuilder,
    locale = 'en'
  ) {
    const counts = new Map();
    const itemsById = new Map(
      items.map((item) => [item.id, item])
    );

    results.forEach((result) => {
      const itemId = result[referenceKey];

      if (!itemId) {
        return;
      }

      counts.set(
        itemId,
        (counts.get(itemId) ?? 0) + 1
      );
    });

    return Array.from(counts.entries())
      .map(([itemId, count]) => {
        const item = itemsById.get(itemId);

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
            locale
          )
      );
  }

  function getDayStart(value) {
    if (!value) {
      return null;
    }

    const date =
      value instanceof Date
        ? new Date(value)
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  function calculatePerformance(
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
    let validCount = 0;

    comparable.forEach((result) => {
      const planned =
        getDayStart(result[plannedField]);
      const actual =
        getDayStart(result[actualField]);

      if (!planned || !actual) {
        return;
      }

      validCount += 1;

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

    if (!validCount) {
      return {
        count: 0,
        onTime: 0,
        rate: null,
        averageVarianceDays: null,
      };
    }

    return {
      count: validCount,
      onTime,
      rate: Math.round(
        (onTime / validCount) * 100
      ),
      averageVarianceDays:
        varianceTotal / validCount,
    };
  }

  global.ContentIdeaDerived = {
    CALENDAR_STAGES,
    getWorkflowStatus,
    parseLocalDateTime,
    getDateKey,
    buildCalendarEvents,
    getCalendarMetrics,
    getFrequency,
    calculatePerformance,
  };
})(window);
