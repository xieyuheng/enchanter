import { FileStore } from "../file-store"
import type { Gitlab } from "@gitbeaker/browser"
import { Base64 } from "js-base64"
import ty from "@xieyuheng/ty"
import * as ut from "../ut"

export class GitLabFileStore extends FileStore {
  path: string
  dir: string

  requester: InstanceType<typeof Gitlab>

  constructor(
    path: string,
    opts: {
      requester: InstanceType<typeof Gitlab>
      dir?: string
    }
  ) {
    super()
    this.path = path
    this.requester = opts.requester
    this.dir = opts.dir || ""
  }

  async keys(): Promise<Array<string>> {
    const { Repositories } = this.requester

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
    const { RepositoryFiles } = this.requester

    const fileEntry = await RepositoryFiles.show(
      this.path,
      normalizeFile(`${this.dir}/${path}`),
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

// NOTE Examples:
//   "/a" => "a"
//   "/a/b" => "/a/b"
function normalizeFile(file: string): string {
  if (file.startsWith("/")) return normalizeFile(file.slice(1))
  else return file
}
