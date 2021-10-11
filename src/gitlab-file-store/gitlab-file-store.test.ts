import { GitLabFileStore } from "../gitlab-file-store"
import { Gitlab } from "@gitbeaker/node"
import ty from "@xieyuheng/ty"
import * as ut from "../ut"

ut.test(GitLabFileStore.name + ".keys()", async () => {
  const files = new GitLabFileStore("cicada-lang/cicada", {
    requester: new Gitlab({}),
    dir: "books/logic-and-judgment",
  })

  const keys = await files.keys()
  ut.assert(keys.includes("book.json"))
})

ut.test("GitLabFileStore.get()", async () => {
  const files = new GitLabFileStore("cicada-lang/cicada", {
    requester: new Gitlab({}),
    dir: "books/logic-and-judgment",
  })

  const text = await files.getOrFail("book.json")
  const config = JSON.parse(text)

  const schema = ty.object({
    title: ty.string(),
    version: ty.semver(),
    src: ty.string(),
  })

  schema.validate(config)
})
