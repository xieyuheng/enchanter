- [cli] `enchanter snapshot` run glob

- `TestResult.snapshot` improve format

- use `enchanter` to replace `dev` script




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
