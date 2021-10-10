import { Store } from "../store"

export abstract class FileStore extends Store<string> {
  abstract keys(): Promise<Array<string>>

  async all(): Promise<Record<string, string>> {
    const keys = await this.keys()
    const entries = await Promise.all(
      keys.map((path) => [path, this.getOrFail(path)])
    )
    return Object.fromEntries(entries)
  }
}
