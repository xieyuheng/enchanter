import { GitFileStore } from "../../git-file-store"
import axios, { AxiosInstance } from "axios"
import { Base64 } from "js-base64"
import ty from "@xieyuheng/ty"
import * as ut from "../../ut"
import Path from "path"

export class GitLabFileStore extends GitFileStore {
  path: string
  dir: string

  host?: string
  token?: string

  requester: AxiosInstance

  constructor(
    path: string,
    opts?: {
      dir?: string
      host?: string
      token?: string
    }
  ) {
    const dir = opts?.dir || ""
    super({ path, dir })
    this.path = path
    this.dir = dir
    this.host = opts?.host
    this.token = opts?.token

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (opts?.token) {
      headers["Authorization"] = `Bearer ${opts.token}`
    }

    const host = opts?.host || "gitlab.com"

    this.requester = axios.create({
      baseURL: `https://${host}/api/v4`,
      timeout: 0, // NOTE no timeout,
      headers,
    })
  }

  cd(subdir: string): GitLabFileStore {
    return new GitLabFileStore(this.path, {
      dir: normalizeDir(
        this.dir
          ? Path.normalize(`${this.dir}/${subdir}`)
          : Path.normalize(subdir)
      ),
      host: this.host,
      token: this.token,
    })
  }

  async keys(): Promise<Array<string>> {
    const projectId = encodeURIComponent(this.path)

    const keys: Array<string> = []

    let page = 1

    while (true) {
      const { data: entries }: any = await this.requester.get(
        `/projects/${projectId}/repository/tree`,
        {
          params: {
            path: this.dir,
            recursive: true,
            per_page: 100,
            page,
          },
        }
      )

      page++

      for (const entry of entries) {
        if (entry.type === "blob" && entry.path.startsWith(this.dir)) {
          keys.push(entry.path.slice(normalizeDir(this.dir).length))
        }
      }

      if (entries.length === 0) break
    }

    return keys
  }

  async get(path: string): Promise<string | undefined> {
    const projectId = encodeURIComponent(this.path)
    const filePath = encodeURIComponent(normalizeFile(`${this.dir}/${path}`))

    const { data: fileEntry }: any = await this.requester.get(
      `/projects/${projectId}/repository/files/${filePath}`,
      {
        params: {
          ref: "master",
        },
      }
    )

    return Base64.decode(fileEntry.content)
  }
}

// NOTE Examples:
//   "" => ""
//   "." => ""
//   "a" => "a/"
//   "a/b" => "a/b/"
function normalizeDir(dir: string): string {
  if (dir === "") return ""
  if (dir === ".") return ""
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
