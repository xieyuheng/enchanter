import { GitFileStore } from "../../git-file-store"

export class FakeGitFileStore extends GitFileStore {
  faked: Record<string, string>
  fallback: GitFileStore

  constructor(opts: {
    faked?: Record<string, string>
    fallback: GitFileStore
  }) {
    const { path, dir } = opts.fallback
    super({ path, dir })
    this.faked = opts.faked || {}
    this.fallback = opts.fallback
  }

  async keys(): Promise<Array<string>> {
    return Array.from(
      new Set([...(await this.fallback.keys()), ...Object.keys(this.faked)])
    )
  }

  async get(path: string): Promise<string | undefined> {
    const found = this.faked[path]
    if (found !== undefined) {
      return found
    } else {
      return await this.fallback.get(path)
    }
  }

  cd(subdir: string): GitFileStore {
    return this.cd(subdir)
  }
}
