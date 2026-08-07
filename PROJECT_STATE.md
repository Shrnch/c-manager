# PROJECT STATE

## Current stage
Backend reliability refactor

## Status
Completed

## Version
v1.6.0

## Update
- state mutations now publish through a subscription API;
- autosave subscribes to state changes instead of maintaining a fragile manual list of mutating methods;
- multi-item workflow actions can be batched into a single persisted transaction;
- failed startup validation never clears or overwrites the original localStorage value;
- autosave pauses automatically after a failed load to protect the unreadable save;
- each successful save keeps the previous valid state in one local recovery snapshot;
- Calendar lifecycle calculations were moved into a pure derived-data layer;
- reusable Statistics frequency/performance calculations were moved out of the renderer;
- existing v1 data schema and JSON exports remain compatible;
- no visual redesign was introduced.

## Validation
- JavaScript syntax checks pass;
- real user backup round-trip passes;
- completion/publication persistence passes;
- corrupted-storage preservation passes;
- recovery snapshot test passes;
- Calendar/Statistics derived-data tests pass.

## Last updated
2026-08-07
