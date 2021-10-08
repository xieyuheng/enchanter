# test-runner

- merge `@xieyuheng/test-runner` into `enchanter`

# cli

- `enchanter test` -- to run `*.test.js` in `lib` -- by convention

  - how about other languages like `cicada`?

- `enchanter snapshot` -- to run `*.snapshot.js` in `lib` -- by convention

  - output to `snapshot`

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
