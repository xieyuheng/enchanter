import { FileStore } from "../file-store"
import { Octokit } from "@octokit/rest"
import { Base64 } from "js-base64"

export class GitHubFileStore extends FileStore {
  path: string
  dir: string

  owner: string
  repo: string

  requester: Octokit

  constructor(path: string, opts: { dir: string; token?: string }) {
    super()
    this.path = path
    this.dir = opts.dir

    const [owner, repo] = path.split("/")
    this.owner = owner
    this.repo = repo

    this.requester = new Octokit({ auth: opts.token })
  }

  async keys(): Promise<Array<string>> {
    const { data: contents } = await this.requester.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path: `${this.dir}`,
    })

    const keys: Array<string> = []

    if (!(contents instanceof Array)) {
      throw new Error(
        [
          `I was expecting data to be Array`,
          `  owner: ${this.owner}`,
          `  repo: ${this.repo}`,
          `  dir: ${this.dir}`,
          ``,
          `Maybe the given dir is not dir but a file?`,
        ].join("\n")
      )
    }

    for (const content of contents as any) {
      if (content.type === "file") {
        keys.push(content.name)
      } else if (content.type === "dir") {
        const {
          data: { tree },
        } = await this.requester.rest.git.getTree({
          owner: this.owner,
          repo: this.repo,
          tree_sha: content.sha,
          recursive: "true",
        })

        for (const node of tree) {
          const dir = content.name
          if (node.type === "blob") {
            keys.push(`${dir}/${node.path}`)
          }
        }
      } else {
        console.warn(`I found unhandled content type: ${content.type}`)
      }
    }

    return keys
  }

  async get(key: string): Promise<string | undefined> {
    throw new Error("TODO")
  }
}
