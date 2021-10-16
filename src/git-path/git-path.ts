import { Base64 } from "js-base64"
import * as GitFileStores from "../git-file-stores"
import { GitFileStore } from "../git-file-store"
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
      case "github.com":
        return this.path
          ? `https://github.com/${this.repo}/tree/master/${this.path}`
          : `https://github.com/${this.repo}`
      case "gitlab.com":
        return this.path
          ? `https://gitlab.com/${this.repo}/-/tree/master/${this.path}`
          : `https://gitlab.com/${this.repo}`
      default:
        return this.path
          ? `https://${this.host}/${this.repo}/-/tree/master/${this.path}`
          : `https://${this.host}/${this.repo}`
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
      path: new URL(path, `${prefix}${this.path}`).href.slice(prefix.length),
    })
  }

  createGitFileStore(): GitFileStore {
    const { host, repo, path: dir } = this

    switch (host) {
      case "github.com":
        return new GitFileStores.GitHubFileStore(repo, { dir })
      case "gitlab.com":
        return new GitFileStores.GitLabFileStore(repo, { dir })
      case "gitee.com":
        return new GitFileStores.GiteeFileStore(repo, { dir })
      default:
        return new GitFileStores.GitLabFileStore(repo, { dir, host })
    }
  }

  static fromURL(input: string): GitPath {
    const { host, pathname } = new URL(input)

    const middle =
      host === "github.com" || host === "gitee.com"
        ? "/tree/master/"
        : "/-/tree/master/" // NOTE for gitlab

    const [repo, path] = pathname
      .slice(1)
      .replace("/blob/master/", "/tree/master/")
      .split(middle)

    return new GitPath({ host, repo, path })
  }
}
