# c-manager v1.4.2

This release changes the meaning of **Planned ahead** to measure actual content-plan coverage.

## New Planned ahead logic

The metric now counts the number of distinct calendar days from today onward that contain at least one planned content event.

These all count as a planned day:

- Execution planned;
- Publication planned — still in progress;
- Ready to publish.

Multiple Results on the same date still count as only **one day**.

For example, if there are plans today, tomorrow, and the day after tomorrow, **Planned ahead = 3 days**.
