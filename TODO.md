- `TestRunner.test` use async job queue

- `TestResult.snapshotError` -- snapshot by append `.err`
- `TestResult.snapshotError`

- test by `snapshot-error-command.error.ts`

- `enchanter error` write snapshot even `stderr` is empty

   - this will ensure delete old snapshot after successful run

# cli

- discover `commands` from `lib/cli/commands` -- by convention
- discover `commands` by config in `enchanter.config.js`

# file-generator

- use js template string and `eval`
