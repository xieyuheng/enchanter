import { GitHubFileStore } from "../github-file-store"
import * as ut from "../ut"

const files = new GitHubFileStore({
  repo: "cicada-lang/cicada",
  dir: "libraries/the-little-typer",
})

ut.test("GitHubFileStore.keys()", async () => {
  console.log("All the files:", await files.keys())
})
