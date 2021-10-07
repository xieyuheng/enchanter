import { FileStore } from "../file-store"
import { Gitlab } from "@gitbeaker/node"
import { Base64 } from "js-base64"
import ty from "@xieyuheng/ty"

export class GitLabFileStore extends FileStore {
  path: string
  dir: string

  host: string

  requester: InstanceType<typeof Gitlab>

  constructor(
    path: string,
    opts: { dir?: string; token?: string; host?: string }
  ) {
    super()
    this.path = path
    this.host = opts.host || "https://gitlab.com"
    this.dir = opts.dir || ""
    this.requester = new Gitlab({
      host: this.host,
      token: opts.token,
    })
  }

  async keys(): Promise<Array<string>> {
    const entries = await this.requester.Repositories.tree(this.path, {
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
    throw new Error("TODO")
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
