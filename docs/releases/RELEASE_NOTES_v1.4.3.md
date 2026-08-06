# c-manager v1.4.3

This patch makes the Calendar distinguish an **old execution plan** from work that is still outstanding.

Example:

- Execution planned: 9 August
- Mark as completed pressed: 4 August

The Calendar now keeps both pieces of information:

- **4 August** — green Completed event (actual completion);
- **9 August** — muted orange checked Execution plan event showing that this old plan has already been resolved.

The resolved 9 August plan is kept for context/history but does **not** count toward Planned ahead.
