import { Schema } from "@xieyuheng/ty"
import fs from "fs"
import { CommandRunner } from "../command-runner"
import { ServiceContainer } from "../service-container"
import * as ut from "../ut"

type SchemaObject<T> = { [P in keyof T]: Schema<T[P]> }

export abstract class Command<
  Args extends Object = {},
  Opts extends Object = {},
  App extends ServiceContainer = ServiceContainer
> {
  abstract name: string
  abstract description: string

  args: SchemaObject<Args> = {} as SchemaObject<Args>
  opts: SchemaObject<Opts> = {} as SchemaObject<Opts>

  alias: Record<string, Array<string>> = {}

  colors = ut.colors

  help?(runner: CommandRunner<App>): string

  abstract execute(argv: Args & Opts, runner: CommandRunner<App>): Promise<void>

  static assertFile(path: string): void {
    if (!fs.existsSync(path)) {
      console.error(
        [
          `I expect the given path to refer to a file, but it does not exist.`,
          `  path: ${path}`,
        ].join("\n")
      )
      process.exit(1)
    }

    if (!fs.lstatSync(path).isFile()) {
      console.error(
        [
          `I expect the given path to refer to a file, but it refers to something else.`,
          `  path: ${path}`,
        ].join("\n")
      )
      process.exit(1)
    }
  }

  static assertExists(path: string): void {
    if (!fs.existsSync(path)) {
      console.error(
        [
          `I expect the given path to exist, but it does not exist.`,
          `  path: ${path}`,
        ].join("\n")
      )
      process.exit(1)
    }
  }
}
