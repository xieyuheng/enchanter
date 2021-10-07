import { GitHubFileStore } from "../github-file-store"
import * as ut from "../ut"

const files = new GitHubFileStore("cicada-lang/cicada", {
  dir: "libraries/the-little-typer",
})

ut.test("GitHubFileStore.keys()", async () => {
  const keys = await files.keys()
  ut.assert(keys.includes("library.json"))
})
