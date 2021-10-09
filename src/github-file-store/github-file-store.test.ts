import { GitHubFileStore } from "../github-file-store"
import ty from "@xieyuheng/ty"
import * as ut from "../ut"

ut.test("GitHubFileStore.keys()", async () => {
  const files = new GitHubFileStore("cicada-lang/cicada", {
    dir: "books/the-little-typer",
  })

  const keys = await files.keys()
  ut.assert(keys.includes("book.json"))
})

ut.test("GitHubFileStore.get()", async () => {
  const files = new GitHubFileStore("cicada-lang/cicada", {
    dir: "books/the-little-typer",
  })

  const text = await files.getOrFail("book.json")
  const config = JSON.parse(text)

  const schema = ty.object({
    name: ty.string(),
    version: ty.semver(),
    src: ty.string(),
  })

  schema.validate(config)
})
