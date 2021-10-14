import { Base64 } from "js-base64"
import { GitHubFileStore } from "../github-file-store"
import { GitLabFileStore } from "../gitlab-file-store"
import { FileStore } from "../file-store"
import Path from "path"

export class GitPath {
  host: string
  repo: string
  path: string

  constructor(opts: { host: string; repo: string; path?: string }) {
    this.host = opts.host
    this.repo = opts.repo
    this.path = opts.path || ""
  }

  private format(): string {
    return JSON.stringify([this.host, this.repo, this.path])
  }

  private static parse(
    str: string
  ): [host: string, repo: string, path: string] {
    const [host, repo, path] = JSON.parse(str)
    return [host, repo, path]
  }

  encode(): string {
    return Base64.encodeURI(this.format())
  }

  static decode(str: string): GitPath {
    const [host, repo, path] = this.parse(Base64.decode(str))
    return new GitPath({ host, repo, path })
  }

  formatURL(): string {
    switch (this.host) {
      case "github":
        return this.path
          ? `https://github.com/${this.repo}/tree/master/${this.path}`
          : `https://github.com/${this.repo}`
      case "gitlab":
        return this.path
          ? `https://gitlab.com/${this.repo}/-/tree/master/${this.path}`
          : `https://gitlab.com/${this.repo}`
      default:
        return this.path
          ? `${this.host}/${this.repo}/-/tree/master/${this.path}`
          : `${this.host}/${this.repo}`
    }
  }

  upward(): GitPath {
    const { host, repo, path } = this
    const dirname = Path.dirname(path)
    const dir = dirname === "." ? "" : dirname
    return new GitPath({ host, repo, path: dir })
  }

  resolve(path: string): GitPath {
    const prefix = "placeholder:/"

    return new GitPath({
      host: this.host,
      repo: this.repo,
      path: new URL(path, `${prefix$}{this.path}`).href.slice(prefix.length),
    })
  }

  createFileStore(): FileStore {
    const { host, repo, path: dir } = this

    switch (host) {
      case "github":
        return new GitHubFileStore(repo, { dir })
      case "gitlab":
        return new GitLabFileStore(repo, { dir })
      default:
        return new GitLabFileStore(repo, { dir, host })
    }
  }
}
