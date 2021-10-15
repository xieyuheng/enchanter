import { FileStore } from "../file-store"

export abstract class GitFileStore extends FileStore {
  path: string
  dir: string

  constructor(opts: { path: string; dir: string }) {
    super()
    this.path = opts.path
    this.dir = opts.dir
  }

  abstract cd(subdir: string): GitFileStore
}
