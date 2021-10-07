import { GitHubFileStore } from "../github-file-store"
import * as ut from "../ut"
import ty from "@xieyuheng/ty"

ut.test("GitHubFileStore.keys()", async () => {
  const files = new GitHubFileStore("cicada-lang/cicada", {
    dir: "libraries/the-little-typer",
  })

  const keys = await files.keys()
  ut.assert(keys.includes("library.json"))
})

ut.test("GitHubFileStore.keys()", async () => {
  const files = new GitHubFileStore("cicada-lang/cicada", {
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
