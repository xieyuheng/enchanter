import { GitLabFileStore } from "../gitlab-file-store"
import ty from "@xieyuheng/ty"
import * as ut from "../ut"

ut.test("keys", async () => {
  const files = new GitLabFileStore("cicada-lang/cicada", {
    dir: "books/logic-and-judgment",
  })

  const keys = await files.keys()
  ut.assert(keys.includes("book.json"))
})

ut.test("get", async () => {
  const files = new GitLabFileStore("cicada-lang/cicada", {
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

ut.test("get from empty dir", async () => {
  const files = new GitLabFileStore("cicada-lang/cicada")

  const text = await files.getOrFail("package.json")
  const config = JSON.parse(text)

  const schema = ty.object({
    name: ty.string(),
  })

  schema.validate(config)
})
