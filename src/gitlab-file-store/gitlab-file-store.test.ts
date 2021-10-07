import { GitLabFileStore } from "../gitlab-file-store"
import ty from "@xieyuheng/ty"
import * as ut from "../ut"

ut.test(GitLabFileStore.name + ".keys()", async () => {
  const files = new GitLabFileStore("cicada-lang/cicada", {
    dir: "libraries/the-little-typer",
  })

  const keys = await files.keys()
  ut.assert(keys.includes("library.json"))
})

ut.test("GitLabFileStore.get()", async () => {
  const files = new GitLabFileStore("cicada-lang/cicada", {
    dir: "libraries/the-little-typer",
  })

  const text = await files.getOrFail("library.json")
  const config = JSON.parse(text)

  const schema = ty.object({
    name: ty.string(),
    version: ty.semver(),
    src: ty.string(),
  })

  schema.validate(config)
})
