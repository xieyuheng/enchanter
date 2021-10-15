import { GitFileStore } from "../../git-file-store"
import { Octokit } from "@octokit/rest"
import { Base64 } from "js-base64"
import ty from "@xieyuheng/ty"
import Path from "path"

export class GitHubFileStore extends GitFileStore {
  path: string
  dir: string

  owner: string
  repo: string
  token?: string

  requester: Octokit

  constructor(path: string, opts?: { dir?: string; token?: string }) {
    const dir = opts?.dir || ""
    super({ path, dir })
    this.path = path
    this.dir = dir
    this.token = opts?.token
    const [owner, repo] = path.split("/")
    this.owner = owner
    this.repo = repo
    this.requester = new Octokit({ auth: opts?.token })
  }

  cd(subdir: string): GitHubFileStore {
    return new GitHubFileStore(this.path, {
      dir: Path.normalize(`${this.dir}/${subdir}`),
      token: this.token,
    })
  }

  private async getContent(path: string) {
    const { data } = await this.requester.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path: normalizeFile(path),
    })

    return data
  }

  private async getTree(sha: string, opts?: { recursive?: boolean }) {
    const {
      data: { tree, truncated },
    } = await this.requester.rest.git.getTree({
      owner: this.owner,
      repo: this.repo,
      tree_sha: sha,
      recursive: opts?.recursive ? "true" : undefined,
    })

    if (truncated) {
      console.warn(
        [
          `During GitHubFileStore.getTree()`,
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
            `During GitHubFileStore.keys()`,
            `I found unhandled content type: ${content.type}`,
          ].join("\n")
        )
      }
    }

    return keys
  }

  async get(path: string): Promise<string | undefined> {
    const content = await this.getContent(`${this.dir}/${path}`)

    if (!("content" in content)) {
      throw new Error(
        [
          `I was expecting blob returned from github to have content`,
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
