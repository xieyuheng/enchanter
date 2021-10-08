import { Command } from "../../command"
import { CommandRunner } from "../../command-runner"
import * as Commands from "../commands"
import { TestRunner } from "../../test-runner"
import app from "../../app"
import ty from "@xieyuheng/ty"
import fastGlob from "fast-glob"

type Args = { program: string; glob: string }
type Opts = {}

export class TestCommand extends Command<Args, Opts> {
  name = "test"

  description = "Test a program over glob, for example: 'lib/**/*.test.js'"

  args = { program: ty.string(), glob: ty.string() }
  opts = {}

  help(runner: CommandRunner): string {
    return ""
  }

  async execute(argv: Args & Opts): Promise<void> {
    const runner = new TestRunner()

    app.logger.info(runner.info())

    for (const file of await fastGlob(argv["glob"])) {
      const result = await runner.test(`${argv["program"]} ${file}`)
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
