# c-manager v1.3.1

This patch fixes an ambiguity in the content calendar.

## Publication plan states

A planned publication date now has two clearly different states:

- **Publication planned — still in progress**: the Result has a publication date, but it has not been completed yet.
- **Ready to publish**: the Result has been completed and is waiting for its planned publication date.

The calendar uses different markers, event styling, day accents, and detail badges for these states.

A Result is treated as completed for publication readiness when either its **Completed** timeline field is set or the Result has been moved to the **Completed** workflow.
