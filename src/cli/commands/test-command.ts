import { Command } from "../../command"
import { CommandRunner } from "../../command-runner"
import * as Commands from "../commands"
import { TestRunner } from "../../test-runner"
import app from "../../app"
import ty from "@xieyuheng/ty"
import changeCase from "change-case"
import glob from "fast-glob"

type Args = {}
type Opts = {}

export class TestCommand extends Command<Args, Opts> {
  name = "test"

  description = "Run lib/**/*.test.js"

  args = {}
  opts = {}

  async execute(argv: Args & Opts): Promise<void> {
    const runner = new TestRunner()

    runner.info()

    for (const file of await glob("lib/**/*.test.js")) {
      const result = await runner.test(`node ${file}`)
      result.assertOk()
    }

    // await test(
    //   "node $file",
    //   { file: "lib/**/*.snapshot.js" },
    //   snapshot.out(({ file }) =>
    //     path.resolve("snapshot", changeCase.paramCase(file) + ".out")
    //   )
    // )
  }
}
