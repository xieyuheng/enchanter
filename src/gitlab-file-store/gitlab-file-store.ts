import { FileStore } from "../file-store"
import type { Gitlab } from "@gitbeaker/browser"
import { Base64 } from "js-base64"
import ty from "@xieyuheng/ty"
import * as ut from "../ut"

export class GitLabFileStore extends FileStore {
  path: string
  dir: string

  hostURL: string
  token?: string

  constructor(
    path: string,
    opts: { dir?: string; token?: string; hostURL?: string }
  ) {
    super()
    this.path = path
    this.hostURL = opts.hostURL || "https://gitlab.com"
    this.dir = opts.dir || ""
    this.token = opts.token
  }

  cacheRequester?: InstanceType<typeof Gitlab>

  async requester(): Promise<InstanceType<typeof Gitlab>> {
    if (this.cacheRequester) {
      return this.cacheRequester
    }

    if (ut.isBrowser()) {
      const { Gitlab } = await import("@gitbeaker/browser")
      const requester = new Gitlab({ host: this.hostURL, token: this.token })
      this.cacheRequester = requester
      return requester
    } else {
      const { Gitlab } = await import("@gitbeaker/node")
      const requester = new Gitlab({ host: this.hostURL, token: this.token })
      this.cacheRequester = requester
      return requester
    }
  }

  async keys(): Promise<Array<string>> {
    const { Repositories } = await this.requester()

    const entries = await Repositories.tree(this.path, {
      path: this.dir,
      recursive: true,
    })

    const keys: Array<string> = []

    for (const entry of entries) {
      if (entry.type === "blob" && entry.path.startsWith(this.dir)) {
        keys.push(entry.path.slice(normalizeDir(this.dir).length))
      }
    }

    return keys
  }

  async get(path: string): Promise<string | undefined> {
    const { RepositoryFiles } = await this.requester()

    const fileEntry = await RepositoryFiles.show(
      this.path,
      `${this.dir}/${path}`,
      "master"
    )

    return Base64.decode(fileEntry.content)
  }
}

// NOTE Examples:
//   "" => ""
//   "a" => "a/"
//   "a/b" => "a/b/"
function normalizeDir(dir: string): string {
  if (dir === "") return dir
  if (dir.startsWith("/")) return normalizeDir(dir.slice(1))
  if (dir.endsWith("//")) return normalizeDir(dir.slice(0, dir.length - 1))
  if (!dir.endsWith("/")) return dir + "/"
  else return dir
}
