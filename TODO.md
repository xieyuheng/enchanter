- `TestResult.snapshotError` -- snapshot by append `.err`
- `TestResult.snapshotError`

- test by `snapshot-error-command.error.ts`

- `enchanter error` write snapshot even `stderr` is empty

   - this will ensure delete old snapshot after successful run

# git-file-store

- `git-file-store`

- `github-file-store` and `gitlab-file-store` extend `git-file-store`

- `git-file-store` -- cd to `subdir`

- `git-path` return `git-file-store`

# gitee-file-store

- `gitee-file-store`

  - https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoBranchesBranch
  - https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoContents(Path)

# cli

- discover `commands` from `lib/cli/commands`

  - we need better convention, maybe `console/commands`

- [maybe] discover `commands` by config in `enchanter.config.js`

# file-generator

- use js template string and `eval`

# refactor

- [refactor] improve functions about printing `common-help-command`
