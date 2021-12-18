- rename `GitPath` `GitLink`

- `GitLink` -- `<host>/<path>[@<version>]` -- instead of `/<path>/@<host>`

- `FileStore` should have `resolve` -- not only `LocalFileStore`

- sort file name by given weight on chars
- sort file name for table of contents

- `ServiceContainer.create` be able to take `opts` in a well typed way

# cli

- discover `commands` from `lib/cli/commands`

  - we need better convention, maybe `console/commands`

- [maybe] discover `commands` by config in `enchanter.config.js`

# file-generator

- use js template string and `eval`

# refactor

- [refactor] improve functions about printing `common-help-command`
