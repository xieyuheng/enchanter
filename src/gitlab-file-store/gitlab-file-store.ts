import { FileStore } from "../file-store"
import { Gitlab } from "@gitbeaker/browser"
import { Base64 } from "js-base64"
import ty from "@xieyuheng/ty"

export class GitLabFileStore extends FileStore {
  path: string
  dir: string

  constructor(path: string, opts: { dir?: string; token?: string }) {
    super()
    this.path = path
    this.dir = opts.dir || ""
  }

  async keys(): Promise<Array<string>> {
    throw new Error("TODO")
  }

  async get(path: string): Promise<string | undefined> {
    throw new Error("TODO")
  }
}
