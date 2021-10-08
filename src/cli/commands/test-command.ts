import { Command } from "../../command"
import { CommandRunner } from "../../command-runner"
import * as Commands from "../commands"
import { TestRunner } from "../../test-runner"
import app from "../../app"
import * as ut from "../../ut"
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
    const name = ut.colors.blue("test")

    return [
      `The ${name} command take a program name, a glob pattern for files,`,
      `and run the program over each file in the files.`,
      ``,
      ut.colors.blue(`  ${runner.name} test node 'lib/**/*.test.js'`),
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const runner = new TestRunner()

    app.logger.info(runner.info())

    for (const file of await fastGlob(argv["glob"])) {
      const result = await runner.test(`${argv["program"]} ${file}`)
      result.assertOk()
    }
  }
}
