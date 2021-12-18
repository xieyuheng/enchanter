import ty from "@xieyuheng/ty"
import * as ut from "../../ut"
import { GitLabFileStore } from "../gitlab-file-store"

ut.test("keys", async () => {
  const files = new GitLabFileStore("xieyuheng/the-little-typer-exercises")

  const keys = await files.keys()
  ut.assert(keys.includes("book.json"))
})

ut.test("cd", async () => {
  const files = new GitLabFileStore("xieyuheng/the-little-typer-exercises")

  {
    const keys = await files.cd("src").cd("..").keys()
    ut.assert(keys.includes("book.json"))
  }
})

ut.test("get", async () => {
  const files = new GitLabFileStore("xieyuheng/the-little-typer-exercises")

  const text = await files.getOrFail("book.json")
  const config = JSON.parse(text)

  const schema = ty.object({
    title: ty.string(),
    version: ty.semver(),
    src: ty.string(),
  })

  schema.validate(config)
})
