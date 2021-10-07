import { FileStore } from "../file-store"
import { Octokit } from "@octokit/rest"
import { Base64 } from "js-base64"

// export class GitHubFileStore extends FileStore {
//   repo: string
//   dir: string

//   constructor(opts: { repo: string; dir: string }) {
//     this.repo = opts.repo
//     this.dir = opts.dir
//   }

//   async get(key: string): Promise<string | undefined> {
//     throw new Error("TODO")
//   }
// }
