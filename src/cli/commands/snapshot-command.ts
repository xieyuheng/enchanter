import { Command } from "../../command"
import { CommandRunner } from "../../command-runner"
import * as Commands from "../commands"
import { TestRunner } from "../../test-runner"
import app from "../../app"
import * as ut from "../../ut"
import Path from "path"
import ty from "@xieyuheng/ty"
import fastGlob from "fast-glob"
import { paramCase } from "change-case"

type Args = { program: string; glob: string }
type Opts = { extern?: string }

export class SnapshotCommand extends Command<Args, Opts> {
  name = "snapshot"

  description = "Snapshot a program over glob, write output to .out"

  args = { program: ty.string(), glob: ty.string() }
  opts = { extern: ty.optional(ty.string()) }

  help(runner: CommandRunner): string {
    const name = ut.colors.blue("snapshot")

    // prettier-ignore
    return [
      `The ${name} command take a program name, a glob pattern for files,`,
      `and run the program over each file in the files,`,
      `then write output of each result to an output file named '<file>.out'`,
      ``,
      ut.colors.blue(`  ${runner.name} snapshot ts-node 'src/**/*.snapshot.ts'`),
      ``,
      `The example above will write output to 'src/**/*.snapshot.ts.out'`,
      ``,
      `Note that, snapshot output file should be checked into source control.`,
      `We can use '--extern <dir>' to specify an external output directory.`,
      ``,
      ut.colors.blue(`  ${runner.name} snapshot node 'lib/**/*.snapshot.js' --extern snapshot`),
      ``,
      `Then the output will be written into 'snapshot/<generated-flat-file-name>.out'`,
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const runner = new TestRunner()

    app.logger.info(runner.info())

    if (argv["extern"]) {
      for (const file of await fastGlob(argv["glob"])) {
        const result = await runner.test(`${argv["program"]} ${file}`)
        await result.snapshot(argv["extern"] + "/" + paramCase(file) + ".out")
      }
    } else {
      for (const file of await fastGlob(argv["glob"])) {
        const result = await runner.test(`${argv["program"]} ${file}`)
        await result.snapshot(file + ".out")
      }
    }
  }
}
