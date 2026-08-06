# c-manager v1.5.5

Emergency renderer hotfix.

v1.5.3 accidentally introduced recursive `getMusicDisplayLabel()` calls. Once a Result, Calendar event or Statistics section tried to format Music, the renderer hit `too much recursion` and stopped rendering the rest of the interface.

v1.5.5 fixes that helper directly.

No application data is deleted, reset, migrated or replaced by this hotfix.
