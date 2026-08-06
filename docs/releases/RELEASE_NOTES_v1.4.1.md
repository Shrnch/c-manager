# c-manager v1.4.1

This patch fixes the forward-looking publication metrics in Calendar.

## Fixed metrics

**Ready to publish** now counts only Results that:

- are completed;
- are not published;
- have a planned publication date today or in the future.

**Publications planned** now counts only Results that:

- are not published;
- have a planned publication date today or in the future.

Past publication plans remain visible in Calendar history, but they no longer inflate these forward-looking counters.
