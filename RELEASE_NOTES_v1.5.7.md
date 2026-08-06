# c-manager v1.5.7

Persistence hotfix for Result workflow actions.

`markResultCompleted()` and `markResultPublished()` were missing from the storage autosave wrapper list. The UI therefore updated immediately, while localStorage still contained the previous Result state. Reloading the page restored that stale state.

v1.5.7 adds both methods to autosave.

No existing data is migrated, reset or cleared.
