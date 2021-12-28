import Path from "path"
import { GitFileStore } from "../git-file-store"
import * as GitFileStores from "../git-file-stores"

export class GitLink {
  host: string
  name: string
  version: string
  path: string

  constructor(opts: {
    host: string
    name: string
    version?: string
    path?: string
  }) {
    this.host = opts.host
    this.name = opts.name
    this.version = opts.version || ""
    this.path = opts.path || ""
  }

  encode(): string {
    let s = ""

    if (this.host) {
      s += `${this.host}`
    }

    if (this.name) {
      s += `/${this.name}`
    }

    if (this.version) {
      s += `@${this.version}`
    }

    if (this.path) {
      s += `/-/${this.path}`
    }

    return s
  }

  static decode(str: string): GitLink {
    const [host_and_name, path] = str.split("/-/")
    const [host, ...rest] = host_and_name.split("/")
    const name_and_version = rest.join("/")
    const [name, version] = name_and_version.split("@")
    return new GitLink({ host, name, version, path })
  }

  formatURL(): string {
    switch (this.host) {
      case "github.com":
        return this.path
          ? `https://github.com/${this.name}/tree/master/${this.path}`
          : `https://github.com/${this.name}`
      case "gitlab.com":
        return this.path
          ? `https://gitlab.com/${this.name}/-/tree/master/${this.path}`
          : `https://gitlab.com/${this.name}`
      default:
        return this.path
          ? `https://${this.host}/${this.name}/-/tree/master/${this.path}`
          : `https://${this.host}/${this.name}`
    }
  }

  upward(): GitLink {
    const { host, name, path } = this
    const dirname = Path.dirname(path)
    const dir = dirname === "." ? "" : dirname
    return new GitLink({ host, name, path: dir })
  }

  resolve(path: string): GitLink {
    const prefix = "placeholder:/"

    return new GitLink({
      host: this.host,
      name: this.name,
      path: new URL(path, `${prefix}${this.path}`).href.slice(prefix.length),
    })
  }

  createGitFileStore(): GitFileStore {
    const { host, name, path: dir } = this

    switch (host) {
      case "github.com":
        return new GitFileStores.GitHubFileStore(name, { dir })
      case "gitlab.com":
        return new GitFileStores.GitLabFileStore(name, { dir })
      case "gitee.com":
        return new GitFileStores.GiteeFileStore(name, { dir })
      default:
        return new GitFileStores.GitLabFileStore(name, { dir, host })
    }
  }

  static fromURL(input: string): GitLink {
    const { host, pathname } = new URL(input)

    const middle = pathname.includes("/-/")
      ? "/-/tree/master/" // NOTE for gitlab
      : "/tree/master/" // NOTE for gihub and some version of gitlab

    const [name, path] = pathname
      .slice(1)
      .replace("/blob/master/", "/tree/master/")
      .split(middle)

    return new GitLink({ host, name, path })
  }
}
