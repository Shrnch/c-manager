# c-manager v1.4.0

This release simplifies the Result timeline by separating **plans** from **actual events**.

## Workspace

Users now enter only:

- Execution planned
- Publication planned

The Completed and Published date inputs have been removed.

## Completion

Choosing **Mark as completed** now:

- records the current local date and time as `completedAt`;
- moves the Result to the Completed view;
- creates the Completed event in Calendar;
- makes a future planned publication display as **Ready to publish**.

## Publication

An unpublished Result in the Completed view now has a **Mark as published** action.

Using it:

- records the current local date and time as `publishedAt`;
- creates the Published event in Calendar;
- removes the Ready to publish state.

Existing saved timeline data remains compatible.
