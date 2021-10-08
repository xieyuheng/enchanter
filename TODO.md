- [cli] `enchanter snapshot` run glob

  - test by `example.snapshot.ts`

- [cli] `enchanter test` support `--exclude <glob>`

- test by `example.test.ts`

- `TestResult.snapshotError` -- snapshot by append `.err`

- `TestResult.snapshotError`

- test by `example.error.ts`

- `TestRunner.test` use async job queue

# cli

- discover `commands` from `lib/cli/commands` -- by convention
- discover `commands` by config in `enchanter.config.js`

# resource

- `postgres-resource` -- `get`
- `postgres-resource` -- `all`
- `postgres-resource` -- `find`
- `postgres-resource` -- `patch`
- `postgres-resource` -- `delete`

- `mongo-resource` -- `Resource` for mongodb

- `mongo-resource` -- `get`
- `mongo-resource` -- `all`
- `mongo-resource` -- `find`
- `mongo-resource` -- `patch`
- `mongo-resource` -- `delete`

# file-generator

- use js template string and `eval`
