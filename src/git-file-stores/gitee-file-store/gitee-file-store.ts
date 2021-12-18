import axios, { AxiosInstance } from "axios"
import { Base64 } from "js-base64"
import Path from "path"
import { GitFileStore } from "../../git-file-store"

// NOTE https://gitee.com/api/v5/swagger

export class GiteeFileStore extends GitFileStore {
  path: string
  dir: string

  owner: string
  repo: string

  requester: AxiosInstance

  constructor(
    path: string,
    opts?: {
      dir?: string
    }
  ) {
    const dir = opts?.dir || ""
    super({ path, dir })
    this.path = path
    this.dir = dir

    const [owner, repo] = path.split("/")
    this.owner = owner
    this.repo = repo

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    this.requester = axios.create({
      baseURL: `https://gitee.com/api/v5`,
      timeout: 0, // NOTE no timeout,
      headers,
    })
  }

  cd(subdir: string): GiteeFileStore {
    return new GiteeFileStore(this.path, {
      dir: Path.normalize(`${this.dir}/${subdir}`),
    })
  }

  private async getContent(path: string) {
    const { data } = await this.requester.get(`/repos/${this.path}/contents`, {
      params: { path: normalizeFile(path) },
    })

    return data
  }

  private async getTree(sha: string, opts?: { recursive?: boolean }) {
    const {
      data: { tree, truncated },
    }: any = await this.requester.get(`/repos/${this.path}/git/trees/${sha}`, {
      params: {
        recursive: Number(opts?.recursive),
      },
    })

    if (truncated) {
      console.warn(
        [
          `During GiteeFileStore.getTree()`,
          `The number of items in the tree array exceeded github's maximum limit.`,
          `  length of return array: ${tree.length}`,
          `  owner: ${this.owner}`,
          `  repo: ${this.repo}`,
          `  sha: ${sha}`,
        ].join("\n")
      )
    }

    return tree
  }

  async keys(): Promise<Array<string>> {
    const contents = await this.getContent(`${this.dir}`)

    if (!(contents instanceof Array)) {
      throw new Error(
        [
          `I was expecting data to be Array`,
          `  path: ${this.owner}`,
          `  path: ${this.repo}`,
          `  dir: ${this.dir}`,
          ``,
          `Maybe the given dir is not dir but a file?`,
        ].join("\n")
      )
    }

    const keys: Array<string> = []

    for (const content of contents as any) {
      if (content.type === "file") {
        keys.push(content.name)
      } else if (content.type === "dir") {
        const tree = await this.getTree(content.sha, { recursive: true })
        for (const node of tree) {
          const dir = content.name
          if (node.type === "blob") {
            keys.push(`${dir}/${node.path}`)
          }
        }
      } else {
        console.warn(
          [
            `During GiteeFileStore.keys()`,
            `I found unhandled content type: ${content.type}`,
          ].join("\n")
        )
      }
    }

    return keys
  }

  async get(path: string): Promise<string | undefined> {
    const content: any = await this.getContent(`${this.dir}/${path}`)

    if (!("content" in content)) {
      throw new Error(
        [
          `I was expecting blob returned from gitee to have content`,
          `  owner: ${this.owner}`,
          `  repo: ${this.repo}`,
          `  dir: ${this.dir}`,
          `  path: ${path}`,
          ``,
          `Maybe the given dir is not dir but a file?`,
        ].join("\n")
      )
    }

    return Base64.decode(content.content)
  }
}

// NOTE Examples:
//   "/a" => "a"
//   "/a/b" => "/a/b"
function normalizeFile(file: string): string {
  if (file.startsWith("/")) return normalizeFile(file.slice(1))
  else return file
}
