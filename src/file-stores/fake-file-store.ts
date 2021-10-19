import { FileStore } from "../file-store"

export class FakeFileStore extends FileStore {
  faked: Record<string, string>
  fallback: FileStore

  constructor(opts: { fallback: FileStore; faked?: Record<string, string> }) {
    super()
    this.fallback = opts.fallback
    this.faked = opts.faked || {}
  }

  fake(path: string, text: string): void {
    this.faked[path] = text
  }

  async keys(): Promise<Array<string>> {
    return Array.from(
      new Set([...(await this.fallback.keys()), ...Object.keys(this.faked)])
    )
  }

  async get(path: string): Promise<string | undefined> {
    if (this.faked[path] !== undefined) {
      return this.faked[path]
    } else {
      return await this.fallback.get(path)
    }
  }
}
